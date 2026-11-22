import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';
import {
  Clock,
  Calendar,
  Search,
  Bookmark,
  MapPin,
  Sparkles,
  Users,
  Check
} from 'lucide-react';

export const SchedulePage = () => {
  const { sessions, expos, bookmarks, toggleBookmarkSession } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpoId, setSelectedExpoId] = useState('All');
  const [selectedTrack, setSelectedTrack] = useState('All');

  const tracks = [
    'All',
    'Keynote & Strategy',
    'AI & Cloud Engineering',
    'Startups & Funding',
    'Cybersecurity & Infrastructure',
    'Developer Hands-On',
    'Sustainability & Tech',
    'Clean Energy & Grids',
    'Medical Sciences',
    'Mobility & Urban Tech',
    'Leadership & Inclusion'
  ];

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.room.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesExpo = selectedExpoId === 'All' || s.expoId === selectedExpoId;
    const matchesTrack = selectedTrack === 'All' || s.track === selectedTrack;

    return matchesSearch && matchesExpo && matchesTrack;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">
          <Clock className="w-3.5 h-3.5" /> Conference Agenda
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Comprehensive Event Schedule & Keynotes
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore keynote speeches, technical break-outs, and hands-on workshops across all active summits.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keynotes by session title, speaker name, or stage room..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Exhibition Summit
            </label>
            <select
              value={selectedExpoId}
              onChange={(e) => setSelectedExpoId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-brand-blue"
            >
              <option value="All">All Exhibitions ({sessions.length} Sessions)</option>
              {expos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Track Specialization
            </label>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-brand-blue"
            >
              {tracks.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Bookmark Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Showing {filteredSessions.length} sessions ({bookmarks.length} bookmarked in personal agenda)</span>
        {(searchQuery || selectedExpoId !== 'All' || selectedTrack !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedExpoId('All');
              setSelectedTrack('All');
            }}
            className="text-brand-blue font-bold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Schedule Timeline Cards */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <EmptyState
            title="No Sessions Found"
            description={
              searchQuery || selectedExpoId !== 'All' || selectedTrack !== 'All'
                ? "No schedule sessions match your filter criteria. Try adjusting your search query."
                : "No event sessions or keynote schedules have been published yet."
            }
            actionLabel={
              searchQuery || selectedExpoId !== 'All' || selectedTrack !== 'All'
                ? "Clear Filters"
                : undefined
            }
            onAction={
              searchQuery || selectedExpoId !== 'All' || selectedTrack !== 'All'
                ? () => {
                    setSearchQuery('');
                    setSelectedExpoId('All');
                    setSelectedTrack('All');
                  }
                : undefined
            }
          />
        ) : (
          filteredSessions.map((ses) => {
          const isBookmarked = bookmarks.includes(ses.id);
          const parentExpo = expos.find((e) => e.id === ses.expoId);

          return (
            <Card key={ses.id} className="p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row items-start justify-between gap-6 group">
              <div className="flex items-start gap-4">
                <img
                  src={ses.speakerImage}
                  alt={ses.speaker}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="purple" size="sm">
                      {ses.track}
                    </Badge>
                    {parentExpo && (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {parentExpo.title.split('202')[0]}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-brand-blue transition-colors">
                    {ses.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium">
                    Presented by <strong className="text-slate-900">{ses.speaker}</strong> • {ses.speakerRole}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-brand-blue">
                      <Clock className="w-3.5 h-3.5" />
                      {ses.startTime} – {ses.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(ses.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {ses.room}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      {ses.enrolled || 0} / {ses.capacity} Enrolled
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 pt-2 line-clamp-2 leading-relaxed">
                    {ses.description}
                  </p>
                </div>
              </div>

              {/* Bookmark Toggle Action */}
              <div className="shrink-0 self-end md:self-center">
                <Button
                  variant={isBookmarked ? 'secondary' : 'primary'}
                  size="sm"
                  icon={isBookmarked ? Check : Bookmark}
                  onClick={() => toggleBookmarkSession(ses.id)}
                  className={isBookmarked ? 'text-amber-600 border-amber-300 bg-amber-50' : ''}
                >
                  {isBookmarked ? 'Bookmarked' : 'Add to Schedule'}
                </Button>
              </div>
            </Card>
          );
        })
        )}
      </div>
    </div>
  );
};
