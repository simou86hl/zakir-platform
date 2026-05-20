// محتوى المرحلة الابتدائية - الصف الثالث والرابع
export const primaryMathContent = {
  subject: { nameAr: 'الرياضيات', nameEn: 'Mathematics', description: 'رياضيات المرحلة الابتدائية', icon: '🔢', color: '#2563eb' },
  grade: 3,
  units: [
    {
      nameAr: 'الوحدة الأولى: الجمع والطرح',
      nameEn: 'Unit 1: Addition and Subtraction',
      description: 'عمليات الجمع والطرح للأعداد حتى 1000',
      lessons: [
        {
          nameAr: 'الجمع مع إعادة التجميع',
          nameEn: 'Addition with Regrouping',
          description: 'تعلم جمع الأعداد مع إعادة التجميع',
          objectives: ['فهم إعادة التجميع', 'جمع أعداد ثلاثية الأرقام', 'التحقق من العمليات'],
          estimatedTime: 40, difficulty: 'EASY' as const, isFree: true,
          contents: [
            { type: 'TEXT' as const, title: 'الجمع مع إعادة التجميع',
              content: { html: `<h2>الجمع مع إعادة التجميع</h2><p>عندما يكون مجموع الخانة أكبر من 9، نُعيد التجميع (نحمل) للخانة التالية.</p><h3>مثال: 247 + 186</h3><table border="1" style="border-collapse:collapse;text-align:center;width:200px"><tr><th>مئات</th><th>عشرات</th><th>آحاد</th></tr><tr><td>2</td><td>4</td><td>7</td></tr><tr><td>+1</td><td>+8</td><td>+6</td></tr><tr><td colspan="3">↑نحمل 1</td></tr><tr><td>4</td><td>3</td><td>3</td></tr></table><p>7+6=13 ← نكتب 3 ونحمل 1 للعشرات</p><p>4+8+1(محمولة)=13 ← نكتب 3 ونحمل 1 للمئات</p><p>2+1+1(محمولة)=4 ← نكتب 4</p><p>الناتج = <strong>433</strong></p>` },
              sortOrder: 1 },
          ],
          summary: {
            keyPoints: ['إذا تجاوز مجموع الخانة 9، نحمل 1 للخانة التالية', 'نبدأ الجمع من اليمين (الآحاد) للأيسر (المئات)', 'يمكن التحقق بالطرح: 433-186=247'],
            formulas: null,
          },
          exercises: [
            { type: 'FILL_BLANK' as const, difficulty: 'EASY' as const, questionAr: '135 + 248 = ___', correctAnswer:{answers:['383','٣٨٣']}, explanation:'135+248: الآحاد 5+8=13 (نكتب 3 ونحمل1)، العشرات 3+4+1=8، المئات 1+2=3 → 383', points:10, tags:['رياضيات','جمع','ابتدائي'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'ما ناتج 364 + 275 ؟', options: [{id:'a',text:'629'},{id:'b',text:'639'},{id:'c',text:'639'},{id:'d',text:'729'}], correctAnswer:{id:'b'}, explanation:'364+275: آحاد 4+5=9، عشرات 6+7=13(نحمل)، مئات 3+2+1=6 → 639', points:10, tags:['رياضيات','جمع'] },
            { type: 'TRUE_FALSE' as const, difficulty: 'EASY' as const, questionAr: '456 + 123 = 579', correctAnswer:{value:true}, explanation:'456+123: 6+3=9، 5+2=7، 4+1=5 → 579 ✓', points:10, tags:['رياضيات','جمع'] },
            { type: 'FILL_BLANK' as const, difficulty: 'MEDIUM' as const, questionAr: '599 + 401 = ___', correctAnswer:{answers:['1000','١٠٠٠']}, explanation:'599+401=1000 (نجمع مباشرة: 9+1=10 نحمل، 9+0+1=10 نحمل، 5+4+1=10)→1000', points:15, tags:['رياضيات','جمع'] },
          ],
        },
        {
          nameAr: 'الضرب في الجدول (حتى 10×10)',
          nameEn: 'Multiplication Table',
          description: 'حفظ وتطبيق جداول الضرب من 1 إلى 10',
          objectives: ['جداول الضرب 1-10', 'خصائص الضرب', 'تطبيق الضرب في المسائل'],
          estimatedTime: 45, difficulty: 'EASY' as const, isFree: true,
          contents: [
            { type: 'TEXT' as const, title: 'جداول الضرب',
              content: { html: `<h2>جداول الضرب</h2><p>الضرب هو جمع متكرر. مثلاً: 3×4 = 4+4+4 = 12</p><h3>أسرار جداول الضرب!</h3><ul><li><strong>× 2:</strong> ضاعف العدد (5×2=10)</li><li><strong>× 5:</strong> ينتهي دائماً بـ 0 أو 5</li><li><strong>× 10:</strong> أضف صفراً (7×10=70)</li><li><strong>× 9:</strong> مجموع رقمي الناتج = 9 دائماً (9×7=63، 6+3=9)</li></ul><h3>نصيحة:</h3><p>الضرب تبادلي: 3×7 = 7×3 = 21</p>` },
              sortOrder: 1 },
          ],
          summary: {
            keyPoints: ['الضرب = جمع متكرر', 'الضرب تبادلي: أ×ب = ب×أ', 'أي عدد × 0 = 0', 'أي عدد × 1 = نفس العدد'],
            formulas: null,
          },
          exercises: [
            { type: 'FILL_BLANK' as const, difficulty: 'EASY' as const, questionAr: '7 × 8 = ___', correctAnswer:{answers:['56','٥٦']}, explanation:'7×8=56. يمكن حفظه: 5، 6، 7، 8 (56=7×8)', points:10, tags:['رياضيات','ضرب','ابتدائي'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'ما ناتج 9 × 6 ؟', options: [{id:'a',text:'54'},{id:'b',text:'56'},{id:'c',text:'52'},{id:'d',text:'48'}], correctAnswer:{id:'a'}, explanation:'9×6=54. للتحقق: مجموع 5+4=9 ✓ (خاصية ضرب 9)', points:10, tags:['رياضيات','ضرب'] },
            { type: 'TRUE_FALSE' as const, difficulty: 'EASY' as const, questionAr: '6 × 7 = 7 × 6', correctAnswer:{value:true}, explanation:'نعم! الضرب تبادلي: 6×7=42=7×6', points:10, tags:['رياضيات','ضرب','تبادلي'] },
            { type: 'FILL_BLANK' as const, difficulty: 'MEDIUM' as const, questionAr: 'لدى أحمد 4 علب، في كل علبة 9 تفاحات. كم مجموع التفاحات؟', correctAnswer:{answers:['36','٣٦']}, explanation:'4×9=36 تفاحة', points:15, tags:['رياضيات','ضرب','مسائل'] },
          ],
        },
      ],
    },
    {
      nameAr: 'الوحدة الثانية: الكسور',
      nameEn: 'Unit 2: Fractions',
      description: 'مقدمة في الكسور وعملياتها',
      lessons: [
        {
          nameAr: 'مقدمة في الكسور',
          nameEn: 'Introduction to Fractions',
          description: 'تعريف الكسور وأجزاؤها وتمثيلها',
          objectives: ['تعريف الكسر والبسط والمقام', 'الكسر كجزء من كل', 'مقارنة الكسور', 'الكسور المتكافئة'],
          estimatedTime: 40, difficulty: 'EASY' as const, isFree: true,
          contents: [
            { type: 'TEXT' as const, title: 'الكسور',
              content: { html: `<h2>الكسر</h2><p>الكسر يُعبّر عن جزء من كل. يُكتب: البسط / المقام</p><h3>مثال: ¾</h3><ul><li><strong>البسط (3):</strong> عدد الأجزاء التي نأخذها</li><li><strong>المقام (4):</strong> عدد الأجزاء المتساوية الكلي</li></ul><h3>أنواع الكسور:</h3><ul><li><strong>كسر أصغر من الواحد:</strong> البسط < المقام (مثل ½, ¾)</li><li><strong>كسر مساوٍ للواحد:</strong> البسط = المقام (مثل 3/3 = 1)</li><li><strong>كسر غير حقيقي:</strong> البسط > المقام (مثل 5/3)</li></ul>` },
              sortOrder: 1 },
          ],
          summary: {
            keyPoints: ['الكسر = بسط / مقام', 'البسط: الأجزاء التي أُخذت، المقام: الأجزاء الكلية', 'الكسور المتكافئة: نفس القيمة بصورة مختلفة (½ = 2/4)', 'مقارنة الكسور بنفس المقام: الأكبر بسطاً هو الأكبر'],
            formulas: null,
          },
          exercises: [
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'في الكسر ⅗، ما البسط؟', options: [{id:'a',text:'5'},{id:'b',text:'3'},{id:'c',text:'8'},{id:'d',text:'2'}], correctAnswer:{id:'b'}, explanation:'في الكسر 3/5: البسط هو الرقم العلوي = 3، والمقام هو الرقم السفلي = 5.', hint:'البسط هو الرقم فوق خط الكسر.', points:10, tags:['رياضيات','كسور','ابتدائي'] },
            { type: 'TRUE_FALSE' as const, difficulty: 'EASY' as const, questionAr: 'الكسر ½ يساوي الكسر 2/4', correctAnswer:{value:true}, explanation:'نعم! ½ = 2/4 كسران متكافئان لأن ½×(2/2) = 2/4', points:10, tags:['رياضيات','كسور متكافئة'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'MEDIUM' as const, questionAr: 'أيّ الكسور أكبر: ¾ أم ⅗ ؟', options: [{id:'a',text:'¾'},{id:'b',text:'⅗'},{id:'c',text:'متساويان'},{id:'d',text:'لا يمكن المقارنة'}], correctAnswer:{id:'a'}, explanation:'نحوّل للمقام المشترك 20: ¾=15/20، ⅗=12/20. إذن ¾ > ⅗', hint:'حوّل الكسرين لنفس المقام ثم قارن البسطين.', points:15, tags:['رياضيات','مقارنة كسور'] },
          ],
        },
      ],
    },
  ],
};
