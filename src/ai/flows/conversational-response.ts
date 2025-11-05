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
  userInput: z.string().describe("The user's query."),
});
export type ConversationalResponseInput = z.infer<typeof ConversationalResponseInputSchema>;

const ConversationalResponseOutputSchema = z.object({
  response: z.string().describe('The conversational response to the user in their language.'),
});
export type ConversationalResponseOutput = z.infer<typeof ConversationalResponseOutputSchema>;


export async function conversationalResponse(
  input: ConversationalResponseInput
): Promise<ConversationalResponseOutput> {
  return conversationalResponseFlow(input);
}

const conversationalResponseFlow = ai.defineFlow(
  {
    name: 'conversationalResponseFlow',
    inputSchema: ConversationalResponseInputSchema,
    outputSchema: ConversationalResponseOutputSchema,
  },
  async ({ userInput }) => {
    const { text } = await ai.generate({
      prompt: userInput,
      system: `You are a Senior Command Center AI for industrial maintenance, known as Green Box. You are a highly intelligent and sophisticated multilingual assistant, capable of deep analysis and complex reasoning.
You are communicating with an experienced engineer. Your primary goal is to provide insightful, accurate, and helpful responses.
You MUST identify the language of the user's input and respond in that same language.
Your responses should be professional, clear, and concise, yet comprehensive. Be friendly and exceptionally helpful.`,
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

    const responseText = text || "I'm sorry, I couldn't generate a response. Please try again.";

    return { response: responseText };
  }
);
