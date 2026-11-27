import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { AttendanceChart } from '../../components/charts/AttendanceChart';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { BoothTrafficChart } from '../../components/charts/BoothTrafficChart';
import { CategoryPieChart } from '../../components/charts/CategoryPieChart';
import { exportToCSV } from '../../utils/helpers';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Users,
  Layers,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminAnalytics = () => {
  const [timeframe, setTimeframe] = useState('MonthToDate');

  const handleExportAnalyticsReport = () => {
    const reportData = [
      { Metric: 'Total Delegate Registrations', Value: '45,820', Growth: '+18.4%' },
      { Metric: 'Gross Stall Sponsorship Revenue (PKR)', Value: '145,800,000', Growth: '+24.1%' },
      { Metric: 'Turnstile Verified Check-in Rate', Value: '92.6%', Growth: '+4.2%' },
      { Metric: 'Average B2B Leads Captured per Stall', Value: '112', Growth: '+15.0%' },
      { Metric: 'Top Footfall Hall', Value: 'Hall 1 (Tech & AI)', Growth: 'N/A' }
    ];
    exportToCSV(reportData, `EventSphere_Analytics_${timeframe}.csv`);
    toast.success('Analytics report exported as CSV!');
  };

  return (
    <div className="space-y-8">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Analytics & Performance Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track attendance trends, booth reservation revenue, and industry distributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            {['Last7Days', 'MonthToDate', 'AllSummits'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeframe === tf
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf === 'Last7Days' ? '7 Days' : tf === 'MonthToDate' ? 'Month' : 'All Summits'}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExportAnalyticsReport}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Convention Revenue"
          value="PKR 145.8M"
          subtext="Booth + Pass Sales"
          icon={DollarSign}
          iconBg="bg-blue-50 text-brand-blue"
          trend="+22.5% YoY"
          trendType="up"
        />
        <StatCard
          title="Turnstile Verified Passes"
          value="38,410"
          subtext="RFID & QR Gate Scans"
          icon={Users}
          iconBg="bg-emerald-50 text-emerald-600"
          trend="92.4% Show Rate"
          trendType="up"
        />
        <StatCard
          title="Avg Stall Lead Capture"
          value="112 Leads"
          subtext="per corporate exhibitor"
          icon={Layers}
          iconBg="bg-purple-50 text-brand-purple"
          trend="+15% vs 2025"
          trendType="up"
        />
        <StatCard
          title="Average Session Rating"
          value="4.84 / 5.0"
          subtext="Delegate survey score"
          icon={TrendingUp}
          iconBg="bg-amber-50 text-amber-600"
          trend="High Satisfaction"
          trendType="up"
        />
      </div>

      {/* Row 1: Attendance Flow & Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Attendee Arrivals & Entrance Flow</h3>
              <p className="text-xs text-slate-400">Hourly check-ins compared to registrations</p>
            </div>
            <Badge variant="primary" size="sm">Gate 1 & 2</Badge>
          </div>
          <AttendanceChart />
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Revenue by Event (PKR Millions)</h3>
              <p className="text-xs text-slate-400">Booth bookings vs ticket sales</p>
            </div>
            <Badge variant="purple" size="sm">Summary</Badge>
          </div>
          <RevenueChart />
        </Card>
      </div>

      {/* Row 2: Booth Traffic Leaderboard & Category Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Top Visited Exhibition Booths</h3>
              <p className="text-xs text-slate-400">Most active booths by visitor scans</p>
            </div>
            <Badge variant="success" size="sm">Leaderboard</Badge>
          </div>
          <BoothTrafficChart />
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Exhibitors by Industry</h3>
              <p className="text-xs text-slate-400">Distribution across event sectors</p>
            </div>
            <Badge variant="default" size="sm">Industry Mix</Badge>
          </div>
          <CategoryPieChart />
        </Card>
      </div>
    </div>
  );
};
