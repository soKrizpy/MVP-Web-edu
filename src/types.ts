export type UserRole = 'student' | 'tutor';

export type SeasonalTheme = 'spring_sakura' | 'cyber_neon' | 'autumn_ember' | 'frost_winter';

export type PetSpecies = 'sparky' | 'lumina' | 'chrono';

export type PetStage = 'baby' | 'novice' | 'adept' | 'mythic';

export interface PetStats {
  species: PetSpecies;
  name: string;
  level: number;
  exp: number;
  expToNextLevel: number;
  stage: PetStage;
  hunger: number; // 0-100 (100 = full)
  happiness: number; // 0-100
  attack: number;
  defense: number;
  seasonalTheme: SeasonalTheme;
  battlesWon: number;
  battlesLost: number;
  snacks: {
    wisdomApples: number;
    brainBerries: number;
    codingCookies: number;
  };
}

export type QuizType = 'multiple_choice' | 'fill_blank' | 'code_match' | 'true_false' | 'bug_hunt';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: string | number; // index or string
  explanation: string;
  hint?: string;
}

export interface Topic {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  iconName: string;
  quizzes: QuizQuestion[]; // strictly 5 quizzes per topic
  expReward: number;
  estimatedMinutes: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  score?: number; // 0-100
  stars: number; // 0-3
}

export interface ModuleAssessment {
  id: string;
  title: string;
  description: string;
  passingScore: number; // e.g. 80
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  isUnlocked: boolean;
  isPassed: boolean;
  bestScore?: number;
}

export interface CourseModule {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  bannerColor: string;
  topics: Topic[];
  assessment: ModuleAssessment;
  certificateEligible: boolean;
  certificateEarned?: boolean;
  certificateId?: string;
  progressPercent: number;
}

export interface Certificate {
  id: string;
  moduleId: string;
  moduleTitle: string;
  studentName: string;
  studentEmail: string;
  score: number;
  issueDate: string;
  tutorName: string;
  credentialUrl: string;
  skills: string[];
}

export interface Tutor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  specialties: string[];
  bio: string;
  availableDays: string[];
  timeSlots: string[];
  totalSessionsCompleted: number;
}

export interface OneOnOneSession {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  tutorTitle: string;
  studentName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  hourlyRate: number;
  paidAmount: number;
  paymentMethod: string;
  transactionId: string;
  topicTitle: string;
  meetingNotes?: string;
  roomUrl?: string;
}

export interface StudentAnalytics {
  studentId: string;
  name: string;
  avatar: string;
  email: string;
  topicsCompleted: number;
  totalQuizzesTaken: number;
  accuracyRate: number; // percentage
  studyStreakDays: number;
  totalExp: number;
  petLevel: number;
  lastActive: string;
  weakTopics: string[];
  assessmentScore?: number;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  isCurrentUser?: boolean;
  xp: number;
  streakDays: number;
  petSpecies: PetSpecies;
  petLevel: number;
  petStage: PetStage;
  petName: string;
  powerRating: number;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'milestone' | 'streak' | 'reminder' | 'pet' | 'payment' | 'session';
  read: boolean;
  actionUrl?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiry?: string;
}
