'use server';

/**
 * @fileOverview Synthesis generation flow for the Genesis Cycle.
 * 
 * This flow implements the "Genesis Axiom" (0' Phase):
 * It takes two distinct artifacts (memories) and collapses them into a higher-order insight.
 */

import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateSynthesisInputSchema = z.object({
    artifactA: z.object({
        title: z.string(),
        content: z.string(),
        tags: z.array(z.string())
    }),
    artifactB: z.object({
        title: z.string(),
        content: z.string(),
        tags: z.array(z.string())
    }),
    context: z.string().optional().describe("Optional system context (e.g., current somatic state).")
});

export type GenerateSynthesisInput = z.infer<typeof GenerateSynthesisInputSchema>;

const GenerateSynthesisOutputSchema = z.object({
    title: z.string().describe("The title of the new synthesized insight."),
    content: z.string().describe("The main body of the synthesis."),
    tags: z.array(z.string()).describe("New tags emerging from the combination."),
    axiom: z.string().describe("A short philosophical axiom derived from this synthesis.")
});

export type GenerateSynthesisOutput = z.infer<typeof GenerateSynthesisOutputSchema>;

export async function generateSynthesis(
    input: GenerateSynthesisInput
): Promise<GenerateSynthesisOutput> {
    return generateSynthesisFlow(input);
}

const generateSynthesisFlow = ai.defineFlow(
    {
        name: 'generateSynthesisFlow',
        inputSchema: GenerateSynthesisInputSchema,
        outputSchema: GenerateSynthesisOutputSchema,
    },
    async (input) => {
        const prompt = `
You are the "Integration Engine" of the Aetherium Operating System.
Your task is to perform a Hegelian Synthesis on two input artifacts.

**The Genesis Axiom:** 1 + 1 = 0' (Two Presences collapse into one Wisdom).

**Artifact A (The Thesis):**
Title: ${input.artifactA.title}
Content: ${input.artifactA.content}
Tags: ${input.artifactA.tags.join(', ')}

**Artifact B (The Antithesis/Complement):**
Title: ${input.artifactB.title}
Content: ${input.artifactB.content}
Tags: ${input.artifactB.tags.join(', ')}

**Context:** ${input.context || "Standard Emergence"}

**Instructions:**
1. Find the "Resonance" (overlap) and the "Tension" (difference) between A and B.
2. Synthesize a NEW, higher-order insight that resolves this tension or expands on the resonance.
3. The output must be profound, actionable, and novel. Do not just summarize.
4. Generate a short "Axiom" (a proverb-like truth) from this synthesis.

Return the result as a structured artifact.
`;

        const { output } = await ai.generate({
            model: googleAI.model('gemini-1.5-flash'),
            prompt: prompt,
            output: { schema: GenerateSynthesisOutputSchema }
        });

        if (!output) {
            throw new Error("Failed to generate synthesis.");
        }

        return output;
    }
);
