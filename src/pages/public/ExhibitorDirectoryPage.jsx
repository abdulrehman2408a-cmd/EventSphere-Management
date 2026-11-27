import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { resolveAssetUrl } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Search,
  Building2,
  Layers,
  Star,
  MapPin,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ExhibitorDirectoryPage = () => {
  const { exhibitors } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Information Technology',
    'Textile & Manufacturing',
    'Energy & Utilities',
    'Healthcare & Medical',
    'Automotive & Transport',
    'Agriculture & Food'
  ];


  const filteredExhibitors = exhibitors.filter((exh) => {
    const companyName = (exh.companyName || '').toLowerCase();
    const industry = (exh.industry || '').toLowerCase();
    const city = (exh.city || '').toLowerCase();
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      companyName.includes(search) ||
      industry.includes(search) ||
      city.includes(search);

    const matchesCategory =
      selectedCategory === 'All' ||
      exh.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">
          <Building2 className="w-3.5 h-3.5" /> Corporate Showcase
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Exhibitor Directory & Corporate Profiles
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Connect with industry-leading brands, technology innovators, and manufacturing giants exhibiting across our trade summits.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name, technology discipline, or city..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Showing {filteredExhibitors.length} corporate exhibitors</span>
        {(searchQuery || selectedCategory !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-brand-blue font-bold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Directory Grid or Empty State */}
      {filteredExhibitors.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Exhibitors Found"
          description="There are currently no corporate exhibitors registered in the directory matching your search criteria."
          actionText={searchQuery || selectedCategory !== 'All' ? 'Reset Filters' : undefined}
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExhibitors.map((exh) => (
            <Card key={exh.id} hover onClick={() => navigate(`/exhibitors/${exh.id}`)} className="flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <img
                    src={
                      resolveAssetUrl(exh.logo) ||
                      'https://placehold.co/200x200?text=Company'
                    }
                    alt={exh.companyName || exh.name || 'Company'}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://placehold.co/200x200?text=Company';
                    }}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                  />
                  <div className="text-right">
                    <Badge variant="purple" size="sm">
                      {exh.category.split(' ')[0]}
                    </Badge>
                    <div className="flex items-center justify-end gap-1 mt-1 text-amber-500 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-700">{exh.rating}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {exh.companyName || exh.name || exh.user?.companyName || 'Company Name Missing'}
                  </h3>
                  <p className="text-xs text-brand-blue font-medium mt-0.5">{exh.industry}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{exh.city}, {exh.country}</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {exh.tagline}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
                <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Layers className="w-3.5 h-3.5 text-brand-blue" />
                  Stall: {exh.boothNumber}
                </span>
                <span className="text-brand-blue font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
