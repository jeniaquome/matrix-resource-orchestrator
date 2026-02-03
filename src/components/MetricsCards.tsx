'use client';

import { useMemo } from 'react';
import { useAppStore, getMetrics } from '@/lib/store';
import {
  FolderKanban,
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign
} from 'lucide-react';

export function MetricsCards() {
  const resources = useAppStore(state => state.resources);
  const projects = useAppStore(state => state.projects);
  const displaySettings = useAppStore(state => state.displaySettings);

  const metrics = useMemo(() => getMetrics(resources, projects), [resources, projects]);

  const allCards = [
    {
      title: 'Active Projects',
      value: metrics.activeProjects,
      subtitle: `${metrics.totalProjects} total`,
      icon: FolderKanban,
      color: 'bg-blue-500',
      showAlways: true,
    },
    {
      title: 'Team Members',
      value: metrics.totalResources,
      subtitle: 'Across 5 silos',
      icon: Users,
      color: 'bg-green-500',
      showAlways: true,
    },
    {
      title: 'Avg Utilization',
      value: `${metrics.avgUtilization}%`,
      subtitle: 'Resource allocation',
      icon: TrendingUp,
      color: metrics.avgUtilization > 85 ? 'bg-yellow-500' : 'bg-emerald-500',
      showAlways: true,
    },
    {
      title: 'Total ROI',
      value: `$${metrics.totalROI.toFixed(1)}M`,
      subtitle: 'Risk-adjusted NPV',
      icon: DollarSign,
      color: 'bg-purple-500',
      showAlways: false, // Only show when showROI is enabled
      requiresROI: true,
    },
    {
      title: 'Conflicts',
      value: metrics.conflicts,
      subtitle: 'Need resolution',
      icon: AlertTriangle,
      color: metrics.conflicts > 0 ? 'bg-red-500' : 'bg-gray-400',
      showAlways: true,
    },
    {
      title: 'Milestones',
      value: metrics.upcomingMilestones,
      subtitle: 'Due in 30 days',
      icon: Calendar,
      color: 'bg-orange-500',
      showAlways: true,
    },
  ];

  // Filter cards based on settings
  const cards = allCards.filter(card => card.showAlways || (card.requiresROI && displaySettings.showROI));

  // Adjust grid columns based on number of visible cards
  const gridCols = cards.length <= 4
    ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4'
    : cards.length === 5
    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';

  return (
    <div className={`grid ${gridCols} gap-2 sm:gap-4`}>
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-white rounded-xl shadow-sm border border-gray-100 ${displaySettings.compactView ? 'p-2 sm:p-3' : 'p-3 sm:p-4'} hover:shadow-md ${displaySettings.animations ? 'transition-shadow' : ''}`}
        >
          <div className={`flex items-center ${displaySettings.compactView ? 'gap-2' : 'gap-2 sm:gap-3'}`}>
            <div className={`${card.color} ${displaySettings.compactView ? 'p-1 sm:p-1.5' : 'p-1.5 sm:p-2'} rounded-lg flex-shrink-0`}>
              <card.icon className={`${displaySettings.compactView ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-4 h-4 sm:w-5 sm:h-5'} text-white`} />
            </div>
            <div className="min-w-0">
              <p className={`${displaySettings.compactView ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} font-bold text-gray-900`}>{card.value}</p>
              <p className="text-xs text-gray-500 truncate">{card.title}</p>
              {!displaySettings.compactView && (
                <p className="text-xs text-gray-400 hidden sm:block">{card.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
