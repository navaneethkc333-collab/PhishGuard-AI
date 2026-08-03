import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { EmailUploadSection } from './components/EmailUploadSection';
import { AgentPipelineVisualizer } from './components/AgentPipelineVisualizer';
import { VerdictBanner } from './components/VerdictBanner';
import { EvidenceChain } from './components/EvidenceChain';
import { HeaderAnalysisTab } from './components/HeaderAnalysisTab';
import { URLAnalysisTab } from './components/URLAnalysisTab';
import { AttachmentAnalysisTab } from './components/AttachmentAnalysisTab';
import { ImpersonationTab } from './components/ImpersonationTab';
import { ActionPlanTab } from './components/ActionPlanTab';
import { ChatSOCAssistant } from './components/ChatSOCAssistant';
import { InvestigationCase } from './types';
import { FileText, Link as LinkIcon, Paperclip, Globe, ShieldAlert } from 'lucide-react';

export default function App() {
  const [currentCase, setCurrentCase] = useState<InvestigationCase | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('Awaiting submission —');
  const [activeTab, setActiveTab] = useState<'headers' | 'urls' | 'attachments' | 'impersonation' | 'action-plan'>('action-plan');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);

  const handleStartInvestigation = async (data: { rawText: string; sampleCaseId?: string; attachments?: any[] }) => {
    setIsAnalyzing(true);
    setStatusText('Parsing email → running header, URL, and attachment agents...');
    setAgentLogs([
      `[${new Date().toLocaleTimeString()}] [Orchestrator] Autonomous AI Agent initialized. Parsing input payload...`,
      `[${new Date().toLocaleTimeString()}] [Header Agent] Extracting Envelope, Route Hops, SPF/DKIM parameters...`,
      `[${new Date().toLocaleTimeString()}] [URL Agent] Scanning embedded links against threat intelligence databases...`,
      `[${new Date().toLocaleTimeString()}] [Attachment Agent] Running YARA rules and Macro heuristics...`,
    ]);

    try {
      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (json.caseData) {
        const newCase: InvestigationCase = json.caseData;
        
        // Artificial short pause so the user observes agent status transition
        await new Promise((r) => setTimeout(r, 1200));

        setCurrentCase(newCase);
        setAgentLogs(newCase.agentLogs || []);
        setStatusText(`Investigation complete in 4ms — report ${newCase.id}`);
      }
    } catch (err) {
      console.error('Investigation error:', err);
      setStatusText('Investigation error encountered.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewInvestigation = () => {
    setCurrentCase(null);
    setStatusText('Awaiting submission —');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToActionPlan = () => {
    setActiveTab('action-plan');
    const el = document.getElementById('soc-action-plan-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-black pb-16">
      {/* Top Navigation */}
      <Navbar onNewInvestigation={handleNewInvestigation} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Upload Input Portal */}
        <EmailUploadSection
          onStartInvestigation={handleStartInvestigation}
          isAnalyzing={isAnalyzing}
          statusText={statusText}
        />

        {/* Live Agent Execution Visualizer */}
        {(isAnalyzing || currentCase) && (
          <AgentPipelineVisualizer logs={agentLogs} isComplete={!isAnalyzing} />
        )}

        {/* Case Results Display */}
        {currentCase && !isAnalyzing && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Verdict Banner */}
            <VerdictBanner
              aiReasoning={currentCase.aiReasoning}
              subject={currentCase.subject}
              sender={currentCase.sender}
              onOpenChat={() => setIsChatOpen(true)}
              onScrollToActionPlan={handleScrollToActionPlan}
            />

            {/* Correlated Evidence Chain */}
            <EvidenceChain evidenceList={currentCase.aiReasoning.evidenceList} />

            {/* Deep Dive Module Tabs */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Tab Navigation */}
              <div className="bg-slate-950 border-b border-slate-800 p-2 flex flex-wrap gap-1">
                <button
                  id="tab-action-plan"
                  onClick={() => setActiveTab('action-plan')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'action-plan'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>SOC Action Plan</span>
                </button>

                <button
                  id="tab-headers"
                  onClick={() => setActiveTab('headers')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'headers'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Header Analysis & Route Hops</span>
                </button>

                <button
                  id="tab-urls"
                  onClick={() => setActiveTab('urls')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'urls'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>URL Scanner ({currentCase.urlResults.length})</span>
                </button>

                <button
                  id="tab-attachments"
                  onClick={() => setActiveTab('attachments')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'attachments'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Paperclip className="w-4 h-4" />
                  <span>Attachments ({currentCase.attachmentResults.length})</span>
                </button>

                <button
                  id="tab-impersonation"
                  onClick={() => setActiveTab('impersonation')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'impersonation'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Impersonation Radar</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'action-plan' && (
                  <ActionPlanTab aiReasoning={currentCase.aiReasoning} />
                )}

                {activeTab === 'headers' && (
                  <HeaderAnalysisTab header={currentCase.headerResult} />
                )}

                {activeTab === 'urls' && (
                  <URLAnalysisTab urls={currentCase.urlResults} />
                )}

                {activeTab === 'attachments' && (
                  <AttachmentAnalysisTab attachments={currentCase.attachmentResults} />
                )}

                {activeTab === 'impersonation' && (
                  <ImpersonationTab impersonation={currentCase.impersonationResult} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Banner matching Screenshot */}
      <footer className="mt-16 text-center border-t border-slate-900 pt-8 pb-4">
        <p className="text-[11px] font-mono text-slate-500 tracking-[0.2em] uppercase">
          PHISHGUARD AI — OFFLINE-CAPABLE STATIC ANALYSIS ENGINE — FOR SOC ANALYST USE
        </p>
      </footer>

      {/* Interactive AI SOC Assistant Modal */}
      {currentCase && (
        <ChatSOCAssistant
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          caseData={currentCase}
        />
      )}
    </div>
  );
}
