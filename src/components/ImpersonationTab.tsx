import React from 'react';
import { Globe, ShieldAlert, CheckCircle2, ArrowRightLeft, AlertOctagon } from 'lucide-react';
import { ImpersonationResult } from '../types';

interface ImpersonationTabProps {
  impersonation: ImpersonationResult;
}

export const ImpersonationTab: React.FC<ImpersonationTabProps> = ({ impersonation }) => {
  if (!impersonation.detected) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
        <p className="text-sm font-semibold text-white">No Domain or Brand Impersonation Detected</p>
        <p className="text-xs text-slate-500 mt-1">Sender domain matches authentic corporate or trusted origin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Brand Impersonation & Homoglyph Threat Analysis
            </h3>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-950 text-red-400 border border-red-800">
            {impersonation.riskLevel} RISK
          </span>
        </div>

        {/* Side-by-Side Domain Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Legitimate Brand Card */}
          <div className="bg-emerald-950/20 border border-emerald-800/80 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Legitimate Canonical Brand Domain
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-mono font-bold text-white">
              {impersonation.legitimateDomain || 'microsoft.com'}
            </div>
            <p className="text-xs text-slate-400">
              Targeted Brand: <strong className="text-emerald-300">{impersonation.brandName}</strong>
            </p>
          </div>

          {/* Fake Spoofed Domain Card */}
          <div className="bg-red-950/20 border border-red-800/80 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold">
                Attacker Spoofed / Homograph Domain
              </span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-lg font-mono font-bold text-red-300">
              {impersonation.fakeDomain || 'micr0soft-security-verify.net'}
            </div>
            <p className="text-xs text-slate-400">
              Homograph Type: <strong className="text-red-300">{impersonation.homographType}</strong>
            </p>
          </div>
        </div>

        {/* Detail Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-mono text-slate-400">Domain Visual Similarity Score:</span>
            <span className="font-mono font-bold text-cyan-400">{impersonation.similarityScore || 94}% Similarity</span>
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-red-500 h-full"
              style={{ width: `${impersonation.similarityScore || 94}%` }}
            />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {impersonation.details}
          </p>
        </div>
      </div>
    </div>
  );
};
