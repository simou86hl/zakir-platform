import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { arabCountries } from './countries';
import { grades } from './grades';
import { plans } from './plans';
import { achievements } from './achievements';
import { mathContent } from './sample-content';
import { arabicContent } from './arabic-content';
import { scienceContent } from './science-content';
import { physicsContent } from './physics-content';
import { chemistryContent } from './chemistry-content';
import { socialContent } from './social-content';
import { computerContent } from './computer-content';
import { primaryMathContent } from './primary-content';

const prisma = new PrismaClient();

// ===== Helper: Create subject with units, lessons, exercises =====
async function createSubject(
  curriculumGradeId: string,
  data: any,
  sortOrder: number
) {
  const subject = await prisma.subject.upsert({
    where: { id: `subj-${curriculumGradeId}-${sortOrder}` },
    update: {},
    create: {
      id: `subj-${curriculumGradeId}-${sortOrder}`,
      curriculumGradeId,
      nameAr: data.subject.nameAr,
      nameEn: data.subject.nameEn,
      description: data.subject.description,
      icon: data.subject.icon,
      color: data.subject.color,
      sortOrder,
      totalLessons: data.units.reduce((a: number, u: any) => a + u.lessons.length, 0),
    },
  });

  let lessonCount = 0;
  for (let ui = 0; ui < data.units.length; ui++) {
    const unitData = data.units[ui];
    const unitId = `unit-${subject.id}-${ui}`;

    const unit = await prisma.unit.upsert({
      where: { id: unitId },
      update: {},
      create: {
        id: unitId,
        subjectId: subject.id,
        nameAr: unitData.nameAr,
        nameEn: unitData.nameEn,
        description: unitData.description,
        sortOrder: ui + 1,
      },
    });

    for (let li = 0; li < unitData.lessons.length; li++) {
      const lessonData = unitData.lessons[li];
      const lessonId = `lesson-${unitId}-${li}`;

      const lesson = await prisma.lesson.upsert({
        where: { id: lessonId },
        update: {},
        create: {
          id: lessonId,
          unitId: unit.id,
          nameAr: lessonData.nameAr,
          nameEn: lessonData.nameEn,
          description: lessonData.description,
          objectives: lessonData.objectives,
          estimatedTime: lessonData.estimatedTime,
          difficulty: lessonData.difficulty,
          isFree: lessonData.isFree,
          sortOrder: li + 1,
        },
      });
      lessonCount++;

      // Contents
      for (let ci = 0; ci < (lessonData.contents || []).length; ci++) {
        const c = lessonData.contents[ci];
        await prisma.lessonContent.upsert({
          where: { id: `content-${lessonId}-${ci}` },
          update: {},
          create: {
            id: `content-${lessonId}-${ci}`,
            lessonId: lesson.id,
            type: c.type,
            title: c.title,
            content: c.content,
            sortOrder: c.sortOrder || ci + 1,
          },
        });
      }

      // Summary
      if (lessonData.summary) {
        await prisma.lessonSummary.upsert({
          where: { lessonId: lesson.id },
          update: {},
          create: {
            lessonId: lesson.id,
            content: { text: `ملخص: ${lessonData.nameAr}` },
            keyPoints: lessonData.summary.keyPoints,
            formulas: lessonData.summary.formulas ?? null,
          },
        });
      }

      // Exercises
      for (let ei = 0; ei < (lessonData.exercises || []).length; ei++) {
        const ex = lessonData.exercises[ei];
        await prisma.exercise.upsert({
          where: { id: `ex-${lessonId}-${ei}` },
          update: {},
          create: {
            id: `ex-${lessonId}-${ei}`,
            lessonId: lesson.id,
            type: ex.type,
            difficulty: ex.difficulty,
            questionAr: ex.questionAr,
            options: ex.options ?? null,
            correctAnswer: ex.correctAnswer,
            explanation: ex.explanation,
            hint: ex.hint ?? null,
            points: ex.points,
            tags: ex.tags || [],
            sortOrder: ei + 1,
          },
        });
      }
    }
  }
  return { subject, lessonCount };
}

async function main() {
  console.log('\n🌱 بدء إضافة البيانات الأولية لمنصة ذاكر...\n');

  // ===== 1. Countries =====
  console.log('📍 الدول العربية...');
  const countryMap: Record<string, string> = {};
  for (const c of arabCountries) {
    const country = await prisma.country.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
    countryMap[c.code] = country.id;
  }
  console.log(`   ✓ ${arabCountries.length} دولة`);

  // ===== 2. Grades =====
  console.log('📚 الصفوف الدراسية...');
  const gradeMap: Record<number, string> = {};
  for (const g of grades) {
    const grade = await prisma.grade.upsert({
      where: { id: `grade-${g.level}` },
      update: {},
      create: { id: `grade-${g.level}`, ...g },
    });
    gradeMap[g.level] = grade.id;
  }
  console.log(`   ✓ ${grades.length} صف`);

  // ===== 3. Curricula =====
  console.log('📖 المناهج الدراسية...');
  const curriculaData = [
    { code: 'SA', nameAr: 'المنهج السعودي',   nameEn: 'Saudi Curriculum'   },
    { code: 'EG', nameAr: 'المنهج المصري',    nameEn: 'Egyptian Curriculum'  },
    { code: 'JO', nameAr: 'المنهج الأردني',   nameEn: 'Jordanian Curriculum' },
    { code: 'AE', nameAr: 'المنهج الإماراتي', nameEn: 'UAE Curriculum'       },
    { code: 'KW', nameAr: 'المنهج الكويتي',   nameEn: 'Kuwaiti Curriculum'   },
    { code: 'QA', nameAr: 'المنهج القطري',    nameEn: 'Qatari Curriculum'    },
    { code: 'DZ', nameAr: 'المنهج الجزائري',  nameEn: 'Algerian Curriculum'  },
    { code: 'MA', nameAr: 'المنهج المغربي',   nameEn: 'Moroccan Curriculum'  },
    { code: 'TN', nameAr: 'المنهج التونسي',   nameEn: 'Tunisian Curriculum'  },
    { code: 'IQ', nameAr: 'المنهج العراقي',   nameEn: 'Iraqi Curriculum'     },
  ];

  const curriculumMap: Record<string, string> = {};
  const cgMap: Record<string, string> = {};

  for (const c of curriculaData) {
    const curriculum = await prisma.curriculum.upsert({
      where: { id: `curr-${c.code}` },
      update: {},
      create: {
        id: `curr-${c.code}`,
        countryId: countryMap[c.code],
        nameAr: c.nameAr,
        nameEn: c.nameEn,
      },
    });
    curriculumMap[c.code] = curriculum.id;

    for (const g of grades) {
      const cgId = `cg-${c.code}-${g.level}`;
      await prisma.curriculumGrade.upsert({
        where: { id: cgId },
        update: {},
        create: { id: cgId, curriculumId: curriculum.id, gradeId: gradeMap[g.level] },
      });
      cgMap[`${c.code}-${g.level}`] = cgId;
    }
  }
  console.log(`   ✓ ${curriculaData.length} منهج × 12 صف`);

  // ===== 4. Plans =====
  console.log('💳 خطط الاشتراك...');
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: `plan-${plan.type}` },
      update: {},
      create: { id: `plan-${plan.type}`, ...plan },
    });
  }
  console.log(`   ✓ ${plans.length} خطط`);

  // ===== 5. Achievements =====
  console.log('🏆 الإنجازات...');
  for (let i = 0; i < achievements.length; i++) {
    await prisma.achievement.upsert({
      where: { id: `ach-${i}` },
      update: {},
      create: { id: `ach-${i}`, ...achievements[i] },
    });
  }
  console.log(`   ✓ ${achievements.length} إنجاز`);

  // ===== 6. Users =====
  console.log('👤 المستخدمون...');
  const adminHash = await bcrypt.hash('Admin1234!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@zakir.edu' },
    update: {},
    create: {
      email: 'admin@zakir.edu', passwordHash: adminHash,
      firstName: 'مدير', lastName: 'النظام',
      role: 'SUPER_ADMIN', emailVerified: new Date(), isActive: true,
    },
  });

  const studentHash = await bcrypt.hash('Student1234!', 12);
  const student = await prisma.user.upsert({
    where: { email: 'student@zakir.edu' },
    update: {},
    create: {
      email: 'student@zakir.edu', passwordHash: studentHash,
      firstName: 'أحمد', lastName: 'محمد',
      role: 'STUDENT', emailVerified: new Date(), isActive: true,
    },
  });

  await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      countryId: countryMap['SA'],
      educationLevel: 'SECONDARY',
      gradeId: gradeMap[10],
      curriculumId: curriculumMap['SA'],
      academicYear: '2024-2025',
      weeklyGoalHours: 10,
      totalPoints: 450,
      totalXP: 350,
      level: 3,
      studyStreak: 7,
    },
  });
  console.log('   ✓ أدمن + طالب تجريبي');

  // ===== 7. Educational Content =====
  console.log('\n📐 إضافة المحتوى التعليمي...\n');

  // تعريف خريطة المحتوى: [منهج-صف] → [مادة, ...]
  const contentMap = [
    // الصف الثالث ابتدائي
    { cg: 'SA-3',  subjects: [{ data: primaryMathContent, order: 1 }] },
    // الصف السابع متوسط
    { cg: 'SA-7',  subjects: [{ data: scienceContent,  order: 1 }] },
    // الصف الثامن متوسط
    { cg: 'SA-8',  subjects: [{ data: socialContent,   order: 1 }] },
    // الصف التاسع متوسط
    { cg: 'SA-9',  subjects: [{ data: computerContent, order: 1 }] },
    // الصف العاشر ثانوي (رياضيات + عربي)
    { cg: 'SA-10', subjects: [
      { data: mathContent,   order: 1 },
      { data: arabicContent, order: 2 },
    ]},
    // الصف الحادي عشر ثانوي (فيزياء + كيمياء)
    { cg: 'SA-11', subjects: [
      { data: physicsContent,   order: 1 },
      { data: chemistryContent, order: 2 },
    ]},
    // تكرار المحتوى للمناهج الأخرى (مصر، أردن)
    { cg: 'EG-10', subjects: [{ data: mathContent,   order: 1 }, { data: arabicContent, order: 2 }] },
    { cg: 'EG-11', subjects: [{ data: physicsContent, order: 1 }, { data: chemistryContent, order: 2 }] },
    { cg: 'JO-10', subjects: [{ data: mathContent,   order: 1 }] },
    { cg: 'AE-10', subjects: [{ data: mathContent,   order: 1 }, { data: scienceContent, order: 2 }] },
  ];

  let totalSubjects = 0;
  let totalLessons = 0;
  let totalExercises = 0;

  for (const entry of contentMap) {
    const cgId = cgMap[entry.cg];
    if (!cgId) {
      console.log(`   ⚠ CurriculumGrade ${entry.cg} غير موجود`);
      continue;
    }

    for (const subj of entry.subjects) {
      const { subject, lessonCount } = await createSubject(cgId, subj.data, subj.order);
      totalSubjects++;
      totalLessons += lessonCount;

      // عدّ التمارين
      const exCount = subj.data.units.reduce((a: number, u: any) =>
        a + u.lessons.reduce((b: number, l: any) => b + (l.exercises?.length || 0), 0), 0);
      totalExercises += exCount;

      console.log(`   ✓ ${entry.cg} | ${subject.nameAr} (${lessonCount} دروس، ${exCount} تمارين)`);
    }
  }

  // ===== 8. System Settings =====
  console.log('\n⚙️  إعدادات النظام...');
  const settings = [
    { key: 'app_name', value: { ar: 'ذاكر', en: 'Zakir' } },
    { key: 'app_version', value: { version: '1.0.0' } },
    { key: 'maintenance_mode', value: { enabled: false } },
    { key: 'registration_enabled', value: { enabled: true } },
    { key: 'xp_thresholds', value: { thresholds: [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500] } },
    { key: 'points_config', value: { exercise: 10, quiz: 20, lesson: 15, streak: 5, hint_penalty: -2 } },
    { key: 'supported_countries', value: { count: 22 } },
  ];
  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log(`   ✓ ${settings.length} إعدادات`);

  // ===== Final Summary =====
  console.log('\n' + '='.repeat(50));
  console.log('✅ اكتمل إعداد قاعدة البيانات بنجاح!');
  console.log('='.repeat(50));
  console.log(`📚 المواد:    ${totalSubjects}`);
  console.log(`📖 الدروس:    ${totalLessons}`);
  console.log(`✏️  التمارين: ${totalExercises}`);
  console.log(`🌍 الدول:    ${arabCountries.length}`);
  console.log(`🏆 الإنجازات: ${achievements.length}`);
  console.log('\n📧 بيانات الدخول:');
  console.log('   أدمن:  admin@zakir.edu    / Admin1234!');
  console.log('   طالب: student@zakir.edu  / Student1234!');
  console.log('='.repeat(50));
}

main()
  .catch(e => { console.error('\n❌ خطأ:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
