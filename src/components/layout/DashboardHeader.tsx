'use client';
import { useState } from 'react';
import { Bell, Search, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function DashboardHeader({ user }: { user: any }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 bg-card/95 backdrop-blur border-b flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-30">
      {/* Mobile menu placeholder */}
      <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
        <Menu className="h-5 w-5" />
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
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications */}
        <Link href="/notifications" className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors relative">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
        </Link>

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
