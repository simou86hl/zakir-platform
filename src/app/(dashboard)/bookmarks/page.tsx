export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, BookOpen, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'المحفوظات' };

async function getBookmarks(userId: string) {
  try {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) return [];
    return await prisma.bookmark.findMany({
      where: { studentProfileId: profile.id },
      include: {
        lesson: {
          select: {
            id: true, nameAr: true, estimatedTime: true, difficulty: true,
            unit: { include: { subject: { select: { id: true, nameAr: true, icon: true, color: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch { return []; }
}

const diffColors = { EASY: 'bg-green-100 text-green-700', MEDIUM: 'bg-yellow-100 text-yellow-700', HARD: 'bg-red-100 text-red-700' };
const diffLabels = { EASY: 'سهل', MEDIUM: 'متوسط', HARD: 'صعب' };

export default async function BookmarksPage() {
  const session = await auth();
  const bookmarks = await getBookmarks((session?.user as any)?.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Bookmark className="h-7 w-7 text-yellow-500" />
            المحفوظات
          </h1>
          <p className="text-muted-foreground mt-1">{bookmarks.length} درس محفوظ</p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <Bookmark className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">لا توجد محفوظات</h2>
            <p className="text-muted-foreground">احفظ الدروس المهمة لتجدها هنا بسهولة</p>
          </div>
          <Link href="/subjects" className="text-primary hover:underline text-sm">استعرض الدروس →</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {bookmarks.map(bm => {
            const diff = bm.lesson.difficulty as keyof typeof diffColors;
            return (
              <Card key={bm.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: (bm.lesson.unit.subject.color || '#2563eb') + '15' }}>
                      {bm.lesson.unit.subject.icon || '📚'}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <Link href={`/subjects/${bm.lesson.unit.subject.id}/lessons/${bm.lesson.id}`}
                        className="text-sm font-bold hover:text-primary transition-colors line-clamp-1">
                        {bm.lesson.nameAr}
                      </Link>
                      <p className="text-xs text-muted-foreground">{bm.lesson.unit.subject.nameAr}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${diffColors[diff]}`}>{diffLabels[diff]}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />{bm.lesson.estimatedTime}د
                        </span>
                      </div>
                      {bm.note && <p className="text-xs bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 rounded p-1.5">{bm.note}</p>}
                    </div>
                    <Link href={`/subjects/${bm.lesson.unit.subject.id}/lessons/${bm.lesson.id}`}
                      className="p-2 rounded-lg hover:bg-muted text-primary transition-colors shrink-0">
                      <ArrowLeft className="h-4 w-4 icon-rtl" />
                    </Link>
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
