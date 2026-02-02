import { create } from 'zustand';
import { Resource, Project, FunctionalSilo } from '@/types';
import { mockResources, mockProjects } from '@/data/mockData';

interface AppState {
  resources: Resource[];
  projects: Project[];
  selectedProject: string | null;
  selectedResource: string | null;
  filterSilo: FunctionalSilo | 'all';

  // Actions
  setSelectedProject: (id: string | null) => void;
  setSelectedResource: (id: string | null) => void;
  setFilterSilo: (silo: FunctionalSilo | 'all') => void;
}

export const useAppStore = create<AppState>((set) => ({
  resources: mockResources,
  projects: mockProjects,
  selectedProject: null,
  selectedResource: null,
  filterSilo: 'all',

  setSelectedProject: (id) => set({ selectedProject: id }),
  setSelectedResource: (id) => set({ selectedResource: id }),
  setFilterSilo: (silo) => set({ filterSilo: silo }),
}));

// Helper functions (not hooks - just pure functions)
export function getMetrics(resources: Resource[], projects: Project[]) {
  const activeProjects = projects.filter(p => p.status === 'active');

  const totalCapacity = resources.reduce((sum, r) => sum + r.totalCapacity, 0);
  const totalAllocated = resources.reduce((sum, r) => sum + r.allocatedHours, 0);

  const upcomingMilestones = projects
    .flatMap(p => p.milestones)
    .filter(m => !m.completed && new Date(m.dueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
    .length;

  const conflicts = getConflicts(resources, projects);

  return {
    totalProjects: projects.length,
    activeProjects: activeProjects.length,
    totalResources: resources.length,
    avgUtilization: Math.round((totalAllocated / totalCapacity) * 100),
    totalROI: projects.reduce((sum, p) => sum + p.roi.riskAdjustedNPV, 0),
    conflicts: conflicts.length,
    upcomingMilestones,
  };
}

export function getConflicts(resources: Resource[], projects: Project[]) {
  const conflicts: {
    resourceId: string;
    resourceName: string;
    projects: { projectId: string; projectName: string; hoursRequested: number }[];
    totalRequested: number;
    availableCapacity: number;
    recommendation: string;
  }[] = [];

  resources.forEach(resource => {
    if (resource.allocatedHours > resource.totalCapacity) {
      const projectAllocations = projects
        .filter(p => resource.currentProjects.includes(p.id))
        .map(p => {
          const allocation = p.allocatedResources.find(a => a.resourceId === resource.id);
          return {
            projectId: p.id,
            projectName: p.name,
            hoursRequested: allocation?.hoursPerWeek || 0,
          };
        });

      conflicts.push({
        resourceId: resource.id,
        resourceName: resource.name,
        projects: projectAllocations,
        totalRequested: resource.allocatedHours,
        availableCapacity: resource.totalCapacity,
        recommendation: generateRecommendation(resource, projectAllocations, projects),
      });
    }
  });

  return conflicts;
}

export function getSiloSummaries(resources: Resource[], projects: Project[]) {
  const silos: FunctionalSilo[] = ['Biology', 'Automation', 'CompSci', 'Chemistry', 'DataScience'];

  return silos.map(silo => {
    const siloResources = resources.filter(r => r.silo === silo);
    const totalCapacity = siloResources.reduce((sum, r) => sum + r.totalCapacity, 0);
    const allocatedHours = siloResources.reduce((sum, r) => sum + r.allocatedHours, 0);

    // Get project hours by project for this silo
    const projectHours: Record<string, number> = {};
    siloResources.forEach(r => {
      projects.forEach(p => {
        const allocation = p.allocatedResources.find(a => a.resourceId === r.id);
        if (allocation) {
          projectHours[p.name] = (projectHours[p.name] || 0) + allocation.hoursPerWeek;
        }
      });
    });

    const topProjects = Object.entries(projectHours)
      .map(([name, hours]) => ({ name, hours }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 3);

    return {
      silo,
      totalResources: siloResources.length,
      availableResources: siloResources.filter(r => r.availability === 'available').length,
      totalCapacity,
      allocatedHours,
      utilizationRate: totalCapacity > 0 ? Math.round((allocatedHours / totalCapacity) * 100) : 0,
      topProjects,
    };
  });
}

function generateRecommendation(
  resource: Resource,
  allocations: { projectId: string; projectName: string; hoursRequested: number }[],
  projects: Project[]
): string {
  // Sort projects by ROI
  const sortedByROI = allocations
    .map(a => {
      const project = projects.find(p => p.id === a.projectId);
      return { ...a, roi: project?.roi.riskAdjustedNPV || 0 };
    })
    .sort((a, b) => a.roi - b.roi);

  const lowestROI = sortedByROI[0];
  if (!lowestROI) return 'Review allocations';

  const overallocation = resource.allocatedHours - resource.totalCapacity;

  return `Consider reducing ${lowestROI.projectName} allocation by ${overallocation}h/week (lowest ROI: $${lowestROI.roi.toFixed(1)}M)`;
}
