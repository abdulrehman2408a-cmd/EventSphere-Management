import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/helpers';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconBg = 'bg-blue-50 text-brand-blue',
  trend,
  trendType = 'up',
  className = ''
}) => {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
          {(subtext || trend) && (
            <div className="flex items-center gap-1.5 mt-2">
              {trend && (
                <span className={cn(
                  'inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md',
                  trendType === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                )}>
                  {trendType === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {trend}
                </span>
              )}
              {subtext && <span className="text-xs text-slate-500">{subtext}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-2xl flex items-center justify-center shrink-0 shadow-sm', iconBg)}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};
