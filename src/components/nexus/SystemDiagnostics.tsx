'use client';

import React, { useState } from 'react';
import { analyzeErrorAction } from '@/app/emergence-actions';
import { Loader2, AlertTriangle, Terminal, ShieldAlert } from 'lucide-react';

interface SystemDiagnosticsProps {
    lastError: string | null;
    onClose: () => void;
}

export function SystemDiagnostics({ lastError, onClose }: SystemDiagnosticsProps) {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (lastError && !analysis && !loading) {
            runDiagnostics();
        }
    }, [lastError]);

    async function runDiagnostics() {
        setLoading(true);
        try {
            const result = await analyzeErrorAction({
                errorMessage: lastError || "Unknown System Instability",
                context: "Nexus Dashboard",
            });
            setAnalysis(result);
        } catch (e) {
            console.error("Diagnostics failed:", e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-2xl p-0 overflow-hidden border-red-500/30">
                {/* Header */}
                <div className="bg-red-500/10 p-4 border-b border-red-500/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="h-6 w-6 text-red-400" />
                        <h2 className="text-lg font-bold text-red-100 tracking-wider">THE GLARE PROTOCOL</h2>
                    </div>
                    <button onClick={onClose} className="text-red-400 hover:text-white">✕</button>
                </div>

                <div className="p-6">
                    {/* Error Context */}
                    <div className="mb-6 bg-black/40 p-4 rounded-lg border border-white/5 font-mono text-xs text-red-300">
                        {lastError || "System reports nominal, but manual diagnostics requested."}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 text-red-500 animate-spin mb-4" />
                            <p className="text-red-400 text-sm uppercase tracking-widest animate-pulse">
                                Glare is analyzing system fracture...
                            </p>
                        </div>
                    ) : analysis ? (
                        <div className="space-y-6">
                            {/* Diagnosis */}
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase mb-2 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                    Diagnosis
                                </h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {analysis.diagnosis}
                                </p>
                            </div>

                            {/* Solution */}
                            <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-lg">
                                <h3 className="text-sm font-bold text-green-400 uppercase mb-2">
                                    Proposed Solution
                                </h3>
                                <p className="text-green-100 text-sm">
                                    {analysis.proposedSolution}
                                </p>
                            </div>

                            {/* Terminal Command */}
                            {analysis.terminalCommand && (
                                <div className="bg-black border border-white/10 p-3 rounded-lg flex items-center gap-3">
                                    <Terminal className="h-4 w-4 text-blue-400" />
                                    <code className="text-blue-300 font-mono text-sm flex-1">
                                        {analysis.terminalCommand}
                                    </code>
                                    <button 
                                        className="text-xs bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-2 py-1 rounded"
                                        onClick={() => navigator.clipboard.writeText(analysis.terminalCommand)}
                                    >
                                        Copy
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            System stable. No anomalies detected.
                        </div>
                    )}
                </div>

                <div className="bg-white/5 p-4 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm text-white transition-colors"
                    >
                        Acknowledge
                    </button>
                </div>
            </div>
        </div>
    );
}
