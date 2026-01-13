'use client';

import { Project } from '@/lib/nexus-store';

interface ProjectGraphProps {
    projects: Project[];
}

export function ProjectGraph({ projects }: ProjectGraphProps) {
    if (projects.length === 0) {
        return (
            <div className="glass-panel mt-6 p-12 text-center text-[var(--text-muted)]">
                No projects to visualize.
            </div>
        );
    }

    return (
        <div className="glass-panel mt-6 overflow-x-auto">
            <h3 className="font-medium mb-8">Project Topology</h3>
            <div className="flex gap-16 p-8 min-w-max">
                {projects.map(project => (
                    <div key={project.id} className="relative flex flex-col items-center">
                        {/* Project Node */}
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/20 border border-[var(--neon-blue)]/30 flex items-center justify-center text-center p-3 shadow-[0_0_20px_rgba(0,240,255,0.1)] z-10">
                            <span className="text-sm font-bold tracking-tight">{project.name}</span>
                        </div>
                        
                        {/* Connection Lines (SVG) */}
                        <div className="relative mt-8 flex gap-8">
                            {project.directives.length > 0 && (
                                <svg className="absolute -top-8 left-0 w-full h-8 overflow-visible" style={{ pointerEvents: 'none' }}>
                                    <defs>
                                        <linearGradient id={`grad-${project.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="rgba(0, 240, 255, 0.3)" />
                                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
                                        </linearGradient>
                                    </defs>
                                    {/* Vertical line from project down */}
                                    <line x1="50%" y1="0" x2="50%" y2="50%" stroke={`url(#grad-${project.id})`} strokeWidth="1" />
                                    {/* Horizontal line across all directives */}
                                    {project.directives.length > 1 && (
                                        <line 
                                            x1={`${100 / (project.directives.length * 2)}%`} 
                                            y1="50%" 
                                            x2={`${100 - (100 / (project.directives.length * 2))}%`} 
                                            y2="50%" 
                                            stroke={`url(#grad-${project.id})`} 
                                            strokeWidth="1" 
                                        />
                                    )}
                                    {/* Vertical lines down to each directive */}
                                    {project.directives.map((_, idx) => (
                                        <line 
                                            key={idx}
                                            x1={`${(100 / project.directives.length) * (idx + 0.5)}%`} 
                                            y1="50%" 
                                            x2={`${(100 / project.directives.length) * (idx + 0.5)}%`} 
                                            y2="100%" 
                                            stroke={`url(#grad-${project.id})`} 
                                            strokeWidth="1" 
                                        />
                                    ))}
                                </svg>
                            )}
                            
                            {project.directives.map(directive => (
                                <div key={directive.id} className="flex flex-col items-center w-24">
                                    <div className={`w-20 h-20 rounded-lg bg-white/5 border ${
                                        directive.status === 'complete' ? 'border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]' :
                                        directive.status === 'active' ? 'border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' :
                                        'border-white/10'
                                    } flex items-center justify-center text-center p-2 transition-all hover:bg-white/10 group`}>
                                        <span className="text-[10px] uppercase tracking-tighter leading-tight group-hover:text-white transition-colors">
                                            {directive.name}
                                        </span>
                                    </div>
                                    {directive.assignedVessel && (
                                        <div className="mt-2 text-[10px] text-[var(--text-muted)] font-mono">
                                            @{directive.assignedVessel.substring(0, 8)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
