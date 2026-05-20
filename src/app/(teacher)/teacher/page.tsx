export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, FileText, BarChart3, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'لوحة المعلم' };

async function getTeacherData() {
  try {
    const [subjects, units, lessons, users] = await Promise.all([
      prisma.subject.count({ where: { isActive: true } }),
      prisma.unit.count({ where: { isActive: true } }),
      prisma.lesson.count({ where: { isActive: true } }),
      prisma.studentProfile.count(),
    ]);
    const recentLessons = await prisma.lesson.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
      take: 6,
      select: {
        id: true, nameAr: true, difficulty: true, estimatedTime: true,
        unit: { select: { nameAr: true, subject: { select: { nameAr: true, icon: true, color: true } } } },
      },
    });
    const subjectsList = await prisma.subject.findMany({
      where: { isActive: true },
      include: { units: { where: { isActive: true }, include: { _count: { select: { lessons: true } } } } },
      orderBy: { nameAr: 'asc' },
      take: 8,
    });
    return { subjects, units, lessons, users, recentLessons, subjectsList };
  } catch {
    return { subjects: 0, units: 0, lessons: 0, users: 0, recentLessons: [], subjectsList: [] };
  }
}

const difficultyInfo: Record<string, { label: string; color: string }> = {
  EASY: { label: 'سهل', color: 'bg-green-100 text-green-700' },
  MEDIUM: { label: 'متوسط', color: 'bg-yellow-100 text-yellow-700' },
  HARD: { label: 'صعب', color: 'bg-red-100 text-red-700' },
};

export default async function TeacherDashboardPage() {
  const data = await getTeacherData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black">لوحة المعلم 📖</h1>
        <p className="text-muted-foreground mt-1">إدارة المحتوى التعليمي ومتابعة التقدم</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'المواد الدراسية', value: data.subjects, icon: BookOpen, color: 'from-blue-500 to-blue-600' },
          { label: 'الوحدات', value: data.units, icon: FileText, color: 'from-purple-500 to-purple-600' },
          { label: 'الدروس', value: data.lessons, icon: CheckCircle2, color: 'from-green-500 to-emerald-600' },
          { label: 'الطلاب المسجلين', value: data.users, icon: Users, color: 'from-orange-500 to-red-500' },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm overflow-hidden">
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subjects */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  المواد الدراسية
                </CardTitle>
                <Link href="/teacher/subjects" className="text-sm text-primary hover:underline">عرض الكل</Link>
              </div>
            </CardHeader>
            <CardContent>
              {data.subjectsList.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">لا توجد مواد بعد</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {data.subjectsList.map((subject) => {
                    const totalLessons = subject.units.reduce((a, u) => a + u._count.lessons, 0);
                    return (
                      <div key={subject.id} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/30 transition-colors">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0"
                          style={{ backgroundColor: (subject.color || '#2563eb') + '15' }}>
                          {subject.icon || '📚'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{subject.nameAr}</p>
                          <p className="text-xs text-muted-foreground">{subject.units.length} وحدة · {totalLessons} درس</p>
                        </div>
                        <Badge className="text-xs bg-primary/10 text-primary border-primary/20">{subject.units.length}</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent lessons */}
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                آخر الدروس المضافة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentLessons.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">لا توجد دروس بعد</p>
              ) : (
                <div className="space-y-3">
                  {data.recentLessons.map((lesson) => {
                    const diff = difficultyInfo[lesson.difficulty] || difficultyInfo.MEDIUM;
                    return (
                      <div key={lesson.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-base shrink-0"
                          style={{ backgroundColor: (lesson.unit.subject.color || '#2563eb') + '15' }}>
                          {lesson.unit.subject.icon || '📄'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{lesson.nameAr}</p>
                          <p className="text-xs text-muted-foreground truncate">{lesson.unit.subject.nameAr} · {lesson.unit.nameAr}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${diff.color}`}>{diff.label}</span>
                            <span className="text-xs text-muted-foreground">{lesson.estimatedTime} د</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { href: '/teacher/subjects', icon: '📚', label: 'المواد', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
                { href: '/teacher/content', icon: '✏️', label: 'المحتوى', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
                { href: '/teacher/quizzes', icon: '📝', label: 'الاختبارات', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
                { href: '/teacher/students', icon: '👥', label: 'الطلاب', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
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
    </div>
  );
}
