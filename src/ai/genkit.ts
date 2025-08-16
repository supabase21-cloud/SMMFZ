import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({
    // apiKey is not needed when running on Vercel with authentication
  })],
  model: 'googleai/gemini-2.0-flash',
});
