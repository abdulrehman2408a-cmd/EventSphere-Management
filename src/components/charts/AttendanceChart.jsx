import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { day: 'Day 1 (09:00)', attendees: 1240, checkins: 980 },
  { day: 'Day 1 (12:00)', attendees: 3120, checkins: 2850 },
  { day: 'Day 1 (15:00)', attendees: 4820, checkins: 4410 },
  { day: 'Day 1 (18:00)', attendees: 4100, checkins: 3890 },
  { day: 'Day 2 (09:00)', attendees: 2100, checkins: 1950 },
  { day: 'Day 2 (12:00)', attendees: 5400, checkins: 5120 },
  { day: 'Day 2 (15:00)', attendees: 6200, checkins: 5890 },
  { day: 'Day 3 (12:00)', attendees: 4900, checkins: 4620 },
  { day: 'Day 3 (16:00)', attendees: 3800, checkins: 3500 }
];

export const AttendanceChart = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAttendees" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3A86FF" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3A86FF" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorCheckins" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06D6A0" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06D6A0" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0B132B',
              borderRadius: '12px',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12px'
            }}
          />
          <Area
            type="monotone"
            dataKey="attendees"
            name="Registered Visitors"
            stroke="#3A86FF"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorAttendees)"
          />
          <Area
            type="monotone"
            dataKey="checkins"
            name="Turnstile Verified Check-ins"
            stroke="#06D6A0"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCheckins)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
