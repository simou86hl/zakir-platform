'use client';
import { extendSubscription, cancelSubscription } from '@/actions/admin.actions';
import { useState } from 'react';
import { X } from 'lucide-react';

export function ExtendSubBtn({ subscriptionId, endDate }: { subscriptionId: string; endDate: Date }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await extendSubscription(subscriptionId, days);
    setOpen(false);
    setLoading(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">
        تمديد
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">تمديد الاشتراك</h2>
          <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          ينتهي في: {new Date(endDate).toLocaleDateString('ar-SA')}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">مدة التمديد (أيام)</label>
            <div className="flex gap-2">
              {[7, 30, 90, 365].map(d => (
                <button key={d} type="button" onClick={() => setDays(d)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${days === d ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}>
                  {d === 7 ? 'أسبوع' : d === 30 ? 'شهر' : d === 90 ? '3 أشهر' : 'سنة'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 h-10 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {loading ? 'جارٍ التمديد...' : `تمديد ${days} يوم`}
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

export function CancelSubBtn({ subscriptionId }: { subscriptionId: string }) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleCancel = async () => {
    if (!confirm) { setConfirm(true); return; }
    setLoading(true);
    await cancelSubscription(subscriptionId);
    setConfirm(false);
    setLoading(false);
  };

  return (
    <button onClick={handleCancel} disabled={loading}
      className={`px-2 py-1 text-xs rounded transition-colors disabled:opacity-50 ${confirm ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
      {loading ? 'جارٍ الإلغاء...' : confirm ? 'تأكيد الإلغاء؟' : 'إلغاء'}
    </button>
  );
}
