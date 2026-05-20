import { cn } from '@/lib/utils';

interface LoadingSpinnerProps { size?: 'sm' | 'md' | 'lg'; className?: string; text?: string; }

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizes = { sm: 'h-5 w-5 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' };
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className={cn('border-primary/20 border-t-primary rounded-full animate-spin', sizes[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="جارٍ التحميل..." /></div>;
}
