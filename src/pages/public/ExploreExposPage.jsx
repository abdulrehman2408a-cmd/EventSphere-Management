import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate, formatCurrency } from '../../utils/helpers';
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Layers,
  ArrowRight,
  Filter,
  Grid,
  List,
  Sparkles
} from 'lucide-react';

export const ExploreExposPage = () => {
  const { expos } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  // Filter options
  const categories = ['All', 'Information Technology', 'Textile & Manufacturing', 'Energy & Utilities', 'Healthcare & Medical', 'Automotive & Transport', 'Agriculture & Food'];
  const cities = ['All', 'Karachi', 'Lahore', 'Islamabad', 'Faisalabad'];
  const statuses = ['All', 'Published', 'Draft', 'Completed'];

  const filteredExpos = expos.filter((expo) => {
    const matchesSearch =
      expo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expo.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expo.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || expo.category === selectedCategory;
    const matchesCity = selectedCity === 'All' || expo.city === selectedCity;
    const matchesStatus = selectedStatus === 'All' || expo.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesCity && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Public Exhibition Roster
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Explore Expos & Trade Conventions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover premier B2B expos, summits, and conferences across Pakistan and Asia-Pacific.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exhibitions by title, theme, venue or city..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sector / Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-brand-blue"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Host City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-brand-blue"
            >
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Event Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-brand-blue"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Showing {filteredExpos.length} exhibitions</span>
        {(searchQuery || selectedCategory !== 'All' || selectedCity !== 'All' || selectedStatus !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedCity('All');
              setSelectedStatus('All');
            }}
            className="text-brand-blue font-bold hover:underline"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Empty State or Content View */}
      {filteredExpos.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Exhibitions Found"
          description="There are currently no expos matching your criteria or published in the database."
          actionText={searchQuery || selectedCategory !== 'All' || selectedCity !== 'All' || selectedStatus !== 'All' ? 'Reset All Filters' : undefined}
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setSelectedCity('All');
            setSelectedStatus('All');
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpos.map((expo) => (
            <Card key={expo.id} hover className="flex flex-col p-0 overflow-hidden group">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={expo.coverImage}
                  alt={expo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <Badge variant="purple" size="sm">
                    {expo.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge
                    variant={
                      expo.status === 'Published'
                        ? 'success'
                        : expo.status === 'Completed'
                        ? 'default'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {expo.status}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                    {formatDate(expo.startDate)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-amber-400 font-bold text-xs">
                    {expo.ticketPricePKR === 0 ? 'Free Pass' : formatCurrency(expo.ticketPricePKR)}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2">
                    {expo.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{expo.venue}, {expo.city}</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2">
                    {expo.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {/* Capacity progress */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Stall Occupancy</span>
                      <span className="font-bold text-slate-800">
                        {expo.bookedBooths} / {expo.totalBooths} ({Math.round((expo.bookedBooths / expo.totalBooths) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-blue rounded-full"
                        style={{ width: `${(expo.bookedBooths / expo.totalBooths) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/expos/${expo.id}`)}
                  >
                    View Details & Pass →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredExpos.map((expo) => (
            <Card key={expo.id} hover className="p-5 flex flex-col md:flex-row items-center gap-6">
              <img
                src={expo.coverImage}
                alt={expo.title}
                className="w-full md:w-56 h-36 object-cover rounded-xl shrink-0"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="purple" size="sm">{expo.category}</Badge>
                  <Badge variant={expo.status === 'Published' ? 'success' : 'default'} size="sm">
                    {expo.status}
                  </Badge>
                </div>
                <h3 className="font-bold text-lg text-slate-900 hover:text-brand-blue cursor-pointer" onClick={() => navigate(`/expos/${expo.id}`)}>
                  {expo.title}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                    {formatDate(expo.startDate)} - {formatDate(expo.endDate)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {expo.venue}, {expo.city}
                  </span>
                </p>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {expo.description}
                </p>
              </div>

              <div className="flex md:flex-col items-center justify-between gap-3 w-full md:w-44 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 shrink-0">
                <div className="text-left md:text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Admission</span>
                  <span className="text-base font-black text-brand-blue">
                    {expo.ticketPricePKR === 0 ? 'Free' : formatCurrency(expo.ticketPricePKR)}
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/expos/${expo.id}`)}
                >
                  View Expo
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
