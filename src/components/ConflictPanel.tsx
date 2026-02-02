'use client';

import { useMemo } from 'react';
import { useAppStore, getConflicts } from '@/lib/store';
import { AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';

export function ConflictPanel() {
  const resources = useAppStore(state => state.resources);
  const projects = useAppStore(state => state.projects);
  const setSelectedResource = useAppStore(state => state.setSelectedResource);

  const conflicts = useMemo(() => getConflicts(resources, projects), [resources, projects]);

  if (conflicts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Conflicts</h3>
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">No conflicts detected</p>
          <p className="text-sm">All resources are within capacity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">Resource Conflicts ({conflicts.length})</h3>
      </div>

      <div className="space-y-4">
        {conflicts.map((conflict) => (
          <div
            key={conflict.resourceId}
            className="border border-red-100 rounded-lg p-4 bg-red-50/50 hover:bg-red-50 transition-colors cursor-pointer"
            onClick={() => setSelectedResource(conflict.resourceId)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{conflict.resourceName}</span>
              <span className="text-sm text-red-600 font-medium">
                {conflict.totalRequested}h / {conflict.availableCapacity}h
              </span>
            </div>

            <div className="space-y-1 mb-3">
              {conflict.projects.map((proj) => (
                <div key={proj.projectId} className="flex items-center gap-2 text-sm text-gray-600">
                  <ArrowRight className="w-3 h-3" />
                  <span>{proj.projectName}</span>
                  <span className="text-gray-400">({proj.hoursRequested}h/week)</span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 text-sm bg-amber-50 p-2 rounded border border-amber-100">
              <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{conflict.recommendation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
