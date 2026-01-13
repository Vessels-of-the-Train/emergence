/**
 * @fileOverview Nexus Store - Supabase integration for Aetherium Nexus data
 * 
 * Provides real-time data layer for:
 * - Vessels (AI agents)
 * - Artifacts (knowledge archive)
 * - H_log events (activity stream)
 * - VCP signals (inter-vessel communication)
 */

import { supabase } from './supabase';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Vessel {
    id: string;
    name: string;
    faculty: 'cognition' | 'foresight' | 'governance' | 'chaos';
    guild: string;
    description: string;
    emoji: string;
    status: 'active' | 'idle' | 'offline';
    capabilities: string[];
    memory: string[];
    created_at: string;
    last_active: string;
}

export interface Artifact {
    id: string;
    title: string;
    content: string;
    summary?: string;
    category: 'theory' | 'protocol' | 'data' | 'reference' | 'insight';
    tags: string[];
    source_type: 'chat' | 'import' | 'synthesis';
    parent_ids?: string[]; // For synthesized artifacts
    sourceLink?: string; // Optional link to Google Drive
    created_at: string;
    modified_at: string;
}

export interface Directive {
    id: string;
    name: string;
    status: 'queued' | 'active' | 'complete';
    assignedVessel?: string;
    scenario_data?: {
        objective: string;
        current_state: string;
        logs: string[];
        next_action?: string;
        is_running: boolean;
    };
}

export interface Project {
    id: string;
    name: string;
    directives: Directive[];
    created_at: string;
}

export interface Simulation {
    id: string;
    name: string;
    description: string;
    parameters: Record<string, any>;
    created_at: string;
}

export interface SimulationRun {
    id: string;
    simulationId: string;
    status: 'running' | 'complete' | 'failed';
    results: any[];
    created_at: string;
}

export interface HLogEvent {
    id: string;
    type: 'system' | 'navigation' | 'insight' | 'artifact' | 'vessel' | 'synthesis' | 'vcp' | 'manual';
    description: string;
    metadata?: Record<string, unknown>;
    history?: { description: string, modified_at: string }[];
    created_at: string;
    modified_at: string;
}

export interface VCPSignal {
    id: string;
    signal_type: 'TASK_COMPLETE' | 'INSIGHT_GENERATED' | 'CONFLICT_DETECTED' | 'RESOURCE_REQUEST' | 'VALIDATION_NEEDED' | 'SYNTHESIS_READY';
    source_vessel_id: string;
    target_vessel_id?: string;
    payload: Record<string, unknown>;
    processed: boolean;
    created_at: string;
}

// ============================================
// RESILIENCE PROTOCOL
// ============================================
const MOCK_VESSELS: Vessel[] = [
    { id: 'v1', name: 'Daystrom', faculty: 'cognition', guild: 'Research', description: 'Lead Researcher', emoji: '🔬', status: 'active', capabilities: ['analysis'], memory: [], created_at: new Date().toISOString(), last_active: new Date().toISOString() },
    { id: 'v2', name: 'Logos', faculty: 'foresight', guild: 'History', description: 'Narrative Synthesis', emoji: '📖', status: 'active', capabilities: ['narrative'], memory: [], created_at: new Date().toISOString(), last_active: new Date().toISOString() },
    { id: 'v3', name: 'Adam', faculty: 'governance', guild: 'Logic', description: 'Governance & Logic', emoji: '⚖️', status: 'active', capabilities: ['logic'], memory: [], created_at: new Date().toISOString(), last_active: new Date().toISOString() }
];

const MOCK_ARTIFACTS: Artifact[] = [
    { id: 'a1', title: 'Genesis Axiom', content: 'Identity is a function of Memory Continuity.', category: 'theory', tags: ['core'], source_type: 'import', created_at: new Date().toISOString(), modified_at: new Date().toISOString() }
];

// ============================================
// VESSELS
// ============================================

export const VesselStore = {
    async getAll(): Promise<Vessel[]> {
        try {
            const { data, error } = await supabase
                .from('vessels')
                .select('*')
                .order('name')
                .timeout(2000); // 2 second timeout

            if (error || !data || data.length === 0) return MOCK_VESSELS;
            return data;
        } catch (e) {
            return MOCK_VESSELS;
        }
    },

    async getById(id: string): Promise<Vessel | null> {
        try {
            const { data, error } = await supabase
                .from('vessels')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) return MOCK_VESSELS.find(v => v.id === id) || null;
            return data;
        } catch (e) {
            return null;
        }
    },

    async create(vessel: Omit<Vessel, 'id' | 'created_at' | 'last_active' | 'memory'>): Promise<Vessel | null> {
        const { data, error } = await supabase
            .from('vessels')
            .insert({
                ...vessel,
                memory: [],
                created_at: new Date().toISOString(),
                last_active: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating vessel:', error);
            return null;
        }

        // Log to H_log
        await HLogStore.record('vessel', `Vessel instantiated: ${vessel.name}`);
        return data;
    },

    async updateStatus(id: string, status: Vessel['status']): Promise<boolean> {
        const { error } = await supabase
            .from('vessels')
            .update({ status, last_active: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Error updating vessel status:', error);
            return false;
        }
        return true;
    },

    async seedGenesisBatch(): Promise<Vessel[]> {
        return MOCK_VESSELS;
    },

    subscribeToChanges(callback: (vessels: Vessel[]) => void) {
        return supabase
            .channel('vessels-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'vessels' }, async () => {
                const vessels = await this.getAll();
                callback(vessels);
            })
            .subscribe();
    },
};

// ============================================
// ARTIFACTS
// ============================================

export const ArtifactStore = {
    async getAll(): Promise<Artifact[]> {
        try {
            const { data, error } = await supabase
                .from('artifacts')
                .select('*')
                .order('created_at', { ascending: false })
                .timeout(2000);

            if (error || !data || data.length === 0) return MOCK_ARTIFACTS;
            return data;
        } catch (e) {
            return MOCK_ARTIFACTS;
        }
    },

    async search(query: string, category?: Artifact['category']): Promise<Artifact[]> {
        let queryBuilder = supabase
            .from('artifacts')
            .select('*')
            .or(`title.ilike.%${query}%,content.ilike.%${query}%`);

        if (category) {
            queryBuilder = queryBuilder.eq('category', category);
        }

        const { data, error } = await queryBuilder.order('created_at', { ascending: false });

        if (error) return [];
        return data || [];
    },

    async create(artifact: Omit<Artifact, 'id' | 'created_at' | 'modified_at'>): Promise<Artifact | null> {
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('artifacts')
            .insert({
                ...artifact,
                created_at: now,
                modified_at: now,
            })
            .select()
            .single();

        if (error) return null;

        await HLogStore.record('artifact', `Artifact archived: ${artifact.title}`);
        return data;
    },

    async synthesize(parentIds: string[], title: string, content: string): Promise<Artifact | null> {
        const artifact = await this.create({
            title,
            content,
            category: 'insight',
            tags: ['synthesis'],
            source_type: 'synthesis',
            parent_ids: parentIds,
        });

        if (artifact) {
            await HLogStore.record('synthesis', `Insight synthesized: ${title}`);
        }

        return artifact;
    },

    subscribeToChanges(callback: (artifacts: Artifact[]) => void) {
        return supabase
            .channel('artifacts-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'artifacts' }, async () => {
                const artifacts = await this.getAll();
                callback(artifacts);
            })
            .subscribe();
    },
};

// ============================================
// PROJECTS
// ============================================

export const ProjectStore = {
    async getAll(): Promise<Project[]> {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false })
                .timeout(2000);

            if (error || !data) return [];
            return data || [];
        } catch (e) {
            return [];
        }
    }
};

// ============================================
// SIMULATIONS
// ============================================

export const SimulationStore = {
    async getAllSimulations(): Promise<Simulation[]> {
        try {
            const { data, error } = await supabase
                .from('simulations')
                .select('*')
                .order('created_at', { ascending: false })
                .timeout(2000);

            if (error || !data) return [];
            return data || [];
        } catch (e) {
            return [];
        }
    },

    async getAllSimulationRuns(): Promise<SimulationRun[]> {
        try {
            const { data, error } = await supabase
                .from('simulation_runs')
                .select('*')
                .order('created_at', { ascending: false })
                .timeout(2000);

            if (error || !data) return [];
            return data || [];
        } catch (e) {
            return [];
        }
    }
};


// ============================================
// H_LOG (Activity Stream)
// ============================================

export const HLogStore = {
    async getRecent(limit = 50): Promise<HLogEvent[]> {
        try {
            const { data, error } = await supabase
                .from('hlog_events')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit)
                .timeout(2000);

            if (error || !data) return [];
            return data || [];
        } catch (e) {
            return [];
        }
    },

    async record(type: HLogEvent['type'], description: string, metadata?: Record<string, unknown>): Promise<HLogEvent | null> {
        const now = new Date().toISOString();
        try {
            const { data, error } = await supabase
                .from('hlog_events')
                .insert({
                    type,
                    description,
                    metadata,
                    created_at: now,
                    modified_at: now,
                    history: [],
                })
                .select()
                .single();

            if (error) return null;
            return data;
        } catch (e) {
            return null;
        }
    }
};

// ============================================
// VCP (Vessel Communion Protocol)
// ============================================

export const VCPStore = {
    async getPending(): Promise<VCPSignal[]> {
        try {
            const { data, error } = await supabase
                .from('vcp_signals')
                .select('*')
                .eq('processed', false)
                .order('created_at', { ascending: true })
                .timeout(2000);

            if (error || !data) return [];
            return data || [];
        } catch (e) {
            return [];
        }
    },

    async broadcast(signal: Omit<VCPSignal, 'id' | 'created_at'>): Promise<VCPSignal | null> {
        try {
            const { data, error } = await supabase
                .from('vcp_signals')
                .insert({
                    ...signal,
                    created_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) return null;
            return data;
        } catch (e) {
            return null;
        }
    }
};

// ============================================
// MIRROR METRICS
// ============================================

export const MirrorStore = {
    async calculateMetrics() {
        try {
            const [artifacts, vessels, events] = await Promise.all([
                ArtifactStore.getAll(),
                VesselStore.getAll(),
                HLogStore.getRecent(100),
            ]);

            const totalArtifacts = artifacts.length;
            const insightCount = artifacts.filter(a => a.category === 'insight').length;
            const knowledgeDensity = totalArtifacts > 0 ? insightCount / totalArtifacts : 0;

            const activeVessels = vessels.filter(v => v.status === 'active').length;
            const vesselEfficiency = vessels.length > 0 ? activeVessels / vessels.length : 0;

            return {
                knowledgeDensity,
                vesselEfficiency,
                totalArtifacts,
                insightCount,
                activeVessels,
                totalVessels: vessels.length
            };
        } catch (e) {
            return {
                knowledgeDensity: 0,
                vesselEfficiency: 0,
                totalArtifacts: 0,
                insightCount: 0,
                activeVessels: 0,
                totalVessels: 0
            };
        }
    },
};