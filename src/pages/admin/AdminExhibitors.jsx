import React, { useState } from 'react';
import { resolveAssetUrl } from '../../services/api';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  Layers,
  Star,
  ExternalLink,
  Eye,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminExhibitors = () => {
  const { exhibitors, approveExhibitor, rejectExhibitor } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedExhibitorModal, setSelectedExhibitorModal] = useState(null);

  const statuses = ['All', 'Approved', 'Pending', 'Rejected'];



  const toSafeText = (value) => {
    if (value === null || value === undefined) return '';
    return String(value).toLowerCase();
  };

  const filteredExhibitors = (Array.isArray(exhibitors) ? exhibitors : []).filter((e) => {
    if (!e || typeof e !== 'object') return false;

    const search = toSafeText(searchQuery).trim();

    const companyName = toSafeText(
      e.companyName ||
      e.name ||
      e.user?.companyName ||
      e.user?.name
    );

    const industry = toSafeText(e.industry || e.category);
    const city = toSafeText(e.city);

    const matchesSearch =
      companyName.includes(search) ||
      industry.includes(search) ||
      city.includes(search);

    const matchesStatus =
      statusFilter === 'All' ||
      e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Exhibitor Directory & Participation Applications
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review corporate credentials, approve or reject applications, and supervise booth assignments.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exhibitors by company, city..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${statusFilter === s
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Company & Logo</th>
                <th className="py-3.5 px-4">Industry / Category</th>
                <th className="py-3.5 px-4">Stall Allocation</th>
                <th className="py-3.5 px-4">Contact Person</th>
                <th className="py-3.5 px-4">Application Status</th>
                <th className="py-3.5 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExhibitors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No exhibitor applications found in the database.
                  </td>
                </tr>
              ) : (
                filteredExhibitors.map((exh) => (
                  <tr key={exh.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">

                        <img
                          src={resolveAssetUrl(exh.logo) || 'https://placehold.co/200x200?text=Company'}
                          alt={exh.companyName || exh.name || 'Company'}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://placehold.co/200x200?text=Company';
                          }}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {exh.companyName || exh.name || exh.user?.companyName || exh.user?.name || 'Company Name Missing'}
                          </span>
                          <span className="text-[10px] text-slate-400">{exh.city}, {exh.country}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="purple" size="sm">{exh.category}</Badge>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{exh.industry}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-blue-50 text-brand-blue px-2 py-0.5 rounded border border-blue-200">
                        <Layers className="w-3.5 h-3.5" />
                        {exh.boothNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="font-medium text-slate-800">{exh.email}</div>
                      <div className="text-[10px] text-slate-400">{exh.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          exh.status === 'Approved'
                            ? 'success'
                            : exh.status === 'Rejected'
                              ? 'danger'
                              : 'warning'
                        }
                        size="sm"
                      >
                        {exh.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedExhibitorModal(exh)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Full Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {exh.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => approveExhibitor(exh.id)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve Application"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => rejectExhibitor(exh.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Reject Application"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspect Exhibitor Details Modal */}
      {selectedExhibitorModal && (
        <Modal
          isOpen={!!selectedExhibitorModal}
          onClose={() => setSelectedExhibitorModal(null)}
          title={selectedExhibitorModal.companyName}
          subtitle={`${selectedExhibitorModal.industry} — Stall ${selectedExhibitorModal.boothNumber}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <img
                src={selectedExhibitorModal.logo}
                alt="Logo"
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-base text-slate-900">{selectedExhibitorModal.companyName}</h4>
                <p className="text-xs text-brand-blue font-medium">{selectedExhibitorModal.tagline}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> {selectedExhibitorModal.website}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> {selectedExhibitorModal.rating}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedExhibitorModal.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/exhibitors/${selectedExhibitorModal.id}`)}
              >
                Open Public Showcase
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedExhibitorModal(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
