import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { Send } from 'lucide-react';

export const ContactOrganizerModal = ({ isOpen, onClose, onSubmit, defaultSubject = '' }) => {
  const { user } = useAuth();
  const [subject, setSubject] = useState(defaultSubject || 'Logistics & Booth Inquiries');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: user?.name || 'Delegate User',
      email: user?.email || 'user@example.com',
      subject,
      message
    });
    setMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Organizing Committee"
      subtitle="Dispatch direct communication to EventSphere operations desk"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Subject Matter *
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Electrical drop connection for Booth A-101"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Inquiry Message *
          </label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Explain your inquiry, technical booth requirements, or schedule request in detail..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
          ></textarea>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Send}>
            Send Message
          </Button>
        </div>
      </form>
    </Modal>
  );
};
