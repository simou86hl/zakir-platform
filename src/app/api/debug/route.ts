import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, any> = {};
  
  // Check environment variables
  results.env = {
    DATABASE_URL: process.env.DATABASE_URL ? '✅ SET (' + process.env.DATABASE_URL.substring(0, 30) + '...)' : '❌ MISSING',
    DIRECT_URL: process.env.DIRECT_URL ? '✅ SET (' + process.env.DIRECT_URL.substring(0, 30) + '...)' : '❌ MISSING',
    AUTH_SECRET: process.env.AUTH_SECRET ? '✅ SET' : '❌ MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ SET' : '❌ MISSING',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ MISSING',
    AUTH_URL: process.env.AUTH_URL || '❌ MISSING',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '❌ MISSING',
    NODE_ENV: process.env.NODE_ENV || 'not set',
  };

  // Test database connection
  try {
    const { default: prisma } = await import('@/lib/prisma');
    const userCount = await prisma.user.count();
    results.database = { 
      status: '✅ CONNECTED', 
      userCount,
      users: await prisma.user.findMany({
        select: { email: true, role: true, isActive: true },
        take: 5,
      })
    };
  } catch (error: any) {
    results.database = { 
      status: '❌ FAILED', 
      error: error.message,
      stack: error.stack?.substring(0, 500)
    };
  }

  // Test bcrypt
  try {
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.hash('test', 4);
    const match = await bcrypt.compare('test', hash);
    results.bcrypt = match ? '✅ WORKING' : '❌ NOT WORKING';
  } catch (error: any) {
    results.bcrypt = '❌ ERROR: ' + error.message;
  }

  return NextResponse.json(results, { status: 200 });
}
