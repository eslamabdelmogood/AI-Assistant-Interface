'use server';

import { getPredictiveMaintenanceInsights, type PredictiveMaintenanceInsightsInput } from '@/ai/flows/predictive-maintenance-insights';
import { getRealTimeDiagnostics, type RealTimeDiagnosticsInput } from '@/ai/flows/real-time-diagnostics-from-sensor-data';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { TextToSpeechInput } from '@/ai/schemas/text-to-speech-schemas';
import { conversationalResponse, type ConversationalResponseInput } from '@/ai/flows/conversational-response';

export async function getConversationalResponse(input: ConversationalResponseInput) {
    try {
      const result = await conversationalResponse(input);
      return { success: true, data: result };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Failed to get conversational response.' };
    }
}

export async function getDiagnostics(input: RealTimeDiagnosticsInput) {
  try {
    const result = await getRealTimeDiagnostics(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get real-time diagnostics.' };
  }
}

export async function getInsights(input: PredictiveMaintenanceInsightsInput) {
  try {
    const result = await getPredictiveMaintenanceInsights(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get predictive insights.' };
  }
}

export async function getSpeech(input: TextToSpeechInput) {
  try {
    const result = await textToSpeech(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate speech.' };
  }
}
