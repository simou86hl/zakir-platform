import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export const metadata = { title: 'الاختبارات' };

export default async function TeacherQuizzesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black">📝 الاختبارات</h1>
        <p className="text-muted-foreground mt-1">إدارة اختبارات الدروس والوحدات</p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <ClipboardList className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-bold">قريباً</h2>
        <p className="text-muted-foreground text-sm">سيتم إضافة هذه الميزة قريباً</p>
      </div>
    </div>
  );
}
