export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(role)) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <AdminSidebar user={session.user} />
      <div className="flex-1 flex flex-col min-w-0 lg:mr-72">
        <header className="h-14 bg-white dark:bg-slate-900 border-b flex items-center px-6 gap-4 sticky top-0 z-30">
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-muted-foreground">لوحة إدارة منصة ذاكر</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {(session.user as any)?.firstName?.[0]}{(session.user as any)?.lastName?.[0]}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
