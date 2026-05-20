// محتوى العلوم - الصف السابع (متوسط)
export const scienceContent = {
  subject: {
    nameAr: 'العلوم', nameEn: 'Science',
    description: 'مادة العلوم للمرحلة المتوسطة',
    icon: '🧪', color: '#16a34a',
  },
  units: [
    {
      nameAr: 'الوحدة الأولى: المادة وخصائصها',
      nameEn: 'Unit 1: Matter and Its Properties',
      description: 'دراسة المادة وحالاتها وخصائصها',
      lessons: [
        {
          nameAr: 'حالات المادة الثلاث',
          nameEn: 'Three States of Matter',
          description: 'دراسة الصلب والسائل والغاز وخصائص كل حالة',
          objectives: ['تعريف المادة وحالاتها', 'خصائص المادة الصلبة', 'خصائص السوائل', 'خصائص الغازات', 'التحولات بين الحالات'],
          estimatedTime: 45, difficulty: 'EASY' as const, isFree: true,
          contents: [
            {
              type: 'TEXT' as const, title: 'حالات المادة',
              content: { html: `<h2>المادة وحالاتها</h2><p>المادة هي كل شيء يشغل حيزاً من الفراغ وله كتلة. توجد في ثلاث حالات رئيسية:</p><h3>1. الحالة الصلبة 🧱</h3><ul><li>شكل محدد وحجم ثابت</li><li>جسيماتها قريبة جداً ومرتبة</li><li>لا تتدفق ولا تنضغط</li><li>أمثلة: الحديد، الجليد، الخشب</li></ul><h3>2. الحالة السائلة 💧</h3><ul><li>حجم ثابت لكن شكل متغير</li><li>تأخذ شكل الإناء الذي توضع فيه</li><li>جسيماتها متقاربة لكن تتحرك بحرية</li><li>أمثلة: الماء، الزيت، العصير</li></ul><h3>3. الحالة الغازية 💨</h3><ul><li>شكل وحجم متغيران</li><li>تملأ الإناء بالكامل</li><li>جسيماتها متباعدة وتتحرك بسرعة</li><li>أمثلة: الهواء، البخار، الأكسجين</li></ul>` },
              sortOrder: 1,
            },
            {
              type: 'TEXT' as const, title: 'التحولات بين حالات المادة',
              content: { html: `<h2>التحولات بين الحالات</h2><table border="1" style="border-collapse:collapse;width:100%"><tr><th>التحول</th><th>من</th><th>إلى</th><th>مثال</th></tr><tr><td>الانصهار 🔥</td><td>صلب</td><td>سائل</td><td>ذوبان الجليد</td></tr><tr><td>التجمد ❄️</td><td>سائل</td><td>صلب</td><td>تجمد الماء</td></tr><tr><td>التبخر ♨️</td><td>سائل</td><td>غاز</td><td>تبخر الماء</td></tr><tr><td>التكثف 💧</td><td>غاز</td><td>سائل</td><td>تكثف البخار</td></tr><tr><td>التسامي 🌟</td><td>صلب</td><td>غاز</td><td>اليود، النفثالين</td></tr></table>` },
              sortOrder: 2,
            },
          ],
          summary: {
            keyPoints: ['المادة: كل ما له كتلة ويشغل حيزاً', 'الصلب: شكل وحجم ثابتان', 'السائل: حجم ثابت وشكل متغير', 'الغاز: شكل وحجم متغيران', 'الانصهار: صلب→سائل، التجمد: سائل→صلب، التبخر: سائل→غاز'],
            formulas: [{ name: 'نقطة انصهار الماء', formula: '0 °C = 32 °F' }, { name: 'نقطة غليان الماء', formula: '100 °C = 212 °F' }],
          },
          exercises: [
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'أيّ من التالي صحيح عن السوائل؟', options: [{id:'a',text:'لها شكل وحجم ثابتان'},{id:'b',text:'لها حجم ثابت وشكل متغير'},{id:'c',text:'لها شكل وحجم متغيران'},{id:'d',text:'لا يمكن ضغطها أو تمديدها'}], correctAnswer:{id:'b'}, explanation:'السوائل لها حجم ثابت لكنها تأخذ شكل الإناء الذي توضع فيه.', hint:'فكر في الماء — هل يغير حجمه عندما تصبّه في كوب؟', points:10, tags:['علوم','مادة','سوائل'] },
            { type: 'MATCHING' as const, difficulty: 'MEDIUM' as const, questionAr: 'وصّل كل تحول بحالتيه:', options: [{left:'الانصهار',right:'صلب إلى سائل'},{left:'التبخر',right:'سائل إلى غاز'},{left:'التكثف',right:'غاز إلى سائل'},{left:'التجمد',right:'سائل إلى صلب'}], correctAnswer:{pairs:{'الانصهار':'صلب إلى سائل','التبخر':'سائل إلى غاز','التكثف':'غاز إلى سائل','التجمد':'سائل إلى صلب'}}, explanation:'كل تحول له اتجاه محدد بين حالات المادة.', points:20, tags:['علوم','تحولات'] },
            { type: 'TRUE_FALSE' as const, difficulty: 'EASY' as const, questionAr: 'الغازات تملأ الإناء بالكامل بغض النظر عن حجمه.', correctAnswer:{value:true}, explanation:'نعم، الغازات تتمدد لتملأ أي حاوية بالكامل لأن جسيماتها متباعدة وتتحرك بسرعة عشوائية.', points:10, tags:['علوم','غازات'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'MEDIUM' as const, questionAr: 'ما التغير الذي يحدث عندما يتحول اليود من صلب إلى غاز مباشرةً؟', options: [{id:'a',text:'الانصهار'},{id:'b',text:'التبخر'},{id:'c',text:'التسامي'},{id:'d',text:'التكثف'}], correctAnswer:{id:'c'}, explanation:'التسامي هو التحول من الحالة الصلبة إلى الغازية مباشرة دون المرور بالحالة السائلة.', hint:'هناك تحول خاص يتخطى فيه الصلب مرحلة السائل.', points:15, tags:['علوم','تسامي'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'HARD' as const, questionAr: 'لماذا تتمدد الغازات لتملأ الحاوية بالكامل؟', options: [{id:'a',text:'لأن جسيماتها ثقيلة'},{id:'b',text:'لأن جسيماتها متباعدة وتتحرك بحرية'},{id:'c',text:'لأنها لا تخضع للجاذبية'},{id:'d',text:'لأن درجة حرارتها عالية دائماً'}], correctAnswer:{id:'b'}, explanation:'جسيمات الغازات متباعدة جداً وتتحرك بشكل عشوائي وبسرعة كبيرة، مما يجعلها تملأ أي فراغ متاح.', hint:'فكر في بنية الجسيمات في الغاز مقارنة بالصلب.', points:15, tags:['علوم','غازات','جسيمات'] },
          ],
        },
        {
          nameAr: 'الخصائص الفيزيائية والكيميائية',
          nameEn: 'Physical and Chemical Properties',
          description: 'التمييز بين الخصائص الفيزيائية والكيميائية للمواد',
          objectives: ['تعريف الخاصية الفيزيائية', 'أمثلة على الخصائص الفيزيائية', 'تعريف الخاصية الكيميائية', 'التمييز بين التغير الفيزيائي والكيميائي'],
          estimatedTime: 40, difficulty: 'MEDIUM' as const, isFree: false,
          contents: [
            {
              type: 'TEXT' as const, title: 'الخصائص الفيزيائية والكيميائية',
              content: { html: `<h2>الخصائص الفيزيائية</h2><p>هي الخصائص التي يمكن قياسها أو ملاحظتها دون تغيير تركيب المادة.</p><h3>أمثلة:</h3><ul><li>اللون، الشكل، الحجم</li><li>الكتلة، الكثافة</li><li>نقطة الانصهار والغليان</li><li>الصلابة، الليونة، الموصلية</li></ul><h2>الخصائص الكيميائية</h2><p>هي قدرة المادة على التفاعل مع مواد أخرى لتكوين مواد جديدة.</p><h3>أمثلة:</h3><ul><li>قابلية الاشتعال (قدرة المادة على الاحتراق)</li><li>قابلية الصدأ (تفاعل الحديد مع الأكسجين)</li><li>قابلية التفاعل مع الأحماض</li></ul>` },
              sortOrder: 1,
            },
          ],
          summary: {
            keyPoints: ['الخاصية الفيزيائية: تُقاس دون تغيير المادة', 'الخاصية الكيميائية: تُظهر كيف تتفاعل المادة', 'التغير الفيزيائي: لا تكوين مادة جديدة (قطع الورق)', 'التغير الكيميائي: تكوين مادة جديدة (احتراق الخشب)'],
            formulas: null,
          },
          exercises: [
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'أيّ من التالي خاصية فيزيائية؟', options: [{id:'a',text:'قابلية الاشتعال'},{id:'b',text:'قابلية التفاعل مع الحمض'},{id:'c',text:'الكثافة'},{id:'d',text:'قابلية الصدأ'}], correctAnswer:{id:'c'}, explanation:'الكثافة خاصية فيزيائية لأنها تُقاس دون تغيير تركيب المادة.', hint:'الخاصية الفيزيائية لا تغير المادة نفسها.', points:10, tags:['علوم','خصائص'] },
            { type: 'TRUE_FALSE' as const, difficulty: 'MEDIUM' as const, questionAr: 'احتراق الخشب تغيير فيزيائي لأن الخشب يتغير شكله فقط.', correctAnswer:{value:false}, explanation:'احتراق الخشب تغيير كيميائي لأنه ينتج مواداً جديدة (رماد، ثاني أكسيد الكربون، ماء).', points:10, tags:['علوم','تغير كيميائي'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'MEDIUM' as const, questionAr: 'أيّ من التالي مثال على تغيير فيزيائي؟', options: [{id:'a',text:'صدأ الحديد'},{id:'b',text:'احتراق الورق'},{id:'c',text:'تقطيع التفاح'},{id:'d',text:'تعفن الطعام'}], correctAnswer:{id:'c'}, explanation:'تقطيع التفاح تغيير فيزيائي فقط يغير الشكل دون تكوين مادة جديدة.', hint:'هل ينتج عن العملية مادة جديدة؟', points:15, tags:['علوم','تغير فيزيائي'] },
          ],
        },
        {
          nameAr: 'الخلية: وحدة الحياة',
          nameEn: 'The Cell: Unit of Life',
          description: 'دراسة الخلية ومكوناتها ووظائفها',
          objectives: ['تعريف الخلية', 'مكونات الخلية الحيوانية والنباتية', 'الفرق بين الخلية النباتية والحيوانية', 'وظائف العضيات الخلوية'],
          estimatedTime: 55, difficulty: 'MEDIUM' as const, isFree: false,
          contents: [
            {
              type: 'TEXT' as const, title: 'الخلية',
              content: { html: `<h2>الخلية وحدة الحياة</h2><p>الخلية هي أصغر وحدة حية قادرة على تأدية جميع وظائف الحياة الأساسية.</p><h2>مكونات الخلية</h2><h3>مكونات مشتركة (حيوانية ونباتية):</h3><ul><li><strong>غشاء الخلية:</strong> يتحكم فيما يدخل ويخرج من الخلية</li><li><strong>السيتوبلازم:</strong> مادة هلامية تعلّق العضيات</li><li><strong>النواة:</strong> مركز التحكم، تحتوي على DNA</li><li><strong>الميتوكوندريا:</strong> محطة طاقة الخلية</li><li><strong>الريبوسومات:</strong> تُصنّع البروتينات</li></ul><h3>مكونات خاصة بالخلية النباتية فقط:</h3><ul><li><strong>جدار الخلية:</strong> يعطيها شكلاً محدداً ودعماً</li><li><strong>البلاستيدات الخضراء:</strong> تحتوي الكلوروفيل للبناء الضوئي</li><li><strong>الفجوة العصارية الكبيرة:</strong> تخزن الماء والمواد الغذائية</li></ul>` },
              sortOrder: 1,
            },
          ],
          summary: {
            keyPoints: ['الخلية: أصغر وحدة حية', 'النواة: مركز تحكم تحتوي DNA', 'الميتوكوندريا: محطة الطاقة', 'الخلية النباتية تمتلك: جدار خلوي، بلاستيدات خضراء، فجوة كبيرة', 'الخلية الحيوانية تفتقر لجدار الخلية والبلاستيدات'],
            formulas: null,
          },
          exercises: [
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'ما وظيفة الميتوكوندريا في الخلية؟', options: [{id:'a',text:'تصنيع البروتينات'},{id:'b',text:'إنتاج الطاقة'},{id:'c',text:'التحكم في دخول المواد'},{id:'d',text:'تخزين المعلومات الوراثية'}], correctAnswer:{id:'b'}, explanation:'الميتوكوندريا تُنتج الطاقة اللازمة لنشاط الخلية من خلال التنفس الخلوي.', hint:'تُعرف الميتوكوندريا بـ"محطة طاقة الخلية".', points:10, tags:['علوم','خلية'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'MEDIUM' as const, questionAr: 'ما الذي يُميّز الخلية النباتية عن الحيوانية؟', options: [{id:'a',text:'وجود النواة'},{id:'b',text:'وجود الغشاء الخلوي'},{id:'c',text:'وجود جدار الخلية والبلاستيدات الخضراء'},{id:'d',text:'وجود الريبوسومات'}], correctAnswer:{id:'c'}, explanation:'الخلية النباتية تتميز بجدار الخلية والبلاستيدات الخضراء والفجوة الكبيرة، وكلها غائبة في الخلية الحيوانية.', hint:'فكر فيما يجعل النبات أخضر ويعطيه صلابة.', points:15, tags:['علوم','خلية نباتية'] },
            { type: 'TRUE_FALSE' as const, difficulty: 'EASY' as const, questionAr: 'النواة هي مركز التحكم في الخلية وتحتوي على المادة الوراثية DNA.', correctAnswer:{value:true}, explanation:'نعم، النواة تحتوي على DNA الذي يحمل المعلومات الوراثية ويتحكم في جميع وظائف الخلية.', points:10, tags:['علوم','نواة'] },
          ],
        },
      ],
    },
    {
      nameAr: 'الوحدة الثانية: القوى والحركة',
      nameEn: 'Unit 2: Forces and Motion',
      description: 'فهم القوى الأساسية وقوانين الحركة',
      lessons: [
        {
          nameAr: 'القوة والحركة',
          nameEn: 'Force and Motion',
          description: 'تعريف القوة وأنواعها وتأثيرها على الأجسام',
          objectives: ['تعريف القوة ووحدة قياسها', 'الفرق بين القوى التلامسية وغير التلامسية', 'قوانين نيوتن للحركة', 'التوازن والقوى المتوازنة'],
          estimatedTime: 60, difficulty: 'MEDIUM' as const, isFree: true,
          contents: [
            {
              type: 'TEXT' as const, title: 'القوة والحركة',
              content: { html: `<h2>القوة</h2><p>القوة هي تأثير يُحدث تغييراً في حركة الجسم أو شكله. وحدة قياسها <strong>النيوتن (N)</strong>.</p><h2>أنواع القوى</h2><h3>القوى التلامسية (تحتاج تلامساً):</h3><ul><li>قوة الدفع والسحب</li><li>قوة الاحتكاك</li><li>قوة الشد (في الحبال)</li></ul><h3>القوى غير التلامسية (لا تحتاج تلامساً):</h3><ul><li>الجاذبية</li><li>القوة المغناطيسية</li><li>القوة الكهربائية</li></ul><h2>قوانين نيوتن للحركة</h2><h3>القانون الأول (قانون القصور الذاتي):</h3><p>الجسم الساكن يبقى ساكناً، والجسم المتحرك يبقى متحركاً، ما لم تؤثر عليه قوة خارجية.</p><h3>القانون الثاني:</h3><p>القوة = الكتلة × التسارع (F = ma)</p>` },
              sortOrder: 1,
            },
            {
              type: 'EQUATION' as const, title: 'قانون نيوتن الثاني',
              content: { latex: 'F = m \\times a', description: 'القوة = الكتلة × التسارع (F بالنيوتن، m بالكيلوغرام، a بالمتر/ثانية²)' },
              sortOrder: 2,
            },
          ],
          summary: {
            keyPoints: ['القوة تُقاس بالنيوتن (N)', 'القوى التلامسية تحتاج تماساً جسدياً', 'قانون نيوتن الأول: القصور الذاتي', 'قانون نيوتن الثاني: F = ma', 'الجاذبية قوة غير تلامسية تعمل عن بُعد'],
            formulas: [{ name: 'قانون نيوتن الثاني', formula: 'F = m × a' }, { name: 'الوزن', formula: 'W = m × g (g = 9.8 m/s²)' }],
          },
          exercises: [
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'ما وحدة قياس القوة؟', options: [{id:'a',text:'كيلوغرام'},{id:'b',text:'متر'},{id:'c',text:'نيوتن'},{id:'d',text:'جول'}], correctAnswer:{id:'c'}, explanation:'وحدة قياس القوة في النظام الدولي هي النيوتن (N)، نسبةً لإسحاق نيوتن.', hint:'سُمّيت وحدة القوة باسم عالم فيزياء شهير.', points:10, tags:['علوم','قوة'] },
            { type: 'FILL_BLANK' as const, difficulty: 'MEDIUM' as const, questionAr: 'وفق قانون نيوتن الثاني: القوة = الكتلة × ___', correctAnswer:{answers:['التسارع','العجلة']}, explanation:'F = m × a حيث F القوة بالنيوتن، m الكتلة بالكيلوغرام، a التسارع بالمتر/ثانية².', points:10, tags:['علوم','نيوتن'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'MEDIUM' as const, questionAr: 'جسم كتلته 5 كغ يتسارع بمعدل 3 م/ث². ما القوة المؤثرة عليه؟', options: [{id:'a',text:'2 نيوتن'},{id:'b',text:'8 نيوتن'},{id:'c',text:'15 نيوتن'},{id:'d',text:'1.67 نيوتن'}], correctAnswer:{id:'c'}, explanation:'F = m × a = 5 × 3 = 15 نيوتن', hint:'طبّق قانون نيوتن الثاني: F = m × a', points:15, tags:['علوم','نيوتن','حساب'] },
            { type: 'MULTIPLE_CHOICE' as const, difficulty: 'EASY' as const, questionAr: 'أيّ من التالي مثال على قوة غير تلامسية؟', options: [{id:'a',text:'دفع عربة التسوق'},{id:'b',text:'الاحتكاك'},{id:'c',text:'الجاذبية الأرضية'},{id:'d',text:'شد حبل'}], correctAnswer:{id:'c'}, explanation:'الجاذبية الأرضية تعمل عن بُعد دون حاجة لتلامس مباشر.', hint:'القوة غير التلامسية لا تحتاج إلى لمس الجسم.', points:10, tags:['علوم','قوى'] },
          ],
        },
      ],
    },
  ],
};
