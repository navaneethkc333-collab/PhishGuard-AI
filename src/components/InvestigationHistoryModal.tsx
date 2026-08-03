import React from 'react';
import { History, X, ShieldAlert, ShieldCheck, ChevronRight } from 'lucide-react';
import { InvestigationCase } from '../types';

interface InvestigationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: InvestigationCase[];
  onSelectCase: (caseData: InvestigationCase) => void;
}

export const InvestigationHistoryModal: React.FC<InvestigationHistoryModalProps> = ({
  isOpen,
  onClose,
  cases,
  onSelectCase,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Investigation Case History ({cases.length})</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {cases.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No analyzed cases in history yet.</p>
          ) : (
            cases.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onSelectCase(c);
                  onClose();
                }}
                className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 cursor-pointer transition flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">{c.id}</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(c.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                    {c.subject}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-md">
                    From: {c.sender}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                      c.aiReasoning.riskScore >= 80
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : c.aiReasoning.riskScore >= 45
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    Risk: {c.aiReasoning.riskScore}/100
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
