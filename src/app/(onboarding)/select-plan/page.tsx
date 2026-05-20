'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createStudentProfile } from '@/actions/onboarding.actions';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

const plans = [
  { type: 'FREE', name: 'مجاني', price: 0, icon: '🎁', color: 'from-gray-400 to-gray-500', desc: 'ابدأ واستكشف',
    features: ['مادة واحدة', '5 دروس مجانية', 'اختبار تحديد المستوى', 'إحصائيات أساسية'], recommended: false },
  { type: 'BASIC', name: 'العادية', price: 9.99, icon: '⭐', color: 'from-blue-500 to-blue-600', desc: 'للطلاب الجادين',
    features: ['5 مواد دراسية', 'جميع الدروس والتمارين', 'إحصائيات متقدمة', 'تحميل الملخصات', 'دعم مجاني'], recommended: false },
  { type: 'PRO', name: 'برو', price: 19.99, icon: '👑', color: 'from-purple-500 to-purple-700', desc: 'تجربة كاملة',
    features: ['جميع المواد بلا حدود', 'جميع الدروس والتمارين', 'اختبارات غير محدودة', 'إحصائيات شاملة', 'دعم أولوية 24/7'], recommended: true },
];

const steps = [
  { label: 'الدولة' }, { label: 'الصف' }, { label: 'الباقة' },
];

export default function SelectPlanPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [selected, setSelected] = useState('FREE');
  const [loading, setLoading] = useState(false);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const handleFinish = async () => {
    setLoading(true);
    try {
      const country = localStorage.getItem('onboarding_country') || 'SA';
      const curriculumId = localStorage.getItem('onboarding_curriculum') || '';
      const gradeId = localStorage.getItem('onboarding_grade_id') || '';
      const educationLevel = (localStorage.getItem('onboarding_stage') || 'SECONDARY') as any;

      if (!curriculumId || !gradeId) {
        // Fallback: navigate to dashboard anyway
        addToast('سيتم ربط ملفك الشخصي قريباً', 'info');
        router.push('/dashboard');
        return;
      }

      const result = await createStudentProfile({
        countryCode: country,
        curriculumId,
        gradeId,
        educationLevel,
        planType: selected as any,
        academicYear: '2024-2025',
        weeklyGoalHours: 10,
      });

      if (result.error) {
        addToast(result.error, 'error');
      } else {
        addToast('🎉 تم إنشاء ملفك الشخصي بنجاح!', 'success');
        localStorage.removeItem('onboarding_country');
        localStorage.removeItem('onboarding_curriculum');
        localStorage.removeItem('onboarding_grade_id');
        localStorage.removeItem('onboarding_stage');
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      addToast('حدث خطأ. جارٍ التحويل...', 'error');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl animate-fade-in">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2 flex-1">
            <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
              i < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
              {i < 2 ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && <div className={cn('h-1 flex-1 rounded-full', i < 2 ? 'bg-primary' : 'bg-muted')} />}
          </div>
        ))}
      </div>

      <div className="text-center mb-8 space-y-2">
        <Badge className="bg-primary/10 text-primary border-primary/20">الخطوة 3 من 3</Badge>
        <h1 className="text-3xl font-black">اختر باقتك 🚀</h1>
        <p className="text-muted-foreground">يمكنك الترقية أو الإلغاء في أي وقت</p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className={cn('text-sm font-medium', billing === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>شهري</span>
        <button onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
          className={cn('w-12 h-6 rounded-full transition-colors relative', billing === 'yearly' ? 'bg-primary' : 'bg-muted')}>
          <div className={cn('h-5 w-5 bg-white rounded-full absolute top-0.5 transition-all shadow', billing === 'yearly' ? 'right-0.5' : 'left-0.5')} />
        </button>
        <span className={cn('text-sm font-medium', billing === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>
          سنوي <Badge variant="success" className="mr-1 text-xs">وفّر 20%</Badge>
        </span>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {plans.map((plan) => {
          const price = billing === 'yearly' ? (plan.price * 10).toFixed(0) : plan.price;
          return (
            <button key={plan.type} onClick={() => setSelected(plan.type)}
              className={cn('relative rounded-2xl border-2 p-5 text-right space-y-4 transition-all',
                selected === plan.type ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]' : 'border-border hover:border-primary/40',
                plan.recommended && 'ring-2 ring-primary/20')}>
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white flex items-center gap-1 px-3">
                    <Crown className="h-3 w-3" /> الأكثر شعبية
                  </Badge>
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-2xl shadow-md`}>{plan.icon}</div>
              <div>
                <h3 className="font-black text-lg">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.desc}</p>
              </div>
              <div className="flex items-baseline gap-1">
                {plan.price === 0
                  ? <span className="text-2xl font-black text-green-600">مجاني</span>
                  : <><span className="text-2xl font-black">${price}</span><span className="text-xs text-muted-foreground">/{billing === 'yearly' ? 'سنة' : 'شهر'}</span></>}
              </div>
              <ul className="space-y-1.5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              {selected === plan.type && (
                <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                  <Zap className="h-3 w-3" /> باقتك المختارة
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronRight className="h-4 w-4" /> السابق
        </Button>
        <Button onClick={handleFinish} loading={loading} variant="gradient" size="lg">
          ابدأ التعلم الآن! 🎓
        </Button>
      </div>
    </div>
  );
}
