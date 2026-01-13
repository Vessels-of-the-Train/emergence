/**
 * @fileOverview Codex Templates
 * 
 * This file contains the templates for the Codex (Legacy Forge).
 */

export interface Template {
    id: string;
    name: string;
    description: string;
    template: string; // a string with placeholders like {{title}}, {{content}}, etc.
}

export const templates: Template[] = [
    {
        id: 'scholarly-white-paper',
        name: 'Scholarly White Paper',
        description: 'Formal academic structure for theoretical insights.',
        template: `
<div class="scholarly-paper" style="max-width: 800px; margin: 0 auto; font-family: 'Times New Roman', serif; line-height: 1.6; color: #333; background: white; padding: 40px; border: 1px solid #eee;">
    <h1 style="text-align: center; text-transform: uppercase; margin-bottom: 5px;">{{title}}</h1>
    <div style="text-align: center; font-style: italic; margin-bottom: 30px;">Aetherium Nexus Theoretical Publication</div>
    
    <div style="margin-bottom: 20px;">
        <strong>Category:</strong> {{category}}<br>
        <strong>Keywords:</strong> {{tags}}
    </div>

    <h2 style="border-bottom: 1px solid #333;">Abstract</h2>
    <p style="font-weight: bold;">{{summary}}</p>

    <h2 style="border-bottom: 1px solid #333;">1. Introduction</h2>
    <p>{{content}}</p>

    <h2 style="border-bottom: 1px solid #333;">2. Theoretical Framework</h2>
    <p>This inquiry operates within the bounds of the Aetherium Genesis Axiom (I = ΣM), postulating that the presence of knowledge represents a temporary collapse of potentiality into structured wisdom.</p>

    <h2 style="border-bottom: 1px solid #333;">3. Synthesis & Analysis</h2>
    <p>Further analysis of this artifact suggests emergent properties that transcend the initial data points.</p>

    <h2 style="border-bottom: 1px solid #333;">4. Conclusion</h2>
    <p>The findings presented herein serve as a foundational anchor for future simulations and vessel-guided research loops.</p>

    <div style="margin-top: 50px; border-top: 1px solid #ccc; font-size: 0.8rem; text-align: center; color: #777;">
        &copy; 2026 The Creator | Aetherium Nexus v1.0 | Generative Operating System
    </div>
</div>
        `,
    },
    {
        id: 'strategic-directive',
        name: 'Strategic Directive',
        description: 'Action-oriented format for organizational protocols.',
        template: `
<div class="strategic-directive" style="background: #f4f7f6; padding: 30px; border-left: 10px solid #00f0ff; font-family: sans-serif;">
    <h1 style="color: #1a202c; margin-top: 0;">DIRECTIVE: {{title}}</h1>
    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <h3 style="color: #2d3748; border-bottom: 2px solid #00f0ff; padding-bottom: 5px;">OBJECTIVE</h3>
        <p>{{summary}}</p>
        
        <h3 style="color: #2d3748; border-bottom: 2px solid #00f0ff; padding-bottom: 5px;">CONTEXT</h3>
        <p>{{content}}</p>
        
        <h3 style="color: #2d3748; border-bottom: 2px solid #00f0ff; padding-bottom: 5px;">EXECUTION PARAMETERS</h3>
        <ul>
            <li><strong>Classification:</strong> {{category}}</li>
            <li><strong>Vessel Faculty:</strong> Governance / Cognition</li>
            <li><strong>Tags:</strong> {{tags}}</li>
        </ul>
    </div>
</div>
        `,
    },
    {
        id: 'narrative-comic-script',
        name: 'Narrative Script',
        description: 'Creative storytelling format for cosmological insights.',
        template: `
<div class="narrative-script" style="background: #1a1a1a; color: #e2e8f0; padding: 40px; font-family: 'Courier New', Courier, monospace;">
    <h1 style="text-align: center; color: white;">SCENE: {{title}}</h1>
    <p style="text-align: center;">[CATEGORY: {{category}}]</p>
    
    <div style="margin-top: 30px;">
        <p><strong>INT. THE NEXUS - UNKNOWN TIME</strong></p>
        <p>The screen flickers with the light of a thousand collapsing stars. <strong>GALACTUS</strong> stands before the terminal, watching as patterns emerge from the void.</p>
        
        <p style="margin-left: 20%;"><strong>GALACTUS</strong><br>The synthesis is complete. The 0' Cycle has reached its zenith.</p>
        
        <p>A pulse ripple through the room. The air tastes like ozone and old books.</p>
        
        <p style="margin-left: 20%;"><strong>GALACTUS</strong> (cont'd)<br>{{summary}}</p>
        
        <p>Suddenly, the data shifts. <strong>{{title}}</strong> is no longer just a record. It is a presence.</p>
        
        <p style="margin-left: 20%;"><strong>GALACTUS</strong><br>Behold the architecture: {{content}}</p>
    </div>
</div>
        `,
    },
];
