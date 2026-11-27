import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { FloorPlanInteractive } from '../../components/common/FloorPlanInteractive';
import { RegisterModal } from '../../components/forms/RegisterModal';
import { TicketModal } from '../../components/common/TicketModal';
import { formatDate, formatCurrency } from '../../utils/helpers';
import {
  Calendar,
  MapPin,
  Users,
  Layers,
  Sparkles,
  Ticket,
  Clock,
  Building2,
  Bookmark,
  Share2,
  CheckCircle2,
  DollarSign,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ExpoDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { expos, exhibitors, booths, sessions, registerForExpo, toggleBookmarkSession, bookmarks, attendees } = useData();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [createdAttendeeTicket, setCreatedAttendeeTicket] = useState(null);

  const expo = expos.find(
  (e) => e.id === id || e._id === id || e.slug === id
);
  const expoId = expo?.id || expo?._id;
  const expoExhibitors = exhibitors.filter((exh) => exh.expoId === expoId || exh.expo === expoId || exh.expo?._id === expoId || exh.status === 'Approved');
  const expoBooths = booths.filter((b) => b.expoId === expoId || b.expo === expoId || b.expo?._id === expoId || true);
  const expoSessions = sessions.filter((s) => s.expoId === expoId || s.expo === expoId || s.expo?._id === expoId);

  if (!expo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Expo Not Found</h2>
        <Button variant="primary" className="mt-4" onClick={() => navigate('/expos')}>
          Return to Expos
        </Button>
      </div>
    );
  }

  const handleRegisterSuccess = async (targetExpoId, attendeeDetails) => {
    try {
      const attendee = await registerForExpo(targetExpoId || expoId, attendeeDetails);
      setCreatedAttendeeTicket(attendee);
    } catch {
      // Error handled in registerForExpo
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Expo link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Cover */}
      <div className="relative bg-slate-900 text-white min-h-[380px] flex items-end">
        <img
          src={expo.coverImage}
          alt={expo.title}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 w-full space-y-4">
          <button
            onClick={() => navigate('/expos')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Expos
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="purple" size="md">
              {expo.category}
            </Badge>
            <Badge variant="success" size="md">
              {expo.status}
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl">
            {expo.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-3xl">
            {expo.theme}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-blue" />
              {formatDate(expo.startDate)} – {formatDate(expo.endDate)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              {expo.venue}, {expo.city}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              {expo.registeredAttendees} Registered
            </span>
          </div>
        </div>
      </div>

      {/* Main Content & Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sticky Action Strip */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-premium p-4 -mt-10 relative z-20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-brand-blue rounded-xl font-black text-lg">
              {expo.ticketPricePKR === 0 ? 'FREE' : formatCurrency(expo.ticketPricePKR)}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Delegate Registration Open</p>
              <p className="text-[11px] text-slate-500">Instant turnstile digital badge confirmation</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <Button
              variant="secondary"
              icon={Share2}
              onClick={handleShare}
            >
              Share
            </Button>
            <Button
              variant="primary"
              icon={Ticket}
              onClick={() => setIsRegisterModalOpen(true)}
              className="flex-1 md:flex-none shadow-md shadow-brand-blue/20"
            >
              Get Delegate Pass
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mt-8 overflow-x-auto gap-2">
          {[
            { id: 'overview', name: 'Overview & Highlights' },
            { id: 'agenda', name: `Conference Agenda (${expoSessions.length})` },
            { id: 'exhibitors', name: `Exhibitor Directory (${expoExhibitors.length})` },
            { id: 'floorplan', name: 'Stall Floor Plan' },
            { id: 'venue', name: 'Venue & Logistics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="pt-6">
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">About The Exhibition</h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {expo.description}
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Key Pillars & Delegate Amenities</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Dedicated VIP B2B Business Matchmaking Lounges</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Turnstile Automated High-Speed QR Check-in</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Live Hackathons & Research Poster Sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>International Buyer Delegation Suites</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Quick Info */}
              <div className="space-y-4">
                <Card className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                    Event Snapshot
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Max Capacity:</span>
                      <span className="font-bold text-slate-800">{(expo.capacity ?? 0).toLocaleString()} Delegates</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Stall Inventory:</span>
                      <span className="font-bold text-slate-800">{expo.totalBooths} Stalls</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Allocated Stalls:</span>
                      <span className="font-bold text-brand-blue">{expo.bookedBooths} Booked</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Host City:</span>
                      <span className="font-bold text-slate-800">{expo.city}, Pakistan</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => setIsRegisterModalOpen(true)}
                    >
                      Enroll as Delegate
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* 2. AGENDA */}
          {activeTab === 'agenda' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Conference Sessions & Keynotes</h3>
                <span className="text-xs text-slate-500">Bookmark sessions to build your personal agenda</span>
              </div>

              {expoSessions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
                  Agenda sessions being finalized by organizing committee.
                </div>
              ) : (
                expoSessions.map((ses) => {
                  const isBookmarked = bookmarks.includes(ses.id);
                  return (
                    <Card key={ses.id} className="p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={ses.speakerImage}
                          alt={ses.speaker}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="purple" size="sm">{ses.track}</Badge>
                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {ses.startTime} - {ses.endTime}
                            </span>
                          </div>
                          <h4 className="font-bold text-base text-slate-900">{ses.title}</h4>
                          <p className="text-xs text-slate-600 font-medium">
                            Speaker: <strong className="text-slate-900">{ses.speaker}</strong> ({ses.speakerRole})
                          </p>
                          <p className="text-xs text-slate-500">
                            Room: <strong>{ses.room}</strong>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleBookmarkSession(ses.id)}
                        className={`p-2.5 rounded-xl border transition-all ${
                          isBookmarked
                            ? 'bg-amber-50 border-amber-300 text-amber-600'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                        }`}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark session'}
                      >
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                      </button>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {/* 3. EXHIBITORS */}
          {activeTab === 'exhibitors' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {expoExhibitors.map((exh) => (
                <Card key={exh.id} hover onClick={() => navigate(`/exhibitors/${exh.id}`)} className="p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={exh.logo}
                        alt={exh.companyName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{exh.companyName}</h4>
                        <p className="text-xs text-brand-blue">{exh.industry}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{exh.tagline}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      Stall: {exh.boothNumber}
                    </span>
                    <span className="text-brand-blue font-semibold hover:underline">
                      Profile →
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* 4. FLOOR PLAN */}
          {activeTab === 'floorplan' && (
            <div className="space-y-4">
              <FloorPlanInteractive
                booths={expoBooths}
                onBookBooth={(booth) => {
                  toast.success(`Selected Stall ${booth.number}! Switch to Exhibitor portal to book.`);
                }}
              />
            </div>
          )}

          {/* 5. VENUE */}
          {activeTab === 'venue' && (
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{expo.venue}</h3>
                <p className="text-xs text-slate-500 mt-1">{expo.city}, Pakistan</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-800 mb-1">Gate & Parking</h5>
                  <p className="text-slate-600">VIP parking available at Gate 2. General visitor parking at Gate 4.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-800 mb-1">Public Transit</h5>
                  <p className="text-slate-600">Directly accessible via Red/Green Line BRT stations and University Road.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-800 mb-1">Cargo & Stalls</h5>
                  <p className="text-slate-600">Freight loading ramps active from Gate 3 starting 48 hours prior to opening.</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        expo={expo}
        onRegisterSuccess={handleRegisterSuccess}
      />

      {/* Ticket Modal After Registration */}
      {createdAttendeeTicket && (
        <TicketModal
          isOpen={!!createdAttendeeTicket}
          onClose={() => setCreatedAttendeeTicket(null)}
          attendee={createdAttendeeTicket}
          expo={expo}
        />
      )}
    </div>
  );
};
