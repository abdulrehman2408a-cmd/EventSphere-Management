import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { FloorPlanInteractive } from '../../components/common/FloorPlanInteractive';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/helpers';
import { Layers, CheckCircle2, Clock, MapPin, Store } from 'lucide-react';

export const ExhibitorBooths = () => {
  const { booths, exhibitors, bookBooth } = useData();
  const { user } = useAuth();

  const exhibitor = exhibitors.find((e) => e.user === user?.id || e.user?._id === user?.id || e.id === user?.companyId || e._id === user?.exhibitorProfile) || {};
  const exhibitorId = exhibitor?.id || exhibitor?._id;
  const myBooths = exhibitorId
    ? booths.filter((b) => b.exhibitor === exhibitorId || b.exhibitor?._id === exhibitorId || b.exhibitorId === exhibitorId || (exhibitor?.boothNumber && b.number === exhibitor?.boothNumber))
    : [];

  const handleBookAvailableBooth = (booth) => {
    if (!exhibitorId) return;
    bookBooth(booth.id || booth._id, exhibitorId, exhibitor.name || exhibitor.companyName || user?.name || 'My Company');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          My Reserved Stalls & Interactive Hall Floor Plan
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Inspect your allocated exhibition floor spaces, verify amenities, or reserve additional booth territory.
        </p>
      </div>

      {/* My Booked Stalls Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Store className="w-4 h-4 text-brand-blue" />
          Confirmed Allocated Stalls
        </h3>

        {myBooths.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No stalls currently booked under your company. Choose an available booth on the interactive floor plan below to confirm your space.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myBooths.map((b) => (
              <Card key={b.id} className="p-5 bg-gradient-to-r from-blue-50/60 via-white to-white border border-blue-200/80 shadow-subtle flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="navy" size="md">
                      Stall: {b.number}
                    </Badge>
                    <Badge variant="success" size="sm">
                      Confirmed Occupied
                    </Badge>
                  </div>
                  <h4 className="font-bold text-base text-slate-900">{b.type}</h4>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Location: <strong className="text-slate-800">{b.hall}</strong></span>
                    <span>Dimensions: <strong className="text-slate-800">{b.size}</strong></span>
                    <span>Category: <strong className="text-brand-blue">{b.category}</strong></span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                  <span className="text-slate-400">Paid Investment:</span>
                  <span className="font-black text-brand-blue">{formatCurrency(b.pricePKR)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Floor Plan Selector */}
      <FloorPlanInteractive
        booths={booths}
        onBookBooth={handleBookAvailableBooth}
        userRole="exhibitor"
        selectedBoothId={myBooths[0]?.id}
      />
    </div>
  );
};
