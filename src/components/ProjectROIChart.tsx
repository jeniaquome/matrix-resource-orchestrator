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
  critical: '#EF4444',
  high: '#F59E0B',
  medium: '#3B82F6',
  low: '#6B7280',
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Project ROI Landscape</h3>
        <div className="flex items-center gap-4 text-xs">
          {Object.entries(priorityColors).map(([priority, color]) => (
            <div key={priority} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="capitalize">{priority}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="Probability"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              label={{ value: 'Success Probability', position: 'bottom', offset: 0 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Value"
              tickFormatter={(v) => `$${v}M`}
              label={{ value: 'Est. Value ($M)', angle: -90, position: 'insideLeft' }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 500]} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border text-sm max-w-xs">
                    <p className="font-semibold text-gray-900">{data.name}</p>
                    <div className="mt-2 space-y-1">
                      <p><span className="text-gray-500">Est. Value:</span> ${data.y}M</p>
                      <p><span className="text-gray-500">Probability:</span> {data.x}%</p>
                      <p><span className="text-gray-500">Risk-Adj NPV:</span> ${data.z.toFixed(1)}M</p>
                      <p><span className="text-gray-500">Time to Value:</span> {data.timeToValue} months</p>
                      <p><span className="text-gray-500">Strategic Alignment:</span> {data.strategicAlignment}/10</p>
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

      <p className="text-xs text-gray-400 mt-2 text-center">
        Bubble size represents risk-adjusted NPV. Click a project to view details.
      </p>
    </div>
  );
}
