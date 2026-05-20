'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { forgotPassword } from '@/actions/auth.actions';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth';

export default function ForgotPasswordPage() {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      const result = await forgotPassword(data.email);
      if (result.error) {
        addToast(result.error, 'error');
      } else {
        setSentEmail(data.email);
        setSent(true);
      }
    } catch {
      addToast('حدث خطأ. حاول مرة أخرى', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black">تم إرسال الرابط! 📧</h1>
          <p className="text-muted-foreground">
            أرسلنا رابط إعادة تعيين كلمة المرور إلى:
          </p>
          <p className="font-bold text-primary">{sentEmail}</p>
          <p className="text-sm text-muted-foreground">
            تحقق من بريدك الوارد، وانتبه لمجلد الرسائل غير المرغوبة.
            <br />الرابط صالح لمدة ساعة واحدة.
          </p>
        </div>
        <div className="space-y-3">
          <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
            إعادة الإرسال
          </Button>
          <Link href="/login" className="block text-sm text-center text-primary hover:underline">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
            <Mail className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-black">نسيت كلمة المرور؟ 🔑</h1>
        <p className="text-muted-foreground text-sm">
          أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="البريد الإلكتروني"
          type="email"
          placeholder="example@email.com"
          rightIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          autoComplete="email"
          {...register('email')}
        />

        <Button type="submit" size="lg" variant="gradient" className="w-full" loading={isLoading}>
          {!isLoading && <ArrowLeft className="h-5 w-5 icon-rtl" />}
          إرسال رابط إعادة التعيين
        </Button>
      </form>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">💡 نصائح:</p>
        <ul className="space-y-1 text-xs text-blue-600 dark:text-blue-400 list-disc list-inside">
          <li>تحقق من مجلد الرسائل غير المرغوبة</li>
          <li>الرابط صالح لمدة ساعة فقط</li>
          <li>إذا لم تجد الرسالة، انتظر دقيقتين وأعد المحاولة</li>
        </ul>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        تذكرت كلمة المرور؟{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          سجل دخولك
        </Link>
      </p>
    </div>
  );
}
