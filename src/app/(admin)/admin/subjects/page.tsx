export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus, Search, Eye, Edit } from 'lucide-react';
import Link from 'next/link';
import { ToggleSubjectBtn } from '@/components/admin/ToggleSubjectBtn';

export const metadata = { title: 'إدارة المواد' };

async function getSubjects() {
  try {
    return await prisma.subject.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        curriculumGrade: {
          include: {
            curriculum: { include: { country: { select: { nameAr: true, flag: true } } } },
            grade: { select: { nameAr: true, level: true, educationStage: true } },
          },
        },
        units: {
          include: { _count: { select: { lessons: true } } },
        },
        _count: { select: { units: true } },
      },
    });
  } catch { return []; }
}

const difficultyColors = { EASY: 'bg-green-100 text-green-700', MEDIUM: 'bg-yellow-100 text-yellow-700', HARD: 'bg-red-100 text-red-700' };
const stageColors = { PRIMARY: 'bg-blue-100 text-blue-700', MIDDLE: 'bg-purple-100 text-purple-700', SECONDARY: 'bg-orange-100 text-orange-700' };
const stageLabels = { PRIMARY: 'ابتدائي', MIDDLE: 'متوسط', SECONDARY: 'ثانوي' };

export default async function SubjectsPage() {
  const subjects = await getSubjects();
  const totalLessons = subjects.reduce((a, s) => a + s.units.reduce((b, u) => b + u._count.lessons, 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">المواد الدراسية 📚</h1>
          <p className="text-muted-foreground">{subjects.length} مادة، {totalLessons} درس</p>
        </div>
        <Link href="/admin/content" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          إضافة مادة
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="search" placeholder="بحث عن مادة..." className="w-full h-10 bg-background border rounded-lg pr-9 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
      </div>

      {subjects.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-16 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-muted-foreground">لا توجد مواد. شغّل الـ seed أولاً.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop table - hidden on mobile */}
          <Card className="shadow-sm hidden lg:block">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {['المادة', 'الدولة والمنهج', 'الصف', 'الوحدات', 'الدروس', 'الحالة', 'إجراءات'].map(h => (
                        <th key={h} className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((s) => {
                      const lessonCount = s.units.reduce((a, u) => a + u._count.lessons, 0);
                      const stage = s.curriculumGrade.grade.educationStage;
                      return (
                        <tr key={s.id} className="border-t hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="h-9 w-9 rounded-xl flex items-center justify-center text-xl shadow-sm"
                                style={{ backgroundColor: (s.color || '#2563eb') + '20' }}>
                                {s.icon || '📚'}
                              </div>
                              <div>
                                <p className="font-semibold">{s.nameAr}</p>
                                <p className="text-xs text-muted-foreground">{s.nameEn}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-xs">
                              <span>{s.curriculumGrade.curriculum.country.flag}</span>
                              <span className="text-muted-foreground">{s.curriculumGrade.curriculum.nameAr}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <p className="text-xs font-medium">{s.curriculumGrade.grade.nameAr}</p>
                              <span className={`px-1.5 py-0.5 rounded text-xs ${stageColors[stage]}`}>
                                {stageLabels[stage]}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold">{s._count.units}</td>
                          <td className="py-3 px-4 font-bold">{lessonCount}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {s.isActive ? 'نشط' : 'معطل'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <Link href={`/admin/subjects/${s.id}`} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="عرض">
                                <Eye className="h-3.5 w-3.5" />
                              </Link>
                              <ToggleSubjectBtn subjectId={s.id} isActive={s.isActive} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Mobile cards - hidden on desktop */}
          <div className="lg:hidden space-y-3">
            {subjects.map((s) => {
              const lessonCount = s.units.reduce((a, u) => a + u._count.lessons, 0);
              const stage = s.curriculumGrade.grade.educationStage;
              return (
                <Card key={s.id} className="border shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0"
                          style={{ backgroundColor: (s.color || '#2563eb') + '20' }}>
                          {s.icon || '📚'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{s.nameAr}</p>
                          <p className="text-xs text-muted-foreground">{s.nameEn}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {s.isActive ? 'نشط' : 'معطل'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-xs">{s.curriculumGrade.curriculum.country.flag} {s.curriculumGrade.curriculum.nameAr}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${stageColors[stage]}`}>
                        {stageLabels[stage]}
                      </span>
                      <span className="text-xs text-muted-foreground">{s.curriculumGrade.grade.nameAr}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{s._count.units} وحدات</span>
                        <span>{lessonCount} دروس</span>
                      </div>
                      <div className="flex gap-1">
                        <Link href={`/admin/subjects/${s.id}`} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="عرض">
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <ToggleSubjectBtn subjectId={s.id} isActive={s.isActive} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
