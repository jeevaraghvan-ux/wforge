import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Image as ImageIcon, 
  Type, 
  CreditCard, 
  Users, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Upload,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const VaultModal = () => {
  const { 
    isVaultLocked, 
    setIsVaultLocked, 
    verifyAdminPassword,
    homeTitle,
    setHomeTitle,
    vaultBackground,
    setVaultBackground,
    creditBanks,
    rankings,
    orders,
    removeOrder,
    listings,
    removeReviewFromListing,
    setActiveTab
  } = useStore();

  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [newTitleInput, setNewTitleInput] = useState(homeTitle);
  const [titleSavedNotification, setTitleSavedNotification] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Handle Vault Unlock
  const handleUnlock = (e) => {
    e.preventDefault();
    if (verifyAdminPassword(enteredPasscode)) {
      setIsVaultLocked(false);
      setPasscodeError('');
      setEnteredPasscode('');
    } else {
      setPasscodeError('Invalid Vault Access Key. Please enter the authorized password.');
    }
  };

  // Lock and Close Vault
  const handleLockAndExit = () => {
    setIsVaultLocked(true);
    setActiveTab('home');
  };

  // Image Inserter: Handle Local File Upload
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVaultBackground(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Home Title
  const handleSaveHomeTitle = (e) => {
    e.preventDefault();
    if (newTitleInput.trim()) {
      setHomeTitle(newTitleInput.trim());
      setTitleSavedNotification(true);
      setTimeout(() => setTitleSavedNotification(false), 3000);
    }
  };

  // Total credits across all maker rankings
  const totalRankedCredits = rankings.reduce((acc, r) => acc + (r.credits || 0), 0);

  return (
    <div className="py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Vault Container with Cool Texture */}
      <div 
        className="rounded-3xl border border-purple-500/30 p-6 sm:p-10 relative overflow-hidden shadow-2xl transition-all"
        style={{
          background: vaultBackground 
            ? `linear-gradient(rgba(10, 15, 30, 0.88), rgba(5, 7, 15, 0.94)), url(${vaultBackground}) center/cover no-repeat`
            : `radial-gradient(ellipse at 20% 20%, rgba(168, 85, 247, 0.2), transparent 70%),
               radial-gradient(ellipse at 80% 80%, rgba(56, 189, 248, 0.15), transparent 70%),
               linear-gradient(135deg, rgba(20, 25, 45, 0.95) 0%, rgba(8, 12, 22, 0.98) 100%)`,
          backdropFilter: 'blur(30px)'
        }}
      >
        {/* Cool Carbon & Hex Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#a855f7 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        ></div>

        {/* Top Header & Lock Status */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isVaultLocked ? 'bg-rose-500/20 text-rose-400 border border-rose-400/30' : 'bg-purple-500/20 text-purple-300 border border-purple-400/40'} shadow-lg`}>
              {isVaultLocked ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6 animate-pulse" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
                  W Forge Vault
                </h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${isVaultLocked ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'}`}>
                  {isVaultLocked ? 'Locked' : 'Unlocked (Maker Mode)'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Cool textured terminal with credit banks, rankings, background styling, and order controls.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isVaultLocked && (
              <button
                onClick={handleLockAndExit}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Vault</span>
              </button>
            )}
            <button
              onClick={() => {
                setIsVaultLocked(true); // "When you close it, it locks"
                setActiveTab('home');
              }}
              className="p-2 rounded-xl liquid-glass border border-white/20 text-slate-300 hover:text-white"
              title="Close Vault"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOCKED STATE VIEW */}
        {isVaultLocked ? (
          <div className="relative z-10 py-12 max-w-md mx-auto text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-glass-glow">
              <Lock className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-white">Vault is Locked</h2>
              <p className="text-xs text-slate-300">
                Please enter the authorized Vault Password to open the control deck.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                required
                value={enteredPasscode}
                onChange={(e) => setEnteredPasscode(e.target.value)}
                placeholder="Enter Vault Password..."
                className="w-full glass-input text-center rounded-2xl py-3 px-4 text-base tracking-widest text-cyan-200 border-purple-400/40"
              />

              {passcodeError && (
                <div className="text-xs text-rose-400 flex items-center justify-center gap-1.5 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{passcodeError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl glass-btn-primary text-white font-bold text-sm shadow-glass-glow flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Vault</span>
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED VAULT DASHBOARD */
          <div className="relative z-10 pt-6 space-y-8">
            
            {/* Top Stat Row: Credit Amount & Ranking from Admin Vault */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Total Credit Pool */}
              <div className="liquid-glass p-5 rounded-2xl border border-cyan-400/30">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-cyan-400" /> Total Ranked Credits
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                    Live
                  </span>
                </div>
                <div className="text-3xl font-black font-display text-white">
                  {totalRankedCredits} <span className="text-sm font-normal text-cyan-300">Credits</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Accumulated maker credits assigned across all student rankings.
                </p>
              </div>

              {/* Top Ranked Maker */}
              <div className="liquid-glass p-5 rounded-2xl border border-purple-400/30">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-400" /> Top Ranked Maker
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                    Rank #1
                  </span>
                </div>
                <div className="text-xl font-bold font-display text-white truncate">
                  {rankings.length > 0 ? rankings[0].name : 'No rankings yet'}
                </div>
                <p className="text-[11px] text-purple-300 font-semibold mt-1">
                  {rankings.length > 0 ? `${rankings[0].credits} Credits to the right of name` : ''}
                </p>
              </div>

              {/* Credit Banks Overview */}
              <div className="liquid-glass p-5 rounded-2xl border border-amber-400/30">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" /> Active Credit Banks
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                    {creditBanks.length} Banks
                  </span>
                </div>
                <div className="text-3xl font-black font-display text-white">
                  ${creditBanks.reduce((sum, b) => sum + (b.balance || 0), 0)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Combined balance across classroom funds.
                </p>
              </div>

            </div>

            {/* Section 1: Change Home Page "W Forge" Text */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex items-center gap-2 text-cyan-300">
                <Type className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold font-display text-white">
                  Change Home Page Branding ("W Forge")
                </h2>
              </div>
              <p className="text-xs text-slate-300">
                Update the official name displayed on the top navbar and hero header of the home page.
              </p>

              <form onSubmit={handleSaveHomeTitle} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  value={newTitleInput}
                  onChange={(e) => setNewTitleInput(e.target.value)}
                  placeholder="e.g. W Forge, 5th Grade Maker Forge..."
                  className="glass-input rounded-xl px-4 py-2.5 text-sm flex-1"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl glass-btn-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Home Text</span>
                </button>
              </form>

              {titleSavedNotification && (
                <div className="text-xs text-emerald-300 flex items-center gap-1 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Home page title updated to "{homeTitle}" successfully!</span>
                </div>
              )}
            </div>

            {/* Section 2: Vault Background Image Inserter */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-bold font-display text-white">
                    Vault Background Inserter
                  </h2>
                </div>
                {vaultBackground && (
                  <button
                    onClick={() => setVaultBackground('')}
                    className="text-xs text-rose-400 hover:text-rose-300 underline"
                  >
                    Reset to Default Texture
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-300">
                Customize the Vault's backdrop texture by uploading an image from your device or selecting a cool 3D print mesh preset.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Upload Image File */}
                <div className="liquid-glass p-4 rounded-xl border border-dashed border-white/20 text-center space-y-2 hover:border-purple-400/50 transition-colors">
                  <Upload className="w-7 h-7 text-purple-400 mx-auto" />
                  <div className="text-xs font-semibold text-white">Upload Custom Background</div>
                  <label className="inline-block px-4 py-1.5 rounded-xl glass-btn-primary text-white text-xs font-bold cursor-pointer">
                    <span>Choose Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                  <div className="text-[10px] text-slate-400">PNG, JPG, WebP supported</div>
                </div>

                {/* Preset Textures */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">Or Select a Texture Preset:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setVaultBackground('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80')}
                      className="p-2 rounded-xl bg-slate-900/60 border border-white/10 hover:border-purple-400 text-left text-xs font-medium text-slate-200 transition-colors"
                    >
                      🌌 Deep Neon Glass
                    </button>
                    <button
                      onClick={() => setVaultBackground('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80')}
                      className="p-2 rounded-xl bg-slate-900/60 border border-white/10 hover:border-purple-400 text-left text-xs font-medium text-slate-200 transition-colors"
                    >
                      ⚡ Cyber Metallic
                    </button>
                    <button
                      onClick={() => setVaultBackground('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80')}
                      className="p-2 rounded-xl bg-slate-900/60 border border-white/10 hover:border-purple-400 text-left text-xs font-medium text-slate-200 transition-colors"
                    >
                      🎨 Liquid Rainbow
                    </button>
                    <button
                      onClick={() => setVaultBackground('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80')}
                      className="p-2 rounded-xl bg-slate-900/60 border border-white/10 hover:border-purple-400 text-left text-xs font-medium text-slate-200 transition-colors"
                    >
                      🖨️ Tech Microchip
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Check Credit Banks (see requirement: "Also can check credit banks") */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold font-display text-white">
                    Check Credit Banks
                  </h2>
                </div>
                <span className="text-xs text-amber-300 font-semibold">
                  Classroom Accounts
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {creditBanks.map((bank) => (
                  <div key={bank.id} className="p-4 rounded-xl liquid-glass border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{bank.name}</span>
                      <span className="text-xs font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10">
                        {bank.id}
                      </span>
                    </div>
                    <div className="text-2xl font-black font-display text-emerald-400">
                      ${bank.balance.toFixed(2)}
                    </div>
                    <p className="text-[11px] text-slate-400">{bank.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Rankings Display (configured in Admin Vault, with credits to right of name) */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-bold font-display text-white">
                    Maker Rankings & Credits
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  Configured via drag & drop in Admin Vault
                </span>
              </div>

              <div className="space-y-2">
                {rankings.map((person, idx) => (
                  <div
                    key={person.id}
                    className="p-3 rounded-xl liquid-glass border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/10 font-bold text-xs flex items-center justify-center text-white">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{person.name}</div>
                        <div className="text-[11px] text-slate-400">{person.email} • {person.badge}</div>
                      </div>
                    </div>

                    {/* Requirement: credits to the right of their name */}
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold font-mono">
                        {person.credits} Credits
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Remove & Change Orders */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-300">
                  <Edit3 className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-bold font-display text-white">
                    Manage & Remove Orders
                  </h2>
                </div>
                <span className="text-xs text-slate-400">{orders.length} Total Orders</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{order.itemTitle}</span>
                        <span className="font-mono text-[10px] text-cyan-300">{order.id}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-slate-300 text-[11px]">
                        <span>Buyer: <strong className="text-white">{order.userName}</strong> ({order.userEmail})</span>
                        {order.pointsUsed > 0 ? (
                          <span className="flex items-center gap-1.5">
                            <span className="text-slate-400 line-through">${(order.originalPrice || order.totalPrice).toFixed(2)}</span>
                            <span className="text-amber-300 font-semibold font-mono">(-{order.pointsUsed} pts)</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30 font-mono">
                              Final to Pay: ${(order.finalPrice ?? order.totalPrice).toFixed(2)}
                            </span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-400/30 font-mono">
                            Final to Pay: ${(order.finalPrice ?? order.totalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeOrder(order.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Remove Reviews */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex items-center gap-2 text-rose-300">
                <Trash2 className="w-5 h-5 text-rose-400" />
                <h2 className="text-lg font-bold font-display text-white">
                  Remove Reviews (Moderation)
                </h2>
              </div>
              <p className="text-xs text-slate-300">
                Inspect customer ratings and purge spam or inappropriate reviews across all listings.
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {listings.flatMap(p => (p.reviews || []).map(r => ({ ...r, productId: p.id, productTitle: p.title }))).length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No reviews submitted yet.</div>
                ) : (
                  listings.flatMap(p => (p.reviews || []).map(r => ({ ...r, productId: p.id, productTitle: p.title }))).map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">
                          {rev.author} on <span className="text-cyan-300 font-bold">{rev.productTitle}</span>
                        </div>
                        <div className="text-slate-400 text-[11px] italic mt-0.5">
                          "{rev.comment}" ({rev.rating} ★)
                        </div>
                      </div>

                      <button
                        onClick={() => removeReviewFromListing(rev.productId, rev.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-400/30 flex items-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
