/**
 * @fileOverview Scenario Runner - Autonomous Task Engine for the Aetherium
 * 
 * This engine allows Vessels to execute complex multi-step scenarios
 * following the Action -> Environment -> Observation cycle.
 */

import { ProjectStore, ArtifactStore, HLogStore, Directive } from './nexus-store';
import { generateVesselResponse } from '@/ai/flows/vessel-response';

export class ScenarioRunner {
    /**
     * Initializes a scenario for a directive.
     */
    public static async initializeScenario(projectId: string, directiveId: string, objective: string) {
        const { data: projects } = await (await import('./supabase')).supabase.from('projects').select('*').eq('id', projectId);
        if (!projects || projects.length === 0) return;

        const project = projects[0];
        const updatedDirectives = project.directives.map((d: Directive) => {
            if (d.id === directiveId) {
                return {
                    ...d,
                    status: 'active',
                    scenario_data: {
                        objective,
                        current_state: 'INITIALIZING',
                        logs: [`[SYSTEM] Scenario initialized: ${objective}`],
                        is_running: true
                    }
                };
            }
            return d;
        });

        await ProjectStore.updateDirectives(projectId, updatedDirectives);
        await HLogStore.record('system', `[SYSTEM] Scenario initialized: ${objective}`);
    }

    /**
     * Executes a single step in the scenario.
     */
    public static async step(projectId: string, directiveId: string) {
        // 1. Fetch current directive state
        const { data: projects } = await (await import('./supabase')).supabase.from('projects').select('*').eq('id', projectId);
        if (!projects || projects.length === 0) return;

        const project = projects[0];
        const directive = project.directives.find((d: any) => d.id === directiveId);
        
        if (!directive || !directive.scenario_data || !directive.scenario_data.is_running) return;

        const { objective, current_state, logs } = directive.scenario_data;
        const vesselId = directive.assignedVessel || 'global';

        // 2. Decide next action using AI
        const prompt = `
            CURRENT SCENARIO:
            Objective: ${objective}
            Current State: ${current_state}
            Last Logs: ${logs.slice(-3).join('\n')}

            As an autonomous vessel, what is your next specific action to move closer to the objective? 
            Choose from: SEARCH_VAULT, READ_ARTIFACT, ANALYZE_DATA, SYNTHESIZE_INSIGHT, COMPLETE.
            Respond with the ACTION name and a brief reasoning.
        `;

        const response = await generateVesselResponse({ query: prompt, vesselId });
        const actionMatch = response.response.match(/SEARCH_VAULT|READ_ARTIFACT|ANALYZE_DATA|SYNTHESIZE_INSIGHT|COMPLETE/);
        const action = actionMatch ? actionMatch[0] : 'ANALYZE_DATA';

        // 3. Process action (Simulated environment interactions)
        let observation = "";
        let nextState = current_state;

        switch(action) {
            case 'SEARCH_VAULT':
                const artifacts = await ArtifactStore.getAll();
                observation = `Found ${artifacts.length} artifacts in the vault related to the objective.`;
                nextState = 'RESEARCHING';
                break;
            case 'READ_ARTIFACT':
                observation = `Vessel is deep-reading specific data nodes for pattern extraction.`;
                nextState = 'EXTRACTING';
                break;
            case 'SYNTHESIZE_INSIGHT':
                observation = `Synthesis logic triggered. Mapping cross-domain resonance.`;
                nextState = 'SYNTHESIZING';
                break;
            case 'COMPLETE':
                observation = `Objective attained. Closing research loop.`;
                nextState = 'FINISHED';
                break;
            default:
                observation = `Processing internal state and logic gates.`;
        }

        // 4. Update state and logs
        const newLogs = [...logs, `[ACTION: ${action}] ${response.response.split('\n')[0]}`, `[OBSERVATION] ${observation}`];
        const updatedDirectives = project.directives.map((d: any) => {
            if (d.id === directiveId) {
                return {
                    ...d,
                    status: action === 'COMPLETE' ? 'complete' : 'active',
                    scenario_data: {
                        ...d.scenario_data,
                        current_state: nextState,
                        logs: newLogs,
                        next_action: action,
                        is_running: action !== 'COMPLETE'
                    }
                };
            }
            return d;
        });

        await ProjectStore.updateDirectives(projectId, updatedDirectives);
        
        if (action === 'COMPLETE') {
            await HLogStore.record('synthesis', `Autonomous Task Completed: ${objective}`);
        }
    }
}
