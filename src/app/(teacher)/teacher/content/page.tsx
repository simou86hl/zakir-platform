export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText } from 'lucide-react';

export const metadata = { title: 'إدارة المحتوى' };

export default async function TeacherContentPage() {
  let recentLessons: any[] = [];
  try {
    recentLessons = await prisma.lesson.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
      take: 20,
      include: {
        contents: { select: { id: true, type: true } },
        exercises: { select: { id: true } },
        quizzes: { select: { id: true } },
        unit: { select: { nameAr: true, subject: { select: { nameAr: true, icon: true, color: true } } } },
      },
    });
  } catch {}

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black">✏️ إدارة المحتوى</h1>
        <p className="text-muted-foreground mt-1">مراجعة وتعديل محتوى الدروس</p>
      </div>

      {recentLessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <FileText className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-bold">لا يوجد محتوى بعد</h2>
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">آخر الدروس</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/30 transition-colors">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0"
                    style={{ backgroundColor: (lesson.unit.subject.color || '#2563eb') + '15' }}>
                    {lesson.unit.subject.icon || '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{lesson.nameAr}</p>
                    <p className="text-xs text-muted-foreground">{lesson.unit.subject.nameAr} · {lesson.unit.nameAr}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Badge className="text-xs bg-blue-50 text-blue-700">{lesson.contents.length} محتوى</Badge>
                    <Badge className="text-xs bg-green-50 text-green-700">{lesson.exercises.length} تمرين</Badge>
                    <Badge className="text-xs bg-purple-50 text-purple-700">{lesson.quizzes.length} اختبار</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
