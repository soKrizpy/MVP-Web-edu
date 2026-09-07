import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle,
  Mail,
  Lock,
  ArrowRight,
  CloudCheck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';

export const SocialLoginModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, loginWithSocial } = useApp();
  const [emailInput, setEmailInput] = useState(user.email);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmitted(true);
    setTimeout(() => {
      loginWithSocial('google'); // link account
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 text-zinc-900 dark:text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Secure Account Sync</h3>
              <p className="text-[11px] text-zinc-400">Cross-device study progress & pet saves</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status pill */}
        <div className="my-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Connected: {user.name}
              </p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                Current sync provider: {user.authProvider.toUpperCase()}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active</span>
        </div>

        {/* Social Options */}
        <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-3">
          Sign In / Link Provider
        </p>

        <div className="space-y-2.5">
          {/* Google */}
          <button
            onClick={() => loginWithSocial('google')}
            className="w-full p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </div>
            {user.authProvider === 'google' && (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            )}
          </button>

          {/* GitHub */}
          <button
            onClick={() => loginWithSocial('github')}
            className="w-full p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Continue with GitHub</span>
            </div>
            {user.authProvider === 'github' && (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            )}
          </button>

          {/* Apple */}
          <button
            onClick={() => loginWithSocial('apple')}
            className="w-full p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-base"></span>
              <span>Continue with Apple</span>
            </div>
            {user.authProvider === 'apple' && (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            )}
          </button>
        </div>

        {/* Email Magic Link */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <form onSubmit={handleEmailSubmit} className="space-y-2">
            <span className="block text-[11px] font-bold text-zinc-500">Or Sync with Email OTP</span>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                {emailSubmitted ? 'Synced!' : 'Sync'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
