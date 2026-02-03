'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { AlertsPanel } from './AlertsPanel';
import { SettingsPanel } from './SettingsPanel';
import { ProfilePanel } from './ProfilePanel';
import { Logo } from './Logo';

export function Header() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Logo size="md" className="hidden sm:flex" showText />
            <Logo size="sm" className="sm:hidden" />
            <div className="sm:hidden min-w-0">
              <h1 className="text-sm font-bold text-slate-900">MRO</h1>
              <p className="text-xs text-slate-500">Resource Orchestrator</p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects, resources..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              {showMobileSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            <AlertsPanel />
            <SettingsPanel />
            <ProfilePanel />
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects, resources..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-slate-400"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
