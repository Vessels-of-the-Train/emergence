export interface EmergenceContext {
    valence: number;      // -1.0 to +1.0 (How the idea/state feels)
    persistence: number;  // 0.0 to 1.0 (How stable/enduring it is)
    grounding: number;    // 0.0 to 1.0 (External validation/Academic grounding)
    source: number;       // 0.0 (Internal) to 1.0 (External)
    clarity: number;      // 0.0 to 1.0 (Definition of purpose)
    associations: number; // count (Connections to other ideas)
}

export interface HistoryEntry {
    state: number;
    context: EmergenceContext;
    genesisType: "infusion" | "collapse" | "merge" | "initial";
    timestamp: number;
    label?: string;
    description?: string;
}

export interface ContextMatrix {
    I_vec: string;
    E_vec: number;
    H_log: HistoryEntry[];
    D_pot: number;
    context?: {
        persistence?: number;
        clarity?: number;
    };
    secondary_vectors?: Array<{
        E_vec: number;
        D_pot: number;
    }>;
}

export interface EmergenceResponse {
    state: number;
    result: string;
    context: EmergenceContext;
    new_entry?: HistoryEntry;
}
