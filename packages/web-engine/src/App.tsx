import { useState } from "react";
import "./App.css";
import { invokeEmergenceFlow } from "./GenkitClient";
import type { EmergenceResponse } from "./GenkitClient";
import { RealtimeMultimodal } from "./RealtimeMultimodal";
import { EmotionCheckIn } from "./EmotionCheckIn";
import { GraphView } from "./components/GraphView";
import type { Project } from "./engine/types";
import dbData from "../aetherium_db.json";

function App() {
  const [count, setCount] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('graph');

  // Cast data from JSON
  const projects = dbData.projects as unknown as Project[];

  const [flowResult, setFlowResult] = useState<EmergenceResponse | null>(null);

  const runTestFlow = async () => {
    const matrix = {
      I_vec: "Manual UI Test",
      E_vec: Math.random(),
      H_log: [],
      D_pot: Math.random(),
    };
    try {
      const response = await invokeEmergenceFlow(matrix);
      setFlowResult(response);
      console.log("[App] Emergence Flow Response:", response);
    } catch {
      console.error("Flow execution failed");
    }
  };

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src="/react.svg" className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Aetherium Game</h1>
      <p className="subtitle">Gemini 3.1 Powered OS/E</p>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={runTestFlow}>Run Emergence Flow</button>
        {flowResult && (
          <p className="flow-result fade-in">
            Protocol: {flowResult.result} | State: {flowResult.state}
          </p>
        )}
      </div>

      <div className="view-toggle">
        <button
          className={`toggle-btn list-mode ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          List View
        </button>
        <button
          className={`toggle-btn graph-mode ${viewMode === 'graph' ? 'active' : ''}`}
          onClick={() => setViewMode('graph')}
        >
          Graph View
        </button>
      </div>

      {viewMode === 'graph' ? (
        <GraphView projects={projects} emergence={flowResult} />
      ) : (
        <div className="project-list-container">
          {projects.map(p => (
            <div key={p.id} className="project-item">
              <h3>{p.name}</h3>
              <p className="project-status">{p.status}</p>
              <div className="tag-list">
                {p.tags.map((t: string) => <span key={t} className="tag-badge">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="aetherium-interface">
        <RealtimeMultimodal />
        <EmotionCheckIn onResult={(res) => setFlowResult(res)} />
      </div>

      <p className="read-the-docs">
        Powered by Project Emergence • Aetherium Hub v1.0
      </p>
    </>
  );
}

export default App;
