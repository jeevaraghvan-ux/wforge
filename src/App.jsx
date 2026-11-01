import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { ListingsSection } from './components/ListingsSection';
import { OrdersSection } from './components/OrdersSection';
import { RewardsSection } from './components/RewardsSection';
import { VaultModal } from './components/VaultModal';
import { AdminVaultModal } from './components/AdminVaultModal';
import { AccountModal } from './components/AccountModal';
import { AccountSection } from './components/AccountSection';
import { PreorderModal } from './components/PreorderModal';
import { ChatbotModal } from './components/ChatbotModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Logo } from './components/Logo';
import { 
  MessageSquareCode, 
  Sparkles, 
  Heart, 
  Mail, 
  ShieldCheck, 
  Lock, 
  Award,
  Layers,
  ArrowUp
} from 'lucide-react';

const AppContent = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsChatbotOpen, 
    vaultBackground,
    homeTitle 
  } = useStore();

  return (
    <div 
      className="min-h-screen flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors"
      style={{
        backgroundImage: vaultBackground 
          ? `linear-gradient(rgba(3, 7, 18, 0.92), rgba(3, 7, 18, 0.96)), url(${vaultBackground})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dynamic ambient mesh light gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-blue-600/5 blur-[100px]"></div>
      </div>

      {/* Top Liquid Glass Navbar */}
      <Navbar />

      {/* Main View Display */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && <HomeHero />}
        {activeTab === 'listings' && <ListingsSection />}
        {activeTab === 'orders' && <OrdersSection />}
        {activeTab === 'rewards' && <RewardsSection />}
        {activeTab === 'vault' && <VaultModal />}
        {activeTab === 'admin-vault' && <AdminVaultModal />}
        {activeTab === 'account' && <AccountSection />}
      </main>

      {/* Floating Liquid Glass Bot Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="group relative flex items-center gap-2.5 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl liquid-glass border border-cyan-400/50 shadow-glass-glow hover:scale-105 transition-all text-cyan-200"
          title="Open W Forge 3D Assistant"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-md opacity-40 group-hover:opacity-80 transition-opacity"></div>
          <div className="relative flex items-center gap-2 font-display font-bold text-xs sm:text-sm">
            <MessageSquareCode className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Ask W Forge Bot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 liquid-glass py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <div className="font-display font-bold text-sm text-white">
                {homeTitle}
              </div>
              <div className="text-xs text-slate-400">
                School-Friendly 5th Grade 3D Printing Business • Non-Toxic PLA
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <button onClick={() => setActiveTab('listings')} className="hover:text-cyan-300 transition-colors">Listings</button>
            <span>•</span>
            <button onClick={() => setActiveTab('orders')} className="hover:text-cyan-300 transition-colors">Orders</button>
            <span>•</span>
            <button onClick={() => setActiveTab('rewards')} className="hover:text-cyan-300 transition-colors">Rewards (+1 pt = 1¢ off)</button>
            <span>•</span>
            <button onClick={() => setActiveTab('vault')} className="hover:text-cyan-300 transition-colors">Vault</button>
            <span>•</span>
            <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors underline">Privacy Policy</a>
            <span>•</span>
            <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors underline">Terms</a>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Official Email:</span>
            <span className="font-mono text-cyan-300 font-medium">WForge10@gmail.com</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AccountModal />
      <PreorderModal />
      <ChatbotModal />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}
