import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, any> = {};
  
  // Check ALL environment variables
  results.env = {
    DATABASE_URL: process.env.DATABASE_URL ? 'SET (length: ' + process.env.DATABASE_URL.length + ')' : 'MISSING',
    DIRECT_URL: process.env.DIRECT_URL ? 'SET (length: ' + process.env.DIRECT_URL.length + ')' : 'MISSING',
    AUTH_SECRET: process.env.AUTH_SECRET ? 'SET' : 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
    AUTH_URL: process.env.AUTH_URL || 'MISSING',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'MISSING',
    NODE_ENV: process.env.NODE_ENV || 'not set',
  };

  // Show DATABASE_URL structure (hide password)
  const dbUrlToCheck = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (dbUrlToCheck) {
    try {
      const url = new URL(dbUrlToCheck);
      results.dbUrlInfo = {
        hostname: url.hostname,
        port: url.port,
        isPooler: url.hostname.includes('pooler.supabase.com'),
        isDirect: url.hostname.includes('db.'),
      };
    } catch (e: any) {
      results.dbUrlInfo = { error: 'Invalid URL: ' + e.message };
    }
  }

  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      results.databaseUrlInfo = {
        hostname: url.hostname,
        port: url.port,
        isPooler: url.hostname.includes('pooler.supabase.com'),
        isDirect: url.hostname.includes('db.'),
      };
    } catch (e: any) {
      results.databaseUrlInfo = { error: 'Invalid URL: ' + e.message };
    }
  }

  // Test database connection
  try {
    const { default: prisma } = await import('@/lib/prisma');
    const userCount = await prisma.user.count();
    const subjectCount = await prisma.subject.count();
    const profileCount = await prisma.studentProfile.count();
    results.database = { 
      status: 'CONNECTED', 
      userCount,
      subjectCount,
      profileCount,
    };
  } catch (error: any) {
    results.database = { 
      status: 'FAILED', 
      error: error.message?.substring(0, 500),
      errorCode: error.code,
    };
  }

  // Test bcrypt
  try {
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.hash('test', 4);
    const match = await bcrypt.compare('test', hash);
    results.bcrypt = match ? 'WORKING' : 'NOT WORKING';
  } catch (error: any) {
    results.bcrypt = 'ERROR: ' + error.message;
  }

  // Test subjects query for student@zakir.edu
  try {
    const { default: prisma } = await import('@/lib/prisma');
    const student = await prisma.user.findUnique({ where: { email: 'student@zakir.edu' } });
    if (student) {
      const profile = await prisma.studentProfile.findUnique({ where: { userId: student.id } });
      if (profile) {
        const cg = await prisma.curriculumGrade.findFirst({
          where: { curriculumId: profile.curriculumId, gradeId: profile.gradeId },
        });
        const subjects = cg ? await prisma.subject.findMany({
          where: { curriculumGradeId: cg.id, isActive: true },
        }) : [];
        results.studentTest = {
          userId: student.id,
          profileId: profile.id,
          curriculumId: profile.curriculumId,
          gradeId: profile.gradeId,
          curriculumGradeId: cg?.id || null,
          subjectsCount: subjects.length,
          subjectNames: subjects.map(s => s.nameAr),
        };
      } else {
        results.studentTest = { error: 'No profile found for student@zakir.edu' };
      }
    } else {
      results.studentTest = { error: 'User student@zakir.edu not found' };
    }
  } catch (error: any) {
    results.studentTest = { error: error.message?.substring(0, 300) };
  }

  return NextResponse.json(results, { status: 200 });
}
