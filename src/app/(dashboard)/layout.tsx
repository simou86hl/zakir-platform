export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { MobileNav } from '@/components/layout/MobileNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const hasProfile = (session.user as any).hasProfile;
  if (!hasProfile) redirect('/select-country');

  return (
    <div className="min-h-screen bg-muted/20 flex">
      <Sidebar user={session.user} />
      <div className="flex-1 flex flex-col min-w-0 lg:mr-64">
        <DashboardHeader user={session.user} />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-auto">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
