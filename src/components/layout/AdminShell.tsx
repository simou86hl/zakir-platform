'use client';
import { useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { LogOut, Menu, X } from 'lucide-react';
import { logout } from '@/actions/auth.actions';
import { Badge } from '@/components/ui/badge';

export function AdminShell({ user, children }: { user: any; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const role = user?.role;
  const roleLabel = role === 'TEACHER' ? 'معلم' : role === 'SUPER_ADMIN' ? 'مدير أعلى' : 'مدير';
  const roleBadge = role === 'TEACHER' ? 'bg-green-500' : 'bg-orange-500';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Desktop sidebar */}
      <AdminSidebar user={user} />

      {/* Mobile sidebar overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-72 z-50">
            <AdminSidebar user={user} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 lg:mr-72">
        <header className="h-14 bg-white dark:bg-slate-900 border-b flex items-center px-4 gap-4 sticky top-0 z-30">
          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex-1">
            <h2 className="text-sm font-semibold text-muted-foreground">لوحة إدارة منصة ذاكر</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${roleBadge} text-white text-xs`}>{roleLabel}</Badge>
            <button
              onClick={() => logout()}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors lg:hidden"
              title="تسجيل الخروج"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">{children}</main>
      </div>
    </div>
  );
}
