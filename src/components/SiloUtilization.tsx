'use client';

import { useMemo } from 'react';
import { useAppStore, getSiloSummaries } from '@/lib/store';
import { siloColors } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function SiloUtilization() {
  const resources = useAppStore(state => state.resources);
  const projects = useAppStore(state => state.projects);

  const summaries = useMemo(() => getSiloSummaries(resources, projects), [resources, projects]);

  const chartData = summaries.map(s => ({
    name: s.silo,
    utilization: s.utilizationRate,
    available: 100 - s.utilizationRate,
    resources: s.totalResources,
    allocated: s.allocatedHours,
    capacity: s.totalCapacity,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Silo Utilization</h3>
      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: -20, right: 10 }}>
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} fontSize={12} />
            <YAxis dataKey="name" type="category" width={80} fontSize={11} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border text-sm">
                    <p className="font-semibold">{data.name}</p>
                    <p>Utilization: {data.utilization}%</p>
                    <p>Resources: {data.resources}</p>
                    <p>Allocated: {data.allocated}h / {data.capacity}h</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="utilization" radius={[0, 4, 4, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={siloColors[entry.name as keyof typeof siloColors]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
        {summaries.map(s => (
          <div key={s.silo} className="text-center">
            <div
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: siloColors[s.silo] }}
            />
            <p className="text-xs text-gray-600 truncate">{s.silo}</p>
            <p className="text-xs text-gray-400">{s.availableResources}/{s.totalResources}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
