import { z } from 'zod';

/**
 * @fileOverview Schemas for text-to-speech flow.
 *
 * - TextToSpeechInputSchema - The Zod schema for the textToSpeech function input.
 * - TextToSpeechInput - The TypeScript type for the textToSpeech function input.
 * - TextToSpeechOutputSchema - The Zod schema for the textToSpeech function output.
 * - TextToSpeechOutput - The TypeScript type for the textToSpeech function output.
 */

export const TextToSpeechInputSchema = z.object({
  text: z.string().describe("The text to convert to speech."),
  languageCode: z.string().optional().describe("The IETF language tag for the text (e.g., 'en-US', 'es-ES'). If not provided, 'en-US' will be used as a default."),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export const TextToSpeechOutputSchema = z.object({
  audio: z.string().describe("The base64 encoded audio file in WAV format."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;
