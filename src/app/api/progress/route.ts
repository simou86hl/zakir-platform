import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: (session.user as any).id },
      include: {
        subjectProgresses: { include: { subject: { select: { nameAr: true, icon: true, color: true } } } },
        dailyActivities: { orderBy: { date: 'desc' }, take: 30 },
      },
    });
    return NextResponse.json(profile);
  } catch { return NextResponse.json({ error: 'خطأ' }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await req.json();
    const { type, subjectId, score, level } = body;

    if (type === 'diagnostic' && subjectId) {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: (session.user as any).id },
      });
      if (!profile) return NextResponse.json({ error: 'الملف غير موجود' }, { status: 404 });

      const totalLessons = await prisma.lesson.count({
        where: { unit: { subjectId }, isActive: true },
      });

      const sp = await prisma.subjectProgress.upsert({
        where: { studentProfileId_subjectId: { studentProfileId: profile.id, subjectId } },
        update: { diagnosticScore: score, diagnosticLevel: level },
        create: {
          studentProfileId: profile.id,
          subjectId,
          diagnosticScore: score,
          diagnosticLevel: level,
          totalLessons,
        },
      });
      return NextResponse.json({ success: true, sp });
    }

    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'خطأ' }, { status: 500 }); }
}
