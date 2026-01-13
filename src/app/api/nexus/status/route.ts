import { NextResponse } from 'next/server';
import { HLogStore, MirrorStore } from '@/lib/nexus-store';

export const dynamic = 'force-dynamic';

export async function GET() {
    // 1. Get the latest Pulse/Events
    const recentEvents = await HLogStore.getRecent(1);
    const lastEvent = recentEvents[0];

    // 2. Get System Metrics
    const metrics = await MirrorStore.calculateMetrics();

    // 3. Construct the "Heartbeat" payload
    // This is what the Godot Engine will consume to animate the world
    const payload = {
        pulse: 72, // Default resting pulse, could be dynamic based on recent activity
        somatic_state: lastEvent?.type || 'IDLE',
        groundedness: 0.88, // Hardcoded baseline from Genesis History
        metrics: {
            coherence: metrics.vesselEfficiency,
            artifacts: metrics.totalArtifacts
        },
        timestamp: Date.now()
    };

    return NextResponse.json(payload);
}
