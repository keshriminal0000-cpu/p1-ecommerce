import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useStore } from '../store/useStore';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    login, 
    signup, 
    authRedirectAction 
  } = useStore();

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [universityName, setUniversityName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleQuickDemoStudent = async () => {
    setLoading(true);
    setErrorMessage('');
    const res = await login('alex.rivera@stanford.edu', 'password123');
    setLoading(false);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full student name.');
        return;
      }
      if (!emailOrPhone.trim()) {
        setErrorMessage('Please provide an email address or mobile phone number.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-type your password.');
        return;
      }

      setLoading(true);
      const res = await signup({
        name,
        emailOrPhone,
        password,
        studentId: studentId.trim() || undefined,
        universityName: universityName.trim() || undefined
      });
      setLoading(false);

      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    } else {
      // Login mode
      if (!emailOrPhone.trim() || !password) {
        setErrorMessage('Please enter your registered email/phone and password.');
        return;
      }

      setLoading(true);
      const res = await login(emailOrPhone, password);
      setLoading(false);

      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {mode === 'signup' ? 'Student Registration' : 'Student Login'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {authRedirectAction === 'checkout' 
                  ? 'Sign up or login to confirm & place your order' 
                  : 'Exclusive student access & transparent commerce'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Callout if redirected from checkout */}
        {authRedirectAction === 'checkout' && (
          <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200/70 flex items-center gap-2 text-xs text-amber-900 font-medium">
            <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Authentication Required:</strong> Please create an account or sign in before placing your order.
            </span>
          </div>
        )}

        {/* Tab Switcher (Sign Up / Login) */}
        <div className="flex border-b border-slate-200 bg-slate-50/40">
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
              mode === 'signup'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account (Sign Up)
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
              mode === 'login'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Existing Student (Log In)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium animate-in fade-in">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Student Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma or John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          )}

          {/* Email or Phone Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Account or Mobile Phone *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="name@university.edu or +91 98765 43210"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Create Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {mode === 'signup' ? 'Create Password *' : 'Password *'}
              </label>
              {mode === 'signup' && (
                <span className="text-[10px] text-slate-400">Min 6 characters</span>
              )}
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password in Sign Up */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Optional Student Verification Meta */}
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  College / University
                </label>
                <input
                  type="text"
                  placeholder="e.g. IIT, BITS, Stanford"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Student ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. STU-2026-904"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition active:scale-98 disabled:opacity-50"
          >
            <span>{mode === 'signup' ? 'Create Student Account & Continue' : 'Log In & Continue'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Quick Demo Student Auto-fill */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 block mb-2">Or for testing evaluation:</span>
            <button
              type="button"
              onClick={handleQuickDemoStudent}
              disabled={loading}
              className="w-full rounded-xl border border-indigo-200 bg-indigo-50/70 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
            >
              ⚡ Quick Student Demo Login (Alex Rivera)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
