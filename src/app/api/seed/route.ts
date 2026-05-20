import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ message: 'شغّل: npx tsx data/seed/index.ts' });
}
