import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Settings, User, Bell, Shield, Save, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminSettings = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || 'Muhammad Daniyal Khan');
  const [email, setEmail] = useState(user?.email || 'admin@eventsphere.pk');
  const [phone, setPhone] = useState(user?.phone || '+92 300 8291045');
  const [organization, setOrganization] = useState(user?.organization || 'EventSphere Global Pvt. Ltd.');
  const [title, setTitle] = useState(user?.title || 'Lead Event Director & Organizer');

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [stallBookingNotifications, setStallBookingNotifications] = useState(true);
  const [dailyAttendanceDigest, setDailyAttendanceDigest] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      organization,
      title
    });
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Platform Configuration & Organizer Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage event director credentials, organization details, and live telemetry alert triggers.
        </p>
      </div>

      {/* Profile Form */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-blue-50 text-brand-blue">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Lead Organizer Profile</h3>
            <p className="text-xs text-slate-400">Account credentials and secretariat designation</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Hotline
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Designation
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="flex justify-end pt-3">
            <Button variant="primary" type="submit" icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-purple-50 text-brand-purple">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Telemetry & Alert Preferences</h3>
            <p className="text-xs text-slate-400">Configure real-time notifications for critical expo milestones</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
            <div>
              <span className="font-bold text-xs text-slate-900 block">Exhibitor Stall Reservation Alerts</span>
              <span className="text-[11px] text-slate-500">Send instant notification when an exhibitor requests an Island or Corner booth</span>
            </div>
            <input
              type="checkbox"
              checked={stallBookingNotifications}
              onChange={(e) => setStallBookingNotifications(e.target.checked)}
              className="w-4 h-4 text-brand-blue rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
            <div>
              <span className="font-bold text-xs text-slate-900 block">Turnstile Gate Ingress Alerts</span>
              <span className="text-[11px] text-slate-500">Notify operations team if gate queue time exceeds 2 minutes</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-brand-blue rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
            <div>
              <span className="font-bold text-xs text-slate-900 block">Daily Attendance Telemetry Summary</span>
              <span className="text-[11px] text-slate-500">Generate night automated CSV digest of verified check-ins</span>
            </div>
            <input
              type="checkbox"
              checked={dailyAttendanceDigest}
              onChange={(e) => setDailyAttendanceDigest(e.target.checked)}
              className="w-4 h-4 text-brand-blue rounded"
            />
          </label>
        </div>
      </Card>
    </div>
  );
};
