export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  BookOpen, Trophy, Brain, Star, CheckCircle2, ArrowLeft,
  Users, TrendingUp, Zap, Globe, Shield, BarChart3,
  Play, ChevronLeft, Award, Clock, Target
} from 'lucide-react';

const stats = [
  { value: '+50,000', label: 'طالب مسجل', icon: Users },
  { value: '22', label: 'دولة عربية', icon: Globe },
  { value: '+10,000', label: 'درس تعليمي', icon: BookOpen },
  { value: '98%', label: 'رضا الطلاب', icon: Star },
];

const features = [
  {
    icon: Brain,
    title: 'تعلم مخصص بالذكاء',
    description: 'اختبار تشخيصي يحدد مستواك الحقيقي ويضع خطة دراسية مخصصة لك',
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-950',
  },
  {
    icon: BookOpen,
    title: 'محتوى شامل ومتنوع',
    description: 'نصوص، فيديوهات، معادلات رياضية، تمارين تفاعلية لجميع المناهج العربية',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    icon: Trophy,
    title: 'نظام نقاط وإنجازات',
    description: 'اكسب نقاطاً وافتح إنجازات وارفع مستواك مع كل درس تكمله',
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-50 dark:bg-yellow-950',
  },
  {
    icon: BarChart3,
    title: 'تتبع التقدم بدقة',
    description: 'رسوم بيانية تفصيلية تُظهر تطورك في كل مادة ومقارنة أدائك عبر الزمن',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50 dark:bg-green-950',
  },
  {
    icon: Zap,
    title: 'تمارين تفاعلية فورية',
    description: 'تحقق من إجابتك فورياً، واحصل على تلميحات وشروح مفصلة',
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50 dark:bg-pink-950',
  },
  {
    icon: Shield,
    title: 'جميع المناهج العربية',
    description: 'يغطي مناهج 22 دولة عربية من الابتدائي حتى الثانوي بشكل كامل',
    color: 'from-cyan-500 to-teal-600',
    bg: 'bg-cyan-50 dark:bg-cyan-950',
  },
];

const subjects = [
  { icon: '📐', name: 'الرياضيات', lessons: 240, color: 'from-blue-500 to-blue-600' },
  { icon: '🧪', name: 'العلوم', lessons: 180, color: 'from-green-500 to-emerald-600' },
  { icon: '📚', name: 'اللغة العربية', lessons: 200, color: 'from-purple-500 to-purple-600' },
  { icon: '🌍', name: 'الاجتماعيات', lessons: 160, color: 'from-orange-500 to-orange-600' },
  { icon: '⚗️', name: 'الكيمياء', lessons: 140, color: 'from-pink-500 to-rose-600' },
  { icon: '🔭', name: 'الفيزياء', lessons: 150, color: 'from-indigo-500 to-indigo-600' },
  { icon: '🌿', name: 'الأحياء', lessons: 130, color: 'from-teal-500 to-teal-600' },
  { icon: '💻', name: 'الحاسب', lessons: 120, color: 'from-slate-500 to-slate-600' },
];

const plans = [
  {
    name: 'مجاني',
    nameEn: 'Free',
    price: 0,
    period: '',
    description: 'ابدأ رحلتك التعليمية',
    features: ['مادة واحدة', '5 دروس مجانية', 'اختبار تحديد المستوى', 'إحصائيات أساسية'],
    missing: ['جميع المواد', 'التمارين التفاعلية', 'تحميل الملخصات'],
    color: 'border-border',
    badge: null,
  },
  {
    name: 'العادية',
    nameEn: 'Basic',
    price: 9.99,
    period: '/شهر',
    description: 'للطلاب الجادين',
    features: ['5 مواد دراسية', 'جميع الدروس', 'التمارين التفاعلية', 'إحصائيات متقدمة', 'تحميل الملخصات'],
    missing: ['جميع المواد', 'دعم أولوية'],
    color: 'border-primary/40',
    badge: null,
  },
  {
    name: 'برو',
    nameEn: 'Pro',
    price: 19.99,
    period: '/شهر',
    description: 'تجربة تعلم كاملة',
    features: ['جميع المواد', 'جميع الدروس والتمارين', 'اختبارات غير محدودة', 'إحصائيات شاملة', 'تحميل كل المحتوى', 'دعم أولوية', 'بطاقات تعليمية تفاعلية', 'تقارير أداء تفصيلية'],
    missing: [],
    color: 'border-primary',
    badge: 'الأكثر شعبية',
  },
];

const testimonials = [
  {
    name: 'أحمد محمد',
    grade: 'طالب ثانوي - السعودية',
    avatar: '👨‍🎓',
    text: 'منصة ذاكر غيّرت طريقة دراستي كلياً. الاختبار التشخيصي ساعدني أفهم نقاط ضعفي وأركز عليها.',
    stars: 5,
  },
  {
    name: 'سارة العلي',
    grade: 'طالبة متوسط - مصر',
    avatar: '👩‍🎓',
    text: 'التمارين التفاعلية ممتعة جداً! والشرح واضح وبالعربي. نسبتي في الرياضيات ارتفعت 30%.',
    stars: 5,
  },
  {
    name: 'عمر الرشيد',
    grade: 'طالب ابتدائي - الأردن',
    avatar: '🧑‍🎓',
    text: 'ابني يحب ذاكر أكثر من أي تطبيق آخر. نظام النقاط يجعله يتنافس مع نفسه كل يوم.',
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-background to-purple-50 dark:from-primary-950/30 dark:via-background dark:to-purple-950/20" />
          <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-primary-200/40 dark:bg-primary-800/20 blur-3xl" />
          <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-purple-200/30 dark:bg-purple-800/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-100/20 dark:bg-blue-900/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-right space-y-8 animate-fade-in">
              <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-primary/30 bg-primary/5 text-primary">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-sm font-medium">المنصة التعليمية العربية الأولى</span>
              </Badge>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                  تعلّم بذكاء،{' '}
                  <span className="bg-gradient-to-l from-primary-500 to-purple-600 bg-clip-text text-transparent">
                    انجح بثقة
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                  منصة <strong className="text-foreground">ذاكر</strong> تغطي جميع المناهج العربية بمحتوى تفاعلي متميز،
                  مع خطة دراسية مخصصة لكل طالب بناءً على مستواه الحقيقي.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button size="xl" variant="gradient" asChild className="group">
                  <Link href="/register">
                    ابدأ مجاناً الآن
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform icon-rtl" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link href="#features" className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    شاهد كيف تعمل
                  </Link>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-muted-foreground">
                {['لا يلزم بطاقة ائتمان', '5 دروس مجانية', 'إلغاء في أي وقت'].map((item) => (
                  <div key={item} className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative hidden lg:flex items-center justify-center animate-slide-in-right">
              <div className="relative w-full max-w-lg">
                {/* Main card */}
                <div className="rounded-2xl bg-card border shadow-2xl p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">ذ</div>
                    <div>
                      <p className="font-bold text-sm">درس: المعادلات التربيعية</p>
                      <p className="text-xs text-muted-foreground">رياضيات • الصف العاشر</p>
                    </div>
                    <Badge variant="success" className="mr-auto">🔥 7 أيام متتالية</Badge>
                  </div>
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>التقدم في المادة</span>
                      <span>75%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full" />
                    </div>
                  </div>
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: '📚', val: '24', label: 'درس' },
                      { icon: '✅', val: '156', label: 'تمرين' },
                      { icon: '🏆', val: '2,450', label: 'نقطة' },
                    ].map((s) => (
                      <div key={s.label} className="bg-muted/50 rounded-xl p-3 text-center">
                        <div className="text-xl">{s.icon}</div>
                        <div className="font-bold text-sm">{s.val}</div>
                        <div className="text-xs text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Question card */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-semibold">💡 سؤال سريع:</p>
                    <p className="text-sm">ما هو حل المعادلة: x² - 5x + 6 = 0 ؟</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['x = 2, 3 ✅', 'x = 1, 6', 'x = -2, -3', 'x = 4, 1'].map((opt, i) => (
                        <div key={i} className={`text-xs p-2 rounded-lg border text-center cursor-pointer transition-colors
                          ${i === 0 ? 'bg-green-50 border-green-300 text-green-700 font-semibold' : 'bg-background border-border hover:border-primary/40'}`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-card rounded-2xl shadow-lg border p-3 flex items-center gap-2 animate-bounce-subtle">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="text-xs font-bold">+20 نقطة!</p>
                    <p className="text-xs text-muted-foreground">إجابة صحيحة</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-card rounded-2xl shadow-lg border p-3 flex items-center gap-2">
                  <span className="text-2xl">🏅</span>
                  <div>
                    <p className="text-xs font-bold">إنجاز جديد!</p>
                    <p className="text-xs text-muted-foreground">10 دروس مكتملة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon className="h-8 w-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-black mb-1">{value}</div>
                <div className="text-sm opacity-80">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20">لماذا ذاكر؟</Badge>
            <h2 className="text-3xl sm:text-4xl font-black">كل ما تحتاجه في مكان واحد</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              منصة تعليمية متكاملة مصممة خصيصاً للطلاب العرب
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="card-hover border-0 shadow-md overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-md`}>
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUBJECTS ===== */}
      <section id="subjects" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-green-100 text-green-700 border-green-200">المواد الدراسية</Badge>
            <h2 className="text-3xl sm:text-4xl font-black">جميع المواد في متناول يدك</h2>
            <p className="text-muted-foreground text-lg">محتوى شامل لجميع المراحل الدراسية</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.map((s) => (
              <div key={s.name} className="group bg-card rounded-2xl border p-5 text-center card-hover cursor-pointer">
                <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl shadow-md`}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-sm mb-1">{s.name}</h3>
                <p className="text-xs text-muted-foreground">+{s.lessons} درس</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">استكشف جميع المواد</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">كيف تعمل؟</Badge>
            <h2 className="text-3xl sm:text-4xl font-black">3 خطوات للنجاح</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01', icon: Target, title: 'حدد مستواك',
                desc: 'أجرِ اختباراً تشخيصياً قصيراً يحدد مستواك الحقيقي في كل مادة',
                color: 'from-blue-500 to-blue-600',
              },
              {
                step: '02', icon: BookOpen, title: 'تعلّم بالطريقة الصحيحة',
                desc: 'دروس مخصصة لمستواك، تمارين تفاعلية، وملخصات ذكية',
                color: 'from-purple-500 to-purple-600',
              },
              {
                step: '03', icon: Award, title: 'تطور وانجح',
                desc: 'تتبع تقدمك، اكسب الإنجازات، وحقق أهدافك الدراسية',
                color: 'from-green-500 to-emerald-600',
              },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center space-y-4">
                {i < 2 && (
                  <div className="absolute top-8 left-0 w-full h-0.5 bg-gradient-to-l from-primary/30 to-transparent hidden md:block" />
                )}
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <div className="font-black text-4xl text-muted-foreground/20">{item.step}</div>
                <h3 className="text-xl font-bold -mt-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">الأسعار</Badge>
            <h2 className="text-3xl sm:text-4xl font-black">خطط مناسبة لكل طالب</h2>
            <p className="text-muted-foreground text-lg">ابدأ مجاناً، وطوّر باقتك عندما تريد</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-card rounded-2xl border-2 ${plan.color} p-6 space-y-5 ${plan.badge ? 'shadow-xl scale-105' : 'shadow-md'}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">{plan.badge}</Badge>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-black">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price === 0 ? 'مجاني' : `$${plan.price}`}</span>
                  {plan.price > 0 && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground/60">
                      <div className="h-4 w-4 rounded-full border-2 border-muted shrink-0" />
                      <span className="line-through">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.badge ? 'gradient' : 'outline'} asChild>
                  <Link href="/register">
                    {plan.price === 0 ? 'ابدأ مجاناً' : 'اشترك الآن'}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">آراء الطلاب</Badge>
            <h2 className="text-3xl sm:text-4xl font-black">ماذا يقول طلابنا؟</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="card-hover">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.grade}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black">ابدأ رحلتك التعليمية اليوم</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              انضم لأكثر من 50,000 طالب يتعلمون على منصة ذاكر. ابدأ مجاناً ولا تحتاج لبطاقة ائتمان.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" className="bg-white text-primary hover:bg-white/90 font-bold shadow-xl" asChild>
              <Link href="/register">ابدأ مجاناً الآن 🚀</Link>
            </Button>
            <Button size="xl" variant="outline" className="border-white/50 text-white hover:bg-white/10" asChild>
              <Link href="/login">لديك حساب؟ سجل دخولك</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm opacity-80">
            {['بدون بطاقة ائتمان', 'إلغاء في أي وقت', 'دعم مجاني 24/7'].map((item) => (
              <div key={item} className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center font-black">ذ</div>
                <span className="font-black text-xl">ذاكر</span>
              </div>
              <p className="text-sm opacity-70 leading-relaxed">
                منصة تعليمية عربية شاملة تغطي جميع المناهج الدراسية
              </p>
            </div>
            {[
              { title: 'المنصة', links: ['المميزات', 'المواد', 'الأسعار', 'عن ذاكر'] },
              { title: 'الدعم', links: ['مركز المساعدة', 'اتصل بنا', 'سياسة الخصوصية', 'الشروط والأحكام'] },
              { title: 'الدول', links: ['السعودية', 'مصر', 'الأردن', 'الإمارات'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-sm opacity-60">
            <p>© 2024 ذاكر. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
