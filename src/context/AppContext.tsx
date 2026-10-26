import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Item, Claim, UserProfile, ToastMessage, ChatMessage, ClaimStatus } from '../types';
import { initialItems, initialClaims, currentUser, adminUser, FIXED_ADMIN_EMAIL } from '../data/mockData';

interface AppContextType {
  items: Item[];
  claims: Claim[];
  user: UserProfile;
  isAdmin: boolean;
  toasts: ToastMessage[];
  chatMessages: ChatMessage[];
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
  selectedLocation: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedLocation: (loc: string) => void;
  loginUser: (email: string, name?: string, roll?: string) => boolean;
  logoutUser: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  addItemReport: (newItem: Omit<Item, 'id' | 'reportedBy' | 'reporterRole' | 'reporterRoll' | 'status'>) => Item;
  submitClaim: (claimData: Omit<Claim, 'id' | 'claimedBy' | 'claimerRoll' | 'claimDate' | 'status'>) => Claim;
  updateClaimStatus: (claimId: string, status: ClaimStatus, notes?: string) => void;
  sendChatMessage: (text: string) => void;
  resetAllData: () => void;
}

const STORAGE_KEY_ITEMS = 'campus_lf_items_clean_v1';
const STORAGE_KEY_CLAIMS = 'campus_lf_claims_clean_v1';
const STORAGE_KEY_USER = 'campus_lf_user_clean_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Purge any lingering legacy keys from previous sessions to prevent old mock items from resurfacing
  useEffect(() => {
    try {
      const legacyKeys = [
        'campus_lf_items',
        'campus_lf_claims',
        'campus_items',
        'campus_reports',
        'campus_claims',
        'items',
        'reports'
      ];
      legacyKeys.forEach(key => localStorage.removeItem(key));
    } catch {
      // Ignore localStorage errors in restricted environments
    }
  }, []);

  // Initialize Items from clean LocalStorage
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return initialItems;
  });

  // Initialize Claims from clean LocalStorage
  const [claims, setClaims] = useState<Claim[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLAIMS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return initialClaims;
  });

  // Initialize User
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) return parsed;
      }
    } catch {
      // fallback
    }
    return currentUser;
  });

  // Persist items whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Persist claims whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(claims));
    } catch {
      // ignore
    }
  }, [claims]);

  // Persist user whenever session changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  // Sole criteria for Administrator role: email matches kickshu10@gmail.com
  const isAdmin = user.email.trim().toLowerCase() === FIXED_ADMIN_EMAIL.toLowerCase();

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Hello! 👋\nI am your Campus Lost & Found Assistant.\nHow can I help you today?',
      timestamp: 'Just now',
      quickButtons: [
        { label: 'Report Lost Item', action: '/report/lost' },
        { label: 'Report Found Item', action: '/report/found' },
        { label: 'Browse Items', action: '/items' },
        { label: 'Talk to Admin', action: '/about' }
      ]
    }
  ]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loginUser = (emailInput: string, customName?: string, customRoll?: string): boolean => {
    const cleanEmail = emailInput.trim().toLowerCase();
    if (cleanEmail === FIXED_ADMIN_EMAIL.toLowerCase()) {
      setUser(adminUser);
      addToast({
        type: 'success',
        title: 'Administrator Logged In',
        message: 'Welcome to the Proctorial Board Administration Desk.'
      });
      return true; // is admin
    } else {
      const studentProfile: UserProfile = {
        id: 'u-' + Date.now(),
        name: customName || (cleanEmail.includes('amit') ? 'Amit Kumar' : cleanEmail.split('@')[0]),
        rollNo: customRoll || '23CS' + Math.floor(1000 + Math.random() * 9000),
        email: emailInput.trim(),
        phone: '+91 98765 ' + Math.floor(10000 + Math.random() * 90000),
        department: 'Academic Campus Department',
        year: 'Student / Campus Member',
        role: 'Student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      };
      setUser(studentProfile);
      addToast({
        type: 'success',
        title: `Welcome, ${studentProfile.name}!`,
        message: 'Signed in successfully to the Smart Campus Lost & Found portal.'
      });
      return false; // is regular student
    }
  };

  const logoutUser = () => {
    setUser(currentUser);
    localStorage.removeItem(STORAGE_KEY_USER);
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been signed out safely.'
    });
  };

  const resetAllData = () => {
    setItems([]);
    setClaims([]);
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify([]));
    addToast({
      type: 'info',
      title: 'Data Reset',
      message: 'All records have been reset to a pristine state.'
    });
  };

  const addItemReport = (newItemData: Omit<Item, 'id' | 'reportedBy' | 'reporterRole' | 'reporterRoll' | 'status'>): Item => {
    const id = 'item-' + Date.now();
    
    const newItem: Item = {
      ...newItemData,
      id,
      reportedBy: `${user.name} (${user.role})`,
      reporterRole: user.role,
      reporterRoll: user.rollNo,
      status: 'Active',
      matchScore: 88,
      matchTier: 'Possible Match',
      aiTags: [newItemData.category, newItemData.location, 'Neural Visual Verified'],
      aiAnalysis: {
        imageSimilarity: 90,
        textSimilarity: 85,
        locationMatch: 90,
        overallScore: 88,
      }
    };

    setItems(prev => [newItem, ...prev]);
    addToast({
      type: 'success',
      title: 'Report Submitted Successfully!',
      message: `Your ${newItem.type} item "${newItem.name}" is now registered in the campus database.`
    });

    return newItem;
  };

  const submitClaim = (claimData: Omit<Claim, 'id' | 'claimedBy' | 'claimerRoll' | 'claimDate' | 'status'>): Claim => {
    const id = 'claim-' + Date.now();
    const newClaim: Claim = {
      ...claimData,
      id,
      claimedBy: user.name,
      claimerRoll: user.rollNo,
      claimerEmail: user.email,
      claimerPhone: user.phone,
      claimDate: 'Today, ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pending Verification',
      aiMatchSummary: {
        overallScore: 90,
        imageSimilarity: 92,
        textSimilarity: 88,
        locationProximity: '100% Proximity Match',
        recommendation: 'Ownership details submitted. Awaiting Proctorial Review.'
      }
    };

    setClaims(prev => [newClaim, ...prev]);
    setItems(prev => prev.map(item => item.id === claimData.itemId ? { ...item, status: 'Pending Verification' } : item));

    addToast({
      type: 'success',
      title: 'Claim Request Submitted',
      message: 'Your verification request has been queued for Proctorial Board review.'
    });

    return newClaim;
  };

  const updateClaimStatus = (claimId: string, status: ClaimStatus, notes?: string) => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status,
          adminNotes: notes || c.adminNotes,
          updatedAt: 'Just now'
        };
      }
      return c;
    }));

    const targetClaim = claims.find(c => c.id === claimId);
    if (targetClaim) {
      if (status === 'Approved') {
        setItems(prev => prev.map(it => it.id === targetClaim.itemId ? { ...it, status: 'Claimed' } : it));
        addToast({
          type: 'success',
          title: 'Claim Approved',
          message: `Claim for ${targetClaim.itemName} by ${targetClaim.claimedBy} has been approved.`
        });
      } else if (status === 'Rejected') {
        setItems(prev => prev.map(it => it.id === targetClaim.itemId ? { ...it, status: 'Active' } : it));
        addToast({
          type: 'error',
          title: 'Claim Rejected',
          message: `Claim request for ${targetClaim.itemName} was rejected.`
        });
      } else {
        addToast({
          type: 'warning',
          title: 'Information Requested',
          message: 'Requested additional verification documents from student.'
        });
      }
    }
  };

  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      let quickButtons: { label: string; action: string }[] | undefined = undefined;

      if (lower.includes('id card') || lower.includes('id') || lower.includes('card')) {
        reply = 'Agar aapka College ID card kho gaya hai, aap immediate report file karein taaki library ya security desk par kisi ne submit kiya ho to match ho sake. Aap Admin room 104 se duplicate ID request form bhi le sakte hain.';
        quickButtons = [
          { label: 'Report Lost Item', action: '/report/lost' },
          { label: 'Browse Items', action: '/items' }
        ];
      } else if (lower.includes('phone') || lower.includes('mobile')) {
        reply = 'Mobile phones ke liye hamara AI image feature matching active hai. Kripya phone ka color, case, scratches ya IMEI number ke aakhri 4 digits mention karein.';
        quickButtons = [
          { label: 'Report Lost Item', action: '/report/lost' },
          { label: 'Browse Items', action: '/items' }
        ];
      } else if (lower.includes('claim') || lower.includes('status')) {
        reply = 'Aap "My Claims" section mein jakar apne claims ka current verification status check kar sakte hain. Admin team usually 24-48 hours me review complete karti hai.';
        quickButtons = [
          { label: 'Check My Claims', action: '/claims' },
          { label: 'Talk to Admin', action: '/about' }
        ];
      } else {
        reply = 'Dhanyawad! Main aapki sahayata ke liye tayar hoon. Campus Lost & Found par aap lost/found item register kar sakte hain, campus inventory dekh sakte hain, ya claims initiate kar sakte hain.';
        quickButtons = [
          { label: 'Report Lost Item', action: '/report/lost' },
          { label: 'Report Found Item', action: '/report/found' },
          { label: 'Browse Items', action: '/items' }
        ];
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: 'm-reply-' + Date.now(),
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickButtons
        }
      ]);
    }, 600);
  };

  return (
    <AppContext.Provider
      value={{
        items,
        claims,
        user,
        isAdmin,
        toasts,
        chatMessages,
        searchQuery,
        selectedCategory,
        selectedStatus,
        selectedLocation,
        setSearchQuery,
        setSelectedCategory,
        setSelectedStatus,
        setSelectedLocation,
        loginUser,
        logoutUser,
        addToast,
        removeToast,
        addItemReport,
        submitClaim,
        updateClaimStatus,
        sendChatMessage,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
