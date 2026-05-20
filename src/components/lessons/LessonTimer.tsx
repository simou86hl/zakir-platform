'use client';
import { useEffect, useState, useRef } from 'react';
import { Clock } from 'lucide-react';
import { updateLessonProgress } from '@/actions/lesson.actions';

interface LessonTimerProps {
  lessonId: string;
  estimatedTime: number; // minutes
}

export function LessonTimer({ lessonId, estimatedTime }: LessonTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastSaveRef = useRef(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    // Mark as in-progress on mount
    updateLessonProgress(lessonId, { status: 'IN_PROGRESS', completionRate: 10 });

    intervalRef.current = setInterval(() => {
      const newElapsed = Math.floor((Date.now() - startRef.current) / 1000);
      setElapsed(newElapsed);

      // Auto-save every 30 seconds
      if (newElapsed - lastSaveRef.current >= 30) {
        lastSaveRef.current = newElapsed;
        const pct = Math.min(Math.round((newElapsed / (estimatedTime * 60)) * 100), 90);
        updateLessonProgress(lessonId, { timeSpent: newElapsed, completionRate: pct });
      }
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      const finalElapsed = Math.floor((Date.now() - startRef.current) / 1000);
      if (finalElapsed > 10) {
        updateLessonProgress(lessonId, { timeSpent: finalElapsed });
      }
    };
  }, [lessonId, estimatedTime]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const progressPct = Math.min(Math.round((elapsed / (estimatedTime * 60)) * 100), 100);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded-full px-3 py-1.5">
        <Clock className="h-3.5 w-3.5" />
        <span className="font-mono font-medium">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>
      {progressPct > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-xs text-muted-foreground">{progressPct}%</span>
        </div>
      )}
    </div>
  );
}
