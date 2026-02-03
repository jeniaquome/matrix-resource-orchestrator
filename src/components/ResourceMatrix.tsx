'use client';

import { useAppStore } from '@/lib/store';
import { siloColors } from '@/data/mockData';
import { FunctionalSilo } from '@/types';

const availabilityColors = {
  available: 'bg-green-100 border-green-300',
  'partially-available': 'bg-yellow-100 border-yellow-300',
  unavailable: 'bg-red-100 border-red-300',
  'on-leave': 'bg-slate-100 border-gray-300',
};

const availabilityDot = {
  available: 'bg-green-500',
  'partially-available': 'bg-yellow-500',
  unavailable: 'bg-red-500',
  'on-leave': 'bg-gray-400',
};

export function ResourceMatrix() {
  const resources = useAppStore(state => state.resources);
  const filterSilo = useAppStore(state => state.filterSilo);
  const setFilterSilo = useAppStore(state => state.setFilterSilo);
  const setSelectedResource = useAppStore(state => state.setSelectedResource);
  const displaySettings = useAppStore(state => state.displaySettings);

  const silos: (FunctionalSilo | 'all')[] = ['all', 'Biology', 'Automation', 'CompSci', 'Chemistry', 'DataScience'];

  const filteredResources = filterSilo === 'all'
    ? resources
    : resources.filter(r => r.silo === filterSilo);

  // Adjust grid based on compact view
  const gridClass = displaySettings.compactView
    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900">Resource Availability Matrix</h3>
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
          {silos.map((silo) => (
            <button
              key={silo}
              onClick={() => setFilterSilo(silo)}
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${displaySettings.animations ? 'transition-colors' : ''} ${
                filterSilo === silo
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              style={
                filterSilo === silo && silo !== 'all'
                  ? { backgroundColor: siloColors[silo as FunctionalSilo] }
                  : undefined
              }
            >
              {silo === 'all' ? 'All' : silo}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid ${gridClass} gap-3`}>
        {filteredResources.map((resource) => {
          const utilizationPercent = Math.round((resource.allocatedHours / resource.totalCapacity) * 100);
          const isOverallocated = resource.allocatedHours > resource.totalCapacity;

          return (
            <div
              key={resource.id}
              className={`${displaySettings.compactView ? 'p-2' : 'p-3'} rounded-lg border cursor-pointer ${displaySettings.animations ? 'transition-all hover:shadow-md' : ''} ${
                displaySettings.showAvailability ? availabilityColors[resource.availability] : 'bg-white border-slate-200'
              } ${isOverallocated ? 'ring-2 ring-red-500' : ''}`}
              onClick={() => setSelectedResource(resource.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className={`font-medium text-slate-900 ${displaySettings.compactView ? 'text-xs' : 'text-sm'}`}>
                    {resource.name}
                  </p>
                  {!displaySettings.compactView && (
                    <p className="text-xs text-slate-500">{resource.role}</p>
                  )}
                </div>
                {displaySettings.showAvailability && (
                  <div className={`w-2.5 h-2.5 rounded-full ${availabilityDot[resource.availability]}`} />
                )}
              </div>

              <div
                className={`inline-block px-2 py-0.5 rounded text-xs text-white ${displaySettings.compactView ? 'mb-1' : 'mb-2'}`}
                style={{ backgroundColor: siloColors[resource.silo] }}
              >
                {resource.silo}
              </div>

              <div className={displaySettings.compactView ? 'mt-1' : 'mt-2'}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Utilization</span>
                  <span className={isOverallocated ? 'text-red-600 font-medium' : 'text-slate-700'}>
                    {resource.allocatedHours}h / {resource.totalCapacity}h
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${displaySettings.animations ? 'transition-all' : ''} ${
                      isOverallocated
                        ? 'bg-red-500'
                        : utilizationPercent > 80
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                  />
                </div>
              </div>

              {!displaySettings.compactView && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {resource.skills.slice(0, 2).map((skill) => (
                    <span
                      key={skill}
                      className="px-1.5 py-0.5 bg-slate-100 rounded text-xs text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                  {resource.skills.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded text-xs text-slate-500">
                      +{resource.skills.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {displaySettings.showAvailability && (
        <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Unavailable</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
            <span>On Leave</span>
          </div>
        </div>
      )}
    </div>
  );
}
