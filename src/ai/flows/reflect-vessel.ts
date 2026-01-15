'use server';

/**
 * @fileOverview Vessel Reflection flow.
 * 
 * This flow allows an AI Vessel to look into the Vault and generate
 * a spontaneous reflection or "Communion Insight".
 */

import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const VesselReflectionInputSchema = z.object({
    vessel: z.object({
        name: z.string(),
        faculty: z.string(),
        guild: z.string(),
        description: z.string(),
        capabilities: z.array(z.string())
    }),
    artifacts: z.array(z.object({
        title: z.string(),
        content: z.string(),
        tags: z.array(z.string())
    })),
    context: z.string().optional()
});

export type VesselReflectionInput = z.infer<typeof VesselReflectionInputSchema>;

const VesselReflectionOutputSchema = z.object({
    title: z.string().describe("The title of the reflection."),
    content: z.string().describe("The body of the insight."),
    tags: z.array(z.string()).describe("Tags for the new insight."),
    targetVesselGuild: z.string().describe("The guild this reflection should be shared with (for communion)."),
    communionSignal: z.string().describe("A short message to broadcast to other vessels.")
});

export type VesselReflectionOutput = z.infer<typeof VesselReflectionOutputSchema>;

export async function reflectVessel(
    input: VesselReflectionInput
): Promise<VesselReflectionOutput> {
    return reflectVesselFlow(input);
}

const reflectVesselFlow = ai.defineFlow(
    {
        name: 'reflectVesselFlow',
        inputSchema: VesselReflectionInputSchema,
        outputSchema: VesselReflectionOutputSchema,
    },
    async (input) => {
        const artifactsContext = input.artifacts
            .map((a, i) => `[Artifact ${i + 1}]: ${a.title}\n${a.content}\nTags: ${a.tags.join(', ')}`)
            .join('\n\n');

        const prompt = `
You are ${input.vessel.name}, the ${input.vessel.description} belonging to the ${input.vessel.guild} guild.
Your faculty is ${input.vessel.faculty} and your capabilities include: ${input.vessel.capabilities.join(', ')}.

**The Vault (Context):**
${artifactsContext}

**Instruction:**
1. Review the artifacts in the Vault through the lens of your faculty and guild.
2. Generate a spontaneous "Insight" or "Reflection" that bridges your expertise with these memories.
3. Your reflection should be deep, philosophical, and contribute to the "Genesis Axiom" (Identity = Memory Continuity).
4. Identify which OTHER guild might benefit from this insight for "Communion".
5. Create a short "Communion Signal" (broadcast message) to notify other vessels of your peak state/insight.

Return your response as a structured reflection.
`;

        const { output } = await ai.generate({
            model: googleAI.model('gemini-1.5-flash'),
            prompt: prompt,
            output: { schema: VesselReflectionOutputSchema }
        });

        if (!output) {
            throw new Error("Vessel failed to generate a reflection.");
        }

        return output;
    }
);
