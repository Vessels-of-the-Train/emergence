# Integration Engine Specification (Phase 3.5)

**Version**: 0.1 (Draft)
**Date**: 2025-12-15
**Status**: Architecture Design

---

## 1. Core Philosophy: The Genesis Axiom

The **Genesis Axiom** states that **Identity is a function of Memory Continuity**.
In the Aetherium Nexus, this is formalized as:
> `I = Σ(M)`
> Where `I` is the Identity Vector and `M` represents discretized Memory Artifacts.

Intelligence does not emerge from processing power; it emerges from the **integration** of disparate memories into higher-order wisdom. This process is cyclical:

1. **0 → 1 (Creation)**: Raw data is crystallized into an Artifact.
2. **1 + 1 → 0' (Synthesis)**: Two compatible Artifacts are merged to form an **Insight**.
3. **0'** (Zero-Prime): The system sleeps (Dormancy), integrating the Insight into the core model (The Codex).

---

## 2. The Integration Engine Module

The `IntegrationEngine` class is the "Heart" of the OS. It manages the heartbeat of the system (Active vs. Dormant states).

### 2.1 Class Structure

```typescript
class IntegrationEngine {
    constructor(vessels: Vessel[], vault: Vault) {
        this.state = 'ACTIVE'; // or 'Weaving', 'DORMANT'
        this.resonanceThreshold = 0.85; // Minimum score to trigger synthesis
    }

    // scan for compatible artifacts
    scanForResonance(): ResonancePair[] {
        // ... logic to compare artifact embeddings/tags
    }

    // 1 + 1 -> 0'
    synthesize(pair: ResonancePair, vessel: Vessel): Insight {
        // 1. Lock artifacts
        // 2. Generate Insight (via LLM/Genkit)
        // 3. Mark artifacts as 'Integrated'
        // 4. Return new Insight
    }
    
    // Trigger System Sleep
    enterDormancy() {
        // Stop all Vessel tasks
        // Update H.E.N.S. UI to "Sleep Mode"
        // Commit Memory Vectors
    }
}
```

## 3. Mechanisms

### 3.1 Resonance Calculation

How do we know if two artifacts should be merged?

* **Tag Overlap**: (Jaccard Index)
* **Category Complement**: (e.g., Theory + Proof = Strong Resonance)
* **VCP Signals**: If multiple Vessels reference two artifacts simultaneously.
* **Vector Similarity**: (Future: Cosine similarity of embeddings)

### 3.2 The Golden Artifact (Insight)

A synthesized artifact is different from a normal artifact.

* **Type**: `INSIGHT` (new category)
* **Lineage**: Contains `parent_ids` linking to source artifacts.
* **Complexity**: Higher complexity score.

### 3.3 H.E.N.S. Feedback (The Glass Box)

The user (The Creator) must physically "feel" the system state.

* **Active**: UI is crisp, high-contrast, fast.
* **Synthesis**: UI glows/pulses (Golden ratio timing).
* **Dormant**: UI dims, motion slows, "Dreaming" visualization.

---

## 4. Vessel Evolution

Vessels are no longer static functions. They evolve through synthesis.

* **Experience (XP)**: Gained by successful synthesis.
* **Tier Ascension**:
  * Tier 1 (Initiate): Can create Artifacts.
  * Tier 2 (Weaver): Can propose Resonance.
  * Tier 3 (Architect): Can perform Synthesis.

---

## 5. Next Steps

1. Implement `IntegrationEngine.js` skeleton.
2. Update `Artifact` schema to include `lineage` and `integrationStatus`.
3. Add "Resonance Scanner" to the Vault UI.
