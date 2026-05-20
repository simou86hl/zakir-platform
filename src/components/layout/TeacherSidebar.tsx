'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, FileText, ClipboardList, Users,
  LogOut, ChevronLeft, X, GraduationCap
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { logout } from '@/actions/auth.actions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/teacher', icon: LayoutDashboard, label: 'الرئيسية', exact: true },
  { href: '/teacher/subjects', icon: BookOpen, label: 'المواد الدراسية' },
  { href: '/teacher/content', icon: FileText, label: 'المحتوى' },
  { href: '/teacher/quizzes', icon: ClipboardList, label: 'الاختبارات' },
  { href: '/teacher/students', icon: Users, label: 'الطلاب' },
];

export function TeacherSidebar({ user, mobileOpen, onMobileClose }: { user: any; mobileOpen?: boolean; onMobileClose?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  const handleLogout = async () => {
    await logout();
  };

  const navContent = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b">
        <div className="flex items-center gap-2">
          <Logo />
          <Badge className="bg-green-500 text-white text-xs px-2 py-0">معلم</Badge>
        </div>
        {mobileOpen && (
          <button onClick={onMobileClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* User Card */}
      <div className="p-3 border-b">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</p>
            <div className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-700 dark:text-green-400 font-medium">معلم</span>
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
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                active
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-foreground/70 hover:bg-green-50 dark:hover:bg-green-950/20 hover:text-foreground'
              )}>
              <item.icon className={cn('h-5 w-5 shrink-0 transition-transform', active && 'scale-110')} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronLeft className="h-4 w-4 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom - Logout */}
      <div className="p-3 border-t space-y-1">
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
          <LogOut className="h-5 w-5" />
          تسجيل الخروج
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 flex-col bg-card border-l min-h-screen fixed right-0 top-0 z-40 shadow-sm">
        {navContent}
      </aside>
      <div className="hidden lg:block w-64 shrink-0" />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="fixed right-0 top-0 bottom-0 w-72 bg-card shadow-2xl flex flex-col animate-slide-in-right">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
