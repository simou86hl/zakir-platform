import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!['ADMIN', 'SUPER_ADMIN'].includes(role || '')) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const [users, subjects, lessons, subs] = await Promise.all([
      prisma.user.count(),
      prisma.subject.count(),
      prisma.lesson.count({ where: { isActive: true } }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    ]);
    return NextResponse.json({ users, subjects, lessons, activeSubscriptions: subs });
  } catch { return NextResponse.json({ error: 'خطأ' }, { status: 500 }); }
}
