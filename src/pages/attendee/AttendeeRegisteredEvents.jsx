import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { TicketModal } from '../../components/common/TicketModal';
import { formatDate } from '../../utils/helpers';
import { Ticket, Calendar, MapPin, QrCode, ArrowRight, ExternalLink } from 'lucide-react';

export const AttendeeRegisteredEvents = () => {
  const { registeredExpoIds, expos, attendees } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [inspectTicketExpo, setInspectTicketExpo] = useState(null);

  const registeredExpos = expos.filter((e) =>
    registeredExpoIds.includes(e.id) ||
    registeredExpoIds.includes(e._id) ||
    registeredExpoIds.includes(e.slug)
  );
  const myAttendee = attendees.find((a) => a.email === user?.email || a.userId === user?.id || a.user === user?.id) || {
    name: user?.name || 'Delegate',
    email: user?.email || '',
    ticketNumber: `ESP-${Date.now().toString().slice(-6)}`,
    ticketTier: 'General Pass'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            My Registered Expos & Digital Passes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant electronic turnstile access credentials and event logistics for your confirmed conventions.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/expos')}
        >
          Explore More Expos
        </Button>
      </div>

      {registeredExpos.length === 0 ? (
        <EmptyState
          title="No Registered Expos"
          description="You have not registered for any exhibitions yet. Browse upcoming trade shows and conferences to secure your delegate pass."
          actionLabel="Explore Exhibitions"
          onAction={() => navigate('/expos')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registeredExpos.map((expo) => (
            <Card key={expo.id} className="p-0 overflow-hidden flex flex-col justify-between group shadow-subtle hover:shadow-premium transition-all">
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={expo.coverImage}
                  alt={expo.title}
                  className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <Badge variant="purple" size="sm">{expo.category}</Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue block">
                    Delegate Pass Active
                  </span>
                  <h3 className="font-bold text-base text-white line-clamp-1">{expo.title}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-blue" />
                    <span>{formatDate(expo.startDate)} – {formatDate(expo.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>{expo.venue}, {expo.city}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Pass ID</span>
                    <span className="font-black text-slate-900">{myAttendee?.ticketNumber || 'ESP-2026-0981'}</span>
                  </div>
                  <Badge variant="success" size="sm">Gate 2 VIP Lane</Badge>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/expos/${expo.id}`)}
                  >
                    Expo Details
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={QrCode}
                    onClick={() => setInspectTicketExpo(expo)}
                  >
                    View Digital Pass
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Ticket Modal */}
      {inspectTicketExpo && (
        <TicketModal
          isOpen={!!inspectTicketExpo}
          onClose={() => setInspectTicketExpo(null)}
          attendee={myAttendee}
          expo={inspectTicketExpo}
        />
      )}
    </div>
  );
};
