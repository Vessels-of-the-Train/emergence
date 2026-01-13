'use client';

import { useState, useEffect, useMemo } from 'react';
import { SimulationRun } from '@/lib/nexus-store';

interface SimulationGraphProps {
    run: SimulationRun | null;
}

export function SimulationGraph({ run }: SimulationGraphProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showTraces, setShowTrace] = useState(true);

    useEffect(() => {
        setCurrentStepIndex(0);
        setIsAnimating(false);
    }, [run]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAnimating && run && run.results && currentStepIndex < run.results.length - 1) {
            interval = setInterval(() => {
                setCurrentStepIndex((prev) => prev + 1);
            }, 80); // Slightly faster
        } else if (currentStepIndex >= (run?.results?.length || 0) - 1) {
            setIsAnimating(false);
        }
        return () => clearInterval(interval);
    }, [isAnimating, currentStepIndex, run]);

    if (!run || !run.results || run.results.length === 0) {
        return <div className="text-center text-[var(--text-muted)] py-12">No simulation data to display.</div>;
    }

    const currentStep = run.results[currentStepIndex];
    const previousSteps = useMemo(() => {
        if (!showTraces) return [];
        // Get last 5 steps for traces
        return run.results.slice(Math.max(0, currentStepIndex - 5), currentStepIndex);
    }, [run.results, currentStepIndex, showTraces]);

    const gridSize = 500;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="text-xs text-[var(--text-muted)] font-mono">
                        Step: <span className="text-white">{currentStepIndex + 1}</span> / {run.results.length}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={showTraces} 
                            onChange={(e) => setShowTrace(e.target.checked)}
                            className="w-3 h-3 accent-[var(--neon-blue)] bg-black/50 border-white/10"
                        />
                        <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] group-hover:text-white transition-colors">Trace Mode</span>
                    </label>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setCurrentStepIndex(0);
                            setIsAnimating(true);
                        }}
                        className="text-[10px] uppercase font-bold px-3 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                    >
                        Restart
                    </button>
                    <button
                        onClick={() => setIsAnimating(!isAnimating)}
                        className="text-[10px] uppercase font-bold px-3 py-1 rounded bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all min-w-[60px]"
                    >
                        {isAnimating ? 'Pause' : 'Play'}
                    </button>
                </div>
            </div>

            <div className="w-full h-96 bg-[#05080a] rounded-xl relative overflow-hidden border border-white/5 shadow-inner">
                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
                
                {/* Traces */}
                {previousSteps.map((step, stepIdx) => (
                    step.map((agent: any) => (
                        <div
                            key={`trace-${stepIdx}-${agent.id}`}
                            className="absolute w-1 h-1 rounded-full pointer-events-none"
                            style={{
                                left: `${(agent.x / gridSize) * 100}%`,
                                top: `${(agent.y / gridSize) * 100}%`,
                                backgroundColor: agent.knowledgeLevel > 0 ? 'var(--neon-purple)' : 'var(--neon-blue)',
                                opacity: (stepIdx + 1) / 10 * 0.3,
                            }}
                        />
                    ))
                ))}

                {/* Active Agents */}
                {currentStep.map((agent: any) => {
                    const isHighlyKnowledgeable = agent.knowledgeLevel > 0.8;
                    return (
                        <div
                            key={agent.id}
                            className="absolute w-2 h-2 rounded-full transition-all duration-100 ease-linear"
                            style={{
                                left: `${(agent.x / gridSize) * 100}%`,
                                top: `${(agent.y / gridSize) * 100}%`,
                                backgroundColor: agent.knowledgeLevel > 0 
                                    ? `rgba(${183 - (agent.knowledgeLevel * 50)}, ${148 + (agent.knowledgeLevel * 100)}, 246, 1)` 
                                    : 'var(--neon-blue)',
                                boxShadow: agent.knowledgeLevel > 0 
                                    ? `0 0 ${5 + (agent.knowledgeLevel * 10)}px rgba(183, 148, 246, ${0.3 + agent.knowledgeLevel})` 
                                    : '0 0 5px rgba(0, 240, 255, 0.3)',
                                transform: `translate(-50%, -50%) scale(${1 + (agent.knowledgeLevel * 0.5)})`,
                                zIndex: agent.knowledgeLevel > 0 ? 20 : 10
                            }}
                        >
                            {isHighlyKnowledgeable && (
                                <div className="absolute inset-0 rounded-full animate-ping bg-[var(--neon-purple)] opacity-40" />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-4 items-center">
                <input
                    type="range"
                    min="0"
                    max={run.results.length - 1}
                    value={currentStepIndex}
                    onChange={(e) => {
                        setIsAnimating(false);
                        setCurrentStepIndex(parseInt(e.target.value));
                    }}
                    className="flex-1 accent-[var(--neon-blue)] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] font-mono text-[var(--text-muted)] min-w-[30px] text-right">
                    {Math.round((currentStepIndex / (run.results.length - 1)) * 100)}%
                </span>
            </div>
        </div>
    );
}
