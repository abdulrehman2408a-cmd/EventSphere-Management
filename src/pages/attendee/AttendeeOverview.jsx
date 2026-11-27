import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { TicketModal } from '../../components/common/TicketModal';
import { formatDate } from '../../utils/helpers';
import {
  Ticket,
  Bookmark,
  Building2,
  Calendar,
  MapPin,
  Clock,
  QrCode,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const AttendeeOverview = () => {
  const { registeredExpoIds, expos, bookmarks, sessions, exhibitors, attendees } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTicketModal, setActiveTicketModal] = useState(false);

  // Retrieve user registered expos
  const registeredExpos = expos.filter((e) => registeredExpoIds.includes(e.id) || registeredExpoIds.includes(e._id) || registeredExpoIds.includes(e.slug));
  const myPrimaryExpo = registeredExpos[0] || null;
  const myAttendeeRecord = attendees.find((a) => a.email === user?.email || a.userId === user?.id || a.user === user?.id) || {
    name: user?.name || 'Delegate',
    email: user?.email || '',
    ticketNumber: `ESP-${Date.now().toString().slice(-6)}`,
    ticketTier: 'General Pass'
  };

  const bookmarkedSessions = sessions.filter((s) => bookmarks.includes(s.id));

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome, {user?.name?.split(' ')[0] || 'Attendee'}!
            </h2>
            <Badge variant="purple" size="sm">
              Verified Delegate
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Your personal digital conference companion, electronic entrance badges, and bookmark agenda.
          </p>
        </div>

        {myPrimaryExpo && (
          <Button
            variant="primary"
            icon={QrCode}
            onClick={() => setActiveTicketModal(true)}
            className="shadow-sm shadow-brand-blue/20"
          >
            View My Digital Badge
          </Button>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Expos"
          value={registeredExpos.length}
          subtext="active delegate passes"
          icon={Ticket}
          iconBg="bg-blue-50 text-brand-blue"
          trend="Instant QR Ready"
          trendType="neutral"
        />
        <StatCard
          title="Bookmarked Sessions"
          value={bookmarks.length}
          subtext="keynotes & workshops"
          icon={Bookmark}
          iconBg="bg-amber-50 text-amber-600"
          trend="Synced to Agenda"
          trendType="neutral"
        />
        <StatCard
          title="Available Expos"
          value={expos.length}
          subtext="in national directory"
          icon={Building2}
          iconBg="bg-purple-50 text-brand-purple"
          trend="Live exhibitions"
          trendType="neutral"
        />
        <StatCard
          title="Turnstile Access"
          value={registeredExpos.length > 0 ? "Fast-Track" : "No Pass"}
          subtext={registeredExpos.length > 0 ? "valid gate badge" : "registration required"}
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
          trend="Gate Ingress"
          trendType="neutral"
        />
      </div>

      {/* Active Pass Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {myPrimaryExpo ? (
          <Card className="lg:col-span-2 p-6 bg-gradient-to-r from-brand-navy via-brand-deep to-slate-900 text-white shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Upcoming Flagship Conference
                </span>
                <span className="px-2.5 py-1 rounded-full bg-brand-blue/20 text-brand-blue font-bold text-xs border border-brand-blue/30">
                  Turnstile Confirmed
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">{myPrimaryExpo.title}</h3>
              <p className="text-xs text-slate-300">{myPrimaryExpo.theme}</p>

              <div className="flex items-center gap-6 text-xs text-slate-400 pt-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-blue" />
                  {formatDate(myPrimaryExpo.startDate)} – {formatDate(myPrimaryExpo.endDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  {myPrimaryExpo.venue}, {myPrimaryExpo.city}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Pass Reference</span>
                <span className="font-mono text-sm font-bold text-amber-400">
                  {myAttendeeRecord?.ticketNumber || 'ESP-2026-0981'}
                </span>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={QrCode}
                onClick={() => setActiveTicketModal(true)}
              >
                Open E-Badge QR
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="lg:col-span-2 p-8 bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
            <Ticket className="w-10 h-10 text-slate-400" />
            <div>
              <h3 className="font-bold text-base text-slate-800">No Active Pass</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                You haven&apos;t registered for an exhibition yet. Explore upcoming exhibitions to reserve your seat and generate your turnstile access QR code.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => navigate('/expos')}>
              Explore Exhibitions
            </Button>
          </Card>
        )}

        {/* Bookmarked Keynotes Sneak Peek */}
        <Card className="p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                Next Bookmarked Session
              </h4>
              <span
                onClick={() => navigate('/attendee/bookmarks')}
                className="text-xs text-brand-blue font-bold cursor-pointer hover:underline"
              >
                All ({bookmarks.length})
              </span>
            </div>

            {bookmarkedSessions[0] ? (
              <div className="space-y-3 pt-2">
                <Badge variant="purple" size="sm">{bookmarkedSessions[0].track}</Badge>
                <h5 className="font-bold text-sm text-slate-900 leading-snug">
                  {bookmarkedSessions[0].title}
                </h5>
                <p className="text-xs text-slate-500">
                  By <strong>{bookmarkedSessions[0].speaker}</strong>
                </p>
                <div className="flex items-center gap-2 text-xs text-brand-blue font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{bookmarkedSessions[0].startTime} ({bookmarkedSessions[0].room})</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 pt-4">No sessions bookmarked yet.</p>
            )}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/attendee/schedule')}
            className="w-full mt-4"
          >
            Browse Full Agenda →
          </Button>
        </Card>
      </div>

      {/* Ticket Modal */}
      <TicketModal
        isOpen={activeTicketModal}
        onClose={() => setActiveTicketModal(false)}
        attendee={myAttendeeRecord}
        expo={myPrimaryExpo}
      />
    </div>
  );
};
