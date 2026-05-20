export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Flame, Target, BookOpen, Award } from 'lucide-react';

export const metadata = { title: 'تقدمي' };

async function getProgressData(userId: string) {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        subjectProgresses: { include: { subject: { select: { nameAr: true, icon: true, color: true } } }, orderBy: { updatedAt: 'desc' } },
        dailyActivities: { orderBy: { date: 'desc' }, take: 84 },
        achievements: { include: { achievement: true }, orderBy: { earnedAt: 'desc' } },
        lessonProgresses: { select: { status: true, timeSpent: true } },
        quizAttempts: { select: { score: true, isPassed: true }, orderBy: { completedAt: 'desc' }, take: 20 },
      },
    });
    return profile;
  } catch { return null; }
}

export default async function ProgressPage() {
  const session = await auth();
  const profile = await getProgressData((session?.user as any)?.id);

  const totalStudyTime = profile?.lessonProgresses?.reduce((a, lp) => a + (lp.timeSpent || 0), 0) || 0;
  const completedLessons = profile?.lessonProgresses?.filter(lp => lp.status === 'COMPLETED').length || 0;
  const avgScore = profile?.quizAttempts?.length
    ? Math.round(profile.quizAttempts.reduce((a, q) => a + q.score, 0) / profile.quizAttempts.length)
    : 0;

  const stats = [
    { icon: BookOpen, label: 'دروس مكتملة', value: completedLessons, color: 'from-blue-500 to-blue-600' },
    { icon: Clock, label: 'ساعات الدراسة', value: `${Math.floor(totalStudyTime / 3600)}س`, color: 'from-purple-500 to-purple-600' },
    { icon: Target, label: 'متوسط الدرجات', value: `${avgScore}%`, color: 'from-green-500 to-emerald-600' },
    { icon: Flame, label: 'أيام متتالية', value: profile?.studyStreak || 0, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black">تقدمي الدراسي 📈</h1>
        <p className="text-muted-foreground mt-1">نظرة شاملة على أدائك ومسيرتك التعليمية</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-sm`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Level progress */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">{profile?.level || 1}</span>
              </div>
              <div>
                <p className="font-black text-lg">المستوى {profile?.level || 1}</p>
                <p className="text-sm text-muted-foreground">{profile?.totalXP || 0} XP مجموع</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">{profile?.totalPoints || 0}</p>
              <p className="text-xs text-muted-foreground">نقطة</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>التقدم نحو المستوى التالي</span>
              <span>{((profile?.totalXP || 0) % 300)} / 300 XP</span>
            </div>
            <Progress value={((profile?.totalXP || 0) % 300) / 3} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Subject progress */}
      {(profile?.subjectProgresses || []).length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              التقدم في المواد
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {profile!.subjectProgresses.map(sp => {
              const pct = sp.totalLessons > 0 ? Math.round((sp.completedLessons / sp.totalLessons) * 100) : 0;
              return (
                <div key={sp.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sp.subject.icon || '📚'}</span>
                      <div>
                        <p className="text-sm font-semibold">{sp.subject.nameAr}</p>
                        <p className="text-xs text-muted-foreground">{sp.completedLessons}/{sp.totalLessons} درس</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sp.diagnosticLevel && (
                        <Badge className={`text-xs py-0 ${sp.diagnosticLevel === 'advanced' ? 'bg-purple-100 text-purple-700' : sp.diagnosticLevel === 'medium' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {sp.diagnosticLevel === 'advanced' ? 'متقدم' : sp.diagnosticLevel === 'medium' ? 'متوسط' : 'مبتدئ'}
                        </Badge>
                      )}
                      <span className="text-sm font-bold" style={{ color: sp.subject.color || '#2563eb' }}>{pct}%</span>
                    </div>
                  </div>
                  <Progress value={pct} className="h-2" />
                  {sp.averageScore > 0 && (
                    <p className="text-xs text-muted-foreground">متوسط الدرجات: {Math.round(sp.averageScore)}%</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Heatmap */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            خريطة نشاطك (آخر 84 يوم)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: 84 }, (_, i) => {
              const activity = profile?.dailyActivities?.[83 - i];
              const intensity = activity ? Math.min(activity.lessonsCompleted + activity.exercisesDone, 4) : 0;
              const colors = ['bg-muted', 'bg-primary/15', 'bg-primary/35', 'bg-primary/60', 'bg-primary'];
              return (
                <div key={i} title={activity ? `${activity.lessonsCompleted} دروس, ${activity.exercisesDone} تمارين` : 'لا نشاط'}
                  className={`h-4 w-4 rounded-sm ${colors[intensity]} hover:ring-1 hover:ring-primary transition-all cursor-default`} />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <span>أقل نشاطاً</span>
            {['bg-muted', 'bg-primary/15', 'bg-primary/35', 'bg-primary/60', 'bg-primary'].map(c => (
              <div key={c} className={`h-3 w-3 rounded-sm ${c}`} />
            ))}
            <span>أكثر نشاطاً</span>
          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {!profile && (
        <div className="text-center py-16 space-y-4">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
            <TrendingUp className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold">لا توجد بيانات بعد</h2>
            <p className="text-muted-foreground">ابدأ بدراسة الدروس لتظهر إحصائياتك هنا</p>
          </div>
        </div>
      )}
    </div>
  );
}
