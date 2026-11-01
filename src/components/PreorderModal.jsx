import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  X, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Tag, 
  Layers, 
  ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PreorderModal = () => {
  const { 
    preorderModalProduct, 
    setPreorderModalProduct, 
    currentUser, 
    createPreorderWithPoints 
  } = useStore();

  if (!preorderModalProduct || !currentUser) return null;

  const product = preorderModalProduct;
  const userPoints = currentUser.points || 0;
  // Maximum points you can redeem is up to the full item price (1 pt = 1 cent = $0.01)
  const maxPointsAllowed = Math.min(userPoints, Math.floor(product.price * 100));

  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discountAmount = Number((pointsToRedeem * 0.01).toFixed(2));
  const finalPrice = Math.max(0, Number((product.price - discountAmount).toFixed(2)));

  const handleConfirm = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    setTimeout(() => {
      createPreorderWithPoints({
        product,
        pointsToUse: pointsToRedeem,
        notes: orderNotes
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="liquid-glass rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-cyan-400/30 shadow-2xl relative overflow-hidden space-y-5">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                Customize & Preorder Print
              </h2>
              <p className="text-xs text-slate-300">
                School-friendly 3D print • Earn +30 reward points on delivery!
              </p>
            </div>
          </div>
          <button
            onClick={() => setPreorderModalProduct(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Card Overview */}
        <div className="p-4 rounded-2xl liquid-glass border border-white/10 flex items-center gap-4">
          <img
            src={product.image}
            alt={product.title}
            className="w-20 h-20 rounded-xl object-cover border border-white/15 shadow-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold font-display text-white text-base truncate">
                {product.title}
              </h3>
              <span className="text-sm font-extrabold text-cyan-300 font-mono">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {product.description}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
              <span className="flex items-center gap-1 text-cyan-300">
                <Layers className="w-3 h-3" /> {product.material || 'Non-toxic PLA'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {product.printTime || '1-2 hrs'}
              </span>
            </div>
          </div>
        </div>

        {/* Rewards Point Redemption Section */}
        <div className="liquid-glass-card p-4 rounded-2xl border border-amber-400/30 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Redeem Reward Points (+1 pt = 1¢ off)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 font-bold font-mono">
              Balance: {userPoints} pts
            </span>
          </div>

          {userPoints > 0 ? (
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Points to apply to this print:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {pointsToRedeem} pts (-${discountAmount.toFixed(2)})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPointsAllowed}
                  step="5"
                  value={pointsToRedeem}
                  onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0 pts ($0.00 off)</span>
                  <button
                    type="button"
                    onClick={() => setPointsToRedeem(maxPointsAllowed)}
                    className="text-amber-300 hover:underline font-semibold"
                  >
                    Max ({maxPointsAllowed} pts)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 bg-white/5 p-2.5 rounded-xl border border-white/5">
              You currently have <span className="font-bold text-white">0 reward points</span>. You will automatically receive <span className="text-amber-300 font-bold">+30 reward points</span> via email when this print is marked as Delivered!
            </div>
          )}
        </div>

        {/* Pricing Summary Breakdown with Final Price to Pay */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Base Model Price:</span>
            <span className="font-mono text-white">${product.price.toFixed(2)}</span>
          </div>
          {pointsToRedeem > 0 && (
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Points Discount ({pointsToRedeem} pts):</span>
              <span className="font-mono">-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm">
            <span className="font-bold text-white">Final Price to Pay:</span>
            <div className="text-right">
              <span className="text-xl font-black font-display text-emerald-400 font-mono">
                ${finalPrice.toFixed(2)}
              </span>
              <div className="text-[10px] text-slate-400">Cash on pickup in Room 5B</div>
            </div>
          </div>
        </div>

        {/* Customization notes */}
        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Customization & Notes (Optional)
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Favorite dual-color silk blend, homeroom number, or initials..."
              className="glass-input rounded-xl px-3.5 py-2 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPreorderModalProduct(null)}
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl glass-btn-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glass-glow disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Placing Preorder...' : `Confirm Preorder ($${finalPrice.toFixed(2)})`}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
