import React from 'react';
import { cn } from '../../utils/helpers';

export const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 transition-all duration-200',
        hover && 'hover:shadow-premium hover:border-slate-300 hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
