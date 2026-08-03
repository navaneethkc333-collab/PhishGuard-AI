import React from 'react';
import { ShieldCheck, ShieldX, ShieldAlert, Globe, Server, ArrowRight, CornerDownRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { HeaderAnalysisResult } from '../types';

interface HeaderAnalysisTabProps {
  header: HeaderAnalysisResult;
}

export const HeaderAnalysisTab: React.FC<HeaderAnalysisTabProps> = ({ header }) => {
  const getAuthBadge = (status: string) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> PASS
          </span>
        );
      case 'FAIL':
      case 'REJECT':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-950 text-red-400 border border-red-800 flex items-center gap-1">
            <ShieldX className="w-3.5 h-3.5" /> {status}
          </span>
        );
      case 'SOFTFAIL':
      case 'QUARANTINE':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> {status}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Cards: Authentication Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SPF Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">SPF Validation</span>
            {getAuthBadge(header.spfStatus)}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {header.spfDetails}
          </p>
        </div>

        {/* DKIM Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">DKIM Signature</span>
            {getAuthBadge(header.dkimStatus)}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {header.dkimDetails}
          </p>
        </div>

        {/* DMARC Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">DMARC Policy</span>
            {getAuthBadge(header.dmarcStatus)}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {header.dmarcDetails}
          </p>
        </div>
      </div>

      {/* Address & Sender Infrastructure Audit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Mismatch Matrix */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Server className="w-4 h-4" /> Header Envelope Alignment Audit
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 font-mono">From Header:</span>
              <span className="text-white font-mono font-semibold">{header.senderAddress}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 font-mono">Return-Path:</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-200 font-mono">{header.returnPath}</span>
                {header.returnPathMatch ? (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">Aligned</span>
                ) : (
                  <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-800">Misaligned</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 font-mono">Reply-To Address:</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-200 font-mono">{header.replyTo}</span>
                {header.replyToMismatch ? (
                  <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-800">Mismatch Alert</span>
                ) : (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">Normal</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sender GeoIP & ISP Intelligence */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Globe className="w-4 h-4" /> Originating Server GeoIP & Threat Rep
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900 p-3 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Origin IP</span>
              <span className="text-white font-mono font-bold">{header.senderIp}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Country Location</span>
              <span className="text-white font-bold flex items-center gap-1">
                <span>{header.senderGeo.flag}</span>
                <span>{header.senderGeo.country}, {header.senderGeo.city}</span>
              </span>
            </div>
            <div className="bg-slate-900 p-3 rounded border border-slate-800 col-span-2">
              <span className="text-slate-400 block text-[10px]">Host Provider / ISP</span>
              <span className="text-slate-200 font-mono">{header.senderGeo.isp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Received Hops Email Route Visualization */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-1.5">
          <CornerDownRight className="w-4 h-4" /> Email Transmission Route Hops Timeline ({header.routeHops.length} Hops)
        </h4>

        <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {header.routeHops.map((hop) => (
            <div key={hop.hopNumber} className="relative pl-10">
              <div
                className={`absolute left-2.5 top-1.5 w-3 h-3 -translate-x-1/2 rounded-full border-2 ${
                  hop.ipReputation === 'Malicious'
                    ? 'bg-red-500 border-red-300 animate-ping'
                    : hop.ipReputation === 'Suspicious'
                    ? 'bg-amber-500 border-amber-300'
                    : 'bg-emerald-500 border-emerald-300'
                }`}
              />

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">Hop #{hop.hopNumber}</span>
                    <span className="text-xs font-bold text-white">{hop.fromHost}</span>
                    <span className="text-xs text-slate-500 font-mono">({hop.fromIp})</span>
                    {hop.country && (
                      <span className="text-xs">{hop.flag} {hop.country}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Received by <span className="text-slate-200">{hop.byHost}</span> at {hop.timestamp}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      hop.ipReputation === 'Malicious'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : hop.ipReputation === 'Suspicious'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {hop.ipReputation} Node
                  </span>
                  {hop.delaySeconds > 0 && (
                    <span className="text-[10px] font-mono text-slate-500">Delay: +{hop.delaySeconds}s</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
