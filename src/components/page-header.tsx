'use client';

import React from 'react';
import { useAppState, TuningMode } from '@/context/app-state-context';
import { cn } from '@/lib/utils';
import { Zap, Heart, Wind, Target } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
    const { tuningMode, setTuningMode } = useAppState();

    const modes: { id: TuningMode; label: string; icon: any; color: string }[] = [
        { id: 'focus', label: 'Focus', icon: Target, color: 'text-[#00f0ff]' },
        { id: 'creative', label: 'Creative', icon: Zap, color: 'text-[#b794f6]' },
        { id: 'calm', label: 'Calm', icon: Wind, color: 'text-[#00ff99]' },
    ];

    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight neon-text-blue">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-[var(--text-muted)] text-sm mt-1">{subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-2 glass-panel p-1.5 rounded-full scale-90 md:scale-100">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => setTuningMode(mode.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-sm font-medium",
                            tuningMode === mode.id
                                ? "bg-white/15 text-white shadow-inner"
                                : "text-[var(--text-muted)] hover:text-white hover:bg-white/5"
                        )}
                        title={`${mode.label} Mode`}
                    >
                        <mode.icon className={cn("h-4 w-4", tuningMode === mode.id && mode.color)} />
                        <span className="hidden lg:inline">{mode.label}</span>
                    </button>
                ))}

                <div
                    className="mx-2 w-px h-4 bg-white/10 hidden sm:block"
                />

                <div className="flex items-center gap-2 px-3 group" title="System Pulse">
                    <Heart className="h-4 w-4 text-red-500 animate-heartbeat" />
                    <span className="text-[var(--text-muted)] text-xs font-mono group-hover:text-white transition-colors">
                        72 BPM
                    </span>
                </div>
            </div>
        </header>
    );
}
