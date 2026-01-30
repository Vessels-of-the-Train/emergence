'use client';

import React, { useEffect, useState } from 'react';
import { VCPSignal, VCPStore, VesselStore, Vessel } from '@/lib/nexus-store';
import { Activity, Radio, Zap, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface VCPSignalWidgetProps {
    signals: VCPSignal[];
    vessels: Vessel[];
}

export function VCPSignalWidget({ signals, vessels }: VCPSignalWidgetProps) {
    const [recentSignals, setRecentSignals] = useState<VCPSignal[]>([]);
    const [vesselsMap, setVesselsMap] = useState<Map<string, Vessel>>(new Map());

    useEffect(() => {
        // Create vessel lookup map
        const map = new Map<string, Vessel>();
        vessels.forEach(v => map.set(v.id, v));
        setVesselsMap(map);
    }, [vessels]);

    useEffect(() => {
        // Show only the 5 most recent signals
        setRecentSignals(signals.slice(0, 5));
    }, [signals]);

    const getSignalIcon = (type: VCPSignal['signal_type']) => {
        switch (type) {
            case 'TASK_COMPLETE':
                return CheckCircle;
            case 'INSIGHT_GENERATED':
                return Lightbulb;
            case 'CONFLICT_DETECTED':
                return AlertTriangle;
            case 'RESOURCE_REQUEST':
                return Zap;
            case 'VALIDATION_NEEDED':
                return Activity;
            case 'SYNTHESIS_READY':
                return Radio;
            default:
                return Radio;
        }
    };

    const getSignalColor = (type: VCPSignal['signal_type']) => {
        switch (type) {
            case 'TASK_COMPLETE':
                return 'from-emerald-500 to-green-500';
            case 'INSIGHT_GENERATED':
                return 'from-yellow-500 to-amber-500';
            case 'CONFLICT_DETECTED':
                return 'from-red-500 to-orange-500';
            case 'RESOURCE_REQUEST':
                return 'from-purple-500 to-pink-500';
            case 'VALIDATION_NEEDED':
                return 'from-blue-500 to-cyan-500';
            case 'SYNTHESIS_READY':
                return 'from-indigo-500 to-violet-500';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const formatSignalType = (type: string) => {
        return type.split('_').map(word =>
            word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const getVesselName = (vesselId: string) => {
        const vessel = vesselsMap.get(vesselId);
        return vessel ? `${vessel.emoji} ${vessel.name}` : vesselId;
    };

    const getTimeSince = (timestamp: string) => {
        const now = new Date().getTime();
        const then = new Date(timestamp).getTime();
        const diff = now - then;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return `${seconds}s ago`;
    };

    if (signals.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-600">
                <Radio className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No Active Signals</p>
                <p className="text-[10px] mt-1">Vessels are in idle state</p>
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    </div>
                    <h3 className="text-sm font-bold text-white">VCP Signal Stream</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {signals.length} Active
                </span>
            </div>

            <div className="space-y-2">
                {recentSignals.map((signal, _idx) => {
                    const Icon = getSignalIcon(signal.signal_type);
                    const colorClass = getSignalColor(signal.signal_type);

                    return (
                        <div
                            key={signal.id}
                            className="group relative bg-gray-950/50 border border-white/5 rounded-xl p-3 hover:border-white/20 transition-all animate-in fade-in slide-in-from-right-4"
                        >
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                                    colorClass
                                )}>
                                    <Icon className="w-4 h-4 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="text-xs font-semibold text-white truncate">
                                            {formatSignalType(signal.signal_type)}
                                        </span>
                                        <span className="text-[9px] text-gray-500 whitespace-nowrap">
                                            {getTimeSince(signal.created_at)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <span className="truncate">{getVesselName(signal.source_vessel_id)}</span>
                                        {signal.target_vessel_id && (
                                            <>
                                                <span>→</span>
                                                <span className="truncate">{getVesselName(signal.target_vessel_id)}</span>
                                            </>
                                        )}
                                    </div>

                                    {signal.payload && typeof signal.payload === 'object' && 'message' in signal.payload && (
                                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">
                                            {String(signal.payload.message)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {signals.length > 5 && (
                <div className="mt-3 pt-3 border-t border-white/5 text-center">
                    <span className="text-[10px] text-gray-500">
                        +{signals.length - 5} more signals in queue
                    </span>
                </div>
            )}
        </div>
    );
}
