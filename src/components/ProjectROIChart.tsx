'use client';

import { useAppStore } from '@/lib/store';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
} from 'recharts';

const priorityColors = {
  critical: '#DC2626',
  high: '#0F766E',
  medium: '#0D9488',
  low: '#64748B',
};

export function ProjectROIChart() {
  const projects = useAppStore(state => state.projects);
  const setSelectedProject = useAppStore(state => state.setSelectedProject);

  const chartData = projects
    .filter(p => p.status === 'active')
    .map(p => ({
      id: p.id,
      name: p.name,
      x: p.roi.probability,
      y: p.roi.estimatedValue,
      z: p.roi.riskAdjustedNPV,
      priority: p.priority,
      timeToValue: p.roi.timeToValue,
      strategicAlignment: p.roi.strategicAlignment,
    }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900">Project ROI Landscape</h3>
        <div className="flex items-center gap-2 sm:gap-4 text-xs flex-wrap">
          {Object.entries(priorityColors).map(([priority, color]) => (
            <div key={priority} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="capitalize">{priority}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-56 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="Probability"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              fontSize={11}
              label={{ value: 'Success Probability', position: 'bottom', offset: 10, fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Value"
              tickFormatter={(v) => `$${v}M`}
              fontSize={11}
              width={45}
              label={{ value: 'Value ($M)', angle: -90, position: 'insideLeft', fontSize: 11 }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 500]} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border text-sm max-w-xs">
                    <p className="font-semibold text-slate-900">{data.name}</p>
                    <div className="mt-2 space-y-1">
                      <p><span className="text-slate-500">Est. Value:</span> ${data.y}M</p>
                      <p><span className="text-slate-500">Probability:</span> {data.x}%</p>
                      <p><span className="text-slate-500">Risk-Adj NPV:</span> ${data.z.toFixed(1)}M</p>
                      <p><span className="text-slate-500">Time to Value:</span> {data.timeToValue} months</p>
                      <p><span className="text-slate-500">Strategic Alignment:</span> {data.strategicAlignment}/10</p>
                    </div>
                  </div>
                );
              }}
            />
            <Scatter
              data={chartData}
              onClick={(data) => setSelectedProject(data.id)}
              style={{ cursor: 'pointer' }}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={priorityColors[entry.priority]}
                  fillOpacity={0.8}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-400 mt-2 text-center">
        Bubble size represents risk-adjusted NPV. Click a project to view details.
      </p>
    </div>
  );
}
