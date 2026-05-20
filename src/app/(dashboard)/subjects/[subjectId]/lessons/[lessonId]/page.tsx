export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Target, ChevronLeft, ChevronRight, BookOpen, CheckCircle2, Pencil, Play } from 'lucide-react';
import Link from 'next/link';
import { LessonTimer } from '@/components/lessons/LessonTimer';
import { BookmarkButton } from '@/components/lessons/BookmarkButton';
import { LessonNotepad } from '@/components/lessons/LessonNotepad';
import { cn } from '@/lib/utils';

export async function generateMetadata({ params }: { params: { lessonId: string } }) {
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: params.lessonId }, select: { nameAr: true } });
    return { title: lesson?.nameAr || 'الدرس' };
  } catch { return { title: 'الدرس' }; }
}

const diffColors: Record<string, string> = { EASY: 'bg-green-100 text-green-700', MEDIUM: 'bg-yellow-100 text-yellow-700', HARD: 'bg-red-100 text-red-700' };
const diffLabels: Record<string, string> = { EASY: 'سهل', MEDIUM: 'متوسط', HARD: 'صعب' };

export default async function LessonPage({ params }: { params: { subjectId: string; lessonId: string } }) {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const [lesson, profile] = await Promise.all([
    prisma.lesson.findUnique({
      where: { id: params.lessonId },
      include: {
        contents: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        summary: { select: { id: true, keyPoints: true } },
        exercises: { where: { isActive: true }, select: { id: true } },
        quizzes: { where: { isActive: true }, select: { id: true } },
        unit: {
          include: {
            subject: { select: { id: true, nameAr: true, icon: true, color: true } },
            lessons: { where: { isActive: true }, orderBy: { sortOrder: 'asc' }, select: { id: true, nameAr: true } },
          },
        },
      },
    }),
    userId ? prisma.studentProfile.findUnique({ where: { userId } }) : null,
  ]).catch(() => [null, null]);

  if (!lesson) notFound();

  // Check bookmark
  let isBookmarked = false;
  if (profile) {
    const bm = await prisma.bookmark.findUnique({
      where: { studentProfileId_lessonId: { studentProfileId: profile.id, lessonId: params.lessonId } },
    }).catch(() => null);
    isBookmarked = !!bm;
  }

  const objectives = Array.isArray(lesson.objectives) ? lesson.objectives as string[] : [];
  const lessons = lesson.unit.lessons;
  const idx = lessons.findIndex(l => l.id === params.lessonId);
  const prevLesson = idx > 0 ? lessons[idx - 1] : null;
  const nextLesson = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">
      {/* Top nav */}
      <div className="flex items-center justify-between gap-3 py-2 sticky top-14 bg-background/95 backdrop-blur z-10 -mx-4 px-4 border-b">
        <Link href={`/subjects/${params.subjectId}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className="h-4 w-4" />
          <span className="hidden sm:inline">{lesson.unit.subject.nameAr}</span>
        </Link>
        <p className="font-semibold text-sm truncate flex-1 text-center">{lesson.nameAr}</p>
        <div className="flex items-center gap-2">
          <LessonTimer lessonId={params.lessonId} estimatedTime={lesson.estimatedTime} />
          <BookmarkButton lessonId={params.lessonId} initialBookmarked={isBookmarked} />
        </div>
      </div>

      {/* Header */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap gap-2">
          <Badge className={diffColors[lesson.difficulty]}>{diffLabels[lesson.difficulty]}</Badge>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <Clock className="h-3 w-3 ml-1" />{lesson.estimatedTime} دقيقة
          </Badge>
          {lesson.isFree && <Badge className="bg-green-100 text-green-700 border-green-200">مجاني</Badge>}
        </div>
        <h1 className="text-2xl font-black leading-tight">{lesson.nameAr}</h1>
        {lesson.description && <p className="text-muted-foreground">{lesson.description}</p>}
      </div>

      {/* Objectives */}
      {objectives.length > 0 && (
        <Card className="shadow-sm border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <h2 className="font-bold mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              أهداف الدرس
            </h2>
            <ul className="space-y-2">
              {objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Content blocks */}
      {lesson.contents.length > 0 && (
        <div className="space-y-4">
          {lesson.contents.map((block) => {
            const content = block.content as any;
            return (
              <Card key={block.id} className="shadow-sm overflow-hidden">
                {block.title && (
                  <div className="px-5 py-3 border-b bg-muted/30 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <h3 className="font-semibold text-sm">{block.title}</h3>
                  </div>
                )}
                <CardContent className="p-5">
                  {block.type === 'TEXT' && (
                    <div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: content?.html || `<p>${content?.text || JSON.stringify(content)}</p>` }} />
                  )}
                  {block.type === 'EQUATION' && (
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 text-center space-y-3">
                      {content?.description && <p className="text-sm text-muted-foreground">{content.description}</p>}
                      <div className="bg-white dark:bg-black/30 rounded-lg p-4 inline-block shadow-sm">
                        <code className="text-xl font-mono font-bold text-purple-800 dark:text-purple-200">{content?.latex}</code>
                      </div>
                    </div>
                  )}
                  {block.type === 'VIDEO' && (
                    <div className="aspect-video bg-black rounded-xl flex items-center justify-center">
                      {content?.url ? (
                        <iframe src={content.url} className="w-full h-full rounded-xl" allowFullScreen />
                      ) : (
                        <div className="text-center text-white space-y-2">
                          <Play className="h-12 w-12 mx-auto opacity-50" />
                          <p className="text-sm opacity-60">الفيديو غير متاح</p>
                        </div>
                      )}
                    </div>
                  )}
                  {block.type === 'IMAGE' && (content?.url || content?.src) && (
                    <img src={content?.url || content?.src} alt={block.title || ''}
                      className="w-full rounded-xl object-cover shadow-sm" />
                  )}
                  {block.type === 'CODE' && (
                    <div className="bg-slate-900 rounded-xl p-5 overflow-x-auto">
                      <pre className="text-green-400 text-sm font-mono" dir="ltr">
                        <code>{content?.code || content?.text || ''}</code>
                      </pre>
                    </div>
                  )}
                  {block.type === 'FLASHCARD' && (
                    <div className="grid grid-cols-2 gap-3">
                      {(content?.cards || []).map((card: any, i: number) => (
                        <div key={i} className="bg-muted/50 border rounded-xl p-4 text-center space-y-2">
                          <p className="text-sm font-bold text-primary">{card.front}</p>
                          <hr />
                          <p className="text-sm text-muted-foreground">{card.back}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary preview */}
      {lesson.summary && (
        <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-primary/20">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold flex items-center gap-2">
                📋 نقاط مهمة من الدرس
              </h2>
              <Link href={`/subjects/${params.subjectId}/lessons/${params.lessonId}/summary`}
                className="text-sm text-primary hover:underline font-medium">
                الملخص الكامل ←
              </Link>
            </div>
            <ul className="space-y-2">
              {(lesson.summary.keyPoints as string[]).slice(0, 3).map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Practice CTAs */}
      {(lesson.exercises.length > 0 || lesson.quizzes.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {lesson.exercises.length > 0 && (
            <Link href={`/subjects/${params.subjectId}/lessons/${params.lessonId}/exercises`}
              className="flex items-center gap-4 p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 rounded-2xl hover:shadow-md transition-all card-hover">
              <div className="h-14 w-14 bg-green-500 rounded-xl flex items-center justify-center text-2xl shadow-md shrink-0">✏️</div>
              <div>
                <p className="font-bold">التمارين التفاعلية</p>
                <p className="text-sm text-muted-foreground">{lesson.exercises.length} تمرين • اكسب نقاطاً</p>
              </div>
            </Link>
          )}
          {lesson.quizzes.length > 0 && (
            <Link href={`/subjects/${params.subjectId}/lessons/${params.lessonId}/quiz`}
              className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 rounded-2xl hover:shadow-md transition-all card-hover">
              <div className="h-14 w-14 bg-blue-500 rounded-xl flex items-center justify-center text-2xl shadow-md shrink-0">📝</div>
              <div>
                <p className="font-bold">اختبار الدرس</p>
                <p className="text-sm text-muted-foreground">اختبر فهمك للمادة</p>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Notepad */}
      <LessonNotepad lessonId={params.lessonId} />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t">
        {prevLesson ? (
          <Button variant="outline" asChild>
            <Link href={`/subjects/${params.subjectId}/lessons/${prevLesson.id}`}>
              <ChevronRight className="h-4 w-4 ml-1" />
              <span className="hidden sm:inline max-w-[140px] truncate">{prevLesson.nameAr}</span>
              <span className="sm:hidden">السابق</span>
            </Link>
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href={`/subjects/${params.subjectId}`}><BookOpen className="h-4 w-4 ml-1" />المادة</Link>
          </Button>
        )}

        <Button variant="gradient" asChild>
          <Link href={`/subjects/${params.subjectId}/lessons/${params.lessonId}/summary`}>
            الملخص والإكمال
            <ChevronLeft className="h-4 w-4 mr-1" />
          </Link>
        </Button>

        {nextLesson && (
          <Button variant="outline" asChild>
            <Link href={`/subjects/${params.subjectId}/lessons/${nextLesson.id}`}>
              <span className="hidden sm:inline max-w-[140px] truncate">{nextLesson.nameAr}</span>
              <span className="sm:hidden">التالي</span>
              <ChevronLeft className="h-4 w-4 mr-1" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
