'use client';

import { useState, useRef, useEffect } from 'react';
import {
  User,
  Mail,
  Building2,
  MapPin,
  Calendar,
  LogOut,
  ChevronRight,
  Briefcase,
  Award,
  Clock,
  Edit2
} from 'lucide-react';

interface UserProfile {
  name: string;
  initials: string;
  email: string;
  role: string;
  department: string;
  location: string;
  joinDate: string;
  projectsOwned: number;
  teamsManaged: number;
  recentActivity: { action: string; time: string }[];
}

const mockProfile: UserProfile = {
  name: 'Asif Jan',
  initials: 'AJ',
  email: 'asif.jan@genentech.com',
  role: 'Director, Research Informatics',
  department: 'gRED IT',
  location: 'South San Francisco, CA',
  joinDate: 'March 2019',
  projectsOwned: 3,
  teamsManaged: 5,
  recentActivity: [
    { action: 'Updated ELN Integration milestone', time: '2 hours ago' },
    { action: 'Approved resource request for HTS Platform', time: '5 hours ago' },
    { action: 'Commented on Research Data Lake', time: '1 day ago' },
    { action: 'Created new project allocation', time: '2 days ago' },
  ],
};

export function ProfilePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile] = useState(mockProfile);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-medium hover:ring-2 hover:ring-emerald-200 transition-all"
      >
        {profile.initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {profile.initials}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{profile.name}</h3>
                  <p className="text-indigo-100 text-sm">{profile.role}</p>
                </div>
              </div>
              <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{profile.department}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{profile.location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Joined {profile.joinDate}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs text-gray-500">Projects Owned</span>
                </div>
                <p className="text-xl font-bold text-gray-900 mt-1">{profile.projectsOwned}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-gray-500">Teams Managed</span>
                </div>
                <p className="text-xl font-bold text-gray-900 mt-1">{profile.teamsManaged}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="border-t border-gray-100">
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Recent Activity</span>
              </div>
              <button className="text-xs text-indigo-600 hover:text-indigo-700">View all</button>
            </div>
            <div className="px-3 pb-3 space-y-2">
              {profile.recentActivity.slice(0, 3).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-600 truncate flex-1">{activity.action}</span>
                  <span className="text-gray-400 ml-2 whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 p-2">
            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>View Full Profile</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-red-50 transition-colors text-sm text-red-600">
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
