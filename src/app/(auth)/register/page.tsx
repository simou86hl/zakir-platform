'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { registerUser } from '@/actions/auth.actions';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { cn } from '@/lib/utils';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8 أحرف على الأقل', ok: password.length >= 8 },
    { label: 'حرف كبير', ok: /[A-Z]/.test(password) },
    { label: 'رقم', ok: /[0-9]/.test(password) },
  ];
  const strength = checks.filter(c => c.ok).length;
  const colors = ['bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];
  const labels = ['', 'ضعيفة', 'متوسطة', 'قوية'];

  if (!password) return null;

  return (
    <div className="space-y-2 mt-1">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-all duration-300', i < strength ? colors[strength] : 'bg-muted')} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map(c => (
            <span key={c.label} className={cn('text-xs flex items-center gap-1', c.ok ? 'text-green-600' : 'text-muted-foreground')}>
              {c.ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {c.label}
            </span>
          ))}
        </div>
        <span className={cn('text-xs font-medium', strength > 0 ? colors[strength].replace('bg-', 'text-') : '')}>{labels[strength]}</span>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreeToTerms: false },
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const result = await registerUser(data);
      if (result.error) {
        addToast(result.error, 'error');
        return;
      }
      // Auto sign in
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (!signInResult?.error) {
        addToast('تم إنشاء حسابك بنجاح! 🎉', 'success');
        router.push('/select-country');
      }
    } catch {
      addToast('حدث خطأ. حاول مرة أخرى', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-black">أنشئ حسابك مجاناً 🎓</h1>
        <p className="text-muted-foreground text-sm">انضم لأكثر من 50,000 طالب عربي</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="الاسم الأول"
            placeholder="محمد"
            rightIcon={<User className="h-4 w-4" />}
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="اسم العائلة"
            placeholder="الأحمد"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          label="البريد الإلكتروني"
          type="email"
          placeholder="example@email.com"
          rightIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-1">
          <Input
            label="كلمة المرور"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            rightIcon={<Lock className="h-4 w-4" />}
            leftIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordStrength password={password} />
        </div>

        <Input
          label="تأكيد كلمة المرور"
          type={showConfirm ? 'text' : 'password'}
          placeholder="••••••••"
          rightIcon={<Lock className="h-4 w-4" />}
          leftIcon={
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-muted-foreground hover:text-foreground">
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {/* Gender */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">الجنس (اختياري)</label>
          <div className="grid grid-cols-2 gap-3">
            {[{ value: 'MALE', label: '👦 ذكر' }, { value: 'FEMALE', label: '👧 أنثى' }].map((g) => (
              <label key={g.value} className="relative flex cursor-pointer">
                <input type="radio" value={g.value} {...register('gender')} className="peer sr-only" />
                <div className="w-full border-2 rounded-xl p-3 text-center text-sm font-medium transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50">
                  {g.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            {...register('agreeToTerms')}
            className="mt-1 rounded"
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
            أوافق على{' '}
            <Link href="/terms" className="text-primary hover:underline font-medium">شروط الاستخدام</Link>
            {' '}و{' '}
            <Link href="/privacy" className="text-primary hover:underline font-medium">سياسة الخصوصية</Link>
          </label>
        </div>
        {errors.agreeToTerms && <p className="text-xs text-destructive">{errors.agreeToTerms.message}</p>}

        <Button type="submit" size="lg" variant="gradient" className="w-full mt-2" loading={isLoading}>
          {!isLoading && <ArrowLeft className="h-5 w-5 icon-rtl" />}
          إنشاء الحساب مجاناً
        </Button>
      </form>

      {/* Benefits */}
      <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 space-y-1.5">
        {['5 دروس مجانية فورية', 'اختبار تحديد المستوى', 'لا يلزم بطاقة ائتمان'].map((b) => (
          <div key={b} className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>{b}</span>
          </div>
        ))}
      </div>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        لديك حساب بالفعل؟{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          سجل دخولك
        </Link>
      </p>
    </div>
  );
}
