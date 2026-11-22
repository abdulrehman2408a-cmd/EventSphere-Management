import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { Users, Plus, Trash2, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const ExhibitorStaff = () => {
  const { staff, addStaffMember, removeStaffMember } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    addStaffMember({
      name,
      designation: designation || 'Booth Executive',
      email,
      phone: phone || '+92 300 0000000',
      badgeIssued: true
    });

    setName('');
    setDesignation('');
    setEmail('');
    setPhone('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Booth Staff Credentials & Delegate Badges
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Register on-site booth staff, engineers, and product specialists for turnstile clearance.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Add Booth Staff Member
        </Button>
      </div>

      {staff.length === 0 ? (
        <EmptyState
          title="No Staff Registered"
          description="You have not registered any booth staff members or engineers yet. Issue passes for your team so they can gain turnstile clearance."
          actionLabel="Add Staff Member"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <Card key={member.id} className="p-5 bg-white border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-base text-slate-900">{member.name}</h4>
                    <p className="text-xs text-brand-blue font-medium">{member.designation}</p>
                  </div>
                  <button
                    onClick={() => removeStaffMember(member.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove Staff Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-500 space-y-0.5 pt-1">
                  <p>Email: {member.email}</p>
                  <p>Phone: {member.phone}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Badge Issued
                </span>
                <span className="text-[10px] text-slate-400 font-mono">STAFF-PASS-2026</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Booth Staff"
        subtitle="Issue an authorized exhibitor badge for hall access"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sana Malik"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Designation / Role
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Enterprise Solutions Architect"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sana.m@company.com"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Contact
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 321 0000000"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Generate Staff Badge
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
