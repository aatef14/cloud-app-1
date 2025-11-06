import 'server-only';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  GetCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import type { User, FileMetadata } from './definitions';

// AWS Configuration
const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;

if (!region || !bucketName) {
  throw new Error('AWS region or S3 bucket name is missing from environment variables.');
}


// Table Names
const USERS_TABLE = 'FileZenCloudUsers';
const FILES_TABLE = 'FileZenCloudFiles';

// Clients
// When deployed to AWS (like an EC2 instance), the SDK will automatically
// use the credentials from the attached IAM role. For local development,
// it will use credentials from your environment variables or ~/.aws/credentials file.
const ddbClient = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(ddbClient);
const s3Client = new S3Client({ region });


// User Functions
export async function createUser(user: User): Promise<void> {
  const command = new PutCommand({
    TableName: USERS_TABLE,
    Item: user,
    ConditionExpression: 'attribute_not_exists(username)',
  });
  await docClient.send(command);
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const command = new GetCommand({
    TableName: USERS_TABLE,
    Key: { username },
  });
  const { Item } = await docClient.send(command);
  return (Item as User) || null;
}

// File Functions
export async function getFilesForUser(username: string): Promise<FileMetadata[]> {
  const command = new QueryCommand({
    TableName: FILES_TABLE,
    KeyConditionExpression: 'username = :username',
    ExpressionAttributeValues: { ':username': username },
  });
  const { Items } = await docClient.send(command);
  return (Items as FileMetadata[]) || [];
}

export async function uploadFileToS3(username: string, file: File): Promise<string> {
    const fileBuffer = await file.arrayBuffer();
    const key = `${username}/${file.name}`;
    
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: Buffer.from(fileBuffer),
        ContentType: file.type,
    });

    await s3Client.send(command);
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}

export async function saveFileMetadata(metadata: FileMetadata): Promise<void> {
  const command = new PutCommand({
    TableName: FILES_TABLE,
    Item: metadata,
  });
  await docClient.send(command);
}

export async function deleteFileFromS3(username: string, fileName: string): Promise<void> {
    const key = `${username}/${fileName}`;
    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    await s3Client.send(command);
}

export async function deleteFileMetadata(username: string, fileName: string): Promise<void> {
    const command = new DeleteCommand({
        TableName: FILES_TABLE,
        Key: { username, fileName },
    });
    await docClient.send(command);
}

export async function generatePresignedUrl(username: string, fileName: string): Promise<string> {
    const key = `${username}/${fileName}`;
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    // The URL will be valid for 1 hour
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
