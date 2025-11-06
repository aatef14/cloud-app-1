'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession } from '@/lib/auth';
import {
  getUserByUsername,
  createUser,
  uploadFileToS3,
  saveFileMetadata,
  deleteFileFromS3,
  deleteFileMetadata,
  generatePresignedUrl,
} from '@/lib/aws';
import { categorizeFile } from '@/ai/flows/categorize-file';

// --- Auth Actions ---

const SignupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function signup(prevState: any, formData: FormData) {
  const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  try {
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return { message: 'Username already exists' };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await createUser({ username, passwordHash });
    await createSession(username);
  } catch (error) {
    console.error("Signup Action Failed:", error);
    return { message: 'Registration failed. Please try again.' };
  }

  redirect('/dashboard');
}

const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { message: 'Invalid form data' };
  }

  const { username, password } = validatedFields.data;

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return { message: 'Invalid username or password' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordsMatch) {
      return { message: 'Invalid username or password' };
    }

    await createSession(username);
  } catch (error) {
    console.error("Login Action Failed:", error);
    return { message: 'Login failed. Please try again.' };
  }

  redirect('/dashboard');
}

export async function logout() {
  deleteSession();
  redirect('/login');
}

// --- File Actions ---

const UploadFileSchema = z.object({
  file: z.instanceof(File).refine(file => file.size > 0, 'File is required.'),
  username: z.string(),
});

export async function uploadFile(prevState: any, formData: FormData) {
  const validatedFields = UploadFileSchema.safeParse({
    file: formData.get('file'),
    username: formData.get('username'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid file or user.',
    };
  }
  
  const { file, username } = validatedFields.data;

  if(file.size > 10 * 1024 * 1024) { // 10MB limit
    return { error: 'File size must be less than 10MB.' };
  }

  try {
    // 1. Get AI category
    const { suggestedCategory } = await categorizeFile({
      fileDescription: `Filename: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`,
    });

    // 2. Upload to S3
    const fileUrl = await uploadFileToS3(username, file);

    // 3. Save metadata to DynamoDB
    await saveFileMetadata({
      username,
      fileName: file.name,
      fileUrl,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      suggestedCategory,
    });

  } catch (error) {
    console.error('Upload failed:', error);
    return { error: 'File upload failed. Please try again.' };
  }
  
  return { success: 'File uploaded successfully.' };
}

export async function deleteFile(username: string, fileName: string) {
    try {
        await deleteFileFromS3(username, fileName);
        await deleteFileMetadata(username, fileName);
    } catch (error) {
        console.error('Delete failed:', error);
        return { error: 'File deletion failed.' };
    }

    revalidatePath('/dashboard');
    return { success: 'File deleted.' };
}

export async function shareFile(username: string, fileName: string) {
    try {
        const url = await generatePresignedUrl(username, fileName, 'getObject');
        return { url };
    } catch (error) {
        console.error('Share failed:', error);
        return { error: 'Could not generate share link.' };
    }
}

export async function downloadFile(username: string, fileName: string) {
  try {
    const url = await generatePresignedUrl(username, fileName, 'getObject');
    return { url };
  } catch (error) {
    console.error('Download failed:', error);
    return { error: 'Could not generate download link.' };
  }
}
