export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export const metadata = { title: 'الطلاب' };

export default async function TeacherStudentsPage() {
  let students: any[] = [];
  try {
    students = await prisma.studentProfile.findMany({
      take: 30,
      orderBy: { lastActiveAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, isActive: true } },
        grade: { select: { nameAr: true } },
        curriculum: { select: { nameAr: true } },
        country: { select: { nameAr: true, flag: true } },
      },
    });
  } catch {}

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black">👥 الطلاب</h1>
        <p className="text-muted-foreground mt-1">متابعة تقدم الطلاب المسجلين</p>
      </div>

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Users className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-bold">لا يوجد طلاب مسجلون بعد</h2>
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">الطلاب المسجلون ({students.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">الطالب</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">البريد</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">المنهج</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">الصف</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">النقاط</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((sp) => (
                    <tr key={sp.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {sp.user?.firstName?.[0]}{sp.user?.lastName?.[0]}
                          </div>
                          <span className="font-medium">{sp.user?.firstName} {sp.user?.lastName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground text-xs">{sp.user?.email}</td>
                      <td className="py-3 px-3">
                        <span className="text-xs">{sp.country?.flag} {sp.curriculum?.nameAr}</span>
                      </td>
                      <td className="py-3 px-3 text-xs">{sp.grade?.nameAr}</td>
                      <td className="py-3 px-3">
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">{sp.totalPoints}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
