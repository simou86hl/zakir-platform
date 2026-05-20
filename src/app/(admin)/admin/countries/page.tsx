export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, BookOpen, GraduationCap } from 'lucide-react';
import { AddCountryForm } from '@/components/admin/AddCountryForm';

export const metadata = { title: 'إدارة الدول والمناهج' };

async function getData() {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        curricula: {
          include: {
            grades: { include: { grade: true } },
          },
        },
        _count: { select: { studentProfiles: true } },
      },
    });
    return countries;
  } catch { return []; }
}

export default async function CountriesPage() {
  const countries = await getData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">الدول والمناهج 🌍</h1>
          <p className="text-muted-foreground">{countries.length} دولة عربية مسجلة</p>
        </div>
        <AddCountryForm />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'دول مسجلة', value: countries.length, icon: Globe, color: 'from-blue-500 to-blue-600' },
          { label: 'مناهج', value: countries.reduce((a, c) => a + c.curricula.length, 0), icon: BookOpen, color: 'from-purple-500 to-purple-600' },
          { label: 'طلاب مسجلون', value: countries.reduce((a, c) => a + c._count.studentProfiles, 0), icon: GraduationCap, color: 'from-green-500 to-emerald-600' },
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

      {/* Countries grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.length === 0 ? (
          <div className="col-span-3 text-center py-20 text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد دول. شغّل الـ seed أو أضف دولة يدوياً.</p>
          </div>
        ) : countries.map((country) => (
          <Card key={country.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{country.flag}</span>
                  <div>
                    <h3 className="font-bold">{country.nameAr}</h3>
                    <p className="text-xs text-muted-foreground">{country.nameEn} • {country.code}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${country.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {country.isActive ? 'نشط' : 'معطل'}
                </span>
              </div>

              <div className="space-y-2">
                {country.curricula.length === 0 ? (
                  <p className="text-xs text-muted-foreground">لا يوجد منهج</p>
                ) : country.curricula.map((curr) => (
                  <div key={curr.id} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">{curr.nameAr}</span>
                      <span className="text-xs text-muted-foreground">{curr.grades.length} صف</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {curr.grades.slice(0, 6).map((cg) => (
                        <span key={cg.id} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          {cg.grade.level}
                        </span>
                      ))}
                      {curr.grades.length > 6 && (
                        <span className="text-xs text-muted-foreground">+{curr.grades.length - 6}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-muted-foreground">
                <span>👥 {country._count.studentProfiles} طالب</span>
                <div className="flex gap-2">
                  <button className="text-primary hover:underline">تعديل</button>
                  <button className="text-red-500 hover:underline">حذف</button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
