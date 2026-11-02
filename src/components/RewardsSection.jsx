import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Award, 
  Sparkles, 
  Zap, 
  Gift, 
  CheckCircle2, 
  Coins, 
  ArrowRight, 
  Mail, 
  Calculator,
  User,
  ShieldAlert,
  ShoppingBag,
  Info
} from 'lucide-react';

export const RewardsSection = () => {
  const { currentUser, setIsAuthModalOpen, setActiveTab, sentEmails } = useStore();

  const userPoints = currentUser ? (currentUser.points || 0) : 0;
  const [pointsToRedeemPreview, setPointsToRedeemPreview] = useState(userPoints);

  // Sync preview with current points if points changed
  React.useEffect(() => {
    setPointsToRedeemPreview(userPoints);
  }, [userPoints]);

  const discountInDollars = (userPoints * 0.01).toFixed(2);
  const previewDiscount = (pointsToRedeemPreview * 0.01).toFixed(2);

  // Filter reward emails
  const userEmails = currentUser 
    ? sentEmails.filter(e => e.to.toLowerCase() === currentUser.email.toLowerCase())
    : sentEmails;

  return (
    <div className="py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Rewards Hero Banner */}
      <div className="liquid-glass-vault p-6 sm:p-10 rounded-3xl border border-amber-400/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass border border-amber-400/50 text-amber-300 text-xs font-bold shadow-sm">
              <Gift className="w-3.5 h-3.5" />
              <span>Official W Forge Student Perks</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
              3D Print Rewards Program
            </h1>

            {/* Crucial requirement banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-yellow-500/20 border border-amber-400/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/30 text-amber-300 flex items-center justify-center font-bold text-lg">
                  1¢
                </div>
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-amber-200">
                    +1 point = a cent off your future print
                  </div>
                  <div className="text-xs text-slate-300">
                    Points are strictly earned through orders & admin awards. Every point gives you 1¢ ($0.01) off your 3D preorders!
                  </div>
                </div>
              </div>
            </div>

            {/* Requirement note: Users cannot add points themselves */}
            <div className="flex items-start gap-2 p-3 rounded-xl liquid-glass border border-white/10 text-xs text-slate-300">
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Points Policy:</strong> Users cannot manually add points to their own account. Points are automatically awarded upon print delivery (+30 pts) or dispatched by lab admins in the Admin Vault.
              </span>
            </div>
          </div>

          {/* User Points Card */}
          <div className="liquid-glass p-6 rounded-2xl border border-white/20 min-w-[280px] w-full lg:w-auto shadow-glass text-center space-y-3">
            <div className="text-xs text-slate-300 font-medium">
              {currentUser ? `Signed in as ${currentUser.name}` : 'Your Account Balance'}
            </div>
            
            <div className="flex items-center justify-center gap-2 text-4xl sm:text-5xl font-display font-black text-amber-300 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              <Award className="w-9 h-9 text-amber-400" />
              <span>{userPoints}</span>
            </div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Your Available Reward Points
            </div>

            <div className="pt-3 border-t border-white/10 text-sm font-semibold text-emerald-400">
              Worth <span className="font-extrabold text-white text-base">${discountInDollars}</span> off your next print!
            </div>

            {!currentUser ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full mt-2 py-2 px-3 rounded-xl glass-btn-primary text-white text-xs font-bold"
              >
                Sign In to View & Redeem Points
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('listings')}
                className="w-full mt-2 py-2 px-3 rounded-xl glass-btn-primary text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Redeem Points on Preorder</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rewards Calculator (Bounded to Points You Actually Have) & How to Earn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Points Redemption Breakdown */}
        <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
          <div className="flex items-center gap-2 text-cyan-300">
            <Calculator className="w-5 h-5" />
            <h2 className="text-lg font-display font-bold text-white">Your Points Redemption Calculator</h2>
          </div>
          <p className="text-xs text-slate-300">
            You can only redeem points based on the points you actually have. See the exact savings you can apply right now:
          </p>

          {userPoints > 0 ? (
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Points to Redeem:</span>
                  <span className="font-bold text-amber-400 font-mono text-sm">{pointsToRedeemPreview} pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={userPoints}
                  step="1"
                  value={pointsToRedeemPreview}
                  onChange={(e) => setPointsToRedeemPreview(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>0 pts ($0.00)</span>
                  <span>Max you have: {userPoints} pts (${discountInDollars})</span>
                </div>
              </div>

              <div className="p-4 rounded-xl liquid-glass border border-cyan-400/30 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Discount on your future print:</div>
                  <div className="text-2xl font-black font-display text-white">
                    ${previewDiscount} <span className="text-xs text-cyan-400 font-normal">USD off</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('listings')}
                  className="px-4 py-2 rounded-xl glass-btn-primary text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Use on a Model</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-white/5 border border-white/5 text-center space-y-3">
              <Coins className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-xs text-slate-300">
                You have <strong>0 reward points</strong> right now. Place a preorder from our catalog, and when it is marked <strong>Delivered</strong>, you will automatically get <strong>+30 reward points</strong>!
              </div>
              <button
                onClick={() => setActiveTab('listings')}
                className="px-4 py-2 rounded-xl glass-btn-primary text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <span>Browse Listings & Preorder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* How to Earn Points (Authorized Methods Only) */}
        <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
          <div className="flex items-center gap-2 text-amber-300">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-display font-bold text-white">How Points are Earned</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                +30
              </div>
              <div>
                <div className="font-bold text-white">Automatic Delivery Reward</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Whenever an order status is set to "Delivered", +30 points are automatically credited to your account and an email receipt is dispatched!
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 font-bold font-mono">
                +20
              </div>
              <div>
                <div className="font-bold text-white">Bot Secret Codes</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Discover special maker codes in our interactive chatbot!
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold font-mono">
                Admin
              </div>
              <div>
                <div className="font-bold text-white">Classroom Teacher / Admin Awards</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Teachers and lab leads can grant bonus points directly in the Admin Vault for helpful students and model design contributions.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Outgoing Email Receipt Activity (Resend / WForge10@gmail.com) */}
      <div className="liquid-glass p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Mail className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-lg">
              Reward Notification Logs (Resend / WForge10@gmail.com)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {userEmails.length} Email(s) Logged
          </span>
        </div>

        {userEmails.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-white/10 rounded-xl">
            No reward emails logged yet. When an order is marked as delivered, the notification from <code className="text-cyan-300">WForge10@gmail.com</code> with +30 reward points will appear here!
          </div>
        ) : (
          <div className="space-y-2">
            {userEmails.map((email) => (
              <div key={email.id} className="p-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-bold text-cyan-300">{email.subject}</span>
                  <span className="text-[11px] text-slate-500">{new Date(email.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  From: <span className="text-white font-mono">{email.from}</span> → To: <span className="text-white font-mono">{email.to}</span>
                </div>
                <div className="text-slate-300 text-[11px] whitespace-pre-line bg-black/30 p-2 rounded border border-white/5 font-mono">
                  {email.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
