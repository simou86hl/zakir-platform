'use client';
import { toggleSubjectActive } from '@/actions/admin.actions';
import { useState } from 'react';

export function ToggleSubjectBtn({ subjectId, isActive }: { subjectId: string; isActive: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await toggleSubjectActive(subjectId);
    setLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={loading}
      className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors disabled:opacity-50"
      title={isActive ? 'تعطيل المادة' : 'تفعيل المادة'}>
      {loading ? '...' : isActive ? '⏸' : '▶'}
    </button>
  );
}
