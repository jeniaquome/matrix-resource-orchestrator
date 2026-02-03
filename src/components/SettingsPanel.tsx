'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, X, Bell, Eye, Database, Shield, HelpCircle, Check, Download, Trash2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Get settings from store
  const notificationSettings = useAppStore((state) => state.notificationSettings);
  const displaySettings = useAppStore((state) => state.displaySettings);
  const dataSettings = useAppStore((state) => state.dataSettings);
  const privacySettings = useAppStore((state) => state.privacySettings);

  // Get setters from store
  const setNotificationSettings = useAppStore((state) => state.setNotificationSettings);
  const setDisplaySettings = useAppStore((state) => state.setDisplaySettings);
  const setDataSettings = useAppStore((state) => state.setDataSettings);
  const setPrivacySettings = useAppStore((state) => state.setPrivacySettings);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowExportConfirm(false);
        setShowDeleteConfirm(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportData = () => {
    setShowExportConfirm(true);
    setTimeout(() => {
      setShowExportConfirm(false);
    }, 2000);
  };

  const handleDownloadData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      settings: { notificationSettings, displaySettings, dataSettings, privacySettings },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matrix-orchestrator-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    alert('Account deletion requested. In a real app, this would initiate the deletion process.');
    setShowDeleteConfirm(false);
    setIsOpen(false);
  };

  const openHelp = () => {
    window.open('https://github.com/jeniaquome/matrix-resource-orchestrator', '_blank');
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'display', label: 'Display', icon: Eye },
    { id: 'data', label: 'Data & Sync', icon: Database },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const themeColors = [
    { id: 'indigo' as const, from: '#6366f1', to: '#8b5cf6' },
    { id: 'blue' as const, from: '#3b82f6', to: '#06b6d4' },
    { id: 'emerald' as const, from: '#10b981', to: '#14b8a6' },
    { id: 'purple' as const, from: '#8b5cf6', to: '#ec4899' },
  ];

  const notificationItems = [
    { id: 'conflicts' as const, label: 'Resource Conflicts', description: 'Alert when resources are over-allocated' },
    { id: 'milestones' as const, label: 'Milestone Reminders', description: 'Notify before milestone deadlines' },
    { id: 'approvals' as const, label: 'Approval Requests', description: 'Get notified of pending approvals' },
    { id: 'updates' as const, label: 'Project Updates', description: 'Status changes and progress updates' },
  ];

  const displayItems = [
    { id: 'compactView' as const, label: 'Compact View', description: 'Show more items in less space' },
    { id: 'showROI' as const, label: 'Show ROI Metrics', description: 'Display financial metrics on cards' },
    { id: 'showAvailability' as const, label: 'Show Availability', description: 'Display resource availability status' },
    { id: 'animations' as const, label: 'Animations', description: 'Enable UI animations and transitions' },
  ];

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg ${displaySettings.animations ? 'transition-colors' : ''}`}
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-4 sm:inset-auto sm:absolute sm:right-0 sm:mt-2 sm:w-[480px] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[600px]">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Settings</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-40 border-r border-gray-100 bg-gray-50 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${displaySettings.animations ? 'transition-colors' : ''} ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 max-h-96 overflow-y-auto">
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Configure how you receive alerts and notifications.
                  </p>
                  {notificationItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({ [item.id]: !notificationSettings[item.id] })}
                        className={`relative w-11 h-6 rounded-full ${displaySettings.animations ? 'transition-colors' : ''} ${
                          notificationSettings[item.id] ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                        aria-label={`Toggle ${item.label}`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full ${displaySettings.animations ? 'transition-transform' : ''} ${
                            notificationSettings[item.id] ? 'translate-x-5' : ''
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                  <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <p className="text-xs text-indigo-700">
                      <strong>Active:</strong> {Object.values(notificationSettings).filter(Boolean).length} of {Object.keys(notificationSettings).length} notification types enabled
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'display' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Customize how information is displayed.
                  </p>
                  {displayItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setDisplaySettings({ [item.id]: !displaySettings[item.id] })}
                        className={`relative w-11 h-6 rounded-full ${displaySettings.animations ? 'transition-colors' : ''} ${
                          displaySettings[item.id] ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                        aria-label={`Toggle ${item.label}`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full ${displaySettings.animations ? 'transition-transform' : ''} ${
                            displaySettings[item.id] ? 'translate-x-5' : ''
                          }`}
                        />
                      </button>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Color Theme
                    </label>
                    <div className="flex gap-2">
                      {themeColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setDisplaySettings({ colorTheme: color.id })}
                          className={`relative w-8 h-8 rounded-full border-2 ${displaySettings.animations ? 'transition-all' : ''} ${
                            displaySettings.colorTheme === color.id ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                          }`}
                          style={{
                            background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                          }}
                          aria-label={`${color.id} theme`}
                        >
                          {displaySettings.colorTheme === color.id && (
                            <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Current theme: <span className="font-medium capitalize">{displaySettings.colorTheme}</span>
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Configure data refresh and synchronization.
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Auto-refresh Interval
                    </label>
                    <select
                      value={dataSettings.refreshInterval}
                      onChange={(e) => setDataSettings({ refreshInterval: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="1">Every minute</option>
                      <option value="5">Every 5 minutes</option>
                      <option value="15">Every 15 minutes</option>
                      <option value="30">Every 30 minutes</option>
                      <option value="0">Manual only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Timezone
                    </label>
                    <select
                      value={dataSettings.timezone}
                      onChange={(e) => setDataSettings({ timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Date Format
                    </label>
                    <select
                      value={dataSettings.dateFormat}
                      onChange={(e) => setDataSettings({ dateFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={handleExportData}
                      className={`w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 ${displaySettings.animations ? 'transition-colors' : ''} flex items-center justify-center gap-2`}
                    >
                      {showExportConfirm ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          Export Started!
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Export Data
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Manage your privacy and data settings.
                  </p>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Data Protection</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Your data is encrypted and stored securely. We comply with HIPAA and SOC 2 requirements.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Analytics</p>
                      <p className="text-xs text-gray-500">Help improve the product with usage data</p>
                    </div>
                    <button
                      onClick={() => setPrivacySettings({ analyticsEnabled: !privacySettings.analyticsEnabled })}
                      className={`relative w-11 h-6 rounded-full ${displaySettings.animations ? 'transition-colors' : ''} ${
                        privacySettings.analyticsEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                      aria-label="Toggle analytics"
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full ${displaySettings.animations ? 'transition-transform' : ''} ${
                          privacySettings.analyticsEnabled ? 'translate-x-5' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                      <p className="text-xs text-gray-500">Auto-logout after inactivity</p>
                    </div>
                    <select
                      value={privacySettings.sessionTimeout}
                      onChange={(e) => setPrivacySettings({ sessionTimeout: e.target.value })}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="30 minutes">30 minutes</option>
                      <option value="1 hour">1 hour</option>
                      <option value="4 hours">4 hours</option>
                      <option value="Never">Never</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <button
                      onClick={handleDownloadData}
                      className={`w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 ${displaySettings.animations ? 'transition-colors' : ''} flex items-center justify-center gap-2`}
                    >
                      <Download className="w-4 h-4" />
                      Download My Data
                    </button>

                    {showDeleteConfirm ? (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-700 mb-2">Are you sure? This cannot be undone.</p>
                        <div className="flex gap-2">
                          <button
                            onClick={confirmDelete}
                            className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleDeleteAccount}
                        className={`w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 ${displaySettings.animations ? 'transition-colors' : ''} flex items-center justify-center gap-2`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <button
              onClick={openHelp}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className={`px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 ${displaySettings.animations ? 'transition-colors' : ''}`}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
