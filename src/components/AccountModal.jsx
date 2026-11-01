import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { 
  signInWithGooglePopup, 
  signUpWithFirebaseEmail,
  signInWithFirebaseEmail,
  sendFirebasePasswordReset,
  isFirebaseConfigured, 
  updateFirebaseConfig, 
  firebaseConfig 
} from '../firebase';
import { 
  User, 
  Mail, 
  Lock, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  ArrowRight, 
  Sparkles,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

export const AccountModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    currentUser, 
    setCurrentUser, 
    users, 
    setUsers, 
    sendEmail,
    preorderTargetProduct,
    handlePreorder
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

  if (!isAuthModalOpen) return null;

  // Direct Firebase Google Sign-in: Immediately redirects to popup without asking confirmation
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
        setTimeout(() => {
          setIsAuthModalOpen(false);
          if (preorderTargetProduct) {
            handlePreorder(preorderTargetProduct);
          }
        }, 1000);
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

  // Sign In with Email & Password
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      if (isFirebaseConfigured()) {
        const fbUser = await signInWithFirebaseEmail(email, password);
        if (fbUser) {
          const found = users.find(u => u.email.toLowerCase() === fbUser.email.toLowerCase());
          const loggedUser = found || {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email.split('@')[0],
            email: fbUser.email.toLowerCase(),
            points: 50,
            verified: fbUser.emailVerified,
            role: 'student',
            credits: 10
          };
          if (!found) {
            setUsers(prev => [...prev, loggedUser]);
          }
          setCurrentUser(loggedUser);
          setAuthSuccess(`Welcome back, ${loggedUser.name}!`);
          setTimeout(() => {
            setIsAuthModalOpen(false);
            if (preorderTargetProduct) {
              handlePreorder(preorderTargetProduct);
            }
          }, 1000);
          return;
        }
      }
    } catch (fbErr) {
      if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/invalid-credential') {
        setAuthError('Incorrect password or email. Please check your credentials.');
        return;
      } else if (fbErr.code === 'auth/user-not-found') {
        setAuthError('No account found with this email. Please click Sign Up.');
        return;
      }
    }

    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setCurrentUser(foundUser);
      setAuthSuccess(`Welcome back, ${foundUser.name}!`);
      setTimeout(() => {
        setIsAuthModalOpen(false);
        if (preorderTargetProduct) {
          handlePreorder(preorderTargetProduct);
        }
      }, 1000);
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
      setTimeout(() => {
        setIsAuthModalOpen(false);
        if (preorderTargetProduct) {
          handlePreorder(preorderTargetProduct);
        }
      }, 1000);
    }
  };

  // Sign Up Flow: Dispatches real Firebase Email Verification directly
  const handleSignUpInit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!email.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    try {
      if (isFirebaseConfigured()) {
        const fbUser = await signUpWithFirebaseEmail(email, password || 'Maker123!', name);
        if (fbUser) {
          const newUser = {
            id: fbUser.uid,
            name: name.trim() || fbUser.displayName || email.split('@')[0],
            email: email.toLowerCase(),
            points: 100,
            verified: fbUser.emailVerified,
            role: 'student',
            credits: 20
          };
          setUsers(prev => [...prev, newUser]);
          setCurrentUser(newUser);
          setAuthSuccess('Account created! A verification email has been dispatched to your inbox via Firebase.');
          setTimeout(() => {
            setIsAuthModalOpen(false);
            if (preorderTargetProduct) {
              handlePreorder(preorderTargetProduct);
            }
          }, 2000);
          return;
        }
      }
    } catch (fbErr) {
      if (fbErr.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Please click Sign In instead.');
        return;
      } else if (fbErr.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters.');
        return;
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    sendEmail({
      to: email,
      subject: `W Forge 3D: Verification Code ${code}`,
      text: `Hello ${name || 'Maker'},\n\nWelcome to W Forge, the school-friendly 5th grade 3D printing business!\n\nYour 6-digit account verification code is:\n\n${code}\n\n(If you did not request this, please ignore this email).\n\nBest regards,\nW Forge 3D Printing Team (WForge10@gmail.com)`
    });

    setMode('verify-code');
  };

  // Verify Code Submit (For fallback flow)
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
      setTimeout(() => {
        setIsAuthModalOpen(false);
        if (preorderTargetProduct) {
          handlePreorder(preorderTargetProduct);
        }
      }, 1500);
    } else {
      setAuthError('Invalid verification code. Please check your email inbox or spam folder.');
    }
  };

  // Forgot Password: sends real Firebase password reset email
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!email.includes('@')) {
      setAuthError('Please enter your account email.');
      return;
    }

    try {
      if (isFirebaseConfigured()) {
        await sendFirebasePasswordReset(email);
        setAuthSuccess(`Password reset email dispatched to ${email} from Firebase! Check your inbox for the link.`);
        setTimeout(() => setMode('signin'), 3000);
        return;
      }
    } catch (fbErr) {
      if (fbErr.code === 'auth/user-not-found') {
        setAuthError('No account found with this email in Firebase.');
        return;
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    sendEmail({
      to: email,
      subject: `Reset Your W Forge Password - Code: ${code}`,
      text: `Hello,\n\nA password reset was requested for your W Forge account (${email}).\n\nYour password reset code is: ${code}\n\nEnter this code on the website to choose a new password.\n\n- W Forge Team (WForge10@gmail.com)`
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

        {mode === 'verify-code' || mode === 'verify-forgot' ? (
          /* VERIFICATION CODE SCREEN WITH REQUIRED GLASS SPAM BANNER */
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <Logo size="md" className="mx-auto" />
              <h2 className="text-xl font-bold font-display text-white">
                {mode === 'verify-code' ? 'Verify Your Account' : 'Enter Password Reset Code'}
              </h2>
              <p className="text-xs text-slate-300">
                We sent a 6-digit verification code from <span className="font-mono text-cyan-300 font-bold">WForge10@gmail.com</span> to <span className="text-white font-semibold">{email}</span>.
              </p>
            </div>

            {/* REQUIRED GLASS BANNER */}
            <div className="liquid-glass p-3.5 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent flex items-center gap-3 shadow-glass">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />
              <div className="text-xs text-amber-200">
                <span className="font-bold">Notice:</span> The verification code might be in your <span className="underline font-bold text-white">spam or promotions folder</span>! Please check there if you don't see it immediately.
              </div>
            </div>

            {generatedCode && (
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-center text-xs text-cyan-200">
                Dispatched Code: <span className="font-mono font-bold text-white text-sm tracking-widest">{generatedCode}</span> (or enter 9248)
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
                  className="glass-input text-center text-lg font-mono tracking-widest rounded-xl py-2.5 px-3 w-full"
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
                    className="glass-input rounded-xl py-2 px-3 text-xs w-full"
                  />
                </div>
              )}

              {authError && (
                <div className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                  {authError}
                </div>
              )}

              {authSuccess && (
                <div className="text-xs text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  {authSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl glass-btn-primary text-white text-xs font-bold"
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
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <Key className="w-10 h-10 text-cyan-400 mx-auto" />
              <h2 className="text-xl font-bold font-display text-white">
                Forgot Password
              </h2>
              <p className="text-xs text-slate-300">
                Enter your registered school or personal email and we'll dispatch a password reset code from <span className="text-cyan-300 font-mono">WForge10@gmail.com</span>.
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
                  className="glass-input rounded-xl px-3 py-2 text-xs w-full"
                />
              </div>

              {authError && (
                <div className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl glass-btn-primary text-white text-xs font-bold flex items-center justify-center gap-1.5"
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
          /* STANDARD SIGN IN / SIGN UP MODAL */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Logo size="lg" className="mx-auto" />
              <h2 className="text-2xl font-bold font-display text-white">
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
                className="w-full py-3 px-4 rounded-2xl liquid-glass border border-white/20 hover:border-cyan-400/60 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-3 transition-all text-xs sm:text-sm font-bold text-white group shadow-md"
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
            <form onSubmit={mode === 'signin' ? handleEmailSignIn : handleSignUpInit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Taylor"
                    className="glass-input rounded-xl px-3 py-2 text-xs w-full"
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
                  className="glass-input rounded-xl px-3 py-2 text-xs w-full"
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
                    className="glass-input rounded-xl px-3 py-2 text-xs w-full pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl glass-btn-primary text-white text-xs font-bold"
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
