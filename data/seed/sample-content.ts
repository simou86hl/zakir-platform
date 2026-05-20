// محتوى تجريبي كامل لمادة الرياضيات - الصف العاشر
export const mathContent = {
  subject: {
    nameAr: 'الرياضيات',
    nameEn: 'Mathematics',
    description: 'مادة الرياضيات للمرحلة الثانوية',
    icon: '📐',
    color: '#2563eb',
  },
  units: [
    {
      nameAr: 'الوحدة الأولى: الأعداد الحقيقية',
      nameEn: 'Unit 1: Real Numbers',
      description: 'التعامل مع الأعداد الحقيقية وخصائصها',
      lessons: [
        {
          nameAr: 'الأعداد النسبية وغير النسبية',
          nameEn: 'Rational and Irrational Numbers',
          description: 'التمييز بين الأعداد النسبية وغير النسبية وخصائص كل منها',
          objectives: ['تعريف الأعداد النسبية', 'تعريف الأعداد غير النسبية', 'التمييز بين النوعين', 'تمثيلها على خط الأعداد'],
          estimatedTime: 45,
          difficulty: 'EASY' as const,
          isFree: true,
          contents: [
            {
              type: 'TEXT' as const,
              title: 'مقدمة عن الأعداد',
              content: {
                html: `<h2>الأعداد النسبية</h2>
<p>الأعداد النسبية هي الأعداد التي يمكن كتابتها على شكل كسر <strong>p/q</strong> حيث p و q عددان صحيحان و q ≠ 0.</p>
<h3>أمثلة على الأعداد النسبية:</h3>
<ul>
  <li>½ = 0.5</li>
  <li>¾ = 0.75</li>
  <li>-2 = -2/1</li>
  <li>0.333... = ⅓</li>
</ul>
<h2>الأعداد غير النسبية</h2>
<p>الأعداد غير النسبية هي الأعداد التي لا يمكن كتابتها على شكل كسر، وكسرها العشري لا ينتهي ولا يتكرر.</p>
<h3>أمثلة:</h3>
<ul>
  <li>√2 = 1.41421356...</li>
  <li>π = 3.14159265...</li>
  <li>e = 2.71828...</li>
</ul>`,
              },
              sortOrder: 1,
            },
            {
              type: 'EQUATION' as const,
              title: 'قانون مهم',
              content: {
                latex: 'Q = \\{\\frac{p}{q} | p, q \\in \\mathbb{Z}, q \\neq 0\\}',
                description: 'تعريف مجموعة الأعداد النسبية',
              },
              sortOrder: 2,
            },
            {
              type: 'TEXT' as const,
              title: 'خصائص الأعداد الحقيقية',
              content: {
                html: `<h2>خصائص العمليات على الأعداد الحقيقية</h2>
<table border="1" style="border-collapse:collapse; width:100%">
  <tr><th>الخاصية</th><th>الجمع</th><th>الضرب</th></tr>
  <tr><td>التبادل</td><td>أ + ب = ب + أ</td><td>أ × ب = ب × أ</td></tr>
  <tr><td>التجميع</td><td>(أ+ب)+ج = أ+(ب+ج)</td><td>(أ×ب)×ج = أ×(ب×ج)</td></tr>
  <tr><td>التوزيع</td><td colspan="2">أ×(ب+ج) = أ×ب + أ×ج</td></tr>
</table>`,
              },
              sortOrder: 3,
            },
          ],
          summary: {
            keyPoints: [
              'الأعداد النسبية تكتب على شكل p/q حيث q≠0',
              'الأعداد غير النسبية لا تنتهي ولا تتكرر',
              'مجموعة الأعداد الحقيقية = النسبية ∪ غير النسبية',
              'الأعداد الطبيعية ⊂ الصحيحة ⊂ النسبية ⊂ الحقيقية',
            ],
            formulas: [
              { name: 'مجموعة الأعداد النسبية', formula: 'Q = {p/q | p,q∈Z, q≠0}' },
              { name: 'قيمة π التقريبية', formula: 'π ≈ 3.14159' },
              { name: 'قيمة √2 التقريبية', formula: '√2 ≈ 1.41421' },
            ],
          },
          exercises: [
            {
              type: 'MULTIPLE_CHOICE' as const,
              difficulty: 'EASY' as const,
              questionAr: 'أي من الأعداد التالية عدد غير نسبي؟',
              options: [{ id: 'a', text: '0.5' }, { id: 'b', text: '√3' }, { id: 'c', text: '¾' }, { id: 'd', text: '-2' }],
              correctAnswer: { id: 'b' },
              explanation: '√3 = 1.732050808... عدد غير متناهٍ وغير دوري، لذا هو عدد غير نسبي.',
              hint: 'الأعداد غير النسبية لا يمكن كتابتها على شكل كسر.',
              points: 10, tags: ['أعداد', 'نسبي', 'غير نسبي'],
            },
            {
              type: 'TRUE_FALSE' as const,
              difficulty: 'EASY' as const,
              questionAr: 'العدد 0.333... عدد نسبي.',
              correctAnswer: { value: true },
              explanation: 'نعم، 0.333... = ⅓ وهو كسر يمكن كتابته على شكل p/q.',
              hint: 'الكسر العشري الدوري عدد نسبي.',
              points: 10, tags: ['أعداد', 'نسبي'],
            },
            {
              type: 'FILL_BLANK' as const,
              difficulty: 'MEDIUM' as const,
              questionAr: 'مجموعة الأعداد الحقيقية = الأعداد النسبية ___ الأعداد غير النسبية',
              correctAnswer: { answers: ['∪', 'union', 'مجموعة'] },
              explanation: 'الأعداد الحقيقية هي اتحاد مجموعتي الأعداد النسبية وغير النسبية.',
              points: 15, tags: ['أعداد', 'مجموعات'],
            },
            {
              type: 'MULTIPLE_CHOICE' as const,
              difficulty: 'MEDIUM' as const,
              questionAr: 'ما قيمة √16 ؟',
              options: [{ id: 'a', text: '2' }, { id: 'b', text: '4' }, { id: 'c', text: '8' }, { id: 'd', text: '±4' }],
              correctAnswer: { id: 'd' },
              explanation: '√16 = ±4 لأن (4)² = 16 و (-4)² = 16',
              hint: 'تذكر أن الجذر التربيعي له قيمتان موجبة وسالبة.',
              points: 10, tags: ['جذر', 'أعداد'],
            },
            {
              type: 'MULTIPLE_CHOICE' as const,
              difficulty: 'HARD' as const,
              questionAr: 'أي من التالية صحيح؟',
              options: [
                { id: 'a', text: 'π = 22/7' },
                { id: 'b', text: 'π عدد نسبي' },
                { id: 'c', text: 'π ≈ 3.14159 وهو غير نسبي' },
                { id: 'd', text: 'π = 3.14' },
              ],
              correctAnswer: { id: 'c' },
              explanation: 'π عدد غير نسبي وقيمته تقريباً 3.14159... أما 22/7 فهي مجرد تقريب مناسب.',
              hint: 'هل يمكن كتابة π بشكل كسر دقيق؟',
              points: 15, tags: ['π', 'غير نسبي'],
            },
          ],
        },
        {
          nameAr: 'العمليات على الجذور',
          nameEn: 'Operations on Radicals',
          description: 'تعلم كيفية جمع وطرح وضرب وقسمة الجذور',
          objectives: ['تبسيط الجذور', 'جمع وطرح الجذور المتماثلة', 'ضرب الجذور', 'توحيد المقام'],
          estimatedTime: 60,
          difficulty: 'MEDIUM' as const,
          isFree: false,
          contents: [
            {
              type: 'TEXT' as const,
              title: 'تبسيط الجذور',
              content: {
                html: `<h2>كيف نبسط الجذر التربيعي؟</h2>
<p>لتبسيط √n، نجد أكبر مربع كامل يقسم n.</p>
<h3>مثال:</h3>
<p>√48 = √(16 × 3) = √16 × √3 = 4√3</p>
<h3>خطوات التبسيط:</h3>
<ol>
  <li>حلّل العدد إلى عوامله الأولية</li>
  <li>اجمع العوامل المتشابهة في مجموعات</li>
  <li>أخرج كل مجموعة من الجذر</li>
</ol>`,
              },
              sortOrder: 1,
            },
            {
              type: 'EQUATION' as const,
              title: 'قوانين الجذور',
              content: {
                latex: '\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b} \\quad \\text{و} \\quad \\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}',
                description: 'قوانين ضرب وقسمة الجذور',
              },
              sortOrder: 2,
            },
          ],
          summary: {
            keyPoints: [
              'نبسط الجذر بإخراج المربعات الكاملة',
              'نجمع الجذور المتماثلة (نفس الرقم تحت الجذر)',
              '√a × √b = √(ab)',
              '√(a/b) = √a / √b',
            ],
            formulas: [
              { name: 'ضرب الجذور', formula: '√a × √b = √(ab)' },
              { name: 'قسمة الجذور', formula: '√a ÷ √b = √(a/b)' },
              { name: 'تربيع الجذر', formula: '(√a)² = a' },
            ],
          },
          exercises: [
            {
              type: 'MULTIPLE_CHOICE' as const,
              difficulty: 'MEDIUM' as const,
              questionAr: 'ما هو أبسط صورة للعدد √72 ؟',
              options: [{ id: 'a', text: '6√2' }, { id: 'b', text: '8√3' }, { id: 'c', text: '4√6' }, { id: 'd', text: '3√8' }],
              correctAnswer: { id: 'a' },
              explanation: '√72 = √(36×2) = √36 × √2 = 6√2',
              hint: 'ابحث عن أكبر مربع كامل يقسم 72. 36 × 2 = 72',
              points: 10, tags: ['جذور', 'تبسيط'],
            },
            {
              type: 'FILL_BLANK' as const,
              difficulty: 'MEDIUM' as const,
              questionAr: '√3 × √12 = ___',
              correctAnswer: { answers: ['6', '٦'] },
              explanation: '√3 × √12 = √(3×12) = √36 = 6',
              points: 10, tags: ['جذور', 'ضرب'],
            },
          ],
        },
        {
          nameAr: 'النسب والتناسب',
          nameEn: 'Ratio and Proportion',
          description: 'فهم النسبة والتناسب وتطبيقاتها العملية',
          objectives: ['تعريف النسبة', 'حل مسائل التناسب المباشر', 'حل مسائل التناسب العكسي', 'تطبيقات حياتية'],
          estimatedTime: 50,
          difficulty: 'EASY' as const,
          isFree: true,
          contents: [
            {
              type: 'TEXT' as const,
              title: 'النسبة والتناسب',
              content: {
                html: `<h2>ما هي النسبة؟</h2>
<p>النسبة هي مقارنة بين كميتين من نفس النوع. تكتب على شكل a:b أو a/b</p>
<h2>التناسب المباشر</h2>
<p>إذا ازداد أحد الكميتين ازدادت الأخرى بنفس النسبة.</p>
<p><strong>مثال:</strong> كلما زاد عدد الكتب، زاد ثمنها.</p>
<h2>التناسب العكسي</h2>
<p>إذا ازدادت إحدى الكميتين نقصت الأخرى.</p>
<p><strong>مثال:</strong> كلما زادت سرعة السيارة، قل وقت الوصول.</p>`,
              },
              sortOrder: 1,
            },
          ],
          summary: {
            keyPoints: [
              'النسبة مقارنة بين كميتين: a:b = a/b',
              'التناسب المباشر: y = kx حيث k ثابت',
              'التناسب العكسي: y = k/x حيث k ثابت',
            ],
            formulas: [
              { name: 'التناسب المباشر', formula: 'y/x = k (ثابت)' },
              { name: 'التناسب العكسي', formula: 'xy = k (ثابت)' },
            ],
          },
          exercises: [
            {
              type: 'MULTIPLE_CHOICE' as const,
              difficulty: 'EASY' as const,
              questionAr: 'إذا اشترى 3 كتب بـ 15 ريال، فكم تكلف 7 كتب؟',
              options: [{ id: 'a', text: '30 ريال' }, { id: 'b', text: '35 ريال' }, { id: 'c', text: '21 ريال' }, { id: 'd', text: '45 ريال' }],
              correctAnswer: { id: 'b' },
              explanation: 'سعر الكتاب الواحد = 15/3 = 5 ريال، إذن 7 كتب = 7 × 5 = 35 ريال',
              hint: 'أوجد سعر كتاب واحد أولاً.',
              points: 10, tags: ['نسبة', 'تناسب'],
            },
          ],
        },
      ],
    },
    {
      nameAr: 'الوحدة الثانية: المعادلات والمتباينات',
      nameEn: 'Unit 2: Equations and Inequalities',
      description: 'حل المعادلات والمتباينات الخطية والتربيعية',
      lessons: [
        {
          nameAr: 'المعادلات الخطية',
          nameEn: 'Linear Equations',
          description: 'حل المعادلات الخطية بمتغير واحد ومتغيرين',
          objectives: ['حل معادلة بمتغير واحد', 'حل معادلة بمتغيرين', 'تطبيقات على المعادلات'],
          estimatedTime: 55,
          difficulty: 'MEDIUM' as const,
          isFree: false,
          contents: [
            {
              type: 'TEXT' as const,
              title: 'المعادلة الخطية',
              content: {
                html: `<h2>المعادلة الخطية بمتغير واحد</h2>
<p>المعادلة الخطية هي معادلة من الدرجة الأولى في المتغير. صيغتها العامة:</p>
<p><strong>ax + b = 0</strong> حيث a ≠ 0</p>
<h3>خطوات الحل:</h3>
<ol>
  <li>عزل المتغير على أحد الطرفين</li>
  <li>جمع/طرح الثوابت</li>
  <li>القسمة على معامل المتغير</li>
</ol>
<h3>مثال: حل المعادلة 2x + 6 = 14</h3>
<p>2x = 14 - 6 = 8</p>
<p>x = 8/2 = <strong>4</strong></p>`,
              },
              sortOrder: 1,
            },
            {
              type: 'EQUATION' as const,
              title: 'الصيغة العامة',
              content: { latex: 'ax + b = c \\Rightarrow x = \\frac{c - b}{a}, \\quad a \\neq 0', description: 'حل المعادلة الخطية' },
              sortOrder: 2,
            },
          ],
          summary: {
            keyPoints: [
              'المعادلة الخطية: ax + b = 0',
              'الحل: x = -b/a',
              'التحقق بتعويض الحل في المعادلة الأصلية',
              'المعادلة ذات متغيرين تمثل خطاً مستقيماً',
            ],
            formulas: [{ name: 'حل المعادلة ax+b=c', formula: 'x = (c-b)/a' }],
          },
          exercises: [
            {
              type: 'FILL_BLANK' as const,
              difficulty: 'EASY' as const,
              questionAr: 'حل المعادلة: 3x - 9 = 0 ، الحل هو x = ___',
              correctAnswer: { answers: ['3', '٣'] },
              explanation: '3x = 9 ، x = 9/3 = 3',
              hint: 'أضف 9 لكلا الطرفين ثم اقسم على 3.',
              points: 10, tags: ['معادلات', 'خطية'],
            },
            {
              type: 'MULTIPLE_CHOICE' as const,
              difficulty: 'MEDIUM' as const,
              questionAr: 'حل المعادلة: 5x + 3 = 2x + 12',
              options: [{ id: 'a', text: 'x = 3' }, { id: 'b', text: 'x = 5' }, { id: 'c', text: 'x = 9' }, { id: 'd', text: 'x = -3' }],
              correctAnswer: { id: 'a' },
              explanation: '5x - 2x = 12 - 3 → 3x = 9 → x = 3',
              hint: 'اجمع حدود x في أحد الطرفين والأعداد في الطرف الآخر.',
              points: 10, tags: ['معادلات', 'خطية'],
            },
          ],
        },
        {
          nameAr: 'المعادلات التربيعية',
          nameEn: 'Quadratic Equations',
          description: 'حل المعادلات التربيعية بطرق مختلفة',
          objectives: ['التعرف على المعادلة التربيعية', 'الحل بالتحليل', 'الحل بالقانون العام', 'الحل بإكمال المربع'],
          estimatedTime: 75,
          difficulty: 'HARD' as const,
          isFree: false,
          contents: [
            {
              type: 'TEXT' as const,
              title: 'المعادلة التربيعية',
              content: {
                html: `<h2>المعادلة التربيعية</h2>
<p>المعادلة التربيعية هي معادلة من الدرجة الثانية. صيغتها العامة:</p>
<p><strong>ax² + bx + c = 0</strong> حيث a ≠ 0</p>

<h2>طرق الحل:</h2>
<h3>1. الحل بالتحليل (التحليل إلى عوامل)</h3>
<p>مثال: x² - 5x + 6 = 0 → (x-2)(x-3) = 0 → x = 2 أو x = 3</p>

<h3>2. القانون العام (صيغة الجذور)</h3>
<p>تستخدم هذا القانون عندما يصعب التحليل.</p>`,
              },
              sortOrder: 1,
            },
            {
              type: 'EQUATION' as const,
              title: 'قانون الجذور (القانون العام)',
              content: {
                latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
                description: 'القانون العام لحل المعادلة التربيعية ax² + bx + c = 0',
              },
              sortOrder: 2,
            },
            {
              type: 'EQUATION' as const,
              title: 'المميز',
              content: {
                latex: '\\Delta = b^2 - 4ac \\begin{cases} > 0 & \\text{جذران حقيقيان مختلفان} \\\\ = 0 & \\text{جذران حقيقيان متساويان} \\\\ < 0 & \\text{لا توجد جذور حقيقية} \\end{cases}',
                description: 'حالات المميز وطبيعة الجذور',
              },
              sortOrder: 3,
            },
          ],
          summary: {
            keyPoints: [
              'المعادلة التربيعية: ax²+bx+c=0 حيث a≠0',
              'القانون العام: x = (-b ± √(b²-4ac)) / 2a',
              'المميز Δ = b²-4ac يحدد عدد الجذور',
              'Δ>0: جذران مختلفان، Δ=0: جذر مكرر، Δ<0: لا جذور',
            ],
            formulas: [
              { name: 'القانون العام', formula: 'x = (-b ± √(b²-4ac)) / 2a' },
              { name: 'المميز', formula: 'Δ = b² - 4ac' },
              { name: 'مجموع الجذرين', formula: 'x₁ + x₂ = -b/a' },
              { name: 'حاصل ضرب الجذرين', formula: 'x₁ × x₂ = c/a' },
            ],
          },
          exercises: [
            {
              type: 'MULTIPLE_CHOICE' as const,
              difficulty: 'MEDIUM' as const,
              questionAr: 'ما هو حل المعادلة x² - 5x + 6 = 0؟',
              options: [{ id: 'a', text: 'x = 2, 3' }, { id: 'b', text: 'x = -2, -3' }, { id: 'c', text: 'x = 1, 6' }, { id: 'd', text: 'x = -1, -6' }],
              correctAnswer: { id: 'a' },
              explanation: 'x² - 5x + 6 = (x-2)(x-3) = 0 إذن x = 2 أو x = 3',
              hint: 'ابحث عن عددين حاصل ضربهما 6 ومجموعهما -5',
              points: 15, tags: ['معادلات', 'تربيعية', 'تحليل'],
            },
            {
              type: 'FILL_BLANK' as const,
              difficulty: 'HARD' as const,
              questionAr: 'مميز المعادلة x² - 4x + 4 = 0 هو Δ = ___',
              correctAnswer: { answers: ['0', '٠', 'صفر'] },
              explanation: 'Δ = b²-4ac = (-4)²-4(1)(4) = 16-16 = 0، لذا للمعادلة جذر واحد مكرر x = 2',
              points: 15, tags: ['معادلات', 'تربيعية', 'مميز'],
            },
            {
              type: 'MULTIPLE_CHOICE' as const,
              difficulty: 'HARD' as const,
              questionAr: 'في المعادلة 2x² + 3x - 2 = 0، مجموع الجذرين يساوي:',
              options: [{ id: 'a', text: '-3/2' }, { id: 'b', text: '3/2' }, { id: 'c', text: '-1' }, { id: 'd', text: '1' }],
              correctAnswer: { id: 'a' },
              explanation: 'مجموع الجذرين = -b/a = -3/2',
              hint: 'استخدم خاصية: مجموع الجذرين = -b/a',
              points: 15, tags: ['معادلات', 'تربيعية', 'جذور'],
            },
          ],
        },
      ],
    },
    {
      nameAr: 'الوحدة الثالثة: الدوال',
      nameEn: 'Unit 3: Functions',
      description: 'دراسة الدوال الرياضية وخصائصها وتمثيلها البياني',
      lessons: [
        {
          nameAr: 'مفهوم الدالة',
          nameEn: 'Concept of Functions',
          description: 'تعريف الدالة ومجال التعريف ومجال القيم',
          objectives: ['تعريف الدالة', 'مجال التعريف', 'مجال القيم', 'التمثيل البياني'],
          estimatedTime: 50,
          difficulty: 'MEDIUM' as const,
          isFree: true,
          contents: [
            {
              type: 'TEXT' as const,
              title: 'ما هي الدالة؟',
              content: {
                html: `<h2>تعريف الدالة</h2>
<p>الدالة هي علاقة بين مجموعتين بحيث لكل عنصر في المجموعة الأولى (المجال) عنصر واحد فقط في المجموعة الثانية (المدى).</p>

<h3>مثال:</h3>
<p>f(x) = 2x + 1 هي دالة لأن لكل قيمة x توجد قيمة واحدة فقط لـ f(x)</p>

<h2>مجال التعريف</h2>
<p>مجال التعريف هو مجموعة كل قيم x التي يمكن تعويضها في الدالة.</p>

<h2>مجال القيم (المدى)</h2>
<p>مجال القيم هو مجموعة كل القيم الممكنة لـ f(x)</p>`,
              },
              sortOrder: 1,
            },
          ],
          summary: {
            keyPoints: [
              'الدالة: لكل x في المجال قيمة واحدة f(x)',
              'مجال التعريف: قيم x المسموح بها',
              'مجال القيم: كل القيم الممكنة لـ f(x)',
              'اختبار الخط الرأسي لتمييز الدالة',
            ],
            formulas: [{ name: 'الدالة الخطية', formula: 'f(x) = mx + b' }],
          },
          exercises: [
            {
              type: 'MULTIPLE_CHOICE' as const,
              difficulty: 'EASY' as const,
              questionAr: 'إذا كانت f(x) = 3x - 2، فما قيمة f(4)؟',
              options: [{ id: 'a', text: '10' }, { id: 'b', text: '14' }, { id: 'c', text: '8' }, { id: 'd', text: '12' }],
              correctAnswer: { id: 'a' },
              explanation: 'f(4) = 3(4) - 2 = 12 - 2 = 10',
              hint: 'عوّض x=4 في الدالة.',
              points: 10, tags: ['دوال', 'تعويض'],
            },
          ],
        },
      ],
    },
  ],
};
