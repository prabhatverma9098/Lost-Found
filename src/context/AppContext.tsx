import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Item, 
  Claim, 
  UserProfile, 
  ToastMessage, 
  ChatMessage, 
  ClaimStatus, 
  ItemStatus,
  AppNotification, 
  EmailLogEntry 
} from '../types';
import { initialItems, initialClaims, currentUser, adminUser, FIXED_ADMIN_EMAIL } from '../data/mockData';
import { createInitialStatusHistory, appendStatusHistory } from '../services/statusTracking';
import { analyzeClaimRisk } from '../services/fraudDetection';
import { sendCampusEmail, getStoredEmailLogs } from '../services/emailService';
import { calculateLocationMatch, calculateOverallMatchScore } from '../services/locationMatching';

interface AppContextType {
  items: Item[];
  claims: Claim[];
  user: UserProfile;
  isAdmin: boolean;
  toasts: ToastMessage[];
  chatMessages: ChatMessage[];
  notifications: AppNotification[];
  unreadNotificationCount: number;
  emailLogs: EmailLogEntry[];
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
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addItemReport: (newItem: Omit<Item, 'id' | 'reportedBy' | 'reporterRole' | 'reporterRoll' | 'status' | 'statusHistory'>) => Item;
  submitClaim: (claimData: Omit<Claim, 'id' | 'claimedBy' | 'claimerRoll' | 'claimDate' | 'status' | 'riskScore' | 'riskLevel' | 'riskReasons' | 'aiRecommendation'>) => Claim;
  updateClaimStatus: (claimId: string, status: ClaimStatus, notes?: string) => void;
  updateItemStatus: (itemId: string, status: ItemStatus, note?: string) => void;
  sendChatMessage: (text: string) => void;
  resetAllData: () => void;
}

const STORAGE_KEY_ITEMS = 'campus_lf_items_clean_v1';
const STORAGE_KEY_CLAIMS = 'campus_lf_claims_clean_v1';
const STORAGE_KEY_USER = 'campus_lf_user_clean_v1';
const STORAGE_KEY_NOTIFS = 'campus_lf_notifs_clean_v1';

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

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Email Logs
  const [emailLogs, setEmailLogs] = useState<EmailLogEntry[]>(() => getStoredEmailLogs());

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

  // Persist notifications
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Sole criteria for Administrator role: email matches kickshu10@gmail.com
  const isAdmin = user.email.trim().toLowerCase() === FIXED_ADMIN_EMAIL.toLowerCase();

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

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

  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      read: false,
      createdAt: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
    setNotifications([]);
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify([]));
    addToast({
      type: 'info',
      title: 'Data Reset',
      message: 'All records have been reset to a pristine state.'
    });
  };

  const addItemReport = (newItemData: Omit<Item, 'id' | 'reportedBy' | 'reporterRole' | 'reporterRoll' | 'status' | 'statusHistory'>): Item => {
    const id = 'item-' + Date.now();
    const initialHistory = createInitialStatusHistory(user.name);
    
    // Check potential matches with existing opposite-type items
    const oppositeType = newItemData.type === 'lost' ? 'found' : 'lost';
    const candidateMatches = items.filter(it => it.type === oppositeType && it.category === newItemData.category);

    let bestMatchScore = 86;
    let locationScore = 90;
    let imageScore = 92;
    let textScore = 84;

    if (candidateMatches.length > 0) {
      const topCand = candidateMatches[0];
      locationScore = calculateLocationMatch(
        newItemData.location,
        topCand.location,
        newItemData.building,
        topCand.building
      );
      const composite = calculateOverallMatchScore(imageScore, textScore, locationScore);
      bestMatchScore = composite.overallScore;
    }

    const newItem: Item = {
      ...newItemData,
      id,
      reportedBy: `${user.name} (${user.role})`,
      reportedByName: user.name,
      reportedByEmail: user.email,
      reporterRole: user.role,
      reporterRoll: user.rollNo,
      status: 'Reported',
      statusHistory: initialHistory,
      matchScore: bestMatchScore,
      matchTier: bestMatchScore >= 85 ? 'High Match' : 'Possible Match',
      aiTags: [newItemData.category, newItemData.location, 'Neural Visual Verified'],
      aiAnalysis: {
        imageSimilarity: imageScore,
        textSimilarity: textScore,
        locationMatch: locationScore,
        overallScore: bestMatchScore,
      }
    };

    setItems(prev => [newItem, ...prev]);

    // Send in-app notification
    addNotification({
      userId: user.id,
      title: `Report Submitted: ${newItem.name}`,
      message: `Your ${newItem.type} item report is logged and scanning for campus matches.`,
      type: 'new_report',
      relatedItemId: newItem.id,
      link: `/item/${newItem.id}`,
    });

    // If strong match detected, trigger match notification and simulated email
    if (candidateMatches.length > 0) {
      addNotification({
        userId: user.id,
        title: `Possible Match Found for "${newItem.name}"!`,
        message: `Our AI detected a high similarity match (${bestMatchScore}%) near ${newItem.location}.`,
        type: 'ai_match',
        relatedItemId: newItem.id,
        link: `/ai-matches`,
      });

      sendCampusEmail(user.email, user.name, 'AI_MATCH', {
        itemName: newItem.name,
        message: `A potential matching ${oppositeType} item was reported near ${newItem.location}. Review match score and request verification.`,
        trackingId: newItem.id
      }).then(() => setEmailLogs(getStoredEmailLogs()));
    }

    addToast({
      type: 'success',
      title: 'Report Submitted Successfully!',
      message: `Your ${newItem.type} item "${newItem.name}" is now registered in the campus database.`
    });

    return newItem;
  };

  const submitClaim = (claimData: Omit<Claim, 'id' | 'claimedBy' | 'claimerRoll' | 'claimDate' | 'status' | 'riskScore' | 'riskLevel' | 'riskReasons' | 'aiRecommendation'>): Claim => {
    const id = 'claim-' + Date.now();
    const targetItem = items.find(it => it.id === claimData.itemId);

    // Compute AI Fraud & Risk Analysis
    const riskAnalysis = analyzeClaimRisk(
      {
        itemId: claimData.itemId,
        itemName: claimData.itemName,
        reason: claimData.reason,
        additionalDetails: claimData.additionalDetails,
        proofs: claimData.proofs,
        claimedBy: user.name,
        claimerRoll: user.rollNo,
      },
      targetItem,
      claims
    );

    const newClaim: Claim = {
      ...claimData,
      id,
      claimantId: user.id,
      claimedBy: user.name,
      claimerRoll: user.rollNo,
      claimerEmail: user.email,
      claimerPhone: user.phone,
      claimDate: 'Today, ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pending Verification',
      riskScore: riskAnalysis.riskScore,
      riskLevel: riskAnalysis.riskLevel,
      riskReasons: riskAnalysis.riskReasons,
      aiRecommendation: riskAnalysis.aiRecommendation,
      aiMatchSummary: {
        overallScore: 90,
        imageSimilarity: 92,
        textSimilarity: 88,
        locationProximity: '100% Proximity Match',
        recommendation: riskAnalysis.aiRecommendation
      }
    };

    setClaims(prev => [newClaim, ...prev]);

    // Update target item status & history
    if (targetItem) {
      const updatedHistory = appendStatusHistory(
        targetItem.statusHistory,
        'Claim Submitted',
        `Ownership claim filed by ${user.name} (${user.rollNo}).`,
        user.name
      );
      setItems(prev => prev.map(item => item.id === claimData.itemId ? { 
        ...item, 
        status: 'Claim Submitted',
        statusHistory: updatedHistory 
      } : item));
    }

    // In-app notification for student
    addNotification({
      userId: user.id,
      title: 'Claim Request Submitted',
      message: `Your verification request for "${newClaim.itemName}" has been queued for Proctorial Review.`,
      type: 'claim_submitted',
      relatedClaimId: newClaim.id,
      link: '/claims',
    });

    // If suspicious, also notify administrator
    if (riskAnalysis.riskLevel === 'suspicious' || riskAnalysis.riskScore >= 50) {
      addNotification({
        userId: 'admin',
        title: '⚠️ Suspicious Claim Detected',
        message: `High risk score (${riskAnalysis.riskScore}/100) on claim for "${newClaim.itemName}" by ${user.name}.`,
        type: 'suspicious_claim',
        relatedClaimId: newClaim.id,
        link: '/admin',
      });
    }

    // Dispatch email notification
    sendCampusEmail(user.email, user.name, 'CLAIM_SUBMITTED', {
      itemName: newClaim.itemName,
      message: `Your ownership claim has been received. Reference ID: ${newClaim.id}.`,
      trackingId: newClaim.id
    }).then(() => setEmailLogs(getStoredEmailLogs()));

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
      const claimantEmail = targetClaim.claimerEmail || 'student@aksuniversity.ac.in';
      const claimantName = targetClaim.claimedBy;

      if (status === 'Approved') {
        // Update item status and timeline to Approved
        setItems(prev => prev.map(it => {
          if (it.id === targetClaim.itemId) {
            const updatedHistory = appendStatusHistory(
              it.statusHistory,
              'Approved',
              `Claim approved by Proctorial Board. Item ready for collection.`,
              'Proctorial Board'
            );
            return { ...it, status: 'Approved', statusHistory: updatedHistory };
          }
          return it;
        }));

        addNotification({
          userId: targetClaim.claimantId || 'student',
          title: 'Claim Approved! 🎉',
          message: `Your claim for "${targetClaim.itemName}" was approved! Collect it from Security Desk (Admin Room 104).`,
          type: 'claim_approved',
          relatedClaimId: targetClaim.id,
          link: '/claims',
        });

        sendCampusEmail(claimantEmail, claimantName, 'CLAIM_APPROVED', {
          itemName: targetClaim.itemName,
          message: 'Your claim has been verified. Present your campus ID at Central Security to collect your item.',
          trackingId: targetClaim.id
        }).then(() => setEmailLogs(getStoredEmailLogs()));

        addToast({
          type: 'success',
          title: 'Claim Approved',
          message: `Claim for ${targetClaim.itemName} by ${targetClaim.claimedBy} has been approved.`
        });
      } else if (status === 'Rejected') {
        // Return item status back to Searching / Active
        setItems(prev => prev.map(it => {
          if (it.id === targetClaim.itemId) {
            const updatedHistory = appendStatusHistory(
              it.statusHistory,
              'Searching',
              `Claim rejected (${notes || 'Insufficient proof'}). Item returned to active search.`,
              'Proctorial Board'
            );
            return { ...it, status: 'Searching', statusHistory: updatedHistory };
          }
          return it;
        }));

        addNotification({
          userId: targetClaim.claimantId || 'student',
          title: 'Claim Update: Rejected',
          message: `Your claim for "${targetClaim.itemName}" could not be verified. Note: ${notes || 'Proof insufficient'}.`,
          type: 'claim_rejected',
          relatedClaimId: targetClaim.id,
          link: '/claims',
        });

        sendCampusEmail(claimantEmail, claimantName, 'CLAIM_REJECTED', {
          itemName: targetClaim.itemName,
          message: `Claim request rejected. Note: ${notes || 'Ownership details did not match verified inventory item.'}`,
          trackingId: targetClaim.id
        }).then(() => setEmailLogs(getStoredEmailLogs()));

        addToast({
          type: 'error',
          title: 'Claim Rejected',
          message: `Claim request for ${targetClaim.itemName} was rejected.`
        });
      } else {
        // More Information Required
        setItems(prev => prev.map(it => {
          if (it.id === targetClaim.itemId) {
            const updatedHistory = appendStatusHistory(
              it.statusHistory,
              'Under Verification',
              `Additional verification documentation requested by Admin.`,
              'Proctorial Board'
            );
            return { ...it, status: 'Under Verification', statusHistory: updatedHistory };
          }
          return it;
        }));

        addNotification({
          userId: targetClaim.claimantId || 'student',
          title: 'Action Required: Additional Info',
          message: `Admin requested more details for "${targetClaim.itemName}": ${notes || 'Please upload serial or purchase receipt'}.`,
          type: 'more_info',
          relatedClaimId: targetClaim.id,
          link: '/claims',
        });

        sendCampusEmail(claimantEmail, claimantName, 'MORE_INFO', {
          itemName: targetClaim.itemName,
          message: `Please reply with purchase invoice or IMEI/serial number: ${notes || 'Additional verification required.'}`,
          trackingId: targetClaim.id
        }).then(() => setEmailLogs(getStoredEmailLogs()));

        addToast({
          type: 'warning',
          title: 'Information Requested',
          message: 'Requested additional verification documents from student.'
        });
      }
    }
  };

  const updateItemStatus = (itemId: string, status: ItemStatus, note?: string) => {
    const target = items.find(i => i.id === itemId);
    if (!target) return;

    const updatedHistory = appendStatusHistory(
      target.statusHistory,
      status,
      note || `Status updated to ${status} by Administrator.`,
      user.name
    );

    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status,
          statusHistory: updatedHistory,
        };
      }
      return item;
    }));

    if (status === 'Returned') {
      const email = target.reportedByEmail || 'student@aksuniversity.ac.in';
      const name = target.reportedByName || target.reportedBy;

      addNotification({
        userId: target.id,
        title: 'Item Returned! 📦',
        message: `"${target.name}" has officially been marked as returned to verified owner.`,
        type: 'item_returned',
        relatedItemId: target.id,
        link: `/item/${target.id}`,
      });

      sendCampusEmail(email, name, 'ITEM_RETURNED', {
        itemName: target.name,
        message: 'Your item has been physically handed over and closed in campus records.',
        trackingId: target.id
      }).then(() => setEmailLogs(getStoredEmailLogs()));

      addToast({
        type: 'success',
        title: 'Item Marked as Returned',
        message: `${target.name} has been marked as returned.`
      });
    } else {
      addToast({
        type: 'info',
        title: 'Item Status Updated',
        message: `Status of ${target.name} set to ${status}.`
      });
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
        notifications,
        unreadNotificationCount,
        emailLogs,
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
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addItemReport,
        submitClaim,
        updateClaimStatus,
        updateItemStatus,
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
