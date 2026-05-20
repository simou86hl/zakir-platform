export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

export const metadata = { title: 'إدارة المواد' };

export default async function TeacherSubjectsPage() {
  let subjects: any[] = [];
  try {
    subjects = await prisma.subject.findMany({
      where: { isActive: true },
      include: {
        units: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { nameAr: 'asc' },
    });
  } catch {}

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black">📚 المواد الدراسية</h1>
        <p className="text-muted-foreground mt-1">إدارة المواد والوحدات والدروس</p>
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <BookOpen className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-bold">لا توجد مواد بعد</h2>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {subjects.map((subject) => {
            const totalLessons = subject.units.reduce((a: number, u: any) => a + u._count.lessons, 0);
            return (
              <Card key={subject.id} className="border-0 shadow-md overflow-hidden">
                <div className="h-2 w-full" style={{ backgroundColor: subject.color || '#2563eb' }} />
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0"
                      style={{ backgroundColor: (subject.color || '#2563eb') + '15' }}>
                      {subject.icon || '📚'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base">{subject.nameAr}</h3>
                      <p className="text-xs text-muted-foreground">{subject.nameEn}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-primary/10 text-primary">{subject.units.length} وحدة</Badge>
                      <Badge className="bg-blue-100 text-blue-700">{totalLessons} درس</Badge>
                    </div>
                  </div>

                  {/* Units list */}
                  <div className="space-y-2">
                    {subject.units.map((unit: any) => (
                      <div key={unit.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {unit.sortOrder || '-'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{unit.nameAr}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{unit._count.lessons} درس</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
