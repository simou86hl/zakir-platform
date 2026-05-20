'use server';

import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// ==================== تحديث تقدم الدرس ====================
export async function updateLessonProgress(lessonId: string, data: {
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED';
  completionRate?: number;
  timeSpent?: number;
}) {
  try {
    const session = await auth();
    if (!session?.user) return { error: 'غير مصرح' };
    const userId = (session.user as any).id;

    const { default: prisma } = await import('@/lib/prisma');
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) return { error: 'الملف الشخصي غير موجود' };

    const progress = await prisma.lessonProgress.upsert({
      where: { studentProfileId_lessonId: { studentProfileId: profile.id, lessonId } },
      update: {
        ...data,
        lastAccessedAt: new Date(),
        ...(data.status === 'COMPLETED' ? { completedAt: new Date() } : {}),
      },
      create: {
        studentProfileId: profile.id,
        lessonId,
        status: data.status || 'IN_PROGRESS',
        completionRate: data.completionRate || 0,
        timeSpent: data.timeSpent || 0,
        lastAccessedAt: new Date(),
      },
    });

    // اكسب نقاط عند الإكمال
    if (data.status === 'COMPLETED') {
      await prisma.studentProfile.update({
        where: { id: profile.id },
        data: {
          totalPoints: { increment: 15 },
          totalXP: { increment: 15 },
        },
      });

      // تحديث تقدم المادة
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { unit: { include: { subject: true } } },
      });

      if (lesson) {
        const subjectId = lesson.unit.subjectId;
        const totalLessons = await prisma.lesson.count({
          where: { unit: { subjectId }, isActive: true },
        });
        const completedLessons = await prisma.lessonProgress.count({
          where: { studentProfileId: profile.id, lesson: { unit: { subjectId } }, status: 'COMPLETED' },
        });

        await prisma.subjectProgress.upsert({
          where: { studentProfileId_subjectId: { studentProfileId: profile.id, subjectId } },
          update: { completedLessons, totalLessons, lastAccessedAt: new Date() },
          create: {
            studentProfileId: profile.id,
            subjectId,
            completedLessons,
            totalLessons,
          },
        });
      }

      // تحديث النشاط اليومي
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await prisma.dailyActivity.upsert({
        where: { studentProfileId_date: { studentProfileId: profile.id, date: today } },
        update: { lessonsCompleted: { increment: 1 }, pointsEarned: { increment: 15 } },
        create: {
          studentProfileId: profile.id,
          date: today,
          lessonsCompleted: 1,
          pointsEarned: 15,
          studyTime: Math.floor((data.timeSpent || 0) / 60),
        },
      });

      // تحقق من الإنجازات
      await checkAndGrantAchievements(profile.id, prisma);
    }

    revalidatePath('/dashboard');
    return { success: true, progress };
  } catch (error) {
    console.error('[Lesson] Progress error:', error);
    return { error: 'حدث خطأ في تحديث التقدم' };
  }
}

// ==================== تسجيل محاولة تمرين ====================
export async function submitExerciseAttempt(exerciseId: string, answer: any, timeSpent: number, hintsUsed = 0) {
  try {
    const session = await auth();
    if (!session?.user) return { error: 'غير مصرح', isCorrect: false, pointsEarned: 0 };
    const userId = (session.user as any).id;

    const { default: prisma } = await import('@/lib/prisma');
    const [profile, exercise] = await Promise.all([
      prisma.studentProfile.findUnique({ where: { userId } }),
      prisma.exercise.findUnique({ where: { id: exerciseId } }),
    ]);
    if (!profile || !exercise) return { error: 'خطأ', isCorrect: false, pointsEarned: 0 };

    // التحقق من الإجابة
    const isCorrect = checkAnswer(exercise.type, exercise.correctAnswer, answer);
    const basePoints = exercise.points || 10;
    const hintPenalty = hintsUsed * 2;
    const pointsEarned = isCorrect ? Math.max(basePoints - hintPenalty, 2) : 0;

    await prisma.exerciseAttempt.create({
      data: {
        studentProfileId: profile.id,
        exerciseId,
        answer,
        isCorrect,
        timeSpent,
        hintsUsed,
        pointsEarned,
      },
    });

    if (isCorrect && pointsEarned > 0) {
      await prisma.studentProfile.update({
        where: { id: profile.id },
        data: {
          totalPoints: { increment: pointsEarned },
          totalXP: { increment: pointsEarned },
        },
      });
      await prisma.dailyActivity.upsert({
        where: { studentProfileId_date: { studentProfileId: profile.id, date: new Date(new Date().setHours(0,0,0,0)) } },
        update: { exercisesDone: { increment: 1 }, pointsEarned: { increment: pointsEarned } },
        create: {
          studentProfileId: profile.id,
          date: new Date(new Date().setHours(0,0,0,0)),
          exercisesDone: 1,
          pointsEarned,
        },
      });
    }

    return {
      success: true,
      isCorrect,
      pointsEarned,
      explanation: exercise.explanation,
      correctAnswer: exercise.correctAnswer,
    };
  } catch (error) {
    console.error('[Exercise] Submit error:', error);
    return { error: 'حدث خطأ', isCorrect: false, pointsEarned: 0 };
  }
}

// ==================== تسجيل محاولة اختبار ====================
export async function submitQuizAttempt(quizId: string, answers: Record<string, any>, timeSpent: number) {
  try {
    const session = await auth();
    if (!session?.user) return { error: 'غير مصرح' };
    const userId = (session.user as any).id;

    const { default: prisma } = await import('@/lib/prisma');
    const [profile, quiz] = await Promise.all([
      prisma.studentProfile.findUnique({ where: { userId } }),
      prisma.quiz.findUnique({
        where: { id: quizId },
        include: { questions: true },
      }),
    ]);
    if (!profile || !quiz) return { error: 'خطأ' };

    let earnedPoints = 0;
    const totalPoints = quiz.questions.reduce((a, q) => a + q.points, 0);
    const questionResults = quiz.questions.map(q => {
      const isCorrect = checkAnswer(q.type, q.correctAnswer, answers[q.id]);
      const pts = isCorrect ? q.points : 0;
      earnedPoints += pts;
      return { questionId: q.id, isCorrect, points: pts, correctAnswer: q.correctAnswer, explanation: q.explanation };
    });

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const isPassed = score >= quiz.passingScore;

    const attemptCount = await prisma.quizAttempt.count({
      where: { studentProfileId: profile.id, quizId },
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        studentProfileId: profile.id,
        quizId,
        score,
        totalPoints,
        earnedPoints,
        timeSpent,
        answers,
        isPassed,
        attemptNumber: attemptCount + 1,
      },
    });

    if (isPassed) {
      await prisma.studentProfile.update({
        where: { id: profile.id },
        data: {
          totalPoints: { increment: earnedPoints + 20 },
          totalXP: { increment: earnedPoints + 20 },
        },
      });
    }

    revalidatePath('/dashboard');
    return { success: true, score, isPassed, earnedPoints, totalPoints, questionResults, attemptId: attempt.id };
  } catch (error) {
    console.error('[Quiz] Submit error:', error);
    return { error: 'حدث خطأ في تقديم الاختبار' };
  }
}

// ==================== إضافة/إزالة إشارة مرجعية ====================
export async function toggleBookmark(lessonId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: 'غير مصرح' };
    const userId = (session.user as any).id;

    const { default: prisma } = await import('@/lib/prisma');
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) return { error: 'الملف غير موجود' };

    const existing = await prisma.bookmark.findUnique({
      where: { studentProfileId_lessonId: { studentProfileId: profile.id, lessonId } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return { success: true, bookmarked: false };
    } else {
      await prisma.bookmark.create({ data: { studentProfileId: profile.id, lessonId } });
      return { success: true, bookmarked: true };
    }
  } catch {
    return { error: 'حدث خطأ' };
  }
}

// ==================== بدء/إنهاء جلسة دراسة ====================
export async function startStudySession(subjectId?: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: 'غير مصرح' };
    const { default: prisma } = await import('@/lib/prisma');
    const profile = await prisma.studentProfile.findUnique({ where: { userId: (session.user as any).id } });
    if (!profile) return { error: 'خطأ' };

    const studySession = await prisma.studySession.create({
      data: { studentProfileId: profile.id, subjectStudied: subjectId },
    });
    return { success: true, sessionId: studySession.id };
  } catch { return { error: 'خطأ' }; }
}

export async function endStudySession(sessionId: string, stats: { lessonsCompleted: number; exercisesDone: number; pointsEarned: number }) {
  try {
    const { default: prisma } = await import('@/lib/prisma');
    const studySession = await prisma.studySession.findUnique({ where: { id: sessionId } });
    if (!studySession) return { error: 'الجلسة غير موجودة' };

    const duration = Math.floor((Date.now() - studySession.startedAt.getTime()) / 1000);
    await prisma.studySession.update({
      where: { id: sessionId },
      data: { endedAt: new Date(), duration, ...stats },
    });

    // تحديث streak
    const profile = await prisma.studentProfile.findUnique({ where: { id: studySession.studentProfileId } });
    if (profile) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const hadActivityYesterday = await prisma.dailyActivity.findFirst({
        where: { studentProfileId: profile.id, date: { gte: yesterday } },
      });

      const newStreak = hadActivityYesterday ? profile.studyStreak + 1 : 1;
      await prisma.studentProfile.update({
        where: { id: profile.id },
        data: { studyStreak: newStreak, lastActiveAt: new Date() },
      });
    }

    return { success: true, duration };
  } catch { return { error: 'خطأ' }; }
}

// ==================== دوال مساعدة ====================
function checkAnswer(type: string, correctAnswer: any, userAnswer: any): boolean {
  if (!userAnswer) return false;
  try {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return String(userAnswer?.id || userAnswer) === String(correctAnswer?.id || correctAnswer);
      case 'TRUE_FALSE':
        return Boolean(userAnswer?.value ?? userAnswer) === Boolean(correctAnswer?.value ?? correctAnswer);
      case 'FILL_BLANK': {
        const accepted = correctAnswer?.answers || [];
        const user = String(userAnswer?.value || userAnswer).trim().toLowerCase();
        return accepted.some((a: string) => a.toLowerCase() === user);
      }
      case 'SHORT_ANSWER': {
        const accepted = correctAnswer?.acceptedAnswers || [];
        const user = String(userAnswer?.value || userAnswer).trim().toLowerCase();
        return accepted.some((a: string) => a.toLowerCase() === user);
      }
      case 'ORDERING': {
        const correct = correctAnswer?.correctOrder || [];
        const user = userAnswer?.order || [];
        return JSON.stringify(correct) === JSON.stringify(user);
      }
      case 'MATCHING': {
        const correct = correctAnswer?.pairs || {};
        const user = userAnswer?.matches || {};
        return JSON.stringify(correct) === JSON.stringify(user);
      }
      default:
        return String(userAnswer) === String(correctAnswer);
    }
  } catch { return false; }
}

async function checkAndGrantAchievements(profileId: string, prisma: any) {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { id: profileId },
      include: {
        lessonProgresses: { where: { status: 'COMPLETED' } },
        exerciseAttempts: { where: { isCorrect: true } },
        achievements: true,
      },
    });
    if (!profile) return;

    const earnedIds = new Set(profile.achievements.map((a: any) => a.achievementId));
    const completedLessons = profile.lessonProgresses.length;
    const correctExercises = profile.exerciseAttempts.length;

    const allAch = await prisma.achievement.findMany({ where: { isActive: true } });

    for (const ach of allAch) {
      if (earnedIds.has(ach.id)) continue;
      const cond = ach.condition as any;
      let earned = false;

      if (ach.type === 'LESSONS_COUNT' && completedLessons >= (cond.lessons || 1)) earned = true;
      if (ach.type === 'EXERCISES_COUNT' && correctExercises >= (cond.exercises || 1)) earned = true;
      if (ach.type === 'STREAK' && profile.studyStreak >= (cond.streak || 1)) earned = true;
      if (ach.type === 'LEVEL_UP' && profile.level >= (cond.level || 2)) earned = true;

      if (earned) {
        await prisma.studentAchievement.create({ data: { studentProfileId: profileId, achievementId: ach.id } }).catch(() => {});
        if (ach.xpReward > 0) {
          await prisma.studentProfile.update({
            where: { id: profileId },
            data: { totalXP: { increment: ach.xpReward }, totalPoints: { increment: ach.xpReward } },
          });
        }
      }
    }
  } catch (e) { console.error('Achievement check error:', e); }
}
