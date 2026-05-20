'use client';
import { useState } from 'react';
import { ExerciseEngine } from '@/components/exercises/ExerciseEngine';
import { Button } from '@/components/ui/button';
import { Target, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface UnitQuizClientProps {
  unit: { id: string; nameAr: string };
  subject: { id: string; nameAr: string; icon: string; color: string };
  exercises: any[];
  subjectId: string;
}

export function UnitQuizClient({ unit, subject, exercises, subjectId }: UnitQuizClientProps) {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [finalStats, setFinalStats] = useState<any>(null);

  if (!started) {
    return (
      <div className="text-center py-10 space-y-6 animate-fade-in">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto shadow-xl">
          <Target className="h-10 w-10 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black">مراجعة الوحدة</h1>
          <p className="text-lg text-muted-foreground font-medium">{unit.nameAr}</p>
          <p className="text-sm text-muted-foreground">{subject.icon} {subject.nameAr}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
          {[
            { icon: '❓', val: exercises.length, label: 'سؤال' },
            { icon: '🎯', val: 'متنوعة', label: 'الأنواع' },
            { icon: '⭐', val: exercises.reduce((a, e) => a + e.points, 0), label: 'نقطة' },
          ].map(s => (
            <div key={s.label} className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-black">{s.val}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        {exercises.length === 0 ? (
          <div className="space-y-3">
            <p className="text-muted-foreground">لا توجد تمارين في هذه الوحدة بعد</p>
            <Button variant="outline" asChild>
              <Link href={`/subjects/${subjectId}`}>العودة للمادة</Link>
            </Button>
          </div>
        ) : (
          <Button size="xl" variant="gradient" onClick={() => setStarted(true)} className="px-12">
            ابدأ المراجعة 🚀
          </Button>
        )}
      </div>
    );
  }

  return (
    <ExerciseEngine
      exercises={exercises}
      lessonId={unit.id}
      subjectId={subjectId}
      onComplete={(stats) => { setCompleted(true); setFinalStats(stats); }}
    />
  );
}
