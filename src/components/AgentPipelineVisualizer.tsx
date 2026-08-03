import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, ShieldAlert, Terminal, Eye, AlertTriangle } from 'lucide-react';

interface AgentPipelineVisualizerProps {
  logs: string[];
  isComplete: boolean;
}

export const AgentPipelineVisualizer: React.FC<AgentPipelineVisualizerProps> = ({ logs, isComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    { title: 'Orchestrator', desc: 'Parsing headers, body & files' },
    { title: 'Header Agent', desc: 'SPF, DKIM, DMARC & GeoIP' },
    { title: 'URL Agent', desc: 'WHOIS, Homographs & VirusTotal' },
    { title: 'Attachment Agent', desc: 'YARA & Macro analysis' },
    { title: 'Reasoning Engine', desc: 'Risk calculation & Verdict' },
  ];

  useEffect(() => {
    if (isComplete) {
      setCurrentStep(steps.length - 1);
      return;
    }

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);

    return () => clearInterval(timer);
  }, [isComplete]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white">Autonomous Agent Workflow Execution</h3>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950 border border-cyan-800/80 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Multi-Agent Reasoning Active
        </span>
      </div>

      {/* Stepper Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {steps.map((s, idx) => {
          const isActive = idx === currentStep && !isComplete;
          const isDone = idx < currentStep || isComplete;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                isDone
                  ? 'bg-slate-950 border-emerald-500/40 text-slate-200'
                  : isActive
                  ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-lg shadow-cyan-500/10 animate-pulse'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  0{idx + 1}. Agent
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isActive ? (
                  <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-slate-800" />
                )}
              </div>
              <p className="text-xs font-bold truncate">{s.title}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
