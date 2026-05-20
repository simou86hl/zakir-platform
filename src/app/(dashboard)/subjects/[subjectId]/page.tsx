export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, CheckCircle2, Lock, ChevronDown, Target, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export async function generateMetadata({ params }: { params: { subjectId: string } }) {
  try {
    const subject = await prisma.subject.findUnique({ where: { id: params.subjectId } });
    return { title: subject?.nameAr || 'المادة' };
  } catch { return { title: 'المادة' }; }
}

const difficultyLabel: Record<string, { label: string; color: string }> = {
  EASY:   { label: 'سهل',   color: 'bg-green-100 text-green-700'  },
  MEDIUM: { label: 'متوسط', color: 'bg-yellow-100 text-yellow-700' },
  HARD:   { label: 'صعب',   color: 'bg-red-100 text-red-700'      },
};
const statusInfo: Record<string, { label: string; icon: string }> = {
  NOT_STARTED: { label: 'لم يبدأ',      icon: '⭕' },
  IN_PROGRESS: { label: 'جارٍ',          icon: '🔄' },
  COMPLETED:   { label: 'مكتمل',         icon: '✅' },
  REVIEWED:    { label: 'تمت المراجعة', icon: '📝' },
};

export default async function SubjectPage({ params }: { params: { subjectId: string } }) {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  let subject, profile, lessonProgresses;
  let dbError: string | null = null;
  try {
    console.log('[SubjectDetail] Fetching subject:', params.subjectId, 'for user:', userId);
    [subject, profile] = await Promise.all([
      prisma.subject.findUnique({
        where: { id: params.subjectId },
        include: {
          units: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            include: {
              lessons: {
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' },
                select: { id: true, nameAr: true, estimatedTime: true, difficulty: true, isFree: true, description: true },
              },
            },
          },
          subjectProgresses: true,
          diagnosticQuizzes: { where: { isActive: true }, select: { id: true } },
        },
      }),
      prisma.studentProfile.findUnique({ where: { userId } }),
    ]);

    console.log('[SubjectDetail] Subject found:', !!subject, 'Profile found:', !!profile);

    if (!subject) {
      console.log('[SubjectDetail] Subject not found for id:', params.subjectId);
      notFound();
    }

    if (profile) {
      lessonProgresses = await prisma.lessonProgress.findMany({
        where: { studentProfileId: profile.id },
        select: { lessonId: true, status: true, completionRate: true, timeSpent: true },
      });
    }
  } catch (error: any) {
    console.error('[SubjectDetail] Error:', error?.message || error);
    dbError = error?.message || 'Unknown error';
    // If it's a notFound() call, re-throw it
    if (error && error.message === 'NEXT_NOT_FOUND') {
      notFound();
    }
  }

  if (!subject && !dbError) notFound();

  // Show error details for debugging
  if (dbError && !subject) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="h-24 w-24 rounded-full bg-red-50 flex items-center justify-center">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold">خطأ في تحميل المادة</h2>
        <p className="text-muted-foreground text-sm max-w-md text-center">{dbError}</p>
        <p className="text-xs text-muted-foreground">subjectId: {params.subjectId} | userId: {userId || 'غير متوفر'}</p>
        <Button asChild variant="outline">
          <Link href="/subjects">العودة للمواد</Link>
        </Button>
      </div>
    );
  }

  const progressMap = new Map((lessonProgresses || []).map(lp => [lp.lessonId, lp]));
  const subjectProgress = subject.subjectProgresses[0];
  const totalLessons = subject.units.reduce((a, u) => a + u.lessons.length, 0);
  const completedLessons = lessonProgresses?.filter(lp => lp.status === 'COMPLETED').length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header card */}
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="h-1.5 w-full" style={{ backgroundColor: subject.color || '#2563eb' }} />
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg shrink-0"
              style={{ backgroundColor: (subject.color || '#2563eb') + '15' }}>
              {subject.icon || '📚'}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-2xl font-black">{subject.nameAr}</h1>
                <p className="text-muted-foreground">{subject.nameEn}</p>
                {subject.description && <p className="text-sm text-muted-foreground mt-1">{subject.description}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20">{subject.units.length} وحدة</Badge>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">{totalLessons} درس</Badge>
                {subjectProgress?.diagnosticLevel && (
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                    <Target className="h-3 w-3 ml-1" />
                    {subjectProgress.diagnosticLevel === 'advanced' ? 'متقدم' : subjectProgress.diagnosticLevel === 'medium' ? 'متوسط' : 'مبتدئ'}
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-left shrink-0">
              <div className="text-3xl font-black" style={{ color: subject.color || '#2563eb' }}>{progressPercent}%</div>
              <div className="text-xs text-muted-foreground">{completedLessons}/{totalLessons} درس</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 space-y-1.5">
            <Progress value={progressPercent} className="h-3" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            {[
              { icon: CheckCircle2, label: 'دروس مكتملة', value: completedLessons, color: 'text-green-600' },
              { icon: Clock, label: 'وقت الدراسة', value: `${Math.round((lessonProgresses?.reduce((a, lp) => a + lp.timeSpent, 0) || 0) / 3600)}س`, color: 'text-blue-600' },
              { icon: Star, label: 'نتيجة المستوى', value: subjectProgress?.diagnosticScore ? `${subjectProgress.diagnosticScore}%` : '—', color: 'text-yellow-600' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
                <div className="font-bold text-sm">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diagnostic quiz CTA */}
      {!subjectProgress?.diagnosticLevel && subject.diagnosticQuizzes.length > 0 && (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-purple-50 dark:to-purple-950/20 shadow-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">ابدأ باختبار تحديد المستوى</h3>
              <p className="text-sm text-muted-foreground">أجرِ الاختبار التشخيصي لتحديد مستواك والحصول على خطة دراسية مخصصة</p>
            </div>
            <Button variant="gradient" className="shrink-0" asChild>
              <Link href={`/subjects/${subject.id}/diagnostic`}>
                <Zap className="h-4 w-4 ml-1" />
                ابدأ الاختبار
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Units & Lessons */}
      <div className="space-y-4">
        {subject.units.map((unit, ui) => {
          const unitCompleted = unit.lessons.filter(l => progressMap.get(l.id)?.status === 'COMPLETED').length;
          return (
            <Card key={unit.id} className="shadow-sm overflow-hidden">
              {/* Unit header */}
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-black text-sm">{ui + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{unit.nameAr}</h3>
                      {unit.description && <p className="text-xs text-muted-foreground">{unit.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{unitCompleted}/{unit.lessons.length}</span>
                    <div className="w-20">
                      <Progress value={unit.lessons.length > 0 ? (unitCompleted / unit.lessons.length) * 100 : 0} className="h-1.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lessons */}
              <div className="divide-y">
                {unit.lessons.map((lesson, li) => {
                  const lp = progressMap.get(lesson.id);
                  const status = lp?.status || 'NOT_STARTED';
                  const si = statusInfo[status];
                  const diff = difficultyLabel[lesson.difficulty];
                  const isLocked = !lesson.isFree && !subjectProgress;

                  return (
                    <Link
                      key={lesson.id}
                      href={isLocked ? '/settings/subscription' : `/subjects/${subject.id}/lessons/${lesson.id}`}
                      className={cn(
                        'flex items-center gap-4 p-4 transition-colors',
                        isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-muted/30'
                      )}>
                      {/* Lesson number / status icon */}
                      <div className={cn('h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                        status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground')}>
                        {status === 'COMPLETED' ? '✓' : `${ui + 1}.${li + 1}`}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn('text-sm font-semibold truncate', status === 'COMPLETED' && 'line-through text-muted-foreground')}>
                            {lesson.nameAr}
                          </p>
                          {lesson.isFree && <Badge className="text-xs bg-green-100 text-green-700 border-green-200 py-0">مجاني</Badge>}
                        </div>
                        {lesson.description && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{lesson.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${diff.color}`}>{diff.label}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                            <Clock className="h-3 w-3" />{lesson.estimatedTime} د
                          </span>
                          {lp && lp.completionRate > 0 && lp.status !== 'COMPLETED' && (
                            <span className="text-xs text-primary">{Math.round(lp.completionRate)}%</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm">{si.icon}</span>
                        {isLocked ? <Lock className="h-4 w-4 text-muted-foreground" /> : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
