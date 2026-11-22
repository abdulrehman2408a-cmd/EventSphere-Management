import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { TicketModal } from '../../components/common/TicketModal';
import { formatDate, exportToCSV } from '../../utils/helpers';
import {
  Users,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  QrCode,
  Ticket
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminAttendees = () => {
  const { attendees, expos, toggleAttendeeCheckIn } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpoFilter, setSelectedExpoFilter] = useState('All');
  const [checkInFilter, setCheckInFilter] = useState('All');
  const [inspectAttendee, setInspectAttendee] = useState(null);


const filteredAttendees = attendees.filter((a) => {
  const name = (a.name || '').toLowerCase();
  const email = (a.email || '').toLowerCase();
  const company = (a.company || '').toLowerCase();
  const ticketNumber = (a.ticketNumber || '').toLowerCase();
  const search = searchQuery.toLowerCase();

  const matchesSearch =
    name.includes(search) ||
    email.includes(search) ||
    company.includes(search) ||
    ticketNumber.includes(search);

  const matchesExpo =
    selectedExpoFilter === 'All' ||
    a.expoId === selectedExpoFilter;

  const matchesCheckin =
    checkInFilter === 'All' ||
    (checkInFilter === 'CheckedIn' && a.checkedIn) ||
    (checkInFilter === 'Pending' && !a.checkedIn);

  return matchesSearch && matchesExpo && matchesCheckin;
});


  const handleExportCSV = () => {
    const exportData = filteredAttendees.map((a) => ({
      TicketNumber: a.ticketNumber,
      FullName: a.name,
      Email: a.email,
      ContactPhone: a.phone,
      Organization: a.company,
      Designation: a.designation,
      HostCity: a.city,
      Exhibition: a.expoTitle,
      PassTier: a.ticketType,
      PaidAmountPKR: a.paidAmountPKR,
      RegistrationDate: a.registrationDate,
      TurnstileCheckIn: a.checkedIn ? 'VERIFIED' : 'PENDING'
    }));

    exportToCSV(exportData, `EventSphere_Attendees_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Attendee roster exported as CSV!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Registered Attendees & Digital Pass Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor gate turnstile check-ins, verify electronic tickets, and export delegate rosters.
          </p>
        </div>
        <Button
          variant="secondary"
          icon={Download}
          onClick={handleExportCSV}
          className="shadow-sm"
        >
          Export Attendee Roster (CSV)
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
            placeholder="Search by name, email, company, pass ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedExpoFilter}
            onChange={(e) => setSelectedExpoFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:outline-none"
          >
            <option value="All">All Associated Expos</option>
            {expos.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>

          <select
            value={checkInFilter}
            onChange={(e) => setCheckInFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:outline-none"
          >
            <option value="All">All Check-in Statuses</option>
            <option value="CheckedIn">Checked In</option>
            <option value="Pending">Pending Gate Scan</option>
          </select>
        </div>
      </div>

      {/* Attendees Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Delegate Name</th>
                <th className="py-3.5 px-4">Organization & Role</th>
                <th className="py-3.5 px-4">Ticket ID & Tier</th>
                <th className="py-3.5 px-4">Associated Expo</th>
                <th className="py-3.5 px-4">Registration</th>
                <th className="py-3.5 px-4">Turnstile Ingress</th>
                <th className="py-3.5 px-4 text-right">Inspect Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No attendees registered yet in the database.
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{att.name}</span>
                    <span className="text-[10px] text-slate-400 block">{att.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{att.company}</span>
                    <span className="text-[10px] text-slate-400 block">{att.designation}</span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className="font-black text-slate-900 block">{att.ticketNumber}</span>
                    <Badge variant="purple" size="sm" className="mt-0.5">{att.ticketType}</Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-[140px] truncate">
                    {att.expoTitle}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(att.registrationDate)}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleAttendeeCheckIn(att.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                        att.checkedIn
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                      title="Click to toggle turnstile gate verification"
                    >
                      {att.checkedIn ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span> Gate Pending
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={QrCode}
                      onClick={() => setInspectAttendee(att)}
                    >
                      Badge
                    </Button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspect Ticket Modal */}
      {inspectAttendee && (
        <TicketModal
          isOpen={!!inspectAttendee}
          onClose={() => setInspectAttendee(null)}
          attendee={inspectAttendee}
          expo={expos.find((e) => e.id === inspectAttendee.expoId)}
        />
      )}
    </div>
  );
};
