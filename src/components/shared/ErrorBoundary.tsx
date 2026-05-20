'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('App error:', error); }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black">حدث خطأ ما</h1>
          <p className="text-muted-foreground">عذراً، واجهنا مشكلة غير متوقعة. نحن نعمل على حلها.</p>
          {error.digest && <p className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">رمز الخطأ: {error.digest}</p>}
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="gradient">المحاولة مجدداً</Button>
          <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>الرئيسية</Button>
        </div>
      </div>
    </div>
  );
}
