import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Key, 
  Plus, 
  Edit3, 
  Trash2, 
  GripVertical, 
  Upload, 
  CheckCircle2, 
  Truck, 
  Mail, 
  Bot, 
  Award, 
  CreditCard, 
  X, 
  Users, 
  ShoppingBag, 
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminVaultModal = () => {
  const { 
    isAdminVaultLocked, 
    setIsAdminVaultLocked,
    adminPasswords,
    updateAdminPassword,
    verifyAdminPassword,
    creditBanks,
    addCreditBank,
    updateCreditBankBalance,
    deleteCreditBank,
    rankings,
    setRankings,
    listings,
    addListing,
    updateListing,
    deleteListing,
    users,
    addRewardPointsToUser,
    orders,
    markOrderDelivered,
    botCustomCodes,
    addBotCode,
    removeBotCode,
    setActiveTab
  } = useStore();

  const [enteredPassword, setEnteredPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');

  // Password modification state
  const [pass1Input, setPass1Input] = useState(adminPasswords[0] || '9248');
  const [pass2Input, setPass2Input] = useState(adminPasswords[1] || 'WF0RG3-ADMIN');
  const [passSuccessMsg, setPassSuccessMsg] = useState('');

  // New Credit Bank state
  const [newBankName, setNewBankName] = useState('');
  const [newBankBalance, setNewBankBalance] = useState('');
  const [newBankDesc, setNewBankDesc] = useState('');

  // New Listing state (Photo Upload, Out of stock, seasonal)
  const [listingTitle, setListingTitle] = useState('');
  const [listingDesc, setListingDesc] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [listingCreditCost, setListingCreditCost] = useState('');
  const [listingImageBase64, setListingImageBase64] = useState('');
  const [listingIsSeasonal, setListingIsSeasonal] = useState(false);
  const [listingInStock, setListingInStock] = useState(true);
  const [listingMaterial, setListingMaterial] = useState('Non-Toxic Silk PLA');
  const [listingSuccessMsg, setListingSuccessMsg] = useState('');

  // Give reward points state
  const [targetUserEmail, setTargetUserEmail] = useState('');
  const [pointsToAward, setPointsToAward] = useState(30);
  const [pointsSuccessMsg, setPointsSuccessMsg] = useState('');

  // New person in ranking state
  const [newRankName, setNewRankName] = useState('');
  const [newRankCredits, setNewRankCredits] = useState('');
  const [newRankEmail, setNewRankEmail] = useState('');

  // Bot custom codes state
  const [newBotCode, setNewBotCode] = useState('');
  const [newBotCodeDesc, setNewBotCodeDesc] = useState('');
  const [newBotCodePoints, setNewBotCodePoints] = useState(25);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Handle Unlock
  const handleUnlock = (e) => {
    e.preventDefault();
    if (verifyAdminPassword(enteredPassword)) {
      setIsAdminVaultLocked(false);
      setUnlockError('');
      setEnteredPassword('');
    } else {
      setUnlockError('Access Denied: Invalid Master Admin Password.');
    }
  };

  // Close & Lock Vault
  const handleCloseAndLock = () => {
    setIsAdminVaultLocked(true); // "When you close it, it locks"
    setActiveTab('home');
  };

  // Image Upload Handler (FileReader base64 as required)
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setListingImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Listing Submit
  const handleAddListingSubmit = (e) => {
    e.preventDefault();
    if (!listingTitle.trim() || !listingPrice) return;

    addListing({
      title: listingTitle.trim(),
      description: listingDesc.trim() || 'Custom 3D printed student model.',
      price: parseFloat(listingPrice),
      creditCost: listingCreditCost ? parseInt(listingCreditCost) : Math.round(parseFloat(listingPrice) * 10),
      image: listingImageBase64 || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      inStock: listingInStock,
      isSeasonal: listingIsSeasonal,
      material: listingMaterial,
      printTime: '1.5 hrs',
      rating: 5.0,
      reviews: []
    });

    setListingTitle('');
    setListingDesc('');
    setListingPrice('');
    setListingCreditCost('');
    setListingImageBase64('');
    setListingIsSeasonal(false);
    setListingInStock(true);
    setListingSuccessMsg('Listing added successfully!');
    setTimeout(() => setListingSuccessMsg(''), 3000);
  };

  // Give Points Submit
  const handleGivePointsSubmit = (e) => {
    e.preventDefault();
    if (!targetUserEmail) return;

    addRewardPointsToUser(targetUserEmail, pointsToAward);
    setPointsSuccessMsg(`Awarded +${pointsToAward} points to ${targetUserEmail}!`);
    setTimeout(() => setPointsSuccessMsg(''), 3000);
  };

  // Add Credit Bank Submit
  const handleAddBankSubmit = (e) => {
    e.preventDefault();
    if (!newBankName.trim() || !newBankBalance) return;

    addCreditBank({
      name: newBankName.trim(),
      balance: parseFloat(newBankBalance),
      description: newBankDesc.trim() || 'Classroom 3D project pool'
    });

    setNewBankName('');
    setNewBankBalance('');
    setNewBankDesc('');
  };

  // Add Person to Rankings
  const handleAddRankingPerson = (e) => {
    e.preventDefault();
    if (!newRankName.trim() || !newRankCredits) return;

    const newPerson = {
      id: 'rank-' + Date.now(),
      name: newRankName.trim(),
      credits: parseInt(newRankCredits),
      email: newRankEmail.trim() || 'maker@school.edu',
      badge: '🎖️ 3D Tech'
    };

    setRankings(prev => [...prev, newPerson]);
    setNewRankName('');
    setNewRankCredits('');
    setNewRankEmail('');
  };

  // Move Ranking Up/Down
  const moveRank = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= rankings.length) return;
    const updated = [...rankings];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setRankings(updated);
  };

  // Drag and drop handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updated = [...rankings];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setRankings(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Add Bot Code
  const handleAddBotCode = (e) => {
    e.preventDefault();
    if (!newBotCode.trim()) return;

    addBotCode({
      code: newBotCode.trim().toUpperCase(),
      description: newBotCodeDesc.trim() || 'Special bot unlock token',
      rewardPoints: parseInt(newBotCodePoints) || 20
    });

    setNewBotCode('');
    setNewBotCodeDesc('');
  };

  return (
    <div className="py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Admin Vault Frame */}
      <div className="liquid-glass-vault rounded-3xl border border-rose-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isAdminVaultLocked ? 'bg-rose-500/20 text-rose-400 border border-rose-400/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'} shadow-lg`}>
              {isAdminVaultLocked ? <Lock className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6 animate-pulse" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
                  Admin Vault & Business Deck
                </h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${isAdminVaultLocked ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'}`}>
                  {isAdminVaultLocked ? 'Locked' : 'Super Admin Active'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                5th Grade 3D Printing Business Master Control: Banks, Passwords, Listings, Rankings & Rewards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAdminVaultLocked && (
              <button
                onClick={handleCloseAndLock}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock & Close</span>
              </button>
            )}
            <button
              onClick={handleCloseAndLock}
              className="p-2 rounded-xl liquid-glass border border-white/20 text-slate-300 hover:text-white"
              title="Close Admin Vault"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOCKED STATE */}
        {isAdminVaultLocked ? (
          <div className="py-12 max-w-md mx-auto text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-400/40 flex items-center justify-center text-rose-400 shadow-glass-glow">
              <ShieldCheck className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-white">Admin Vault Passcode Required</h2>
              <p className="text-xs text-slate-300">
                Authorized 5th grade lab admins only. Enter the master admin password to unlock.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                required
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                placeholder="Enter Admin Password..."
                className="w-full glass-input text-center rounded-2xl py-3 px-4 text-base tracking-widest text-rose-200 border-rose-500/40"
              />

              {unlockError && (
                <div className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                  {unlockError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl glass-btn-primary text-white font-bold text-sm shadow-glass-glow flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Authenticate & Open Vault</span>
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED ADMIN DASHBOARD */
          <div className="pt-6 space-y-10">
            
            {/* 1. CHANGE EITHER PASSWORD FOR THE VAULT */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex items-center gap-2 text-rose-300">
                <Key className="w-5 h-5 text-rose-400" />
                <h2 className="text-lg font-bold font-display text-white">
                  Vault Dual-Password Configuration
                </h2>
              </div>
              <p className="text-xs text-slate-300">
                You can change either password for the vault. Both passwords will grant full access.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Vault Password 1 (Numeric / Pin)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pass1Input}
                      onChange={(e) => setPass1Input(e.target.value)}
                      className="glass-input rounded-xl px-3 py-2 text-xs flex-1 font-mono"
                    />
                    <button
                      onClick={() => {
                        updateAdminPassword(0, pass1Input);
                        setPassSuccessMsg('Password 1 updated!');
                        setTimeout(() => setPassSuccessMsg(''), 3000);
                      }}
                      className="px-3.5 py-2 rounded-xl glass-btn-primary text-white text-xs font-bold"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Vault Password 2 (Alphanumeric Master)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pass2Input}
                      onChange={(e) => setPass2Input(e.target.value)}
                      className="glass-input rounded-xl px-3 py-2 text-xs flex-1 font-mono"
                    />
                    <button
                      onClick={() => {
                        updateAdminPassword(1, pass2Input);
                        setPassSuccessMsg('Password 2 updated!');
                        setTimeout(() => setPassSuccessMsg(''), 3000);
                      }}
                      className="px-3.5 py-2 rounded-xl glass-btn-primary text-white text-xs font-bold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {passSuccessMsg && (
                <div className="text-xs text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{passSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* 2. CREDIT BANKS & EDIT THEIR BALANCES */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold font-display text-white">
                    Credit Banks & Balances Management
                  </h2>
                </div>
                <span className="text-xs text-slate-400">{creditBanks.length} Banks</span>
              </div>
              <p className="text-xs text-slate-300">
                Create new credit banks and adjust balances for classroom filament funding and rewards.
              </p>

              {/* Existing Banks List with inline balance editor */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {creditBanks.map((bank) => (
                  <div key={bank.id} className="liquid-glass p-4 rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{bank.name}</span>
                      <button
                        onClick={() => deleteCreditBank(bank.id)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                        title="Delete Bank"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Bank Balance ($ / Credits)
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">$</span>
                        <input
                          type="number"
                          value={bank.balance}
                          onChange={(e) => updateCreditBankBalance(bank.id, e.target.value)}
                          className="glass-input rounded-lg px-2.5 py-1 text-sm font-bold w-full text-emerald-300"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400">{bank.description}</div>
                  </div>
                ))}
              </div>

              {/* Add New Credit Bank Form */}
              <form onSubmit={handleAddBankSubmit} className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="New Bank Name..."
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  className="glass-input rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="number"
                  required
                  placeholder="Initial Balance ($)..."
                  value={newBankBalance}
                  onChange={(e) => setNewBankBalance(e.target.value)}
                  className="glass-input rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Description..."
                  value={newBankDesc}
                  onChange={(e) => setNewBankDesc(e.target.value)}
                  className="glass-input rounded-xl px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl glass-btn-primary text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Bank</span>
                </button>
              </form>
            </div>

            {/* 3. DRAG AND DROP RANKING AREA (With credits to the right of their name) */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-bold font-display text-white">
                    Drag & Drop Ranking Area
                  </h2>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 font-semibold">
                  Credits to the Right of Name
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Drag cards to reorder student rankings or use the arrows. Notice each member's credits are situated right next to their name.
              </p>

              {/* Draggable List */}
              <div className="space-y-2">
                {rankings.map((person, index) => (
                  <div
                    key={person.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`p-3.5 rounded-xl liquid-glass border transition-all flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing ${
                      draggedIndex === index
                        ? 'border-cyan-400 bg-cyan-500/20 scale-[1.01]'
                        : 'border-white/10 hover:border-purple-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-slate-500 hover:text-white" />
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center border border-purple-400/30">
                        #{index + 1}
                      </div>
                      <div>
                        {/* Requirement: Name with Credits to the Right of their Name */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{person.name}</span>
                          <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-mono font-bold">
                            {person.credits} Credits
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{person.email} • {person.badge}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => moveRank(index, -1)}
                        disabled={index === 0}
                        className="p-1 rounded bg-white/5 text-slate-300 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveRank(index, 1)}
                        disabled={index === rankings.length - 1}
                        className="p-1 rounded bg-white/5 text-slate-300 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setRankings(prev => prev.filter(p => p.id !== person.id))}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 ml-1"
                        title="Remove Person"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Person to Rankings Form */}
              <form onSubmit={handleAddRankingPerson} className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Student / Maker Name..."
                  value={newRankName}
                  onChange={(e) => setNewRankName(e.target.value)}
                  className="glass-input rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="number"
                  required
                  placeholder="Credits to Right of Name..."
                  value={newRankCredits}
                  onChange={(e) => setNewRankCredits(e.target.value)}
                  className="glass-input rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="email"
                  placeholder="Email..."
                  value={newRankEmail}
                  onChange={(e) => setNewRankEmail(e.target.value)}
                  className="glass-input rounded-xl px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl glass-btn-primary text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Rankings</span>
                </button>
              </form>
            </div>

            {/* 4. GIVE POINTS TO ANY ACCOUNT & SHOWS ALL EMAILS */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex items-center gap-2 text-amber-300">
                <Award className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold font-display text-white">
                  Add Reward Points to Accounts (Shows All Emails)
                </h2>
              </div>
              <p className="text-xs text-slate-300">
                Select from all registered user emails to dispatch reward points (+1 point = 1 cent off prints).
              </p>

              <form onSubmit={handleGivePointsSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Select User Email</label>
                  <select
                    value={targetUserEmail}
                    onChange={(e) => setTargetUserEmail(e.target.value)}
                    required
                    className="glass-input rounded-xl px-3 py-2 text-xs w-full bg-slate-900 text-white"
                  >
                    <option value="">-- Choose Account Email --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.email}>
                        {u.email} ({u.name} - {u.points || 0} pts)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Points to Award</label>
                  <input
                    type="number"
                    min="1"
                    value={pointsToAward}
                    onChange={(e) => setPointsToAward(Number(e.target.value))}
                    className="glass-input rounded-xl px-3 py-2 text-xs w-full"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-xl glass-btn-primary text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Award className="w-4 h-4" />
                    <span>Dispatch Points</span>
                  </button>
                </div>
              </form>

              {pointsSuccessMsg && (
                <div className="text-xs text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{pointsSuccessMsg}</span>
                </div>
              )}

              {/* Roster of all emails */}
              <div className="space-y-1.5 pt-2">
                <div className="text-xs font-semibold text-slate-400">All Registered Emails:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {users.map((u) => (
                    <div key={u.id} className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs flex items-center justify-between">
                      <span className="text-slate-300 font-mono text-[11px] truncate">{u.email}</span>
                      <span className="font-bold text-amber-300 ml-2">{u.points || 0} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. ADD & EDIT LISTINGS (Photo Upload instead of URL, seasonal/out of stock toggles) */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300">
                  <ShoppingBag className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-bold font-display text-white">
                    Add New Listing (Image Upload & Toggles)
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  "Only we add listings - no automatic listings"
                </span>
              </div>

              <form onSubmit={handleAddListingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Articulated Glow Dragon"
                      value={listingTitle}
                      onChange={(e) => setListingTitle(e.target.value)}
                      className="glass-input rounded-xl px-3 py-2 text-xs w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Filament Material</label>
                    <input
                      type="text"
                      placeholder="e.g. Dual-Color Silk PLA"
                      value={listingMaterial}
                      onChange={(e) => setListingMaterial(e.target.value)}
                      className="glass-input rounded-xl px-3 py-2 text-xs w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Price ($ USD)</label>
                    <input
                      type="number"
                      step="0.25"
                      required
                      placeholder="e.g. 4.50"
                      value={listingPrice}
                      onChange={(e) => setListingPrice(e.target.value)}
                      className="glass-input rounded-xl px-3 py-2 text-xs w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Credit Cost</label>
                    <input
                      type="number"
                      placeholder="e.g. 45"
                      value={listingCreditCost}
                      onChange={(e) => setListingCreditCost(e.target.value)}
                      className="glass-input rounded-xl px-3 py-2 text-xs w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe print details, infill, moving joints..."
                    value={listingDesc}
                    onChange={(e) => setListingDesc(e.target.value)}
                    className="glass-input rounded-xl p-3 text-xs w-full"
                  />
                </div>

                {/* Crucial requirement: "Instead of having the Image url it is upload an image" */}
                <div className="liquid-glass p-4 rounded-xl border border-dashed border-cyan-400/40 text-center space-y-2">
                  <Upload className="w-6 h-6 text-cyan-300 mx-auto" />
                  <div className="text-xs font-semibold text-white">Upload Product Photo (From Device)</div>
                  <label className="inline-block px-4 py-1.5 rounded-xl glass-btn-primary text-white text-xs font-bold cursor-pointer">
                    <span>Select Photo to Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {listingImageBase64 && (
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <img
                        src={listingImageBase64}
                        alt="Upload preview"
                        className="w-16 h-16 object-cover rounded-lg border border-cyan-400"
                      />
                      <span className="text-xs text-emerald-300">Photo Loaded!</span>
                    </div>
                  )}
                </div>

                {/* Toggles: Out of Stock & Seasonal/Limited */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={listingInStock}
                      onChange={(e) => setListingInStock(e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-white">In Stock (Available for Preorder)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={listingIsSeasonal}
                      onChange={(e) => setListingIsSeasonal(e.target.checked)}
                      className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-amber-300">Seasonal / Limited Edition</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl glass-btn-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Listing</span>
                </button>
              </form>

              {listingSuccessMsg && (
                <div className="text-xs text-emerald-300 flex items-center gap-1 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{listingSuccessMsg}</span>
                </div>
              )}

              {/* Manage Existing Listings */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="text-xs font-semibold text-slate-400">Current Catalog ({listings.length}):</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                  {listings.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl liquid-glass border border-white/10 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg border border-white/10" />
                        <div>
                          <div className="font-bold text-white truncate max-w-[140px]">{item.title}</div>
                          <div className="text-[11px] text-slate-400">
                            ${item.price.toFixed(2)} • {item.inStock ? 'In Stock' : 'Out of Stock'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Toggle stock */}
                        <button
                          onClick={() => updateListing(item.id, { inStock: !item.inStock })}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${item.inStock ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}
                          title="Toggle Stock"
                        >
                          {item.inStock ? 'Mark Out' : 'Mark In'}
                        </button>
                        {/* Toggle seasonal */}
                        <button
                          onClick={() => updateListing(item.id, { isSeasonal: !item.isSeasonal })}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${item.isSeasonal ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-slate-300'}`}
                          title="Toggle Seasonal"
                        >
                          Seasonal
                        </button>
                        <button
                          onClick={() => deleteListing(item.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. ORDERS MANAGEMENT: DELIVERED BUTTON SENDS +30 REWARDS POINTS VIA EMAIL */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Truck className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold font-display text-white">
                    Order Delivery & +30 Points Automation
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  {orders.filter(o => o.status !== 'Delivered').length} Pending Delivery
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Clicking <span className="font-bold text-emerald-300">"Delivered"</span> automatically awards <span className="font-bold text-amber-300">+30 reward points</span> to the customer and triggers an email dispatch from <span className="font-mono text-cyan-300">WForge10@gmail.com</span> using Resend!
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {orders.map((order) => (
                  <div key={order.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{order.itemTitle}</span>
                        <span className="font-mono text-[10px] text-cyan-300">{order.id}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-slate-300 text-[11px]">
                        <span>Client: <span className="text-white font-semibold">{order.userName}</span> ({order.userEmail})</span>
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

                    <div className="flex items-center gap-2">
                      {order.status !== 'Delivered' ? (
                        <button
                          onClick={() => {
                            markOrderDelivered(order.id);
                            try {
                              confetti({ particleCount: 70, spread: 60 });
                            } catch (e) {}
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 shadow-sm"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Delivered (+30 Pts & Email)</span>
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> +30 Points Dispatched
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. CUSTOM CODES FOR THE BOT */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-bold font-display text-white">
                    Custom Codes for the Chatbot
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Unlock codes for students</span>
              </div>
              <p className="text-xs text-slate-300">
                Create secret passwords or redemption codes that the W Forge Chatbot can validate when users ask.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {botCustomCodes.map((codeItem) => (
                  <div key={codeItem.code} className="p-3 rounded-xl liquid-glass border border-white/10 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-cyan-300 text-sm">{codeItem.code}</span>
                      <button
                        onClick={() => removeBotCode(codeItem.code)}
                        className="text-slate-400 hover:text-rose-400"
                        title="Remove Code"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-slate-300 text-[11px]">{codeItem.description}</div>
                    <div className="text-amber-300 font-semibold text-[11px]">
                      +{codeItem.rewardPoints} Bonus Points
                    </div>
                  </div>
                ))}
              </div>

              {/* Add custom code form */}
              <form onSubmit={handleAddBotCode} className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Code (e.g. MAKER5TH)"
                  value={newBotCode}
                  onChange={(e) => setNewBotCode(e.target.value)}
                  className="glass-input rounded-xl px-3 py-2 text-xs font-mono uppercase"
                />
                <input
                  type="text"
                  placeholder="Secret Perk Description..."
                  value={newBotCodeDesc}
                  onChange={(e) => setNewBotCodeDesc(e.target.value)}
                  className="glass-input rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="number"
                  placeholder="Reward Points (e.g. 25)"
                  value={newBotCodePoints}
                  onChange={(e) => setNewBotCodePoints(e.target.value)}
                  className="glass-input rounded-xl px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl glass-btn-primary text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Bot Code</span>
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
