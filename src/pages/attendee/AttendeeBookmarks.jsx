import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';
import { Bookmark, Clock, MapPin, Trash2, Calendar } from 'lucide-react';

export const AttendeeBookmarks = () => {
  const { sessions, bookmarks, toggleBookmarkSession } = useData();
  const navigate = useNavigate();

  const bookmarkedSessions = sessions.filter((s) => bookmarks.includes(s.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            My Bookmarked Keynotes & Sessions ({bookmarkedSessions.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your customized personal conference itinerary and stage room schedule.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/attendee/schedule')}
        >
          Add More Sessions
        </Button>
      </div>

      {bookmarkedSessions.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No Sessions Bookmarked Yet"
          description="Explore the conference schedule to bookmark keynotes, technical panels, and workshops."
          actionText="Browse Event Agenda"
          onAction={() => navigate('/attendee/schedule')}
        />
      ) : (
        <div className="space-y-4">
          {bookmarkedSessions.map((ses) => (
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
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(ses.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> {ses.room}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleBookmarkSession(ses.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors self-end sm:self-center"
                title="Remove from bookmarks"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
