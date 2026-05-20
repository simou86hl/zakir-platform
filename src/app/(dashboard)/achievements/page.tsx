export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock } from 'lucide-react';

export const metadata = { title: 'الإنجازات' };

async function getData(userId: string) {
  try {
    const [allAchievements, profile] = await Promise.all([
      prisma.achievement.findMany({ where: { isActive: true }, orderBy: { xpReward: 'asc' } }),
      prisma.studentProfile.findUnique({
        where: { userId },
        include: { achievements: { select: { achievementId: true, earnedAt: true } } },
      }),
    ]);
    return { allAchievements, earned: profile?.achievements || [] };
  } catch { return { allAchievements: [], earned: [] }; }
}

const typeColors: Record<string, string> = {
  STREAK: 'bg-orange-100 text-orange-700', LESSONS_COUNT: 'bg-blue-100 text-blue-700',
  QUIZ_SCORE: 'bg-green-100 text-green-700', EXERCISES_COUNT: 'bg-purple-100 text-purple-700',
  TIME_SPENT: 'bg-cyan-100 text-cyan-700', LEVEL_UP: 'bg-yellow-100 text-yellow-700',
  SUBJECT_MASTERY: 'bg-rose-100 text-rose-700',
};
const typeLabels: Record<string, string> = {
  STREAK: 'متتالية', LESSONS_COUNT: 'دروس', QUIZ_SCORE: 'اختبارات',
  EXERCISES_COUNT: 'تمارين', TIME_SPENT: 'وقت', LEVEL_UP: 'مستوى', SUBJECT_MASTERY: 'إتقان',
};

export default async function AchievementsPage() {
  const session = await auth();
  const { allAchievements, earned } = await getData((session?.user as any)?.id);
  const earnedIds = new Set(earned.map(e => e.achievementId));
  const earnedCount = earned.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2"><Trophy className="h-7 w-7 text-yellow-500" /> الإنجازات</h1>
          <p className="text-muted-foreground mt-1">
            {earnedCount} من {allAchievements.length} إنجاز مكتمل
          </p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-yellow-500">{Math.round((earnedCount / Math.max(allAchievements.length, 1)) * 100)}%</div>
          <div className="text-xs text-muted-foreground">مكتمل</div>
        </div>
      </div>

      {/* Summary bar */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 shadow-sm">
        <CardContent className="p-5 flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg text-3xl shrink-0">🏆</div>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-bold">تقدمك نحو جميع الإنجازات</span>
              <span className="text-muted-foreground">{earnedCount}/{allAchievements.length}</span>
            </div>
            <div className="h-3 bg-yellow-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-700"
                style={{ width: `${(earnedCount / Math.max(allAchievements.length, 1)) * 100}%` }} />
            </div>
          </div>
          <div className="text-center shrink-0">
            <div className="font-black text-2xl text-orange-600">{earned.reduce((_, __) => _, 0)}</div>
            <div className="text-xs text-muted-foreground">XP مكتسب</div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAchievements.length === 0 ? (
          <div className="col-span-3 text-center py-16 space-y-3">
            <Trophy className="h-16 w-16 mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground">لا توجد إنجازات. شغّل الـ seed أولاً.</p>
          </div>
        ) : allAchievements.map(ach => {
          const isEarned = earnedIds.has(ach.id);
          const earnedAt = earned.find(e => e.achievementId === ach.id)?.earnedAt;
          return (
            <Card key={ach.id} className={`shadow-sm transition-all ${isEarned ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20' : 'opacity-60'}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className={`text-4xl ${!isEarned && 'grayscale opacity-50'}`}>{ach.icon}</div>
                  <div className="flex flex-col items-end gap-1">
                    {isEarned
                      ? <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">✓ مكتسب</Badge>
                      : <Lock className="h-4 w-4 text-muted-foreground" />}
                    <span className={`text-xs font-medium ${typeColors[ach.type]?.split(' ')[1] || 'text-muted-foreground'}`}>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${typeColors[ach.type] || ''}`}>
                        {typeLabels[ach.type] || ach.type}
                      </span>
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${!isEarned && 'text-muted-foreground'}`}>{ach.nameAr}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{ach.description}</p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t">
                  <span className="text-xs font-medium text-yellow-600">+{ach.xpReward} XP</span>
                  {isEarned && earnedAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(earnedAt).toLocaleDateString('ar-SA')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
