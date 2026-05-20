// محتوى الحاسب الآلي - الصف التاسع
export const computerContent = {
  subject: { nameAr: 'الحاسب وتقنية المعلومات', nameEn: 'Computer Science', description: 'الحاسب والبرمجة وتقنية المعلومات', icon: '💻', color: '#4f46e5' },
  units: [
    {
      nameAr: 'الوحدة الأولى: أساسيات الحاسب',
      nameEn: 'Unit 1: Computer Fundamentals',
      description: 'مكونات الحاسب وطريقة عمله',
      lessons: [
        {
          nameAr: 'مكونات الحاسب الآلي',
          nameEn: 'Computer Components',
          description: 'المكونات المادية والبرمجية للحاسب وطريقة تفاعلها',
          objectives: ['التمييز بين Hardware و Software', 'مكونات وحدة المعالجة المركزية', 'أنواع الذاكرة', 'وحدات الإدخال والإخراج'],
          estimatedTime: 45, difficulty: 'EASY' as const, isFree: true,
          contents: [
            { type: 'TEXT' as const, title: 'مكونات الحاسب',
              content: { html: `<h2>مكونات الحاسب الآلي</h2><p>يتكون الحاسب من مكونَين رئيسيَّين:</p><h2>1. المكونات المادية (Hardware) 🖥️</h2><h3>وحدة المعالجة المركزية (CPU)</h3><ul><li><strong>وحدة الحساب والمنطق (ALU):</strong> تُنفّذ العمليات الحسابية والمنطقية</li><li><strong>وحدة التحكم (CU):</strong> تُنسّق العمليات وتتحكم في تدفق البيانات</li><li><strong>المسجّلات (Registers):</strong> ذاكرة مؤقتة سريعة جداً داخل المعالج</li></ul><h3>الذاكرة</h3><table border="1" style="border-collapse:collapse;width:100%"><tr><th>النوع</th><th>السرعة</th><th>السعة</th><th>الديمومة</th></tr><tr><td>RAM (ذاكرة الوصول العشوائي)</td><td>عالية</td><td>متوسطة</td><td>مؤقتة</td></tr><tr><td>ROM (ذاكرة القراءة فقط)</td><td>متوسطة</td><td>صغيرة</td><td>دائمة</td></tr><tr><td>القرص الصلب (HDD/SSD)</td><td>منخفضة</td><td>كبيرة</td><td>دائمة</td></tr></table><h3>وحدات الإدخال والإخراج</h3><ul><li><strong>إدخال:</strong> لوحة المفاتيح، الفأرة، الكاميرا، الميكروفون</li><li><strong>إخراج:</strong> الشاشة، الطابعة، السماعات</li></ul><h2>2. البرمجيات (Software) 💾</h2><ul><li><strong>نظام التشغيل:</strong> Windows, macOS, Linux, Android</li><li><strong>التطبيقات:</strong> برامج المستخدم (Word, Chrome, ...)</li></ul>` },
              sortOrder: 1 },
          ],
          summary: {
            keyPoints: ['Hardware: المكونات المادية (CPU, RAM, HDD)', 'Software: البرامج (نظام التشغيل، التطبيقات)', 'CPU = ALU + CU + Registers', 'RAM: مؤقتة وسريعة | ROM: دائمة للبيانات الأساسية'],
            formulas: null,
          },
          exercises: [
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'ما الفرق بين RAM و ROM؟', options: [{id:'a',text:'RAM أبطأ من ROM'},{id:'b',text:'RAM مؤقتة وROM دائمة'},{id:'c',text:'ROM للبرامج وRAM للنظام'},{id:'d',text:'لا فرق بينهما'}], correctAnswer:{id:'b'}, explanation:'RAM (Random Access Memory) مؤقتة تُمحى عند إيقاف الجهاز، أما ROM فدائمة لا تُمحى.', hint:'ما الذي يحدث لبيانات RAM عند إطفاء الحاسب؟', points:10, tags:['حاسب','ذاكرة'] },
            { type: 'MATCHING' as const, difficulty: 'MEDIUM' as const, questionAr: 'وصّل كل مكوّن بوظيفته:', options: [{left:'CPU',right:'يعالج البيانات ويُنفّذ التعليمات'},{left:'RAM',right:'تخزين مؤقت للبيانات قيد المعالجة'},{left:'لوحة المفاتيح',right:'وحدة إدخال'},{left:'الطابعة',right:'وحدة إخراج'}], correctAnswer:{pairs:{'CPU':'يعالج البيانات ويُنفّذ التعليمات','RAM':'تخزين مؤقت للبيانات قيد المعالجة','لوحة المفاتيح':'وحدة إدخال','الطابعة':'وحدة إخراج'}}, explanation:'كل مكوّن من مكونات الحاسب له وظيفة محددة.', points:20, tags:['حاسب','مكونات'] },
            { type: 'TRUE_FALSE' as const, difficulty: 'EASY' as const, questionAr: 'تُعدّ الطابعة من وحدات الإدخال.', correctAnswer:{value:false}, explanation:'الطابعة وحدة إخراج لأنها تنقل البيانات من الحاسب إلى العالم الخارجي (الورق).', points:10, tags:['حاسب','إدخال وإخراج'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'MEDIUM' as const, questionAr: 'ما وظيفة وحدة الحساب والمنطق (ALU)؟', options: [{id:'a',text:'تخزين البيانات بشكل دائم'},{id:'b',text:'التحكم في تدفق البيانات'},{id:'c',text:'تنفيذ العمليات الحسابية والمقارنات المنطقية'},{id:'d',text:'التواصل مع وحدات الإدخال والإخراج'}], correctAnswer:{id:'c'}, explanation:'ALU تُنفّذ العمليات الحسابية (+,-,×,÷) والعمليات المنطقية (AND, OR, NOT, مقارنات).', hint:'ALU = Arithmetic Logic Unit (وحدة الحساب والمنطق)', points:15, tags:['حاسب','CPU','ALU'] },
          ],
        },
        {
          nameAr: 'نظم الأعداد والترميز',
          nameEn: 'Number Systems and Encoding',
          description: 'النظام الثنائي والست عشري وترميز البيانات',
          objectives: ['النظام الثنائي (Binary)', 'التحويل بين الأنظمة', 'ترميز ASCII', 'تمثيل البيانات في الحاسب'],
          estimatedTime: 60, difficulty: 'HARD' as const, isFree: false,
          contents: [
            { type: 'TEXT' as const, title: 'نظم الأعداد',
              content: { html: `<h2>لماذا النظام الثنائي؟</h2><p>الحاسب يعمل بالكهرباء: إما تيار (1) أو لا تيار (0). لذا يُمثّل جميع البيانات بـ 0 و 1.</p><h2>النظام العشري (الأساس 10)</h2><p>نستخدمه يومياً: الأرقام 0-9</p><p>مثال: 425 = 4×100 + 2×10 + 5×1</p><h2>النظام الثنائي (الأساس 2)</h2><p>أرقامه: 0 و 1 فقط</p><p>مثال: 1011₂ = 1×8 + 0×4 + 1×2 + 1×1 = 11₁₀</p><h2>التحويل: عشري → ثنائي</h2><p>نقسم العدد على 2 ونأخذ البواقي من الأسفل للأعلى.</p><h3>مثال: تحويل 13 إلى ثنائي</h3><ul><li>13 ÷ 2 = 6 باقي 1</li><li>6 ÷ 2 = 3 باقي 0</li><li>3 ÷ 2 = 1 باقي 1</li><li>1 ÷ 2 = 0 باقي 1</li><li>النتيجة (من الأسفل للأعلى): <strong>1101₂</strong></li></ul>` },
              sortOrder: 1 },
            { type: 'TEXT' as const, title: 'الوحدات والترميز',
              content: { html: `<h2>وحدات تخزين البيانات</h2><table border="1" style="border-collapse:collapse;width:100%"><tr><th>الوحدة</th><th>المعادل</th></tr><tr><td>البت (Bit)</td><td>0 أو 1</td></tr><tr><td>البايت (Byte)</td><td>8 بتات</td></tr><tr><td>الكيلوبايت (KB)</td><td>1024 بايت</td></tr><tr><td>الميغابايت (MB)</td><td>1024 كيلوبايت</td></tr><tr><td>الغيغابايت (GB)</td><td>1024 ميغابايت</td></tr></table><h2>ترميز ASCII</h2><p>ASCII يُمثّل الأحرف الإنجليزية والرموز بأعداد ثنائية. مثلاً: A=65, a=97, 0=48</p>` },
              sortOrder: 2 },
          ],
          summary: {
            keyPoints: ['الحاسب يستخدم النظام الثنائي (0 و 1)', 'البايت = 8 بتات، KB=1024B, MB=1024KB, GB=1024MB', 'لتحويل عشري→ثنائي: اقسم على 2 وخذ البواقي', 'ترميز ASCII: A=65, a=97'],
            formulas: [{ name: 'تحويل ثنائي→عشري', formula: '1011₂ = 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 11₁₀' }],
          },
          exercises: [
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'MEDIUM' as const, questionAr: 'ما القيمة العشرية للعدد الثنائي 1010؟', options: [{id:'a',text:'8'},{id:'b',text:'10'},{id:'c',text:'12'},{id:'d',text:'6'}], correctAnswer:{id:'b'}, explanation:'1010₂ = 1×8 + 0×4 + 1×2 + 0×1 = 8+0+2+0 = 10₁₀', hint:'احسب قيمة كل خانة: 8+0+2+0', points:15, tags:['حاسب','ثنائي'] },
            { type: 'FILL_BLANK' as const, difficulty: 'MEDIUM' as const, questionAr: 'البايت الواحد يساوي ___ بت', correctAnswer:{answers:['8','٨']}, explanation:'البايت = 8 بتات. هذه وحدة البيانات الأساسية في الحاسب.', points:10, tags:['حاسب','وحدات'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'أيّ النظامين يستخدمهما الحاسب داخلياً؟', options: [{id:'a',text:'العشري والست عشري'},{id:'b',text:'الثنائي فقط'},{id:'c',text:'العشري فقط'},{id:'d',text:'الثنائي والثماني'}], correctAnswer:{id:'b'}, explanation:'الحاسب يعمل داخلياً بالنظام الثنائي فقط (0 و 1) لأنه يعتمد على الإشارات الكهربائية.', points:10, tags:['حاسب','نظام ثنائي'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'HARD' as const, questionAr: 'ما التمثيل الثنائي للعدد العشري 25؟', options: [{id:'a',text:'11001'},{id:'b',text:'10101'},{id:'c',text:'11010'},{id:'d',text:'10011'}], correctAnswer:{id:'a'}, explanation:'25÷2=12 ب1، 12÷2=6 ب0، 6÷2=3 ب0، 3÷2=1 ب1، 1÷2=0 ب1 → 11001₂ = 16+8+0+0+1=25 ✓', hint:'اقسم 25 على 2 مرات متتالية واجمع البواقي من الأسفل للأعلى.', points:20, tags:['حاسب','تحويل'] },
          ],
        },
      ],
    },
    {
      nameAr: 'الوحدة الثانية: مقدمة في البرمجة',
      nameEn: 'Unit 2: Introduction to Programming',
      description: 'أساسيات البرمجة والتفكير الخوارزمي',
      lessons: [
        {
          nameAr: 'الخوارزميات والمخططات الانسيابية',
          nameEn: 'Algorithms and Flowcharts',
          description: 'تعلم كتابة الخوارزميات ورسم المخططات الانسيابية',
          objectives: ['تعريف الخوارزمية وخصائصها', 'كتابة خوارزمية بلغة طبيعية', 'رموز المخطط الانسيابي', 'حل مسائل بالخوارزميات'],
          estimatedTime: 55, difficulty: 'MEDIUM' as const, isFree: true,
          contents: [
            { type: 'TEXT' as const, title: 'الخوارزميات',
              content: { html: `<h2>ما هي الخوارزمية؟</h2><p>الخوارزمية هي مجموعة من الخطوات المتسلسلة المحددة التي تحل مسألة معينة.</p><h3>خصائص الخوارزمية الجيدة:</h3><ul><li><strong>المدخلات:</strong> لها مدخلات واضحة</li><li><strong>المخرجات:</strong> تُنتج نتيجة محددة</li><li><strong>الوضوح:</strong> كل خطوة واضحة لا غموض فيها</li><li><strong>التناهي:</strong> تنتهي بعد عدد محدود من الخطوات</li><li><strong>الفعالية:</strong> تُنجز المهمة بكفاءة</li></ul><h2>مثال: خوارزمية إيجاد أكبر عددين</h2><ol><li>ابدأ</li><li>أدخل العددين A و B</li><li>إذا كان A > B فإن الأكبر = A، وإلا الأكبر = B</li><li>اطبع الأكبر</li><li>انتهِ</li></ol><h2>رموز المخطط الانسيابي</h2><ul><li>🔷 معين: قرار (نعم/لا)</li><li>🔲 مستطيل: عملية/معالجة</li><li>💠 شبه منحرف: إدخال/إخراج</li><li>⭕ دائرة/بيضاوي: بداية/نهاية</li></ul>` },
              sortOrder: 1 },
            { type: 'CODE' as const, title: 'مثال: خوارزمية بلغة Python',
              content: { code: `# إيجاد أكبر عددين
a = int(input("أدخل العدد الأول: "))
b = int(input("أدخل العدد الثاني: "))

if a > b:
    print("الأكبر هو:", a)
else:
    print("الأكبر هو:", b)`, language: 'python' },
              sortOrder: 2 },
          ],
          summary: {
            keyPoints: ['الخوارزمية: خطوات منطقية لحل مسألة', 'خصائصها: مدخلات، مخرجات، وضوح، تناهٍ، فعالية', 'المخطط الانسيابي: تمثيل بصري للخوارزمية', 'رموز المخطط: بيضاوي(بداية/نهاية)، مستطيل(عملية)، معين(قرار)'],
            formulas: null,
          },
          exercises: [
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'ما الرمز المستخدم في المخطط الانسيابي للتعبير عن القرار (نعم/لا)؟', options: [{id:'a',text:'المستطيل'},{id:'b',text:'البيضاوي'},{id:'c',text:'المعين'},{id:'d',text:'المثلث'}], correctAnswer:{id:'c'}, explanation:'شكل المعين (◇) يُستخدم للتعبير عن خطوات القرار في المخطط الانسيابي.', hint:'فكر في شكل "علامة الاستفهام" البصرية.', points:10, tags:['حاسب','خوارزمية'] },
            { type: 'ORDERING' as const, difficulty: 'MEDIUM' as const, questionAr: 'رتّب خطوات إيجاد مجموع عددين بالترتيب الصحيح:', options: [{id:'1',text:'اطبع النتيجة'},{id:'2',text:'احسب المجموع = A + B'},{id:'3',text:'أدخل العددين A و B'},{id:'4',text:'ابدأ'},{id:'5',text:'انتهِ'}], correctAnswer:{correctOrder:['4','3','2','1','5']}, explanation:'الترتيب الصحيح: ابدأ ← أدخل ← احسب ← اطبع ← انتهِ', points:20, tags:['حاسب','خوارزمية','ترتيب'] },
            { type: 'TRUE_FALSE' as const, difficulty: 'EASY' as const, questionAr: 'يجب أن تنتهي الخوارزمية الجيدة بعد عدد محدود من الخطوات.', correctAnswer:{value:true}, explanation:'نعم، من شروط الخوارزمية الجيدة أن تكون متناهية (Finite) أي تنتهي بعد عدد محدود من الخطوات.', points:10, tags:['حاسب','خوارزمية'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'HARD' as const, questionAr: 'خوارزمية تحسب مجموع الأعداد من 1 إلى 100. كم مرة ستتكرر حلقة التكرار؟', options: [{id:'a',text:'99'},{id:'b',text:'100'},{id:'c',text:'101'},{id:'d',text:'50'}], correctAnswer:{id:'b'}, explanation:'نكرر الإضافة من 1 إلى 100، أي 100 تكرار.', hint:'كم عدد الأعداد من 1 إلى 100 شاملاً الطرفين؟', points:15, tags:['حاسب','تكرار'] },
          ],
        },
        {
          nameAr: 'مقدمة في لغة Python',
          nameEn: 'Introduction to Python',
          description: 'تعلم أساسيات البرمجة بلغة Python',
          objectives: ['المتغيرات وأنواع البيانات', 'عمليات الإدخال والإخراج', 'الجمل الشرطية if/else', 'حلقة التكرار for/while'],
          estimatedTime: 70, difficulty: 'HARD' as const, isFree: false,
          contents: [
            { type: 'TEXT' as const, title: 'أساسيات Python',
              content: { html: `<h2>لماذا Python؟</h2><ul><li>سهلة القراءة والتعلم</li><li>تُستخدم في الذكاء الاصطناعي وتحليل البيانات والتطبيقات</li><li>مجتمع ضخم ومكتبات غنية</li></ul><h2>أنواع البيانات الأساسية</h2><ul><li><code>int</code>: أعداد صحيحة مثل 5, -3, 100</li><li><code>float</code>: أعداد عشرية مثل 3.14, -2.5</li><li><code>str</code>: نصوص مثل "مرحبا", 'Hello'</li><li><code>bool</code>: منطقي True أو False</li></ul>` },
              sortOrder: 1 },
            { type: 'CODE' as const, title: 'أمثلة Python',
              content: { code: `# المتغيرات
name = "أحمد"          # نص
age = 16               # عدد صحيح
gpa = 95.5             # عشري
is_student = True      # منطقي

# الإدخال والإخراج
name = input("أدخل اسمك: ")
print("مرحباً", name)

# الشرط
grade = 85
if grade >= 90:
    print("ممتاز")
elif grade >= 75:
    print("جيد جداً")
else:
    print("جيد")

# حلقة for
for i in range(1, 6):
    print(i)   # يطبع 1 2 3 4 5

# حلقة while
count = 0
while count < 3:
    print("عدد:", count)
    count += 1`, language: 'python' },
              sortOrder: 2 },
          ],
          summary: {
            keyPoints: ['المتغير: حاوية لتخزين قيمة', 'int=صحيح، float=عشري، str=نص، bool=منطقي', 'if/elif/else للشروط', 'for للتكرار المحدد، while للتكرار بشرط'],
            formulas: [{ name: 'print', formula: 'print("النص", variable)' }, { name: 'input', formula: 'variable = input("رسالة: ")' }],
          },
          exercises: [
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'ما نوع البيانات في Python للعدد 3.14؟', options: [{id:'a',text:'int'},{id:'b',text:'str'},{id:'c',text:'float'},{id:'d',text:'bool'}], correctAnswer:{id:'c'}, explanation:'3.14 عدد عشري، نوعه float في Python.', hint:'الأعداد العشرية في Python نوعها float.', points:10, tags:['حاسب','Python','أنواع بيانات'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'MEDIUM' as const, questionAr: 'ما مخرجات الكود التالي؟\nfor i in range(3):\n    print(i)', options: [{id:'a',text:'1 2 3'},{id:'b',text:'0 1 2'},{id:'c',text:'0 1 2 3'},{id:'d',text:'1 2'}], correctAnswer:{id:'b'}, explanation:'range(3) تُنتج: 0, 1, 2 (تبدأ من 0 وتنتهي قبل 3)', hint:'range(n) تبدأ من 0 وتنتهي عند n-1', points:15, tags:['حاسب','Python','حلقات'] },
            { type: 'FILL_BLANK' as const, difficulty: 'MEDIUM' as const, questionAr: 'لطباعة "مرحبا" في Python نكتب: ___(\"مرحبا\")', correctAnswer:{answers:['print','Print']}, explanation:'دالة print() تُستخدم لطباعة القيم في Python.', points:10, tags:['حاسب','Python'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'HARD' as const, questionAr: 'ما مخرجات هذا الكود؟\nx = 10\nif x > 5:\n    print("A")\nelif x > 8:\n    print("B")\nelse:\n    print("C")', options: [{id:'a',text:'A'},{id:'b',text:'B'},{id:'c',text:'A و B'},{id:'d',text:'C'}], correctAnswer:{id:'a'}, explanation:'الشرط الأول (x>5) صحيح (10>5) فيطبع "A" وينتهي. لا يُفحص elif لأن الأول تحقق.', hint:'Python تتوقف عند أول شرط صحيح وتتجاهل الباقي.', points:15, tags:['حاسب','Python','شروط'] },
          ],
        },
      ],
    },
  ],
};
