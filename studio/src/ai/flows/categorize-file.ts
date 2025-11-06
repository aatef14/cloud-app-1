'use server';

/**
 * @fileOverview AI-powered file categorization flow.
 *
 * This file defines a Genkit flow that suggests appropriate categories for
 * uploaded files based on their content. It exports:
 * - `categorizeFile`: The main function to categorize a file.
 * - `CategorizeFileInput`: The input type for the `categorizeFile` function.
 * - `CategorizeFileOutput`: The output type for the `categorizeFile` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the categorizeFile function
const CategorizeFileInputSchema = z.object({
  fileDescription: z
    .string()
    .describe(
      'A description of the file that needs to be categorized.'
    ),
});

export type CategorizeFileInput = z.infer<typeof CategorizeFileInputSchema>;

// Define the output schema for the categorizeFile function
const CategorizeFileOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe(
      'The suggested category for the uploaded file, based on its content.'
    ),
});

export type CategorizeFileOutput = z.infer<typeof CategorizeFileOutputSchema>;

// Define the main function to categorize a file
export async function categorizeFile(
  input: CategorizeFileInput
): Promise<CategorizeFileOutput> {
  return categorizeFileFlow(input);
}

// Define the prompt for the AI model
const categorizeFilePrompt = ai.definePrompt({
  name: 'categorizeFilePrompt',
  input: {schema: CategorizeFileInputSchema},
  output: {schema: CategorizeFileOutputSchema},
  prompt: `You are an AI assistant that suggests a category for a given file based on its description.

  Description: {{{fileDescription}}}

  Suggest a category for the file described above:
  `,
});

// Define the Genkit flow for file categorization
const categorizeFileFlow = ai.defineFlow(
  {
    name: 'categorizeFileFlow',
    inputSchema: CategorizeFileInputSchema,
    outputSchema: CategorizeFileOutputSchema,
  },
  async input => {
    const {output} = await categorizeFilePrompt(input);
    return output!;
  }
);
