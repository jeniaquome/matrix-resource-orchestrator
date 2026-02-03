'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { siloColors } from '@/data/mockData';
import { X, Calendar, Users, TrendingUp, Target, Clock, AlertCircle } from 'lucide-react';
import { FunctionalSilo } from '@/types';

export function ProjectDetail() {
  const selectedProjectId = useAppStore(state => state.selectedProject);
  const setSelectedProject = useAppStore(state => state.setSelectedProject);
  const projects = useAppStore(state => state.projects);
  const resources = useAppStore(state => state.resources);

  const project = useMemo(
    () => projects.find(p => p.id === selectedProjectId),
    [projects, selectedProjectId]
  );

  const getResourceById = (id: string) => resources.find(r => r.id === id);

  if (!selectedProjectId || !project) return null;

  const completedMilestones = project.milestones.filter(m => m.completed).length;
  const totalMilestones = project.milestones.length;

  return (
    <div className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 w-full sm:max-w-lg bg-white shadow-2xl z-50 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-100 p-3 sm:p-4 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate pr-2">{project.name}</h2>
        <button
          onClick={() => setSelectedProject(null)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Status & Priority */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.status === 'active' ? 'bg-green-100 text-green-700' :
            project.status === 'planned' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {project.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.priority === 'critical' ? 'bg-red-100 text-red-700' :
            project.priority === 'high' ? 'bg-orange-100 text-orange-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {project.priority} priority
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600">{project.description}</p>

        {/* Owner & Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-500">Owner:</span>
            <span className="font-medium truncate">{project.owner}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-500">Timeline:</span>
            <span className="font-medium text-xs sm:text-sm">
              {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
              {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* ROI Metrics */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-3 sm:p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            ROI Metrics
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Est. Value</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">${project.roi.estimatedValue}M</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Probability</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{project.roi.probability}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Risk-Adj NPV</p>
              <p className="text-lg sm:text-xl font-bold text-green-600">${project.roi.riskAdjustedNPV.toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Time to Value</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{project.roi.timeToValue} mo</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Strategic Alignment</p>
              <div className="flex items-center gap-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-4 rounded-sm ${
                      i < project.roi.strategicAlignment ? 'bg-purple-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Resource Efficiency</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{project.roi.resourceEfficiency}/10</p>
            </div>
          </div>
        </div>

        {/* Required Silos */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Target className="w-4 h-4 text-blue-500" />
            Required Silos
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.requiredSilos.map((silo) => (
              <span
                key={silo}
                className="px-3 py-1 rounded-full text-sm text-white"
                style={{ backgroundColor: siloColors[silo as FunctionalSilo] }}
              >
                {silo}
              </span>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Users className="w-4 h-4 text-green-500" />
            Team ({project.allocatedResources.length})
          </h3>
          <div className="space-y-2">
            {project.allocatedResources.map((allocation) => {
              const resource = getResourceById(allocation.resourceId);
              if (!resource) return null;

              return (
                <div
                  key={allocation.resourceId}
                  className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium flex-shrink-0"
                      style={{ backgroundColor: siloColors[resource.silo] }}
                    >
                      {resource.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm text-gray-900 truncate">{resource.name}</p>
                      <p className="text-xs text-gray-500 truncate">{allocation.role}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-medium text-xs sm:text-sm">{allocation.hoursPerWeek}h/wk</p>
                    <p className="text-xs text-gray-500">{resource.silo}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Clock className="w-4 h-4 text-orange-500" />
            Milestones ({completedMilestones}/{totalMilestones})
          </h3>
          <div className="space-y-2">
            {project.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-2 sm:p-3 rounded-lg border ${
                  milestone.completed
                    ? 'bg-green-50 border-green-200'
                    : milestone.blockers?.length
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {milestone.completed ? (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <span className={`font-medium text-xs sm:text-sm ${milestone.completed ? 'text-green-700' : 'text-gray-900'}`}>
                      {milestone.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                    {new Date(milestone.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {milestone.blockers?.length ? (
                  <div className="mt-2 flex items-start gap-2 text-xs text-red-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Blocked: {milestone.blockers.join(', ')}</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
