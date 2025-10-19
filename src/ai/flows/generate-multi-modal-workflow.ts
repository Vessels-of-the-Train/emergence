'use server';

/**
 * @fileOverview Multi-modal content integration and workflow management.
 *
 * This flow helps users work with different content types (text, images, videos, audio)
 * in unified workflows, enabling better content analysis, transformation, and synthesis.
 *
 * Features:
 * - Content type detection and analysis
 * - Cross-modal content transformation
 * - Multi-modal project workflows
 * - Content synthesis and combination
 * - Intelligent content recommendations
 *
 * - generateMultiModalWorkflow - Main function for multi-modal integration
 * - GenerateMultiModalWorkflowInput - Input schema for the flow
 * - GenerateMultiModalWorkflowOutput - Output schema for the flow
 */

import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateMultiModalWorkflowInputSchema = z.object({
  projectGoals: z.string().describe('Overall project objectives and desired outcomes.'),
  contentTypes: z.array(z.enum(['text', 'image', 'video', 'audio', 'document'])).describe('Types of content to integrate.'),
  existingContent: z.string().optional().describe('Description of existing content and assets.'),
  targetPlatform: z.string().optional().describe('Target platform or medium for the final output.'),
  userPreferences: z.string().optional().describe('User preferences for content style and approach.'),
});

export type GenerateMultiModalWorkflowInput = z.infer<typeof GenerateMultiModalWorkflowInputSchema>;

const GenerateMultiModalWorkflowOutputSchema = z.object({
  workflowOverview: z.string().describe('High-level workflow strategy and approach.'),
  contentStrategy: z.object({
    contentTypes: z.array(z.object({
      type: z.string(),
      role: z.string(),
      processingSteps: z.array(z.string()),
      integrationPoints: z.array(z.string()),
    })),
    crossModalInteractions: z.array(z.object({
      fromType: z.string(),
      toType: z.string(),
      transformation: z.string(),
      rationale: z.string(),
    })),
  }),
  technicalImplementation: z.object({
    requiredTools: z.array(z.string()),
    processingPipeline: z.array(z.object({
      stage: z.string(),
      inputTypes: z.array(z.string()),
      outputTypes: z.array(z.string()),
      tools: z.array(z.string()),
    })),
    integrationPoints: z.array(z.object({
      component: z.string(),
      contentTypes: z.array(z.string()),
      integrationMethod: z.string(),
    })),
  }),
  contentGeneration: z.object({
    textContent: z.string().optional(),
    imagePrompts: z.array(z.string()).optional(),
    videoConcepts: z.array(z.string()).optional(),
    audioIdeas: z.array(z.string()).optional(),
  }),
  workflowSteps: z.array(z.object({
    step: z.number(),
    title: z.string(),
    description: z.string(),
    inputRequirements: z.array(z.string()),
    expectedOutput: z.string(),
    estimatedTime: z.string(),
  })),
  successMetrics: z.array(z.string()),
  potentialChallenges: z.array(z.object({
    challenge: z.string(),
    mitigation: z.string(),
    alternatives: z.array(z.string()),
  })),
});

export type GenerateMultiModalWorkflowOutput = z.infer<typeof GenerateMultiModalWorkflowOutputSchema>;

export async function generateMultiModalWorkflow(
  input: GenerateMultiModalWorkflowInput
): Promise<GenerateMultiModalWorkflowOutput> {
  return generateMultiModalWorkflowFlow(input);
}

const generateMultiModalWorkflowPrompt = ai.definePrompt({
  name: 'generateMultiModalWorkflowPrompt',
  input: { schema: GenerateMultiModalWorkflowInputSchema },
  output: { schema: GenerateMultiModalWorkflowOutputSchema },
  prompt: `You are a creative director and multi-modal content strategist. Help design an integrated workflow for the following project:

**Project Goals:**
{{{projectGoals}}}

**Content Types to Integrate:**
{{#each contentTypes}}{{this}}, {{/each}}

**Existing Content:**
{{#if existingContent}}{{{existingContent}}}{{else}}No existing content specified{{/if}}

**Target Platform:**
{{#if targetPlatform}}{{{targetPlatform}}}{{else}}Multi-platform deployment{{/if}}

**User Preferences:**
{{#if userPreferences}}{{{userPreferences}}}{{else}}Standard professional quality{{/if}}

**Design Requirements:**

1. **Workflow Strategy**: Create a cohesive strategy for integrating multiple content types
2. **Content Strategy**: Define roles and interactions between different content types
3. **Technical Implementation**: Specify tools, pipelines, and integration points
4. **Content Generation**: Provide specific content ideas and prompts for each type
5. **Step-by-Step Workflow**: Create a detailed, actionable workflow plan
6. **Success Metrics**: Define how to measure workflow success
7. **Challenge Management**: Identify potential issues and solutions

**Integration Principles:**
- Ensure seamless content type transitions
- Maintain consistent messaging across modalities
- Optimize for the target platform's strengths
- Consider user experience across all content types
- Balance creative freedom with technical feasibility

**Output Structure:**
Provide a comprehensive multi-modal workflow that addresses all content types while maintaining coherence and achieving the project goals.`,
});

const generateMultiModalWorkflowFlow = ai.defineFlow(
  {
    name: 'generateMultiModalWorkflowFlow',
    inputSchema: GenerateMultiModalWorkflowInputSchema,
    outputSchema: GenerateMultiModalWorkflowOutputSchema,
  },
  async (input) => {
    const { output } = await generateMultiModalWorkflowPrompt(input, {
      model: googleAI.model('gemini-1.5-flash')
    });

    if (!output) {
      throw new Error("Failed to generate multi-modal workflow. The AI response was incomplete.");
    }

    return output;
  }
);
