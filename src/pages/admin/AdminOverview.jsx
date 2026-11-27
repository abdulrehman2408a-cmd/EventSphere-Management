import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AttendanceChart } from '../../components/charts/AttendanceChart';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { ExpoFormModal } from '../../components/forms/ExpoFormModal';
import { formatDate, formatCurrency } from '../../utils/helpers';
import {
  Calendar,
  Users,
  Building2,
  Layers,
  FileCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export const AdminOverview = () => {
  const { expos, exhibitors, booths, attendees, notifications, createExpo } = useData();
  const navigate = useNavigate();

  const [isExpoModalOpen, setIsExpoModalOpen] = useState(false);

  const pendingExhibitors = exhibitors.filter((e) => e.status === 'Pending').length;
  const bookedBooths = booths.filter((b) => b.status === 'Booked').length;
  const totalDelegates = attendees.length;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Organizer Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of your active exhibitions, booth bookings, and attendee check-ins.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsExpoModalOpen(true)}
            className="shadow-sm shadow-brand-blue/25"
          >
            Create New Expo
          </Button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Exhibitions"
          value={expos.length}
          subtext="across Karachi & Lahore"
          icon={Calendar}
          iconBg="bg-blue-50 text-brand-blue"
          trend="+2 this quarter"
          trendType="up"
        />
        <StatCard
          title="Registered Delegates"
          value={totalDelegates.toLocaleString()}
          subtext="across all conventions"
          icon={Users}
          iconBg="bg-purple-50 text-brand-purple"
          trend="+18.4% vs last expo"
          trendType="up"
        />
        <StatCard
          title="Stalls Allocated"
          value={`${bookedBooths} / ${booths.length}`}
          subtext={`${booths.length > 0 ? Math.round((bookedBooths / booths.length) * 100) : 0}% occupancy rate`}
          icon={Layers}
          iconBg="bg-emerald-50 text-emerald-600"
          trend="Real-time occupancy"
          trendType="neutral"
        />
        <StatCard
          title="Pending Applications"
          value={pendingExhibitors}
          subtext="exhibitor approvals"
          icon={FileCheck}
          iconBg="bg-amber-50 text-amber-600"
          trend="Review pending"
          trendType="down"
        />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Attendee Arrivals & Check-ins</h3>
              <p className="text-xs text-slate-400">Hourly entrance scans (Karachi Expo Centre)</p>
            </div>
            <Badge variant="primary" size="sm">Live Feed</Badge>
          </div>
          <AttendanceChart />
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Booth Sponsorship & Pass Revenue (PKR)</h3>
              <p className="text-xs text-slate-400">Stall reservations vs ticket pass sales</p>
            </div>
            <Badge variant="purple" size="sm">Summary</Badge>
          </div>
          <RevenueChart />
        </Card>
      </div>

      {/* UPCOMING EXPOS & RECENT ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Expos Table */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-blue" />
              Active Exhibitions & Trade Shows
            </h3>
            <button
              onClick={() => navigate('/admin/expos')}
              className="text-xs text-brand-blue font-bold hover:underline flex items-center gap-1"
            >
              <span>Manage Expos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Exhibition Title</th>
                  <th className="pb-3">Venue & City</th>
                  <th className="pb-3">Dates</th>
                  <th className="pb-3">Stalls</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      No exhibitions registered yet. Click &quot;Create New Expo&quot; to begin.
                    </td>
                  </tr>
                ) : (
                  expos.slice(0, 4).map((expo) => (
                    <tr key={expo.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 pr-2">
                        <div className="font-bold text-slate-900 line-clamp-1">{expo.title}</div>
                        <div className="text-[10px] text-brand-blue font-medium">{expo.category}</div>
                      </td>
                      <td className="py-3 pr-2 text-slate-600 truncate max-w-[140px]">
                        {expo.venue} ({expo.city})
                      </td>
                      <td className="py-3 pr-2 text-slate-600 whitespace-nowrap">
                        {formatDate(expo.startDate)}
                      </td>
                      <td className="py-3 pr-2 font-semibold text-slate-800">
                        {expo.bookedBooths} / {expo.totalBooths}
                      </td>
                      <td className="py-3 text-right">
                        <Badge
                          variant={
                            expo.status === 'Published'
                              ? 'success'
                              : expo.status === 'Completed'
                              ? 'default'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {expo.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Activities Feed */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              Live Operations Feed
            </h3>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No recent activity notifications.
              </div>
            ) : (
              notifications.slice(0, 5).map((notif) => (
                <div key={notif.id} className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{notif.title}</span>
                    <span className="text-[10px] text-slate-400">{notif.time}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Create Expo Modal */}
      <ExpoFormModal
        isOpen={isExpoModalOpen}
        onClose={() => setIsExpoModalOpen(false)}
        onSubmit={createExpo}
      />
    </div>
  );
};
