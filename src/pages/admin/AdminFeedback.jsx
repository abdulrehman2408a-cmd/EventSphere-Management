import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Star, MessageSquare, ThumbsUp, Filter, Quote } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export const AdminFeedback = () => {
  const { feedback } = useData();
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('All');

  const filteredFeedback = feedback.filter((item) => {
    if (selectedRatingFilter === 'All') return true;
    return item.rating === Number(selectedRatingFilter);
  });

  const avgRating = (
    feedback.reduce((acc, curr) => acc + curr.rating, 0) / (feedback.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Delegate & Exhibitor Feedback Management
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Evaluate customer satisfaction, session ratings, and qualitative venue suggestions.
        </p>
      </div>

      {/* Top Ratings Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-brand-navy to-brand-deep text-white flex items-center gap-5">
          <div className="text-center p-3 bg-white/10 rounded-2xl">
            <span className="text-4xl font-black text-amber-300 block">{avgRating}</span>
            <div className="flex items-center justify-center gap-0.5 mt-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Overall Satisfaction</h4>
            <p className="text-xs text-slate-300 mt-1">Based on verified turnstile delegate survey submissions</p>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-center space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Submissions</span>
          <h3 className="text-3xl font-black text-slate-900">{feedback.length} Reviews</h3>
          <span className="text-xs text-emerald-600 font-semibold">96% Positive Sentiment</span>
        </Card>

        <Card className="p-6 flex flex-col justify-center space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Complimented Area</span>
          <h3 className="text-xl font-black text-brand-blue">QR Turnstile Check-In</h3>
          <span className="text-xs text-slate-500">Average wait time under 15 seconds</span>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2">Filter Rating:</span>
          {['All', '5', '4', '3'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRatingFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRatingFilter === r
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {r === 'All' ? 'All Ratings' : `${r} Stars`}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500">{filteredFeedback.length} reviews shown</span>
      </div>

      {/* Feedback List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeedback.map((item) => (
          <Card key={item.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-slate-400">
                    {item.role} • <strong className="text-slate-600">{item.expoTitle}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 italic leading-relaxed">
                "{item.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>{formatDate(item.date)}</span>
              <Badge variant="purple" size="sm">Verified Delegate</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
