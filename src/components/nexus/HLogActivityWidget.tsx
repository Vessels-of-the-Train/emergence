'use client';

import React, { useEffect, useState } from 'react';
import { HLogEvent } from '@/lib/nexus-store';
import {
    Activity,
    Zap,
    Brain,
    Users,
    Layers,
    AlertCircle,
    CheckCircle2,
    Radio
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface HLogActivityWidgetProps {
    events: HLogEvent[];
}

export function HLogActivityWidget({ events }: HLogActivityWidgetProps) {
    const [recentEvents, setRecentEvents] = useState<HLogEvent[]>([]);

    useEffect(() => {
        // Show only the 6 most recent events
        setRecentEvents(events.slice(0, 6));
    }, [events]);

    const getEventIcon = (type: HLogEvent['type']) => {
        switch (type) {
            case 'system':
                return Zap;
            case 'synthesis':
                return Layers;
            case 'vessel':
                return Users;
            case 'vcp':
                return Radio;
            case 'insight':
                return Brain;
            case 'error':
                return AlertCircle;
            case 'artifact':
                return CheckCircle2;
            default:
                return Activity;
        }
    };

    const getEventColor = (type: HLogEvent['type']) => {
        switch (type) {
            case 'system':
                return 'from-blue-500 to-cyan-500';
            case 'synthesis':
                return 'from-purple-500 to-pink-500';
            case 'vessel':
                return 'from-green-500 to-emerald-500';
            case 'vcp':
                return 'from-indigo-500 to-violet-500';
            case 'insight':
                return 'from-yellow-500 to-amber-500';
            case 'error':
                return 'from-red-500 to-orange-500';
            case 'artifact':
                return 'from-teal-500 to-cyan-500';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getTimeSince = (timestamp: string) => {
        const now = new Date().getTime();
        const then = new Date(timestamp).getTime();
        const diff = now - then;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return `${seconds}s ago`;
    };

    if (events.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-600">
                <Activity className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No System Activity</p>
                <p className="text-[10px] mt-1">Awaiting initialization</p>
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    </div>
                    <h3 className="text-sm font-bold text-white">System Activity</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    H_Log Stream
                </span>
            </div>

            <div className="space-y-2">
                {recentEvents.map((event) => {
                    const Icon = getEventIcon(event.type);
                    const colorClass = getEventColor(event.type);

                    return (
                        <div
                            key={event.id}
                            className="group relative bg-gray-950/50 border border-white/5 rounded-xl p-3 hover:border-white/20 transition-all"
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
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            {event.type}
                                        </span>
                                        <span className="text-[9px] text-gray-500 whitespace-nowrap">
                                            {getTimeSince(event.created_at)}
                                        </span>
                                    </div>

                                    <p className="text-xs text-white line-clamp-2">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {events.length > 6 && (
                <div className="mt-3 pt-3 border-t border-white/5 text-center">
                    <span className="text-[10px] text-gray-500">
                        +{events.length - 6} more events in history
                    </span>
                </div>
            )}
        </div>
    );
}
