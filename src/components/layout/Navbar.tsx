'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Bell, LogOut, User, Settings, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/#features', label: 'المميزات' },
  { href: '/#subjects', label: 'المواد' },
  { href: '/#pricing', label: 'الأسعار' },
  { href: '/#about', label: 'عن المنصة' },
];

function ThemeBtn() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b' : 'bg-transparent'
    )}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeBtn />
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild><Link href="/login">دخول</Link></Button>
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90" asChild>
                <Link href="/register">ابدأ مجاناً</Link>
              </Button>
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden border-t py-4 space-y-1 bg-background animate-fade-in">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium hover:bg-muted rounded-lg">
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t mt-2 px-2">
              <Button variant="outline" asChild><Link href="/login">تسجيل الدخول</Link></Button>
              <Button className="bg-primary text-white" asChild><Link href="/register">ابدأ مجاناً</Link></Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
