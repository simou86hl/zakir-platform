export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Edit, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { subjectId: string } }) {
  const s = await prisma.subject.findUnique({ where: { id: params.subjectId }, select: { nameAr: true } }).catch(() => null);
  return { title: s?.nameAr || 'المادة' };
}

export default async function AdminSubjectPage({ params }: { params: { subjectId: string } }) {
  const subject = await prisma.subject.findUnique({
    where: { id: params.subjectId },
    include: {
      units: {
        orderBy: { sortOrder: 'asc' },
        include: {
          lessons: {
            orderBy: { sortOrder: 'asc' },
            include: {
              _count: { select: { exercises: true, contents: true } },
              summary: { select: { id: true } },
            },
          },
        },
      },
      curriculumGrade: {
        include: {
          curriculum: { include: { country: { select: { nameAr: true, flag: true } } } },
          grade: { select: { nameAr: true } },
        },
      },
      _count: { select: { diagnosticQuizzes: true } },
    },
  }).catch(() => null);

  if (!subject) notFound();

  const totalLessons = subject.units.reduce((a, u) => a + u.lessons.length, 0);
  const totalExercises = subject.units.reduce((a, u) => a + u.lessons.reduce((b, l) => b + l._count.exercises, 0), 0);

  const diffColors: Record<string, string> = { EASY: 'bg-green-100 text-green-700', MEDIUM: 'bg-yellow-100 text-yellow-700', HARD: 'bg-red-100 text-red-700' };
  const diffLabels: Record<string, string> = { EASY: 'سهل', MEDIUM: 'متوسط', HARD: 'صعب' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl shadow-md shrink-0"
            style={{ backgroundColor: (subject.color || '#2563eb') + '20' }}>
            {subject.icon || '📚'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black">{subject.nameAr}</h1>
              <Badge className={subject.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                {subject.isActive ? 'نشط' : 'معطل'}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">{subject.nameEn}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {subject.curriculumGrade.curriculum.country.flag} {subject.curriculumGrade.curriculum.nameAr} • {subject.curriculumGrade.grade.nameAr}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-1"><Edit className="h-3.5 w-3.5" />تعديل</Button>
          <Button variant="gradient" size="sm" asChild>
            <Link href="/admin/content" className="gap-1"><Plus className="h-3.5 w-3.5" />درس جديد</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'وحدات', value: subject.units.length, icon: '📂' },
          { label: 'دروس', value: totalLessons, icon: '📖' },
          { label: 'تمارين', value: totalExercises, icon: '✏️' },
          { label: 'اختبارات تشخيصية', value: subject._count.diagnosticQuizzes, icon: '🎯' },
        ].map(s => (
          <Card key={s.label} className="border-0 shadow-sm bg-muted/30">
            <CardContent className="p-4 flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="text-xl font-black">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Units and lessons tree */}
      <div className="space-y-4">
        {subject.units.map((unit, ui) => (
          <Card key={unit.id} className="shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 border-b gap-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary font-black text-sm flex items-center justify-center shrink-0">{ui + 1}</div>
                <div>
                  <h3 className="font-bold text-sm">{unit.nameAr}</h3>
                  <p className="text-xs text-muted-foreground">{unit.lessons.length} درس</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={unit.isActive ? 'bg-green-100 text-green-700 text-xs' : 'bg-red-100 text-red-700 text-xs'}>
                  {unit.isActive ? 'نشط' : 'معطل'}
                </Badge>
                <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs"><Edit className="h-3 w-3" />تعديل</Button>
                <Button size="sm" variant="outline" className="h-7 gap-1 text-xs"><Plus className="h-3 w-3" />درس</Button>
              </div>
            </div>

            <div className="divide-y">
              {unit.lessons.length === 0 ? (
                <p className="text-center py-6 text-sm text-muted-foreground">لا توجد دروس في هذه الوحدة</p>
              ) : unit.lessons.map((lesson, li) => (
                <div key={lesson.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3.5 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center shrink-0">
                      {ui + 1}.{li + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{lesson.nameAr}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${diffColors[lesson.difficulty]}`}>{diffLabels[lesson.difficulty]}</span>
                        <span className="text-xs text-muted-foreground">{lesson.estimatedTime}د</span>
                        {lesson.isFree && <Badge className="text-xs py-0 bg-green-100 text-green-700">مجاني</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span title="محتوى">📄 {lesson._count.contents}</span>
                      <span title="تمارين">✏️ {lesson._count.exercises}</span>
                      {lesson.summary && <span title="ملخص">📋 ✓</span>}
                    </div>
                    <div className="flex gap-1">
                      <Link href={`/admin/content?lessonId=${lesson.id}`}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="تعديل">
                        <Edit className="h-3.5 w-3.5" />
                      </Link>
                      <Link href={`/subjects/${subject.id}/lessons/${lesson.id}`} target="_blank"
                        className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="معاينة">
                        <FileText className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {subject.units.length === 0 && (
          <div className="text-center py-16 space-y-3 border-2 border-dashed rounded-2xl">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground">لا توجد وحدات. ابدأ بإضافة وحدة جديدة.</p>
            <Button variant="gradient"><Plus className="h-4 w-4 ml-1" />إضافة وحدة</Button>
          </div>
        )}
      </div>

      {/* Add unit button */}
      {subject.units.length > 0 && (
        <Button variant="outline" className="w-full gap-2 border-dashed h-12">
          <Plus className="h-4 w-4" />
          إضافة وحدة جديدة
        </Button>
      )}
    </div>
  );
}
