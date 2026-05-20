'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        addToast('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
      } else {
        addToast('مرحباً بك! جارٍ تحويلك...', 'success');
        // Get session to check role
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        const role = session?.user?.role;
        if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch {
      addToast('حدث خطأ. حاول مرة أخرى', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-lg">
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-black">أهلاً بعودتك! 👋</h1>
        <p className="text-muted-foreground">سجّل دخولك للمتابعة من حيث توقفت</p>
      </div>

      {/* Form */}
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

        <div className="space-y-1.5">
          <Input
            label="كلمة المرور"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            rightIcon={<Lock className="h-4 w-4" />}
            leftIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={errors.password?.message}
            autoComplete="current-password"
            {...register('password')}
          />
          <div className="flex justify-start">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" {...register('rememberMe')} className="rounded" />
          <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">تذكرني</label>
        </div>

        <Button type="submit" size="lg" variant="gradient" className="w-full" loading={isLoading}>
          {!isLoading && <ArrowLeft className="h-5 w-5 icon-rtl" />}
          تسجيل الدخول
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">أو</span>
        </div>
      </div>

      {/* Demo accounts */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground text-center">حسابات تجريبية للاختبار</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { role: 'طالب', email: 'student@zakir.edu', pass: 'Student1234!' },
            { role: 'مدير', email: 'admin@zakir.edu', pass: 'Admin1234!' },
          ].map((acc) => (
            <button
              key={acc.role}
              type="button"
              onClick={async () => {
                setIsLoading(true);
                const result = await signIn('credentials', { email: acc.email, password: acc.pass, redirect: false });
                if (!result?.error) {
                  const sessionRes = await fetch('/api/auth/session');
                  const session = await sessionRes.json();
                  const role = session?.user?.role;
                  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
                    router.push('/admin');
                  } else {
                    router.push('/dashboard');
                  }
                  router.refresh();
                }
                else addToast('حساب التجربة غير متاح حالياً', 'info');
                setIsLoading(false);
              }}
              className="text-xs bg-background border rounded-lg p-2 hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
            >
              <div className="font-semibold">{acc.role}</div>
              <div className="text-muted-foreground">{acc.email}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-muted-foreground">
        ليس لديك حساب؟{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          سجل مجاناً الآن
        </Link>
      </p>
    </div>
  );
}
