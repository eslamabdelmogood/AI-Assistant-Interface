'use server';

/**
 * @fileOverview Provides actionable insights based on machine learning predictions.
 *
 * - getPredictiveMaintenanceInsights - A function that retrieves predictive maintenance insights.
 * - PredictiveMaintenanceInsightsInput - The input type for the getPredictiveMaintenanceInsights function.
 * - PredictiveMaintenanceInsightsOutput - The return type for the getPredictiveMaintenanceInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveMaintenanceInsightsInputSchema = z.object({
  equipmentId: z.string().describe('The ID of the equipment to analyze.'),
});
export type PredictiveMaintenanceInsightsInput = z.infer<typeof PredictiveMaintenanceInsightsInputSchema>;

const PredictiveMaintenanceInsightsOutputSchema = z.object({
  insights: z.string().describe('Actionable insights based on machine learning predictions.'),
});
export type PredictiveMaintenanceInsightsOutput = z.infer<typeof PredictiveMaintenanceInsightsOutputSchema>;

export async function getPredictiveMaintenanceInsights(
  input: PredictiveMaintenanceInsightsInput
): Promise<PredictiveMaintenanceInsightsOutput> {
  return predictiveMaintenanceInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictiveMaintenanceInsightsPrompt',
  input: {schema: PredictiveMaintenanceInsightsInputSchema},
  output: {schema: PredictiveMaintenanceInsightsOutputSchema},
  prompt: `You are an AI assistant that provides predictive maintenance insights for industrial equipment.

  Based on machine learning predictions for equipment with ID {{{equipmentId}}}, provide actionable insights to proactively schedule maintenance and minimize downtime.
  Focus on specific issues and recommended actions.
  Keep the insights concise and easy to understand for engineers.
  
  Output the insights in a clear, actionable format.
  `,
});

const predictiveMaintenanceInsightsFlow = ai.defineFlow(
  {
    name: 'predictiveMaintenanceInsightsFlow',
    inputSchema: PredictiveMaintenanceInsightsInputSchema,
    outputSchema: PredictiveMaintenanceInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
