import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const data = [
  { name: 'Information Technology & AI', value: 45, color: '#3A86FF' },
  { name: 'Textile & Apparel', value: 25, color: '#7209B7' },
  { name: 'Energy & Utilities', value: 15, color: '#06D6A0' },
  { name: 'Healthcare & Pharma', value: 10, color: '#FFB703' },
  { name: 'Auto & Mobility', value: 5, color: '#E63946' }
];

export const CategoryPieChart = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            formatter={(value) => [`${value}% of Exhibitor Mix`, 'Share']}
            contentStyle={{
              backgroundColor: '#0B132B',
              borderRadius: '12px',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12px'
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
