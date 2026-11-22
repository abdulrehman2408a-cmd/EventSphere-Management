import React, { useState } from 'react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Modal } from './Modal';
import { formatCurrency } from '../../utils/helpers';
import { CheckCircle2, Lock, Clock, Info, Layers, Tag, DollarSign, Store } from 'lucide-react';

export const FloorPlanInteractive = ({
  booths = [],
  onSelectBooth,
  onBookBooth,
  userRole = 'attendee',
  isBookingMode = false,
  selectedBoothId = null
}) => {
  const [activeHall, setActiveHall] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [inspectBooth, setInspectBooth] = useState(null);

  // Filter booths
  const filteredBooths = booths.filter(b => {
    const hallMatch = activeHall === 'All' || b.hall === activeHall;
    const statusMatch = statusFilter === 'All' || b.status === statusFilter;
    return hallMatch && statusMatch;
  });

  const getStatusColor = (status, isSelected) => {
    if (isSelected) return 'bg-brand-blue border-brand-blue text-white ring-4 ring-blue-300';
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 shadow-sm';
      case 'Booked':
        return 'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed opacity-80';
      case 'Reserved':
        return 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 hover:border-amber-400';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Booked':
        return <Lock className="w-3.5 h-3.5 text-slate-400" />;
      case 'Reserved':
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return null;
    }
  };

  const handleBoothClick = (booth) => {
    if (onSelectBooth) {
      onSelectBooth(booth);
    }
    setInspectBooth(booth);
  };

  const halls = ['All', 'Hall 1', 'Hall 2', 'Hall 3'];
  const statuses = ['All', 'Available', 'Booked', 'Reserved'];

  const availableCount = booths.filter(b => b.status === 'Available').length;
  const bookedCount = booths.filter(b => b.status === 'Booked').length;
  const reservedCount = booths.filter(b => b.status === 'Reserved').length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle p-6 space-y-6">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-blue" />
            Interactive Expo Exhibition Floor Plan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select any stall to inspect dimensions, pricing, and assigned exhibitor credentials.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Available ({availableCount})</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Reserved ({reservedCount})</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span>Booked ({bookedCount})</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-2">Filter Hall:</span>
          {halls.map(hall => (
            <button
              key={hall}
              onClick={() => setActiveHall(hall)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeHall === hall
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {hall}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-2">Filter Status:</span>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Architectural Map Representation */}
      <div className="relative bg-slate-900 rounded-2xl p-6 sm:p-8 overflow-x-auto border-2 border-slate-800 shadow-inner">
        {/* Floor background grid pattern */}
        <div className="min-w-[700px] relative">
          {/* Header corridor indication */}
          <div className="flex justify-between items-center text-[11px] font-bold tracking-widest text-slate-400 uppercase pb-4 mb-4 border-b border-slate-800">
            <span>MAIN ENTRANCE / REGISTRATION GATES</span>
            <span>CENTRAL CONCOURSE BOULEVARD</span>
            <span>EMERGENCY EXIT & LOADING BAY</span>
          </div>

          {/* Grid Layout of Booths */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4">
            {filteredBooths.map(booth => {
              const isSelected = selectedBoothId === booth.id;
              return (
                <div
                  key={booth.id}
                  onClick={() => handleBoothClick(booth)}
                  className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between aspect-square group ${getStatusColor(
                    booth.status,
                    isSelected
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-black tracking-tight">{booth.number}</span>
                    {getStatusIcon(booth.status)}
                  </div>

                  <div className="my-auto text-center">
                   <p className="text-[10px] font-bold line-clamp-1">
  {(booth.type || 'Standard').split(' ')[0]}
</p>

<p className="text-[9px] opacity-75">
  {(booth.size || 'N/A').split(' ')[0]}
</p>
                  </div>

                  <div className="text-[9px] font-bold text-center pt-1 border-t border-current/20 truncate">
                    {booth.status === 'Booked' ? (
                      <span className="truncate block">{booth.exhibitorName || 'Occupied'}</span>
                    ) : (
                      <span>{formatCurrency(booth.pricePKR)}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer stage / cafeteria representation */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>KEYNOTE STAGE & EXECUTIVE MEDIA LOUNGE</span>
            <span>FOOD COURT & VIP NETWORKING SUITES</span>
          </div>
        </div>
      </div>

      {/* Inspect Booth Modal */}
      {inspectBooth && (
        <Modal
          isOpen={!!inspectBooth}
          onClose={() => setInspectBooth(null)}
          title={`Booth Details: ${inspectBooth.number}`}
          subtitle={`${inspectBooth.hall} — ${inspectBooth.type}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Status</span>
              <Badge
                variant={
                  inspectBooth.status === 'Available'
                    ? 'success'
                    : inspectBooth.status === 'Reserved'
                    ? 'warning'
                    : 'navy'
                }
              >
                {inspectBooth.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block">Category Tier</span>
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Tag className="w-3.5 h-3.5 text-brand-blue" />
                  {inspectBooth.category}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block">Total Dimensions</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">{inspectBooth.size}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-900">
              <span className="text-xs text-slate-500 font-medium block">Reservation Investment</span>
              <span className="text-xl font-black text-brand-blue flex items-center gap-1 mt-1">
                {formatCurrency(inspectBooth.pricePKR)}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Includes basic carpet, fascia board lettering, 2x spot lights, 1x 5A socket, and 2 exhibitor delegate passes.
              </p>
            </div>

            {inspectBooth.exhibitorName && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-slate-400 font-medium block">Assigned Exhibitor</span>
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-1">
                  <Store className="w-4 h-4 text-emerald-600" />
                  {inspectBooth.exhibitorName}
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button variant="secondary" onClick={() => setInspectBooth(null)}>
                Close
              </Button>
              {inspectBooth.status === 'Available' && onBookBooth && (
                <Button
                  variant="primary"
                  onClick={() => {
                    onBookBooth(inspectBooth);
                    setInspectBooth(null);
                  }}
                >
                  Book This Booth
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
