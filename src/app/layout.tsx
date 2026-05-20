import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/shared/Providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: { default: 'ذاكر - منصة تعليمية عربية', template: '%s | ذاكر' },
  description: 'منصة تعليمية عربية شاملة تغطي جميع المناهج الدراسية في الدول العربية بتجربة تعلم تفاعلية مخصصة',
  keywords: ['تعليم عربي', 'مناهج دراسية', 'دروس أونلاين', 'تمارين تفاعلية', 'ذاكر'],
  authors: [{ name: 'ذاكر للتعليم' }],
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    siteName: 'ذاكر',
    title: 'ذاكر - منصة تعليمية عربية',
    description: 'تعلّم بذكاء، انجح بثقة - منصة تعليمية عربية شاملة',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Google Fonts - Noto Sans Arabic for proper Arabic rendering */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
