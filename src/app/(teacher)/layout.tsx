export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { TeacherShell } from '@/components/layout/TeacherShell';

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== 'TEACHER') redirect('/dashboard');

  return (
    <TeacherShell user={session.user}>
      {children}
    </TeacherShell>
  );
}
