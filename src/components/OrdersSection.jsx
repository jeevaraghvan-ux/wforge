import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  Sparkles, 
  Truck, 
  User,
  Mail,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrdersSection = () => {
  const { 
    orders, 
    currentUser, 
    removeOrder, 
    updateOrderStatus, 
    markOrderDelivered, 
    setActiveTab, 
    setIsAuthModalOpen 
  } = useStore();

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editNotes, setEditNotes] = useState('');

  // Filter orders for current user or all if admin
  const userOrders = currentUser 
    ? orders.filter(o => o.userEmail.toLowerCase() === currentUser.email.toLowerCase())
    : orders;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleDeliverClick = (orderId) => {
    markOrderDelivered(orderId);
    triggerCelebration();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Queue':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> In Queue
          </span>
        );
      case 'Printing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1.5 shadow-glass-glow animate-pulse">
            <Layers className="w-3.5 h-3.5" /> Printing (Layer by Layer)
          </span>
        );
      case 'Ready for Pickup':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Ready for Pickup
          </span>
        );
      case 'Delivered':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered (+30 Pts Sent)
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner showing order tracking overview */}
      <div className="liquid-glass p-6 sm:p-8 rounded-3xl border border-cyan-400/30 shadow-glass-glow relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="w-7 h-7 text-cyan-400" />
              <h1 className="text-3xl font-display font-extrabold text-white">
                Live 3D Print Orders & Tracking
              </h1>
            </div>
            <p className="text-sm text-slate-300 max-w-xl">
              Track the live status of your 3D models right off the heated glass print bed. Delivery automatically awards <span className="text-amber-300 font-bold">+30 Reward Points</span>!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="liquid-glass px-4 py-2.5 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-slate-400">Total In Lab</div>
              <div className="text-xl font-bold font-display text-cyan-300">{orders.length}</div>
            </div>
            <div className="liquid-glass px-4 py-2.5 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-slate-400">Delivered</div>
              <div className="text-xl font-bold font-display text-emerald-400">
                {orders.filter(o => o.status === 'Delivered').length}
              </div>
            </div>
          </div>
        </div>

        {/* Live Status Tracker Bar at top as required */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
            <div className="text-xs text-slate-400">1. In Queue</div>
            <div className="font-bold text-amber-300 text-sm mt-0.5">Slicing & G-Code</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
            <div className="text-xs text-slate-400">2. Printing</div>
            <div className="font-bold text-cyan-300 text-sm mt-0.5">215°C Extrusion</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
            <div className="text-xs text-slate-400">3. Ready for Pickup</div>
            <div className="font-bold text-purple-300 text-sm mt-0.5">Room 5B Makerspace</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
            <div className="text-xs text-slate-400">4. Delivered</div>
            <div className="font-bold text-emerald-300 text-sm mt-0.5">+30 Pts Dispatched</div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <span>{currentUser ? `Orders for ${currentUser.name}` : 'All Print Orders'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              {userOrders.length}
            </span>
          </h2>

          {!currentUser && (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Sign in to see only your orders →
            </button>
          )}
        </div>

        {userOrders.length === 0 ? (
          <div className="liquid-glass p-12 rounded-2xl text-center space-y-4 border border-white/10">
            <Package className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No active orders found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Check out our 3D listings and place a preorder to see your print progress here!
            </p>
            <button
              onClick={() => setActiveTab('listings')}
              className="px-6 py-2.5 rounded-xl glass-btn-primary text-white text-xs font-bold"
            >
              Browse Listings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="liquid-glass-card p-5 rounded-2xl border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
              >
                {/* Order Information */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/20">
                      {order.id}
                    </span>
                    <span className="text-xs text-slate-400">Ordered: {order.orderDate}</span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold font-display text-white">
                      {order.itemTitle}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                      Qty: {order.quantity}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {order.userName} ({order.userEmail})
                    </span>
                    {order.pointsUsed > 0 ? (
                      <span className="flex items-center gap-2">
                        <span className="text-slate-400 line-through">Base: ${(order.originalPrice || order.totalPrice).toFixed(2)}</span>
                        <span className="text-amber-300 font-semibold font-mono">(-{order.pointsUsed} pts)</span>
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30 font-mono text-xs">
                          Final Price to Pay: ${(order.finalPrice ?? order.totalPrice).toFixed(2)}
                        </span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-400/30 font-mono text-xs">
                        Final Price to Pay: ${(order.finalPrice ?? order.totalPrice).toFixed(2)}
                      </span>
                    )}
                    <span className="text-amber-300 flex items-center gap-1 font-semibold">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Earns +{order.pointsEarned || 30} pts on delivery
                    </span>
                  </div>

                  {/* Notes / Customization instructions */}
                  {order.notes && (
                    <div className="text-xs text-slate-400 italic bg-white/5 p-2 rounded-lg border border-white/5">
                      Notes: {order.notes}
                    </div>
                  )}

                  {/* Inline edit notes mode */}
                  {editingOrderId === order.id && (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Update color or pickup instructions..."
                        className="glass-input rounded-xl px-3 py-1.5 text-xs flex-1"
                      />
                      <button
                        onClick={() => {
                          order.notes = editNotes;
                          setEditingOrderId(null);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingOrderId(null)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 text-xs text-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="flex flex-wrap items-center gap-2 self-stretch md:self-center justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                  {/* Mark Delivered button (Triggers +30 points automatically and email notification) */}
                  {order.status !== 'Delivered' ? (
                    <button
                      onClick={() => handleDeliverClick(order.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 transition-all flex items-center gap-1.5 shadow-sm"
                      title="Mark as Delivered and send +30 reward points"
                    >
                      <Truck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Mark Delivered (+30 Pts)</span>
                    </button>
                  ) : (
                    <div className="text-xs text-emerald-400 font-semibold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Delivered & Rewarded
                    </div>
                  )}

                  {/* Change order notes */}
                  <button
                    onClick={() => {
                      setEditingOrderId(order.id);
                      setEditNotes(order.notes || '');
                    }}
                    className="p-2 rounded-xl liquid-glass border border-white/15 text-slate-300 hover:text-white hover:border-cyan-400/40 transition-all"
                    title="Change order instructions"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Remove order */}
                  <button
                    onClick={() => removeOrder(order.id)}
                    className="p-2 rounded-xl liquid-glass border border-white/15 text-slate-400 hover:text-rose-400 hover:border-rose-400/40 transition-all"
                    title="Remove order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
