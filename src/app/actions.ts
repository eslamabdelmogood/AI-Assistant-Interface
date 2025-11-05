'use server';

import { getPredictiveMaintenanceInsights, type PredictiveMaintenanceInsightsInput } from '@/ai/flows/predictive-maintenance-insights';
import { getRealTimeDiagnostics, type RealTimeDiagnosticsInput } from '@/ai/flows/real-time-diagnostics-from-sensor-data';
import { conversationalResponse, type ConversationalResponseInput } from '@/ai/flows/conversational-response';
import { textToSpeech as multiLanguageTextToSpeech } from '@/ai/flows/multi-language-text-to-speech';
import { TextToSpeechInput } from '@/ai/schemas/text-to-speech-schemas';

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

export async function textToSpeech(input: TextToSpeechInput) {
  try {
    const result = await multiLanguageTextToSpeech(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to convert text to speech.';
    return { success: false, error: errorMessage };
  }
}
