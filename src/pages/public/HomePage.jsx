import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { formatDate, formatCurrency } from '../../utils/helpers';
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Building2,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Zap,
  Globe2,
  Star,
  Quote
} from 'lucide-react';

/**
 * HomePage component
 * Main landing page showcasing upcoming events, industry categories,
 * featured exhibitors, key platform benefits, and testimonials.
 */
export const HomePage = () => {
  const { expos, exhibitors, feedback } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const featuredExpos = expos.slice(0, 3);
  const featuredExhibitors = exhibitors.slice(0, 6);

  const categories = [
    { name: 'Information Technology', count: '140+ Booths', icon: Cpu, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { name: 'Textile & Manufacturing', count: '200+ Stalls', icon: Layers, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { name: 'Solar & Clean Energy', count: '85+ Stalls', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { name: 'Healthcare & Pharma', count: '110+ Stalls', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { name: 'Automotive & Mobility', count: '150+ Stalls', icon: Globe2, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { name: 'AgriTech & Food', count: '140+ Stalls', icon: Sparkles, color: 'text-teal-600 bg-teal-50 border-teal-200' }
  ];

  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Modern Expo & Event Management Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Discover, Organize, and Exhibit at <br className="hidden sm:inline" />
              <span className="text-blue-600">
                Leading Expos & Conferences
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              EventSphere makes it simple to reserve exhibition booths, manage conference agendas, and issue instant digital entry passes—all in one clean platform.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/expos')}
                className="w-full sm:w-auto shadow-sm"
              >
                Browse Upcoming Expos
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={Layers}
                onClick={() => navigate('/floor-plan')}
                className="w-full sm:w-auto"
              >
                View Floor Plan
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-md">
          <div className="text-center p-4">
            <span className="text-3xl lg:text-4xl font-bold text-slate-900 block">6+</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Active Expos</span>
          </div>
          <div className="text-center p-4 border-l border-slate-100">
            <span className="text-3xl lg:text-4xl font-bold text-blue-600 block">250+</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Exhibiting Companies</span>
          </div>
          <div className="text-center p-4 border-l border-slate-100">
            <span className="text-3xl lg:text-4xl font-bold text-purple-600 block">45,000+</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Attendees Registered</span>
          </div>
          <div className="text-center p-4 border-l border-slate-100">
            <span className="text-3xl lg:text-4xl font-bold text-emerald-600 block">99.8%</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Verified Check-in Rate</span>
          </div>
        </div>
      </section>

      {/* FEATURED EXPOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" /> Upcoming Events
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Exhibitions & Trade Shows
            </h2>
          </div>
          <Link
            to="/expos"
            className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredExpos.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-300">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Exhibitions Currently Scheduled</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              There are currently no active expos in the database. Please check back later or contact organizers to publish an event.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredExpos.map((expo) => (
              <Card key={expo.id} hover className="flex flex-col p-0 overflow-hidden group">
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={expo.coverImage}
                    alt={expo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="purple" size="sm">
                      {expo.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      {formatDate(expo.startDate)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-900/80 text-amber-300 font-bold text-xs">
                      {expo.ticketPricePKR === 0 ? 'Free Pass' : formatCurrency(expo.ticketPricePKR)}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {expo.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{expo.venue}, {expo.city}</span>
                    </p>
                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      {expo.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      <strong className="text-slate-900">{expo.registeredAttendees}</strong> attendees registered
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/expos/${expo.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* EVENT CATEGORIES GRID */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Categories</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Events Across Major Industries
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate('/expos')}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer text-center group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border ${cat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">{cat.count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED EXHIBITORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5" /> Featured Brands
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Exhibitors
            </h2>
          </div>
          <Link
            to="/exhibitors"
            className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredExhibitors.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-300">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Exhibitors Registered Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Corporate exhibitors will appear here once approved by event organizers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExhibitors.map((exh) => (
              <Card key={exh.id} hover onClick={() => navigate(`/exhibitors/${exh.id}`)} className="flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={exh.logo}
                      alt={exh.companyName}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{exh.companyName}</h3>
                      <p className="text-xs text-blue-600 font-medium">{exh.industry}</p>
                      <div className="flex items-center gap-1 mt-0.5 text-amber-500 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-700">{exh.rating}</span>
                        <span className="text-slate-400 text-[10px]">({exh.city})</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {exh.tagline}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
                  <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    Booth: {exh.boothNumber}
                  </span>
                  <span className="text-blue-600 font-semibold hover:underline">
                    View Profile →
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* WHY CHOOSE EVENTSPHERE */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Key Benefits</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
              Why Choose EventSphere?
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Built to make event planning, booth reservation, and ticket verification easy for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Interactive Floor Plan</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visual stall grids with clear status indicators (Available, Reserved, Booked) and 1-click booking.
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Digital QR Tickets</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant electronic badges with QR verification for smooth and quick attendee check-in at entrance gates.
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">3 Dedicated Portals</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tailored dashboards for Organizers (analytics & management), Exhibitors (booths & leads), and Attendees (tickets & schedule).
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">CSV Data Export</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download attendee lists and analytics reports as CSV spreadsheets with a single click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Testimonials</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            What Organizers & Attendees Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feedback.slice(0, 3).map((item) => (
            <Card key={item.id} className="flex flex-col justify-between bg-white border border-slate-200">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
                <div>
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[10px] text-slate-400">{item.role} • {item.expoTitle}</p>
                </div>
                <Quote className="w-6 h-6 text-slate-200" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
