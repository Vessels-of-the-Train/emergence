'use server';

import { emergenceMathFlow } from '@/lib/emergence/emergenceFlow';
import { ContextMatrix } from '@/lib/emergence/emergenceTypes';
import { generateSynthesis, GenerateSynthesisInput } from '@/ai/flows/generate-synthesis';
import { reflectVessel, VesselReflectionInput } from '@/ai/flows/reflect-vessel';
import { analyzeError, AnalyzeErrorInput } from '@/ai/flows/analyze-error';
import { DocumentProcessor } from '@/lib/rag/document-processor';
import { VectorStore } from '@/lib/rag/vector-store';
import path from 'path';

export async function runEmergenceCheckInAction(input: ContextMatrix): Promise<any> {
    return await emergenceMathFlow(input);
}

export async function generateSynthesisAction(input: GenerateSynthesisInput): Promise<any> {
    return await generateSynthesis(input);
}

export async function reflectVesselAction(input: VesselReflectionInput): Promise<any> {
    return await reflectVessel(input);
}

export async function analyzeErrorAction(input: AnalyzeErrorInput): Promise<any> {
    return await analyzeError(input);
}

export async function ingestDocumentsAction() {
    console.log("[RAG] Starting Ingestion...");
    const docsPath = path.resolve(process.cwd(), 'docs');

    const processor = new DocumentProcessor(docsPath);
    const chunks = await processor.processAll();

    const store = new VectorStore();
    store.clear(); // Rebuild from scratch
    await store.addDocuments(chunks);

    return { success: true, count: chunks.length };
}
