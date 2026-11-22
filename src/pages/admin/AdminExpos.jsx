import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ExpoFormModal } from '../../components/forms/ExpoFormModal';
import { formatDate, formatCurrency } from '../../utils/helpers';
import {
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Users,
  Layers,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminExpos = () => {
  const { expos, createExpo, updateExpo, deleteExpo } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpo, setEditingExpo] = useState(null);
  const [deleteTargetExpo, setDeleteTargetExpo] = useState(null);

  const categories = ['All', 'Information Technology', 'Textile & Manufacturing', 'Energy & Utilities', 'Healthcare & Medical', 'Automotive & Transport', 'Agriculture & Food'];
  const statuses = ['All', 'Published', 'Draft', 'Completed'];

  const filteredExpos = expos.filter((expo) => {
    const matchesSearch =
      expo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expo.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expo.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || expo.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || expo.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenEdit = (expo) => {
    setEditingExpo(expo);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingExpo) {
      updateExpo(editingExpo.id, formData);
    } else {
      createExpo(formData);
    }
    setEditingExpo(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetExpo) {
      deleteExpo(deleteTargetExpo.id);
      setDeleteTargetExpo(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Exhibition Catalog & Expo Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure exhibition dates, capacities, booth allocations, and public visibility.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingExpo(null);
            setIsFormOpen(true);
          }}
        >
          Add New Exhibition
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exhibitions..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:outline-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expos Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Cover & Title</th>
                <th className="py-3.5 px-4">Industry Sector</th>
                <th className="py-3.5 px-4">Dates & Duration</th>
                <th className="py-3.5 px-4">Venue Complex</th>
                <th className="py-3.5 px-4">Stalls & Capacity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No exhibitions found in database. Click &quot;Add New Exhibition&quot; to create one.
                  </td>
                </tr>
              ) : (
                filteredExpos.map((expo) => (
                <tr key={expo.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={expo.coverImage}
                        alt={expo.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block max-w-xs truncate">
                          {expo.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {expo.theme}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="purple" size="sm">
                      {expo.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    <div>{formatDate(expo.startDate)}</div>
                    <div className="text-[10px] text-slate-400">to {formatDate(expo.endDate)}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-[150px] truncate">
                    {expo.venue}, {expo.city}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800">{expo.bookedBooths} / {expo.totalBooths} Stalls</span>
                    <span className="text-[10px] text-slate-400 block">{(expo.maxCapacity ?? expo.capacity ?? 0).toLocaleString()} Max Cap</span>
                  </td>
                  <td className="py-3 px-4">
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
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/expos/${expo.id}`)}
                        className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(expo)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Expo Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetExpo(expo)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Exhibition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit Modal */}
      <ExpoFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpo(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingExpo}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetExpo}
        onClose={() => setDeleteTargetExpo(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Exhibition?"
        message={`Are you sure you want to remove "${deleteTargetExpo?.title}" from EventSphere? All associated stall reservations will be permanently detached.`}
        confirmText="Yes, Delete Expo"
      />
    </div>
  );
};
