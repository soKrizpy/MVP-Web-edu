import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  CourseModule,
  PetStats,
  SeasonalTheme,
  OneOnOneSession,
  LeaderboardUser,
  PushNotification,
  Certificate,
  StudentAnalytics,
} from '../types';
import {
  INITIAL_MODULES,
  INITIAL_PET,
  MOCK_SESSIONS,
  MOCK_LEADERBOARD,
  INITIAL_NOTIFICATIONS,
  MOCK_STUDENT_ANALYTICS,
  MOCK_TUTORS
} from '../data/mockData';
import { soundFX } from '../utils/audio';

interface AppContextType {
  // User & Role
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    streakDays: number;
    coins: number;
    hearts: number;
    authProvider: 'google' | 'github' | 'apple' | 'email';
    isSynced: boolean;
  };
  tutorUser: {
    id: string;
    name: string;
    title: string;
    avatar: string;
    hourlyRate: number;
    totalEarnings: number;
    availablePayout: number;
    rating: number;
  };

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Sound FX
  soundEnabled: boolean;
  toggleSound: () => void;

  // Learning & Modules
  modules: CourseModule[];
  completeTopic: (moduleId: string, topicId: string, score: number) => void;
  passAssessment: (moduleId: string, score: number) => void;
  certificates: Certificate[];

  // Pet Gamification
  pet: PetStats;
  feedPet: (snackType: 'wisdomApples' | 'brainBerries' | 'codingCookies') => void;
  playWithPet: () => void;
  changePetTheme: (theme: SeasonalTheme) => void;
  addPetExp: (amount: number) => void;
  recordBattleResult: (won: boolean) => void;

  // 1-on-1 Sessions & Video
  sessions: OneOnOneSession[];
  activeSession: OneOnOneSession | null;
  bookSession: (booking: {
    tutorId: string;
    date: string;
    time: string;
    topicTitle: string;
    paymentMethod: string;
    hourlyRate: number;
  }) => OneOnOneSession;
  startVideoCall: (session: OneOnOneSession) => void;
  endVideoCall: () => void;

  // Leaderboard
  leaderboard: LeaderboardUser[];

  // Offline Access
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  offlineCachedModules: string[];
  toggleCacheModule: (moduleId: string) => void;

  // Notifications
  notifications: PushNotification[];
  unreadCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  sendNotification: (notif: Omit<PushNotification, 'id' | 'timestamp' | 'read'>) => void;
  pushPermission: NotificationPermission | 'unsupported';
  requestPushPermission: () => Promise<void>;

  // Tutor Dashboard Data
  studentAnalytics: StudentAnalytics[];
  addCourseModule: (newMod: Partial<CourseModule>) => void;
  requestTutorPayout: (amount: number) => void;

  // Social Auth Modal
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithSocial: (provider: 'google' | 'github' | 'apple') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('lms_theme');
    return (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches))
      ? 'dark'
      : 'light';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [role, setRole] = useState<UserRole>('student');

  // User details
  const [user, setUser] = useState({
    id: 'user-alex',
    name: 'Alex Chen',
    email: 'alex.chen@learn.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    streakDays: 12,
    coins: 460,
    hearts: 5,
    authProvider: 'google' as const,
    isSynced: true,
  });

  // Tutor details (when in tutor role)
  const [tutorUser, setTutorUser] = useState({
    id: 'tut-1',
    name: 'Dr. Sarah Jenkins',
    title: 'Staff Frontend Architect & Educator',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    hourlyRate: 65,
    totalEarnings: 2480,
    availablePayout: 720,
    rating: 4.98,
  });

  // Modules & Topics state
  const [modules, setModules] = useState<CourseModule[]>(() => {
    const saved = localStorage.getItem('lms_modules');
    return saved ? JSON.parse(saved) : INITIAL_MODULES;
  });

  // Pet Tamagotchi State
  const [pet, setPet] = useState<PetStats>(() => {
    const saved = localStorage.getItem('lms_pet');
    return saved ? JSON.parse(saved) : INITIAL_PET;
  });

  // Sessions
  const [sessions, setSessions] = useState<OneOnOneSession[]>(() => {
    const saved = localStorage.getItem('lms_sessions');
    return saved ? JSON.parse(saved) : MOCK_SESSIONS;
  });

  // Active Video Session
  const [activeSession, setActiveSession] = useState<OneOnOneSession | null>(null);

  // Certificates
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('lms_certificates');
    return saved ? JSON.parse(saved) : [];
  });

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(MOCK_LEADERBOARD);

  // Offline Access
  const [isOffline, setIsOffline] = useState(false);
  const [offlineCachedModules, setOfflineCachedModules] = useState<string[]>(['mod-1']);

  // Notifications
  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>('default');

  // Analytics for Tutors
  const [studentAnalytics, setStudentAnalytics] = useState<StudentAnalytics[]>(MOCK_STUDENT_ANALYTICS);

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Apply dark mode class to HTML tag
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lms_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lms_theme', 'light');
    }
  }, [theme]);

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermission(Notification.permission);
    } else {
      setPushPermission('unsupported');
    }
  }, []);

  // Persist modules & pet
  useEffect(() => {
    localStorage.setItem('lms_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('lms_pet', JSON.stringify(pet));
  }, [pet]);

  useEffect(() => {
    localStorage.setItem('lms_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('lms_certificates', JSON.stringify(certificates));
  }, [certificates]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      soundFX.enabled = !prev;
      return !prev;
    });
  };

  // Add EXP to pet and check evolution milestones
  const addPetExp = (amount: number) => {
    setPet(prev => {
      const newExp = prev.exp + amount;
      let newLevel = prev.level;
      let newExpToNext = prev.expToNextLevel;
      let newStage = prev.stage;
      let newAttack = prev.attack;
      let newDefense = prev.defense;

      // Level up formula
      if (newExp >= newExpToNext) {
        newLevel += 1;
        newExpToNext = Math.round(newExpToNext * 1.5);
        newAttack += 8;
        newDefense += 6;

        // Stage evolution check
        if (newLevel >= 6) {
          newStage = 'mythic';
        } else if (newLevel >= 4) {
          newStage = 'adept';
        } else if (newLevel >= 2) {
          newStage = 'novice';
        }

        // Celebrate
        soundFX.playLevelUp();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Push milestone notification
        sendNotification({
          title: `🌟 ${prev.name} Leveled Up to Lv.${newLevel}!`,
          message: `Your pet gained +8 Attack and +6 Defense. Keep studying to reach ${newStage.toUpperCase()} form!`,
          type: 'milestone',
          actionUrl: 'pet'
        });
      }

      return {
        ...prev,
        level: newLevel,
        exp: newExp,
        expToNextLevel: newExpToNext,
        stage: newStage,
        attack: newAttack,
        defense: newDefense,
        hunger: Math.max(0, prev.hunger - 5), // Studying burns energy
      };
    });

    // Update user stats as well
    setUser(prev => ({
      ...prev,
      coins: prev.coins + Math.floor(amount / 4),
    }));
  };

  // Topic quiz completion
  const completeTopic = (moduleId: string, topicId: string, score: number) => {
    setModules(prevMods =>
      prevMods.map(mod => {
        if (mod.id !== moduleId) return mod;

        const updatedTopics = mod.topics.map((top, idx) => {
          if (top.id === topicId) {
            return {
              ...top,
              isCompleted: true,
              score,
              stars: score >= 90 ? 3 : score >= 70 ? 2 : 1,
            };
          }
          return top;
        });

        // Unlock next topic if current is completed
        const completedIndex = updatedTopics.findIndex(t => t.id === topicId);
        if (completedIndex !== -1 && completedIndex + 1 < updatedTopics.length) {
          updatedTopics[completedIndex + 1].isUnlocked = true;
        }

        // Check if all topics are completed -> unlock final assessment
        const allCompleted = updatedTopics.every(t => t.isCompleted);
        const progressPercent = Math.round(
          (updatedTopics.filter(t => t.isCompleted).length / updatedTopics.length) * 100
        );

        return {
          ...mod,
          topics: updatedTopics,
          progressPercent,
          assessment: {
            ...mod.assessment,
            isUnlocked: allCompleted,
          }
        };
      })
    );

    // Reward player with EXP and Pet snack!
    const expAward = 140;
    addPetExp(expAward);

    // Add snack to pet pantry
    setPet(prev => ({
      ...prev,
      snacks: {
        ...prev.snacks,
        wisdomApples: prev.snacks.wisdomApples + 1,
        brainBerries: prev.snacks.brainBerries + 1,
      }
    }));

    sendNotification({
      title: '🍎 Wisdom Snack Earned!',
      message: `You earned 1 Wisdom Apple and +${expAward} EXP for completing the lesson!`,
      type: 'pet'
    });
  };

  // Pass Module Assessment -> issue Certificate
  const passAssessment = (moduleId: string, score: number) => {
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return;

    setModules(prev =>
      prev.map(m => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          certificateEarned: true,
          assessment: {
            ...m.assessment,
            isPassed: true,
            bestScore: Math.max(m.assessment.bestScore || 0, score),
          }
        };
      })
    );

    // Generate certificate
    const certId = `CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const newCert: Certificate = {
      id: certId,
      moduleId,
      moduleTitle: mod.title,
      studentName: user.name,
      studentEmail: user.email,
      score,
      issueDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      tutorName: 'Dr. Sarah Jenkins',
      credentialUrl: `https://luminalms.edu/verify/${certId}`,
      skills: ['TypeScript 5.8', 'React 19 Architecture', 'Async Engineering', 'Performance Auditing']
    };

    setCertificates(prev => [newCert, ...prev]);

    // Confetti fanfare!
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 }
    });
    soundFX.playLevelUp();

    sendNotification({
      title: '🎓 Official Certificate Issued!',
      message: `Congratulations! You passed the capstone with ${score}% and unlocked your verified credential for "${mod.title}".`,
      type: 'milestone',
      actionUrl: 'certificates'
    });
  };

  // Feed Tamagotchi Pet
  const feedPet = (snackType: 'wisdomApples' | 'brainBerries' | 'codingCookies') => {
    if (pet.snacks[snackType] <= 0) return;

    soundFX.playPetFeed();

    setPet(prev => {
      const hungerBoost = snackType === 'wisdomApples' ? 25 : snackType === 'brainBerries' ? 20 : 30;
      const happinessBoost = 15;
      return {
        ...prev,
        hunger: Math.min(100, prev.hunger + hungerBoost),
        happiness: Math.min(100, prev.happiness + happinessBoost),
        snacks: {
          ...prev.snacks,
          [snackType]: prev.snacks[snackType] - 1,
        }
      };
    });
  };

  const playWithPet = () => {
    soundFX.playCorrect();
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
    }));
  };

  const changePetTheme = (newTheme: SeasonalTheme) => {
    setPet(prev => ({ ...prev, seasonalTheme: newTheme }));
    soundFX.playCorrect();
  };

  const recordBattleResult = (won: boolean) => {
    setPet(prev => ({
      ...prev,
      battlesWon: won ? prev.battlesWon + 1 : prev.battlesWon,
      battlesLost: won ? prev.battlesLost : prev.battlesLost + 1,
    }));
    if (won) {
      addPetExp(80);
      setUser(prev => ({ ...prev, coins: prev.coins + 50 }));
    }
  };

  // Book 1-on-1 session with secure simulated payment
  const bookSession = (booking: {
    tutorId: string;
    date: string;
    time: string;
    topicTitle: string;
    paymentMethod: string;
    hourlyRate: number;
  }) => {
    const tutor = MOCK_TUTORS.find(t => t.id === booking.tutorId) || MOCK_TUTORS[0];
    const newSession: OneOnOneSession = {
      id: `sess-${Date.now()}`,
      tutorId: booking.tutorId,
      tutorName: tutor.name,
      tutorAvatar: tutor.avatar,
      tutorTitle: tutor.title,
      studentName: user.name,
      date: booking.date,
      time: booking.time,
      status: 'upcoming',
      hourlyRate: booking.hourlyRate,
      paidAmount: booking.hourlyRate,
      paymentMethod: booking.paymentMethod,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      topicTitle: booking.topicTitle,
      meetingNotes: 'Please come prepared with questions or code repository links for live review.',
    };

    setSessions(prev => [newSession, ...prev]);

    // Send push notification reminder
    sendNotification({
      title: `📅 1-on-1 Session Confirmed with ${tutor.name}`,
      message: `Scheduled for ${booking.date} at ${booking.time}. Payment of $${booking.hourlyRate} securely processed.`,
      type: 'session',
      actionUrl: 'sessions'
    });

    return newSession;
  };

  const startVideoCall = (session: OneOnOneSession) => {
    setActiveSession(session);
  };

  const endVideoCall = () => {
    if (activeSession) {
      setSessions(prev =>
        prev.map(s => (s.id === activeSession.id ? { ...s, status: 'completed' } : s))
      );
    }
    setActiveSession(null);
  };

  // Offline caching
  const toggleCacheModule = (moduleId: string) => {
    setOfflineCachedModules(prev => {
      const exists = prev.includes(moduleId);
      const updated = exists ? prev.filter(id => id !== moduleId) : [...prev, moduleId];
      sendNotification({
        title: exists ? 'Offline Cache Removed' : '⚡ Cached for Offline Study',
        message: exists
          ? `Module is no longer saved locally.`
          : `Module is fully synced! You can complete topics and quizzes without internet.`,
        type: 'reminder'
      });
      return updated;
    });
  };

  // Notifications
  const sendNotification = (notif: Omit<PushNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: PushNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // If browser notifications allowed, trigger system push
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.title, {
          body: notif.message,
          icon: '/public/assets/favicon.ico',
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushPermission(perm);
        if (perm === 'granted') {
          sendNotification({
            title: '🔔 Push Notifications Enabled!',
            message: 'You will receive study streak alerts, pet hunger reminders, and 1-on-1 session countdowns.',
            type: 'reminder'
          });
        }
      } catch (err) {
        console.error('Notification error:', err);
      }
    }
  };

  // Tutor Payout & Course Management
  const addCourseModule = (newMod: Partial<CourseModule>) => {
    const fullMod: CourseModule = {
      id: `mod-${Date.now()}`,
      title: newMod.title || 'New Advanced Course',
      category: newMod.category || 'Specialized Topic',
      level: newMod.level || 'Intermediate',
      description: newMod.description || 'Comprehensive interactive course.',
      bannerColor: 'from-purple-600 to-indigo-800',
      progressPercent: 0,
      certificateEligible: true,
      topics: newMod.topics || [],
      assessment: {
        id: `assess-${Date.now()}`,
        title: `${newMod.title} Final Exam`,
        description: 'Demonstrate mastery to receive certificate.',
        passingScore: 80,
        timeLimitMinutes: 15,
        questions: [],
        isUnlocked: false,
        isPassed: false,
      }
    };
    setModules(prev => [...prev, fullMod]);
    sendNotification({
      title: '📚 New Course Published',
      message: `"${fullMod.title}" is now available for students!`,
      type: 'milestone'
    });
  };

  const requestTutorPayout = (amount: number) => {
    setTutorUser(prev => ({
      ...prev,
      availablePayout: Math.max(0, prev.availablePayout - amount),
      totalEarnings: prev.totalEarnings,
    }));
    sendNotification({
      title: '💵 Payout Transfer Initiated',
      message: `$${amount.toFixed(2)} transfer dispatched to your linked Stripe account. Arriving in 1-2 business days.`,
      type: 'payment'
    });
  };

  const loginWithSocial = (provider: 'google' | 'github' | 'apple') => {
    setUser(prev => ({
      ...prev,
      authProvider: provider,
      isSynced: true,
    }));
    setIsAuthModalOpen(false);
    sendNotification({
      title: '🔒 Account Synced',
      message: `Successfully connected and synced progress via ${provider.toUpperCase()}.`,
      type: 'reminder'
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        user,
        tutorUser,
        theme,
        toggleTheme,
        soundEnabled,
        toggleSound,
        modules,
        completeTopic,
        passAssessment,
        certificates,
        pet,
        feedPet,
        playWithPet,
        changePetTheme,
        addPetExp,
        recordBattleResult,
        sessions,
        activeSession,
        bookSession,
        startVideoCall,
        endVideoCall,
        leaderboard,
        isOffline,
        setIsOffline,
        offlineCachedModules,
        toggleCacheModule,
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendNotification,
        pushPermission,
        requestPushPermission,
        studentAnalytics,
        addCourseModule,
        requestTutorPayout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithSocial,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
