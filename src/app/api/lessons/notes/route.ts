import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { lessonId, content } = await req.json();

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (!profile) return NextResponse.json({ error: 'الملف غير موجود' }, { status: 404 });

    const note = await prisma.studentNote.create({
      data: { studentProfileId: profile.id, lessonId, content },
    });
    return NextResponse.json({ success: true, note });
  } catch {
    return NextResponse.json({ error: 'خطأ' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get('lessonId');

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (!profile) return NextResponse.json([]);

    const notes = await prisma.studentNote.findMany({
      where: { studentProfileId: profile.id, ...(lessonId ? { lessonId } : {}) },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(notes);
  } catch {
    return NextResponse.json({ error: 'خطأ' }, { status: 500 });
  }
}
