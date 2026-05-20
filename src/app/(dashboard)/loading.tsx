import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="md" text="جارٍ التحميل..." />
    </div>
  );
}
