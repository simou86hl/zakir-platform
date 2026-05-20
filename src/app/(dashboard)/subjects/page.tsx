export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Lock, ArrowLeft, Target } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'المواد الدراسية' };

async function getSubjectsForStudent(userId: string) {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        grade: { select: { nameAr: true, level: true } },
        curriculum: { select: { nameAr: true } },
        country: { select: { nameAr: true, flag: true } },
      },
    });
    if (!profile) return { profile: null, subjects: [] };

    const cg = await prisma.curriculumGrade.findFirst({
      where: { curriculumId: profile.curriculumId, gradeId: profile.gradeId },
    });
    if (!cg) return { profile, subjects: [] };

    const subjects = await prisma.subject.findMany({
      where: { curriculumGradeId: cg.id, isActive: true },
      include: {
        units: {
          where: { isActive: true },
          include: {
            lessons: { where: { isActive: true }, select: { id: true, isFree: true } },
          },
        },
        subjectProgresses: { where: { studentProfileId: profile.id } },
      },
      orderBy: { sortOrder: 'asc' },
    });
    return { profile, subjects };
  } catch { return { profile: null, subjects: [] }; }
}

const difficultyInfo = { EASY: { label: 'سهل', color: 'bg-green-100 text-green-700' }, MEDIUM: { label: 'متوسط', color: 'bg-yellow-100 text-yellow-700' }, HARD: { label: 'صعب', color: 'bg-red-100 text-red-700' } };

export default async function SubjectsPage() {
  const session = await auth();
  const { profile, subjects } = await getSubjectsForStudent((session?.user as any)?.id);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">المواد الدراسية 📚</h1>
          {profile && (
            <p className="text-muted-foreground mt-1">
              {profile.country.flag} {profile.curriculum.nameAr} • {profile.grade.nameAr}
            </p>
          )}
        </div>
        {subjects.length > 0 && (
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
            {subjects.length} مادة متاحة
          </Badge>
        )}
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold">لا توجد مواد بعد</h2>
            <p className="text-muted-foreground max-w-sm">لم يتم إضافة محتوى لمنهجك وصفك الدراسي بعد. يعمل فريقنا على إضافته قريباً.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard">العودة للرئيسية</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((subject) => {
            const progress = subject.subjectProgresses[0];
            const totalLessons = subject.units.reduce((a, u) => a + u.lessons.length, 0);
            const freeLessons = subject.units.reduce((a, u) => a + u.lessons.filter(l => l.isFree).length, 0);
            const completionPercent = progress ? Math.round((progress.completedLessons / Math.max(totalLessons, 1)) * 100) : 0;
            const isStarted = !!progress;
            const hasDiagnostic = !!progress?.diagnosticLevel;

            return (
              <Link key={subject.id} href={`/subjects/${subject.id}`}>
                <Card className="card-hover border-0 shadow-md overflow-hidden h-full">
                  {/* Color header */}
                  <div className="h-2 w-full" style={{ backgroundColor: subject.color || '#2563eb' }} />
                  <CardContent className="p-5 space-y-4">
                    {/* Icon & name */}
                    <div className="flex items-start gap-3">
                      <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0"
                        style={{ backgroundColor: (subject.color || '#2563eb') + '15' }}>
                        {subject.icon || '📚'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base leading-tight">{subject.nameAr}</h3>
                        <p className="text-xs text-muted-foreground">{subject.nameEn}</p>
                        {subject.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{subject.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { val: subject.units.length, label: 'وحدة' },
                        { val: totalLessons, label: 'درس' },
                        { val: freeLessons, label: 'مجاني' },
                      ].map((s) => (
                        <div key={s.label} className="bg-muted/50 rounded-lg py-2">
                          <div className="font-black text-sm">{s.val}</div>
                          <div className="text-xs text-muted-foreground">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Progress */}
                    {isStarted ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>التقدم</span>
                          <span className="font-semibold" style={{ color: subject.color || '#2563eb' }}>{completionPercent}%</span>
                        </div>
                        <Progress value={completionPercent} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{progress?.completedLessons} / {totalLessons} درس</span>
                          {hasDiagnostic && (
                            <Badge className="text-xs bg-purple-100 text-purple-700 border-purple-200 py-0">
                              <Target className="h-3 w-3 ml-1" />
                              {progress?.diagnosticLevel === 'advanced' ? 'متقدم' : progress?.diagnosticLevel === 'medium' ? 'متوسط' : 'مبتدئ'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5">
                        <Target className="h-4 w-4 text-primary shrink-0" />
                        <span>ابدأ باختبار تحديد المستوى</span>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-muted-foreground">
                        {!isStarted ? '🆕 لم يبدأ' : completionPercent === 100 ? '✅ مكتمل' : '📖 جارٍ'}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: subject.color || '#2563eb' }}>
                        {isStarted ? 'متابعة' : 'ابدأ الآن'}
                        <ArrowLeft className="h-4 w-4 icon-rtl" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
