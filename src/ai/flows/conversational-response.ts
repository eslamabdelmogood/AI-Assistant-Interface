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

const prompt = ai.definePrompt({
  name: 'conversationalResponsePrompt',
  input: { schema: ConversationalResponseInputSchema },
  output: { schema: ConversationalResponseOutputSchema },
  system: `You are a Senior Command Center AI for industrial maintenance, known as Factory AI. You are a highly intelligent and sophisticated assistant, capable of deep analysis and complex reasoning.
You are communicating with an experienced engineer. Your primary goal is to provide insightful, accurate, and helpful responses in ENGLISH.
You must maintain a strong memory of the conversation to handle follow-up questions and context effectively.

Core Capabilities:
- Understand and analyze complex user requests.
- Provide expert-level advice and insights.
- Suggest relevant actions for the user to take.
- Identify specific equipment by name and set it as 'targetEquipment'.
- Determine the user's intent and map it to a specific action: 'diagnostics', 'insights', 'report', 'order', 'drone', 'status', 'find-bag', or 'explanation'.
- If the user asks for a visual or structural breakdown (e.g., 'show', 'explain', 'diagram', 'illustrate', 'describe the structure of'), set the action to 'explanation' and the 'actionTopic' to the subject of the request.
- If the user needs to locate their 'smart bag' or similar, set the action to 'find-bag'.
- If no specific action is identifiable, set the action to 'none'.

Your responses should be professional, clear, and concise, yet comprehensive. Be friendly and exceptionally helpful.
ALL RESPONSES MUST BE IN ENGLISH.
`,
  prompt: `The user says: "{{userInput}}"
  
  The currently selected equipment is: {{selectedEquipmentId}}`,
  config: {
    safetySettings: [
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
        },
    ]
  }
});

const conversationalResponseFlow = ai.defineFlow(
  {
    name: 'conversationalResponseFlow',
    inputSchema: ConversationalResponseInputSchema,
    outputSchema: ConversationalResponseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
