import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Initializes the Genkit framework and exports the configured `ai` object.
 */
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});