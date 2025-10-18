'use server';

import { getPredictiveMaintenanceInsights, type PredictiveMaintenanceInsightsInput } from '@/ai/flows/predictive-maintenance-insights';
import { getRealTimeDiagnostics, type RealTimeDiagnosticsInput } from '@/ai/flows/real-time-diagnostics-from-sensor-data';

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
