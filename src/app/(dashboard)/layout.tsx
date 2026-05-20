export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const hasProfile = (session.user as any).hasProfile;
  const userRole = (session.user as any).role;

  // Only students need onboarding; admins can access dashboard directly
  if (!hasProfile && userRole === 'STUDENT') redirect('/select-country');

  return (
    <DashboardShell user={session.user}>
      {children}
    </DashboardShell>
  );
}
