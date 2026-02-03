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
  Edit2,
  X,
  Save
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
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(mockProfile);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsEditing(false);
        setShowAllActivity(false);
        setShowFullProfile(false);
        setShowSignOutConfirm(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveProfile = () => {
    setProfile({
      ...editedProfile,
      initials: editedProfile.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSignOut = () => {
    setShowSignOutConfirm(true);
  };

  const confirmSignOut = () => {
    alert('Signed out successfully. In a real app, this would redirect to login.');
    setShowSignOutConfirm(false);
    setIsOpen(false);
  };

  const displayedActivity = showAllActivity
    ? profile.recentActivity
    : profile.recentActivity.slice(0, 3);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium hover:bg-teal-700 transition-colors"
        aria-label="Profile menu"
      >
        {profile.initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-80 max-w-[320px] bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-teal-700 p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                  {profile.initials}
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="bg-white/20 text-white placeholder-white/60 px-2 py-1 rounded text-lg font-semibold w-full border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  ) : (
                    <h3 className="text-lg font-semibold">{profile.name}</h3>
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.role}
                      onChange={(e) => setEditedProfile({ ...editedProfile, role: e.target.value })}
                      className="bg-white/20 text-teal-100 placeholder-white/60 px-2 py-1 rounded text-sm w-full mt-1 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  ) : (
                    <p className="text-teal-100 text-sm">{profile.role}</p>
                  )}
                </div>
              </div>
              {isEditing ? (
                <div className="flex gap-1">
                  <button
                    onClick={handleSaveProfile}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Save profile"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Cancel edit"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditedProfile(profile);
                    setIsEditing(true);
                  }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Edit profile"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-slate-400" />
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <span className="text-slate-600">{profile.email}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="w-4 h-4 text-slate-400" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.department}
                  onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                  className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <span className="text-slate-600">{profile.department}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-slate-400" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.location}
                  onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                  className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <span className="text-slate-600">{profile.location}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">Joined {profile.joinDate}</span>
            </div>
          </div>

          {/* Stats */}
          {showFullProfile && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-teal-600" />
                    <span className="text-xs text-slate-500">Projects Owned</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 mt-1">{profile.projectsOwned}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-slate-500">Teams Managed</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 mt-1">{profile.teamsManaged}</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="border-t border-slate-100">
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Recent Activity</span>
              </div>
              <button
                onClick={() => setShowAllActivity(!showAllActivity)}
                className="text-xs text-teal-600 hover:text-teal-700 font-medium"
              >
                {showAllActivity ? 'Show less' : 'View all'}
              </button>
            </div>
            <div className="px-3 pb-3 space-y-2">
              {displayedActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <span className="text-slate-600 truncate flex-1">{activity.action}</span>
                  <span className="text-slate-400 ml-2 whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-100 p-2">
            <button
              onClick={() => setShowFullProfile(!showFullProfile)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{showFullProfile ? 'Hide Stats' : 'View Full Profile'}</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showFullProfile ? 'rotate-90' : ''}`} />
            </button>

            {showSignOutConfirm ? (
              <div className="p-2 bg-red-50 rounded-lg border border-red-200 mt-1">
                <p className="text-sm text-red-700 mb-2">Sign out of your account?</p>
                <div className="flex gap-2">
                  <button
                    onClick={confirmSignOut}
                    className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                  <button
                    onClick={() => setShowSignOutConfirm(false)}
                    className="flex-1 px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-red-50 transition-colors text-sm text-red-600"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
