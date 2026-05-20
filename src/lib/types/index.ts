import type { User, StudentProfile, Subject, Lesson, Quiz, Exercise } from '@prisma/client';

export type { User, StudentProfile, Subject, Lesson, Quiz, Exercise };

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  hasProfile: boolean;
  avatar?: string;
}

export interface DashboardStats {
  totalLessonsCompleted: number;
  totalExercisesDone: number;
  totalStudyHours: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  currentLevel: number;
  xpToNextLevel: number;
}

export interface SubjectWithProgress extends Subject {
  progress: number;
  completedLessons: number;
}
