import React from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { MapPin, Phone, Mail, Clock, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ContactPage = () => {
  const { submitContactMessage } = useData();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    submitContactMessage({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message
    });
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
          Organizer Helpdesk
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Connect with EventSphere
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Have an inquiry regarding stall sponsorships, keynote speaking, delegate registration, or convention venue bookings? Our team is available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information & Branches */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
              Operations Headquarters
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Karachi Office:</strong>
                  <span>Main Secretariat, Karachi Expo Centre, University Road, Gulshan-e-Iqbal, Karachi.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Lahore Office:</strong>
                  <span>Trade Operations Hall, Lahore International Expo Centre, Johar Town, Lahore.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>+92 (21) 111-EXPO-PK (3976-75)</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                <span>support@eventsphere.pk</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Mon – Sat: 08:30 AM – 06:30 PM PKT</span>
              </div>
            </div>
          </Card>

          <div className="p-6 bg-gradient-to-br from-brand-navy to-brand-deep text-white rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <h4 className="text-base font-bold">Fast-Track Exhibitor Inquiries</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Applying for an Island Booth over 36 sqm? Reach our senior spatial architects for custom fabricated shell schemes.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <Card className="lg:col-span-2 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Send Direct Dispatch</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your inquiry will be logged directly into the Organizer Communication desk.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="e.g. Tariq Mansoor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
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
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
                />
                {errors.email && <span className="text-xs text-rose-500">{errors.email.message}</span>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subject Matter *
              </label>
              <input
                type="text"
                {...register('subject', { required: 'Subject is required' })}
                placeholder="e.g. Booth Allocation and Power Drop Query"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
              />
              {errors.subject && <span className="text-xs text-rose-500">{errors.subject.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Detailed Message *
              </label>
              <textarea
                rows={5}
                {...register('message', { required: 'Message is required' })}
                placeholder="Please outline the requirements of your company or registration question..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
              ></textarea>
              {errors.message && <span className="text-xs text-rose-500">{errors.message.message}</span>}
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              icon={Send}
              className="w-full sm:w-auto"
            >
              Submit Support Dispatch
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
