export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminShell } from '@/components/layout/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(role)) redirect('/dashboard');

  return (
    <AdminShell user={session.user}>
      {children}
    </AdminShell>
  );
}
