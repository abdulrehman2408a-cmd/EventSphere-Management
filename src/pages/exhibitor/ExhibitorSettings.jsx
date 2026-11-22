import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Settings, User, Save, Lock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const ExhibitorSettings = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || 'Syeda Fatima Zahra');
  const [email, setEmail] = useState(user?.email || 'fatima@systemsltd.com');
  const [phone, setPhone] = useState(user?.phone || '+92 321 4455667');
  const [title, setTitle] = useState(user?.title || 'Chief Marketing Officer');

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      title
    });
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Exhibitor Lead Account Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage authorized company representative credentials and personal notifications.
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Authorized Lead Representative
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
                Official Business Email
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
                Contact Phone
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
                Corporate Designation
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <Button variant="primary" type="submit" icon={Save}>
              Update Account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
