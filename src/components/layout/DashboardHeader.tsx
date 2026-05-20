'use client';
import { useState, useEffect } from 'react';
import { Bell, Search, Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { logout } from '@/actions/auth.actions';

export function DashboardHeader({ user, onMenuToggle, menuOpen }: { user: any; onMenuToggle?: () => void; menuOpen?: boolean }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  return (
    <header className="h-14 bg-card/95 backdrop-blur border-b flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-30">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors active:scale-95"
        aria-label="فتح القائمة"
      >
        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Search */}
      <div className={cn('flex-1 max-w-sm transition-all', searchOpen && 'max-w-full')}>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
            placeholder="ابحث عن درس أو موضوع..."
            className="w-full h-9 bg-muted/60 rounded-lg pr-9 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-background transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 mr-auto">
        {/* Theme toggle */}
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
          {mounted ? (theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />) : <div className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications */}
        <Link href="/notifications" className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors relative">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
        </Link>

        {/* Logout button (mobile visible, desktop also visible) */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors lg:hidden"
          title="تسجيل الخروج"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>

        {/* User avatar */}
        <Link href="/settings" className="flex items-center gap-2 rounded-xl bg-muted/60 px-2.5 py-1.5 hover:bg-muted transition-colors">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">{user?.firstName}</span>
        </Link>
      </div>
    </header>
  );
}
