import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FeedbackFormModal = ({ isOpen, onClose, onSubmit, defaultExpoTitle = 'Pakistan International Tech & AI Summit 2026' }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [expoTitle, setExpoTitle] = useState(defaultExpoTitle);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: user?.name || 'Hamza Farooq',
      role: user?.role === 'exhibitor' ? 'Exhibitor' : 'Attendee',
      rating,
      expoTitle,
      comment
    });
    setComment('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Expo Feedback"
      subtitle="Help the organizing committee evaluate event quality & amenities"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Expo Event
          </label>
          <input
            type="text"
            value={expoTitle}
            onChange={(e) => setExpoTitle(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Overall Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="p-1 text-amber-400 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-slate-700 ml-2">
              {rating} / 5 Stars
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Comments & Suggestions *
          </label>
          <textarea
            required
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts on session relevance, stall layout, audio/visuals, or venue hospitality..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
          ></textarea>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Submit Feedback
          </Button>
        </div>
      </form>
    </Modal>
  );
};
