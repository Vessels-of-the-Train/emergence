'use client';

import { IntegrationEngine } from '@/lib/integration-engine';

interface MirrorViewProps {
    metrics: {
        knowledgeDensity: number;
        vesselEfficiency: number;
        totalArtifacts: number;
        insightCount: number;
        activeVessels: number;
        totalVessels: number;
    } | null;
    onRunGenesisCycle: () => void;
}

export function MirrorView({ metrics, onRunGenesisCycle }: MirrorViewProps) {
    return (
        <div>
            <h2 className="text-lg font-medium mb-6">🪞 The Mirror Protocol</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="glass-panel text-center">
                    <div className="text-3xl font-bold neon-text-blue">{metrics ? `${(metrics.knowledgeDensity * 100).toFixed(0)}%` : '-'}</div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">Knowledge Density</div>
                </div>
                <div className="glass-panel text-center">
                    <div className="text-3xl font-bold neon-text-green">{metrics ? `${(metrics.vesselEfficiency * 100).toFixed(0)}%` : '-'}</div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">Vessel Efficiency</div>
                </div>
                <div className="glass-panel text-center">
                    <div className="text-3xl font-bold neon-text-purple">{metrics?.totalArtifacts ?? 0}</div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">Total Artifacts</div>
                </div>
                <div className="glass-panel text-center">
                    <div className="text-3xl font-bold text-[var(--neon-orange)]">{metrics?.activeVessels ?? 0}</div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">Active Vessels</div>
                </div>
            </div>
            <div className="glass-panel">
                <h3 className="font-medium mb-3">State of the Nexus</h3>
                <p className="text-[var(--text-secondary)]">
                    {metrics && metrics.totalArtifacts > 0
                        ? `The Nexus holds ${metrics.totalArtifacts} artifacts with a knowledge density of ${(metrics.knowledgeDensity * 100).toFixed(0)}%. ${metrics.insightCount} insights synthesized. ${metrics.activeVessels} of ${metrics.totalVessels} vessels active.`
                        : 'The Nexus awaits its first artifacts. Begin archiving knowledge to activate The Mirror.'}
                </p>
                <button onClick={onRunGenesisCycle} className="glass-btn-primary mt-4">
                    Run Genesis Cycle
                </button>
            </div>
        </div>
    );
}
