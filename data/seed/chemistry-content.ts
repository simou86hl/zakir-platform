// محتوى الكيمياء - الصف الحادي عشر
export const chemistryContent = {
  subject: { nameAr: 'الكيمياء', nameEn: 'Chemistry', description: 'الكيمياء للمرحلة الثانوية', icon: '⚗️', color: '#db2777' },
  units: [
    {
      nameAr: 'الوحدة الأولى: البنية الذرية والجدول الدوري',
      nameEn: 'Unit 1: Atomic Structure and Periodic Table',
      description: 'تركيب الذرة والجدول الدوري للعناصر',
      lessons: [
        {
          nameAr: 'تركيب الذرة',
          nameEn: 'Atomic Structure',
          description: 'مكونات الذرة وأعدادها الذرية والكتلية',
          objectives: ['مكونات الذرة الثلاثة', 'العدد الذري والعدد الكتلي', 'توزيع الإلكترونات على المستويات', 'النظائر وخصائصها'],
          estimatedTime: 55, difficulty: 'MEDIUM' as const, isFree: true,
          contents: [
            { type: 'TEXT' as const, title: 'تركيب الذرة',
              content: { html: `<h2>مكونات الذرة</h2><table border="1" style="border-collapse:collapse;width:100%"><tr><th>الجسيم</th><th>الشحنة</th><th>الكتلة النسبية</th><th>الموقع</th></tr><tr><td>البروتون (p⁺)</td><td>موجبة (+1)</td><td>1</td><td>النواة</td></tr><tr><td>النيوترون (n⁰)</td><td>متعادلة (0)</td><td>1</td><td>النواة</td></tr><tr><td>الإلكترون (e⁻)</td><td>سالبة (-1)</td><td>1/1836</td><td>حول النواة</td></tr></table><h2>الأعداد الأساسية</h2><p><strong>العدد الذري (Z):</strong> عدد البروتونات في النواة. يُحدّد هوية العنصر.</p><p><strong>العدد الكتلي (A):</strong> مجموع البروتونات والنيوترونات (A = Z + N)</p><h2>توزيع الإلكترونات</h2><p>تتوزع الإلكترونات على مستويات طاقة: K(2), L(8), M(18), N(32)</p><h3>مثال: الصوديوم ¹¹Na</h3><ul><li>Z = 11 → 11 بروتون، 11 إلكترون</li><li>A = 23 → N = 23-11 = 12 نيوترون</li><li>التوزيع: 2, 8, 1</li></ul>` },
              sortOrder: 1 },
            { type: 'EQUATION' as const, title: 'معادلة العدد الكتلي',
              content: { latex: 'A = Z + N \\quad \\text{حيث} \\quad N = A - Z', description: 'العدد الكتلي = عدد البروتونات + عدد النيوترونات' },
              sortOrder: 2 },
          ],
          summary: {
            keyPoints: ['الذرة = بروتونات + نيوترونات (نواة) + إلكترونات (حول النواة)', 'العدد الذري Z = عدد البروتونات = عدد الإلكترونات (الذرة المتعادلة)', 'العدد الكتلي A = Z + N', 'توزيع الإلكترونات: K(2) L(8) M(18) N(32)'],
            formulas: [{ name: 'العدد الكتلي', formula: 'A = Z + N' }, { name: 'عدد النيوترونات', formula: 'N = A - Z' }],
          },
          exercises: [
            { type: 'FILL_BLANK' as const, difficulty: 'EASY' as const, questionAr: 'ذرة الكربون عددها الذري 6 وعددها الكتلي 12. عدد النيوتروناتها = ___', correctAnswer:{answers:['6','٦']}, explanation:'N = A - Z = 12 - 6 = 6 نيوترونات', points:10, tags:['كيمياء','ذرة'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'ما الجسيم الذي يُحدّد هوية العنصر الكيميائي؟', options: [{id:'a',text:'النيوترون'},{id:'b',text:'الإلكترون'},{id:'c',text:'البروتون'},{id:'d',text:'الفوتون'}], correctAnswer:{id:'c'}, explanation:'عدد البروتونات (العدد الذري) هو ما يُحدّد هوية العنصر ويميّزه عن غيره.', hint:'ما الذي يبقى ثابتاً في كل ذرات نفس العنصر؟', points:10, tags:['كيمياء','عدد ذري'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'MEDIUM' as const, questionAr: 'ذرة الكلور ¹⁷Cl³⁵. ما التوزيع الإلكتروني الصحيح؟', options: [{id:'a',text:'2, 8, 7'},{id:'b',text:'2, 8, 8'},{id:'c',text:'2, 7, 8'},{id:'d',text:'8, 8, 1'}], correctAnswer:{id:'a'}, explanation:'Z=17 إلكترون. K=2, L=8, M=7 → 2+8+7=17 ✓', hint:'وزّع الإلكترونات على المستويات: K(2) ثم L(8) ثم الباقي في M.', points:15, tags:['كيمياء','توزيع إلكتروني'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'HARD' as const, questionAr: 'أيّ الأزواج التالية يمثّل نظيرَين للعنصر نفسه؟', options: [{id:'a',text:'¹²C و ¹⁴N'},{id:'b',text:'¹H و ²H'},{id:'c',text:'¹⁶O و ³²S'},{id:'d',text:'²³Na و ²⁴Mg'}], correctAnswer:{id:'b'}, explanation:'¹H و ²H كلاهما هيدروجين (Z=1) لكن لهما عددان كتليان مختلفان → نظيران.', hint:'النظائر: عناصر نفس Z لكن A مختلف.', points:15, tags:['كيمياء','نظائر'] },
          ],
        },
        {
          nameAr: 'الجدول الدوري وخصائص العناصر',
          nameEn: 'Periodic Table',
          description: 'فهم الجدول الدوري واتجاهات الخصائص',
          objectives: ['تنظيم الجدول الدوري', 'المجموعات والدورات', 'الاتجاهات الدورية', 'خصائص الفلزات واللافلزات'],
          estimatedTime: 60, difficulty: 'MEDIUM' as const, isFree: false,
          contents: [
            { type: 'TEXT' as const, title: 'الجدول الدوري',
              content: { html: `<h2>الجدول الدوري</h2><p>رتّب مندليف العناصر حسب أعدادها الذرية وتشابه خصائصها الكيميائية.</p><h2>تنظيم الجدول</h2><h3>الأفقي (الدورات - Periods):</h3><p>7 دورات أفقية. كل دورة تبدأ بفلز قلوي وتنتهي بغاز نبيل.</p><h3>العمودي (المجموعات - Groups):</h3><p>18 مجموعة. العناصر في نفس المجموعة لها خصائص كيميائية متشابهة.</p><h2>أهم المجموعات</h2><ul><li><strong>المجموعة 1 (الفلزات القلوية):</strong> Li, Na, K, Rb, Cs - نشطة جداً، تتفاعل مع الماء</li><li><strong>المجموعة 17 (الهالوجينات):</strong> F, Cl, Br, I - لافلزات نشطة</li><li><strong>المجموعة 18 (الغازات النبيلة):</strong> He, Ne, Ar - خاملة كيميائياً</li></ul>` },
              sortOrder: 1 },
          ],
          summary: {
            keyPoints: ['الجدول الدوري: 7 دورات أفقية، 18 مجموعة عمودية', 'العناصر في نفس المجموعة: خصائص كيميائية متشابهة', 'نشاط الفلزات يزداد لأسفل في المجموعة', 'نشاط اللافلزات يزداد لأعلى في المجموعة'],
            formulas: null,
          },
          exercises: [
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'كم عدد المجموعات في الجدول الدوري الحديث؟', options: [{id:'a',text:'7'},{id:'b',text:'8'},{id:'c',text:'18'},{id:'d',text:'36'}], correctAnswer:{id:'c'}, explanation:'الجدول الدوري الحديث يحتوي على 18 مجموعة عمودية و7 دورات أفقية.', points:10, tags:['كيمياء','جدول دوري'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'MEDIUM' as const, questionAr: 'الصوديوم (Na) ينتمي إلى المجموعة الأولى. ما أبرز خصائصه؟', options: [{id:'a',text:'غاز خامل لا يتفاعل'},{id:'b',text:'فلز نشط يتفاعل بشدة مع الماء'},{id:'c',text:'لافلز يتفاعل مع الفلزات'},{id:'d',text:'شبه فلز ذو خصائص وسيطة'}], correctAnswer:{id:'b'}, explanation:'الصوديوم فلز قلوي (مجموعة 1) نشط جداً ويتفاعل بعنف مع الماء منتجاً هيدروكسيد الصوديوم وغاز الهيدروجين.', points:15, tags:['كيمياء','فلزات قلوية'] },
            { type: 'TRUE_FALSE' as const, difficulty: 'EASY' as const, questionAr: 'العناصر في نفس المجموعة الدورية لها خصائص كيميائية متشابهة.', correctAnswer:{value:true}, explanation:'نعم، لأنها تملك نفس عدد إلكترونات التكافؤ في المستوى الخارجي.', points:10, tags:['كيمياء','جدول دوري'] },
          ],
        },
      ],
    },
    {
      nameAr: 'الوحدة الثانية: التفاعلات الكيميائية',
      nameEn: 'Unit 2: Chemical Reactions',
      description: 'أنواع التفاعلات الكيميائية وكيفية موازنتها',
      lessons: [
        {
          nameAr: 'موازنة المعادلات الكيميائية',
          nameEn: 'Balancing Chemical Equations',
          description: 'تعلم موازنة المعادلات الكيميائية بقانون حفظ المادة',
          objectives: ['قانون حفظ المادة', 'خطوات موازنة المعادلات', 'أنواع التفاعلات الكيميائية', 'تفسير المعادلات الكيميائية'],
          estimatedTime: 65, difficulty: 'HARD' as const, isFree: false,
          contents: [
            { type: 'TEXT' as const, title: 'موازنة المعادلات',
              content: { html: `<h2>قانون حفظ المادة</h2><p>المادة لا تُخلق ولا تُفنى، وعدد ذرات كل عنصر يجب أن يكون متساوياً في طرفَي المعادلة.</p><h2>خطوات الموازنة</h2><ol><li>اكتب المعادلة غير الموزونة</li><li>عدّ ذرات كل عنصر في الطرفين</li><li>ابدأ بأكثر العناصر تعقيداً</li><li>عدّل المعاملات (لا تغيّر الصيغ)</li><li>تحقق من التوازن النهائي</li></ol><h3>مثال: احتراق الميثان</h3><p>غير موزونة: CH₄ + O₂ → CO₂ + H₂O</p><p>موزونة: <strong>CH₄ + 2O₂ → CO₂ + 2H₂O</strong></p>` },
              sortOrder: 1 },
          ],
          summary: {
            keyPoints: ['قانون حفظ المادة: الذرات لا تُفقد ولا تُكتسب في التفاعل', 'نوازن المعادلة بتغيير المعاملات فقط لا الصيغ', 'أنواع التفاعلات: تركيب، تحليل، إحلال بسيط، إحلال مزدوج، احتراق'],
            formulas: [{ name: 'قانون حفظ الكتلة', formula: 'كتلة المواد المتفاعلة = كتلة نواتج التفاعل' }],
          },
          exercises: [
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'MEDIUM' as const, questionAr: 'ما المعامل الصحيح لـ O₂ لموازنة: H₂ + O₂ → H₂O ؟', options: [{id:'a',text:'1'},{id:'b',text:'2'},{id:'c',text:'3'},{id:'d',text:'½'}], correctAnswer:{id:'d'}, explanation:'2H₂ + O₂ → 2H₂O أو يُكتب بمعاملات صحيحة: 2H₂+O₂→2H₂O (معامل O₂ = 1)', hint:'عدّ ذرات الهيدروجين والأكسجين في الطرفين.', points:15, tags:['كيمياء','موازنة'] },
            { type: 'TRUE_FALSE' as const, difficulty: 'MEDIUM' as const, questionAr: 'يمكن موازنة المعادلة الكيميائية بتغيير الصيغة الكيميائية للمواد.', correctAnswer:{value:false}, explanation:'لا يجوز تغيير الصيغ الكيميائية. نوازن المعادلة فقط بتغيير المعاملات (الأرقام أمام الصيغ).', points:10, tags:['كيمياء','موازنة'] },
          ],
        },
      ],
    },
  ],
};
