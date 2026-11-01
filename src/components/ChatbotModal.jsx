import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Lock, 
  Unlock, 
  Trash2, 
  HelpCircle, 
  Cpu,
  Layers,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_MESSAGE = {
  id: 'msg-init',
  sender: 'bot',
  text: `👋 Hi! I'm the W Forge 3D Bot! I know everything about our 5th grade 3D printing business, filaments, custom preorders, and rewards (+1 point = 1¢ off). Ask me anything, or try entering special maker access phrases!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export const ChatbotModal = () => {
  const { 
    isChatbotOpen, 
    setIsChatbotOpen, 
    botCustomCodes, 
    addRewardPointsToUser, 
    currentUser, 
    homeTitle,
    listings,
    orders,
    setActiveTab,
    setIsAdminVaultLocked
  } = useStore();

  // "When you close it it deletes previous messages"
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isWaitingForCode, setIsWaitingForCode] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When closing: DELETE previous messages as required
  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
    // Delete previous messages immediately
    setMessages([INITIAL_MESSAGE]);
    setIsWaitingForCode(false);
    setSecretUnlocked(false);
  };

  const unlockAdminVaultAndEnter = () => {
    setIsAdminVaultLocked(false);
    setActiveTab('admin-vault');
    handleCloseChatbot();
  };

  const getKnowledgeResponse = (query) => {
    const q = query.toLowerCase();

    // 1. Check for Access trigger: "Access WF0RG3" or "Access J33V4"
    if (q.includes('access wf0rg3') || q.includes('access j33v4') || q.includes('access wforge') || q.includes('access jeeva')) {
      setIsWaitingForCode(true);
      return {
        text: `🔐 VIP Clearance Recognized!\n\nPlease put in the 4-digit code (9248) to unlock and enter the Admin Vault:`,
        isCodePrompt: true
      };
    }

    // 2. If waiting for code 9248
    if (isWaitingForCode) {
      if (q.includes('9248')) {
        setIsWaitingForCode(false);
        setSecretUnlocked(true);
        setIsAdminVaultLocked(false);
        if (currentUser) {
          addRewardPointsToUser(currentUser.email, 50);
        }
        try {
          confetti({ particleCount: 90, spread: 80 });
        } catch (e) {}

        return {
          text: `🎉 ACCESS GRANTED [CODE: 9248]!\n\nWelcome Lead Maker / Admin! The Admin Vault is now UNLOCKED.\n• You can create new product listings with image uploads directly in the Vault interface yourself.\n• Manage student orders, credit banks, and delivery points.\n• +50 Bonus Reward Points added!`,
          showVaultButton: true
        };
      } else {
        return {
          text: `❌ Incorrect code. The put in code is 9248. Type 9248 to unlock the Admin Vault!`
        };
      }
    }

    // Direct check for 9248
    if (q.trim() === '9248') {
      setSecretUnlocked(true);
      setIsAdminVaultLocked(false);
      if (currentUser) {
        addRewardPointsToUser(currentUser.email, 50);
      }
      return {
        text: `⚡ Code 9248 Verified! Admin Vault unlocked. Click below to enter the Vault interface!`,
        showVaultButton: true
      };
    }

    // If user asks how to get to admin vault
    if (q.includes('admin') || q.includes('admin vault') || q.includes('how to get to admin')) {
      return {
        text: `🛡️ Security Notice:\nThe Admin Vault is strictly private and cannot be accessed from the home page or navbar!\n\nTo access the Admin Vault, enter the clearance phrase "Access WF0RG3" or "Access J33V4", then put in the code 9248.`
      };
    }

    // 3. Check for custom bot codes added in Admin Vault
    const matchedBotCode = botCustomCodes.find(c => q.includes(c.code.toLowerCase()));
    if (matchedBotCode) {
      if (currentUser) {
        addRewardPointsToUser(currentUser.email, matchedBotCode.rewardPoints);
      }
      return {
        text: `🎁 Secret Bot Code "${matchedBotCode.code}" Activated!\n• ${matchedBotCode.description}\n• Added +${matchedBotCode.rewardPoints} Reward Points to your account!`
      };
    }

    // 4. Knowledge Base questions:
    // Filaments / Material
    if (q.includes('filament') || q.includes('material') || q.includes('pla') || q.includes('plastic') || q.includes('safe') || q.includes('toxic')) {
      return {
        text: `🧪 We print exclusively with school-safe, eco-friendly PLA (Polylactic Acid) derived from renewable cornstarch! It is completely non-toxic, odorless, and biodegradable. We offer Silk Dual-Color, Glow-in-the-Dark, and Tough High-Infill varieties.`
      };
    }

    // Reward points
    if (q.includes('reward') || q.includes('point') || q.includes('cent') || q.includes('discount')) {
      return {
        text: `💎 Rewards Program Rule:\n+1 point = a cent off your future print ($0.01 per point)!\nWhen any print you order is marked as "Delivered", our system automatically emails you +30 reward points from WForge10@gmail.com!\nNote: Points cannot be added manually by users; they are redeemed at preorder checkout.`
      };
    }

    // Preorder / How to order
    if (q.includes('order') || q.includes('preorder') || q.includes('buy') || q.includes('price')) {
      return {
        text: `🛒 How to Preorder:\n1. Browse our Listings catalog\n2. Click "Preorder"\n3. Choose how many of your earned reward points to redeem (1 pt = 1¢ off)\n4. See the live Final Price of what you have to pay!\n5. Confirmed orders go straight into the production queue.`
      };
    }

    // Turnaround time / print speed
    if (q.includes('time') || q.includes('fast') || q.includes('turnaround') || q.includes('speed') || q.includes('when')) {
      return {
        text: `⏱️ Turnaround Time: Most small items (fidget cubes, backpack tags) take 45-90 minutes to print and are ready for pickup in Room 5B within 24 hours. Larger articulated dragons take ~2.5 to 3 hours.`
      };
    }

    // Vaults
    if (q.includes('vault') || q.includes('password')) {
      return {
        text: `🔒 Vaults Info:\n• The Public Vault allows makers to inspect credit banks and customize background textures.\n• The Admin Vault allows you to add listings with photo uploads and manage orders. It is ONLY accessible through this chatbot using the passphrases!`
      };
    }

    // Founders / 5th grade
    if (q.includes('who') || q.includes('5th grade') || q.includes('student') || q.includes('jeeva') || q.includes('school')) {
      return {
        text: `🎓 W Forge is a student-led 3D printing enterprise founded by enthusiastic 5th grade makers! We combine STEM math, 3D CAD modeling, and real business management skills to manufacture durable school-friendly products.`
      };
    }

    // Best sellers / Products
    if (q.includes('dragon') || q.includes('product') || q.includes('listing') || q.includes('best') || q.includes('item')) {
      return {
        text: `🐉 Our #1 bestseller is the Articulated Flexi Crystal Dragon ($4.50)! It has 22 interlocking spine joints that articulate smoothly right off the print bed without any glue or assembly.`
      };
    }

    // Default intelligent response
    return {
      text: `🤖 That's a great question about ${homeTitle}! You can pre-order 3D prints, redeem 1¢ off per reward point, or unlock secret maker clearance with "Access WF0RG3". Is there anything specific about our print bed temperatures or models you'd like to know?`
    };
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Formulate response
    setTimeout(() => {
      const resp = getKnowledgeResponse(userText);
      const botMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'bot',
        text: resp.text,
        showVaultButton: resp.showVaultButton,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  if (!isChatbotOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="liquid-glass rounded-3xl max-w-lg w-full h-[600px] flex flex-col border border-cyan-400/40 shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between liquid-glass">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-glass-glow">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-white text-base">
                  W Forge 3D AI Assistant
                </h3>
                {secretUnlocked && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/50 font-bold">
                    VIP 9248 Active
                  </span>
                )}
              </div>
              <div className="text-[11px] text-cyan-300/80 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Truthful • Auto-clears on close</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Clear messages manually */}
            <button
              onClick={() => setMessages([INITIAL_MESSAGE])}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Delete previous messages"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {/* Close chatbot (which deletes messages as required) */}
            <button
              onClick={handleCloseChatbot}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Bot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Secret Code Quick Bar */}
        <div className="px-4 py-1.5 bg-cyan-950/40 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-300">
          <span>Secret Access: <code className="text-cyan-300 font-bold">Access WF0RG3</code> or <code className="text-cyan-300 font-bold">Access J33V4</code></span>
          <span className="text-purple-300 font-mono">Code: 9248</span>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm whitespace-pre-line leading-relaxed ${
                  msg.sender === 'user'
                    ? 'glass-btn-primary text-white shadow-md rounded-br-none'
                    : 'liquid-glass border border-white/15 text-slate-100 shadow-glass rounded-bl-none'
                }`}
              >
                {msg.text}

                {msg.showVaultButton && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <button
                      onClick={unlockAdminVaultAndEnter}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all"
                    >
                      <Unlock className="w-4 h-4 text-rose-200 animate-bounce" />
                      <span>Enter Admin Vault Interface</span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-white/10 liquid-glass flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isWaitingForCode ? "Enter code 9248..." : "Ask anything about 3D printing, filaments, orders..."}
            className="glass-input rounded-2xl px-4 py-2.5 text-xs sm:text-sm flex-1 text-white placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="p-3 rounded-2xl glass-btn-primary text-white font-bold transition-all hover:scale-105 shadow-glass-glow flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
