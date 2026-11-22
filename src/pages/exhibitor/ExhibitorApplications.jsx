import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/helpers';
import { FileCheck, Plus, CheckCircle2, Clock, XCircle, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export const ExhibitorApplications = () => {
  const { expos, exhibitors } = useData();
  const { user } = useAuth();

  const exhibitor = exhibitors.find((e) => e.id === user?.companyId) || exhibitors[0];

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedExpoId, setSelectedExpoId] = useState(expos[1]?.id || 'expo_02');
  const [boothType, setBoothType] = useState('Island Premium (36 sqm)');
  const [notes, setNotes] = useState('');

  // Mock list of applications
  const [applications, setApplications] = useState([
    {
      id: 'app_01',
      expoTitle: 'Pakistan International Tech & AI Summit 2026',
      expoCity: 'Karachi',
      appliedDate: '2026-10-15',
      boothPreference: 'Island Premium (36 sqm)',
      status: 'Approved',
      assignedBooth: exhibitor.boothNumber
    },
    {
      id: 'app_02',
      expoTitle: 'Renewable Solar & Clean Energy Exhibition',
      expoCity: 'Islamabad',
      appliedDate: '2026-11-04',
      boothPreference: 'Corner Standard (18 sqm)',
      status: 'Pending',
      assignedBooth: 'Pending Review'
    }
  ]);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    const targetExpo = expos.find((ex) => ex.id === selectedExpoId);
    const newApp = {
      id: `app_${Date.now()}`,
      expoTitle: targetExpo?.title || 'Trade Expo',
      expoCity: targetExpo?.city || 'Karachi',
      appliedDate: new Date().toISOString().split('T')[0],
      boothPreference: boothType,
      status: 'Pending',
      assignedBooth: 'Under Review'
    };
    setApplications([newApp, ...applications]);
    toast.success('Exhibition stall application submitted to organizer!');
    setIsApplyModalOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Exhibition Participation & Stall Applications
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track submitted sponsorship applications, vetting statuses, and hall booth approvals.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsApplyModalOpen(true)}
        >
          Apply for Next Exhibition
        </Button>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id} className="p-6 bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    app.status === 'Approved'
                      ? 'success'
                      : app.status === 'Rejected'
                      ? 'danger'
                      : 'warning'
                  }
                  size="sm"
                >
                  {app.status}
                </Badge>
                <span className="text-[10px] text-slate-400">
                  Applied on {formatDate(app.appliedDate)}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900">{app.expoTitle}</h3>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {app.expoCity}
                </span>
                <span>•</span>
                <span>Preferred Space: <strong>{app.boothPreference}</strong></span>
              </div>
            </div>

            <div className="text-left md:text-right pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Assigned Stall
              </span>
              <span className="text-base font-black text-brand-blue block">
                {app.assignedBooth}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Exhibition Stall"
        subtitle="Submit your company participation request to the organizing committee"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Exhibition *
            </label>
            <select
              value={selectedExpoId}
              onChange={(e) => setSelectedExpoId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue bg-white"
            >
              {expos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} ({e.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Stall Footprint Preference *
            </label>
            <select
              value={boothType}
              onChange={(e) => setBoothType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue bg-white"
            >
              <option value="Island Premium (36 sqm - 6x6m)">Island Premium (36 sqm - 6x6m)</option>
              <option value="Corner Standard (18 sqm - 6x3m)">Corner Standard (18 sqm - 6x3m)</option>
              <option value="Standard Inline (9 sqm - 3x3m)">Standard Inline (9 sqm - 3x3m)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Custom Fabrications & Requirements
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Specify structural rigging, power requirements, or custom mezzanine flooring..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
