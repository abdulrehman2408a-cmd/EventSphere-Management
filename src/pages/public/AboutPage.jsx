import React from 'react';
import { Card } from '../../components/common/Card';
import { Sparkles, Layers, Users, ShieldCheck, CheckCircle2, Calendar, Store, Ticket } from 'lucide-react';

/**
 * AboutPage component
 * Describes EventSphere as a modern, independent event and exhibition management platform.
 */
export const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider border border-blue-200">
          <Sparkles className="w-3.5 h-3.5" /> Modern Event Management
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Simplifying Expos & Conferences for <br />
          <span className="text-blue-600">Organizers, Exhibitors, and Attendees</span>
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          EventSphere is an all-in-one event and exhibition management platform designed to make organizing, exhibiting at, and attending trade shows smooth, organized, and straightforward.
        </p>
      </div>

      {/* Mission & What We Do Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 bg-white border border-slate-200 shadow-subtle space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Trade expos and conventions involve many moving parts—from managing hundreds of exhibition booths and scheduling keynote speakers to issuing attendee passes. Our mission is to bring all of these workflows together in a clean, unified system that saves time and reduces stress.
          </p>
        </Card>

        <Card className="p-8 bg-white border border-slate-200 shadow-subtle space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Who We Support</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            We built EventSphere for three key audiences: event organizers who need full control over their expos; exhibitors who want an easy way to choose stalls and showcase their products; and attendees who want quick ticket access and a clear daily agenda.
          </p>
        </Card>
      </div>

      {/* Core Platform Highlights */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Key Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Everything Needed to Run Successful Events
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Role-Based Dashboards
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Tailored workspaces for Organizers, Exhibitors, and Attendees, each with only the tools they need.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Interactive Floor Plans
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Clear visual booth layouts with real-time availability (Available, Reserved, Booked) and simple 1-click booking.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Digital Passes & QR Check-In
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Instant digital badges with QR codes that attendees can save or print for fast check-in at event gates.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Event Schedules & Bookmarks
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Browse sessions by topic or day, view speaker details, and bookmark favorite talks to build a personal schedule.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Attendee Roster & CSV Export
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Organizers can search registered visitors, track check-ins, and export attendee lists to CSV with one click.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Clean, Responsive Experience
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Designed to look great and work seamlessly across mobile phones, tablets, laptops, and desktop screens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
