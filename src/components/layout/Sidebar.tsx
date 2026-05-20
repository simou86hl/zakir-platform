'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, TrendingUp, Trophy,
  Bookmark, Settings, Bell, LogOut, Star, ChevronLeft
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { logout } from '@/actions/auth.actions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'الرئيسية', exact: true },
  { href: '/subjects', icon: BookOpen, label: 'المواد الدراسية' },
  { href: '/progress', icon: TrendingUp, label: 'تقدمي' },
  { href: '/achievements', icon: Trophy, label: 'الإنجازات' },
  { href: '/bookmarks', icon: Bookmark, label: 'المحفوظات' },
  { href: '/notifications', icon: Bell, label: 'الإشعارات' },
  { href: '/settings', icon: Settings, label: 'الإعدادات' },
];

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <aside className="hidden lg:flex w-64 flex-col bg-card border-l min-h-screen fixed right-0 top-0 z-40 shadow-sm">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b">
          <Logo />
        </div>

        {/* User Card */}
        <div className="p-3 border-b">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-colors cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">المستوى 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                )}>
                <item.icon className={cn('h-5 w-5 shrink-0 transition-transform', active && 'scale-110')} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronLeft className="h-4 w-4 opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t space-y-1">
          <button onClick={() => logout()}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>
      <div className="hidden lg:block w-64 shrink-0" />
    </>
  );
}
