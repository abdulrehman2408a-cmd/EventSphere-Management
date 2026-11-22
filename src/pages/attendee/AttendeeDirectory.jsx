import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ContactOrganizerModal } from '../../components/forms/ContactOrganizerModal';
import {
  Building2,
  Search,
  Layers,
  Star,
  MapPin,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AttendeeDirectory = () => {
  const { exhibitors, submitContactMessage } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [contactExhibitorModal, setContactExhibitorModal] = useState(null);

  const categories = ['All', 'Information Technology', 'Textile & Manufacturing', 'Energy & Utilities', 'Healthcare & Medical', 'Automotive & Transport', 'Agriculture & Food'];

  
const filteredExhibitors = exhibitors.filter((e) => {
  const companyName = (e.companyName || '').toLowerCase();
  const industry = (e.industry || '').toLowerCase();
  const city = (e.city || '').toLowerCase();
  const search = searchQuery.toLowerCase();

  const matchesSearch =
    companyName.includes(search) ||
    industry.includes(search) ||
    city.includes(search);

  const matchesCategory =
    selectedCategory === 'All' ||
    e.category === selectedCategory;

  return matchesSearch && matchesCategory;
});


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Exhibitor Discovery & Stall Directory
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Locate corporate stalls, schedule B2B demo appointments, and view product showcases.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exhibitors by company, products..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExhibitors.map((exh) => (
          <Card key={exh.id} hover className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <img
                  src={exh.logo}
                  alt={exh.companyName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                />
                <div className="text-right">
                  <Badge variant="purple" size="sm">
                    {exh.category.split(' ')[0]}
                  </Badge>
                  <div className="flex items-center justify-end gap-1 mt-1 text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-slate-800">{exh.rating}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{exh.companyName}</h3>
                <p className="text-xs text-brand-blue font-medium">{exh.industry}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {exh.tagline}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Layers className="w-3.5 h-3.5 text-brand-blue" />
                  Stall: {exh.boothNumber}
                </span>
                <button
                  onClick={() => navigate('/floor-plan')}
                  className="text-xs text-brand-blue font-bold hover:underline"
                >
                  Floor Wayfinder →
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/exhibitors/${exh.id}`)}
                >
                  View Profile
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={MessageSquare}
                  onClick={() => setContactExhibitorModal(exh)}
                >
                  Inquire
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Inquiry Modal */}
      {contactExhibitorModal && (
        <ContactOrganizerModal
          isOpen={!!contactExhibitorModal}
          onClose={() => setContactExhibitorModal(null)}
          defaultSubject={`Delegate Inquiry for ${contactExhibitorModal.companyName}`}
          onSubmit={(msg) => {
            submitContactMessage(msg);
          }}
        />
      )}
    </div>
  );
};
