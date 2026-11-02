import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { 
  signInWithGoogleSupabase, 
  isSupabaseConfigured, 
  updateSupabaseConfig, 
  supabaseConfig 
} from '../supabase';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Settings,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const AccountModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    currentUser, 
    setCurrentUser, 
    users, 
    setUsers, 
    preorderTargetProduct,
    handlePreorder
  } = useStore();

  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(supabaseConfig.url || '');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(supabaseConfig.anonKey || '');
  const [isConfigured, setIsConfigured] = useState(isSupabaseConfigured());

  if (!isAuthModalOpen) return null;

  // Supabase Google Sign-in
  const handleGoogleSignIn = async () => {
    setAuthError('');
    if (!isSupabaseConfigured()) {
      setShowConfig(true);
      setAuthError('Supabase project credentials are required. Please paste your Supabase Project URL and Anon Key below.');
      return;
    }

    try {
      setAuthSuccess('Redirecting to Google Sign-In...');
      await signInWithGoogleSupabase();
    } catch (err) {
      setAuthError(err.message || 'Google Sign-In failed.');
    }
  };

  const handleSaveConfig = () => {
    const url = supabaseUrlInput.trim();
    const key = supabaseKeyInput.trim();
    if (!url.startsWith('https://') || !key) {
      setAuthError('Please enter a valid Supabase Project URL (e.g. https://xxx.supabase.co) and Anon Key.');
      return;
    }
    const success = updateSupabaseConfig({ url, anonKey: key });
    if (success) {
      setIsConfigured(true);
      setAuthSuccess('Supabase configured successfully! Click Sign in with Google.');
      setTimeout(() => setAuthSuccess(''), 3000);
    } else {
      setAuthError('Failed to save Supabase config.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="liquid-glass rounded-3xl max-w-md w-full p-6 sm:p-8 border border-white/20 shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SINGLE VERIFICATION METHOD: GOOGLE AUTH VIA SUPABASE */}
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <Logo size="lg" className="mx-auto mb-2" />
            <h2 className="text-2xl font-bold font-display text-white">
              Sign In to W Forge
            </h2>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Fast, secure student verification. Sign in with Google to pre-order 3D prints, track print progress, and redeem reward points.
            </p>
          </div>

          {/* Benefits pills */}
          <div className="grid grid-cols-2 gap-2 text-left pt-1">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Instant Google Verification</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>+10 Welcome Points</span>
            </div>
          </div>

          {/* GOOGLE SIGN-IN BUTTON */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3.5 px-4 rounded-2xl liquid-glass border border-cyan-400/50 hover:border-cyan-300 bg-white/10 hover:bg-white/15 flex items-center justify-center gap-3 transition-all text-sm font-bold text-white group shadow-glass-glow hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
              <span>Sign in with Google</span>
            </button>

            {authError && (
              <div className="text-xs text-rose-300 bg-rose-500/15 p-2.5 rounded-xl border border-rose-500/30 text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="text-xs text-emerald-300 bg-emerald-500/15 p-2.5 rounded-xl border border-emerald-500/30 text-left flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                <span>{authSuccess}</span>
              </div>
            )}
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Only Google Accounts are supported for safety & verified identity.</span>
          </div>

          {/* Supabase Connection settings */}
          <div className="pt-3 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1 mx-auto"
            >
              <Settings className="w-3 h-3" />
              <span>{showConfig ? 'Hide Supabase Settings' : 'Supabase Connection'}</span>
            </button>

            {showConfig && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-white/10 text-left space-y-2.5">
                <div className="text-[11px] text-slate-300 font-semibold">
                  Supabase Project Settings:
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Project URL:</label>
                  <input
                    type="text"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="glass-input rounded-lg px-2.5 py-1.5 text-[11px] font-mono w-full text-cyan-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Anon / Public API Key:</label>
                  <input
                    type="password"
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="glass-input rounded-lg px-2.5 py-1.5 text-[11px] font-mono w-full text-cyan-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="w-full py-1.5 rounded-lg glass-btn-primary text-white text-[11px] font-bold"
                >
                  Save Supabase Credentials
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
