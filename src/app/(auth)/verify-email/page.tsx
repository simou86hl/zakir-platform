export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage({ searchParams }: { searchParams: { token?: string; success?: string } }) {
  if (searchParams.success) {
    return (
      <div className="text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black">تم التحقق بنجاح! ✅</h1>
          <p className="text-muted-foreground">تم التحقق من بريدك الإلكتروني. يمكنك الآن تسجيل الدخول.</p>
        </div>
        <Button variant="gradient" size="lg" asChild className="w-full">
          <Link href="/login"><ArrowLeft className="h-5 w-5 icon-rtl" /> تسجيل الدخول</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
          <Mail className="h-10 w-10 text-blue-500" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-black">تحقق من بريدك الإلكتروني 📧</h1>
        <p className="text-muted-foreground text-sm">
          أرسلنا رابط التحقق إلى بريدك الإلكتروني.
          يرجى التحقق منه لتفعيل حسابك.
        </p>
      </div>
      <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground space-y-2">
        <p>لم تجد الرسالة؟</p>
        <ul className="space-y-1 list-disc list-inside text-xs">
          <li>تحقق من مجلد البريد غير المرغوب</li>
          <li>تأكد من صحة البريد المدخل</li>
          <li>انتظر دقيقتين وتحقق مجدداً</li>
        </ul>
      </div>
      <Link href="/login" className="block text-sm text-center text-primary hover:underline">
        العودة لتسجيل الدخول
      </Link>
    </div>
  );
}
