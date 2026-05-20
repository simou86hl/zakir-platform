import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const [all, profile] = await Promise.all([
      prisma.achievement.findMany({ where: { isActive: true }, orderBy: { xpReward: 'asc' } }),
      prisma.studentProfile.findUnique({
        where: { userId: (session.user as any).id },
        include: { achievements: { select: { achievementId: true, earnedAt: true } } },
      }),
    ]);
    return NextResponse.json({ achievements: all, earned: profile?.achievements || [] });
  } catch { return NextResponse.json({ error: 'خطأ' }, { status: 500 }); }
}
