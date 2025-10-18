'use server';

/**
 * @fileOverview Generates a visual explanation with an image and text.
 *
 * - getVisualExplanation - A function that generates an image and text description.
 */

import { ai } from '@/ai/genkit';
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

    const llmResponse = await ai.generate({
        prompt: `Provide a detailed, technical explanation for an engineer about the following topic: ${topic}. Focus on structure, components, or process.`,
    });
    
    const description = llmResponse.text;
    const imageUrl = '';

    if (!description) {
        throw new Error('Failed to generate visual explanation.');
    }

    return {
      description,
      imageUrl,
    };
  }
);
