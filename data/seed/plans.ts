export const plans = [
  {
    nameAr: 'مجاني',     nameEn: 'Free',
    type: 'FREE' as const,
    priceMonthly: 0, priceYearly: 0,
    features: {
      ar: ['الوصول لمادة واحدة','5 دروس مجانية','اختبار تحديد المستوى','إحصائيات أساسية'],
      en: ['Access to 1 subject','5 free lessons','Diagnostic test','Basic statistics'],
    },
    maxSubjects: 1, hasAnalytics: false, hasDownloads: false, hasPriority: false, sortOrder: 1,
  },
  {
    nameAr: 'العادية',   nameEn: 'Basic',
    type: 'BASIC' as const,
    priceMonthly: 9.99, priceYearly: 99.99,
    features: {
      ar: ['الوصول لـ5 مواد','جميع الدروس','جميع التمارين','اختبار تحديد المستوى','إحصائيات متقدمة','ملخصات قابلة للتحميل'],
      en: ['Access to 5 subjects','All lessons','All exercises','Diagnostic test','Advanced analytics','Downloadable summaries'],
    },
    maxSubjects: 5, hasAnalytics: true, hasDownloads: true, hasPriority: false, sortOrder: 2,
  },
  {
    nameAr: 'برو',       nameEn: 'Pro',
    type: 'PRO' as const,
    priceMonthly: 19.99, priceYearly: 199.99,
    features: {
      ar: ['جميع المواد بلا حدود','جميع الدروس والتمارين','اختبارات غير محدودة','إحصائيات شاملة','تحميل كل المحتوى','دعم أولوية','بطاقات تعليمية تفاعلية','تقارير أداء تفصيلية'],
      en: ['All subjects unlimited','All lessons & exercises','Unlimited quizzes','Comprehensive analytics','Download all content','Priority support','Interactive flashcards','Detailed performance reports'],
    },
    maxSubjects: null, hasAnalytics: true, hasDownloads: true, hasPriority: true, sortOrder: 3,
  },
];
