'use client';

import { useState } from 'react';
import { LayoutGrid, Search, X } from 'lucide-react';
import { AlertsPanel } from './AlertsPanel';
import { SettingsPanel } from './SettingsPanel';
import { ProfilePanel } from './ProfilePanel';

export function Header() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <LayoutGrid className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-xl font-bold text-gray-900 truncate">
                <span className="sm:hidden">MRO</span>
                <span className="hidden sm:inline">Matrix Resource Orchestrator</span>
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">AI-Powered R&D Resource Allocation</p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, resources..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, resources..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
