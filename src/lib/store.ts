import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Resource, Project, FunctionalSilo } from '@/types';
import { mockResources, mockProjects } from '@/data/mockData';

// Search types
export type SearchResultType = 'project' | 'resource' | 'milestone';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  description?: string;
  projectId?: string;
  relevance: number;
}

// Settings types
export interface NotificationSettings {
  conflicts: boolean;
  milestones: boolean;
  approvals: boolean;
  updates: boolean;
}

export interface DisplaySettings {
  compactView: boolean;
  showROI: boolean;
  showAvailability: boolean;
  animations: boolean;
  colorTheme: 'indigo' | 'blue' | 'emerald' | 'purple';
}

export interface DataSettings {
  refreshInterval: string;
  timezone: string;
  dateFormat: string;
}

export interface PrivacySettings {
  analyticsEnabled: boolean;
  sessionTimeout: string;
}

interface AppState {
  // Data
  resources: Resource[];
  projects: Project[];
  selectedProject: string | null;
  selectedResource: string | null;
  filterSilo: FunctionalSilo | 'all';

  // Search
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;

  // Settings
  notificationSettings: NotificationSettings;
  displaySettings: DisplaySettings;
  dataSettings: DataSettings;
  privacySettings: PrivacySettings;

  // Actions
  setSelectedProject: (id: string | null) => void;
  setSelectedResource: (id: string | null) => void;
  setFilterSilo: (silo: FunctionalSilo | 'all') => void;

  // Search actions
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => void;
  clearSearch: () => void;

  // Settings Actions
  setNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  setDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  setDataSettings: (settings: Partial<DataSettings>) => void;
  setPrivacySettings: (settings: Partial<PrivacySettings>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial data
      resources: mockResources,
      projects: mockProjects,
      selectedProject: null,
      selectedResource: null,
      filterSilo: 'all',

      // Search
      searchQuery: '',
      searchResults: [],
      isSearching: false,

      // Initial settings
      notificationSettings: {
        conflicts: true,
        milestones: true,
        approvals: true,
        updates: false,
      },
      displaySettings: {
        compactView: false,
        showROI: true,
        showAvailability: true,
        animations: true,
        colorTheme: 'indigo',
      },
      dataSettings: {
        refreshInterval: '5',
        timezone: 'America/Los_Angeles',
        dateFormat: 'MM/DD/YYYY',
      },
      privacySettings: {
        analyticsEnabled: true,
        sessionTimeout: '30 minutes',
      },

      // Data actions
      setSelectedProject: (id) => set({ selectedProject: id }),
      setSelectedResource: (id) => set({ selectedResource: id }),
      setFilterSilo: (silo) => set({ filterSilo: silo }),

      // Search actions
      setSearchQuery: (query) => set({ searchQuery: query }),

      performSearch: (query) => {
        const lowerQuery = query.toLowerCase().trim();

        if (!lowerQuery) {
          set({ searchResults: [], isSearching: false, searchQuery: '' });
          return;
        }

        set({ isSearching: true, searchQuery: query });

        const results: SearchResult[] = [];
        const { projects, resources } = get();

        // Search projects
        projects.forEach(project => {
          let relevance = 0;
          if (project.name.toLowerCase().includes(lowerQuery)) relevance += 10;
          if (project.description.toLowerCase().includes(lowerQuery)) relevance += 5;
          if (project.owner.toLowerCase().includes(lowerQuery)) relevance += 3;

          if (relevance > 0) {
            results.push({
              id: project.id,
              type: 'project',
              title: project.name,
              subtitle: project.owner,
              description: project.description,
              relevance,
            });
          }

          // Search milestones within projects
          project.milestones.forEach(milestone => {
            if (milestone.name.toLowerCase().includes(lowerQuery)) {
              results.push({
                id: milestone.id,
                type: 'milestone',
                title: milestone.name,
                subtitle: project.name,
                description: `Due ${new Date(milestone.dueDate).toLocaleDateString()}`,
                projectId: project.id,
                relevance: 7,
              });
            }
          });
        });

        // Search resources
        resources.forEach(resource => {
          let relevance = 0;
          if (resource.name.toLowerCase().includes(lowerQuery)) relevance += 10;
          if (resource.role.toLowerCase().includes(lowerQuery)) relevance += 5;
          if (resource.skills.some(skill => skill.toLowerCase().includes(lowerQuery))) relevance += 3;
          if (resource.silo.toLowerCase().includes(lowerQuery)) relevance += 2;

          if (relevance > 0) {
            results.push({
              id: resource.id,
              type: 'resource',
              title: resource.name,
              subtitle: resource.role,
              description: resource.silo,
              relevance,
            });
          }
        });

        // Sort by relevance
        results.sort((a, b) => b.relevance - a.relevance);

        set({ searchResults: results.slice(0, 20), isSearching: false });
      },

      clearSearch: () => set({ searchQuery: '', searchResults: [], isSearching: false }),

      // Settings actions
      setNotificationSettings: (settings) =>
        set((state) => ({
          notificationSettings: { ...state.notificationSettings, ...settings },
        })),
      setDisplaySettings: (settings) =>
        set((state) => ({
          displaySettings: { ...state.displaySettings, ...settings },
        })),
      setDataSettings: (settings) =>
        set((state) => ({
          dataSettings: { ...state.dataSettings, ...settings },
        })),
      setPrivacySettings: (settings) =>
        set((state) => ({
          privacySettings: { ...state.privacySettings, ...settings },
        })),
    }),
    {
      name: 'matrix-orchestrator-settings',
      partialize: (state) => ({
        notificationSettings: state.notificationSettings,
        displaySettings: state.displaySettings,
        dataSettings: state.dataSettings,
        privacySettings: state.privacySettings,
      }),
    }
  )
);

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
