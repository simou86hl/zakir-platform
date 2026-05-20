export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { DiagnosticQuizClient } from '@/components/quizzes/DiagnosticQuiz';

export const metadata = { title: 'اختبار تحديد المستوى' };

export default async function DiagnosticPage({ params }: { params: { subjectId: string } }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const subject = await prisma.subject.findUnique({
    where: { id: params.subjectId },
    include: {
      diagnosticQuizzes: {
        where: { isActive: true },
        include: { questions: { orderBy: { sortOrder: 'asc' } } },
        take: 1,
      },
    },
  }).catch(() => null);

  if (!subject) notFound();

  const quiz = subject.diagnosticQuizzes[0];

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto space-y-4">
        <div className="text-6xl">🔬</div>
        <h1 className="text-2xl font-black">الاختبار التشخيصي</h1>
        <p className="text-muted-foreground">لم يتم إضافة اختبار تشخيصي لهذه المادة بعد.</p>
        <a href={`/subjects/${params.subjectId}`} className="text-primary hover:underline text-sm block">← العودة للمادة</a>
      </div>
    );
  }

  return (
    <DiagnosticQuizClient
      quiz={quiz}
      subject={{ id: subject.id, nameAr: subject.nameAr, icon: subject.icon || '📚', color: subject.color || '#2563eb' }}
      subjectId={params.subjectId}
    />
  );
}
