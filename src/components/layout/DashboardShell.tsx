'use client';
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { MobileNav } from '@/components/layout/MobileNav';

export function DashboardShell({ user, children }: { user: any; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/20 flex">
      <Sidebar user={user} mobileOpen={menuOpen} onMobileClose={() => setMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:mr-64">
        <DashboardHeader
          user={user}
          onMenuToggle={() => setMenuOpen(!menuOpen)}
          menuOpen={menuOpen}
        />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-auto">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
