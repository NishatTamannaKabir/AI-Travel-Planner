import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const fillDemo = () => {
    setEmail('demo@aitravelplanner.com');
    setPassword('Password123!');
    setIsRegister(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!fullName.trim()) throw new Error('Full name is required.');
        await register(fullName, email, password);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed. Please check credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#E4EAE7] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#E4EAE7] flex items-center justify-between bg-[#F7FAF9]/60">
          <div>
            <h3 className="text-xl font-extrabold text-[#172033]">
              {isRegister ? 'Create Your Account' : 'Welcome Back'}
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              {isRegister ? 'Save plans and sync across devices' : 'Access your saved trips and portfolio'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#667085] hover:text-[#172033] rounded-xl hover:bg-[#E4EAE7]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast-fill Banner */}
        <div className="bg-[#DDF7EF] px-6 py-2.5 border-b border-[#BAEEDB] flex items-center justify-between text-xs">
          <span className="text-[#087A5A] font-medium">Want to test with sample data?</span>
          <button
            type="button"
            onClick={fillDemo}
            className="font-bold text-[#087A5A] hover:text-[#066349] underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-[#0F9D72]" />
            Auto-fill Demo User
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[#DC4B4B] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-[#667085]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Traveler"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E4EAE7] focus:outline-hidden focus:ring-2 focus:ring-[#0F9D72] bg-[#F7FAF9]/60"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#667085]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E4EAE7] focus:outline-hidden focus:ring-2 focus:ring-[#0F9D72] bg-[#F7FAF9]/60"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#667085]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E4EAE7] focus:outline-hidden focus:ring-2 focus:ring-[#0F9D72] bg-[#F7FAF9]/60"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#0F9D72] hover:bg-[#087A5A] shadow-md shadow-[#0F9D72]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : isRegister ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="text-center pt-2 text-xs text-[#667085]">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-[#0F9D72] hover:underline"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-[#0F9D72] hover:underline"
                >
                  Create one now
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
