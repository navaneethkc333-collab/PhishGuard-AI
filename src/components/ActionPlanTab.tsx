import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { AIReasoningResult } from '../types';

interface ActionPlanTabProps {
  aiReasoning: AIReasoningResult;
}

export const ActionPlanTab: React.FC<ActionPlanTabProps> = ({ aiReasoning }) => {
  return (
    <div className="space-y-6" id="soc-action-plan-section">
      {/* Recommended Action Checklist */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Prioritized SOC Remediation Playbook
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {aiReasoning.recommendedActions.length} Actions
          </span>
        </div>

        <div className="space-y-3">
          {aiReasoning.recommendedActions.map((act, idx) => (
            <div
              key={act.id || idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold mt-0.5 flex-shrink-0 ${
                    act.priority === 'CRITICAL'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : act.priority === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}
                >
                  {act.priority}
                </span>

                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{act.action}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{act.details}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 self-end sm:self-center flex-shrink-0">
                {act.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
