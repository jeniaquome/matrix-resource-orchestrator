'use client';

import { Header } from '@/components/Header';
import { MetricsCards } from '@/components/MetricsCards';
import { SiloUtilization } from '@/components/SiloUtilization';
import { ProjectROIChart } from '@/components/ProjectROIChart';
import { ConflictPanel } from '@/components/ConflictPanel';
import { MilestonesTimeline } from '@/components/MilestonesTimeline';
import { ProjectsTable } from '@/components/ProjectsTable';
import { ResourceMatrix } from '@/components/ResourceMatrix';
import { ProjectDetail } from '@/components/ProjectDetail';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Metrics Overview */}
          <MetricsCards />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <SiloUtilization />
            <ProjectROIChart />
          </div>

          {/* Conflicts and Milestones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ConflictPanel />
            <MilestonesTimeline />
          </div>

          {/* Projects Table */}
          <ProjectsTable />

          {/* Resource Matrix */}
          <ResourceMatrix />
        </div>
      </main>

      {/* Slide-over detail panel */}
      <ProjectDetail />
    </div>
  );
}
