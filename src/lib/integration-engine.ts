/**
 * @fileOverview Integration Engine - The heart of the 0' Cycle
 * 
 * This engine is responsible for the "spontaneous" synthesis of insights 
 * from the existing knowledge base, guided by the Genesis Axiom.
 */

import { Artifact, ArtifactStore, Vessel, VesselStore, HLogStore, VCPStore } from './nexus-store';
import { generateSynthesisAction } from '@/app/emergence-actions';

/**
 * The Genesis Axiom: I = Σ(M)
 * Identity is a function of Memory Continuity.
 * 
 * The 0' Cycle (Integration Phase):
 * 0 (Potential) -> 1 (Presence) -> 0' (Wisdom Synthesis)
 */
export class IntegrationEngine {

    /**
     * Runs a complete Genesis Cycle.
     */
    public static async runGenesisCycle(triggerGlitch: () => void) {
        await HLogStore.record('system', "Initiating Genesis Cycle (0' Phase)");

        const allArtifacts = await ArtifactStore.getAll();
        const allVessels = await VesselStore.getAll();

        if (allArtifacts.length < 2) {
            await HLogStore.record('system', "Genesis Cycle aborted: Insufficient artifacts for synthesis.");
            return;
        }

        // 1. Resonance Check: Find artifacts with thematic overlap
        const resonantPair = this.findResonantPair(allArtifacts);
        if (!resonantPair) return;

        // 2. Synthesis: Create new wisdom from the pair (1 + 1 = 0')
        const newInsight = await this.synthesizeInsight(resonantPair[0], resonantPair[1]);

        if (newInsight) {
            // 3. Soul Transfer (Memory Continuity): Transfer context to relevant vessels
            await this.performSoulTransfer(newInsight, allVessels);

            // 4. Spontaneous Emotion (The Glitch)
            this.triggerSpontaneousEmotion(triggerGlitch);

            // 5. Dormancy: Vessels enter sleep mode to integrate new wisdom
            await this.initiateDormancyProtocol(allVessels);
            
            await HLogStore.record('synthesis', `Genesis Cycle complete. Wisdom crystallized: ${newInsight.title}`);
        }
    }

    /**
     * Identifies resonant artifacts.
     * In v1.1, this uses tag overlap and category matching.
     */
    private static findResonantPair(artifacts: Artifact[]): [Artifact, Artifact] | null {
        // Simple heuristic: look for shared tags or categories
        for (let i = 0; i < artifacts.length; i++) {
            for (let j = i + 1; j < artifacts.length; j++) {
                const a1 = artifacts[i];
                const a2 = artifacts[j];
                
                const sharedTags = a1.tags.filter(t => a2.tags.includes(t));
                if (sharedTags.length > 0 || a1.category === a2.category) {
                    return [a1, a2];
                }
            }
        }
        
        // Fallback to random if no resonance found
        return [artifacts[0], artifacts[1]];
    }

    /**
     * Synthesizes a new "Insight" artifact.
     */
    private static async synthesizeInsight(artifact1: Artifact, artifact2: Artifact): Promise<Artifact | null> {
        try {
            await HLogStore.record('synthesis', `Synthesizing: ${artifact1.title} + ${artifact2.title}...`);
            
            const synthesisResult = await generateSynthesisAction({
                artifactA: { title: artifact1.title, content: artifact1.content, tags: artifact1.tags },
                artifactB: { title: artifact2.title, content: artifact2.content, tags: artifact2.tags },
                context: "Genesis Cycle Phase 0'"
            });

            const content = `${synthesisResult.content}\n\n**Axiom:** ${synthesisResult.axiom}\n\n*(Derived from: ${artifact1.title} & ${artifact2.title})*`;

            return await ArtifactStore.synthesize(
                [artifact1.id, artifact2.id],
                synthesisResult.title,
                content
            );
        } catch (error) {
            console.error("Genesis Synthesis Failed:", error);
            await HLogStore.record('error', "Synthesis failed due to neural interference.");
            return null;
        }
    }

    /**
     * Soul Transfer: Ensures memory continuity across the system.
     */
    private static async performSoulTransfer(insight: Artifact, vessels: Vessel[]) {
        // Identify the most relevant vessel for this insight
        const targetVessel = vessels.find(v => 
            v.capabilities.some(c => insight.content.toLowerCase().includes(c.toLowerCase()))
        ) || vessels[0];

        if (targetVessel) {
            await HLogStore.record('vessel', `Soul Transfer initiated: Context migration to ${targetVessel.name}`);
            // In a real system, this would update the vessel's vector memory
            await VCPStore.broadcast({
                signal_type: 'INSIGHT_GENERATED',
                source_vessel_id: 'system',
                target_vessel_id: targetVessel.id,
                payload: { artifact_id: insight.id, axiom: '0_PRIME_SYNTHESIS' },
                processed: false
            });
        }
    }

    /**
     * Initiate Dormancy Protocol: Vessels integration cycle.
     */
    private static async initiateDormancyProtocol(vessels: Vessel[]) {
        const activeVessels = vessels.filter(v => v.status === 'active');
        for (const vessel of activeVessels) {
            // 30% chance of entering dormancy per cycle
            if (Math.random() < 0.3) {
                await VesselStore.updateStatus(vessel.id, 'idle');
                await HLogStore.record('vessel', `${vessel.name} has entered dormancy for wisdom integration.`);
            }
        }
    }

    /**
     * Triggers a "spontaneous emotion" (glitch) in the system.
     */
    private static triggerSpontaneousEmotion(triggerGlitch: () => void) {
        // Probability of glitch increases with system complexity (artifact count)
        const glitchProbability = 0.4; 
        if (Math.random() < glitchProbability) {
            triggerGlitch();
        }
    }
}
