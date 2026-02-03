'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, X, Bell, Eye, Palette, Database, Shield, HelpCircle } from 'lucide-react';

interface SettingToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');
  const panelRef = useRef<HTMLDivElement>(null);

  const [notificationSettings, setNotificationSettings] = useState<SettingToggle[]>([
    { id: 'conflicts', label: 'Resource Conflicts', description: 'Alert when resources are over-allocated', enabled: true },
    { id: 'milestones', label: 'Milestone Reminders', description: 'Notify before milestone deadlines', enabled: true },
    { id: 'approvals', label: 'Approval Requests', description: 'Get notified of pending approvals', enabled: true },
    { id: 'updates', label: 'Project Updates', description: 'Status changes and progress updates', enabled: false },
  ]);

  const [displaySettings, setDisplaySettings] = useState<SettingToggle[]>([
    { id: 'compactView', label: 'Compact View', description: 'Show more items in less space', enabled: false },
    { id: 'showROI', label: 'Show ROI Metrics', description: 'Display financial metrics on cards', enabled: true },
    { id: 'showAvailability', label: 'Show Availability', description: 'Display resource availability status', enabled: true },
    { id: 'animations', label: 'Animations', description: 'Enable UI animations and transitions', enabled: true },
  ]);

  const [dataSettings, setDataSettings] = useState({
    refreshInterval: '5',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSetting = (settingId: string, type: 'notification' | 'display') => {
    if (type === 'notification') {
      setNotificationSettings(settings =>
        settings.map(s => s.id === settingId ? { ...s, enabled: !s.enabled } : s)
      );
    } else {
      setDisplaySettings(settings =>
        settings.map(s => s.id === settingId ? { ...s, enabled: !s.enabled } : s)
      );
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'display', label: 'Display', icon: Eye },
    { id: 'data', label: 'Data & Sync', icon: Database },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[480px] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Settings</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
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
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
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
                  {notificationSettings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      </div>
                      <button
                        onClick={() => toggleSetting(setting.id, 'notification')}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          setting.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            setting.enabled ? 'translate-x-5' : ''
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'display' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Customize how information is displayed.
                  </p>
                  {displaySettings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      </div>
                      <button
                        onClick={() => toggleSetting(setting.id, 'display')}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          setting.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            setting.enabled ? 'translate-x-5' : ''
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
                      {['indigo', 'blue', 'emerald', 'purple'].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            color === 'indigo' ? 'border-gray-900' : 'border-transparent'
                          }`}
                          style={{
                            background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                            ['--tw-gradient-from' as string]: {
                              indigo: '#6366f1',
                              blue: '#3b82f6',
                              emerald: '#10b981',
                              purple: '#8b5cf6',
                            }[color],
                            ['--tw-gradient-to' as string]: {
                              indigo: '#8b5cf6',
                              blue: '#06b6d4',
                              emerald: '#14b8a6',
                              purple: '#ec4899',
                            }[color],
                          }}
                        />
                      ))}
                    </div>
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
                      onChange={(e) => setDataSettings({ ...dataSettings, refreshInterval: e.target.value })}
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
                      onChange={(e) => setDataSettings({ ...dataSettings, timezone: e.target.value })}
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
                      onChange={(e) => setDataSettings({ ...dataSettings, dateFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Export Data
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
                    <button className="relative w-11 h-6 rounded-full bg-indigo-600 transition-colors">
                      <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5 transition-transform" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                      <p className="text-xs text-gray-500">Auto-logout after inactivity</p>
                    </div>
                    <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>Never</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Download My Data
                    </button>
                    <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <HelpCircle className="w-4 h-4" />
              Help
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
