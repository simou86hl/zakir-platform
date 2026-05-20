export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, Clock, Flame, Star, Trophy, ArrowLeft, Target, Zap, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'لوحة التحكم' };

async function getDashboardData(userId: string) {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        country: { select: { flag: true, nameAr: true } },
        grade: { select: { nameAr: true } },
        curriculum: { select: { nameAr: true } },
        subjectProgresses: {
          include: { subject: { select: { id: true, nameAr: true, icon: true, color: true } } },
          orderBy: { lastAccessedAt: 'desc' },
          take: 4,
        },
        lessonProgresses: {
          where: { status: 'COMPLETED' },
          orderBy: { completedAt: 'desc' },
          take: 5,
          include: { lesson: { select: { nameAr: true, unit: { include: { subject: { select: { nameAr: true, icon: true } } } } } } },
        },
        exerciseAttempts: { where: { createdAt: { gte: new Date(Date.now() - 7 * 86400000) } }, select: { isCorrect: true } },
        quizAttempts: { orderBy: { completedAt: 'desc' }, take: 3, select: { score: true, isPassed: true, completedAt: true } },
        dailyActivities: { orderBy: { date: 'desc' }, take: 84 },
        achievements: { orderBy: { earnedAt: 'desc' }, take: 3, include: { achievement: { select: { nameAr: true, icon: true } } } },
        subscription: { include: { plan: { select: { nameAr: true, type: true } } } },
      },
    });
    return profile;
  } catch { return null; }
}

async function getRecommendedLessons(profile: any) {
  if (!profile) return [];
  try {
    const cg = await prisma.curriculumGrade.findFirst({
      where: { curriculumId: profile.curriculumId, gradeId: profile.gradeId },
    });
    if (!cg) return [];
    const completed = await prisma.lessonProgress.findMany({
      where: { studentProfileId: profile.id, status: 'COMPLETED' },
      select: { lessonId: true },
    });
    const completedIds = completed.map(lp => lp.lessonId);
    return await prisma.lesson.findMany({
      where: { unit: { subject: { curriculumGradeId: cg.id } }, isActive: true, NOT: { id: { in: completedIds } } },
      include: { unit: { include: { subject: { select: { nameAr: true, icon: true, color: true, id: true } } } } },
      take: 3,
      orderBy: { sortOrder: 'asc' },
    });
  } catch { return []; }
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  const firstName = (session?.user as any)?.firstName || 'طالب';

  const [profile, recommended] = await Promise.all([
    getDashboardData(userId),
    null,
  ]);

  const recommendedLessons = profile ? await getRecommendedLessons(profile) : [];

  // حساب الإحصائيات
  const totalLessons = profile?.lessonProgresses?.length || 0;
  const totalExercises = profile?.exerciseAttempts?.length || 0;
  const correctExercises = profile?.exerciseAttempts?.filter((e: any) => e.isCorrect).length || 0;
  const totalStudyTime = profile?.dailyActivities?.reduce((a: number, d: any) => a + (d.studyTime || 0), 0) || 0;
  const streak = profile?.studyStreak || 0;
  const level = profile?.level || 1;
  const points = profile?.totalPoints || 0;
  const xp = profile?.totalXP || 0;
  const xpThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
  const currentLevelXP = xpThresholds[Math.min(level - 1, xpThresholds.length - 1)] || 0;
  const nextLevelXP = xpThresholds[Math.min(level, xpThresholds.length - 1)] || currentLevelXP + 500;
  const xpProgress = nextLevelXP > currentLevelXP ? Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100) : 100;

  const statCards = [
    { label: 'درس مكتمل', value: totalLessons, icon: BookOpen, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: 'تمرين محلول', value: totalExercises, icon: TrendingUp, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-950/30' },
    { label: 'دقيقة دراسة', value: totalStudyTime, icon: Clock, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30' },
    { label: 'يوم متتالي 🔥', value: streak, icon: Flame, color: 'from-orange-500 to-red-500', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  ];

  const recentActivity = [
    ...(profile?.lessonProgresses || []).map((lp: any) => ({
      type: 'lesson', icon: '📖',
      title: lp.lesson?.nameAr || 'درس',
      sub: lp.lesson?.unit?.subject?.nameAr || '',
      time: lp.completedAt,
      badge: '+15',
    })),
    ...(profile?.quizAttempts || []).map((qa: any) => ({
      type: 'quiz', icon: '📝',
      title: `اختبار - ${Math.round(qa.score)}%`,
      sub: qa.isPassed ? '✅ اجتزت' : '❌ لم تجتز',
      time: qa.completedAt,
      badge: qa.isPassed ? '+20' : '0',
    })),
  ].sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome + Level */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">مرحباً، {firstName}! 👋</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {profile?.country?.flag} {profile?.curriculum?.nameAr} • {profile?.grade?.nameAr}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Level card */}
          <div className="bg-card border rounded-2xl px-4 py-3 space-y-1.5 min-w-[160px] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">المستوى {level}</span>
              <span className="text-xs font-bold text-yellow-600">{points.toLocaleString('ar')} نقطة</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow">
                {level}
              </div>
              <div className="flex-1 space-y-1">
                <Progress value={xpProgress} className="h-1.5" />
                <p className="text-xs text-muted-foreground">{xp - currentLevelXP}/{nextLevelXP - currentLevelXP} XP</p>
              </div>
            </div>
          </div>
          {/* Subscription badge */}
          {profile?.subscription && (
            <Badge className={`px-3 py-1.5 text-xs font-bold ${
              profile.subscription.plan.type === 'PRO' ? 'bg-purple-100 text-purple-700' :
              profile.subscription.plan.type === 'BASIC' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-600'}`}>
              {profile.subscription.plan.type === 'PRO' ? '👑' : profile.subscription.plan.type === 'BASIC' ? '⭐' : '🎁'} {profile.subscription.plan.nameAr}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className={`border-0 shadow-sm overflow-hidden ${s.bg}`}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-sm`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-black">{s.value.toLocaleString('ar')}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subject progress */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold">📚 تقدمي في المواد</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/subjects" className="text-primary text-sm gap-1">
                  عرض الكل <ArrowLeft className="h-3.5 w-3.5 icon-rtl" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {(profile?.subjectProgresses || []).length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">لم تبدأ أي مادة بعد</p>
                  <Button size="sm" variant="gradient" asChild>
                    <Link href="/subjects">استعرض المواد</Link>
                  </Button>
                </div>
              ) : (profile?.subjectProgresses || []).map((sp: any) => {
                const pct = sp.totalLessons > 0 ? Math.round((sp.completedLessons / sp.totalLessons) * 100) : 0;
                return (
                  <Link key={sp.id} href={`/subjects/${sp.subject.id}`} className="block group">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-base shadow-sm"
                            style={{ backgroundColor: (sp.subject.color || '#2563eb') + '20' }}>
                            {sp.subject.icon || '📚'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold group-hover:text-primary transition-colors">{sp.subject.nameAr}</p>
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
                    </div>
                  </Link>
                );
              })}
              {(profile?.subjectProgresses || []).length < 3 && (
                <Button variant="outline" className="w-full text-sm" asChild>
                  <Link href="/subjects"><span className="mr-1">+</span> إضافة مادة</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Recommended lessons */}
          {recommendedLessons.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  دروس مقترحة لك
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendedLessons.map((lesson: any) => (
                  <Link key={lesson.id} href={`/subjects/${lesson.unit.subject.id}/lessons/${lesson.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group border">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm"
                      style={{ backgroundColor: (lesson.unit.subject.color || '#2563eb') + '15' }}>
                      {lesson.unit.subject.icon || '📚'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{lesson.nameAr}</p>
                      <p className="text-xs text-muted-foreground">{lesson.unit.subject.nameAr}</p>
                    </div>
                    <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Recent activity */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">النشاط الأخير</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">لا يوجد نشاط بعد</div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-base shrink-0">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold leading-snug truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.time ? new Date(item.time).toLocaleDateString('ar-SA') : ''}
                        </p>
                      </div>
                      {item.badge && (
                        <Badge variant="success" className="text-xs py-0 shrink-0">+{item.badge}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          {(profile?.achievements || []).length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  إنجازات أخيرة
                </CardTitle>
                <Link href="/achievements" className="text-xs text-primary hover:underline">عرض الكل</Link>
              </CardHeader>
              <CardContent className="space-y-2">
                {(profile?.achievements || []).map((sa: any) => (
                  <div key={sa.id} className="flex items-center gap-3 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <span className="text-2xl">{sa.achievement?.icon}</span>
                    <div>
                      <p className="text-xs font-semibold">{sa.achievement?.nameAr}</p>
                      <p className="text-xs text-muted-foreground">{new Date(sa.earnedAt).toLocaleDateString('ar-SA')}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick actions */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { href: '/subjects', icon: '📚', label: 'ابدأ درساً', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
                { href: '/progress', icon: '📊', label: 'تقدمي', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
                { href: '/achievements', icon: '🏆', label: 'الإنجازات', color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700' },
                { href: '/bookmarks', icon: '🔖', label: 'المحفوظات', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
              ].map(a => (
                <Link key={a.href} href={a.href}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-colors ${a.color}`}>
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-xs font-semibold">{a.label}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Heatmap */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              خريطة النشاط اليومي (آخر 84 يوم)
            </CardTitle>
            <div className="flex items-center gap-2">
              {streak > 0 && <Badge className="bg-orange-100 text-orange-700 border-orange-200">🔥 {streak} يوم متتالي</Badge>}
              <Link href="/progress" className="text-xs text-primary hover:underline">تفاصيل</Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: 84 }, (_, i) => {
              const activity = (profile?.dailyActivities || [])[83 - i];
              const intensity = activity ? Math.min(activity.lessonsCompleted + activity.exercisesDone, 4) : 0;
              const colors = ['bg-muted', 'bg-primary/15', 'bg-primary/35', 'bg-primary/60', 'bg-primary'];
              return (
                <div key={i} title={activity ? `${activity.lessonsCompleted} دروس، ${activity.exercisesDone} تمارين` : 'لا نشاط'}
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
    </div>
  );
}
