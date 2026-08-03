import React from 'react';
import { AlertTriangle, AlertCircle, Info, ShieldAlert, FileText, Globe, Link as LinkIcon, Paperclip } from 'lucide-react';
import { EvidenceItem } from '../types';

interface EvidenceChainProps {
  evidenceList: EvidenceItem[];
}

export const EvidenceChain: React.FC<EvidenceChainProps> = ({ evidenceList }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-800">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-950 text-yellow-300 border border-yellow-800">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">LOW</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">INFO</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'header':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'url':
        return <LinkIcon className="w-4 h-4 text-purple-400" />;
      case 'attachment':
        return <Paperclip className="w-4 h-4 text-amber-400" />;
      case 'impersonation':
        return <Globe className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Correlated Threat Evidence Chain ({evidenceList.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Key evidence extracted and reasoned across header, URL, attachment, and impersonation modules.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {evidenceList.map((ev, idx) => (
          <div
            key={ev.id || idx}
            className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 mt-0.5">
                {getCategoryIcon(ev.category)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white">{ev.title}</span>
                  {getSeverityBadge(ev.severity)}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{ev.detail}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                Source: {ev.source}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
