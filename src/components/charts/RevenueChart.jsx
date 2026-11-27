import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const data = [
  { name: 'Tech & AI Summit', boothRevenue: 28.5, ticketRevenue: 12.0 },
  { name: 'Textile Expo', boothRevenue: 42.0, ticketRevenue: 13.7 },
  { name: 'Solar Clean Energy', boothRevenue: 24.2, ticketRevenue: 3.5 },
  { name: 'Health Pharma', boothRevenue: 31.0, ticketRevenue: 10.2 },
  { name: 'Auto & Mobility', boothRevenue: 18.0, ticketRevenue: 1.2 },
  { name: 'AgriTech Security', boothRevenue: 36.4, ticketRevenue: 8.4 }
];

export const RevenueChart = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748B' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${val}M`}
          />
          <Tooltip
            formatter={(value) => [`PKR ${value} Million`, '']}
            contentStyle={{
              backgroundColor: '#0B132B',
              borderRadius: '12px',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Bar dataKey="boothRevenue" name="Booth Sponsorships (PKR M)" fill="#3A86FF" radius={[6, 6, 0, 0]} />
          <Bar dataKey="ticketRevenue" name="Delegate Pass Sales (PKR M)" fill="#7209B7" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
