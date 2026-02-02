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

  const metrics = useMemo(() => getMetrics(resources, projects), [resources, projects]);

  const cards = [
    {
      title: 'Active Projects',
      value: metrics.activeProjects,
      subtitle: `${metrics.totalProjects} total`,
      icon: FolderKanban,
      color: 'bg-blue-500',
    },
    {
      title: 'Team Members',
      value: metrics.totalResources,
      subtitle: 'Across 5 silos',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Avg Utilization',
      value: `${metrics.avgUtilization}%`,
      subtitle: 'Resource allocation',
      icon: TrendingUp,
      color: metrics.avgUtilization > 85 ? 'bg-yellow-500' : 'bg-emerald-500',
    },
    {
      title: 'Total ROI',
      value: `$${metrics.totalROI.toFixed(1)}M`,
      subtitle: 'Risk-adjusted NPV',
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      title: 'Conflicts',
      value: metrics.conflicts,
      subtitle: 'Need resolution',
      icon: AlertTriangle,
      color: metrics.conflicts > 0 ? 'bg-red-500' : 'bg-gray-400',
    },
    {
      title: 'Milestones',
      value: metrics.upcomingMilestones,
      subtitle: 'Due in 30 days',
      icon: Calendar,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className={`${card.color} p-2 rounded-lg`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500">{card.title}</p>
              <p className="text-xs text-gray-400">{card.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
