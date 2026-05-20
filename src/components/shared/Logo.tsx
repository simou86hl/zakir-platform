import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export function Logo({ className, size = 'md', href = '/' }: LogoProps) {
  const sizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-4xl' };
  
  return (
    <Link href={href} className={cn('flex items-center gap-2 font-bold', sizes[size], className)}>
      <div className="relative">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-md">
          <span className="text-white text-lg font-black">ذ</span>
        </div>
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-400 border-2 border-white" />
      </div>
      <span className="bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
        ذاكر
      </span>
    </Link>
  );
}
