import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SessionFormModal } from '../../components/forms/SessionFormModal';
import { formatDate } from '../../utils/helpers';
import {
  Clock,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  Users,
  MapPin
} from 'lucide-react';

export const AdminSchedule = () => {
  const { sessions, expos, createSession, updateSession, deleteSession } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpoFilter, setSelectedExpoFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [deleteTargetSession, setDeleteTargetSession] = useState(null);

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExpo = selectedExpoFilter === 'All' || s.expoId === selectedExpoFilter;
    return matchesSearch && matchesExpo;
  });

  const handleOpenEdit = (ses) => {
    setEditingSession(ses);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingSession) {
      updateSession(editingSession.id, data);
    } else {
      createSession(data);
    }
    setEditingSession(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetSession) {
      deleteSession(deleteTargetSession.id);
      setDeleteTargetSession(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Conference Agenda & Session Scheduler
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Orchestrate keynote stages, panel discussions, speaker time slots, and room allocations.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingSession(null);
            setIsFormOpen(true);
          }}
        >
          Schedule New Session
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keynotes by title, speaker..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
          />
        </div>

        <select
          value={selectedExpoFilter}
          onChange={(e) => setSelectedExpoFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:outline-none"
        >
          <option value="All">All Associated Expos</option>
          {expos.map((e) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Session Title & Track</th>
                <th className="py-3.5 px-4">Keynote Speaker</th>
                <th className="py-3.5 px-4">Date & Time Slot</th>
                <th className="py-3.5 px-4">Room & Capacity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.map((ses) => (
                <tr key={ses.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block max-w-sm truncate">{ses.title}</span>
                    <Badge variant="purple" size="sm" className="mt-1">{ses.track}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={ses.speakerImage}
                        alt="Speaker"
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">{ses.speaker}</span>
                        <span className="text-[10px] text-slate-400 block max-w-[150px] truncate">{ses.speakerRole}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-800 flex items-center gap-1 text-brand-blue">
                      <Clock className="w-3.5 h-3.5" /> {ses.startTime} – {ses.endTime}
                    </div>
                    <div className="text-[10px] text-slate-400">{formatDate(ses.date)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {ses.room}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {ses.enrolled || 0} / {ses.capacity} Enrolled
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(ses)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Session"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetSession(ses)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Session Form Modal */}
      <SessionFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSession(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingSession}
        expos={expos}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetSession}
        onClose={() => setDeleteTargetSession(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Session?"
        message={`Are you sure you want to remove "${deleteTargetSession?.title}" from the agenda schedule?`}
        confirmText="Delete Session"
      />
    </div>
  );
};
