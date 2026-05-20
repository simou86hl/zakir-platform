'use server';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const profileSchema = z.object({
  countryCode: z.string().length(2),
  curriculumId: z.string().min(1),
  gradeId: z.string().min(1),
  educationLevel: z.enum(['PRIMARY', 'MIDDLE', 'SECONDARY']),
  planType: z.enum(['FREE', 'BASIC', 'PRO']),
  academicYear: z.string().default('2024-2025'),
  weeklyGoalHours: z.number().min(1).max(40).default(10),
});

export async function createStudentProfile(data: z.infer<typeof profileSchema>) {
  try {
    const session = await auth();
    if (!session?.user) return { error: 'غير مصرح' };

    const userId = (session.user as any).id;
    const validated = profileSchema.parse(data);

    const { default: prisma } = await import('@/lib/prisma');

    // Get country
    const country = await prisma.country.findUnique({ where: { code: validated.countryCode } });
    if (!country) return { error: 'الدولة غير موجودة' };

    // Get curriculum grade
    const curriculumGrade = await prisma.curriculumGrade.findFirst({
      where: { curriculumId: validated.curriculumId, gradeId: validated.gradeId },
    });

    // Create or update profile
    const profile = await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        countryId: country.id,
        curriculumId: validated.curriculumId,
        gradeId: validated.gradeId,
        educationLevel: validated.educationLevel,
        academicYear: validated.academicYear,
        weeklyGoalHours: validated.weeklyGoalHours,
      },
      create: {
        userId,
        countryId: country.id,
        curriculumId: validated.curriculumId,
        gradeId: validated.gradeId,
        educationLevel: validated.educationLevel,
        academicYear: validated.academicYear,
        weeklyGoalHours: validated.weeklyGoalHours,
      },
    });

    // Assign free plan if selected
    const plan = await prisma.plan.findFirst({ where: { type: validated.planType } });
    if (plan) {
      const endDate = new Date();
      if (validated.planType === 'FREE') endDate.setFullYear(endDate.getFullYear() + 10);
      else endDate.setMonth(endDate.getMonth() + 1);

      await prisma.subscription.upsert({
        where: { userId },
        update: { planId: plan.id, status: validated.planType === 'FREE' ? 'TRIAL' : 'ACTIVE' },
        create: {
          userId,
          planId: plan.id,
          status: validated.planType === 'FREE' ? 'TRIAL' : 'ACTIVE',
          billingCycle: 'MONTHLY',
          endDate,
        },
      });
    }

    // Grant first achievement
    const firstAchievement = await prisma.achievement.findFirst({ where: { type: 'LESSONS_COUNT' } });
    if (firstAchievement) {
      await prisma.studentAchievement.upsert({
        where: { studentProfileId_achievementId: { studentProfileId: profile.id, achievementId: firstAchievement.id } },
        update: {},
        create: { studentProfileId: profile.id, achievementId: firstAchievement.id },
      }).catch(() => {});
    }

    return { success: true, profileId: profile.id };
  } catch (error) {
    console.error('[Onboarding] Error:', error);
    if (error instanceof z.ZodError) return { error: error.errors[0].message };
    return { error: 'حدث خطأ أثناء إنشاء الملف الشخصي' };
  }
}

export async function getOnboardingData(countryCode?: string) {
  try {
    const { default: prisma } = await import('@/lib/prisma');
    const [countries, curricula] = await Promise.all([
      prisma.country.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      countryCode
        ? prisma.curriculum.findMany({
            where: { country: { code: countryCode }, isActive: true },
            include: { grades: { include: { grade: true }, orderBy: { grade: { level: 'asc' } } } },
          })
        : Promise.resolve([]),
    ]);
    return { countries, curricula };
  } catch {
    return { countries: [], curricula: [] };
  }
}
