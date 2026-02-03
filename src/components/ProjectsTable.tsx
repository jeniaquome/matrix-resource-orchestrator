'use client';

import { useAppStore } from '@/lib/store';
import { siloColors } from '@/data/mockData';
import { ChevronRight, Users } from 'lucide-react';
import { FunctionalSilo } from '@/types';

const statusColors = {
  active: 'bg-green-100 text-green-700',
  planned: 'bg-blue-100 text-blue-700',
  'on-hold': 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-700',
};

const priorityBadge = {
  critical: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-blue-500 text-white',
  low: 'bg-gray-400 text-white',
};

export function ProjectsTable() {
  const projects = useAppStore(state => state.projects);
  const setSelectedProject = useAppStore(state => state.setSelectedProject);
  const selectedProject = useAppStore(state => state.selectedProject);
  const displaySettings = useAppStore(state => state.displaySettings);

  // Sort by ROI descending
  const sortedProjects = [...projects].sort(
    (a, b) => b.roi.riskAdjustedNPV - a.roi.riskAdjustedNPV
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`${displaySettings.compactView ? 'p-2 sm:p-3' : 'p-3 sm:p-4'} border-b border-gray-100`}>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Projects by Business Impact</h3>
        {displaySettings.showROI && (
          <p className="text-xs sm:text-sm text-gray-500">Sorted by risk-adjusted NPV</p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Project</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Priority</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left hidden sm:table-cell">Silos</th>
              {displaySettings.showROI && (
                <>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right hidden md:table-cell">Est. Value</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right hidden md:table-cell">Probability</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right">NPV</th>
                </>
              )}
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center hidden sm:table-cell">Resources</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Status</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedProjects.map((project) => (
              <tr
                key={project.id}
                className={`hover:bg-gray-50 cursor-pointer ${displaySettings.animations ? 'transition-colors' : ''} ${
                  selectedProject === project.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <td className={`px-2 sm:px-4 ${displaySettings.compactView ? 'py-1.5 sm:py-2' : 'py-2 sm:py-3'}`}>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{project.name}</p>
                    {!displaySettings.compactView && (
                      <p className="text-xs text-gray-500 hidden sm:block">{project.owner}</p>
                    )}
                  </div>
                </td>
                <td className={`px-2 sm:px-4 ${displaySettings.compactView ? 'py-1.5 sm:py-2' : 'py-2 sm:py-3'}`}>
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium ${priorityBadge[project.priority]}`}>
                    {project.priority}
                  </span>
                </td>
                <td className={`px-2 sm:px-4 ${displaySettings.compactView ? 'py-1.5 sm:py-2' : 'py-2 sm:py-3'} hidden sm:table-cell`}>
                  <div className="flex gap-1">
                    {project.requiredSilos.map((silo) => (
                      <div
                        key={silo}
                        className={`w-2 ${displaySettings.compactView ? 'h-4' : 'h-6'} rounded-sm`}
                        style={{ backgroundColor: siloColors[silo as FunctionalSilo] }}
                        title={silo}
                      />
                    ))}
                  </div>
                </td>
                {displaySettings.showROI && (
                  <>
                    <td className={`px-2 sm:px-4 ${displaySettings.compactView ? 'py-1.5 sm:py-2' : 'py-2 sm:py-3'} text-right font-medium hidden md:table-cell`}>
                      ${project.roi.estimatedValue}M
                    </td>
                    <td className={`px-2 sm:px-4 ${displaySettings.compactView ? 'py-1.5 sm:py-2' : 'py-2 sm:py-3'} text-right hidden md:table-cell`}>
                      {project.roi.probability}%
                    </td>
                    <td className={`px-2 sm:px-4 ${displaySettings.compactView ? 'py-1.5 sm:py-2' : 'py-2 sm:py-3'} text-right font-semibold text-green-600 text-sm`}>
                      ${project.roi.riskAdjustedNPV.toFixed(1)}M
                    </td>
                  </>
                )}
                <td className={`px-2 sm:px-4 ${displaySettings.compactView ? 'py-1.5 sm:py-2' : 'py-2 sm:py-3'} text-center hidden sm:table-cell`}>
                  <div className="flex items-center justify-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{project.allocatedResources.length}</span>
                  </div>
                </td>
                <td className={`px-2 sm:px-4 ${displaySettings.compactView ? 'py-1.5 sm:py-2' : 'py-2 sm:py-3'}`}>
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium ${statusColors[project.status]}`}>
                    {project.status}
                  </span>
                </td>
                <td className={`px-2 sm:px-4 ${displaySettings.compactView ? 'py-1.5 sm:py-2' : 'py-2 sm:py-3'}`}>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
