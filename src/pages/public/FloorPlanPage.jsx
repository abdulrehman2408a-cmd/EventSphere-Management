import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FloorPlanInteractive } from '../../components/common/FloorPlanInteractive';
import { Button } from '../../components/common/Button';
import { Layers, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const FloorPlanPage = () => {
  const { booths, expos, exhibitors, bookBooth } = useData();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [selectedExpoId, setSelectedExpoId] = useState(expos[0]?.id || expos[0]?._id || '');

  const selectedExpo = expos.find((e) => e.id === selectedExpoId || e._id === selectedExpoId) || expos[0];
  const expoBooths = booths.filter((b) => (selectedExpo ? b.expo === selectedExpo.id || b.expo === selectedExpo._id || b.expoId === selectedExpo.id : true));

  const handleBookBooth = (booth) => {
    if (!user) {
      toast.error('Please sign in to reserve an exhibition stall');
      navigate('/login');
      return;
    }
    if (role !== 'exhibitor') {
      toast.error('Only registered Exhibitors can reserve stalls. Please log in as an Exhibitor.');
      return;
    }
    navigate('/exhibitor/booths');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" /> Exhibition Spatial Architecture
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Interactive Venue Floor Plan & Stall Wayfinder
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore exhibition hall spatial arrangements, premium island stalls, and live booking availability.
          </p>
        </div>

        {/* Expo Selector */}
        <div className="w-full sm:w-auto">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Active Exhibition Hall
          </label>
          <select
            value={selectedExpoId}
            onChange={(e) => setSelectedExpoId(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white shadow-sm focus:outline-none focus:border-brand-blue"
          >
            {expos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Floor Plan Component */}
      <FloorPlanInteractive
        booths={expoBooths}
        onBookBooth={handleBookBooth}
        userRole={role}
      />
    </div>
  );
};
