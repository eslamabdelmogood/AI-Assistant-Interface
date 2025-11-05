'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/predictive-maintenance-insights.ts';
import '@/ai/flows/real-time-diagnostics-from-sensor-data.ts';
import '@/ai/flows/conversational-response.ts';
import '@/ai/flows/multi-language-text-to-speech.ts';
