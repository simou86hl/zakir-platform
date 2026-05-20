export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { UnitQuizClient } from '@/components/quizzes/UnitQuiz';

export const metadata = { title: 'اختبار الوحدة' };

export default async function UnitQuizPage({ params }: { params: { subjectId: string; unitId: string } }) {
  await auth();

  const unit = await prisma.unit.findUnique({
    where: { id: params.unitId },
    include: {
      subject: { select: { id: true, nameAr: true, icon: true, color: true } },
      lessons: {
        where: { isActive: true },
        include: {
          exercises: {
            where: { isActive: true },
            orderBy: { difficulty: 'asc' },
            take: 3,
          },
        },
      },
    },
  }).catch(() => null);

  if (!unit) notFound();

  // Build unit quiz from lesson exercises
  const allExercises = unit.lessons.flatMap(l => l.exercises).sort(() => Math.random() - 0.5).slice(0, 15);

  return (
    <div className="max-w-2xl mx-auto py-4">
      <UnitQuizClient
        unit={{ id: unit.id, nameAr: unit.nameAr }}
        subject={unit.subject}
        exercises={allExercises}
        subjectId={params.subjectId}
      />
    </div>
  );
}
