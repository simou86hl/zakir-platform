export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl">🔍</div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black">404</h1>
          <h2 className="text-xl font-bold">الصفحة غير موجودة</h2>
          <p className="text-muted-foreground">عذراً، لم نتمكن من إيجاد الصفحة التي تبحث عنها.</p>
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90" size="lg" asChild>
          <Link href="/">العودة للرئيسية</Link>
        </Button>
      </div>
    </div>
  );
}
