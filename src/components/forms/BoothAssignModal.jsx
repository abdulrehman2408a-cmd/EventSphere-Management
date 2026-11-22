import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/helpers';

export const BoothAssignModal = ({ isOpen, onClose, booth, exhibitors = [], onAssign }) => {
  if (!booth) return null;

  const [selectedExhibitorId, setSelectedExhibitorId] = useState(booth.exhibitorId || '');
  const [status, setStatus] = useState(booth.status || 'Available');

  const handleSave = () => {
    let exhibitorName = null;
    if (selectedExhibitorId) {
      const exh = exhibitors.find((e) => e.id === selectedExhibitorId);
      exhibitorName = exh ? exh.companyName : null;
    }
    onAssign(booth.id, status, selectedExhibitorId || null, exhibitorName);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure Stall: ${booth.number}`}
      subtitle={`${booth.hall} — ${booth.type} (${booth.size})`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Booth Allocation Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue bg-white"
          >
            <option value="Available">Available (Open for Booking)</option>
            <option value="Reserved">Reserved (Pending Review/Payment)</option>
            <option value="Booked">Booked (Confirmed Allocation)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Assign Exhibitor Company
          </label>
          <select
            value={selectedExhibitorId}
            onChange={(e) => setSelectedExhibitorId(e.target.value)}
            disabled={status === 'Available'}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">-- No Exhibitor Selected --</option>
            {exhibitors.map((exh) => (
              <option key={exh.id} value={exh.id}>
                {exh.companyName} ({exh.category})
              </option>
            ))}
          </select>
          {status !== 'Available' && !selectedExhibitorId && (
            <p className="text-[11px] text-amber-600 mt-1">
              Select the company that reserved or booked this space.
            </p>
          )}
        </div>

        <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
          <p className="flex justify-between">
            <span className="text-slate-500">Stall Dimensions:</span>
            <span className="font-semibold text-slate-800">{booth.size}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">Tier Category:</span>
            <span className="font-semibold text-slate-800">{booth.category}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">Base Price:</span>
            <span className="font-semibold text-brand-blue">{formatCurrency(booth.pricePKR)}</span>
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Apply Stall Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
