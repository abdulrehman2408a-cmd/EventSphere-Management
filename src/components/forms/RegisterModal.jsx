import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Ticket } from 'lucide-react';

export const RegisterModal = ({ isOpen, onClose, expo, onRegisterSuccess }) => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || 'Hamza Farooq',
      email: user?.email || 'hamza.tech@gmail.com',
      phone: user?.phone || '+92 333 9876543',
      company: user?.organization || 'TechLogix Global',
      designation: user?.title || 'Senior Software Engineer',
      city: 'Karachi',
      ticketType: 'VIP All-Access Pass'
    }
  });

  if (!expo) return null;

  const onSubmit = (data) => {
    onRegisterSuccess(expo.id, data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delegate Pass Registration"
      subtitle={expo.title}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Event Summary Banner */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">{expo.venue}</p>
            <p className="text-[11px] text-slate-500">{expo.city}, Pakistan</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium block">Pass Fee</span>
            <span className="text-base font-black text-brand-blue">
              {expo.ticketPricePKR === 0 ? 'FREE ADMISSION' : formatCurrency(expo.ticketPricePKR)}
            </span>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
            {errors.name && <span className="text-xs text-rose-500">{errors.name.message}</span>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
            {errors.email && <span className="text-xs text-rose-500">{errors.email.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Contact *
            </label>
            <input
              type="tel"
              {...register('phone', { required: true })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              City
            </label>
            <input
              type="text"
              {...register('city')}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Organization / Company
            </label>
            <input
              type="text"
              {...register('company')}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Professional Designation
            </label>
            <input
              type="text"
              {...register('designation')}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Pass Tier Option
          </label>
          <select
            {...register('ticketType')}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue bg-white"
          >
            <option value="VIP All-Access Pass">VIP All-Access Pass (Keynotes + Lounge + Priority Parking)</option>
            <option value="Corporate Delegate">Corporate Delegate (Expo Floor + Standard Sessions)</option>
            <option value="Standard Visitor Pass">Standard Visitor Pass (Full Expo Floor Access)</option>
            <option value="General Delegate">General Delegate Pass</option>
          </select>
        </div>

        <p className="text-[11px] text-slate-400">
          * By registering, an electronic QR pass will be linked to your profile and ready for turnstile check-in.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Ticket}>
            Confirm Registration
          </Button>
        </div>
      </form>
    </Modal>
  );
};
