'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen, Plus, Save, Eye, Type, Video, Image,
  Code, Calculator, ChevronDown, ChevronUp, Trash2,
  GripVertical, CheckCircle2, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ContentBlock = { id: string; type: string; title: string; content: string };

const contentTypes = [
  { type: 'TEXT', icon: Type, label: 'نص', color: 'bg-blue-100 text-blue-700' },
  { type: 'VIDEO', icon: Video, label: 'فيديو', color: 'bg-red-100 text-red-700' },
  { type: 'IMAGE', icon: Image, label: 'صورة', color: 'bg-green-100 text-green-700' },
  { type: 'EQUATION', icon: Calculator, label: 'معادلة', color: 'bg-purple-100 text-purple-700' },
  { type: 'CODE', icon: Code, label: 'كود', color: 'bg-gray-100 text-gray-700' },
];

function ContentBlock({ block, onRemove, onChange }: { block: ContentBlock; onRemove: () => void; onChange: (b: ContentBlock) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const typeInfo = contentTypes.find(t => t.type === block.type) || contentTypes[0];

  return (
    <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
      <div className="flex items-center gap-3 p-3 bg-muted/30">
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
          {typeInfo.label}
        </span>
        <input
          value={block.title}
          onChange={e => onChange({ ...block, title: e.target.value })}
          placeholder="عنوان المحتوى (اختياري)"
          className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
        />
        <div className="flex gap-1">
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-muted">
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          <button onClick={onRemove} className="p-1 rounded hover:bg-red-50 text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {!collapsed && (
        <div className="p-3">
          {block.type === 'TEXT' && (
            <textarea
              value={block.content}
              onChange={e => onChange({ ...block, content: e.target.value })}
              placeholder="أدخل المحتوى النصي هنا... (يدعم HTML)"
              className="w-full h-40 bg-muted/30 rounded-lg p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          )}
          {block.type === 'VIDEO' && (
            <input
              value={block.content}
              onChange={e => onChange({ ...block, content: e.target.value })}
              placeholder="رابط الفيديو (YouTube أو Vimeo)"
              className="w-full h-10 bg-muted/30 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          )}
          {block.type === 'EQUATION' && (
            <div className="space-y-2">
              <textarea
                value={block.content}
                onChange={e => onChange({ ...block, content: e.target.value })}
                placeholder="أدخل المعادلة بصيغة LaTeX: x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}"
                className="w-full h-24 bg-muted/30 rounded-lg p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">معاينة (LaTeX):</p>
                <code className="text-sm text-primary font-mono">{block.content || 'أدخل معادلة...'}</code>
              </div>
            </div>
          )}
          {block.type === 'IMAGE' && (
            <div className="space-y-2">
              <input
                value={block.content}
                onChange={e => onChange({ ...block, content: e.target.value })}
                placeholder="رابط الصورة أو ارفع ملفاً"
                className="w-full h-10 bg-muted/30 rounded-lg px-3 text-sm focus:outline-none"
              />
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">اضغط لرفع صورة أو أسقطها هنا</p>
              </div>
            </div>
          )}
          {block.type === 'CODE' && (
            <textarea
              value={block.content}
              onChange={e => onChange({ ...block, content: e.target.value })}
              placeholder="أدخل الكود البرمجي هنا..."
              className="w-full h-32 bg-slate-900 text-green-400 rounded-lg p-3 text-sm font-mono resize-none focus:outline-none"
              dir="ltr"
            />
          )}
        </div>
      )}
    </div>
  );
}

function ExerciseEditor() {
  const [exercises, setExercises] = useState([
    { id: '1', type: 'MULTIPLE_CHOICE', question: '', options: ['', '', '', ''], correct: 0, explanation: '', points: 10 }
  ]);

  return (
    <div className="space-y-4">
      {exercises.map((ex, i) => (
        <div key={ex.id} className="border rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700">اختيار متعدد</Badge>
            <span className="text-sm font-medium">التمرين {i + 1}</span>
            <input type="number" value={ex.points} className="w-16 h-7 text-xs border rounded px-2 mr-auto" placeholder="نقاط" />
          </div>
          <textarea
            value={ex.question}
            onChange={e => { const updated = [...exercises]; updated[i].question = e.target.value; setExercises(updated); }}
            placeholder="نص السؤال"
            className="w-full h-20 bg-muted/30 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">الخيارات:</p>
            {ex.options.map((opt, j) => (
              <div key={j} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${ex.id}`}
                  checked={ex.correct === j}
                  onChange={() => { const updated = [...exercises]; updated[i].correct = j; setExercises(updated); }}
                />
                <input
                  value={opt}
                  onChange={e => { const updated = [...exercises]; updated[i].options[j] = e.target.value; setExercises(updated); }}
                  placeholder={`الخيار ${j + 1} ${ex.correct === j ? '✓ (صحيح)' : ''}`}
                  className={cn('flex-1 h-9 rounded-lg px-3 text-sm border focus:outline-none focus:ring-2 focus:ring-primary/50', ex.correct === j ? 'border-green-300 bg-green-50' : 'bg-muted/30 border-transparent')}
                />
              </div>
            ))}
          </div>
          <textarea
            value={ex.explanation}
            onChange={e => { const updated = [...exercises]; updated[i].explanation = e.target.value; setExercises(updated); }}
            placeholder="شرح الإجابة (يظهر بعد الإجابة الخاطئة)"
            className="w-full h-16 bg-muted/30 rounded-lg p-2 text-sm resize-none focus:outline-none text-muted-foreground"
          />
        </div>
      ))}
      <Button variant="outline" className="w-full" onClick={() => setExercises([...exercises, { id: Date.now().toString(), type: 'MULTIPLE_CHOICE', question: '', options: ['', '', '', ''], correct: 0, explanation: '', points: 10 }])}>
        <Plus className="h-4 w-4 ml-1" />
        إضافة تمرين
      </Button>
    </div>
  );
}

export function ContentEditor() {
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'exercises' | 'summary'>('info');
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [saved, setSaved] = useState(false);

  const addBlock = (type: string) => {
    setBlocks(prev => [...prev, { id: Date.now().toString(), type, title: '', content: '' }]);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'info', label: 'معلومات الدرس', icon: FileText },
    { id: 'content', label: 'المحتوى', icon: BookOpen },
    { id: 'exercises', label: 'التمارين', icon: CheckCircle2 },
    { id: 'summary', label: 'الملخص', icon: Eye },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">محرر المحتوى ✏️</h1>
          <p className="text-muted-foreground">إنشاء وتعديل محتوى الدروس</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Eye className="h-4 w-4" />معاينة</Button>
          <Button onClick={handleSave} className={cn('gap-2', saved && 'bg-green-600 hover:bg-green-700')}>
            {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'تم الحفظ!' : 'حفظ'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b gap-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn('flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Info */}
      {activeTab === 'info' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">معلومات الدرس</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input label="عنوان الدرس (عربي)" placeholder="الأعداد النسبية وغير النسبية" />
              <Input label="عنوان الدرس (إنجليزي)" placeholder="Rational and Irrational Numbers" />
              <div className="space-y-1.5">
                <label className="text-sm font-medium">الوصف</label>
                <textarea placeholder="وصف مختصر للدرس..." className="w-full h-24 border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">الصعوبة</label>
                  <select className="w-full h-10 border rounded-lg px-3 text-sm bg-background focus:outline-none">
                    <option>سهل</option><option>متوسط</option><option>صعب</option>
                  </select>
                </div>
                <Input label="الوقت المتوقع (دقيقة)" type="number" placeholder="45" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isFree" className="rounded" />
                <label htmlFor="isFree" className="text-sm">درس مجاني (للجميع)</label>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">أهداف الدرس</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {['', '', ''].map((_, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                  <input placeholder={`الهدف ${i + 1}`} className="flex-1 h-9 border rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full gap-1">
                <Plus className="h-3 w-3" />إضافة هدف
              </Button>
              <div className="pt-3 border-t">
                <label className="text-sm font-medium block mb-2">ربط بالوحدة</label>
                <select className="w-full h-10 border rounded-lg px-3 text-sm bg-background focus:outline-none">
                  <option>اختر المادة...</option>
                  <option>الرياضيات - الصف العاشر (SA)</option>
                </select>
                <select className="w-full h-10 border rounded-lg px-3 text-sm bg-background focus:outline-none mt-2">
                  <option>اختر الوحدة...</option>
                  <option>الوحدة الأولى: الأعداد الحقيقية</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Content */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground ml-2">أضف محتوى:</span>
            {contentTypes.map(ct => (
              <button key={ct.type} onClick={() => addBlock(ct.type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:shadow-sm ${ct.color}`}>
                <ct.icon className="h-3.5 w-3.5" />
                {ct.label}
              </button>
            ))}
          </div>

          {blocks.length === 0 ? (
            <div className="border-2 border-dashed rounded-2xl p-16 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground font-medium">ابدأ بإضافة محتوى للدرس</p>
              <p className="text-xs text-muted-foreground mt-1">اضغط على نوع المحتوى أعلاه</p>
            </div>
          ) : (
            <div className="space-y-3">
              {blocks.map((block) => (
                <ContentBlock
                  key={block.id}
                  block={block}
                  onRemove={() => setBlocks(prev => prev.filter(b => b.id !== block.id))}
                  onChange={(updated) => setBlocks(prev => prev.map(b => b.id === updated.id ? updated : b))}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Exercises */}
      {activeTab === 'exercises' && (
        <div className="max-w-2xl">
          <ExerciseEditor />
        </div>
      )}

      {/* Tab: Summary */}
      {activeTab === 'summary' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">النقاط الرئيسية</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-2 items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <input placeholder={`نقطة رئيسية ${i}`} className="flex-1 h-9 border rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-1"><Plus className="h-3 w-3" />إضافة نقطة</Button>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">القوانين والمعادلات</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="border rounded-lg p-3 space-y-2">
                  <input placeholder={`اسم القانون ${i}`} className="w-full h-8 border rounded-lg px-2 text-sm bg-background focus:outline-none" />
                  <input placeholder="المعادلة (LaTeX)" className="w-full h-8 border rounded-lg px-2 text-sm font-mono bg-background focus:outline-none" dir="ltr" />
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-1"><Plus className="h-3 w-3" />إضافة قانون</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
