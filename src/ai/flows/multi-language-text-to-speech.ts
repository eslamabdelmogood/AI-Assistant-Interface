'use server';

/**
 * @fileOverview Converts text to speech in multiple languages.
 *
 * - textToSpeech - A function that converts text to speech, selecting an appropriate voice.
 */

import { ai } from '@/ai/genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';
import { TextToSpeechInput, TextToSpeechOutput, TextToSpeechInputSchema, TextToSpeechOutputSchema } from '@/ai/schemas/text-to-speech-schemas';

// A map of languages to a recommended high-quality voice.
// You can find a list of all available voices here: https://cloud.google.com/vertex-ai/docs/generative-ai/speech/text-to-speech-voices
const languageToVoice: Record<string, string> = {
  'en': 'Puck',       // English
  'es': 'Chitra',     // Spanish
  'fr': 'Chitra',     // French
  'de': 'Puck',       // German
  'it': 'Chitra',     // Italian
  'pt': 'Puck',       // Portuguese
  'ru': 'Chitra',     // Russian
  'ja': 'Himari',     // Japanese
  'ko': 'Chitra',     // Korean
  'zh': 'Himari',     // Chinese
  'ar': 'Salim',      // Arabic
  'hi': 'Chitra',     // Hindi
  'default': 'Puck', // Default voice if language is not found
};

function getVoiceForLanguage(languageCode?: string): string {
  if (!languageCode) {
    return languageToVoice['default'];
  }
  // Extract the primary language subtag (e.g., 'en' from 'en-US')
  const primaryLanguage = languageCode.split('-')[0];
  return languageToVoice[primaryLanguage] || languageToVoice['default'];
}

export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'multiLanguageTextToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text, languageCode }) => {
    const voiceName = getVoiceForLanguage(languageCode);

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
      prompt: text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      audio: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);
