'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

export function AddCountryForm() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        إضافة دولة
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">إضافة دولة جديدة</h2>
          <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setOpen(false); }}>
          <Input label="الاسم بالعربية" placeholder="المملكة العربية السعودية" required />
          <Input label="الاسم بالإنجليزية" placeholder="Saudi Arabia" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="الكود (2 حروف)" placeholder="SA" maxLength={2} required />
            <Input label="رمز العلم (emoji)" placeholder="🇸🇦" required />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">حفظ</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
          </div>
        </form>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          * سيتم ربط الـ server action في المرحلة القادمة
        </p>
      </div>
    </div>
  );
}
