'use server';

/**
 * @fileOverview Generates a visual explanation with an image and text.
 *
 * - getVisualExplanation - A function that generates an image and text description.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { VisualExplanationInputSchema, VisualExplanationOutputSchema, type VisualExplanationInput, type VisualExplanationOutput } from '@/ai/schemas/visual-explanation-schemas';


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

    const [llmResponse, imageResponse] = await Promise.all([
        ai.generate({
            prompt: `Provide a detailed, technical explanation for an engineer about the following topic: ${topic}. Focus on structure, components, or process.`,
        }),
        ai.generate({
            model: googleAI.model('imagen-4.0-fast-generate-001'),
            prompt: `Generate a clear, technical diagram or illustration of the following topic for a factory setting: ${topic}. The image should be in the style of a blueprint or technical drawing, with clear labels and a clean background.`,
        })
    ]);
    
    const description = llmResponse.text;
    const imageUrl = imageResponse.media.url;

    if (!description || !imageUrl) {
        throw new Error('Failed to generate visual explanation.');
    }

    return {
      description,
      imageUrl,
    };
  }
);
