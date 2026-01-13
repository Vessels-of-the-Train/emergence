'use client';

import { useState } from 'react';

import { HLogEvent, HLogStore } from '@/lib/nexus-store';

import DOMPurify from 'dompurify';

import { Edit3, History, Save, X } from 'lucide-react';



interface HLogViewProps {

    hlogEvents: HLogEvent[];

    pulse: number;

    somaticState: string;

    onLoadData: () => void;

}



export function HLogView({ hlogEvents, pulse, somaticState, onLoadData }: HLogViewProps) {

    const [newHlogEntry, setNewHlogEntry] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);

    const [editContent, setEditContent] = useState('');

    const [showHistoryId, setShowHistoryId] = useState<string | null>(null);



    async function handleCreateHlogEntry() {

        if (!newHlogEntry.trim()) return;

        await HLogStore.record('manual', newHlogEntry);

        setNewHlogEntry('');

        onLoadData();

    }



    async function handleUpdateEntry(id: string, type: HLogEvent['type']) {

        if (!editContent.trim()) return;

        await HLogStore.updateHlogEntry(id, editContent, type);

        setEditingId(null);

        onLoadData();

    }



    return (

        <div className="space-y-6">

            <h2 className="text-lg font-medium">💓 The H_log</h2>

            

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: Somatic Compass */}

                <div className="lg:col-span-4 flex flex-col items-center justify-center glass-panel p-8">

                    <div className="relative">

                        <div className={`w-48 h-48 rounded-full flex items-center justify-center animate-heartbeat flex-shrink-0 relative z-10`}

                             style={{ background: `radial-gradient(circle, rgba(${

                                somaticState === 'Synthesizing' ? '255, 165, 0' : 

                                somaticState === 'Active' ? '0, 255, 153' : 

                                '0, 240, 255'

                             }, 0.2)_0%, transparent_70%)` }}

                        >

                            <div className="text-center">

                                <span className="text-5xl font-bold neon-text-blue">{pulse}</span>

                                <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mt-1">BPM</div>

                            </div>

                        </div>

                        {/* Pulse rings */}

                        <div className="absolute inset-0 rounded-full border border-[var(--neon-blue)] opacity-20 animate-ping" />

                    </div>

                    <div className="mt-6 text-center">

                        <span className="text-sm font-bold uppercase tracking-widest text-white">{somaticState}</span>

                        <p className="text-[10px] text-[var(--text-muted)] mt-1">Somatic Sync: 100%</p>

                    </div>

                </div>



                {/* Right: Activity Stream */}

                <div className="lg:col-span-8 space-y-4">

                    <div className="glass-panel p-4">

                        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-[var(--text-muted)]">Manual Record</h3>

                        <div className="flex gap-3">

                            <textarea

                                placeholder="Capture a somatic observation or directive..."

                                className="glass-input flex-1 h-20 text-sm"

                                value={newHlogEntry}

                                onChange={(e) => setNewHlogEntry(e.target.value)}

                            />

                            <button 

                                onClick={handleCreateHlogEntry} 

                                className="glass-btn-primary px-6 h-20 flex flex-col items-center justify-center gap-2"

                            >

                                <Save className="h-4 w-4" />

                                <span className="text-[10px] uppercase font-bold">Record</span>

                            </button>

                        </div>

                    </div>



                    <div className="glass-panel overflow-hidden">

                        <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">

                            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Event Horizon</h3>

                            <span className="text-[10px] font-mono text-[var(--text-muted)]">{hlogEvents.length} Records</span>

                        </div>

                        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">

                            {hlogEvents.length === 0 ? (

                                <p className="text-[var(--text-muted)] text-center py-12 text-sm italic">No activity recorded in the current epoch.</p>

                            ) : (

                                <div className="divide-y divide-white/5">

                                    {hlogEvents.map((e) => (

                                        <div key={e.id} className="p-4 hover:bg-white/[0.02] transition-colors group">

                                            <div className="flex gap-4 items-start">

                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm flex-shrink-0 border border-white/10 group-hover:border-[var(--neon-blue)]/30 transition-colors">

                                                    {e.type === 'system' ? '⚙️' : e.type === 'insight' ? '💡' : e.type === 'vessel' ? '👤' : e.type === 'synthesis' ? '🔮' : '📌'}

                                                </div>

                                                <div className="flex-1 min-w-0">

                                                    {editingId === e.id ? (

                                                        <div className="space-y-2">

                                                            <textarea 

                                                                className="glass-input w-full text-sm h-24"

                                                                value={editContent}

                                                                onChange={(e) => setEditContent(e.target.value)}

                                                            />

                                                            <div className="flex gap-2">

                                                                <button onClick={() => handleUpdateEntry(e.id, e.type)} className="text-[10px] uppercase font-bold text-green-400 flex items-center gap-1">

                                                                    <Save className="h-3 w-3" /> Save

                                                                </button>

                                                                <button onClick={() => setEditingId(null)} className="text-[10px] uppercase font-bold text-red-400 flex items-center gap-1">

                                                                    <X className="h-3 w-3" /> Cancel

                                                                </button>

                                                            </div>

                                                        </div>

                                                    ) : (

                                                        <>

                                                            <div className="text-sm text-white/90 leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(e.description.replace(/\n/g, '<br />')) }}></div>

                                                            <div className="flex items-center gap-4 mt-2">

                                                                <span className="text-[10px] font-mono text-[var(--text-muted)]">{new Date(e.created_at).toLocaleTimeString()}</span>

                                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                                                                    <button 

                                                                        onClick={() => { setEditingId(e.id); setEditContent(e.description); }}

                                                                        className="text-[10px] uppercase font-bold text-[var(--text-muted)] hover:text-[var(--neon-blue)] flex items-center gap-1"

                                                                    >

                                                                        <Edit3 className="h-3 w-3" /> Edit

                                                                    </button>

                                                                    {e.history && e.history.length > 0 && (

                                                                        <button 

                                                                            onClick={() => setShowHistoryId(showHistoryId === e.id ? null : e.id)}

                                                                            className="text-[10px] uppercase font-bold text-[var(--text-muted)] hover:text-[var(--neon-purple)] flex items-center gap-1"

                                                                        >

                                                                            <History className="h-3 w-3" /> {showHistoryId === e.id ? 'Hide' : 'History'} ({e.history.length})

                                                                        </button>

                                                                    )}

                                                                </div>

                                                            </div>

                                                        </>

                                                    )}



                                                    {showHistoryId === e.id && e.history && (

                                                        <div className="mt-4 space-y-3 pl-4 border-l-2 border-white/10 animate-in slide-in-from-left-2">

                                                            {e.history.map((h, i) => (

                                                                <div key={i} className="text-[11px] text-[var(--text-muted)] italic bg-white/5 p-2 rounded">

                                                                    <div className="font-bold mb-1">Version {i + 1} - {new Date(h.modified_at).toLocaleString()}</div>

                                                                    {h.description}

                                                                </div>

                                                            ))}

                                                        </div>

                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


