'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

interface MilestoneWithProject {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
  blockers?: string[];
  projectId: string;
  projectName: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export function MilestonesTimeline() {
  const projects = useAppStore(state => state.projects);
  const setSelectedProject = useAppStore(state => state.setSelectedProject);
  const displaySettings = useAppStore(state => state.displaySettings);

  const allMilestones = useMemo(() => {
    const milestones: MilestoneWithProject[] = [];

    projects.forEach(project => {
      project.milestones.forEach(milestone => {
        milestones.push({
          ...milestone,
          projectId: project.id,
          projectName: project.name,
          priority: project.priority,
        });
      });
    });

    // Sort by due date
    return milestones.sort((a, b) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [projects]);

  const upcomingMilestones = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return allMilestones.filter(m => {
      const dueDate = new Date(m.dueDate);
      return !m.completed && dueDate >= now && dueDate <= thirtyDaysFromNow;
    });
  }, [allMilestones]);

  const overdueMilestones = useMemo(() => {
    const now = new Date();
    return allMilestones.filter(m => {
      const dueDate = new Date(m.dueDate);
      return !m.completed && dueDate < now;
    });
  }, [allMilestones]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getMilestoneStatus = (milestone: MilestoneWithProject) => {
    if (milestone.completed) {
      return { icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' };
    }

    const dueDate = new Date(milestone.dueDate);
    const now = new Date();
    const isOverdue = dueDate < now;

    if (milestone.blockers?.length) {
      return { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    } else if (isOverdue) {
      return { icon: Clock, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    } else {
      return { icon: Clock, color: 'text-slate-500', bgColor: 'bg-white', borderColor: 'border-slate-200' };
    }
  };

  const displayMilestones = [...overdueMilestones, ...upcomingMilestones].slice(0, 8);

  if (displayMilestones.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-teal-700" />
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">Upcoming Milestones</h3>
        </div>
        <div className="text-center py-8 text-slate-400">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No milestones due in the next 30 days</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-700" />
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">Upcoming Milestones</h3>
        </div>
        {overdueMilestones.length > 0 && (
          <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded border border-red-200">
            {overdueMilestones.length} overdue
          </span>
        )}
      </div>

      <div className="space-y-2">
        {displayMilestones.map((milestone) => {
          const status = getMilestoneStatus(milestone);
          const StatusIcon = status.icon;
          const isOverdue = new Date(milestone.dueDate) < new Date() && !milestone.completed;

          return (
            <div
              key={milestone.id}
              className={`p-3 rounded-lg border ${status.borderColor} ${status.bgColor} hover:shadow-sm ${displaySettings.animations ? 'transition-all' : ''} cursor-pointer`}
              onClick={() => setSelectedProject(milestone.projectId)}
            >
              <div className="flex items-start gap-3">
                <StatusIcon className={`w-4 h-4 ${status.color} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isOverdue ? 'text-red-700' : 'text-slate-900'}`}>
                        {milestone.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {milestone.projectName}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                      {formatDate(milestone.dueDate)}
                    </span>
                    {milestone.priority === 'critical' && (
                      <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded border border-red-200">
                        Critical
                      </span>
                    )}
                  </div>
                  {milestone.blockers && milestone.blockers.length > 0 && (
                    <div className="mt-2 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-600">
                        Blocked: {milestone.blockers.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {allMilestones.filter(m => !m.completed).length > displayMilestones.length && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            +{allMilestones.filter(m => !m.completed).length - displayMilestones.length} more milestones
          </p>
        </div>
      )}
    </div>
  );
}
