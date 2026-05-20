export const dynamic = 'force-dynamic';

import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-gradient-to-br from-primary-700 via-primary-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-20 left-20 h-60 w-60 rounded-full bg-purple-400/20 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-black text-lg">ذ</div>
            <span className="text-2xl font-black">ذاكر</span>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-black leading-tight">
                ابدأ رحلتك<br />نحو التميز<br /><span className="text-yellow-300">الدراسي</span>
              </h1>
              <p className="text-lg opacity-90 leading-relaxed max-w-sm">
                أكثر من 50,000 طالب عربي يثقون بمنصة ذاكر
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {['📚 10,000+ درس', '🏆 نظام إنجازات', '📊 إحصائيات دقيقة', '🌍 22 دولة عربية'].map((f) => (
                <div key={f} className="bg-white/15 backdrop-blur rounded-full px-4 py-2 text-sm font-medium">{f}</div>
              ))}
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 space-y-3">
              <div className="flex gap-1">{[1,2,3,4,5].map(i => <span key={i} className="text-yellow-300">★</span>)}</div>
              <p className="text-sm opacity-90">&ldquo;منصة ذاكر غيّرت طريقة دراستي كلياً. نسبتي في الرياضيات ارتفعت من 60% إلى 95%!&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">👨‍🎓</div>
                <div>
                  <p className="text-sm font-bold">أحمد محمد</p>
                  <p className="text-xs opacity-70">طالب ثانوي • السعودية</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[{value:'50K+',label:'طالب'},{value:'98%',label:'رضا'},{value:'22',label:'دولة'}].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black">{s.value}</div>
                <div className="text-xs opacity-70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 lg:p-6 border-b lg:border-0">
          <div className="lg:hidden"><Logo /></div>
          <div className="mr-auto"><ThemeToggle /></div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
