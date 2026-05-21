export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Globe, CreditCard, TrendingUp, Activity } from 'lucide-react';

export const metadata = { title: 'لوحة الإدارة' };

async function getStats() {
  try {
    const [users, subjects, countries, activeSubscriptions, newUsersToday] = await Promise.all([
      prisma.user.count(),
      prisma.subject.count(),
      prisma.country.count({ where: { isActive: true } }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } }),
    ]);
    return { users, subjects, countries, activeSubscriptions, newUsersToday };
  } catch {
    return { users: 0, subjects: 0, countries: 22, activeSubscriptions: 0, newUsersToday: 0 };
  }
}

async function getRecentUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true, isActive: true },
    });
  } catch { return []; }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const recentUsers = await getRecentUsers();

  const statCards = [
    { label: 'إجمالي المستخدمين', value: stats.users.toLocaleString('ar'), icon: Users,          color: 'from-blue-500 to-blue-600',    change: `+${stats.newUsersToday} اليوم` },
    { label: 'مواد دراسية',        value: stats.subjects.toLocaleString('ar'), icon: BookOpen,  color: 'from-purple-500 to-purple-600',change: 'نشطة' },
    { label: 'دول عربية',          value: stats.countries.toLocaleString('ar'), icon: Globe,     color: 'from-green-500 to-emerald-600', change: 'مدعومة' },
    { label: 'اشتراكات نشطة',      value: stats.activeSubscriptions.toLocaleString('ar'), icon: CreditCard, color: 'from-orange-500 to-red-500', change: 'مدفوعة' },
  ];

  const roleColors: Record<string, string> = {
    STUDENT: 'bg-blue-100 text-blue-700',
    ADMIN: 'bg-orange-100 text-orange-700',
    SUPER_ADMIN: 'bg-red-100 text-red-700',
  };
  const roleLabels: Record<string, string> = {
    STUDENT: 'طالب', ADMIN: 'أدمن', SUPER_ADMIN: 'سوبر أدمن',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">لوحة الإدارة 🛠️</h1>
        <p className="text-muted-foreground mt-1">إدارة شاملة لمنصة ذاكر التعليمية</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-sm`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              <div className="text-xs text-green-600 mt-1 font-medium">{s.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/admin/countries', icon: '🌍', label: 'إدارة الدول', desc: 'إضافة وتعديل الدول والمناهج', color: 'bg-blue-50 border-blue-200' },
          { href: '/admin/subjects', icon: '📚', label: 'إدارة المواد', desc: 'إضافة مواد ووحدات ودروس', color: 'bg-purple-50 border-purple-200' },
          { href: '/admin/users', icon: '👥', label: 'إدارة المستخدمين', desc: 'عرض وتعديل الحسابات', color: 'bg-green-50 border-green-200' },
          { href: '/admin/content', icon: '✏️', label: 'محرر المحتوى', desc: 'كتابة وتعديل محتوى الدروس', color: 'bg-orange-50 border-orange-200' },
        ].map((a) => (
          <a key={a.href} href={a.href} className={`block p-4 rounded-xl border ${a.color} hover:shadow-md transition-all card-hover`}>
            <div className="text-3xl mb-2">{a.icon}</div>
            <h3 className="font-bold text-sm">{a.label}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
          </a>
        ))}
      </div>

      {/* Recent users */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              أحدث المستخدمين
            </CardTitle>
            <a href="/admin/users" className="text-sm text-primary hover:underline">عرض الكل ←</a>
          </div>
        </CardHeader>
        <CardContent>
          {recentUsers.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">لا يوجد مستخدمون بعد - شغّل seed أولاً</p>
          ) : (
            <>
              {/* Desktop table - hidden on mobile */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-2 px-3 text-muted-foreground font-medium">المستخدم</th>
                        <th className="text-right py-2 px-3 text-muted-foreground font-medium">البريد</th>
                        <th className="text-right py-2 px-3 text-muted-foreground font-medium">الدور</th>
                        <th className="text-right py-2 px-3 text-muted-foreground font-medium">الحالة</th>
                        <th className="text-right py-2 px-3 text-muted-foreground font-medium">تاريخ التسجيل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((u) => (
                        <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {u.firstName[0]}{u.lastName[0]}
                              </div>
                              <span className="font-medium">{u.firstName} {u.lastName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{u.email}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] || ''}`}>
                              {roleLabels[u.role] || u.role}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {u.isActive ? 'نشط' : 'معطل'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground text-xs">
                            {new Date(u.createdAt).toLocaleDateString('ar-SA')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards - hidden on desktop */}
              <div className="lg:hidden space-y-3">
                {recentUsers.map((u) => (
                  <Card key={u.id} className="border shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {u.firstName[0]}{u.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{u.firstName} {u.lastName}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.isActive ? 'نشط' : 'معطل'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] || ''}`}>
                          {roleLabels[u.role] || u.role}
                        </span>
                        <span className="text-muted-foreground">{new Date(u.createdAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
