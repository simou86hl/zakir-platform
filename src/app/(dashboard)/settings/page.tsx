export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Bell, Shield, CreditCard, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'الإعدادات' };

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user as any;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black">الإعدادات ⚙️</h1>
        <p className="text-muted-foreground mt-1">إدارة حسابك وتفضيلاتك</p>
      </div>

      {/* Profile section */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            الملف الشخصي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-black text-2xl shadow-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <h3 className="font-bold text-lg">{user?.firstName} {user?.lastName}</h3>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              <Badge className="mt-1 bg-primary/10 text-primary border-primary/20 text-xs">طالب</Badge>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="الاسم الأول" defaultValue={user?.firstName || ''} />
            <Input label="اسم العائلة" defaultValue={user?.lastName || ''} />
            <Input label="البريد الإلكتروني" type="email" defaultValue={user?.email || ''} />
            <Input label="رقم الجوال" type="tel" placeholder="+966 5x xxx xxxx" />
          </div>
          <Button variant="gradient">حفظ التغييرات</Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            الأمان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="كلمة المرور الحالية" type="password" placeholder="••••••••" />
            <Input label="كلمة المرور الجديدة" type="password" placeholder="••••••••" />
          </div>
          <Button variant="outline">تغيير كلمة المرور</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'تذكيرات الدراسة اليومية', desc: 'يُرسل تذكير يومي للدراسة', defaultOn: true },
            { label: 'إشعارات الإنجازات', desc: 'عند فتح إنجاز جديد', defaultOn: true },
            { label: 'إشعارات الاشتراك', desc: 'تجديد وانتهاء الاشتراك', defaultOn: true },
            { label: 'المحتوى الجديد', desc: 'عند إضافة دروس جديدة', defaultOn: false },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.defaultOn} className="sr-only peer" />
                <div className="w-10 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:bg-primary transition-colors
                  after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            الاشتراك
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div>
              <p className="font-bold">الباقة التجريبية المجانية</p>
              <p className="text-sm text-muted-foreground">مادة واحدة • 5 دروس مجانية</p>
            </div>
            <Button variant="gradient" asChild>
              <Link href="/settings/subscription">ترقية الباقة ⬆️</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="shadow-sm border-red-200 dark:border-red-900">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold text-red-600">منطقة الخطر</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">حذف الحساب</p>
            <p className="text-xs text-muted-foreground">سيتم حذف جميع بياناتك نهائياً</p>
          </div>
          <Button variant="destructive" size="sm">حذف الحساب</Button>
        </CardContent>
      </Card>
    </div>
  );
}
