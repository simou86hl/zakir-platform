import { AchievementType } from '@prisma/client';

export const achievements = [
  // ===== متتاليات =====
  { nameAr: 'المبادر', nameEn: 'Starter', description: 'أكمل أول يوم دراسي', icon: '🌟', type: 'STREAK' as AchievementType, condition: { streak: 1 }, xpReward: 50 },
  { nameAr: 'ملتزم', nameEn: 'Committed', description: 'أكمل 7 أيام متتالية', icon: '🔥', type: 'STREAK' as AchievementType, condition: { streak: 7 }, xpReward: 150 },
  { nameAr: 'مثابر', nameEn: 'Perseverant', description: 'أكمل 30 يوماً متتالياً', icon: '💎', type: 'STREAK' as AchievementType, condition: { streak: 30 }, xpReward: 500 },
  { nameAr: 'أسطورة', nameEn: 'Legend', description: 'أكمل 100 يوم متتالي', icon: '👑', type: 'STREAK' as AchievementType, condition: { streak: 100 }, xpReward: 2000 },

  // ===== عدد الدروس =====
  { nameAr: 'أول خطوة', nameEn: 'First Step', description: 'أكمل درسك الأول', icon: '📖', type: 'LESSONS_COUNT' as AchievementType, condition: { lessons: 1 }, xpReward: 30 },
  { nameAr: 'متعلم', nameEn: 'Learner', description: 'أكمل 10 دروس', icon: '📚', type: 'LESSONS_COUNT' as AchievementType, condition: { lessons: 10 }, xpReward: 100 },
  { nameAr: 'متفوق', nameEn: 'Advanced', description: 'أكمل 50 درساً', icon: '🎓', type: 'LESSONS_COUNT' as AchievementType, condition: { lessons: 50 }, xpReward: 300 },
  { nameAr: 'خبير', nameEn: 'Expert', description: 'أكمل 100 درس', icon: '🏛️', type: 'LESSONS_COUNT' as AchievementType, condition: { lessons: 100 }, xpReward: 600 },
  { nameAr: 'عالم', nameEn: 'Scholar', description: 'أكمل 500 درس', icon: '🔬', type: 'LESSONS_COUNT' as AchievementType, condition: { lessons: 500 }, xpReward: 2000 },

  // ===== درجات الاختبار =====
  { nameAr: 'ممتاز', nameEn: 'Excellent', description: 'احصل على 100% في اختبار', icon: '💯', type: 'QUIZ_SCORE' as AchievementType, condition: { score: 100 }, xpReward: 200 },
  { nameAr: 'متميز', nameEn: 'Distinguished', description: 'احصل على 90%+ في 5 اختبارات', icon: '⭐', type: 'QUIZ_SCORE' as AchievementType, condition: { score: 90, count: 5 }, xpReward: 250 },

  // ===== التمارين =====
  { nameAr: 'مُتمرن', nameEn: 'Practitioner', description: 'أجرِ 50 تمريناً', icon: '✏️', type: 'EXERCISES_COUNT' as AchievementType, condition: { exercises: 50 }, xpReward: 100 },
  { nameAr: 'محترف', nameEn: 'Professional', description: 'أجرِ 200 تمرين', icon: '💪', type: 'EXERCISES_COUNT' as AchievementType, condition: { exercises: 200 }, xpReward: 300 },
  { nameAr: 'بطل التمارين', nameEn: 'Exercise Champion', description: 'أجرِ 1000 تمرين', icon: '🏋️', type: 'EXERCISES_COUNT' as AchievementType, condition: { exercises: 1000 }, xpReward: 1000 },

  // ===== وقت الدراسة =====
  { nameAr: 'مجتهد', nameEn: 'Diligent', description: 'أمضِ 10 ساعات في الدراسة', icon: '⏰', type: 'TIME_SPENT' as AchievementType, condition: { hours: 10 }, xpReward: 150 },
  { nameAr: 'مثابر', nameEn: 'Dedicated', description: 'أمضِ 50 ساعة في الدراسة', icon: '🕐', type: 'TIME_SPENT' as AchievementType, condition: { hours: 50 }, xpReward: 500 },
  { nameAr: 'نجم', nameEn: 'Star', description: 'أمضِ 200 ساعة في الدراسة', icon: '⏳', type: 'TIME_SPENT' as AchievementType, condition: { hours: 200 }, xpReward: 1500 },

  // ===== ترقي المستوى =====
  { nameAr: 'مستوى جديد', nameEn: 'Level Up', description: 'ارفع مستواك لأول مرة', icon: '⬆️', type: 'LEVEL_UP' as AchievementType, condition: { level: 2 }, xpReward: 100 },
  { nameAr: 'مستوى 5', nameEn: 'Level 5', description: 'بلغ المستوى الخامس', icon: '🎯', type: 'LEVEL_UP' as AchievementType, condition: { level: 5 }, xpReward: 250 },
  { nameAr: 'مستوى 10', nameEn: 'Level 10', description: 'بلغ المستوى العاشر', icon: '🚀', type: 'LEVEL_UP' as AchievementType, condition: { level: 10 }, xpReward: 500 },

  // ===== إتقان المادة =====
  { nameAr: 'متقن الرياضيات', nameEn: 'Math Master', description: 'أكمل 80% من مادة الرياضيات', icon: '📐', type: 'SUBJECT_MASTERY' as AchievementType, condition: { subject: 'math', percent: 80 }, xpReward: 400 },
  { nameAr: 'متقن العربية', nameEn: 'Arabic Master', description: 'أكمل 80% من اللغة العربية', icon: '✍️', type: 'SUBJECT_MASTERY' as AchievementType, condition: { subject: 'arabic', percent: 80 }, xpReward: 400 },
];
