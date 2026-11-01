import React from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Star,
  Zap,
  Lock,
  User
} from 'lucide-react';

export const HomeHero = () => {
  const { homeTitle, setActiveTab, listings, handlePreorder, currentUser } = useStore();

  const featuredProducts = listings.slice(0, 3);

  return (
    <div className="relative overflow-hidden py-8 sm:py-14 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Background ambient lighting orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float"></div>
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        
        {/* School-Friendly Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-semibold shadow-glass-glow animate-float">
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Official 5th Grade Student 3D Printing Business</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span className="text-slate-300">Non-Toxic PLA Filaments</span>
        </div>

        {/* Dynamic Title with Glowing Logo */}
        <div className="flex flex-col items-center justify-center gap-4">
          <Logo size="xl" className="scale-110 mb-2" />
          <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tight text-white">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
              {homeTitle}
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
            High-precision 3D printed fidgets, desk dragons, seasonal specials, and custom backpack tags designed and crafted by 5th grade makers!
          </p>
        </div>

        {/* Quick Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActiveTab('listings')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl glass-btn-primary text-white font-bold text-base shadow-glass group"
          >
            <ShoppingBag className="w-5 h-5 text-cyan-200 group-hover:scale-110 transition-transform" />
            <span>Explore Listings</span>
            <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl liquid-glass border border-amber-400/40 text-amber-300 hover:text-white hover:bg-amber-500/10 font-bold text-base transition-all shadow-glass"
          >
            <Award className="w-5 h-5 text-amber-400" />
            <span>Earn Reward Points (+1 pt = 1¢ off)</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl liquid-glass border border-purple-400/40 text-purple-300 hover:text-white hover:bg-purple-500/10 font-bold text-base transition-all shadow-glass"
          >
            <Lock className="w-5 h-5 text-purple-400" />
            <span>Open Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl liquid-glass border border-cyan-400/40 text-cyan-300 hover:text-white hover:bg-cyan-500/10 font-bold text-base transition-all shadow-glass"
          >
            <User className="w-5 h-5 text-cyan-400" />
            <span>{currentUser ? 'My Account' : 'Sign In with Google'}</span>
          </button>
        </div>

        {/* 3D Printer Live Telemetry / Lab Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto">
          <div className="liquid-glass p-3.5 rounded-xl border border-white/10 text-center">
            <div className="flex items-center justify-center gap-1.5 text-cyan-400 text-xs font-semibold mb-1">
              <Cpu className="w-3.5 h-3.5" /> Nozzle Temp
            </div>
            <div className="text-xl font-bold font-display text-white">215°C <span className="text-xs text-emerald-400 font-normal">Active</span></div>
          </div>
          <div className="liquid-glass p-3.5 rounded-xl border border-white/10 text-center">
            <div className="flex items-center justify-center gap-1.5 text-blue-400 text-xs font-semibold mb-1">
              <Layers className="w-3.5 h-3.5" /> Layer Height
            </div>
            <div className="text-xl font-bold font-display text-white">0.16mm <span className="text-xs text-cyan-400 font-normal">Fine</span></div>
          </div>
          <div className="liquid-glass p-3.5 rounded-xl border border-white/10 text-center">
            <div className="flex items-center justify-center gap-1.5 text-purple-400 text-xs font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" /> Turnaround
            </div>
            <div className="text-xl font-bold font-display text-white">24-48 hrs <span className="text-xs text-purple-300 font-normal">Fast</span></div>
          </div>
          <div className="liquid-glass p-3.5 rounded-xl border border-white/10 text-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
              <Zap className="w-3.5 h-3.5" /> Delivery Bonus
            </div>
            <div className="text-xl font-bold font-display text-white">+30 Pts <span className="text-xs text-amber-300 font-normal">per order</span></div>
          </div>
        </div>

      </div>

      {/* Featured 3D Creations Showcase */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-400" />
              Hot Off the Print Bed
            </h2>
            <p className="text-sm text-slate-400">Popular student models crafted with precision</p>
          </div>
          <button
            onClick={() => setActiveTab('listings')}
            className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            View All ({listings.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="liquid-glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/15"
            >
              {/* Product Image preview */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {product.isSeasonal && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/80 text-amber-100 backdrop-blur-md border border-amber-300/40 shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Seasonal
                    </span>
                  )}
                  {!product.inStock ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600/80 text-white backdrop-blur-md border border-rose-400/40 shadow-sm">
                      Out of Stock
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/80 text-white backdrop-blur-md border border-emerald-300/40 shadow-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready to Print
                    </span>
                  )}
                </div>

                {/* Price pill */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl liquid-glass border border-white/25 text-white font-display font-bold text-sm shadow-md">
                  ${product.price.toFixed(2)}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{product.material || 'School-Safe PLA'}</span>
                    <div className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{product.rating || '5.0'}</span>
                      <span className="text-slate-500">({product.reviews ? product.reviews.length : 0})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="text-xs text-cyan-300 font-medium">
                    Credit cost: <span className="font-bold text-white">{product.creditCost || Math.round(product.price * 10)}</span> credits
                  </div>

                  <button
                    onClick={() => handlePreorder(product)}
                    disabled={!product.inStock}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      product.inStock
                        ? 'glass-btn-primary text-white shadow-sm hover:scale-105'
                        : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    <span>Preorder</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Pillars: Liquid Glass Card Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div 
          onClick={() => setActiveTab('rewards')}
          className="liquid-glass-card p-6 rounded-2xl border border-white/10 cursor-pointer group hover:border-amber-400/40"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/30 group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-white group-hover:text-amber-300 transition-colors">
            Reward Points Program
          </h3>
          <p className="text-sm text-slate-300 mt-2">
            Every +1 point = 1 cent off your future print! Plus get a bonus +30 reward points automatically when your print is delivered.
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('vault')}
          className="liquid-glass-card p-6 rounded-2xl border border-white/10 cursor-pointer group hover:border-purple-400/40"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 border border-purple-400/30 group-hover:scale-110 transition-transform">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-white group-hover:text-purple-300 transition-colors">
            Secure Maker Vault
          </h3>
          <p className="text-sm text-slate-300 mt-2">
            Inspect classroom credit banks, view maker rankings, customize the background texture, and manage orders with auto-lock security.
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('listings')}
          className="liquid-glass-card p-6 rounded-2xl border border-white/10 cursor-pointer group hover:border-cyan-400/40"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-400/30 group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
            5th Grade Maker Lab
          </h3>
          <p className="text-sm text-slate-300 mt-2">
            Explore 3D prints crafted with school-safe non-toxic PLA, ultra-smooth 0.16mm layers, and fast homeroom delivery in 24-48 hours.
          </p>
        </div>
      </div>

    </div>
  );
};
