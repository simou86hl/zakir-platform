'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { updateLessonProgress } from '@/actions/lesson.actions';
import { CheckCircle2, Loader2 } from 'lucide-react';

export function MarkCompleteButton({ lessonId, subjectId }: { lessonId: string; subjectId: string }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const result = await updateLessonProgress(lessonId, {
        status: 'COMPLETED',
        completionRate: 100,
      });
      if (result.success) {
        setDone(true);
        addToast('🎉 أحسنت! تم إكمال الدرس وكسبت 15 نقطة', 'success');
        setTimeout(() => router.push(`/subjects/${subjectId}`), 1500);
      } else {
        addToast(result.error || 'حدث خطأ', 'error');
      }
    } catch {
      addToast('حدث خطأ. حاول مرة أخرى', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      variant={done ? 'success' : 'outline'}
      className="flex-1"
      onClick={handleComplete}
      disabled={loading || done}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin ml-2" />
      ) : (
        <CheckCircle2 className="h-5 w-5 ml-2" />
      )}
      {done ? 'تم الإكمال! ✅' : 'إكمال الدرس (+15 نقطة)'}
    </Button>
  );
}
