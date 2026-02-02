// Core types for the Matrix Resource Orchestrator

export type FunctionalSilo = 'Biology' | 'Automation' | 'CompSci' | 'Chemistry' | 'DataScience';

export type AvailabilityStatus = 'available' | 'partially-available' | 'unavailable' | 'on-leave';

export type ProjectStatus = 'active' | 'planned' | 'on-hold' | 'completed';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface Resource {
  id: string;
  name: string;
  role: string;
  silo: FunctionalSilo;
  skills: string[];
  availability: AvailabilityStatus;
  allocatedHours: number; // hours per week already allocated
  totalCapacity: number; // max hours per week
  currentProjects: string[]; // project IDs
  avatarUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  roi: ROIMetrics;
  requiredSilos: FunctionalSilo[];
  allocatedResources: ResourceAllocation[];
  startDate: string;
  endDate: string;
  owner: string;
  milestones: Milestone[];
}

export interface ResourceAllocation {
  resourceId: string;
  projectId: string;
  hoursPerWeek: number;
  startDate: string;
  endDate: string;
  role: string;
}

export interface ROIMetrics {
  estimatedValue: number; // in millions USD
  probability: number; // 0-100%
  timeToValue: number; // months
  riskAdjustedNPV: number; // calculated: value * probability
  strategicAlignment: number; // 1-10 scale
  resourceEfficiency: number; // output per resource hour
}

export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
  blockers?: string[];
}

export interface AllocationConflict {
  resourceId: string;
  resourceName: string;
  projects: {
    projectId: string;
    projectName: string;
    hoursRequested: number;
  }[];
  totalRequested: number;
  availableCapacity: number;
  recommendation: string;
}

export interface SiloSummary {
  silo: FunctionalSilo;
  totalResources: number;
  availableResources: number;
  totalCapacity: number;
  allocatedHours: number;
  utilizationRate: number;
  topProjects: { name: string; hours: number }[];
}

export interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  totalResources: number;
  avgUtilization: number;
  totalROI: number;
  conflicts: number;
  upcomingMilestones: number;
}
