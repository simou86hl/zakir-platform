export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Database, Mail, Shield, Globe, RefreshCw } from 'lucide-react';

export const metadata = { title: 'إعدادات النظام' };

async function getSettings() {
  try {
    const settings = await prisma.systemSetting.findMany({ orderBy: { key: 'asc' } });
    return Object.fromEntries(settings.map(s => [s.key, s.value]));
  } catch { return {}; }
}

async function getSystemHealth() {
  try {
    const [userCount, subjectCount, lessonCount] = await Promise.all([
      prisma.user.count(),
      prisma.subject.count(),
      prisma.lesson.count(),
    ]);
    return { userCount, subjectCount, lessonCount, dbStatus: 'متصل ✅' };
  } catch { return { userCount: 0, subjectCount: 0, lessonCount: 0, dbStatus: 'خطأ ❌' }; }
}

export default async function AdminSettingsPage() {
  const [settings, health] = await Promise.all([getSettings(), getSystemHealth()]);

  const appName = (settings.app_name as any)?.ar || 'ذاكر';
  const maintenanceMode = (settings.maintenance_mode as any)?.enabled || false;
  const registrationEnabled = (settings.registration_enabled as any)?.enabled ?? true;
  const pointsConfig = (settings.points_config as any) || {};
  const xpThresholds = (settings.xp_thresholds as any)?.thresholds || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black">إعدادات النظام ⚙️</h1>
        <p className="text-muted-foreground mt-1">إعدادات وتكوين منصة ذاكر</p>
      </div>

      {/* System health */}
      <Card className="shadow-sm border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Database className="h-5 w-5 text-green-600" />
            صحة النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'حالة قاعدة البيانات', value: health.dbStatus },
              { label: 'المستخدمون', value: health.userCount.toString() },
              { label: 'المواد', value: health.subjectCount.toString() },
              { label: 'الدروس', value: health.lessonCount.toString() },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-black/20 rounded-xl p-3 text-center">
                <div className="font-black text-lg">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* App settings */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            إعدادات التطبيق
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="اسم التطبيق (عربي)" defaultValue={appName} />
            <Input label="اسم التطبيق (إنجليزي)" defaultValue={(settings.app_name as any)?.en || 'Zakir'} />
            <Input label="إصدار التطبيق" defaultValue={(settings.app_version as any)?.version || '1.0.0'} />
            <Input label="رابط الموقع" defaultValue={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'} />
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'وضع الصيانة', desc: 'إيقاف المنصة مؤقتاً للصيانة', checked: maintenanceMode, key: 'maintenance' },
              { label: 'تسجيل المستخدمين', desc: 'السماح للمستخدمين الجدد بالتسجيل', checked: registrationEnabled, key: 'registration' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                  <div className="w-10 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors
                    after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>
          <Button variant="gradient">حفظ إعدادات التطبيق</Button>
        </CardContent>
      </Card>

      {/* Points config */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-600" />
            إعدادات النقاط والمستويات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'نقاط التمرين الصحيح', key: 'exercise', default: 10 },
              { label: 'نقاط اجتياز الاختبار', key: 'quiz', default: 20 },
              { label: 'نقاط إكمال الدرس', key: 'lesson', default: 15 },
              { label: 'نقاط اليوم المتتالي', key: 'streak', default: 5 },
              { label: 'خصم التلميح', key: 'hint_penalty', default: -2 },
            ].map(f => (
              <Input key={f.key} label={f.label} type="number" defaultValue={pointsConfig[f.key] ?? f.default} />
            ))}
          </div>
          <Button variant="outline">تحديث إعدادات النقاط</Button>
        </CardContent>
      </Card>

      {/* Email settings */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            إعدادات البريد الإلكتروني
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="SMTP Host" defaultValue={process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com'} />
            <Input label="SMTP Port" type="number" defaultValue={process.env.EMAIL_SERVER_PORT || '587'} />
            <Input label="البريد المُرسِل" type="email" defaultValue={process.env.EMAIL_SERVER_USER || ''} />
            <Input label="كلمة المرور" type="password" placeholder="••••••••" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline">اختبار الاتصال</Button>
            <Button variant="gradient">حفظ إعدادات البريد</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="shadow-sm border-red-200 dark:border-red-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-red-600">منطقة الخطر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'إعادة تعيين إحصائيات المستخدمين', desc: 'حذف جميع بيانات التقدم (لا يمكن التراجع)', action: 'تنبيه: خطير' },
            { label: 'حذف المحتوى التجريبي', desc: 'حذف جميع بيانات seed', action: 'حذف' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-xl">
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Button variant="destructive" size="sm">{item.action}</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
