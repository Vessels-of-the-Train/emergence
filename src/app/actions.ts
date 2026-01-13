import { generateCode, GenerateCodeInput } from '../ai/flows/generate-code';
import { generateTestSuite, GenerateTestSuiteInput } from '../ai/flows/generate-test-suite';
import { generateMultiModalWorkflow, GenerateMultiModalWorkflowInput } from '../ai/flows/generate-multi-modal-workflow';
import { generateEnhancedAnalysis, GenerateEnhancedAnalysisInput } from '../ai/flows/generate-enhanced-analysis';
import { generateNarrative, GenerateNarrativeInput } from '../ai/flows/generate-narrative';
import { generateVesselResponse, VesselResponseInput } from '../ai/flows/vessel-response';

export async function generateVesselResponseAction(input: VesselResponseInput): Promise<any> {
    return await generateVesselResponse(input);
}

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
export async function generateNarrativeAction(input: GenerateNarrativeInput): Promise<any> {
    return await generateNarrative(input);
}
