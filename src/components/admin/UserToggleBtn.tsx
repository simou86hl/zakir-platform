'use client';
import { toggleUserActive } from '@/actions/admin.actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function UserToggleBtn({ userId, isActive }: { userId: string; isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    await toggleUserActive(userId);
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-2 py-1 text-xs rounded transition-colors disabled:opacity-50 ${isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
    >
      {loading ? '...' : isActive ? 'تعطيل' : 'تفعيل'}
    </button>
  );
}
