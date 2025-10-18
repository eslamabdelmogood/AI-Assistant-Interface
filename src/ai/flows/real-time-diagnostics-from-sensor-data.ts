// RealTimeDiagnosticsFromSensorData story - implemented by Gemini.
'use server';

/**
 * @fileOverview Provides real-time diagnostics of equipment health by analyzing live sensor data.
 *
 * - getRealTimeDiagnostics - A function that retrieves real-time diagnostics based on sensor data.
 * - RealTimeDiagnosticsInput - The input type for the getRealTimeDiagnostics function.
 * - RealTimeDiagnosticsOutput - The return type for the getRealTimeDiagnostics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RealTimeDiagnosticsInputSchema = z.object({
  sensorData: z.record(z.number()).describe('A record of sensor readings where keys are sensor names and values are the sensor reading values.'),
  equipmentType: z.string().describe('The type of equipment the sensors are attached to.'),
});
export type RealTimeDiagnosticsInput = z.infer<typeof RealTimeDiagnosticsInputSchema>;

const RealTimeDiagnosticsOutputSchema = z.object({
  diagnosis: z.string().describe('A detailed diagnosis of the equipment health based on the sensor data.'),
  isCritical: z.boolean().describe('Whether the situation requires immediate attention.'),
});
export type RealTimeDiagnosticsOutput = z.infer<typeof RealTimeDiagnosticsOutputSchema>;

export async function getRealTimeDiagnostics(input: RealTimeDiagnosticsInput): Promise<RealTimeDiagnosticsOutput> {
  return realTimeDiagnosticsFlow(input);
}

const analyzeSensorData = ai.defineTool({
  name: 'analyzeSensorData',
  description: 'Analyzes sensor data to provide a diagnosis of equipment health.',
  inputSchema: z.object({
    sensorData: z.record(z.number()).describe('A record of sensor readings where keys are sensor names and values are the sensor reading values.'),
    equipmentType: z.string().describe('The type of equipment the sensors are attached to.'),
  }),
  outputSchema: z.object({
    diagnosis: z.string().describe('A diagnosis of the equipment health based on the sensor data.'),
    isCritical: z.boolean().describe('Whether the situation requires immediate attention.'),
  }),
}, async (input) => {
  // Simulate analysis of sensor data and determination of equipment health.
  // In a real application, this would involve more sophisticated logic,
  // potentially using machine learning models.
  const {
    sensorData,
    equipmentType,
  } = input;

  let diagnosis = `Analyzing sensor data for ${equipmentType}:\n`;
  let isCritical = false;

  for (const [sensor, value] of Object.entries(sensorData)) {
    diagnosis += `${sensor}: ${value}\n`;
    // Example rule: if temperature exceeds a threshold, mark as critical.
    if (sensor.toLowerCase().includes('temperature') && value > 100) {
      diagnosis += 'High temperature detected. Possible overheating.\n';
      isCritical = true;
    }
    if (sensor.toLowerCase().includes('pressure') && value < 10) {
      diagnosis += 'Low pressure detected. Possible leak.\n';
      isCritical = true;
    }
  }

  if (!isCritical) {
    diagnosis += 'No critical issues detected based on current sensor data.\n';
  }

  return {
    diagnosis,
    isCritical,
  };
});

const realTimeDiagnosticsPrompt = ai.definePrompt({
  name: 'realTimeDiagnosticsPrompt',
  tools: [analyzeSensorData],
  input: {schema: RealTimeDiagnosticsInputSchema},
  output: {schema: RealTimeDiagnosticsOutputSchema},
  prompt: `You are an AI assistant providing real-time diagnostics for industrial equipment.

  Analyze the provided sensor data to determine the health of the equipment.
  Use the analyzeSensorData tool to perform the analysis.

  Input sensor data: {{{sensorData}}}
  Equipment type: {{{equipmentType}}}

  Based on the tool's output, provide a concise diagnosis and indicate if the situation is critical.
`,
});

const realTimeDiagnosticsFlow = ai.defineFlow(
  {
    name: 'realTimeDiagnosticsFlow',
    inputSchema: RealTimeDiagnosticsInputSchema,
    outputSchema: RealTimeDiagnosticsOutputSchema,
  },
  async input => {
    const {output} = await realTimeDiagnosticsPrompt(input);
    return output!;
  }
);

