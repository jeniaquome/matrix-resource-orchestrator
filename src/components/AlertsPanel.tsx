'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, AlertTriangle, Clock, CheckCircle, Users, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface Alert {
  id: string;
  type: 'conflict' | 'milestone' | 'approval' | 'update';
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
}

const mockAlerts: Alert[] = [
  {
    id: 'a1',
    type: 'conflict',
    title: 'Resource Over-allocation Detected',
    description: 'Lisa Thompson is allocated 52h/week across 3 projects. Review recommended.',
    time: '10 min ago',
    read: false,
    link: 'conflicts',
  },
  {
    id: 'a2',
    type: 'milestone',
    title: 'Milestone Due Soon',
    description: 'ELN Integration: Pilot Deployment due in 5 days',
    time: '1 hour ago',
    read: false,
    link: 'projects',
  },
  {
    id: 'a3',
    type: 'approval',
    title: 'Resource Request Pending',
    description: 'Dr. Maria Santos requested additional CompSci support for HTS Platform',
    time: '2 hours ago',
    read: false,
    link: 'resources',
  },
  {
    id: 'a4',
    type: 'conflict',
    title: 'New Conflict Identified',
    description: 'Dr. Priya Sharma now at 120% capacity. Prioritization needed.',
    time: '3 hours ago',
    read: true,
    link: 'conflicts',
  },
  {
    id: 'a5',
    type: 'update',
    title: 'Project Status Updated',
    description: 'Research Data Lake moved to "On Track" status',
    time: '5 hours ago',
    read: true,
    link: 'projects',
  },
  {
    id: 'a6',
    type: 'milestone',
    title: 'Milestone Completed',
    description: 'HTS Platform: Automation Integration completed successfully',
    time: '1 day ago',
    read: true,
    link: 'projects',
  },
];

const alertIcons = {
  conflict: AlertTriangle,
  milestone: Clock,
  approval: Users,
  update: CheckCircle,
};

const alertColors = {
  conflict: 'text-red-500 bg-red-50',
  milestone: 'text-orange-500 bg-orange-50',
  approval: 'text-blue-500 bg-blue-50',
  update: 'text-green-500 bg-green-50',
};

// Map alert types to notification setting keys
const alertTypeToSettingKey: Record<Alert['type'], 'conflicts' | 'milestones' | 'approvals' | 'updates'> = {
  conflict: 'conflicts',
  milestone: 'milestones',
  approval: 'approvals',
  update: 'updates',
};

interface AlertsPanelProps {
  onNavigate?: (section: string) => void;
}

export function AlertsPanel({ onNavigate }: AlertsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Get settings from store
  const notificationSettings = useAppStore(state => state.notificationSettings);
  const displaySettings = useAppStore(state => state.displaySettings);

  // Filter alerts based on notification settings
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const settingKey = alertTypeToSettingKey[alert.type];
      return notificationSettings[settingKey];
    });
  }, [alerts, notificationSettings]);

  const unreadCount = filteredAlerts.filter(a => !a.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowAllNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleAlertClick = (alert: Alert) => {
    markAsRead(alert.id);
    if (alert.link && onNavigate) {
      onNavigate(alert.link);
      setIsOpen(false);
    }
  };

  const displayedAlerts = showAllNotifications ? filteredAlerts : filteredAlerts.slice(0, 5);

  // Count how many notification types are enabled
  const enabledTypesCount = Object.values(notificationSettings).filter(Boolean).length;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg ${displaySettings.animations ? 'transition-colors' : ''}`}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-96 max-w-[400px] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">
                {unreadCount} unread
                {enabledTypesCount < 4 && (
                  <span className="text-amber-600 ml-1">
                    ({enabledTypesCount}/4 types enabled)
                  </span>
                )}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className={`text-xs text-indigo-600 hover:text-indigo-700 font-medium ${displaySettings.animations ? 'transition-colors' : ''}`}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
                {enabledTypesCount === 0 && (
                  <p className="text-xs mt-2 text-amber-600">
                    All notification types are disabled in Settings
                  </p>
                )}
              </div>
            ) : (
              displayedAlerts.map((alert) => {
                const Icon = alertIcons[alert.type];
                return (
                  <div
                    key={alert.id}
                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${displaySettings.animations ? 'transition-colors' : ''} ${
                      !alert.read ? 'bg-indigo-50/30' : ''
                    }`}
                    onClick={() => handleAlertClick(alert)}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-lg ${alertColors[alert.type]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium ${!alert.read ? 'text-gray-900' : 'text-gray-600'}`}>
                            {alert.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAlert(alert.id);
                            }}
                            className={`text-gray-400 hover:text-gray-600 ${displaySettings.animations ? 'transition-colors' : ''}`}
                            aria-label="Dismiss notification"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{alert.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-400">{alert.time}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${alertColors[alert.type]}`}>
                            {alert.type}
                          </span>
                        </div>
                      </div>
                      {!alert.read && (
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setShowAllNotifications(!showAllNotifications)}
              className={`w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium ${displaySettings.animations ? 'transition-colors' : ''}`}
            >
              {showAllNotifications
                ? `Show less`
                : `View all notifications (${filteredAlerts.length})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
