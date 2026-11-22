import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Star, Send, CheckCircle2 } from 'lucide-react';

export const AttendeeFeedback = () => {
  const { feedback, submitFeedback, expos } = useData();
  const { user } = useAuth();

  const [selectedExpo, setSelectedExpo] = useState(expos[0]?.title || 'Pakistan International Tech & AI Summit 2026');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const mySubmissions = feedback.filter((f) => f.name === user?.name || f.role === 'Attendee');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    submitFeedback({
      name: user?.name || 'Hamza Farooq',
      role: 'Attendee',
      expoTitle: selectedExpo,
      rating,
      comment
    });

    setComment('');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Rate & Submit Expo Experience Feedback
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Your feedback directly assists convention organizers in improving keynote relevance and hall amenities.
        </p>
      </div>

      {/* Submission Form */}
      <Card className="p-6 sm:p-8 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Attended Exhibition
            </label>
            <select
              value={selectedExpo}
              onChange={(e) => setSelectedExpo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue bg-white"
            >
              {expos.map((e) => (
                <option key={e.id} value={e.title}>{e.title}</option>
              ))}
            </select>
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
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-800 ml-2">
                {rating} out of 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Review & Constructive Suggestions *
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the registration flow, audio visual clarity, speaker insights, or venue hospitality..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            ></textarea>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" type="submit" icon={Send}>
              Submit Evaluation
            </Button>
          </div>
        </form>
      </Card>

      {/* Recent Submissions */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900">Recent Delegate Reviews</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mySubmissions.slice(0, 4).map((sub) => (
            <Card key={sub.id} className="p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{sub.expoTitle}</span>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(sub.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 italic">"{sub.comment}"</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
