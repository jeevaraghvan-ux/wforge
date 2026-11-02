import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { 
  signInWithGooglePopup, 
  isFirebaseConfigured, 
  updateFirebaseConfig, 
  firebaseConfig 
} from '../firebase';
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Settings,
  LogOut,
  Award,
  Package,
  Layers,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const AccountSection = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    setUsers, 
    orders,
    setActiveTab
  } = useStore();

  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [showFirebaseConfig, setShowFirebaseConfig] = useState(false);
  const [firebaseJsonInput, setFirebaseJsonInput] = useState('');
  const [isFirebaseConfiguredState, setIsFirebaseConfiguredState] = useState(isFirebaseConfigured());

  // Direct Firebase Google Sign-In: Sole verification & authentication method
  const handleDirectGoogleSignIn = async () => {
    setAuthError('');
    if (!isFirebaseConfigured()) {
      setShowFirebaseConfig(true);
      setAuthError('Firebase credentials are required for Google Sign-In. Please paste your config below.');
      return;
    }
    try {
      const user = await signInWithGooglePopup();
      if (user) {
        const existing = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
        if (existing) {
          setCurrentUser(existing);
        } else {
          const newGoogleUser = {
            id: user.uid || 'user-' + Date.now(),
            name: user.displayName || user.email.split('@')[0],
            email: user.email.toLowerCase(),
            photoURL: user.photoURL,
            points: 10,
            verified: true,
            role: 'student',
            credits: 20
          };
          setUsers(prev => [...prev, newGoogleUser]);
          setCurrentUser(newGoogleUser);
        }
        setAuthSuccess(`Signed in with Google as ${user.displayName || user.email}!`);
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in popup was closed.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setAuthError('Domain unauthorized: Add this domain in Firebase Console -> Authentication -> Settings -> Authorized domains.');
      } else {
        setAuthError(err.message || 'Firebase Google Sign-In error.');
      }
    }
  };

  const handleSaveFirebaseConfig = () => {
    try {
      let parsed = {};
      const trimmed = firebaseJsonInput.trim();
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        parsed = JSON.parse(trimmed);
      } else if (trimmed) {
        parsed = { apiKey: trimmed };
      }
      if (parsed.apiKey) {
        updateFirebaseConfig(parsed);
        setIsFirebaseConfiguredState(true);
        setAuthSuccess('Firebase configuration saved successfully! Google Sign-In is ready.');
        setTimeout(() => setAuthSuccess(''), 3000);
      } else {
        setAuthError('Please paste a valid Firebase configuration or API Key.');
      }
    } catch (err) {
      setAuthError('Invalid configuration: ' + err.message);
    }
  };

  // IF CURRENT USER IS LOGGED IN: DISPLAY MAKER DASHBOARD
  if (currentUser) {
    const userOrders = orders.filter(
      o => o.userEmail.toLowerCase() === currentUser.email.toLowerCase()
    );

    return (
      <div className="py-8 px-4 sm:px-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-400 to-indigo-500 flex items-center justify-center text-xl font-bold font-display text-white shadow-glass-glow">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-display text-white">
                    {currentUser.name}
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase font-semibold">
                    {currentUser.role || 'Student Maker'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentUser(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-400/30 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              onClick={() => setActiveTab('rewards')}
              className="liquid-glass-card p-4 rounded-2xl border border-amber-400/30 cursor-pointer group hover:border-amber-400/60 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-amber-300 mb-1">
                <span className="flex items-center gap-1 font-semibold">
                  <Award className="w-4 h-4 text-amber-400" /> Reward Points
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 font-bold">
                  +1 pt = 1¢ off
                </span>
              </div>
              <div className="text-3xl font-black font-display text-white group-hover:text-amber-300 transition-colors">
                {currentUser.points || 0} <span className="text-xs font-normal text-slate-400">pts</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Value: ${((currentUser.points || 0) * 0.01).toFixed(2)} savings on preorders
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('vault')}
              className="liquid-glass-card p-4 rounded-2xl border border-cyan-400/30 cursor-pointer group hover:border-cyan-400/60 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-cyan-300 mb-1">
                <span className="flex items-center gap-1 font-semibold">
                  <Layers className="w-4 h-4 text-cyan-400" /> Print Credits
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-200">
                  Classroom
                </span>
              </div>
              <div className="text-3xl font-black font-display text-white group-hover:text-cyan-300 transition-colors">
                {currentUser.credits || 0} <span className="text-xs font-normal text-slate-400">credits</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Check Vault rankings & credit banks
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('orders')}
              className="liquid-glass-card p-4 rounded-2xl border border-purple-400/30 cursor-pointer group hover:border-purple-400/60 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-purple-300 mb-1">
                <span className="flex items-center gap-1 font-semibold">
                  <Package className="w-4 h-4 text-purple-400" /> My Orders
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200">
                  Live
                </span>
              </div>
              <div className="text-3xl font-black font-display text-white group-hover:text-purple-300 transition-colors">
                {userOrders.length} <span className="text-xs font-normal text-slate-400">orders</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Track 3D print progress
              </div>
            </div>
          </div>

          {/* User Orders list with Final Price to Pay */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              Recent 3D Print Orders
            </h3>
            {userOrders.length === 0 ? (
              <div className="p-6 rounded-2xl liquid-glass border border-white/10 text-center space-y-2">
                <p className="text-xs text-slate-400">You haven't placed any 3D print preorders yet.</p>
                <button
                  onClick={() => setActiveTab('listings')}
                  className="px-4 py-2 rounded-xl glass-btn-primary text-white text-xs font-bold"
                >
                  Browse Available 3D Models
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {userOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-xl liquid-glass border border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{order.itemTitle}</span>
                        <span className="font-mono text-[10px] text-cyan-300 px-1.5 py-0.2 rounded bg-cyan-500/10">
                          {order.id}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span>Qty: {order.quantity} • Ordered {order.orderDate}</span>
                        {order.pointsUsed > 0 ? (
                          <span className="flex items-center gap-1">
                            <span className="line-through">${(order.originalPrice || order.totalPrice).toFixed(2)}</span>
                            <span className="text-amber-300 font-semibold font-mono">(-{order.pointsUsed} pts)</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30 font-mono">
                              Final Price to Pay: ${(order.finalPrice ?? order.totalPrice).toFixed(2)}
                            </span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold font-mono">
                            Final Price to Pay: ${(order.finalPrice ?? order.totalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      order.status === 'Delivered' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : order.status === 'Printing'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // IF NOT SIGNED IN: DEDICATED SOLE GOOGLE AUTHENTICATION & VERIFICATION VIEW
  return (
    <div className="py-12 px-4 sm:px-8 max-w-xl mx-auto space-y-8 animate-fade-in">
      <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl relative overflow-hidden">
        
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <Logo size="lg" className="mx-auto mb-2" />
            <h2 className="text-3xl font-bold font-display text-white">
              Sign In to W Forge
            </h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Fast, secure student verification. Sign in with Google to pre-order 3D prints, track print progress, and earn reward points.
            </p>
          </div>

          {/* Benefits pills */}
          <div className="grid grid-cols-2 gap-3 text-left pt-2">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 flex items-center gap-2.5 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div>
                <div className="font-bold text-white">Instant Verification</div>
                <div className="text-[10px] text-slate-400">Verified via Google Account</div>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 flex items-center gap-2.5 shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <div className="font-bold text-amber-300">+10 Reward Points</div>
                <div className="text-[10px] text-slate-400">Welcome bonus on sign up</div>
              </div>
            </div>
          </div>

          {/* DIRECT GOOGLE SIGN-IN BUTTON */}
          <div className="space-y-3 pt-3">
            <button
              type="button"
              onClick={handleDirectGoogleSignIn}
              className="w-full py-4 px-6 rounded-2xl liquid-glass border border-cyan-400/50 hover:border-cyan-300 bg-white/10 hover:bg-white/15 flex items-center justify-center gap-3 transition-all text-base font-bold text-white group shadow-glass-glow hover:scale-[1.02]"
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
              <div className="text-xs text-rose-300 bg-rose-500/15 p-3 rounded-xl border border-rose-500/30 text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="text-xs text-emerald-300 bg-emerald-500/15 p-3 rounded-xl border border-emerald-500/30 text-left flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                <span>{authSuccess}</span>
              </div>
            )}
          </div>

          <div className="pt-2 text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Only Google Accounts are supported for safety & verified identity.</span>
          </div>

          {/* Optional Firebase Credentials config */}
          <div className="pt-4 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => setShowFirebaseConfig(!showFirebaseConfig)}
              className="text-[11px] text-slate-400 hover:text-cyan-300 inline-flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              <span>{showFirebaseConfig ? 'Hide Firebase Settings' : 'Configure Firebase Connection'}</span>
            </button>

            {showFirebaseConfig && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-900/90 border border-white/15 text-left space-y-2 text-xs">
                <div className="text-slate-200 font-semibold text-[11px]">Firebase Project Config:</div>
                <div className="text-[10px] text-slate-400">
                  Project: <span className="font-mono text-cyan-300">{firebaseConfig.projectId}</span>
                  <br />
                  Auth Domain: <span className="font-mono text-cyan-300">{firebaseConfig.authDomain}</span>
                </div>
                <textarea
                  rows={3}
                  value={firebaseJsonInput}
                  onChange={(e) => setFirebaseJsonInput(e.target.value)}
                  placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "..."\n}`}
                  className="glass-input rounded-xl p-2.5 text-xs w-full font-mono text-[11px] text-cyan-200 resize-none"
                />
                <button
                  type="button"
                  onClick={handleSaveFirebaseConfig}
                  className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Save Config
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
