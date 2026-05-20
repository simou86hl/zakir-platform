// محتوى الفيزياء - الصف الحادي عشر
export const physicsContent = {
  subject: { nameAr: 'الفيزياء', nameEn: 'Physics', description: 'الفيزياء للمرحلة الثانوية', icon: '🔭', color: '#0891b2' },
  units: [
    {
      nameAr: 'الوحدة الأولى: الحركة في خط مستقيم',
      nameEn: 'Unit 1: Linear Motion',
      description: 'دراسة الحركة وقوانينها الأساسية',
      lessons: [
        {
          nameAr: 'المسافة والإزاحة والسرعة',
          nameEn: 'Distance, Displacement and Velocity',
          description: 'تعريف المصطلحات الأساسية للحركة والفرق بينها',
          objectives: ['الفرق بين المسافة والإزاحة', 'الفرق بين السرعة العددية والمتجهة', 'حساب السرعة المتوسطة', 'رسم مخططات الحركة'],
          estimatedTime: 55, difficulty: 'MEDIUM' as const, isFree: true,
          contents: [
            { type: 'TEXT' as const, title: 'مفاهيم الحركة',
              content: { html: `<h2>المسافة والإزاحة</h2><p><strong>المسافة:</strong> الطول الكلي للمسار المقطوع (كمية عددية - Scalar).</p><p><strong>الإزاحة:</strong> المسافة المستقيمة من نقطة البداية لنقطة النهاية مع اتجاهها (كمية متجهة - Vector).</p><h3>مثال:</h3><p>طالب يمشي 3 كم شرقاً ثم 4 كم شمالاً:</p><ul><li>المسافة الكلية = 3 + 4 = 7 كم</li><li>الإزاحة = √(3²+4²) = 5 كم (شمال شرق)</li></ul><h2>السرعة العددية والمتجهة</h2><p><strong>السرعة العددية (Speed):</strong> معدل تغير المسافة (كمية عددية)</p><p><strong>السرعة المتجهة (Velocity):</strong> معدل تغير الإزاحة مع الاتجاه (كمية متجهة)</p>` },
              sortOrder: 1 },
            { type: 'EQUATION' as const, title: 'معادلات السرعة',
              content: { latex: 'v_{avg} = \\frac{\\Delta x}{\\Delta t} = \\frac{x_f - x_i}{t_f - t_i}', description: 'السرعة المتوسطة = التغير في الإزاحة ÷ الزمن' },
              sortOrder: 2 },
          ],
          summary: {
            keyPoints: ['المسافة كمية عددية، الإزاحة كمية متجهة', 'السرعة المتوسطة = الإزاحة ÷ الزمن', 'السرعة العددية = المسافة ÷ الزمن', 'الكميات المتجهة لها مقدار واتجاه'],
            formulas: [{ name: 'السرعة المتوسطة', formula: 'v = Δx/Δt' }, { name: 'السرعة العددية', formula: 'speed = distance/time' }],
          },
          exercises: [
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'سيارة تقطع 120 كم في ساعتين. ما سرعتها المتوسطة؟', options: [{id:'a',text:'30 كم/س'},{id:'b',text:'60 كم/س'},{id:'c',text:'120 كم/س'},{id:'d',text:'240 كم/س'}], correctAnswer:{id:'b'}, explanation:'السرعة = المسافة ÷ الزمن = 120 ÷ 2 = 60 كم/ساعة', hint:'طبّق قانون: السرعة = المسافة / الزمن', points:10, tags:['فيزياء','سرعة'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'MEDIUM' as const, questionAr: 'الفرق الأساسي بين الإزاحة والمسافة هو:', options: [{id:'a',text:'الإزاحة تُقاس بالمتر والمسافة بالكيلومتر'},{id:'b',text:'الإزاحة كمية متجهة والمسافة كمية عددية'},{id:'c',text:'المسافة دائماً أكبر من الإزاحة'},{id:'d',text:'الإزاحة تعتمد على المسار'}], correctAnswer:{id:'b'}, explanation:'الإزاحة كمية متجهة (لها مقدار واتجاه) والمسافة كمية عددية (لها مقدار فقط).', hint:'هل الاتجاه مهم في الحساب؟', points:15, tags:['فيزياء','إزاحة'] },
            { type: 'FILL_BLANK' as const, difficulty: 'MEDIUM' as const, questionAr: 'جسم يتحرك 50م في 10 ثوانٍ. سرعته المتوسطة = ___ م/ث', correctAnswer:{answers:['5','٥']}, explanation:'v = d/t = 50/10 = 5 م/ثانية', points:10, tags:['فيزياء','حساب'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'HARD' as const, questionAr: 'طالب يسير 4م شرقاً ثم 3م شمالاً. ما مقدار إزاحته؟', options: [{id:'a',text:'7 م'},{id:'b',text:'1 م'},{id:'c',text:'5 م'},{id:'d',text:'12 م'}], correctAnswer:{id:'c'}, explanation:'الإزاحة = √(4²+3²) = √(16+9) = √25 = 5م (نظرية فيثاغورس)', hint:'استخدم نظرية فيثاغورس لإيجاد الوتر.', points:15, tags:['فيزياء','إزاحة','فيثاغورس'] },
          ],
        },
        {
          nameAr: 'التسارع وقوانين الحركة',
          nameEn: 'Acceleration and Laws of Motion',
          description: 'تعريف التسارع والمعادلات الكينماتية للحركة المنتظمة',
          objectives: ['تعريف التسارع وحسابه', 'المعادلات الكينماتية الأربعة', 'حل مسائل الحركة المتسارعة', 'الجسم المقذوف رأسياً'],
          estimatedTime: 65, difficulty: 'HARD' as const, isFree: false,
          contents: [
            { type: 'TEXT' as const, title: 'التسارع',
              content: { html: `<h2>التسارع</h2><p>التسارع هو معدل تغير السرعة مع الزمن. إذا ازدادت السرعة فالتسارع موجب، وإذا نقصت فهو سالب (تباطؤ).</p><h2>معادلات الحركة الكينماتية</h2><p>للجسم ذي تسارع ثابت:</p>` },
              sortOrder: 1 },
            { type: 'EQUATION' as const, title: 'معادلات الكينماتيكا الأربعة',
              content: { latex: '\\begin{aligned} v &= v_0 + at \\\\ x &= v_0t + \\frac{1}{2}at^2 \\\\ v^2 &= v_0^2 + 2ax \\\\ x &= \\frac{v+v_0}{2}t \\end{aligned}', description: 'معادلات الحركة المتسارعة الثابتة' },
              sortOrder: 2 },
          ],
          summary: {
            keyPoints: ['التسارع = تغير السرعة ÷ الزمن', 'التسارع الموجب: تزايد السرعة', 'التسارع السالب (تباطؤ): تناقص السرعة', 'تسارع الجاذبية g = 9.8 م/ث²'],
            formulas: [
              { name: 'التسارع', formula: 'a = (v - v₀) / t' },
              { name: 'المعادلة الأولى', formula: 'v = v₀ + at' },
              { name: 'المعادلة الثانية', formula: 'x = v₀t + ½at²' },
              { name: 'المعادلة الثالثة', formula: 'v² = v₀² + 2ax' },
            ],
          },
          exercises: [
            { type: 'FILL_BLANK' as const, difficulty: 'MEDIUM' as const, questionAr: 'سيارة سرعتها 20 م/ث تسارع بـ 3 م/ث² لمدة 5 ثوانٍ. سرعتها النهائية = ___ م/ث', correctAnswer:{answers:['35','٣٥']}, explanation:'v = v₀ + at = 20 + (3×5) = 20 + 15 = 35 م/ث', points:15, tags:['فيزياء','تسارع'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'HARD' as const, questionAr: 'جسم يبدأ من السكون ويتسارع بـ 4 م/ث². المسافة التي يقطعها في 3 ثوانٍ:', options: [{id:'a',text:'12 م'},{id:'b',text:'18 م'},{id:'c',text:'24 م'},{id:'d',text:'36 م'}], correctAnswer:{id:'b'}, explanation:'x = v₀t + ½at² = 0 + ½(4)(3²) = 2×9 = 18م', hint:'استخدم: x = v₀t + ½at², و v₀=0 لأنه يبدأ من السكون.', points:15, tags:['فيزياء','معادلات'] },
          ],
        },
      ],
    },
    {
      nameAr: 'الوحدة الثانية: الشغل والطاقة',
      nameEn: 'Unit 2: Work and Energy',
      description: 'مفاهيم الشغل والطاقة وقانون حفظ الطاقة',
      lessons: [
        {
          nameAr: 'الشغل والطاقة الحركية',
          nameEn: 'Work and Kinetic Energy',
          description: 'تعريف الشغل وحسابه والطاقة الحركية',
          objectives: ['تعريف الشغل وحسابه', 'متى يكون الشغل صفراً', 'الطاقة الحركية وحسابها', 'نظرية الشغل والطاقة'],
          estimatedTime: 50, difficulty: 'MEDIUM' as const, isFree: true,
          contents: [
            { type: 'TEXT' as const, title: 'الشغل والطاقة',
              content: { html: `<h2>الشغل</h2><p>الشغل يُنجَز عندما تُسبّب قوةٌ ما إزاحةَ جسمٍ في اتجاه القوة (أو مركّبتها).</p><p>الشغل = صفر إذا: لم يتحرك الجسم، أو كانت القوة عمودية على الإزاحة.</p><h2>الطاقة الحركية</h2><p>هي الطاقة التي يمتلكها الجسم بسبب حركته. تزداد بازدياد كتلته أو سرعته.</p>` },
              sortOrder: 1 },
            { type: 'EQUATION' as const, title: 'معادلات الشغل والطاقة',
              content: { latex: 'W = F \\cdot d \\cdot \\cos\\theta \\quad \\text{و} \\quad KE = \\frac{1}{2}mv^2', description: 'الشغل = القوة × الإزاحة × جيب تمام الزاوية | الطاقة الحركية = ½mv²' },
              sortOrder: 2 },
          ],
          summary: {
            keyPoints: ['الشغل = F × d × cos θ (وحدته الجول)', 'الشغل صفر إذا لم يتحرك الجسم أو القوة عمودية على الحركة', 'KE = ½mv² (طاقة حركية)', 'الطاقة المحتملة الجاذبية: PE = mgh'],
            formulas: [{ name: 'الشغل', formula: 'W = F·d·cosθ' }, { name: 'الطاقة الحركية', formula: 'KE = ½mv²' }, { name: 'الطاقة المحتملة', formula: 'PE = mgh' }],
          },
          exercises: [
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'MEDIUM' as const, questionAr: 'قوة 50 نيوتن تحرّك جسماً 4م بنفس اتجاهها. الشغل المبذول:', options: [{id:'a',text:'12.5 جول'},{id:'b',text:'46 جول'},{id:'c',text:'200 جول'},{id:'d',text:'54 جول'}], correctAnswer:{id:'c'}, explanation:'W = F × d × cos0° = 50 × 4 × 1 = 200 جول (cos0°=1 لأن القوة والإزاحة بنفس الاتجاه)', hint:'W = F × d × cosθ ، والزاوية = 0° عندما تكون القوة والإزاحة في نفس الاتجاه', points:15, tags:['فيزياء','شغل'] },
            { type: 'FILL_BLANK' as const, difficulty: 'MEDIUM' as const, questionAr: 'جسم كتلته 2 كغ يتحرك بسرعة 10 م/ث. طاقته الحركية = ___ جول', correctAnswer:{answers:['100','١٠٠']}, explanation:'KE = ½mv² = ½ × 2 × 10² = ½ × 2 × 100 = 100 جول', points:15, tags:['فيزياء','طاقة حركية'] },
          ],
        },
      ],
    },
  ],
};
