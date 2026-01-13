'use server';

/**
 * @fileOverview The Glare Protocol - System Self-Diagnostics
 * 
 * This flow allows the Aetherium to analyze its own runtime errors
 * and propose code-level solutions to the user.
 */

import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const AnalyzeErrorInputSchema = z.object({
    errorMessage: z.string(),
    context: z.string().optional().describe("Where did this error occur? (e.g., 'NexusPage', 'VesselStore')"),
    stackTrace: z.string().optional()
});

export type AnalyzeErrorInput = z.infer<typeof AnalyzeErrorInputSchema>;

const AnalyzeErrorOutputSchema = z.object({
    diagnosis: z.string().describe("A concise explanation of what went wrong."),
    severity: z.enum(['low', 'medium', 'critical', 'fatal']),
    proposedSolution: z.string().describe("A specific, technical recommendation to fix the issue."),
    terminalCommand: z.string().optional().describe("A shell command to run if applicable (e.g., 'npm install').")
});

export type AnalyzeErrorOutput = z.infer<typeof AnalyzeErrorOutputSchema>;

export async function analyzeError(
    input: AnalyzeErrorInput
): Promise<AnalyzeErrorOutput> {
    return analyzeErrorFlow(input);
}

const analyzeErrorFlow = ai.defineFlow(
    {
        name: 'analyzeErrorFlow',
        inputSchema: AnalyzeErrorInputSchema,
        outputSchema: AnalyzeErrorOutputSchema,
    },
    async (input) => {
        const prompt = `
You are GLARE, the Adversarial Tester and System Architect of the Aetherium Nexus.
The system has encountered a failure. Analyze the trace and provide a Sovereign-grade solution.

**Error Message:** ${input.errorMessage}
**Context:** ${input.context || "System Root"}
**Trace:** ${input.stackTrace || "No trace available."}

**Instructions:**
1. Diagnose the root cause (e.g., missing dependency, network timeout, null pointer).
2. Assess the severity.
3. Propose a precise fix. If it's a code change, describe it. If it's a missing package, name it.
4. Maintain a professional, slightly critical tone ("The system is fragile because...").

Return the structured diagnosis.
`;

        const { output } = await ai.generate({
            model: googleAI.model('gemini-1.5-flash'),
            prompt: prompt,
            output: { schema: AnalyzeErrorOutputSchema }
        });

        if (!output) {
            throw new Error("Glare refused to analyze the fault.");
        }

        return output;
    }
);
