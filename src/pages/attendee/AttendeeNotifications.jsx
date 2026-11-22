import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Bell, CheckCheck, Clock, Ticket, Sparkles } from 'lucide-react';

export const AttendeeNotifications = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useData();
  const { user } = useAuth();

  const attendeeNotifs = notifications.filter(
    (n) => n.role === 'attendee' || n.userId === user?.id
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Delegate Notification Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time updates regarding keynote timings, badge confirmations, and exhibitor invitations.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={CheckCheck}
          onClick={markAllNotificationsAsRead}
        >
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-3">
        {attendeeNotifs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
            No notifications in your inbox.
          </div>
        ) : (
          attendeeNotifs.map((n) => (
            <Card
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-4 cursor-pointer transition-colors ${
                n.unread ? 'bg-blue-50/50 border-l-4 border-brand-blue' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{n.title}</span>
                    {n.unread && <Badge variant="primary" size="sm">New</Badge>}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{n.time}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
