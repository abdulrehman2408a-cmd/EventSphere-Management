import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { resolveAssetUrl } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { ContactOrganizerModal } from '../../components/forms/ContactOrganizerModal';
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Layers,
  Star,
  Package,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ExhibitorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exhibitors, submitContactMessage } = useData();

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const exhibitor = exhibitors.find(
    (e) =>
      String(e.id) === String(id) ||
      String(e._id) === String(id) ||
      e.slug === id
  );

  if (!exhibitor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Exhibitor Not Found</h2>
        <Button variant="primary" className="mt-4" onClick={() => navigate('/exhibitors')}>
          Return to Directory
        </Button>
      </div>
    );
  }

  const handleSendMessage = (msgData) => {
    submitContactMessage({
      ...msgData,
      subject: `Inquiry for ${exhibitor.companyName || exhibitor.name || 'Company Name Not Available'}: ${msgData.subject}`
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={() => navigate('/exhibitors')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Exhibitor Directory
      </button>

      {/* Profile Header Card */}
      <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 shadow-premium">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
   <img
  src={resolveAssetUrl(exhibitor.logo) || 'https://placehold.co/200x200?text=Company'}
  onError={(event) => {
    event.currentTarget.src = 'https://placehold.co/200x200?text=Company';
  }}
  alt={exhibitor.companyName || exhibitor.name || 'Company'}
  className="w-24 h-24 rounded-3xl object-cover border-2 border-slate-200 shadow-md shrink-0"
/>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {exhibitor.companyName}
                </h1>
                <Badge variant="purple" size="sm">
                  {exhibitor.category || exhibitor.industry || 'General'}
                </Badge>
              </div>
              <p className="text-sm font-semibold text-brand-blue">{exhibitor.industry}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {exhibitor.city}, {exhibitor.country}
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {exhibitor.rating} Rating
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-blue-50 text-brand-blue px-2.5 py-0.5 rounded-lg border border-blue-200">
                  <Layers className="w-3.5 h-3.5" />
                  Stall: {exhibitor.boothNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="primary"
              icon={MessageSquare}
              onClick={() => setIsContactModalOpen(true)}
              className="w-full md:w-auto"
            >
              Contact Exhibitor
            </Button>
          </div>
        </div>

        {/* Contact Links Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 text-xs text-slate-600">
          <a
            href={exhibitor.website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-brand-blue transition-colors"
          >
            <Globe className="w-4 h-4 text-brand-blue shrink-0" />
            <span className="truncate">{exhibitor.website}</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
          </a>
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
            <Mail className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="truncate">{exhibitor.email}</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{exhibitor.phone}</span>
          </div>
        </div>
      </Card>

      {/* Main Grid: Description & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <Card className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Company Overview & Focus Areas
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {exhibitor.description}
            </p>
          </Card>

          {/* Products & Services Showcase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-blue" />
                Featured Products & Solutions ({exhibitor.products?.length || 0})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exhibitor.products?.map((prod, idx) => (
                <Card key={idx} className="p-5 bg-white border border-slate-200/90 hover:border-slate-300 transition-all space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{prod.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{prod.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Stall & Direct Booking */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Assigned Stall Information
            </h4>
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Stall Location</p>
              <h3 className="text-2xl font-black text-white">{exhibitor.boothNumber}</h3>
              <p className="text-xs text-slate-300">Prime Corridor Concourse</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Delegates can visit this booth to experience hands-on hardware demos, technical architecture consultations, and B2B procurement meetings.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/floor-plan')}
            >
              Locate on Floor Plan
            </Button>
          </Card>
        </div>
      </div>

      {/* Contact Exhibitor Modal */}
      <ContactOrganizerModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSubmit={handleSendMessage}
        defaultSubject={`Inquiry for ${exhibitor.companyName}`}
      />
    </div>
  );
};
