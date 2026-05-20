export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, BookOpen, CreditCard, Trophy, Clock, Target, BarChart3 } from 'lucide-react';

export const metadata = { title: 'التحليلات' };

async function getAnalyticsData() {
  try {
    const now = new Date();
    const last30 = new Date(now.getTime() - 30 * 86400000);
    const last7 = new Date(now.getTime() - 7 * 86400000);

    const [
      totalUsers, newUsersLast30, activeUsersLast7,
      totalLessons, completedAttempts, quizAttempts,
      subscriptionsByPlan, achievementsCount, avgScore,
      topSubjects,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: last30 } } }),
      prisma.studentProfile.count({ where: { lastActiveAt: { gte: last7 } } }),
      prisma.lesson.count({ where: { isActive: true } }),
      prisma.lessonProgress.count({ where: { status: 'COMPLETED' } }),
      prisma.quizAttempt.aggregate({ _avg: { score: true }, _count: true }),
      prisma.subscription.groupBy({ by: ['planId'], _count: { id: true }, where: { status: 'ACTIVE' } }),
      prisma.studentAchievement.count(),
      prisma.quizAttempt.aggregate({ _avg: { score: true } }),
      prisma.subjectProgress.groupBy({
        by: ['subjectId'], _count: { id: true }, _avg: { averageScore: true },
        orderBy: { _count: { id: 'desc' } }, take: 5,
      }),
    ]);

    // Growth rate
    const prevPeriodUsers = await prisma.user.count({
      where: { createdAt: { gte: new Date(last30.getTime() - 30 * 86400000), lte: last30 } },
    });
    const growthRate = prevPeriodUsers > 0 ? Math.round(((newUsersLast30 - prevPeriodUsers) / prevPeriodUsers) * 100) : 100;

    // Daily activity last 30 days
    const dailyActivity = await prisma.dailyActivity.groupBy({
      by: ['date'],
      _sum: { lessonsCompleted: true, exercisesDone: true, studyTime: true },
      where: { date: { gte: last30 } },
      orderBy: { date: 'asc' },
    });

    // Plans with names
    const plans = await prisma.plan.findMany({ select: { id: true, nameAr: true, type: true } });
    const planMap = Object.fromEntries(plans.map(p => [p.id, p]));
    const subsWithPlan = subscriptionsByPlan.map(s => ({
      ...s, plan: planMap[s.planId],
    }));

    return {
      totalUsers, newUsersLast30, activeUsersLast7, growthRate,
      totalLessons, completedAttempts,
      quizCount: quizAttempts._count, avgQuizScore: Math.round(quizAttempts._avg.score || 0),
      subsWithPlan, achievementsCount,
      dailyActivity, topSubjects,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  const kpis = [
    { label: 'إجمالي المستخدمين', value: data?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-blue-600', change: `+${data?.newUsersLast30 || 0} هذا الشهر`, positive: true },
    { label: 'مستخدمون نشطون (7 أيام)', value: data?.activeUsersLast7 || 0, icon: TrendingUp, color: 'from-green-500 to-emerald-600', change: `${data?.growthRate || 0}% نمو`, positive: (data?.growthRate || 0) >= 0 },
    { label: 'دروس مكتملة', value: data?.completedAttempts || 0, icon: BookOpen, color: 'from-purple-500 to-purple-600', change: 'إجمالي', positive: true },
    { label: 'متوسط درجة الاختبار', value: `${data?.avgQuizScore || 0}%`, icon: Target, color: 'from-orange-500 to-red-500', change: `${data?.quizCount || 0} اختبار`, positive: true },
  ];

  const maxActivity = Math.max(...(data?.dailyActivity || []).map((d: any) => (d._sum.lessonsCompleted || 0) + (d._sum.exercisesDone || 0)), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">التحليلات 📊</h1>
        <p className="text-muted-foreground mt-1">إحصائيات شاملة لمنصة ذاكر</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label} className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-3 shadow-sm`}>
                <kpi.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-black">{typeof kpi.value === 'number' ? kpi.value.toLocaleString('ar') : kpi.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{kpi.label}</div>
              <div className={`text-xs mt-1.5 font-medium ${kpi.positive ? 'text-green-600' : 'text-red-500'}`}>{kpi.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily activity chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              النشاط اليومي (آخر 30 يوم)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {(data?.dailyActivity || []).slice(-30).map((d: any, i: number) => {
                const total = (d._sum.lessonsCompleted || 0) + (d._sum.exercisesDone || 0);
                const height = maxActivity > 0 ? Math.max(4, Math.round((total / maxActivity) * 100)) : 4;
                return (
                  <div key={i} className="flex-1 group relative">
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-foreground text-background text-xs rounded px-1.5 py-0.5 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {total} نشاط
                    </div>
                    <div className="bg-primary/70 hover:bg-primary rounded-t-sm transition-all cursor-pointer"
                      style={{ height: `${height}%` }} />
                  </div>
                );
              })}
            </div>
            {data?.dailyActivity?.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">لا يوجد نشاط مسجل بعد</p>
            )}
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>منذ 30 يوم</span>
              <span>اليوم</span>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions breakdown */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              توزيع الاشتراكات النشطة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(data?.subsWithPlan || []).length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">لا توجد اشتراكات نشطة</p>
            ) : (
              (data?.subsWithPlan || []).map((sub: any) => {
                const totalSubs = (data?.subsWithPlan || []).reduce((a: number, s: any) => a + s._count.id, 0);
                const pct = totalSubs > 0 ? Math.round((sub._count.id / totalSubs) * 100) : 0;
                const colors: Record<string, string> = { FREE: 'bg-gray-400', BASIC: 'bg-blue-500', PRO: 'bg-purple-600' };
                return (
                  <div key={sub.planId} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${colors[sub.plan?.type || 'FREE']}`} />
                        <span className="text-sm font-medium">{sub.plan?.nameAr || 'غير معروف'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{sub._count.id}</span>
                        <Badge variant="outline" className="text-xs">{pct}%</Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors[sub.plan?.type || 'FREE']} transition-all duration-700`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Achievements */}
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md shrink-0">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black">{(data?.achievementsCount || 0).toLocaleString('ar')}</div>
              <div className="text-sm text-muted-foreground">إنجاز مُكتسب</div>
              <div className="text-xs text-yellow-600 mt-0.5">من الطلاب</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shrink-0">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black">{(data?.totalLessons || 0).toLocaleString('ar')}</div>
              <div className="text-sm text-muted-foreground">درس متاح</div>
              <div className="text-xs text-blue-600 mt-0.5">في المنصة</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shrink-0">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black">{data?.quizCount || 0}</div>
              <div className="text-sm text-muted-foreground">محاولة اختبار</div>
              <div className="text-xs text-green-600 mt-0.5">متوسط {data?.avgQuizScore || 0}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top subjects */}
      {(data?.topSubjects || []).length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">أكثر المواد استخداماً</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(data?.topSubjects || []).map((s: any, i: number) => (
                <div key={s.subjectId} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-black text-sm flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{s.subjectId}</span>
                      <span className="text-muted-foreground">{s._count.id} طالب</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round((s._count.id / ((data?.topSubjects[0] as any)?._count?.id || 1)) * 100)}%` }} />
                    </div>
                  </div>
                  {s._avg.averageScore && (
                    <Badge variant="outline" className="text-xs shrink-0">{Math.round(s._avg.averageScore)}%</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
