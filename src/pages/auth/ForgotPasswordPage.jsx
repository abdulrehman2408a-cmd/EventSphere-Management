import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { authAPI } from '../../services/api';
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setIsSubmitting(true);
    try {
      await authAPI.forgotPassword(email);
      setSubmitted(true);
      toast.success('Password recovery instructions dispatched to your email.');
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch password recovery');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-navy via-brand-deep to-brand-blue flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs text-slate-500">
            Enter your account email to receive recovery instructions
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-5 bg-white border border-slate-200 shadow-premium">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Check Your Email</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We have transmitted a secure password reset token to <strong className="text-slate-900">{email}</strong>.
              </p>
              <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline pt-2">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Transmitting Instructions...' : 'Send Password Reset Token'}
              </Button>

              <div className="pt-3 text-center">
                <Link to="/login" className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900">
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
