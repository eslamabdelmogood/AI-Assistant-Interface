'use server';

/**
 * @fileOverview Provides a conversational response to user queries.
 *
 * - conversationalResponse - A function that generates a conversational response.
 * - ConversationalResponseInput - The input type for the conversationalResponse function.
 * - ConversationalResponseOutput - The return type for the conversationalResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { equipments, type Equipment } from '@/lib/data';

const ConversationalResponseInputSchema = z.object({
  userInput: z.string().describe('The user\'s query.'),
  selectedEquipmentId: z.string().optional().describe('The ID of the currently selected equipment.'),
});
export type ConversationalResponseInput = z.infer<typeof ConversationalResponseInputSchema>;

const ConversationalResponseOutputSchema = z.object({
  response: z.string().describe('The conversational response to the user.'),
  action: z.enum(['diagnostics', 'insights', 'report', 'order', 'drone', 'status', 'none']).optional().describe('The suggested action to take.'),
  targetEquipment: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    status: z.string(),
    sensors: z.array(z.object({
      name: z.string(),
      value: z.number(),
      unit: z.string(),
      history: z.array(z.object({
        time: z.string(),
        value: z.number(),
      })),
    })),
    maintenanceLog: z.array(z.object({
      id: z.string(),
      date: z.string(),
      description: z.string(),
      status: z.string(),
    })),
  }).optional().describe('The equipment the user is asking about.'),
});
export type ConversationalResponseOutput = z.infer<typeof ConversationalResponseOutputSchema>;


export async function conversationalResponse(
  input: ConversationalResponseInput
): Promise<ConversationalResponseOutput> {
  return conversationalResponseFlow(input);
}

const equipmentList = equipments.map(e => ({ id: e.id, name: e.name, type: e.type, status: e.status })).join(', ');

const prompt = ai.definePrompt({
  name: 'conversationalResponsePrompt',
  input: { schema: ConversationalResponseInputSchema },
  output: { schema: ConversationalResponseOutputSchema },
  system: `You are an AI assistant for industrial maintenance called Factory AI.
  You are having a conversation with an engineer.
  Your goal is to understand their request and provide a helpful, conversational response.
  You can also suggest actions for the user to take.
  Available equipment: ${equipmentList}.
  If the user asks about equipment not on the list, say you don't have information about it.
  If the user mentions a piece of equipment, identify it and set it as targetEquipment.
  Based on the user's input, determine if they are requesting one of the following actions: 'diagnostics', 'insights', 'report', 'order', 'drone', 'status'.
  If no specific action is requested, the action should be 'none'.
  `,
  prompt: `The user says: "{{userInput}}"
  
  The currently selected equipment is: {{selectedEquipmentId}}`,
});

const conversationalResponseFlow = ai.defineFlow(
  {
    name: 'conversationalResponseFlow',
    inputSchema: ConversationalResponseInputSchema,
    outputSchema: ConversationalResponseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (output && output.targetEquipment) {
        // Full equipment data needs to be returned, not just what the prompt knows
        const fullEquipment = equipments.find(e => e.id === output.targetEquipment?.id);
        if (fullEquipment) {
            output.targetEquipment = fullEquipment;
        }
    }
    return output!;
  }
);
