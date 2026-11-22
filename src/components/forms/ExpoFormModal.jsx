import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const ExpoFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      theme: '',
      category: 'Information Technology',
      venue: 'Karachi Expo Centre, Hall 1',
      city: 'Karachi',
      country: 'Pakistan',
      startDate: '2026-12-15',
      endDate: '2026-12-18',
     maxCapacity: 10000,
      totalBooths: 100,
      ticketPricePKR: 2000,
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      status: 'Published',
      description: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        title: '',
        theme: '',
        category: 'Information Technology',
        venue: 'Karachi Expo Centre, Hall 1',
        city: 'Karachi',
        country: 'Pakistan',
        startDate: '2026-12-15',
        endDate: '2026-12-18',
        capacity: 10000,
        totalBooths: 100,
        ticketPricePKR: 2000,
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
        status: 'Published',
        description: ''
      });
    }
  }, [initialData, reset, isOpen]);

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      maxCapacity: Number(data.maxCapacity),
      totalBooths: Number(data.totalBooths),
      ticketPricePKR: Number(data.ticketPricePKR)
    });
    onClose();
  };

  const categories = [
    'Information Technology',
    'Textile & Manufacturing',
    'Energy & Utilities',
    'Healthcare & Medical',
    'Automotive & Transport',
    'Agriculture & Food',
    'Construction & Real Estate'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Expo Exhibition' : 'Create New Expo'}
      subtitle="Publish an international trade exhibition to the public directory"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Expo Title *
          </label>
          <input
            type="text"
            {...register('title', { required: 'Expo title is required' })}
            placeholder="e.g. Pakistan International AI & Robotics Expo 2026"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
          />
          {errors.title && <span className="text-xs text-rose-500">{errors.title.message}</span>}
        </div>

        {/* Theme & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Theme / Slogan
            </label>
            <input
              type="text"
              {...register('theme')}
              placeholder="e.g. Intelligent Automation for Emerging Economies"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Category Industry *
            </label>
            <select
              {...register('category')}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Start Date *
            </label>
            <input
              type="date"
              {...register('startDate', { required: true })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              End Date *
            </label>
            <input
              type="date"
              {...register('endDate', { required: true })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Venue, City, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Venue Complex *
            </label>
            <input
              type="text"
              {...register('venue', { required: true })}
              placeholder="e.g. Karachi Expo Centre"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              City
            </label>
            <input
              type="text"
              {...register('city')}
              placeholder="Karachi / Lahore / Islamabad"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Publication Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue bg-white"
            >
              <option value="Published">Published (Public)</option>
              <option value="Draft">Draft (Internal)</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Capacity, Booths, Ticket Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Max Visitor Capacity
            </label>
            <input
              type="number"
              {...register('capacity')}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Total Stalls / Booths
            </label>
            <input
              type="number"
              {...register('totalBooths')}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Delegate Pass (PKR)
            </label>
            <input
              type="number"
              {...register('ticketPricePKR')}
              placeholder="0 for Free Pass"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Cover Image URL */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Cover Image URL
          </label>
          <input
            type="url"
            {...register('coverImage')}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Expo Executive Summary & Description
          </label>
          <textarea
            rows={3}
            {...register('description')}
            placeholder="Highlight conference tracks, international delegations, and B2B matchmaking..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
          ></textarea>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {initialData ? 'Save Changes' : 'Create & Publish Expo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
