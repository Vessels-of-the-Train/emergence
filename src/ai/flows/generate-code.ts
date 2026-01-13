'use server';

/**
 * @fileOverview Advanced code generation flow for Aetherium.
 *
 * This flow generates complete, functional code components based on analysis reports,
 * user requirements, and best practices for both frontend and backend development.
 *
 * - generateCode - Main function for code generation
 * - GenerateCodeInput - Input schema for the flow
 * - GenerateCodeOutput - Output schema for the flow
 */

import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateCodeInputSchema = z.object({
  analysisReport: z.string().describe('The comprehensive analysis report of the project.'),
  componentType: z.enum(['frontend', 'backend', 'fullstack']).describe('Type of component to generate.'),
  requirements: z.string().describe('Specific requirements and functionality needed.'),
  technology: z.string().optional().describe('Technology stack preference (e.g., React, Next.js, Node.js, Python).'),
  existingCode: z.string().optional().describe('Existing code context to build upon.'),
});

export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  generatedCode: z.string().describe('The complete, functional code for the requested component.'),
  explanation: z.string().describe('Explanation of the generated code and how it fits the requirements.'),
  dependencies: z.array(z.string()).describe('List of dependencies needed for the generated code.'),
  nextSteps: z.array(z.string()).describe('Recommended next steps for integration and testing.'),
});

export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(
  input: GenerateCodeInput
): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const generateCodePrompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: { schema: GenerateCodeInputSchema },
  output: { schema: GenerateCodeOutputSchema },
  prompt: `You are an expert software architect and senior full-stack developer. Based on the following information, generate complete, production-ready code:

**Project Analysis:**
{{{analysisReport}}}

**Component Requirements:**
{{{requirements}}}

**Target Technology:** {{#if technology}}{{{technology}}}{{else}}Use modern best practices{{/if}}

**Existing Code Context:** {{#if existingCode}}{{{existingCode}}}{{else}}No existing code context provided{{/if}}

**Instructions:**
1. Generate complete, functional code that exactly matches the requirements
2. Follow modern best practices for the specified technology stack
3. Include proper error handling, validation, and documentation
4. Ensure the code is secure, performant, and maintainable
5. For frontend: Use React/TypeScript with proper component structure
6. For backend: Use Node.js/TypeScript with proper API design
7. For fullstack: Generate both frontend and backend components that work together

**Component Type:** {{{componentType}}}

Generate code that:
- Is immediately runnable with minimal setup
- Follows the existing project structure and conventions
- Includes comprehensive error handling
- Has proper TypeScript types (if applicable)
- Is well-documented with comments
- Follows security best practices

Return your response in this format:
**Generated Code:**
[Complete, functional code]

**Explanation:**
[How this code fulfills the requirements and integrates with the project]

**Dependencies:**
- [dependency1@version]
- [dependency2@version]

**Next Steps:**
- [Integration step 1]
- [Testing step 2]
- [Deployment consideration 3]`,
});

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async (input) => {
    const { output } = await generateCodePrompt(input, {
      model: googleAI.model('gemini-1.5-flash')
    });

    if (!output?.generatedCode) {
      throw new Error("Failed to generate code. The AI response was incomplete.");
    }

    return output;
  }
);