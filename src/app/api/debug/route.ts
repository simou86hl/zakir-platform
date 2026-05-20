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
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      results.databaseUrlInfo = {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        searchParams: Object.fromEntries(url.searchParams.entries()),
        username: url.username,
        passwordLength: url.password?.length || 0,
      };
    } catch (e: any) {
      results.databaseUrlInfo = { error: 'Invalid URL: ' + e.message };
    }
  }

  // Test database connection
  try {
    const { default: prisma } = await import('@/lib/prisma');
    const userCount = await prisma.user.count();
    results.database = { 
      status: 'CONNECTED', 
      userCount,
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

  return NextResponse.json(results, { status: 200 });
}
