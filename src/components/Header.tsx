'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, FolderKanban, User, Clock } from 'lucide-react';
import { AlertsPanel } from './AlertsPanel';
import { SettingsPanel } from './SettingsPanel';
import { ProfilePanel } from './ProfilePanel';
import { Logo } from './Logo';
import { useAppStore } from '@/lib/store';
import { siloColors } from '@/data/mockData';
import { FunctionalSilo } from '@/types';

export function Header() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchQuery = useAppStore(state => state.searchQuery);
  const searchResults = useAppStore(state => state.searchResults);
  const isSearching = useAppStore(state => state.isSearching);
  const performSearch = useAppStore(state => state.performSearch);
  const clearSearch = useAppStore(state => state.clearSearch);
  const setSelectedProject = useAppStore(state => state.setSelectedProject);
  const setSelectedResource = useAppStore(state => state.setSelectedResource);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (query.trim()) {
      performSearch(query);
    } else {
      clearSearch();
    }
  };

  const handleResultClick = (result: typeof searchResults[0]) => {
    if (result.type === 'project' || result.type === 'milestone') {
      setSelectedProject(result.projectId || result.id);
    } else if (result.type === 'resource') {
      setSelectedResource(result.id);
    }
    clearSearch();
    setIsFocused(false);
    setShowMobileSearch(false);
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FolderKanban className="w-4 h-4 text-teal-600" />;
      case 'resource':
        return <User className="w-4 h-4 text-slate-600" />;
      case 'milestone':
        return <Clock className="w-4 h-4 text-slate-600" />;
      default:
        return null;
    }
  };

  const showResults = isFocused && (searchResults.length > 0 || (searchQuery && !isSearching));

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
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects, resources, milestones..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsFocused(true)}
                className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 max-h-96 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-slate-500">
                      <div className="animate-spin w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-sm mt-2">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-4 py-2.5 hover:bg-slate-50 text-left flex items-start gap-3 transition-colors"
                        >
                          <div className="mt-0.5">
                            {getResultIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {result.title}
                              </p>
                              <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded capitalize flex-shrink-0">
                                {result.type}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                            {result.description && (
                              <p className="text-xs text-slate-400 truncate mt-0.5">{result.description}</p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-500">
                      <p className="text-sm">No results found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
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
          <div className="md:hidden pb-3" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects, resources, milestones..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsFocused(true)}
                className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white placeholder:text-slate-400"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {showResults && (
              <div className="mt-2 bg-white rounded-lg shadow-lg border border-slate-200 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-slate-500">
                    <div className="animate-spin w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-sm mt-2">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full px-4 py-2.5 hover:bg-slate-50 text-left flex items-start gap-3"
                      >
                        <div className="mt-0.5">
                          {getResultIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {result.title}
                            </p>
                            <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded capitalize flex-shrink-0">
                              {result.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-500">
                    <p className="text-sm">No results found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
