import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Building2, Globe, Mail, Phone, MapPin, Save, Upload, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const ExhibitorProfile = () => {
  const { exhibitors, updateExhibitorProfile } = useData();
  const { user } = useAuth();

  const exhibitor = exhibitors.find((e) => e.user === user?.id || e.user?._id === user?.id || e.id === user?.companyId || e._id === user?.exhibitorProfile) || {};
  const exhibitorId = exhibitor.id || exhibitor._id;

  const [companyName, setCompanyName] = useState(exhibitor.name || exhibitor.companyName || user?.name || '');
  const [tagline, setTagline] = useState(exhibitor.tagline || '');
  const [industry, setIndustry] = useState(exhibitor.category || exhibitor.industry || '');
  const [website, setWebsite] = useState(exhibitor.website || '');
  const [email, setEmail] = useState(exhibitor.email || user?.email || '');
  const [phone, setPhone] = useState(exhibitor.phone || '');
  const [city, setCity] = useState(exhibitor.city || '');
  const [logo, setLogo] = useState(exhibitor.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200');
  const [description, setDescription] = useState(exhibitor.description || '');

  const handleSave = (e) => {
    e.preventDefault();
    updateExhibitorProfile(exhibitorId, {
      name: companyName,
      companyName,
      tagline,
      category: industry,
      industry,
      website,
      email,
      phone,
      city,
      logo,
      description
    });
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Company Profile & Brand Identity
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Keep your company presentation, corporate logo, and contact channels up-to-date in the public directory.
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Logo preview & URL */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
            />
            <div className="flex-1 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Corporate Logo Image URL
              </label>
              <input
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue bg-white"
              />
              <p className="text-[10px] text-slate-400">
                Recommended aspect ratio: 1:1 square PNG or WebP with crisp transparency.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Legal Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Core Industry Discipline
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Brand Tagline / Hook
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Leading Global IT and BPO Solutions Provider"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Website Link
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Inquiry Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Corporate Hotline
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Corporate Overview & Exhibition Profile
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            ></textarea>
          </div>

          <div className="flex justify-end pt-3">
            <Button variant="primary" type="submit" icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
