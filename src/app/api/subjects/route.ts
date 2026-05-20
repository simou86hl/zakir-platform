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
    });
    if (!profile) return NextResponse.json([]);
    const cg = await prisma.curriculumGrade.findFirst({
      where: { curriculumId: profile.curriculumId, gradeId: profile.gradeId },
    });
    if (!cg) return NextResponse.json([]);
    const subjects = await prisma.subject.findMany({
      where: { curriculumGradeId: cg.id, isActive: true },
      include: {
        units: { where: { isActive: true }, include: { _count: { select: { lessons: true } } } },
        subjectProgresses: { where: { studentProfileId: profile.id } },
      },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(subjects);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'خطأ' }, { status: 500 });
  }
}
