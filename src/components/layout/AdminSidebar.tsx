'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Globe, BookOpen,
  FileText, CreditCard, BarChart3, Settings,
  ChevronRight, Database, GraduationCap, LogOut, X
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { logout } from '@/actions/auth.actions';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const navGroups = [
  {
    label: 'عام',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'الإحصائيات', exact: true },
      { href: '/admin/analytics', icon: BarChart3, label: 'التحليلات' },
    ],
  },
  {
    label: 'المستخدمون',
    items: [
      { href: '/admin/users', icon: Users, label: 'المستخدمون' },
      { href: '/admin/subscriptions', icon: CreditCard, label: 'الاشتراكات' },
    ],
  },
  {
    label: 'المحتوى',
    items: [
      { href: '/admin/countries', icon: Globe, label: 'الدول والمناهج' },
      { href: '/admin/subjects', icon: BookOpen, label: 'المواد والدروس' },
      { href: '/admin/content', icon: FileText, label: 'محرر المحتوى' },
    ],
  },
  {
    label: 'النظام',
    items: [
      { href: '/admin/settings', icon: Settings, label: 'الإعدادات' },
    ],
  },
];

export function AdminSidebar({ user, mobileOpen, onMobileClose }: { user: any; mobileOpen?: boolean; onMobileClose?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  const handleLogout = async () => {
    await logout();
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-black">ذ</div>
          <span className="font-black text-lg">ذاكر</span>
          <Badge className="bg-orange-500 text-white text-xs px-2 py-0 mr-1">Admin</Badge>
        </div>
        {/* Close button for mobile */}
        {mobileOpen && (
          <button onClick={onMobileClose} className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-white">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* User */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3 bg-slate-800 rounded-xl p-3">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center font-bold text-sm shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-slate-400">مشرف النظام</p>
          </div>
          <GraduationCap className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, (item as any).exact);
                return (
                  <Link key={item.href} href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      active
                        ? 'bg-primary text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight className="h-3 w-3 icon-rtl" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700 space-y-1">
        <Link href="/dashboard" onClick={onMobileClose} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Database className="h-4 w-4" />
          <span>العودة للمنصة</span>
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors">
          <LogOut className="h-4 w-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar - always visible on lg+ */}
      <aside className="hidden lg:flex w-72 flex-col bg-slate-900 text-white min-h-screen fixed right-0 top-0 z-40">
        {sidebarContent}
      </aside>
      <div className="hidden lg:block w-72 shrink-0" />

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="fixed right-0 top-0 bottom-0 w-72 bg-slate-900 text-white shadow-2xl flex flex-col animate-slide-in-right z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
