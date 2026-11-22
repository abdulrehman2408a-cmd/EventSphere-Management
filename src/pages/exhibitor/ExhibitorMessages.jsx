import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { MessageSquare, Send, Users, Sparkles, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ExhibitorMessages = () => {
  const { messages, submitContactMessage, exhibitors } = useData();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('organizer');
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');

  // Neighboring exhibitors
  const neighborExhibitors = exhibitors.filter((e) => e.id !== user?.companyId).slice(0, 4);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    submitContactMessage({
      name: user?.name || 'Syeda Fatima (Systems Limited)',
      email: user?.email || 'fatima@systemsltd.com',
      subject: subject || 'Exhibitor Logistics Inquiry',
      message: messageText
    });

    setSubject('');
    setMessageText('');
  };

  const handleMessageNeighbor = (companyName) => {
    toast.success(`Encrypted B2B liaison channel initiated with ${companyName}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Exhibitor Communication Desk
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Correspond with the organizing committee and network with neighboring booth tenants.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('organizer')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'organizer'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Organizer Liaison & Operations
        </button>
        <button
          onClick={() => setActiveTab('neighbors')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'neighbors'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Neighboring Booth Exhibitors
        </button>
      </div>

      {activeTab === 'organizer' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thread History */}
          <Card className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Communication History with EventSphere Operations
            </h3>

            <div className="space-y-3">
              {messages.slice(0, 3).map((m) => (
                <div key={m.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{m.subject}</span>
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{m.content}</p>

                  {m.replies?.map((r, i) => (
                    <div key={i} className="mt-2 p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs">
                      <div className="flex justify-between font-bold text-brand-blue text-[11px] mb-0.5">
                        <span>{r.sender}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{r.time}</span>
                      </div>
                      <p className="text-slate-700">{r.text}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Message Form */}
          <Card className="p-6 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Dispatch Request to Organizer
            </h4>
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Topic / Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Loading bay ramp access timing"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Describe your inquiry..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
                ></textarea>
              </div>

              <Button variant="primary" size="sm" type="submit" icon={Send} className="w-full">
                Send to Organizer Desk
              </Button>
            </form>
          </Card>
        </div>
      ) : (
        /* Neighboring Exhibitors Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {neighborExhibitors.map((neighbor) => (
            <Card key={neighbor.id} className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={neighbor.logo}
                  alt={neighbor.companyName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{neighbor.companyName}</h4>
                  <p className="text-xs text-brand-blue font-medium">{neighbor.industry}</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Adjacent Stall: <strong>{neighbor.boothNumber}</strong>
                  </span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                icon={MessageSquare}
                onClick={() => handleMessageNeighbor(neighbor.companyName)}
              >
                Connect
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
