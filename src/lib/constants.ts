export const APP_NAME = 'ذاكر';
export const APP_DESCRIPTION = 'منصة تعليمية عربية شاملة';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const EDUCATION_STAGES = {
  PRIMARY: { nameAr: 'المرحلة الابتدائية', grades: [1, 2, 3, 4, 5, 6] },
  MIDDLE: { nameAr: 'المرحلة المتوسطة', grades: [7, 8, 9] },
  SECONDARY: { nameAr: 'المرحلة الثانوية', grades: [10, 11, 12] },
} as const;

export const PLAN_FEATURES = {
  FREE: { maxSubjects: 1, freeLessons: 5, hasAnalytics: false, hasDownloads: false },
  BASIC: { maxSubjects: 5, freeLessons: null, hasAnalytics: true, hasDownloads: true },
  PRO: { maxSubjects: null, freeLessons: null, hasAnalytics: true, hasDownloads: true },
} as const;

export const XP_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];

export const POINTS = {
  CORRECT_EXERCISE: 10,
  FIRST_ATTEMPT_BONUS: 5,
  QUIZ_PASS: 20,
  LESSON_COMPLETE: 15,
  STREAK_DAY: 5,
  HINT_PENALTY: -2,
} as const;

export const DIFFICULTY_LABELS = {
  EASY: { ar: 'سهل', color: 'text-green-600 bg-green-50' },
  MEDIUM: { ar: 'متوسط', color: 'text-yellow-600 bg-yellow-50' },
  HARD: { ar: 'صعب', color: 'text-red-600 bg-red-50' },
} as const;

export const PROGRESS_STATUS_LABELS = {
  NOT_STARTED: { ar: 'لم يبدأ', color: 'text-gray-500' },
  IN_PROGRESS: { ar: 'جارٍ', color: 'text-blue-500' },
  COMPLETED: { ar: 'مكتمل', color: 'text-green-500' },
  REVIEWED: { ar: 'تمت المراجعة', color: 'text-purple-500' },
} as const;

export const SUBJECT_COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#dc2626',
  '#ea580c', '#d97706', '#16a34a', '#0891b2',
  '#0284c7', '#4f46e5',
] as const;

export const SUBJECT_ICONS = [
  '📐', '🔢', '🧪', '🌿', '📚', '🌍', '🎨', '💻', '🏛️', '⚗️',
  '🔭', '📖', '✏️', '🎵', '🏃', '🌐', '🧮', '🔬',
] as const;
