import { z } from 'zod';

/**
 * @fileOverview Schemas for text-to-speech flow.
 *
 * - TextToSpeechInputSchema - The Zod schema for the textToSpeech function input.
 * - TextToSpeechInput - The TypeScript type for the textToSpeech function input.
 * - TextToSpeechOutputSchema - The Zod schema for the textToSpeech function output.
 * - TextToSpeechOutput - The TypeScript type for the textToSpeech function output.
 */

export const TextToSpeechInputSchema = z.string();
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export const TextToSpeechOutputSchema = z.object({
  audio: z.string().describe("The base64 encoded audio file."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;
