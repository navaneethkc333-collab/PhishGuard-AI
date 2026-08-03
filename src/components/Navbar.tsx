import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface NavbarProps {
  onNewInvestigation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewInvestigation,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewInvestigation}>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <span className="font-serif font-black text-xl tracking-tight text-white">
              PhishGuard<span className="text-amber-500 font-sans">·</span>AI
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

