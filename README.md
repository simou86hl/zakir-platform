# 🎓 منصة ذاكر التعليمية

> منصة تعليمية عربية شاملة تغطي جميع المناهج الدراسية في الدول العربية

## 🚀 الرفع على Vercel (خطوة بخطوة)

### الخطوة 1: إعداد قاعدة البيانات (Supabase)

1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ مشروعاً جديداً
2. اختر **New Project** → أدخل اسم المشروع وكلمة مرور قاعدة البيانات
3. انتظر حتى يكتمل إنشاء المشروع (دقيقتان)
4. اذهب إلى **Settings → Database** وانسخ **Connection string (URI)**
   - استبدل `[YOUR-PASSWORD]` بكلمة المرور التي اخترتها
5. اذهب إلى **Settings → API** وانسخ:
   - `Project URL`
   - `anon public key`
   - `service_role key`

### الخطوة 2: رفع الكود على GitHub

```bash
# 1. أنشئ repository جديد على github.com

# 2. في مجلد المشروع
git init
git add .
git commit -m "feat: Phase 1 - Foundation & Auth"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/zakir-platform.git
git push -u origin main
```

### الخطوة 3: Deploy على Vercel

1. اذهب إلى [vercel.com](https://vercel.com) وسجّل دخولك بحساب GitHub
2. اضغط **New Project** → اختر repository المشروع
3. **قبل الضغط على Deploy** أضف متغيرات البيئة:

| المتغير | القيمة |
|---------|--------|
| `DATABASE_URL` | Connection string من Supabase |
| `NEXTAUTH_SECRET` | نص عشوائي طويل (32+ حرف) |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL من Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key من Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` |

4. اضغط **Deploy** ✅

### الخطوة 4: إعداد قاعدة البيانات

بعد نجاح الـ Deploy، اذهب إلى Vercel Dashboard:
1. **Settings → Environment Variables** تأكد أنها صحيحة
2. افتح terminal محلي وشغّل:

```bash
# تثبيت المكتبات
npm install

# إنشاء الجداول في قاعدة البيانات
npx prisma db push

# (اختياري) إضافة بيانات أولية
npm run db:seed
```

### لتوليد NEXTAUTH_SECRET:

```bash
# على Mac/Linux
openssl rand -base64 32

# أو استخدم: https://generate-secret.vercel.app/32
```

## 🛠️ التشغيل المحلي

```bash
# 1. نسخ ملف البيئة
cp .env.example .env.local
# عدّل القيم في .env.local

# 2. تثبيت المكتبات
npm install

# 3. إنشاء Prisma Client
npx prisma generate

# 4. إنشاء الجداول
npx prisma db push

# 5. تشغيل المشروع
npm run dev
# افتح: http://localhost:3000
```

## 📁 هيكل المشروع

```
src/
├── app/              # Next.js App Router
│   ├── (auth)/       # صفحات المصادقة
│   ├── (dashboard)/  # لوحة التحكم
│   ├── (onboarding)/ # الإعداد الأولي
│   └── api/          # API Routes
├── components/       # مكونات React
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # Navbar, Sidebar, Header
│   └── shared/       # مكونات مشتركة
├── lib/              # Utilities, Auth, Prisma
├── actions/          # Server Actions
└── data/             # Seed data
prisma/
└── schema.prisma     # Database schema (40+ models)
```

## 🗄️ المراحل

- ✅ **المرحلة 1**: الأساس والمصادقة
- 🔄 **المرحلة 2**: إدارة المحتوى (قادمة)
- ⏳ **المرحلة 3**: محرك التعلم
- ⏳ **المرحلة 4**: نظام التقييم
- ⏳ **المرحلة 5**: لوحة التحكم والإحصائيات
- ⏳ **المرحلة 6**: الاشتراكات والدفع
- ⏳ **المرحلة 7**: لوحة الإدارة
- ⏳ **المرحلة 8**: التحسين والنشر

## 🔧 التقنيات

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| Next.js | 14.x | Framework |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 3.x | Styling |
| Prisma | 5.x | ORM |
| NextAuth.js | v5 beta | Authentication |
| PostgreSQL | 15+ | Database |
| Supabase | - | DB Host + Storage |

---

## ✅ المرحلة 2: إدارة المحتوى (مكتملة)

### ما تم إنجازه:

**🌱 بيانات البذر (Seed):**
- 22 دولة عربية مع الأعلام والرموز
- 12 صف دراسي (ابتدائي + متوسط + ثانوي)
- 10 مناهج لأكبر الدول العربية
- 3 خطط اشتراك (مجاني/عادي/برو)
- 20+ إنجاز متنوع
- محتوى رياضيات كامل (3 وحدات، 8 دروس، 20+ تمرين)

**🎛️ لوحة الإدارة:**
- داشبورد بإحصائيات حقيقية
- إدارة المستخدمين مع بحث وفلترة
- إدارة الدول والمناهج مع CRUD
- إدارة المواد والدروس
- محرر محتوى غني (نص/فيديو/معادلات/كود/صور)

**📚 صفحات الطالب:**
- صفحة المواد مع التقدم الحقيقي
- صفحة تفاصيل المادة بالوحدات والدروس
- صفحة الدرس بعرض كامل للمحتوى والتمارين
- صفحة التقدم مع الخريطة الحرارية
- صفحة الإنجازات الكاملة
- المحفوظات والإشعارات
- الإعدادات الشاملة

**🔗 API Routes:**
- `/api/countries` - جلب الدول
- `/api/curricula?country=XX` - جلب المناهج
- `/api/subjects` - مواد الطالب
- `/api/progress` - تقدم الطالب

### بعد تشغيل الـ Deploy:
```bash
# إضافة البيانات الأولية
npx tsx data/seed/index.ts
```
