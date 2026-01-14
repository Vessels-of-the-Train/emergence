import 'dotenv/config';
import { DocumentProcessor } from '../src/lib/rag/document-processor';
import { VectorStore } from '../src/lib/rag/vector-store';
import path from 'path';

async function main() {
    console.log("[RAG] Starting Manual Ingestion...");
    console.log("[DEBUG] GOOGLE_API_KEY length:", process.env.GOOGLE_API_KEY?.length || 0);

    const searchPaths = [
        path.resolve(process.cwd(), 'docs'),
        path.resolve(process.cwd(), 'User Input')
    ];
    
    const allChunks = [];

    for (const dirPath of searchPaths) {
        if (dirPath.includes('docs')) {
             // In docs, we only want to process the Knowledge subfolder and maybe some root files
             // The DocumentProcessor handles recursive search, but let's be specific if needed.
             // Actually, processAll is fine.
        }
        console.log(`[RAG] Scanning directory: ${dirPath}`);
        const processor = new DocumentProcessor(dirPath);
        const chunks = await processor.processAll();
        allChunks.push(...chunks);
    }
    
    if (allChunks.length === 0) {
        console.log("[RAG] No documents found to ingest.");
        return;
    }

    console.log(`[RAG] Found ${allChunks.length} total chunks. Updating vector store...`);
    const store = new VectorStore();
    store.clear(); 
    await store.addDocuments(allChunks);
    
    console.log(`[RAG] Successfully ingested ${allChunks.length} chunks into the vector store.`);
}

main().catch((err) => {
    console.error("[RAG] Ingestion failed:", err);
    process.exit(1);
});