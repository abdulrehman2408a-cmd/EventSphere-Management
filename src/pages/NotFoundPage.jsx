import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 text-brand-blue flex items-center justify-center font-black text-2xl border border-blue-200">
        404
      </div>
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 max-w-md">
        The convention hall or module you are seeking might have been moved or does not exist.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primary" icon={Home} onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </div>
    </div>
  );
};
