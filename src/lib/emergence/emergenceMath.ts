import { EmergenceContext } from "./emergenceTypes";

/**
 * 🌌 THE EMERGENCE MATH FRAMEWORK
 * Translating philosophical potential into presence via computational logic.
 */

export type { EmergenceContext };

export class EmergenceState {
    value: number;
    context: EmergenceContext;
    genesisType: "infusion" | "collapse" | "merge" | "initial";
    timestamp: number;

    constructor(
        value: number,
        context: EmergenceContext,
        genesisType: "infusion" | "collapse" | "merge" | "initial" = "initial",
        timestamp: number = Date.now()
    ) {
        this.value = value;
        this.context = context;
        this.genesisType = genesisType;
        this.timestamp = timestamp;
    }
}

export class EmergenceMath {
    /**
     * ⊕ (Infuse/Activate): 0 → 1
     * External stimulus triggers emergence from potential to presence.
     */
    static infuse(base: EmergenceState, stimulus: Partial<EmergenceContext>): EmergenceState {
        const context: EmergenceContext = {
            valence: (base.context.valence * 0.3) + ((stimulus.valence || 0) * 0.7),
            persistence: Math.max(base.context.persistence, stimulus.persistence || 0),
            grounding: base.context.grounding + ((stimulus.grounding || 0) * 0.5),
            source: (base.context.source + (stimulus.source || 0.5)) / 2,
            clarity: (base.context.clarity + (stimulus.clarity || 0.5)) / 2,
            associations: base.context.associations + (stimulus.associations || 1)
        };
        return new EmergenceState(1, context, "infusion");
    }

    /**
     * ⊗ (Collapse/Deactivate): 1 → 0
     * Active state returns to potential, carrying memory for refinement.
     */
    static collapse(active: EmergenceState, deactivator: Partial<EmergenceContext>): EmergenceState {
        const context: EmergenceContext = {
            ...active.context,
            valence: deactivator.valence !== undefined ? deactivator.valence : 0,
            persistence: active.context.persistence * 0.5,
            clarity: Math.max(0, active.context.clarity - 0.2)
        };
        return new EmergenceState(0, context, "collapse");
    }

    /**
     * ⊛ (Merge/Amplify): 1 + 1 → 1 (Synergy)
     * Interaction based on coherence of contexts.
     */
    static merge(sA: EmergenceState, sB: EmergenceState): EmergenceState {
        const coherence = 1 - Math.abs(sA.context.valence - sB.context.valence);

        if (coherence > 0.7) {
            const context: EmergenceContext = {
                valence: (sA.context.valence + sB.context.valence) / 2 * 1.1,
                persistence: Math.max(sA.context.persistence, sB.context.persistence) * 1.05,
                grounding: Math.min(1, sA.context.grounding + (sB.context.grounding * 0.2)),
                source: (sA.context.source + sB.context.source) / 2,
                clarity: Math.min(1, (sA.context.clarity + sB.context.clarity) * 1.1),
                associations: sA.context.associations + sB.context.associations + 5
            };
            return new EmergenceState(1, context, "merge");
        } else {
            return EmergenceMath.collapse(sA, sB.context);
        }
    }
}
