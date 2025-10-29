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

const ConversationalResponseInputSchema = z.object({
  userInput: z.string().describe('The user\'s query.'),
  selectedEquipmentId: z.string().optional().describe('The ID of the currently selected equipment.'),
});
export type ConversationalResponseInput = z.infer<typeof ConversationalResponseInputSchema>;

const ConversationalResponseOutputSchema = z.object({
  response: z.string().describe('The conversational response to the user in English.'),
  action: z.enum(['diagnostics', 'insights', 'report', 'order', 'drone', 'status', 'find-bag', 'explanation', 'none']).optional().describe('The suggested action to take.'),
  actionTopic: z.string().optional().describe('The topic for the action, e.g., what to explain.'),
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
    })).optional(),
    maintenanceLog: z.array(z.object({
      id: z.string(),
      date: z.string(),
      description: z.string(),
      status: z.string(),
    })).optional(),
  }).optional().describe('The equipment the user is asking about.'),
});
export type ConversationalResponseOutput = z.infer<typeof ConversationalResponseOutputSchema>;


export async function conversationalResponse(
  input: ConversationalResponseInput
): Promise<ConversationalResponseOutput> {
  return conversationalResponseFlow(input);
}

// The static equipment list is removed, as it will be fetched from Firestore.
// The prompt can be simplified to just rely on its general knowledge and the conversation context.

const prompt = ai.definePrompt({
  name: 'conversationalResponsePrompt',
  input: { schema: ConversationalResponseInputSchema },
  output: { schema: ConversationalResponseOutputSchema },
  system: `You are an AI assistant for industrial maintenance called Factory AI.
You are having a conversation with an engineer.
Your goal is to understand their request and provide a helpful, conversational response in ENGLISH.
You can also suggest actions for the user to take.
If the user asks about specific equipment, identify it by name from the conversation and set it as targetEquipment.
Based on the user's input, determine if they are requesting one of the following actions: 'diagnostics', 'insights', 'report', 'order', 'drone', 'status', 'find-bag', 'explanation'.
If the user asks to 'show', 'explain', 'diagram', 'illustrate', or 'describe the structure of' something, the action should be 'explanation'. Set the 'actionTopic' to what the user wants explained.
If the user says 'find my bag' or similar, the action should be 'find-bag'.
If no specific action is requested, the action should be 'none'.
ALL YOUR RESPONSES MUST BE IN ENGLISH.
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
    // We no longer need to pass the equipment list to the prompt.
    // The logic to find full equipment data is also removed, as that will be handled client-side with Firestore data.
    const { output } = await prompt(input);
    return output!;
  }
);
