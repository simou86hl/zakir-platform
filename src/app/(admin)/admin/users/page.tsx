export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Search } from 'lucide-react';

export const metadata = { title: 'إدارة المستخدمين' };

async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        studentProfile: { select: { id: true, level: true, totalPoints: true, studyStreak: true } },
        subscription: { include: { plan: { select: { nameAr: true, type: true } } } },
      },
    });
  } catch { return []; }
}

const roleColors: Record<string, string> = {
  STUDENT: 'bg-blue-100 text-blue-700',
  ADMIN: 'bg-orange-100 text-orange-700', SUPER_ADMIN: 'bg-red-100 text-red-700',
};
const roleLabels: Record<string, string> = {
  STUDENT: 'طالب', ADMIN: 'أدمن', SUPER_ADMIN: 'سوبر أدمن',
};
const planColors: Record<string, string> = {
  FREE: 'bg-gray-100 text-gray-600', BASIC: 'bg-blue-100 text-blue-600', PRO: 'bg-purple-100 text-purple-600',
};

export default async function UsersPage() {
  const users = await getUsers();
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    students: users.filter(u => u.role === 'STUDENT').length,
    withProfile: users.filter(u => u.studentProfile).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">إدارة المستخدمين 👥</h1>
          <p className="text-muted-foreground">{users.length} مستخدم مسجل</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي', value: stats.total, icon: Users, color: 'from-blue-500 to-blue-600' },
          { label: 'نشطون', value: stats.active, icon: UserCheck, color: 'from-green-500 to-emerald-600' },
          { label: 'طلاب', value: stats.students, icon: Users, color: 'from-purple-500 to-purple-600' },
          { label: 'لديهم ملف', value: stats.withProfile, icon: UserCheck, color: 'from-orange-500 to-orange-600' },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-black">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">قائمة المستخدمين</CardTitle>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="search" placeholder="بحث..." className="h-9 bg-muted rounded-lg pr-9 pl-4 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {['المستخدم', 'البريد الإلكتروني', 'الدور', 'الباقة', 'المستوى', 'الحالة', 'تاريخ التسجيل', 'إجراءات'].map(h => (
                    <th key={h} className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">لا توجد بيانات. شغّل: npx tsx data/seed/index.ts</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{u.firstName} {u.lastName}</p>
                          {u.studentProfile && (
                            <p className="text-xs text-muted-foreground">🔥 {u.studentProfile.studyStreak} أيام</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] || ''}`}>
                        {roleLabels[u.role] || u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {u.subscription ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planColors[u.subscription.plan.type] || ''}`}>
                          {u.subscription.plan.nameAr}
                        </span>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="py-3 px-4">
                      {u.studentProfile ? (
                        <div>
                          <span className="font-bold text-sm">Lv.{u.studentProfile.level}</span>
                          <span className="text-xs text-muted-foreground mr-1">({u.studentProfile.totalPoints} نقطة)</span>
                        </div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? '● نشط' : '● معطل'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">تعديل</button>
                        <button className={`px-2 py-1 text-xs rounded transition-colors ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                          {u.isActive ? 'تعطيل' : 'تفعيل'}
                        </button>
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
