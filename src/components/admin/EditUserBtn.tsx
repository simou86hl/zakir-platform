'use client';
import { updateUser } from '@/actions/admin.actions';
import { useState } from 'react';
import { X } from 'lucide-react';

export function EditUserBtn({ userId, firstName, lastName, role }: { userId: string; firstName: string; lastName: string; role: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ firstName, lastName, role });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await updateUser(userId, form);
    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error || 'حدث خطأ');
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">
        تعديل
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">تعديل بيانات المستخدم</h2>
          <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">الاسم الأول</label>
            <input
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
              className="w-full h-10 border rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">الاسم الأخير</label>
            <input
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
              className="w-full h-10 border rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">الدور</label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full h-10 border rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="STUDENT">طالب</option>
              <option value="ADMIN">أدمن</option>
              <option value="SUPER_ADMIN">سوبر أدمن</option>
            </select>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 h-10 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {loading ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 border rounded-lg text-sm hover:bg-muted transition-colors">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
