'use client';
import { useState } from 'react';
import { TeacherSidebar } from '@/components/layout/TeacherSidebar';
import { LogOut, Menu, X, Moon, Sun, Bell, GraduationCap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { logout } from '@/actions/auth.actions';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function TeacherShell({ user, children }: { user: any; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-muted/20 flex">
      <TeacherSidebar user={user} mobileOpen={menuOpen} onMobileClose={() => setMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:mr-64">
        <header className="h-14 bg-card/95 backdrop-blur border-b flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-30">
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-1">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
              <Sun className="h-4 w-4" />
            </button>
            <Link href="/teacher/students" className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors relative">
              <Bell className="h-4 w-4" />
            </Link>
            <button
              onClick={() => logout()}
              className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors lg:hidden"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 rounded-xl bg-green-50 dark:bg-green-950/20 px-2.5 py-1.5">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <span className="text-sm font-medium hidden sm:block max-w-[80px] truncate">{user?.firstName}</span>
              <Badge className="bg-green-500 text-white text-xs py-0 px-1.5">معلم</Badge>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
