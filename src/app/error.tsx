'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center">
      <div className="text-5xl">⚠️</div>
      <h2 className="text-xl font-bold">حدث خطأ غير متوقع</h2>
      <p className="text-muted-foreground text-sm max-w-sm">
        {error.message || 'حدثت مشكلة أثناء تحميل الصفحة. حاول مرة أخرى.'}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>إعادة المحاولة</Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>الرئيسية</Button>
      </div>
    </div>
  );
}
