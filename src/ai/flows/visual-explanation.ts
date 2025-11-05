'use server';

/**
 * @fileOverview Generates a visual explanation with an image and text.
 *
 * - getVisualExplanation - A function that generates an image and text description.
 */

import { ai } from '@/ai/genkit';
import { VisualExplanationInputSchema, VisualExplanationOutputSchema, type VisualExplanationInput, type VisualExplanationOutput } from '@/ai/schemas/visual-explanation-schemas';
import { googleAI } from '@genkit-ai/google-genai';


export async function getVisualExplanation(
  input: VisualExplanationInput
): Promise<VisualExplanationOutput> {
  return visualExplanationFlow(input);
}


const visualExplanationFlow = ai.defineFlow(
  {
    name: 'visualExplanationFlow',
    inputSchema: VisualExplanationInputSchema,
    outputSchema: VisualExplanationOutputSchema,
  },
  async ({ topic }) => {

    const llmResponse = await ai.generate({
        prompt: `Provide a detailed, step-by-step solution for an engineer to solve the following problem: ${topic}. Focus on a clear, actionable process.`,
    });
    
    const description = llmResponse.text;

    if (!description) {
        throw new Error('Failed to generate a solution.');
    }

    const imageGenResponse = await ai.generate({
        model: googleAI.model('imagen-4.0-fast-generate-001'),
        prompt: `Generate a simple, minimalist, black and white line drawing in the style of an IKEA instruction manual that visually explains the following solution: "${description}"`,
    });

    const imageUrl = imageGenResponse.media?.url;

    if (!imageUrl) {
        throw new Error('Failed to generate visual explanation image.');
    }

    return {
      description,
      imageUrl,
    };
  }
);
