// src/VoiceAnalyzer.tsx - Web Audio API for sensory perception
import React, { useRef, useState } from "react";

interface VoiceAnalyzerProps {
    onIntensityChange?: (intensity: number) => void;
}

export const VoiceAnalyzer: React.FC<VoiceAnalyzerProps> = ({ onIntensityChange }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const [isListening, setIsListening] = useState(false);

    const startListening = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContextRef.current = new AudioContext();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyzerRef.current = audioContextRef.current.createAnalyser();
            analyzerRef.current.fftSize = 256;
            source.connect(analyzerRef.current);
            setIsListening(true);
            draw();
        } catch (err) {
            console.error("Could not access microphone:", err);
        }
    };

    const draw = () => {
        if (!analyzerRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);

        const renderFrame = () => {
            if (!isListening) return;
            requestAnimationFrame(renderFrame);

            analyzerRef.current?.getByteFrequencyData(dataArray);

            // Calculate real-time intensity (E_vec estimate)
            const sum = dataArray.reduce((acc, val) => acc + val, 0);
            const intensity = sum / (dataArray.length * 255);
            if (onIntensityChange) onIntensityChange(intensity);

            // Draw Visualization
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(100, 108, 255, 0.2)";
            ctx.beginPath();

            const width = canvas.width;
            const height = canvas.height;
            const barWidth = width / dataArray.length;

            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = (dataArray[i] / 255) * height;
                ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
            }
        };

        renderFrame();
    };

    return (
        <div className="voice-analyzer">
            <div className="controls">
                <button
                    onClick={isListening ? () => setIsListening(false) : startListening}
                    className={isListening ? "active" : ""}
                >
                    {isListening ? "Neural Link Active" : "Initiate Neural Link"}
                </button>
            </div>
            <canvas ref={canvasRef} width={300} height={60} />
            {isListening && <p className="status-pulse">Perception Field: ACTIVE</p>}
        </div>
    );
};
