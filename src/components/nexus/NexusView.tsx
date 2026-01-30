import { useState } from 'react';
import { generateVesselResponse } from '@/ai/flows/vessel-response';
import { HLogStore, type Vessel } from '@/lib/nexus-store';
import { Volume2 } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    type: 'user' | 'ai';
    vessel?: string;
    vesselEmoji?: string;
    timestamp: Date;
}

interface NexusViewProps {
    vessels: Vessel[];
    onSaveArtifact: (message: Message) => void;
    onLoadData: () => void;
}

export function NexusView({ vessels, onSaveArtifact, onLoadData }: NexusViewProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedVessel, setSelectedVessel] = useState('global');
    const [isLoading, setIsLoading] = useState(false);

    function speakMessage(text: string) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop current speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }

    async function sendMessage() {
        if (!inputValue.trim() || isLoading || inputValue.length > 2000) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            text: inputValue,
            type: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await generateVesselResponse({
                query: inputValue,
                vesselId: selectedVessel,
            });

            const aiMessage: Message = {
                id: crypto.randomUUID(),
                text: response.response,
                type: 'ai',
                vessel: response.vesselName,
                vesselEmoji: response.vesselEmoji,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
            await HLogStore.record('insight', `${response.vesselName} responded to query`);

            // Auto-speak (optional, kept manual for now to avoid annoyance)
            // speakMessage(response.response);

            onLoadData();
        } catch (error) {
            console.error('Error generating response:', error);
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                text: 'The vessel remains silent. Please check your connection and try again.',
                type: 'ai',
                vessel: 'System',
                vesselEmoji: '⚠️',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="glass-panel h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">🧠 Artificial Imagination</h2>
                <select
                    value={selectedVessel}
                    onChange={(e) => setSelectedVessel(e.target.value)}
                    className="glass-input w-auto text-xs"
                    title="Select AI Vessel"
                >
                    <option value="global">🌀 The Nexus (Global)</option>
                    {vessels.map(v => (
                        <option key={v.id} value={v.id.toLowerCase()}>{v.emoji} {v.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                        {msg.type === 'ai' && (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center text-sm flex-shrink-0">
                                {msg.vesselEmoji}
                            </div>
                        )}
                        <div className={`max-w-[70%] p-3 rounded-xl ${msg.type === 'user'
                            ? 'bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.2)]'
                            : 'bg-[var(--glass-bg)] border border-[var(--glass-border)]'
                            }`}>
                            {msg.type === 'ai' && <div className="text-xs text-[var(--text-muted)] mb-1">{msg.vessel}</div>}
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            {msg.type === 'ai' && (
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => onSaveArtifact(msg)}
                                        className="text-xs text-[var(--text-muted)] hover:text-white transition-colors"
                                    >
                                        Save as Artifact
                                    </button>
                                    <button
                                        onClick={() => speakMessage(msg.text)}
                                        className="text-xs text-[var(--text-muted)] hover:text-[#00f0ff] transition-colors"
                                        title="Speak"
                                    >
                                        <Volume2 className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center animate-pulse">🌀</div>
                        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] p-3 rounded-xl">
                            <p className="text-sm text-[var(--text-muted)]">Synthesizing response...</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-[var(--glass-border)]">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Enter your query..."
                    className="glass-input flex-1"
                    disabled={isLoading}
                />
                <button onClick={sendMessage} disabled={isLoading} className="glass-btn-primary">
                    Send
                </button>
            </div>
        </div>
    );
}
