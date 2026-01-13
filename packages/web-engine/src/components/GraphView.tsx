import React, { useEffect, useRef, useState } from 'react';
import { GraphEngine } from '../engine/GraphEngine';
import type { Project, GraphNode } from '../engine/types';
import type { EmergenceResponse } from '../GenkitClient';
import { InspectorPanel } from './InspectorPanel';

interface GraphViewProps {
    projects: Project[];
    emergence?: EmergenceResponse | null;
}

export const GraphView: React.FC<GraphViewProps> = ({ projects, emergence }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<GraphEngine | null>(null);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

    useEffect(() => {
        if (canvasRef.current && !engineRef.current) {
            engineRef.current = new GraphEngine();
            engineRef.current.onNodeSelected = (node) => {
                setSelectedNode(node);
            };
            engineRef.current.init(canvasRef.current);
        }

        if (engineRef.current) {
            engineRef.current.updateData(projects);
            if (emergence) {
                engineRef.current.setEmergenceState(emergence);
            }
        }

        const handleResize = () => {
            if (engineRef.current) {
                engineRef.current.resize();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (engineRef.current) {
                engineRef.current.destroy();
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [projects, emergence]);

    return (
        <div className="graph-container">
            <canvas
                ref={canvasRef}
                className="graph-canvas"
            />
            <InspectorPanel
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
            />
            <div className="graph-hint">
                Drag nodes to move • Scroll to zoom (coming soon) • Click for details
            </div>
        </div>
    );
};
