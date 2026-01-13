/**
 * @fileOverview Simulation Models
 * 
 * This file contains the implementation of the simulation models.
 * Currently implements a Boids flocking simulation.
 */

export interface Agent {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    group: number;
}

export class BasicAgentModel {
    private agents: Agent[] = [];
    private gridSize: number;
    private numAgents: number;

    // Boids Parameters
    private visualRange = 40;
    private protectedRange = 8;
    private centeringFactor = 0.005; // Cohesion
    private avoidFactor = 0.05;      // Separation
    private matchingFactor = 0.05;   // Alignment
    private turnFactor = 0.2;        // Boundary turning
    private maxSpeed = 3;
    private minSpeed = 2;

    constructor(numAgents: number, gridSize: number) {
        this.gridSize = gridSize;
        this.numAgents = numAgents;
        this.initializeAgents();
    }

    private initializeAgents() {
        this.agents = [];
        for (let i = 0; i < this.numAgents; i++) {
            this.agents.push({
                id: i,
                x: Math.random() * this.gridSize,
                y: Math.random() * this.gridSize,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                group: Math.floor(Math.random() * 3) // For visual variety
            });
        }
    }

    public runStep() {
        for (const agent of this.agents) {
            let closeDx = 0;
            let closeDy = 0;
            let xvelAvg = 0;
            let yvelAvg = 0;
            let xposAvg = 0;
            let yposAvg = 0;
            let neighboringBoids = 0;

            for (const other of this.agents) {
                if (agent.id !== other.id) {
                    const dx = agent.x - other.x;
                    const dy = agent.y - other.y;
                    const distanceSquared = dx * dx + dy * dy;

                    // Separation: Avoid crowding
                    if (distanceSquared < this.protectedRange * this.protectedRange) {
                        closeDx += agent.x - other.x;
                        closeDy += agent.y - other.y;
                    }

                    // Alignment & Cohesion: Match neighbors
                    if (distanceSquared < this.visualRange * this.visualRange) {
                        xvelAvg += other.vx;
                        yvelAvg += other.vy;
                        xposAvg += other.x;
                        yposAvg += other.y;
                        neighboringBoids++;
                    }
                }
            }

            // Apply Separation
            agent.vx += closeDx * this.avoidFactor;
            agent.vy += closeDy * this.avoidFactor;

            if (neighboringBoids > 0) {
                // Apply Alignment
                xvelAvg = xvelAvg / neighboringBoids;
                yvelAvg = yvelAvg / neighboringBoids;
                agent.vx += (xvelAvg - agent.vx) * this.matchingFactor;
                agent.vy += (yvelAvg - agent.vy) * this.matchingFactor;

                // Apply Cohesion
                xposAvg = xposAvg / neighboringBoids;
                yposAvg = yposAvg / neighboringBoids;
                agent.vx += (xposAvg - agent.x) * this.centeringFactor;
                agent.vy += (yposAvg - agent.y) * this.centeringFactor;
            }

            // Boundary Avoidance (Soft Turn)
            const margin = 20;
            if (agent.x < margin) agent.vx += this.turnFactor;
            if (agent.x > this.gridSize - margin) agent.vx -= this.turnFactor;
            if (agent.y < margin) agent.vy += this.turnFactor;
            if (agent.y > this.gridSize - margin) agent.vy -= this.turnFactor;

            // Speed Limit
            const speed = Math.sqrt(agent.vx * agent.vx + agent.vy * agent.vy);
            if (speed > this.maxSpeed) {
                agent.vx = (agent.vx / speed) * this.maxSpeed;
                agent.vy = (agent.vy / speed) * this.maxSpeed;
            } else if (speed < this.minSpeed) {
                 agent.vx = (agent.vx / speed) * this.minSpeed;
                 agent.vy = (agent.vy / speed) * this.minSpeed;
            }

            // Update Position
            agent.x += agent.vx;
            agent.y += agent.vy;
        }
    }

    public getAgents(): Agent[] {
        return this.agents;
    }
}

/**
 * Knowledge Diffusion Model
 * 
 * Simulates the spread of "insights" across a social graph.
 * Agents have a "knowledge level" which increases when they encounter others.
 */
export interface KnowledgeAgent extends Agent {
    knowledgeLevel: number;
    connections: number[];
}

export class KnowledgeDiffusionModel {
    private agents: KnowledgeAgent[] = [];
    private gridSize: number;
    private numAgents: number;
    private interactionRange = 15;

    constructor(numAgents: number, gridSize: number) {
        this.gridSize = gridSize;
        this.numAgents = numAgents;
        this.initializeAgents();
    }

    private initializeAgents() {
        this.agents = [];
        for (let i = 0; i < this.numAgents; i++) {
            this.agents.push({
                id: i,
                x: Math.random() * this.gridSize,
                y: Math.random() * this.gridSize,
                vx: (Math.random() * 2 - 1) * 2,
                vy: (Math.random() * 2 - 1) * 2,
                group: 0,
                knowledgeLevel: Math.random() > 0.95 ? 1 : 0, // 5% start with an "insight"
                connections: []
            });
        }
    }

    public runStep() {
        for (const agent of this.agents) {
            // Random movement (Brownian-ish)
            agent.vx += (Math.random() * 0.4 - 0.2);
            agent.vy += (Math.random() * 0.4 - 0.2);

            // Boundary bounce
            if (agent.x < 0 || agent.x > this.gridSize) agent.vx *= -1;
            if (agent.y < 0 || agent.y > this.gridSize) agent.vy *= -1;

            agent.x += agent.vx;
            agent.y += agent.vy;

            // Interaction / Knowledge Transfer
            for (const other of this.agents) {
                if (agent.id !== other.id) {
                    const dx = agent.x - other.x;
                    const dy = agent.y - other.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < this.interactionRange * this.interactionRange) {
                        // Transfer knowledge if one has it
                        if (agent.knowledgeLevel > 0 && other.knowledgeLevel < 1) {
                            other.knowledgeLevel += 0.1; // Gradual learning
                        } else if (other.knowledgeLevel > 0 && agent.knowledgeLevel < 1) {
                            agent.knowledgeLevel += 0.1;
                        }
                        
                        // Update visual group based on knowledge
                        agent.group = Math.floor(agent.knowledgeLevel * 5);
                        other.group = Math.floor(other.knowledgeLevel * 5);
                    }
                }
            }
        }
    }

    public getAgents(): KnowledgeAgent[] {
        return this.agents;
    }
}
