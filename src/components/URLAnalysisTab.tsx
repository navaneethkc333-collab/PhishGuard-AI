import React from 'react';
import { Link as LinkIcon, ExternalLink, ShieldAlert, ArrowRight, CornerDownRight, Lock, Unlock, AlertTriangle, Search } from 'lucide-react';
import { ScannedURL } from '../types';

interface URLAnalysisTabProps {
  urls: ScannedURL[];
}

export const URLAnalysisTab: React.FC<URLAnalysisTabProps> = ({ urls }) => {
  if (urls.length === 0) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <LinkIcon className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-60" />
        <p className="text-sm font-semibold">No embedded hyperlinks found in the email body.</p>
        <p className="text-xs text-slate-500 mt-1">This may indicate a text-only social engineering or BEC wire scam attack.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* URL Summary Cards */}
      <div className="space-y-4">
        {urls.map((u) => (
          <div key={u.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white break-all">{u.originalUrl}</span>
              </div>

              <div className="flex items-center gap-2">
                {u.isHomograph && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Homograph Spoof
                  </span>
                )}
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold ${
                    u.status === 'MALICIOUS'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : u.status === 'SUSPICIOUS'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {u.status} ({u.reputationScore}/100 Risk)
                </span>
              </div>
            </div>

            {/* Homograph Typosquatting Highlight Card */}
            {u.isHomograph && u.targetBrand && (
              <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-4 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-300 uppercase tracking-wide">
                    Brand Impersonation Alert: {u.targetBrand}
                  </h4>
                  <p className="text-xs text-red-200 mt-1">
                    Domain <code className="bg-red-900/60 px-1 py-0.5 rounded font-mono">{u.domain}</code> uses character substitution or lookalike TLD tricks targeting legitimate brand domain <code className="bg-slate-900 px-1 py-0.5 rounded font-mono">{u.targetBrand.toLowerCase()}.com</code>.
                  </p>
                </div>
              </div>
            )}

            {/* Threat Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Domain Age</span>
                <span className={`font-mono font-bold ${u.domainAgeDays < 14 ? 'text-red-400' : 'text-slate-200'}`}>
                  {u.domainAgeDays} Days Old
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">VirusTotal Hits</span>
                <span className={`font-mono font-bold ${u.virusTotalHits > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {u.virusTotalHits} / {u.virusTotalTotal} Engines
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">WHOIS Registrar</span>
                <span className="font-mono text-slate-200 truncate block">{u.whoisRegistrar}</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">SSL Certificate</span>
                <span className="font-mono text-slate-200 flex items-center gap-1">
                  {u.sslValid ? <Lock className="w-3 h-3 text-emerald-400" /> : <Unlock className="w-3 h-3 text-red-400" />}
                  {u.sslIssuer}
                </span>
              </div>
            </div>

            {/* Redirect Chain Hop Visualizer */}
            {u.redirectChain && u.redirectChain.length > 1 && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  Redirect Hop Chain ({u.redirectCount} Redirects Detected)
                </span>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-xs font-mono">
                  {u.redirectChain.map((hopUrl, hopIdx) => (
                    <React.Fragment key={hopIdx}>
                      <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-300 break-all">
                        <span className="text-slate-500 mr-1.5">#{hopIdx + 1}</span>
                        {hopUrl}
                      </div>
                      {hopIdx < u.redirectChain.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-amber-400 flex-shrink-0 hidden md:block" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
