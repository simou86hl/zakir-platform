export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { QuizEngine } from '@/components/quizzes/QuizEngine';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export async function generateMetadata({ params }: { params: { lessonId: string } }) {
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: params.lessonId }, select: { nameAr: true } });
    return { title: `اختبار: ${lesson?.nameAr || ''}` };
  } catch { return { title: 'الاختبار' }; }
}

export default async function QuizPage({ params }: { params: { subjectId: string; lessonId: string } }) {
  await auth();

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      quizzes: {
        where: { isActive: true },
        include: { questions: { orderBy: { sortOrder: 'asc' } } },
        take: 1,
      },
      unit: { include: { subject: { select: { nameAr: true, icon: true } } } },
    },
  }).catch(() => null);

  if (!lesson) notFound();

  const quiz = lesson.quizzes[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <div className="flex items-center gap-3">
        <Link href={`/subjects/${params.subjectId}/lessons/${params.lessonId}`}
          className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs text-muted-foreground">{lesson.unit.subject.icon} {lesson.unit.subject.nameAr}</p>
          <h1 className="text-lg font-black">{lesson.nameAr}</h1>
        </div>
      </div>

      {!quiz || quiz.questions.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <div>
            <h2 className="text-xl font-bold">لا يوجد اختبار</h2>
            <p className="text-muted-foreground">لم يتم إضافة اختبار لهذا الدرس بعد</p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/subjects/${params.subjectId}/lessons/${params.lessonId}`}>العودة للدرس</Link>
          </Button>
        </div>
      ) : (
        <QuizEngine quiz={quiz} subjectId={params.subjectId} lessonId={params.lessonId} />
      )}
    </div>
  );
}
