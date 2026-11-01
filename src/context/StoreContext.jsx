import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

// Initial sample data for 5th grade 3D printing business
const INITIAL_USERS = [
  { id: 'user-1', name: 'Alex Rivera', email: 'alex.rivera@school.edu', points: 150, verified: true, role: 'student', credits: 45 },
  { id: 'user-2', name: 'Maya Lin', email: 'maya.lin@school.edu', points: 220, verified: true, role: 'student', credits: 80 },
  { id: 'user-3', name: 'Sammy Chen', email: 'sammy.c@school.edu', points: 90, verified: true, role: 'student', credits: 25 },
  { id: 'user-4', name: 'Jeeva Maker', email: 'WForge10@gmail.com', points: 500, verified: true, role: 'admin', credits: 350 },
  { id: 'user-5', name: 'Jordan Taylor', email: 'jordan.t@school.edu', points: 60, verified: true, role: 'student', credits: 15 }
];

const INITIAL_CREDIT_BANKS = [
  { id: 'bank-1', name: '5th Grade Treasury', balance: 520, description: 'Classroom 3D project materials fund' },
  { id: 'bank-2', name: 'STEM Makerspace Pool', balance: 340, description: 'Filament sponsorship & donations' },
  { id: 'bank-3', name: 'Student Rewards Bank', balance: 215, description: 'Points exchange & printer credits' }
];

const INITIAL_RANKINGS = [
  { id: 'rank-1', name: 'Maya Lin (Lead Designer)', credits: 80, email: 'maya.lin@school.edu', badge: '🥇 Master Modeler' },
  { id: 'rank-2', name: 'Alex Rivera (Print Tech)', credits: 45, email: 'alex.rivera@school.edu', badge: '🥈 Slicer Pro' },
  { id: 'rank-3', name: 'Sammy Chen (Filament Guru)', credits: 25, email: 'sammy.c@school.edu', badge: '🥉 Spool Hero' },
  { id: 'rank-4', name: 'Jordan Taylor (Junior Maker)', credits: 15, email: 'jordan.t@school.edu', badge: '⭐ Apprentice' }
];

const INITIAL_LISTINGS = [
  {
    id: 'prod-1',
    title: 'Articulated Flexi Crystal Dragon',
    description: 'Ultra-flexible dual-color silk PLA fidget dragon. Prints smoothly with interlocking joints right off the print bed!',
    price: 4.50,
    creditCost: 45,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    isSeasonal: false,
    rating: 5.0,
    printTime: '2.5 hrs',
    material: 'Non-toxic Silk PLA',
    reviews: [
      { id: 'rev-1', author: 'Maya Lin', email: 'maya.lin@school.edu', rating: 5, comment: 'The joints move so smoothly! Best desk toy ever.', date: '2026-10-28' },
      { id: 'rev-2', author: 'Alex Rivera', email: 'alex.rivera@school.edu', rating: 5, comment: 'Clean layer lines, no stringing at all.', date: '2026-10-29' }
    ]
  },
  {
    id: 'prod-2',
    title: 'Precision Fidget Gear Cube',
    description: 'Satisfying mechanical interlocking gears that twist infinitely in your hand. School-safe quiet fidget.',
    price: 3.00,
    creditCost: 30,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    isSeasonal: false,
    rating: 4.8,
    printTime: '1.8 hrs',
    material: 'Eco PLA - Neon Teal',
    reviews: [
      { id: 'rev-3', author: 'Sammy Chen', email: 'sammy.c@school.edu', rating: 5, comment: 'Super quiet during class reading time.', date: '2026-10-30' }
    ]
  },
  {
    id: 'prod-3',
    title: 'Halloween Glow Pumpkin Jack-o-Lantern',
    description: 'Limited seasonal run! Glow-in-the-dark filament with removable lid to place an LED tea light inside.',
    price: 5.00,
    creditCost: 50,
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    isSeasonal: true,
    rating: 4.9,
    printTime: '3.0 hrs',
    material: 'Glow-in-the-Dark Green PLA',
    reviews: [
      { id: 'rev-4', author: 'Jordan Taylor', email: 'jordan.t@school.edu', rating: 5, comment: 'Glows super bright under blacklight!', date: '2026-10-31' }
    ]
  },
  {
    id: 'prod-4',
    title: 'Personalized Backpack Name Keychain',
    description: 'Custom embossed 3D tag with your name and favorite school icon. Durable 100% infill loop.',
    price: 2.50,
    creditCost: 25,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    inStock: false,
    isSeasonal: false,
    rating: 4.7,
    printTime: '45 mins',
    material: 'High-Strength Tough PLA',
    reviews: []
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-501',
    userEmail: 'alex.rivera@school.edu',
    userName: 'Alex Rivera',
    itemTitle: 'Articulated Flexi Crystal Dragon',
    quantity: 1,
    originalPrice: 4.50,
    pointsUsed: 50,
    discountAmount: 0.50,
    finalPrice: 4.00,
    totalPrice: 4.00,
    status: 'Ready for Pickup',
    orderDate: '2026-10-30',
    pointsEarned: 45,
    notes: 'Points redeemed: 50 pts (-$0.50). Silk Blue finish requested'
  },
  {
    id: 'ORD-502',
    userEmail: 'maya.lin@school.edu',
    userName: 'Maya Lin',
    itemTitle: 'Precision Fidget Gear Cube',
    quantity: 2,
    originalPrice: 6.00,
    pointsUsed: 100,
    discountAmount: 1.00,
    finalPrice: 5.00,
    totalPrice: 5.00,
    status: 'Printing',
    orderDate: '2026-10-31',
    pointsEarned: 60,
    notes: 'Points redeemed: 100 pts (-$1.00). Neon Teal & Purple gears'
  },
  {
    id: 'ORD-503',
    userEmail: 'sammy.c@school.edu',
    userName: 'Sammy Chen',
    itemTitle: 'Halloween Glow Pumpkin Jack-o-Lantern',
    quantity: 1,
    originalPrice: 5.00,
    pointsUsed: 0,
    discountAmount: 0.00,
    finalPrice: 5.00,
    totalPrice: 5.00,
    status: 'Delivered',
    orderDate: '2026-10-27',
    pointsEarned: 30,
    notes: 'Delivered to Homeroom 5B'
  }
];

export const StoreProvider = ({ children }) => {
  // Home title configurable from Vault
  const [homeTitle, setHomeTitle] = useState(() => {
    return localStorage.getItem('wforge_home_title') || 'W Forge';
  });

  // Vault background image configurable from Vault
  const [vaultBackground, setVaultBackground] = useState(() => {
    return localStorage.getItem('wforge_vault_bg') || '';
  });

  // Dual passwords for Vault / Admin Vault
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
    return saved ? JSON.parse(saved) : null;
  });

  // Users list
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('wforge_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Credit banks
  const [creditBanks, setCreditBanks] = useState(() => {
    const saved = localStorage.getItem('wforge_credit_banks');
    return saved ? JSON.parse(saved) : INITIAL_CREDIT_BANKS;
  });

  // Rankings (drag and drop in admin vault)
  const [rankings, setRankings] = useState(() => {
    const saved = localStorage.getItem('wforge_rankings');
    return saved ? JSON.parse(saved) : INITIAL_RANKINGS;
  });

  // Listings (no automatic listings, only admin adds them)
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('wforge_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  // Orders
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('wforge_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Custom Bot Codes (configurable in Admin Vault)
  const [botCustomCodes, setBotCustomCodes] = useState(() => {
    const saved = localStorage.getItem('wforge_bot_codes');
    return saved ? JSON.parse(saved) : [
      { code: '9248', description: 'Master Unlock Code (Activates 5th Grade Maker Overdrive)', rewardPoints: 50 },
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
