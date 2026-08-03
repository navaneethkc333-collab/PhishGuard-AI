import React, { useState } from 'react';
import { FileCode, Command } from 'lucide-react';
import { SAMPLE_CASES } from '../data/sampleCases';

interface EmailUploadSectionProps {
  onStartInvestigation: (data: { rawText: string; sampleCaseId?: string; attachments?: any[] }) => void;
  isAnalyzing: boolean;
  statusText?: string;
}

export const EmailUploadSection: React.FC<EmailUploadSectionProps> = ({
  onStartInvestigation,
  isAnalyzing,
  statusText = 'Awaiting submission —',
}) => {
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; content: string } | null>({
    name: 'sample_phishing.eml',
    size: '482 KB',
    content: SAMPLE_CASES[0].rawEmailInput,
  });

  const [rawInputText, setRawInputText] = useState<string>(SAMPLE_CASES[0].rawEmailInput);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string || '';
      setSelectedFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        content: text,
      });
      setRawInputText(text);
    };
    reader.readAsText(file);
  };

  const handleRun = () => {
    const textToAnalyze = selectedFile ? selectedFile.content : rawInputText;
    onStartInvestigation({
      rawText: textToAnalyze || SAMPLE_CASES[0].rawEmailInput,
      attachments: [
        { name: 'Invoice_M365_Upgrade.pdf', size: '482 KB', type: 'application/pdf' },
      ],
    });
  };

  return (
    <div className="mb-10 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header Bar matching Screenshot */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-amber-900/40 pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight flex items-center gap-1.5">
            PhishGuard<span className="text-amber-500 font-sans">·</span>AI
          </h1>
          <p className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-amber-500/80 mt-1">
            AUTONOMOUS PHISHING INVESTIGATION AGENT
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-md flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-amber-400 animate-ping' : 'bg-slate-500'}`} />
            {statusText}
          </span>
        </div>
      </div>

      {/* Main Dashed Drop Zone Container */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className="border-2 border-dashed border-amber-500/30 hover:border-amber-400/80 rounded-2xl p-10 text-center bg-slate-900/40 hover:bg-slate-900/70 transition-all cursor-pointer relative group mb-8 shadow-2xl"
      >
        <input
          type="file"
          accept=".eml,.txt,.msg,.pdf"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition duration-300">
            <Command className="w-8 h-8" />
          </div>

          <div>
            <p className="text-sm sm:text-base font-bold text-amber-400 tracking-wide font-mono">
              Drop a .eml file here, or click to browse
            </p>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Header · URL · Attachment · Reasoning agents will run in sequence
            </p>
          </div>

          {selectedFile && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-600/50 text-xs font-mono text-amber-200">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span className="font-bold">{selectedFile.name}</span>
              <span className="text-slate-400">({selectedFile.size})</span>
            </div>
          )}
        </div>
      </div>

      {/* Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          id="run-investigation-main-btn"
          onClick={handleRun}
          disabled={isAnalyzing}
          className={`px-8 py-3 rounded-xl font-mono text-xs font-extrabold uppercase tracking-widest transition duration-200 cursor-pointer shadow-lg ${
            isAnalyzing
              ? 'bg-amber-950/40 text-amber-600/60 border border-amber-900/40 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-500 text-black border border-amber-400 shadow-amber-600/20 active:scale-95'
          }`}
        >
          {isAnalyzing ? 'RUNNING INVESTIGATION...' : 'RUN INVESTIGATION'}
        </button>
      </div>
    </div>
  );
};
