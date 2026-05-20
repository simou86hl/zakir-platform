'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, TrendingUp, Trophy, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
  { href: '/subjects', icon: BookOpen, label: 'المواد' },
  { href: '/progress', icon: TrendingUp, label: 'تقدمي' },
  { href: '/achievements', icon: Trophy, label: 'الإنجازات' },
  { href: '/settings', icon: Settings, label: 'الإعدادات' },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/95 backdrop-blur border-t shadow-xl">
      <div className="grid grid-cols-5 h-16">
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}
              className={cn('flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-all',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
              <item.icon className={cn('h-5 w-5 transition-transform', active && 'scale-110')} />
              <span className={cn('text-[10px]', active && 'font-bold')}>{item.label}</span>
              {active && <div className="h-0.5 w-4 bg-primary rounded-full absolute bottom-0" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
