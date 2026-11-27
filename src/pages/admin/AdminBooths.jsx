import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { FloorPlanInteractive } from '../../components/common/FloorPlanInteractive';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { BoothAssignModal } from '../../components/forms/BoothAssignModal';
import { formatCurrency } from '../../utils/helpers';
import { Layers, Search, Edit3, Store, CheckCircle2, DollarSign } from 'lucide-react';

export const AdminBooths = () => {
  const { booths, exhibitors, updateBoothStatus } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBoothToAssign, setSelectedBoothToAssign] = useState(null);

  const statuses = ['All', 'Available', 'Booked', 'Reserved'];

  const filteredBooths = booths.filter((b) => {
    const matchesSearch =
      b.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.type || b.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.exhibitorName && b.exhibitorName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Spatial Stall Management & Hall Floor Plan
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Visually reassign booth stalls, modify pricing tiers, and supervise exhibitor tenancy.
        </p>
      </div>

      {/* Interactive Visual Floor Plan */}
      <FloorPlanInteractive
        booths={booths}
        onSelectBooth={(b) => setSelectedBoothToAssign(b)}
      />

      {/* Booth Inventory Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-blue" />
            Complete Stall Inventory ({booths.length} Stalls)
          </h3>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stalls..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Stall No.</th>
                  <th className="py-3 px-4">Location Hall</th>
                  <th className="py-3 px-4">Stall Type & Size</th>
                  <th className="py-3 px-4">Tier Category</th>
                  <th className="py-3 px-4">Base Rate (PKR)</th>
                  <th className="py-3 px-4">Assigned Exhibitor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Configure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooths.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400">
                      No booths configured yet in the database.
                    </td>
                  </tr>
                ) : (
                  filteredBooths.map((booth) => (
                    <tr key={booth.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-black text-slate-900">{booth.number}</td>
                      <td className="py-3 px-4 text-slate-600">{booth.hall}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800">{booth.type}</span>
                        <span className="text-[10px] text-slate-400 block">{booth.size}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="purple" size="sm">{booth.category}</Badge>
                      </td>
                      <td className="py-3 px-4 font-bold text-brand-blue">
                        {formatCurrency(booth.pricePKR)}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {booth.exhibitorName ? (
                          <span className="font-semibold text-emerald-700 flex items-center gap-1">
                            <Store className="w-3.5 h-3.5" />
                            {booth.exhibitorName}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">None (Unassigned)</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            booth.status === 'Available'
                              ? 'success'
                              : booth.status === 'Reserved'
                              ? 'warning'
                              : 'navy'
                          }
                          size="sm"
                        >
                          {booth.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Edit3}
                          onClick={() => setSelectedBoothToAssign(booth)}
                        >
                          Assign
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Booth Assignment Modal */}
      {selectedBoothToAssign && (
        <BoothAssignModal
          isOpen={!!selectedBoothToAssign}
          onClose={() => setSelectedBoothToAssign(null)}
          booth={selectedBoothToAssign}
          exhibitors={exhibitors}
          onAssign={(boothId, newStatus, exhId, exhName) => {
            updateBoothStatus(boothId, newStatus, exhId, exhName);
          }}
        />
      )}
    </div>
  );
};
