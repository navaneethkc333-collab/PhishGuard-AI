import React from 'react';
import { ShieldAlert, ShieldCheck, AlertOctagon, HelpCircle, Download, Bot, Sparkles, ChevronRight } from 'lucide-react';
import { AIReasoningResult } from '../types';

interface VerdictBannerProps {
  aiReasoning: AIReasoningResult;
  subject: string;
  sender: string;
  onOpenChat: () => void;
  onScrollToActionPlan: () => void;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({
  aiReasoning,
  subject,
  sender,
  onOpenChat,
  onScrollToActionPlan,
}) => {
  const getVerdictStyle = () => {
    switch (aiReasoning.verdict) {
      case 'HIGH_RISK_PHISHING':
        return {
          bg: 'bg-gradient-to-br from-red-950 via-slate-900 to-slate-950',
          border: 'border-red-600/80',
          text: 'text-red-400',
          badgeBg: 'bg-red-500/20 text-red-300 border-red-500/50',
          icon: ShieldAlert,
          title: 'HIGH RISK PHISHING DETECTED',
        };
      case 'CREDENTIAL_HARVESTING':
        return {
          bg: 'bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950',
          border: 'border-purple-600/80',
          text: 'text-purple-300',
          badgeBg: 'bg-purple-500/20 text-purple-200 border-purple-500/50',
          icon: AlertOctagon,
          title: 'CREDENTIAL HARVESTING CAMPAIGN',
        };
      case 'SUSPICIOUS_PHISHING':
        return {
          bg: 'bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950',
          border: 'border-amber-600/80',
          text: 'text-amber-300',
          badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-500/50',
          icon: AlertOctagon,
          title: 'SUSPICIOUS EMAIL THREAT',
        };
      case 'BENIGN':
      default:
        return {
          bg: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950',
          border: 'border-emerald-600/80',
          text: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          icon: ShieldCheck,
          title: 'BENIGN - NO MALICIOUS INTENT',
        };
    }
  };

  const style = getVerdictStyle();
  const IconComponent = style.icon;

  return (
    <div className={`${style.bg} border ${style.border} rounded-2xl p-6 md:p-8 shadow-2xl mb-8 relative overflow-hidden`}>
      {/* Background glow circle */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Verdict Info */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${style.badgeBg}`}>
              <IconComponent className="w-4 h-4" />
              {style.title}
            </span>

            <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
              Confidence: <strong className="text-white">{aiReasoning.confidence}%</strong>
            </span>
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
              {subject}
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              From: <span className="text-slate-200">{sender}</span>
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Agent Executive Synthesis:
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {aiReasoning.aiSummary}
            </p>
            <div className="mt-2 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
              <span>Attack Classification:</span>
              <span className="font-bold underline">{aiReasoning.attackType}</span>
            </div>
          </div>
        </div>

        {/* Right: Risk Meter Gauge & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-6 lg:pt-0 lg:pl-8 min-w-[220px]">
          {/* Circular / Block Risk Score */}
          <div className="text-center">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
              Calculated Risk Score
            </div>
            <div className="relative inline-flex items-center justify-center">
              <div
                className={`w-28 h-28 rounded-full border-4 ${
                  aiReasoning.riskScore >= 80
                    ? 'border-red-500 bg-red-950/40 shadow-lg shadow-red-500/20'
                    : aiReasoning.riskScore >= 50
                    ? 'border-amber-500 bg-amber-950/40 shadow-lg shadow-amber-500/20'
                    : 'border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-500/20'
                } flex flex-col items-center justify-center`}
              >
                <span className={`text-3xl font-black font-mono ${style.text}`}>
                  {aiReasoning.riskScore}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  / 100 Risk
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="w-full space-y-2">
            <button
              id="ask-ai-assistant-btn"
              onClick={onOpenChat}
              className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI SOC Assistant</span>
            </button>

            <button
              id="view-action-plan-btn"
              onClick={onScrollToActionPlan}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>SOC Remediation Plan</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
