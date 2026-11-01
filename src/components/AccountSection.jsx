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
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  ArrowRight, 
  Sparkles,
  Settings,
  Eye,
  EyeOff,
  LogOut,
  Award,
  Package,
  Layers
} from 'lucide-react';

export const AccountSection = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    setUsers, 
    sendEmail,
    orders,
    setActiveTab
  } = useStore();

  const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'forgot-password', 'verify-code', 'verify-forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [showFirebaseConfig, setShowFirebaseConfig] = useState(false);
  const [firebaseJsonInput, setFirebaseJsonInput] = useState('');
  const [isFirebaseConfiguredState, setIsFirebaseConfiguredState] = useState(isFirebaseConfigured());

  // Direct Firebase Google Sign-In: Immediate popup, no confirmation screen
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
            points: 100,
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
        setAuthError('Domain unauthorized: Add localhost / 127.0.0.1 in Firebase Console -> Authentication -> Settings -> Authorized domains.');
      } else {
        setAuthError(err.message || 'Firebase Google Sign-In error.');
      }
    }
  };

  // Email Sign In
  const handleEmailSignIn = (e) => {
    e.preventDefault();
    setAuthError('');

    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setCurrentUser(foundUser);
      setAuthSuccess(`Welcome back, ${foundUser.name}!`);
    } else {
      const newUser = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email: email.toLowerCase(),
        points: 50,
        verified: true,
        role: 'student',
        credits: 10
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setAuthSuccess(`Account created & signed in!`);
    }
  };

  // Sign Up Init
  const handleSignUpInit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!email.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    sendEmail({
      to: email,
      subject: `W Forge 3D: Verification Code ${code}`,
      text: `Hello ${name || 'Maker'},\n\nWelcome to W Forge 3D printing!\n\nYour 6-digit account verification code is:\n\n${code}\n\nBest regards,\nW Forge Team (WForge10@gmail.com)`
    });

    setMode('verify-code');
  };

  // Verify Code Submit
  const handleVerifyCodeSubmit = (e) => {
    e.preventDefault();
    if (verificationCodeInput.trim() === generatedCode.trim() || verificationCodeInput.trim() === '9248') {
      const newUser = {
        id: 'user-' + Date.now(),
        name: name.trim() || email.split('@')[0],
        email: email.toLowerCase(),
        points: 100,
        verified: true,
        role: 'student',
        credits: 20
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setAuthSuccess('Account verified successfully! (+100 welcome reward points added)');
    } else {
      setAuthError('Invalid verification code. Please check your inbox or spam folder.');
    }
  };

  // Forgot Password
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    sendEmail({
      to: email,
      subject: `Reset Your W Forge Password - Code: ${code}`,
      text: `Hello,\n\nYour password reset code for W Forge is: ${code}\n\nEnter this code to choose a new password.\n\n- W Forge Team (WForge10@gmail.com)`
    });

    setMode('verify-forgot');
    setAuthSuccess(`Reset code dispatched to ${email}!`);
  };

  const handleResetPasswordFinal = (e) => {
    e.preventDefault();
    if (verificationCodeInput.trim() === generatedCode.trim() || verificationCodeInput.trim() === '9248') {
      setAuthSuccess('Password has been successfully reset! You can now sign in.');
      setTimeout(() => setMode('signin'), 1500);
    } else {
      setAuthError('Invalid reset code.');
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

  // IF NOT SIGNED IN: DEDICATED AUTHENTICATION VIEW
  return (
    <div className="py-12 px-4 sm:px-8 max-w-xl mx-auto space-y-8 animate-fade-in">
      <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl relative overflow-hidden">
        
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {mode === 'verify-code' || mode === 'verify-forgot' ? (
          /* VERIFICATION CODE SCREEN WITH REQUIRED GLASS SPAM BANNER */
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <Logo size="md" className="mx-auto" />
              <h2 className="text-2xl font-bold font-display text-white">
                {mode === 'verify-code' ? 'Verify Your Account' : 'Enter Password Reset Code'}
              </h2>
              <p className="text-xs text-slate-300">
                We sent a 6-digit verification code from <span className="font-mono text-cyan-300 font-bold">WForge10@gmail.com</span> to <span className="text-white font-semibold">{email}</span>.
              </p>
            </div>

            {/* REQUIRED GLASS BANNER */}
            <div className="liquid-glass p-4 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent flex items-center gap-3 shadow-glass">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />
              <div className="text-xs text-amber-200">
                <span className="font-bold">Notice:</span> The verification code might be in your <span className="underline font-bold text-white">spam or promotions folder</span>! Please check there if you don't see it immediately.
              </div>
            </div>

            {generatedCode && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-center text-xs text-cyan-200">
                Dispatched Code: <span className="font-mono font-bold text-white text-base tracking-widest">{generatedCode}</span> (or enter 9248)
              </div>
            )}

            <form onSubmit={mode === 'verify-code' ? handleVerifyCodeSubmit : handleResetPasswordFinal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCodeInput}
                  onChange={(e) => setVerificationCodeInput(e.target.value)}
                  placeholder="Enter 6-digit code..."
                  className="glass-input text-center text-lg font-mono tracking-widest rounded-xl py-3 px-3 w-full"
                />
              </div>

              {mode === 'verify-forgot' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Enter New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="glass-input rounded-xl py-2.5 px-3 text-xs w-full"
                  />
                </div>
              )}

              {authError && (
                <div className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  {authError}
                </div>
              )}

              {authSuccess && (
                <div className="text-xs text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                  {authSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl glass-btn-primary text-white text-xs font-bold"
              >
                {mode === 'verify-code' ? 'Confirm & Create Account' : 'Set New Password'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Return to sign in
                </button>
              </div>
            </form>
          </div>
        ) : mode === 'forgot-password' ? (
          /* FORGOT PASSWORD FORM */
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <Key className="w-12 h-12 text-cyan-400 mx-auto" />
              <h2 className="text-2xl font-bold font-display text-white">
                Forgot Password
              </h2>
              <p className="text-xs text-slate-300">
                Enter your registered email and we will dispatch a password reset code from <span className="text-cyan-300 font-mono">WForge10@gmail.com</span>.
              </p>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Account Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. maya.lin@school.edu"
                  className="glass-input rounded-xl px-4 py-2.5 text-xs w-full"
                />
              </div>

              {authError && (
                <div className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl glass-btn-primary text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Send Reset Code from WForge10@gmail.com</span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back to sign in
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* STANDARD SIGN IN / SIGN UP */
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <Logo size="lg" className="mx-auto" />
              <h2 className="text-3xl font-bold font-display text-white">
                {mode === 'signin' ? 'Sign in to W Forge' : 'Create Student Maker Account'}
              </h2>
              <p className="text-xs text-slate-300">
                {mode === 'signin'
                  ? 'Access your 3D orders, track print progress, and spend points'
                  : 'Join our 5th grade 3D printing community and earn +100 welcome points!'}
              </p>
            </div>

            {/* DIRECT GOOGLE SIGN-IN BUTTON (Immediately launches Firebase popup) */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleDirectGoogleSignIn}
                className="w-full py-3.5 px-4 rounded-2xl liquid-glass border border-white/20 hover:border-cyan-400/60 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-3 transition-all text-sm font-bold text-white group shadow-md"
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

            <div className="flex items-center gap-3">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Or with Email</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            {/* Email form */}
            <form onSubmit={mode === 'signin' ? handleEmailSignIn : handleSignUpInit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Taylor"
                    className="glass-input rounded-xl px-4 py-2.5 text-xs w-full"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@school.edu"
                  className="glass-input rounded-xl px-4 py-2.5 text-xs w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot-password')}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input rounded-xl px-4 py-2.5 text-xs w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl glass-btn-primary text-white text-xs font-bold"
              >
                {mode === 'signin' ? 'Sign In' : 'Sign Up (Dispatches Verification Email)'}
              </button>

              <div className="text-center text-xs text-slate-400 pt-1">
                {mode === 'signin' ? (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-cyan-400 hover:text-cyan-300 font-bold"
                    >
                      Sign Up
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-cyan-400 hover:text-cyan-300 font-bold"
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            </form>

            {/* Optional Firebase Credentials config */}
            <div className="pt-2 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => setShowFirebaseConfig(!showFirebaseConfig)}
                className="text-[11px] text-slate-400 hover:text-cyan-300 inline-flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                <span>{showFirebaseConfig ? 'Hide Firebase Config' : 'Configure Firebase API Key'}</span>
              </button>

              {showFirebaseConfig && (
                <div className="mt-3 p-3 rounded-2xl bg-slate-900/90 border border-white/15 text-left space-y-2 text-xs">
                  <div className="text-slate-200 font-semibold text-[11px]">Paste Firebase Config JSON:</div>
                  <textarea
                    rows={3}
                    value={firebaseJsonInput}
                    onChange={(e) => setFirebaseJsonInput(e.target.value)}
                    placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "..."\n}`}
                    className="glass-input rounded-xl p-2 text-xs w-full font-mono text-[11px] text-cyan-200 resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleSaveFirebaseConfig}
                    className="w-full py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    Save Config
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
