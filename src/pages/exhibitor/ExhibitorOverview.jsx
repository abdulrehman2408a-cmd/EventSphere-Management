import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { resolveAssetUrl } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/helpers';
import {
  Building2,
  Users,
  Layers,
  FileCheck,
  Package,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Plus
} from 'lucide-react';

export const ExhibitorOverview = () => {
  const { exhibitors, booths } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Find exhibitor record matching current user
  const exhibitor = exhibitors.find((e) => e.user === user?.id || e.user?._id === user?.id || e.id === user?.companyId || e._id === user?.exhibitorProfile) || {};
  const assignedBooth = exhibitor.boothNumber ? booths.find((b) => b.number === exhibitor.boothNumber) : null;
  const companyTitle = exhibitor.name || exhibitor.companyName || user?.name || 'Exhibitor Portal';

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={resolveAssetUrl(exhibitor.logo)}
            alt={companyTitle}
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200';
            }}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {companyTitle}
              </h2>
              <Badge variant={exhibitor.status === 'Approved' ? 'success' : exhibitor.status === 'Rejected' ? 'danger' : 'warning'} size="sm">
                {exhibitor.status || 'Active'}
              </Badge>
            </div>
            <p className="text-xs text-brand-blue font-medium">{exhibitor.industry || 'Exhibition Partner'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {exhibitor.id && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/exhibitors/${exhibitor.id}`)}
            >
              View Public Showcase
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/exhibitor/booths')}
          >
            Manage Stalls
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Scanned Delegate Leads"
          value={exhibitor.leadsCount || 0}
          subtext="in-person stall badge scans"
          icon={Users}
          iconBg="bg-blue-50 text-brand-blue"
          trend="Real-time count"
          trendType="neutral"
        />
        <StatCard
          title="Stall Allocation"
          value={exhibitor.boothNumber || 'Unassigned'}
          subtext={assignedBooth?.size || 'Pending allocation'}
          icon={Layers}
          iconBg="bg-emerald-50 text-emerald-600"
          trend={assignedBooth?.hall || 'Convention Hall'}
          trendType="neutral"
        />
        <StatCard
          title="Catalog Products"
          value={exhibitor.products?.length || 0}
          subtext="featured solutions"
          icon={Package}
          iconBg="bg-purple-50 text-brand-purple"
          trend="Live in Directory"
          trendType="neutral"
        />
        <StatCard
          title="Feedback Rating"
          value={exhibitor.rating ? `${exhibitor.rating} / 5.0` : 'N/A'}
          subtext={exhibitor.rating ? 'Delegate reviews' : 'No reviews yet'}
          icon={Sparkles}
          iconBg="bg-amber-50 text-amber-600"
          trend="Exhibitor Tier"
          trendType="neutral"
        />
      </div>

      {/* Main Grid: Stall Details & Products Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stall Details Card */}
        <Card className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-blue" />
              Confirmed Stall Reservation
            </h3>
            <span className="text-xs text-brand-blue font-bold cursor-pointer hover:underline" onClick={() => navigate('/exhibitor/booths')}>
              View Floor Plan →
            </span>
          </div>

          {assignedBooth ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Stall Number</span>
                <span className="text-2xl font-black text-brand-navy">{assignedBooth?.number}</span>
                <span className="text-xs text-emerald-600 font-semibold block">{assignedBooth?.hall}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dimensions & Tier</span>
                <span className="text-base font-bold text-slate-800">{assignedBooth?.size}</span>
                <span className="text-xs text-slate-500 block">{assignedBooth?.type}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Stall Value</span>
                <span className="text-lg font-black text-brand-blue">{formatCurrency(assignedBooth?.pricePKR || 0)}</span>
                <span className="text-xs text-emerald-600 font-semibold block">{assignedBooth?.status || 'Allocated'}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No stall currently assigned to your company. Visit the floor plan to book an available booth.
            </div>
          )}

          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-xs text-slate-900">Need High-Voltage 3-Phase Power or AV Rigging?</h5>
              <p className="text-[11px] text-slate-600">Submit an inquiry to the organizer operations desk before move-in.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/exhibitor/messages')}
            >
              Contact Operations
            </Button>
          </div>
        </Card>

        {/* Quick Staff & Actions Card */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Booth Staff Passes
            </h3>
            <span
              onClick={() => navigate('/exhibitor/staff')}
              className="text-xs text-brand-blue font-bold cursor-pointer hover:underline"
            >
              Manage
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Ensure all booth engineers and sales executives have active electronic badges for unhindered gate passage.
          </p>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            className="w-full"
            onClick={() => navigate('/exhibitor/staff')}
          >
            Issue New Staff Badge
          </Button>

          <div className="pt-3 border-t border-slate-100">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => navigate('/exhibitor/products')}
            >
              Manage Products & Solutions
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
