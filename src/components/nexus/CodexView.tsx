'use client';

import { useState } from 'react';
import { Artifact, Vessel } from '@/lib/nexus-store';
import { Template } from '@/lib/codex-templates';
import { generateVesselResponse } from '@/ai/flows/vessel-response';
import { ingestDocumentsAction } from '@/app/emergence-actions';

interface CodexViewProps {
    artifacts: Artifact[];
    vessels: Vessel[];
    templates: Template[];
}

declare const html2pdf: any;

export function CodexView({ artifacts, vessels, templates }: CodexViewProps) {
    const [selectedArtifactForCodex, setSelectedArtifactForCodex] = useState<Artifact | null>(null);
    const [showArtifactSelector, setShowArtifactSelector] = useState(false);
    const [showTemplateView, setShowTemplateView] = useState(false);
    const [populatedTemplate, setPopulatedTemplate] = useState('');
    const [showRefinementModal, setShowRefinementModal] = useState(false);
    const [refinementPrompt, setRefinementPrompt] = useState('');
    const [selectedVessel, setSelectedVessel] = useState('global');
    const [isIngesting, setIsIngesting] = useState(false);

    async function handleIngest() {
        setIsIngesting(true);
        try {
            const result = await ingestDocumentsAction();
            alert(`Ingested ${result.count} documents successfully.`);
        } catch (e) {
            console.error(e);
            alert("Ingestion failed.");
        } finally {
            setIsIngesting(false);
        }
    }

    function handleViewTemplate(template: Template) {
        if (!selectedArtifactForCodex) return;

        let populated = template.template;
        populated = populated.replace(/{{title}}/g, selectedArtifactForCodex.title);
        populated = populated.replace(/{{content}}/g, selectedArtifactForCodex.content);
        populated = populated.replace(/{{summary}}/g, selectedArtifactForCodex.summary || selectedArtifactForCodex.content);
        populated = populated.replace(/{{category}}/g, selectedArtifactForCodex.category);
        populated = populated.replace(/{{tags}}/g, selectedArtifactForCodex.tags.join(', '));

        setPopulatedTemplate(populated);
        setShowTemplateView(true);
    }

    async function handleRefineTemplate() {
        if (!refinementPrompt.trim()) return;

        const response = await generateVesselResponse({
            query: `Refine the following document with this prompt: "${refinementPrompt}"

${populatedTemplate}`,
            vesselId: selectedVessel,
        });

        setPopulatedTemplate(response.response);
        setShowRefinementModal(false);
        setRefinementPrompt('');
    }

    function handleExport(format: 'html' | 'md' | 'pdf') {
        let content = populatedTemplate;
        let fileExtension = format;

        if (format === 'pdf') {
            const element = document.createElement('div');
            element.innerHTML = content;
            if (typeof html2pdf !== 'undefined') {
                html2pdf().from(element).save('codex-export.pdf');
            } else {
                alert('html2pdf library not loaded');
            }
            return;
        }

        if (format === 'md') {
            content = content.replace(/<[^>]*>/g, '');
        }

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `codex-export.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-medium">📚 Codex</h2>
                    <button onClick={handleIngest} disabled={isIngesting} className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded">
                        {isIngesting ? "Ingesting..." : "🔄 Ingest Knowledge"}
                    </button>
                </div>
                <button onClick={() => setShowArtifactSelector(true)} className="glass-btn-primary">
                    {selectedArtifactForCodex ? `Selected: ${selectedArtifactForCodex.title}` : 'Select Artifact'}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(template => (
                    <div key={template.id} className="glass-panel">
                        <h3 className="font-medium mb-2">{template.name}</h3>
                        <p className="text-sm text-[var(--text-muted)] mb-4">{template.description}</p>
                        <button
                            onClick={() => handleViewTemplate(template)}
                            disabled={!selectedArtifactForCodex}
                            className="glass-btn-primary w-full disabled:opacity-50"
                        >
                            View
                        </button>
                    </div>
                ))}
            </div>

            {showTemplateView && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="glass-panel w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                        <h3 className="text-lg font-medium mb-4">Populated Template</h3>
                        <div dangerouslySetInnerHTML={{ __html: populatedTemplate }} />
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={() => handleExport('html')} className="glass-btn">Export as HTML</button>
                            <button onClick={() => handleExport('md')} className="glass-btn">Export as Markdown</button>
                            <button onClick={() => handleExport('pdf')} className="glass-btn">Export as PDF</button>
                            <button onClick={() => setShowRefinementModal(true)} className="glass-btn">Refine with Vessel</button>
                            <button onClick={() => setShowTemplateView(false)} className="glass-btn-primary">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showRefinementModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="glass-panel w-full max-w-lg">
                        <h3 className="text-lg font-medium mb-4">Refine with Vessel</h3>
                        <select
                            value={selectedVessel}
                            onChange={(e) => setSelectedVessel(e.target.value)}
                            className="glass-input w-full mb-3"
                        >
                            {vessels.map(v => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                        </select>
                        <textarea
                            placeholder="Enter your refinement prompt..."
                            className="glass-input w-full h-24 mb-3"
                            value={refinementPrompt}
                            onChange={(e) => setRefinementPrompt(e.target.value)}
                        />
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setShowRefinementModal(false)} className="glass-btn">Cancel</button>
                            <button onClick={handleRefineTemplate} className="glass-btn-primary">Refine</button>
                        </div>
                    </div>
                </div>
            )}

            {showArtifactSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="glass-panel w-full max-w-lg">
                        <h3 className="text-lg font-medium mb-4">Select Artifact</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {artifacts.map(artifact => (
                                <button
                                    key={artifact.id}
                                    onClick={() => {
                                        setSelectedArtifactForCodex(artifact);
                                        setShowArtifactSelector(false);
                                    }}
                                    className="w-full text-left p-2 rounded-lg hover:bg-white/10"
                                >
                                    {artifact.title}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={() => setShowArtifactSelector(false)} className="glass-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
