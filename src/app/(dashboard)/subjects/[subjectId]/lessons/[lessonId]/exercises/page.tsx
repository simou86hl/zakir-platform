export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ExerciseEngine } from '@/components/exercises/ExerciseEngine';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export async function generateMetadata({ params }: { params: { lessonId: string } }) {
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: params.lessonId }, select: { nameAr: true } });
    return { title: `تمارين: ${lesson?.nameAr || ''}` };
  } catch { return { title: 'التمارين' }; }
}

export default async function ExercisesPage({ params }: { params: { subjectId: string; lessonId: string } }) {
  await auth();

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      exercises: {
        where: { isActive: true },
        orderBy: [{ difficulty: 'asc' }, { sortOrder: 'asc' }],
      },
      unit: { include: { subject: { select: { nameAr: true, icon: true, color: true } } } },
    },
  }).catch(() => null);

  if (!lesson) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/subjects/${params.subjectId}/lessons/${params.lessonId}`}
          className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span>{lesson.unit.subject.icon}</span>
            {lesson.unit.subject.nameAr}
          </p>
          <h1 className="text-lg font-black">{lesson.nameAr}</h1>
        </div>
        <div className="mr-auto bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
          {lesson.exercises.length} تمرين
        </div>
      </div>

      {/* Exercises */}
      {lesson.exercises.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <div>
            <h2 className="text-xl font-bold">لا توجد تمارين بعد</h2>
            <p className="text-muted-foreground">لم يتم إضافة تمارين لهذا الدرس</p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/subjects/${params.subjectId}/lessons/${params.lessonId}`}>العودة للدرس</Link>
          </Button>
        </div>
      ) : (
        <ExerciseEngine
          exercises={lesson.exercises}
          lessonId={params.lessonId}
          subjectId={params.subjectId}
        />
      )}
    </div>
  );
}
