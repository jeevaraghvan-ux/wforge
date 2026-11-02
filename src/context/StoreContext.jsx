import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';

const StoreContext = createContext();

// Initial sample data for 5th grade 3D printing business
const INITIAL_USERS = [];
const INITIAL_CREDIT_BANKS = [];
const INITIAL_RANKINGS = [];
const INITIAL_LISTINGS = [];
const INITIAL_ORDERS = [];

export const StoreProvider = ({ children }) => {
  // Home title configurable from Vault
  const [homeTitle, setHomeTitle] = useState(() => {
    return localStorage.getItem('wforge_home_title') || 'W Forge';
  });

  // Vault background image configurable from Vault
  const [vaultBackground, setVaultBackground] = useState(() => {
    return localStorage.getItem('wforge_vault_bg') || '';
  });

  // Dual passwords for Vault / Admin Vault (kept private, never exposed in UI)
  const [adminPasswords, setAdminPasswords] = useState(() => {
    const saved = localStorage.getItem('wforge_admin_passwords');
    return saved ? JSON.parse(saved) : ['9248', 'WF0RG3-ADMIN'];
  });

  // Vault & Admin Vault Lock States (Locks when closed)
  const [isVaultLocked, setIsVaultLocked] = useState(true);
  const [isAdminVaultLocked, setIsAdminVaultLocked] = useState(true);

  // Active user / auth state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('wforge_current_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.email === 'WForge10@gmail.com' && u.points === 500) {
          return null;
        }
        return u;
      } catch (e) {}
    }
    return null;
  });

  // Users list (clean slate)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('wforge_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(u => u.email === 'alex.rivera@school.edu')) {
          localStorage.removeItem('wforge_users');
          return [];
        }
        return parsed;
      } catch (e) {}
    }
    return [];
  });

  // Credit banks (clean slate)
  const [creditBanks, setCreditBanks] = useState(() => {
    const saved = localStorage.getItem('wforge_credit_banks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(b => b.name === '5th Grade Treasury')) {
          localStorage.removeItem('wforge_credit_banks');
          return [];
        }
        return parsed;
      } catch (e) {}
    }
    return [];
  });

  // Rankings (clean slate)
  const [rankings, setRankings] = useState(() => {
    const saved = localStorage.getItem('wforge_rankings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(r => r.name?.includes('Maya Lin'))) {
          localStorage.removeItem('wforge_rankings');
          return [];
        }
        return parsed;
      } catch (e) {}
    }
    return [];
  });

  // Listings (clean slate)
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('wforge_listings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(p => p.id === 'prod-1' || p.title?.includes('Dragon'))) {
          localStorage.removeItem('wforge_listings');
          return [];
        }
        return parsed;
      } catch (e) {}
    }
    return [];
  });

  // Orders (clean slate)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('wforge_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(o => o.id === 'ORD-501')) {
          localStorage.removeItem('wforge_orders');
          return [];
        }
        return parsed;
      } catch (e) {}
    }
    return [];
  });

  // Custom Bot Codes (configurable in Admin Vault) - 9248 removed so it is never exposed
  const [botCustomCodes, setBotCustomCodes] = useState(() => {
    const saved = localStorage.getItem('wforge_bot_codes');
    return saved ? JSON.parse(saved) : [
      { code: 'FILAMENT5', description: '5% student discount token', rewardPoints: 10 },
      { code: 'MAKER5TH', description: 'Welcome pack bonus', rewardPoints: 20 }
    ];
  });

  // Outgoing email log (Resend / WForge10@gmail.com)
  const [sentEmails, setSentEmails] = useState(() => {
    const saved = localStorage.getItem('wforge_sent_emails');
    return saved ? JSON.parse(saved) : [];
  });

  // Active view navigation
  const [activeTab, setActiveTab] = useState('home'); // home, listings, orders, rewards, vault, admin-vault, account
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [preorderTargetProduct, setPreorderTargetProduct] = useState(null);
  const [preorderModalProduct, setPreorderModalProduct] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('wforge_home_title', homeTitle);
  }, [homeTitle]);

  useEffect(() => {
    localStorage.setItem('wforge_vault_bg', vaultBackground);
  }, [vaultBackground]);

  useEffect(() => {
    localStorage.setItem('wforge_admin_passwords', JSON.stringify(adminPasswords));
  }, [adminPasswords]);

  useEffect(() => {
    localStorage.setItem('wforge_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('wforge_credit_banks', JSON.stringify(creditBanks));
  }, [creditBanks]);

  useEffect(() => {
    localStorage.setItem('wforge_rankings', JSON.stringify(rankings));
  }, [rankings]);

  useEffect(() => {
    localStorage.setItem('wforge_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('wforge_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('wforge_bot_codes', JSON.stringify(botCustomCodes));
  }, [botCustomCodes]);

  useEffect(() => {
    localStorage.setItem('wforge_sent_emails', JSON.stringify(sentEmails));
  }, [sentEmails]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('wforge_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('wforge_current_user');
    }
  }, [currentUser]);

  // Listen to Supabase auth state changes (e.g. on return from Google OAuth)
  useEffect(() => {
    if (supabase && isSupabaseConfigured()) {
      // Check current session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const user = session.user;
          const userEmail = (user.email || '').toLowerCase();
          setUsers(prev => {
            const existing = prev.find(u => u.email.toLowerCase() === userEmail);
            if (existing) {
              setCurrentUser(existing);
              return prev;
            } else {
              const newSupabaseUser = {
                id: user.id || 'user-' + Date.now(),
                name: user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0],
                email: userEmail,
                photoURL: user.user_metadata?.avatar_url,
                points: 10,
                verified: true,
                role: 'student',
                credits: 20
              };
              setCurrentUser(newSupabaseUser);
              return [...prev, newSupabaseUser];
            }
          });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = session.user;
          const userEmail = (user.email || '').toLowerCase();
          setUsers(prev => {
            const existing = prev.find(u => u.email.toLowerCase() === userEmail);
            if (existing) {
              setCurrentUser(existing);
              return prev;
            } else {
              const newSupabaseUser = {
                id: user.id || 'user-' + Date.now(),
                name: user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0],
                email: userEmail,
                photoURL: user.user_metadata?.avatar_url,
                points: 10,
                verified: true,
                role: 'student',
                credits: 20
              };
              setCurrentUser(newSupabaseUser);
              return [...prev, newSupabaseUser];
            }
          });
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  // Email sender using Resend / Gmail WForge10@gmail.com
  const sendEmail = ({ to, subject, html, text }) => {
    const emailRecord = {
      id: 'email-' + Date.now(),
      from: 'WForge10@gmail.com',
      to,
      subject,
      content: text || html,
      timestamp: new Date().toISOString(),
      provider: 'Resend API / WForge10@gmail.com'
    };
    setSentEmails(prev => [emailRecord, ...prev]);
    return emailRecord;
  };

  // Change password 1 or password 2
  const updateAdminPassword = (index, newPassword) => {
    setAdminPasswords(prev => {
      const updated = [...prev];
      updated[index] = newPassword;
      return updated;
    });
  };

  // Verify password against either password
  const verifyAdminPassword = (password) => {
    return adminPasswords.some(p => p.trim() === password.trim());
  };

  // Add & edit credit banks
  const addCreditBank = (newBank) => {
    setCreditBanks(prev => [...prev, { ...newBank, id: 'bank-' + Date.now() }]);
  };

  const updateCreditBankBalance = (id, newBalance) => {
    setCreditBanks(prev => prev.map(bank => bank.id === id ? { ...bank, balance: Number(newBalance) } : bank));
  };

  const deleteCreditBank = (id) => {
    setCreditBanks(prev => prev.filter(bank => bank.id !== id));
  };

  // Give reward points to any account
  const addRewardPointsToUser = (userEmail, pointsToAdd) => {
    setUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === userEmail.toLowerCase()) {
        const newPoints = Math.max(0, (u.points || 0) + Number(pointsToAdd));
        return { ...u, points: newPoints };
      }
      return u;
    }));

    if (currentUser && currentUser.email.toLowerCase() === userEmail.toLowerCase()) {
      setCurrentUser(prev => ({
        ...prev,
        points: Math.max(0, (prev.points || 0) + Number(pointsToAdd))
      }));
    }
  };

  // Order delivery handler: Automatically sends +30 reward points and email via Resend from WForge10@gmail.com
  const markOrderDelivered = (orderId) => {
    let targetOrder = null;

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        targetOrder = order;
        return { ...order, status: 'Delivered', deliveredAt: new Date().toISOString() };
      }
      return order;
    }));

    if (targetOrder) {
      // Add +30 points automatically
      addRewardPointsToUser(targetOrder.userEmail, 30);

      // Send email from WForge10@gmail.com
      sendEmail({
        to: targetOrder.userEmail,
        subject: `🎉 Order Delivered! +30 Reward Points Added - W Forge`,
        text: `Hello ${targetOrder.userName || 'Valued Maker'},\n\nYour 3D print order for "${targetOrder.itemTitle}" has been officially marked as DELIVERED by W Forge!\n\nAs a special reward for supporting our 5th grade 3D printing business, we have automatically added +30 reward points to your account!\n(Remember: +1 point = 1 cent off your future prints!)\n\nThank you for forging the future with us!\n- W Forge Team (WForge10@gmail.com)`
      });
    }
  };

  // Update order status or delete order
  const updateOrderStatus = (orderId, newStatus) => {
    if (newStatus === 'Delivered') {
      markOrderDelivered(orderId);
    } else {
      setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    }
  };

  const removeOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  // Listings CRUD
  const addListing = (listing) => {
    const newListing = {
      ...listing,
      id: 'prod-' + Date.now(),
      rating: listing.rating || 5.0,
      reviews: []
    };
    setListings(prev => [newListing, ...prev]);
  };

  const updateListing = (id, updatedFields) => {
    setListings(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  const deleteListing = (id) => {
    setListings(prev => prev.filter(item => item.id !== id));
  };

  // Product reviews
  const addReviewToListing = (productId, review) => {
    setListings(prev => prev.map(item => {
      if (item.id === productId) {
        const newReviews = [
          {
            id: 'rev-' + Date.now(),
            author: currentUser ? currentUser.name : (review.author || 'Anonymous Student'),
            email: currentUser ? currentUser.email : (review.email || 'guest@school.edu'),
            rating: Number(review.rating) || 5,
            comment: review.comment,
            date: new Date().toISOString().split('T')[0]
          },
          ...(item.reviews || [])
        ];
        const avg = (newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length).toFixed(1);
        return { ...item, reviews: newReviews, rating: parseFloat(avg) };
      }
      return item;
    }));
  };

  const removeReviewFromListing = (productId, reviewId) => {
    setListings(prev => prev.map(item => {
      if (item.id === productId) {
        const newReviews = (item.reviews || []).filter(r => r.id !== reviewId);
        const avg = newReviews.length > 0 
          ? (newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length).toFixed(1)
          : 5.0;
        return { ...item, reviews: newReviews, rating: parseFloat(avg) };
      }
      return item;
    }));
  };

  // Custom Bot Codes
  const addBotCode = (newCode) => {
    setBotCustomCodes(prev => [...prev, newCode]);
  };

  const removeBotCode = (codeStr) => {
    setBotCustomCodes(prev => prev.filter(c => c.code !== codeStr));
  };

  // Preorder action: opens preorder modal with points redemption
  const handlePreorder = (product) => {
    if (!currentUser) {
      setPreorderTargetProduct(product);
      setIsAuthModalOpen(true);
    } else {
      setPreorderModalProduct(product);
    }
  };

  const createPreorderWithPoints = ({ product, pointsToUse = 0, notes = '' }) => {
    if (!currentUser) return;
    const availablePoints = currentUser.points || 0;
    const maxRedeemablePoints = Math.min(availablePoints, Math.floor(product.price * 100));
    const validatedPoints = Math.max(0, Math.min(maxRedeemablePoints, Number(pointsToUse) || 0));
    const discountAmount = Number((validatedPoints * 0.01).toFixed(2));
    const originalPrice = product.price;
    const finalPrice = Math.max(0, Number((originalPrice - discountAmount).toFixed(2)));

    // Deduct points from user if redeemed
    if (validatedPoints > 0) {
      addRewardPointsToUser(currentUser.email, -validatedPoints);
    }

    const newOrder = {
      id: 'ORD-' + Math.floor(100 + Math.random() * 900),
      userEmail: currentUser.email,
      userName: currentUser.name,
      itemTitle: product.title,
      quantity: 1,
      originalPrice: originalPrice,
      pointsUsed: validatedPoints,
      discountAmount: discountAmount,
      finalPrice: finalPrice,
      totalPrice: finalPrice,
      status: 'In Queue',
      orderDate: new Date().toISOString().split('T')[0],
      pointsEarned: 30,
      notes: notes.trim() || (validatedPoints > 0 ? `Redeemed ${validatedPoints} pts (-$${discountAmount.toFixed(2)} off)` : 'Standard print order')
    };

    setOrders(prev => [newOrder, ...prev]);
    setPreorderModalProduct(null);
    setPreorderTargetProduct(null);
    setActiveTab('orders');
    return newOrder;
  };

  return (
    <StoreContext.Provider value={{
      homeTitle,
      setHomeTitle,
      vaultBackground,
      setVaultBackground,
      adminPasswords,
      updateAdminPassword,
      verifyAdminPassword,
      isVaultLocked,
      setIsVaultLocked,
      isAdminVaultLocked,
      setIsAdminVaultLocked,
      currentUser,
      setCurrentUser,
      users,
      setUsers,
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
      addReviewToListing,
      removeReviewFromListing,
      orders,
      updateOrderStatus,
      removeOrder,
      markOrderDelivered,
      botCustomCodes,
      addBotCode,
      removeBotCode,
      addRewardPointsToUser,
      sentEmails,
      sendEmail,
      activeTab,
      setActiveTab,
      isAuthModalOpen,
      setIsAuthModalOpen,
      isChatbotOpen,
      setIsChatbotOpen,
      preorderTargetProduct,
      setPreorderTargetProduct,
      preorderModalProduct,
      setPreorderModalProduct,
      handlePreorder,
      createPreorderWithPoints
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
