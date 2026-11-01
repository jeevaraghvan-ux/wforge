import React from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { 
  ShoppingBag, 
  Package, 
  Award, 
  ShieldCheck, 
  Lock, 
  User, 
  MessageSquareCode,
  Sparkles,
  LogOut
} from 'lucide-react';

export const Navbar = () => {
  const { 
    homeTitle, 
    activeTab, 
    setActiveTab, 
    currentUser, 
    setCurrentUser,
    setIsAuthModalOpen, 
    setIsChatbotOpen,
    orders,
    listings
  } = useStore();

  const userActiveOrders = orders.filter(
    o => currentUser && o.userEmail.toLowerCase() === currentUser.email.toLowerCase() && o.status !== 'Delivered'
  ).length;

  return (
    <header className="sticky top-0 z-40 px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto liquid-glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between border border-white/15 shadow-glass backdrop-blur-2xl">
        
        {/* Brand & Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <Logo size="md" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent group-hover:from-cyan-200 group-hover:to-pink-300 transition-all duration-300">
                {homeTitle}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
                5th Grade 3D
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Student Maker Lab & Custom Prints
            </span>
          </div>
        </div>

        {/* Navigation items: listings, orders, rewards, vault, admin vault, account */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'listings'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-glass-glow'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span>Listings</span>
            <span className="text-xs px-1.5 py-0.2 rounded-md bg-white/10 text-slate-300">
              {listings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
              activeTab === 'orders'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-glass-glow'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Package className="w-4 h-4 text-blue-400" />
            <span>Orders</span>
            {userActiveOrders > 0 && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'rewards'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-glass-glow'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Rewards</span>
            {currentUser && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">
                {currentUser.points || 0} pts
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'vault'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Lock className="w-4 h-4 text-purple-400" />
            <span>Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'account'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-glass-glow'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <User className="w-4 h-4 text-cyan-400" />
            <span>Account</span>
          </button>
        </nav>

        {/* Right side actions: Chatbot + Account / Sign In */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Chatbot trigger */}
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-cyan-200 border border-cyan-400/30 hover:border-cyan-300 transition-all shadow-glass"
            title="Open W Forge 3D Bot"
          >
            <MessageSquareCode className="w-4 h-4 text-cyan-300" />
            <span className="hidden sm:inline">Bot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Account button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('account')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium liquid-glass border border-white/20 hover:border-cyan-400/40 text-slate-200 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">{currentUser.name}</span>
              </button>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setActiveTab('home');
                }}
                title="Sign Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold glass-btn-primary text-white shadow-glass-glow"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>
          )}

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-1">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="glass-input text-xs py-1.5 px-2 rounded-lg bg-slate-900/90 text-cyan-200 border-cyan-500/40"
            >
              <option value="home">Home</option>
              <option value="listings">Listings</option>
              <option value="orders">Orders</option>
              <option value="rewards">Rewards</option>
              <option value="vault">Vault</option>
              <option value="account">Account</option>
            </select>
          </div>
        </div>

      </div>
    </header>
  );
};
