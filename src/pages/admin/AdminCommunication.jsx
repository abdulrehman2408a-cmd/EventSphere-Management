import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  MessageSquare,
  Search,
  Send,
  Reply,
  CheckCircle2,
  Clock,
  User,
  Inbox
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminCommunication = () => {
  const { messages, sendMessageReply } = useData();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState(messages[0]?.id || null);
  const [replyText, setReplyText] = useState('');

  const filteredMessages = messages.filter((m) =>
    m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMessage = messages.find((m) => m.id === selectedMessageId) || messages[0];

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMessage) return;

    sendMessageReply(activeMessage.id, replyText, user?.name || 'EventSphere Organizer Support');
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Organizer Dispatch Desk & Communication Inbox
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Process technical inquiries, VIP pass assistance, and stall logistics requests from delegates and exhibitors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px]">
        {/* Messages List Column */}
        <Card className="p-0 overflow-hidden flex flex-col h-full">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No messages found.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = activeMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessageId(msg.id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/80 border-l-4 border-brand-blue' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {msg.from}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">{msg.time}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-800 truncate mb-1">
                      {msg.subject}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {msg.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={msg.status === 'Replied' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {msg.status}
                      </Badge>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {msg.senderRole}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Active Message View & Reply Form Column */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between h-full space-y-4">
          {activeMessage ? (
            <>
              <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                {/* Header */}
                <div className="pb-4 border-b border-slate-100 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{activeMessage.subject}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      From: <strong className="text-slate-800">{activeMessage.from}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={activeMessage.status === 'Replied' ? 'success' : 'warning'}>
                      {activeMessage.status}
                    </Badge>
                    <span className="text-[10px] text-slate-400 block mt-1">{activeMessage.time}</span>
                  </div>
                </div>

                {/* Original Message */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {activeMessage.content}
                </div>

                {/* Replies Thread */}
                {activeMessage.replies && activeMessage.replies.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h5 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                      Response History
                    </h5>
                    {activeMessage.replies.map((rep, idx) => (
                      <div key={idx} className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs space-y-1">
                        <div className="flex justify-between items-center font-bold text-brand-blue text-[11px]">
                          <span>{rep.sender}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{rep.time}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{rep.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 space-y-3">
                <textarea
                  rows={3}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Draft official organizer dispatch or resolution..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
                ></textarea>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Dispatched as: <strong>{user?.name || 'Admin'}</strong>
                  </span>
                  <Button variant="primary" size="sm" type="submit" icon={Send}>
                    Dispatch Reply
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
              <Inbox className="w-10 h-10 mb-2 stroke-1" />
              <span>Select a message thread to view communication details</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
