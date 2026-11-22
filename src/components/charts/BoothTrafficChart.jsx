import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const trafficData = [
  { booth: 'A-101 (Systems Ltd)', visitors: 1420 },
  { booth: 'A-102 (Jazz VEON)', visitors: 1980 },
  { booth: 'A-103 (10Pearls)', visitors: 1150 },
  { booth: 'B-201 (Nishat Mills)', visitors: 880 },
  { booth: 'B-205 (Getz Pharma)', visitors: 1040 },
  { booth: 'C-301 (Reon Energy)', visitors: 920 },
  { booth: 'C-302 (Siemens)', visitors: 1100 },
  { booth: 'C-305 (Engro Agri)', visitors: 1600 }
];

export const BoothTrafficChart = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={trafficData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
          <YAxis dataKey="booth" type="category" tick={{ fontSize: 10, fill: '#334155' }} tickLine={false} axisLine={false} width={130} />
          <Tooltip
            formatter={(val) => [`${val} In-Person Scanned Leads`, 'Footfall']}
            contentStyle={{
              backgroundColor: '#0B132B',
              borderRadius: '12px',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12px'
            }}
          />
          <Bar dataKey="visitors" fill="#06D6A0" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
