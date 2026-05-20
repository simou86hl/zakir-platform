import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-muted rounded-md', className)} />;
}

export function SubjectCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="h-1.5 w-full bg-muted" />
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3].map(i => <Skeleton key={i} className="h-12 rounded-lg" />)}
        </div>
        <Skeleton className="h-2 rounded-full" />
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function LessonRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-t">
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-3">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-7 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-card p-5 space-y-4">
            <Skeleton className="h-5 w-32" />
            {[1,2,3].map(i => <Skeleton key={i} className="h-14" />)}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <Skeleton className="h-5 w-24" />
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-12" />)}
        </div>
      </div>
    </div>
  );
}
