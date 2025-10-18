import { z } from 'zod';

/**
 * @fileOverview Schemas for the visual explanation flow.
 *
 * - VisualExplanationInputSchema - The Zod schema for the getVisualExplanation function input.
 * - VisualExplanationInput - The TypeScript type for the getVisualExplanation function input.
 * - VisualExplanationOutputSchema - The Zod schema for the getVisualExplanation function output.
 * - VisualExplanationOutput - The TypeScript type for the getVisualExplanation function output.
 */

export const VisualExplanationInputSchema = z.object({
  topic: z.string().describe('The topic to explain visually.'),
});
export type VisualExplanationInput = z.infer<typeof VisualExplanationInputSchema>;

export const VisualExplanationOutputSchema = z.object({
  description: z.string().describe('The detailed text explanation.'),
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type VisualExplanationOutput = z.infer<typeof VisualExplanationOutputSchema>;
