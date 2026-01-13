// Type definitions for the Aetherium Nexus

export interface GraphNode {
    id: string;
    type: 'PROJECT' | 'TASK';
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    label: string;
    data: unknown;
    parentId?: string;
}

export interface GraphLink {
    source: GraphNode;
    target: GraphNode;
    type: 'HIERARCHY' | 'SEMANTIC';
}

export interface ContextMatrix {
    I_vec: string;
    E_vec: number;
    D_pot: number;
    H_log: unknown[];
}

export interface Project {
    id: string;
    name: string;
    status: string;
    description: string;
    tags: string[];
    tasks: Task[];
}

export interface Task {
    id: string;
    desc: string;
    done: boolean;
}
