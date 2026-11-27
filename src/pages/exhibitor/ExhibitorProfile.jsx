import React, { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';
import { resolveAssetUrl } from '../../services/api';
import toast from 'react-hot-toast';

const DEFAULT_LOGO = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200';

export const ExhibitorProfile = () => {
  const { exhibitors, updateExhibitorProfile, uploadExhibitorLogo } = useData();
  const { user } = useAuth();

  const userId = user?.id || user?._id;
  const exhibitor = exhibitors.find((e) => {
    const ownerId = typeof e.user === 'object' ? (e.user?._id || e.user?.id) : e.user;
    return (
      String(ownerId || '') === String(userId || '') ||
      String(e.id || e._id || '') === String(user?.companyId || user?.exhibitorProfile || '') ||
      (user?.email && e.email === user.email)
    );
  });
  const exhibitorId = exhibitor?.id || exhibitor?._id;

  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [logo, setLogo] = useState(DEFAULT_LOGO);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Exhibitors are fetched asynchronously; populate the form when the record arrives.
  useEffect(() => {
    if (!exhibitor) return;
    setCompanyName(exhibitor.name || exhibitor.companyName || user?.name || '');
    setTagline(exhibitor.tagline || '');
    setIndustry(exhibitor.category || exhibitor.industry || '');
    setWebsite(exhibitor.website || '');
    setEmail(exhibitor.email || user?.email || '');
    setPhone(exhibitor.phone || '');
    setCity(exhibitor.city || '');
    setLogo(exhibitor.logo || DEFAULT_LOGO);
    setDescription(exhibitor.description || '');
  }, [exhibitor?.id, exhibitor?._id]);

  const handleLogoSelect = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please select a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be 5 MB or less.');
      return;
    }
    if (!exhibitorId) {
      toast.error('Your company profile is still loading. Please refresh and try again.');
      return;
    }

    try {
      setIsUploading(true);
      const updated = await uploadExhibitorLogo(exhibitorId, file);
      if (updated?.logo) setLogo(updated.logo);
    } catch (error) {
      // DataContext displays the server error in a toast.
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!exhibitorId) {
      toast.error('Company profile not found for this account.');
      return;
    }
    await updateExhibitorProfile(exhibitorId, {
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={resolveAssetUrl(logo)}
              alt="Company logo preview"
              onError={(event) => { event.currentTarget.src = DEFAULT_LOGO; }}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
            />
            <div className="flex-1 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Corporate Logo
              </label>
              <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer ${isUploading || !exhibitorId ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Choose Image'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoSelect}
                  disabled={isUploading || !exhibitorId}
                  className="sr-only"
                />
              </label>
              <p className="text-[10px] text-slate-500">
                Select JPG, PNG, or WebP. Maximum file size: 5 MB. Your logo uploads when selected.
              </p>
              {!exhibitorId && (
                <p className="text-xs text-amber-700">Loading company profile… If this remains, refresh the page or contact your administrator.</p>
              )}
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Website Link</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Inquiry Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Corporate Hotline</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Corporate Overview & Exhibition Profile
            </label>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue" />
          </div>

          <div className="flex justify-end pt-3">
            <Button variant="primary" type="submit" icon={Save} disabled={!exhibitorId || isUploading}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
