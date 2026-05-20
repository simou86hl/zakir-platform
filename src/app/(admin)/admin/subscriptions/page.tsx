export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';

export const metadata = { title: 'إدارة الاشتراكات' };

async function getSubs() {
  try {
    return await prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        plan: { select: { nameAr: true, type: true } },
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
  } catch { return []; }
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700', TRIAL: 'bg-blue-100 text-blue-700',
  EXPIRED: 'bg-red-100 text-red-700', CANCELLED: 'bg-gray-100 text-gray-600',
  SUSPENDED: 'bg-yellow-100 text-yellow-700',
};
const statusLabels: Record<string, string> = {
  ACTIVE: 'نشط', TRIAL: 'تجريبي', EXPIRED: 'منتهي', CANCELLED: 'ملغى', SUSPENDED: 'موقوف',
};
const planColors: Record<string, string> = {
  FREE: 'bg-gray-100 text-gray-600', BASIC: 'bg-blue-100 text-blue-600', PRO: 'bg-purple-100 text-purple-600',
};

export default async function SubscriptionsPage() {
  const subs = await getSubs();
  const stats = {
    total: subs.length,
    active: subs.filter(s => s.status === 'ACTIVE').length,
    pro: subs.filter(s => s.plan.type === 'PRO').length,
    revenue: subs.filter(s => ['ACTIVE','TRIAL'].includes(s.status))
      .reduce((a, s) => a + (s.payments[0]?.amount || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">إدارة الاشتراكات 💳</h1>
        <p className="text-muted-foreground">{subs.length} اشتراك مسجل</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي', value: stats.total, color: 'from-blue-500 to-blue-600' },
          { label: 'نشطة', value: stats.active, color: 'from-green-500 to-emerald-600' },
          { label: 'PRO', value: stats.pro, color: 'from-purple-500 to-purple-600' },
          { label: 'إيرادات ($)', value: stats.revenue.toFixed(0), color: 'from-yellow-500 to-orange-500' },
        ].map(s => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-2 shadow-sm`}>
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {['المستخدم', 'الباقة', 'الحالة', 'الدورة', 'تاريخ الانتهاء', 'إجراءات'].map(h => (
                    <th key={h} className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">لا توجد اشتراكات</td></tr>
                ) : subs.map(sub => (
                  <tr key={sub.id} className="border-t hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{sub.user.firstName} {sub.user.lastName}</p>
                        <p className="text-xs text-muted-foreground">{sub.user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${planColors[sub.plan.type] || ''} text-xs`}>{sub.plan.nameAr}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${statusColors[sub.status] || ''} text-xs`}>{statusLabels[sub.status] || sub.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-xs">{sub.billingCycle === 'YEARLY' ? 'سنوي' : 'شهري'}</td>
                    <td className="py-3 px-4 text-xs">{new Date(sub.endDate).toLocaleDateString('ar-SA')}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">تمديد</button>
                        <button className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">إلغاء</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
