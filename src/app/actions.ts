import { generateCode, GenerateCodeInput } from '../ai/flows/generate-code';
import { generateTestSuite, GenerateTestSuiteInput } from '../ai/flows/generate-test-suite';
import { generateMultiModalWorkflow, GenerateMultiModalWorkflowInput } from '../ai/flows/generate-multi-modal-workflow';
import { generateEnhancedAnalysis, GenerateEnhancedAnalysisInput } from '../ai/flows/generate-enhanced-analysis';

export async function generateTestSuiteAction(input: GenerateTestSuiteInput): Promise<any> {
    return await generateTestSuite(input);
}
export async function generateMultiModalWorkflowAction(input: GenerateMultiModalWorkflowInput): Promise<any> {
    return await generateMultiModalWorkflow(input);
}
export async function generateEnhancedAnalysisAction(input: GenerateEnhancedAnalysisInput): Promise<any> {
    return await generateEnhancedAnalysis(input);
}
export async function generateCodeAction(input: GenerateCodeInput): Promise<any> {
    return await generateCode(input);
}
