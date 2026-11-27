import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';
import { Clock, Search, Bookmark, MapPin, Users, Check } from 'lucide-react';

export const AttendeeSchedule = () => {
  const { sessions, bookmarks, toggleBookmarkSession } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('All');

  const tracks = [
    'All',
    'Keynote & Strategy',
    'AI & Cloud Engineering',
    'Startups & Funding',
    'Cybersecurity & Infrastructure',
    'Developer Hands-On',
    'Sustainability & Tech',
    'Medical Sciences'
  ];

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = selectedTrack === 'All' || s.track === selectedTrack;
    return matchesSearch && matchesTrack;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Conference Agenda & Keynote Timetable
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Bookmark technical deep-dives, panel discussions, and founder fireside chats to curate your agenda.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions by speaker or topic..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
          />
        </div>

        <select
          value={selectedTrack}
          onChange={(e) => setSelectedTrack(e.target.value)}
          className="w-full md:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:outline-none"
        >
          {tracks.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((ses) => {
          const isBookmarked = bookmarks.includes(ses.id);
          return (
            <Card key={ses.id} className="p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={ses.speakerImage}
                  alt={ses.speaker}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="purple" size="sm">{ses.track}</Badge>
                    <span className="text-xs font-semibold text-brand-blue flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {ses.startTime} – {ses.endTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{ses.title}</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Presented by <strong>{ses.speaker}</strong> ({ses.speakerRole})
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> {ses.room}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-500" /> {ses.enrolled || 0} / {ses.capacity} Enrolled
                    </span>
                  </div>
                </div>
              </div>

              <div className="self-end sm:self-center shrink-0">
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
        })}
      </div>
    </div>
  );
};
