import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const SessionFormModal = ({ isOpen, onClose, onSubmit, initialData = null, expos = [] }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      track: 'AI & Cloud Engineering',
      expoId: expos[0]?.id || 'expo_01',
      speaker: '',
      speakerRole: '',
      speakerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      date: '2026-12-10',
      startTime: '10:00 AM',
      endTime: '11:15 AM',
      room: 'Main Grand Auditorium A',
      capacity: 350,
      description: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        title: '',
        track: 'AI & Cloud Engineering',
        expoId: expos[0]?.id || 'expo_01',
        speaker: '',
        speakerRole: '',
        speakerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        date: '2026-12-10',
        startTime: '10:00 AM',
        endTime: '11:15 AM',
        room: 'Main Grand Auditorium A',
        capacity: 350,
        description: ''
      });
    }
  }, [initialData, reset, isOpen, expos]);

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      capacity: Number(data.capacity)
    });
    onClose();
  };

  const tracks = [
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Agenda Session' : 'Schedule New Session'}
      subtitle="Assign speakers, time slots, tracks, and conference hall rooms"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Session Title *
          </label>
          <input
            type="text"
            {...register('title', { required: 'Session title is required' })}
            placeholder="e.g. Next-Generation Multi-Agent Systems in Fintech"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
          />
          {errors.title && <span className="text-xs text-rose-500">{errors.title.message}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Associated Expo *
            </label>
            <select
              {...register('expoId', { required: true })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue bg-white"
            >
              {expos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Conference Track *
            </label>
            <select
              {...register('track')}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue bg-white"
            >
              {tracks.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Keynote Speaker Name *
            </label>
            <input
              type="text"
              {...register('speaker', { required: 'Speaker is required' })}
              placeholder="e.g. Dr. Arshad Murtaza"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Speaker Designation & Org
            </label>
            <input
              type="text"
              {...register('speakerRole')}
              placeholder="e.g. Chief AI Scientist, National AI Lab"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Session Date *
            </label>
            <input
              type="date"
              {...register('date', { required: true })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Start Time
            </label>
            <input
              type="text"
              {...register('startTime')}
              placeholder="10:00 AM"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              End Time
            </label>
            <input
              type="text"
              {...register('endTime')}
              placeholder="11:15 AM"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Room / Stage Location
            </label>
            <input
              type="text"
              {...register('room')}
              placeholder="Main Grand Auditorium A"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Seating Capacity
            </label>
            <input
              type="number"
              {...register('capacity')}
              placeholder="350"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Session Overview & Abstract
          </label>
          <textarea
            rows={3}
            {...register('description')}
            placeholder="Key discussion points, learning outcomes, and technical prerequisites..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
          ></textarea>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {initialData ? 'Update Session' : 'Publish to Agenda'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
