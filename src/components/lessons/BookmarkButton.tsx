'use client';
import { useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { toggleBookmark } from '@/actions/lesson.actions';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export function BookmarkButton({ lessonId, initialBookmarked = false }: {
  lessonId: string; initialBookmarked?: boolean;
}) {
  const { addToast } = useToast();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await toggleBookmark(lessonId);
      if (res.success) {
        setBookmarked(res.bookmarked!);
        addToast(res.bookmarked ? '🔖 تمت الإضافة للمحفوظات' : 'تم الحذف من المحفوظات', 'info');
      }
    } catch { addToast('حدث خطأ', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <button onClick={handle} disabled={loading}
      className={cn('p-2.5 rounded-xl transition-all', bookmarked ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'hover:bg-muted text-muted-foreground')}>
      {bookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
    </button>
  );
}
