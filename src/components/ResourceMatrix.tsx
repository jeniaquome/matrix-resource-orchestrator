'use client';

import { useAppStore } from '@/lib/store';
import { siloColors } from '@/data/mockData';
import { FunctionalSilo } from '@/types';

const availabilityColors = {
  available: 'bg-green-100 border-green-300',
  'partially-available': 'bg-yellow-100 border-yellow-300',
  unavailable: 'bg-red-100 border-red-300',
  'on-leave': 'bg-gray-100 border-gray-300',
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

  const silos: (FunctionalSilo | 'all')[] = ['all', 'Biology', 'Automation', 'CompSci', 'Chemistry', 'DataScience'];

  const filteredResources = filterSilo === 'all'
    ? resources
    : resources.filter(r => r.silo === filterSilo);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Resource Availability Matrix</h3>
        <div className="flex gap-1">
          {silos.map((silo) => (
            <button
              key={silo}
              onClick={() => setFilterSilo(silo)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterSilo === silo
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredResources.map((resource) => {
          const utilizationPercent = Math.round((resource.allocatedHours / resource.totalCapacity) * 100);
          const isOverallocated = resource.allocatedHours > resource.totalCapacity;

          return (
            <div
              key={resource.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                availabilityColors[resource.availability]
              } ${isOverallocated ? 'ring-2 ring-red-500' : ''}`}
              onClick={() => setSelectedResource(resource.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{resource.name}</p>
                  <p className="text-xs text-gray-500">{resource.role}</p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${availabilityDot[resource.availability]}`} />
              </div>

              <div
                className="inline-block px-2 py-0.5 rounded text-xs text-white mb-2"
                style={{ backgroundColor: siloColors[resource.silo] }}
              >
                {resource.silo}
              </div>

              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Utilization</span>
                  <span className={isOverallocated ? 'text-red-600 font-medium' : 'text-gray-700'}>
                    {resource.allocatedHours}h / {resource.totalCapacity}h
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
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

              <div className="mt-2 flex flex-wrap gap-1">
                {resource.skills.slice(0, 2).map((skill) => (
                  <span
                    key={skill}
                    className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
                  >
                    {skill}
                  </span>
                ))}
                {resource.skills.length > 2 && (
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-500">
                    +{resource.skills.length - 2}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
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
    </div>
  );
}
