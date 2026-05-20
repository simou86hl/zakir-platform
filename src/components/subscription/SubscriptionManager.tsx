'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { CheckCircle2, Crown, Zap, CreditCard, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const planIcons: Record<string, string> = { FREE: '🎁', BASIC: '⭐', PRO: '👑' };
const planColors: Record<string, string> = {
  FREE: 'border-gray-200', BASIC: 'border-blue-300', PRO: 'border-purple-400',
};
const planGradients: Record<string, string> = {
  FREE: 'from-gray-400 to-gray-500',
  BASIC: 'from-blue-500 to-blue-600',
  PRO: 'from-purple-500 to-purple-700',
};

interface Plan {
  id: string; nameAr: string; nameEn: string; type: string;
  priceMonthly: number; priceYearly: number; features: any;
  maxSubjects: number | null; hasAnalytics: boolean; hasDownloads: boolean; hasPriority: boolean;
}
interface Subscription {
  id: string; status: string; billingCycle: string;
  startDate: Date; endDate: Date; autoRenew: boolean;
  plan: Plan; payments: any[];
}

export function SubscriptionManager({ plans, currentSubscription, userId }: {
  plans: Plan[]; currentSubscription: Subscription | null; userId: string;
}) {
  const { addToast } = useToast();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [tab, setTab] = useState<'plans' | 'history'>('plans');

  const currentPlanType = currentSubscription?.plan?.type || 'FREE';
  const daysLeft = currentSubscription
    ? Math.max(0, Math.ceil((new Date(currentSubscription.endDate).getTime() - Date.now()) / 86400000))
    : 0;

  const handleUpgrade = async (planType: string) => {
    if (planType === currentPlanType) return;
    setLoading(planType);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    addToast('🚀 تم تحديث الباقة! (في النسخة الإنتاجية سيتم التوجيه لبوابة الدفع)', 'success');
    setLoading(null);
  };

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700', TRIAL: 'bg-blue-100 text-blue-700',
    EXPIRED: 'bg-red-100 text-red-700', CANCELLED: 'bg-gray-100 text-gray-700',
  };
  const statusLabels: Record<string, string> = {
    ACTIVE: 'نشط', TRIAL: 'تجريبي', EXPIRED: 'منتهي', CANCELLED: 'ملغى',
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black">إدارة الاشتراك 💳</h1>
        <p className="text-muted-foreground mt-1">إدارة باقتك وسجل المدفوعات</p>
      </div>

      {/* Current Plan Banner */}
      <Card className={`shadow-md border-2 ${planColors[currentPlanType] || 'border-border'} bg-gradient-to-br from-background to-muted/30`}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${planGradients[currentPlanType]} flex items-center justify-center text-3xl shadow-lg`}>
                {planIcons[currentPlanType]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black">{currentSubscription?.plan?.nameAr || 'مجاني'}</h2>
                  {currentSubscription?.status && (
                    <Badge className={statusColors[currentSubscription.status] || ''}>
                      {statusLabels[currentSubscription.status] || currentSubscription.status}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentPlanType === 'FREE'
                    ? 'باقة مجانية - الوصول المحدود'
                    : `${currentSubscription?.billingCycle === 'YEARLY' ? 'سنوي' : 'شهري'} • ${daysLeft} يوم متبقي`}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {currentPlanType !== 'PRO' && (
                <Button variant="gradient" onClick={() => setTab('plans')} className="gap-2">
                  <Crown className="h-4 w-4" />ترقية الباقة
                </Button>
              )}
              {currentSubscription?.autoRenew && currentPlanType !== 'FREE' && (
                <p className="text-xs text-muted-foreground text-center flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  يتجدد تلقائياً في {new Date(currentSubscription.endDate).toLocaleDateString('ar-SA')}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex border-b gap-1">
        {[{ id: 'plans', label: 'الباقات المتاحة' }, { id: 'history', label: 'سجل المدفوعات' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={cn('px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
              tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'plans' && (
        <div className="space-y-4">
          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={cn('text-sm font-medium', billing === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>شهري</span>
            <button onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
              className={cn('w-12 h-6 rounded-full transition-colors relative', billing === 'yearly' ? 'bg-primary' : 'bg-muted')}>
              <div className={cn('h-5 w-5 bg-white rounded-full absolute top-0.5 transition-all shadow', billing === 'yearly' ? 'right-0.5' : 'left-0.5')} />
            </button>
            <span className={cn('text-sm font-medium', billing === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>
              سنوي <Badge variant="success" className="mr-1 text-xs">وفّر 20%</Badge>
            </span>
          </div>

          {/* Plans grid */}
          <div className="grid md:grid-cols-3 gap-5">
            {plans.map(plan => {
              const isCurrent = plan.type === currentPlanType;
              const price = billing === 'yearly' ? plan.priceYearly : plan.priceMonthly;
              const features = plan.features?.ar || plan.features?.en || [];
              const isUpgrade = ['FREE', 'BASIC', 'PRO'].indexOf(plan.type) > ['FREE', 'BASIC', 'PRO'].indexOf(currentPlanType);

              return (
                <div key={plan.id}
                  className={cn('relative rounded-2xl border-2 p-6 space-y-5 transition-all',
                    plan.type === 'PRO' ? 'border-purple-400 shadow-xl' :
                    isCurrent ? 'border-primary shadow-md' : 'border-border hover:border-primary/40',
                    plan.type === 'PRO' && 'scale-[1.02]')}>
                  {plan.type === 'PRO' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white px-4 flex items-center gap-1">
                        <Crown className="h-3 w-3" /> الأكثر شعبية
                      </Badge>
                    </div>
                  )}
                  {isCurrent && plan.type !== 'PRO' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-white px-3">باقتك الحالية</Badge>
                    </div>
                  )}

                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${planGradients[plan.type]} flex items-center justify-center text-3xl shadow-md`}>
                    {planIcons[plan.type]}
                  </div>

                  <div>
                    <h3 className="text-xl font-black">{plan.nameAr}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      {price === 0
                        ? <span className="text-3xl font-black text-green-600">مجاني</span>
                        : <>
                            <span className="text-3xl font-black">${price}</span>
                            <span className="text-muted-foreground text-sm">/{billing === 'yearly' ? 'سنة' : 'شهر'}</span>
                          </>}
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {(Array.isArray(features) ? features : []).map((f: string) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {plan.maxSubjects && <li className="text-xs text-muted-foreground">الحد الأقصى: {plan.maxSubjects} مواد</li>}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.type === 'PRO' ? 'gradient' : isCurrent ? 'outline' : 'default'}
                    disabled={isCurrent || loading === plan.type}
                    loading={loading === plan.type}
                    onClick={() => handleUpgrade(plan.type)}>
                    {isCurrent ? '✓ باقتك الحالية' : isUpgrade ? `الترقية لـ ${plan.nameAr}` : `التخفيض لـ ${plan.nameAr}`}
                  </Button>
                </div>
              );
            })}
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">ملاحظة حول الدفع</p>
                <p className="mt-0.5 text-xs leading-relaxed">
                  في نسخة الإنتاج سيتم التكامل مع Stripe لمعالجة المدفوعات بشكل آمن. حالياً يمكنك اختبار الواجهة.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'history' && (
        <Card className="shadow-sm">
          <CardContent className="p-0">
            {(!currentSubscription?.payments || currentSubscription.payments.length === 0) ? (
              <div className="text-center py-16 space-y-3">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/30" />
                <p className="text-muted-foreground">لا يوجد سجل مدفوعات</p>
                <p className="text-xs text-muted-foreground">ستظهر هنا مدفوعاتك بعد الاشتراك</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {['التاريخ', 'المبلغ', 'الحالة', 'رقم العملية'].map(h => (
                      <th key={h} className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentSubscription.payments.map((p: any) => (
                    <tr key={p.id} className="border-t hover:bg-muted/20">
                      <td className="py-3 px-4 text-xs">{new Date(p.createdAt).toLocaleDateString('ar-SA')}</td>
                      <td className="py-3 px-4 font-bold">${p.amount}</td>
                      <td className="py-3 px-4">
                        <Badge className={p.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {p.status === 'COMPLETED' ? 'مكتمل' : p.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground font-mono">{p.transactionId || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
