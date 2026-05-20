import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const countryCode = searchParams.get('country');
    const curricula = await prisma.curriculum.findMany({
      where: countryCode ? { country: { code: countryCode }, isActive: true } : { isActive: true },
      include: {
        country: { select: { code: true, nameAr: true, flag: true } },
        grades: { include: { grade: true }, orderBy: { grade: { level: 'asc' } } },
      },
    });
    return NextResponse.json(curricula);
  } catch { return NextResponse.json({ error: 'خطأ' }, { status: 500 }); }
}
