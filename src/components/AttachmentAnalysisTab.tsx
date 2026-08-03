import React from 'react';
import { Paperclip, FileCode, ShieldAlert, CheckCircle2, Copy, AlertTriangle, Cpu, HardDrive } from 'lucide-react';
import { AttachmentAnalysisResult } from '../types';

interface AttachmentAnalysisTabProps {
  attachments: AttachmentAnalysisResult[];
}

export const AttachmentAnalysisTab: React.FC<AttachmentAnalysisTabProps> = ({ attachments }) => {
  if (attachments.length === 0) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <Paperclip className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-60" />
        <p className="text-sm font-semibold">No files attached to this email.</p>
        <p className="text-xs text-slate-500 mt-1">Attachments scanner verified zero payload files.</p>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {attachments.map((att) => (
        <div key={att.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-md">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <FileCode className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">{att.fileName}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {att.fileSize} • MIME: {att.mimeType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {att.isMacroDetected && (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Macro / VBA Detected
                </span>
              )}
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold ${
                  att.threatStatus === 'MALICIOUS'
                    ? 'bg-red-950 text-red-400 border border-red-800'
                    : att.threatStatus === 'SUSPICIOUS'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                {att.threatStatus}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            {att.description}
          </p>

          {/* Hash Badges */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[11px]">SHA256 Hash:</span>
              <div className="flex items-center gap-2 truncate max-w-[80%]">
                <span className="text-cyan-300 truncate text-[11px]">{att.sha256}</span>
                <button
                  onClick={() => copyToClipboard(att.sha256)}
                  className="text-slate-500 hover:text-white transition cursor-pointer"
                  title="Copy SHA256"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[11px]">MD5 Hash:</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-300 text-[11px]">{att.md5}</span>
                <button
                  onClick={() => copyToClipboard(att.md5)}
                  className="text-slate-500 hover:text-white transition cursor-pointer"
                  title="Copy MD5"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* YARA Matches & Macro Details */}
          {att.yaraMatches && att.yaraMatches.length > 0 && (
            <div className="bg-red-950/30 border border-red-800/80 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> YARA Malware Signatures Matched ({att.yaraMatches.length})
              </h4>

              <div className="space-y-2">
                {att.yaraMatches.map((yara, yIdx) => (
                  <div key={yIdx} className="bg-slate-950 p-3 rounded border border-red-900/60 flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-red-300 block">{yara.ruleName}</span>
                      <p className="text-xs text-slate-300 mt-0.5">{yara.description}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-800">
                      {yara.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Entropy & PE Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Entropy Meter */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="font-mono uppercase text-[10px]">File Entropy Score</span>
                <span className="font-mono font-bold text-white">{att.fileEntropy} / 8.0</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full ${
                    att.fileEntropy > 7.0 ? 'bg-red-500' : att.fileEntropy > 5.5 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${(att.fileEntropy / 8.0) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block">
                {att.fileEntropy > 7.0 ? 'High Entropy: Indicates encryption or packed malware code.' : 'Standard file entropy.'}
              </span>
            </div>

            {/* PE / Compiler Metadata */}
            {att.peMetadata && (
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
                <span className="text-slate-400 uppercase text-[10px] block mb-1">Compiler & Static Metadata</span>
                {att.peMetadata.compiler && <div>Compiler: <span className="text-white">{att.peMetadata.compiler}</span></div>}
                {att.peMetadata.compileTime && <div>Timestamp: <span className="text-slate-300">{att.peMetadata.compileTime}</span></div>}
                {att.peMetadata.suspiciousImports && (
                  <div className="mt-1 text-amber-400">
                    Imports: {att.peMetadata.suspiciousImports.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
