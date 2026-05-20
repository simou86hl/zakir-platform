export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, BookOpen, ArrowLeft, Lightbulb, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { MarkCompleteButton } from '@/components/lessons/MarkCompleteButton';

export async function generateMetadata({ params }: { params: { lessonId: string } }) {
  try {
    const l = await prisma.lesson.findUnique({ where: { id: params.lessonId }, select: { nameAr: true } });
    return { title: `ملخص: ${l?.nameAr || ''}` };
  } catch { return { title: 'الملخص' }; }
}

export default async function SummaryPage({ params }: { params: { subjectId: string; lessonId: string } }) {
  await auth();

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      summary: true,
      exercises: { where: { isActive: true }, select: { id: true } },
      quizzes: { where: { isActive: true }, select: { id: true } },
      unit: {
        include: {
          subject: { select: { id: true, nameAr: true, icon: true, color: true } },
          lessons: { where: { isActive: true }, orderBy: { sortOrder: 'asc' }, select: { id: true, nameAr: true, sortOrder: true } },
        },
      },
    },
  }).catch(() => null);

  if (!lesson || !lesson.summary) notFound();

  const summary = lesson.summary;
  const keyPoints = summary.keyPoints as string[];
  const formulas = summary.formulas as any[] | null;

  const lessons = lesson.unit.lessons;
  const idx = lessons.findIndex(l => l.id === params.lessonId);
  const nextLesson = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/subjects/${params.subjectId}/lessons/${params.lessonId}`} className="hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4 icon-rtl" /> الدرس
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">الملخص</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0"
          style={{ backgroundColor: (lesson.unit.subject.color || '#2563eb') + '15' }}>
          {lesson.unit.subject.icon || '📚'}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{lesson.unit.subject.nameAr}</p>
          <h1 className="text-2xl font-black">{lesson.nameAr}</h1>
          <Badge className="mt-1 bg-blue-100 text-blue-700 border-blue-200 text-xs">📋 الملخص الشامل</Badge>
        </div>
      </div>

      {/* Key points */}
      <Card className="shadow-sm border-primary/20 bg-gradient-to-br from-primary/5 to-blue-50 dark:to-blue-950/20">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-black text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            النقاط الرئيسية
          </h2>
          <div className="space-y-3">
            {keyPoints.map((pt, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/60 dark:bg-black/20 rounded-xl p-3.5">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed font-medium">{pt}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulas */}
      {formulas && formulas.length > 0 && (
        <Card className="shadow-sm border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-black text-lg flex items-center gap-2">
              <span className="text-xl">📐</span>
              القوانين والمعادلات المهمة
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {formulas.map((f: any, i: number) => (
                <div key={i} className="bg-white/70 dark:bg-black/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">{f.name}</p>
                  <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3 text-center">
                    <code className="text-base font-mono font-bold text-purple-800 dark:text-purple-200">{f.formula}</code>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Practice section */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-black text-lg mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            تعزيز الفهم
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {lesson.exercises.length > 0 && (
              <Link href={`/subjects/${params.subjectId}/lessons/${params.lessonId}/exercises`}
                className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 rounded-xl hover:shadow-md transition-all card-hover">
                <div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center text-white text-2xl shrink-0">✏️</div>
                <div>
                  <p className="font-bold">التمارين التفاعلية</p>
                  <p className="text-sm text-muted-foreground">{lesson.exercises.length} تمرين متنوع</p>
                </div>
              </Link>
            )}
            {lesson.quizzes.length > 0 && (
              <Link href={`/subjects/${params.subjectId}/lessons/${params.lessonId}/quiz`}
                className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 rounded-xl hover:shadow-md transition-all card-hover">
                <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center text-white text-2xl shrink-0">📝</div>
                <div>
                  <p className="font-bold">اختبار الدرس</p>
                  <p className="text-sm text-muted-foreground">اختبر فهمك</p>
                </div>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mark complete + Next */}
      <div className="flex flex-col sm:flex-row gap-3">
        <MarkCompleteButton lessonId={params.lessonId} subjectId={params.subjectId} />
        {nextLesson && (
          <Button variant="gradient" size="lg" className="flex-1" asChild>
            <Link href={`/subjects/${params.subjectId}/lessons/${nextLesson.id}`}>
              الدرس التالي: {nextLesson.nameAr}
              <ChevronLeft className="h-5 w-5 mr-1" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
