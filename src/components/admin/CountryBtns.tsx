'use client';
import { deleteCountry, toggleCountryActive } from '@/actions/admin.actions';
import { useState } from 'react';

export function DeleteCountryBtn({ countryId, countryName }: { countryId: string; countryName: string }) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!confirm) { setConfirm(true); return; }
    setLoading(true);
    setError('');
    const result = await deleteCountry(countryId);
    if (!result.success) {
      setError(result.error || 'حدث خطأ');
      setConfirm(false);
    }
    setLoading(false);
  };

  if (error) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-red-500">{error}</span>
        <button onClick={() => setError('')} className="text-xs text-muted-foreground hover:underline">إغلاق</button>
      </div>
    );
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className={`text-xs transition-colors disabled:opacity-50 ${confirm ? 'text-red-600 font-bold hover:underline' : 'text-red-500 hover:underline'}`}>
      {loading ? 'جارٍ الحذف...' : confirm ? 'تأكيد الحذف؟' : 'حذف'}
    </button>
  );
}

export function ToggleCountryBtn({ countryId, isActive }: { countryId: string; isActive: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await toggleCountryActive(countryId);
    setLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={loading}
      className="text-xs text-primary hover:underline disabled:opacity-50">
      {loading ? '...' : isActive ? 'تعطيل' : 'تفعيل'}
    </button>
  );
}
