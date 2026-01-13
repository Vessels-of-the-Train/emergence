'use server';

import { spawn } from 'child_process';
import path from 'path';

/**
 * LAUNCH GODOT ENGINE
 * This action executes the local Godot executable to open the "Body" of the Aetherium.
 * 
 * @param mode - 'editor' (edit the project) or 'game' (run the simulation)
 */
export async function launchGodotAction(mode: 'editor' | 'game' = 'game') {
    console.log(`[System] Launching Godot in ${mode} mode...`);

    // Resolve the absolute path to the Godot project
    // Assuming the server is running from Desktop/Emergence
    const projectPath = path.resolve(process.cwd(), 'packages/godot-engine');

    const args = ['--path', projectPath];
    if (mode === 'editor') {
        args.push('-e'); // Open Editor
    }

    try {
        // Spawn the process detached so it survives if the server restarts
        const child = spawn('godot', args, {
            detached: true,
            stdio: 'ignore', 
            shell: true // Required for Windows to find the command in PATH
        });

        child.unref();
        return { success: true, message: `Godot ${mode} launched.` };
    } catch (error) {
        console.error("Failed to launch Godot:", error);
        return { success: false, message: "Failed to launch Godot. Ensure 'godot' is in your PATH." };
    }
}
