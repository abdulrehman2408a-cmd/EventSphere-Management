import React from 'react';

export const LoadingSkeleton = ({ lines = 4, className = '' }) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      <div className="h-6 bg-slate-200 rounded-lg w-1/3"></div>
      <div className="h-4 bg-slate-200 rounded-lg w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
      {lines > 3 && <div className="h-4 bg-slate-200 rounded-lg w-5/6"></div>}
      {lines > 4 && <div className="h-24 bg-slate-200 rounded-xl w-full"></div>}
    </div>
  );
};
