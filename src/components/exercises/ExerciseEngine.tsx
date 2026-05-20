'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { submitExerciseAttempt } from '@/actions/lesson.actions';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import {
  CheckCircle2, XCircle, Lightbulb, ChevronLeft,
  ChevronRight, Trophy, Clock, Star, Zap
} from 'lucide-react';

type Exercise = {
  id: string; type: string; difficulty: string;
  questionAr: string; options?: any[]; correctAnswer: any;
  explanation?: string | null; hint?: string | null; points: number;
};

// ===== أنواع التمارين =====
function MultipleChoice({ exercise, onAnswer, disabled }: {
  exercise: Exercise; onAnswer: (answer: any) => void; disabled: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const options = exercise.options || [];

  return (
    <div className="space-y-3">
      {options.map((opt: any) => (
        <button key={opt.id} disabled={disabled}
          onClick={() => { if (!disabled) { setSelected(opt.id); onAnswer({ id: opt.id }); } }}
          className={cn(
            'w-full p-4 rounded-xl border-2 text-right transition-all duration-200 flex items-center gap-3',
            disabled && selected === opt.id ? 'cursor-not-allowed' : !disabled && 'hover:border-primary/50 hover:bg-primary/5',
            selected === opt.id ? 'border-primary bg-primary/10 shadow-sm' : 'border-border',
          )}>
          <div className={cn('h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
            selected === opt.id ? 'border-primary bg-primary text-white' : 'border-muted-foreground/40')}>
            {opt.id.toUpperCase()}
          </div>
          <span className="text-sm font-medium">{opt.text}</span>
          {opt.image && <img src={opt.image} alt="" className="h-10 rounded mr-auto" />}
        </button>
      ))}
    </div>
  );
}

function TrueFalse({ exercise, onAnswer, disabled }: {
  exercise: Exercise; onAnswer: (answer: any) => void; disabled: boolean;
}) {
  const [selected, setSelected] = useState<boolean | null>(null);
  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        { value: true, label: '✅ صحيح', color: 'hover:border-green-400 hover:bg-green-50', activeColor: 'border-green-500 bg-green-50' },
        { value: false, label: '❌ خطأ', color: 'hover:border-red-400 hover:bg-red-50', activeColor: 'border-red-500 bg-red-50' },
      ].map(opt => (
        <button key={String(opt.value)} disabled={disabled}
          onClick={() => { if (!disabled) { setSelected(opt.value); onAnswer({ value: opt.value }); } }}
          className={cn('p-6 rounded-xl border-2 text-center font-bold text-lg transition-all',
            selected === opt.value ? opt.activeColor : `border-border ${!disabled ? opt.color : ''}`)}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function FillBlank({ exercise, onAnswer, disabled }: {
  exercise: Exercise; onAnswer: (answer: any) => void; disabled: boolean;
}) {
  const [value, setValue] = useState('');
  const parts = exercise.questionAr.split('___');
  return (
    <div className="space-y-4">
      <div className="text-lg font-medium leading-relaxed flex flex-wrap items-center gap-2">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <input value={value} onChange={e => setValue(e.target.value)} disabled={disabled}
                className="inline-block w-32 border-b-2 border-primary bg-transparent text-center font-bold text-primary focus:outline-none mx-1" />
            )}
          </span>
        ))}
      </div>
      <Button onClick={() => onAnswer({ value })} disabled={disabled || !value.trim()} variant="gradient">
        تأكيد الإجابة
      </Button>
    </div>
  );
}

function ShortAnswer({ exercise, onAnswer, disabled }: {
  exercise: Exercise; onAnswer: (answer: any) => void; disabled: boolean;
}) {
  const [value, setValue] = useState('');
  return (
    <div className="space-y-4">
      <textarea value={value} onChange={e => setValue(e.target.value)} disabled={disabled}
        placeholder="اكتب إجابتك هنا..."
        className="w-full h-28 bg-muted/30 border rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
      <Button onClick={() => onAnswer({ value })} disabled={disabled || !value.trim()} variant="gradient">
        تأكيد الإجابة
      </Button>
    </div>
  );
}

function Ordering({ exercise, onAnswer, disabled }: {
  exercise: Exercise; onAnswer: (answer: any) => void; disabled: boolean;
}) {
  const items: any[] = exercise.options || [];
  const [order, setOrder] = useState<any[]>([...items].sort(() => Math.random() - 0.5));
  const [dragging, setDragging] = useState<number | null>(null);

  const moveItem = (from: number, to: number) => {
    if (disabled) return;
    const newOrder = [...order];
    const [removed] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, removed);
    setOrder(newOrder);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">رتّب العناصر بالترتيب الصحيح:</p>
      <div className="space-y-2">
        {order.map((item, i) => (
          <div key={item.id}
            draggable={!disabled}
            onDragStart={() => setDragging(i)}
            onDragOver={e => { e.preventDefault(); if (dragging !== null && dragging !== i) moveItem(dragging, i); }}
            onDragEnd={() => setDragging(null)}
            className={cn('flex items-center gap-3 p-3 bg-muted/50 border rounded-xl cursor-grab active:cursor-grabbing transition-all',
              dragging === i && 'opacity-50 scale-95', disabled && 'cursor-not-allowed')}>
            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</div>
            <span className="text-sm font-medium">{item.text}</span>
            <div className="mr-auto text-muted-foreground/40 text-xs">⋮⋮</div>
          </div>
        ))}
      </div>
      <Button onClick={() => onAnswer({ order: order.map(o => o.id) })} disabled={disabled} variant="gradient">
        تأكيد الترتيب
      </Button>
    </div>
  );
}

function Matching({ exercise, onAnswer, disabled }: {
  exercise: Exercise; onAnswer: (answer: any) => void; disabled: boolean;
}) {
  const pairs: any[] = exercise.options || [];
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const rightItems = [...pairs].sort(() => Math.random() - 0.5);

  const handleLeft = (id: string) => { if (!disabled) setSelectedLeft(id); };
  const handleRight = (text: string) => {
    if (!disabled && selectedLeft) {
      setMatches(prev => ({ ...prev, [selectedLeft]: text }));
      setSelectedLeft(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {pairs.map((p: any) => (
            <button key={p.left} onClick={() => handleLeft(p.left)} disabled={disabled}
              className={cn('w-full p-3 rounded-lg border-2 text-right text-sm font-medium transition-all',
                selectedLeft === p.left ? 'border-primary bg-primary/10' : matches[p.left] ? 'border-green-400 bg-green-50' : 'border-border hover:border-primary/40')}>
              {p.left}
              {matches[p.left] && <span className="text-xs text-green-600 block">→ {matches[p.left]}</span>}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rightItems.map((p: any) => (
            <button key={p.right} onClick={() => handleRight(p.right)} disabled={disabled || !selectedLeft}
              className={cn('w-full p-3 rounded-lg border-2 text-right text-sm transition-all',
                selectedLeft ? 'border-primary/40 hover:border-primary hover:bg-primary/5 cursor-pointer' : 'border-border',
                Object.values(matches).includes(p.right) ? 'opacity-40' : '')}>
              {p.right}
            </button>
          ))}
        </div>
      </div>
      <Button onClick={() => onAnswer({ matches })}
        disabled={disabled || Object.keys(matches).length < pairs.length} variant="gradient">
        تأكيد التوصيل
      </Button>
    </div>
  );
}

// ===== نتيجة التمرين =====
function ExerciseResult({ isCorrect, points, explanation, correctAnswer, onNext }: {
  isCorrect: boolean; points: number; explanation?: string | null;
  correctAnswer?: any; onNext: () => void;
}) {
  return (
    <div className={cn('rounded-xl border-2 p-5 space-y-4 animate-fade-in',
      isCorrect ? 'border-green-300 bg-green-50 dark:bg-green-950/30' : 'border-red-300 bg-red-50 dark:bg-red-950/30')}>
      <div className="flex items-center gap-3">
        {isCorrect
          ? <><CheckCircle2 className="h-7 w-7 text-green-600" /><span className="font-black text-green-700 text-lg">إجابة صحيحة! 🎉</span></>
          : <><XCircle className="h-7 w-7 text-red-600" /><span className="font-black text-red-700 text-lg">إجابة خاطئة</span></>}
        {isCorrect && points > 0 && (
          <div className="mr-auto flex items-center gap-1 bg-yellow-100 text-yellow-700 rounded-full px-3 py-1">
            <Zap className="h-3.5 w-3.5" /><span className="text-sm font-bold">+{points} نقطة</span>
          </div>
        )}
      </div>
      {explanation && (
        <div className={cn('rounded-lg p-3 text-sm', isCorrect ? 'bg-green-100/60 dark:bg-green-900/30' : 'bg-red-100/60 dark:bg-red-900/30')}>
          <p className="font-semibold mb-1">💡 الشرح:</p>
          <p className="leading-relaxed">{explanation}</p>
        </div>
      )}
      <Button onClick={onNext} variant={isCorrect ? 'gradient' : 'outline'} className="w-full">
        {isCorrect ? 'التمرين التالي' : 'حاول مرة أخرى'} <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ===== محرك التمارين الرئيسي =====
interface ExerciseEngineProps {
  exercises: Exercise[];
  lessonId: string;
  subjectId: string;
  onComplete?: (stats: { correct: number; total: number; points: number }) => void;
}

export function ExerciseEngine({ exercises, lessonId, subjectId, onComplete }: ExerciseEngineProps) {
  const { addToast } = useToast();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0, points: 0 });
  const [finished, setFinished] = useState(false);

  const current = exercises[currentIdx];
  const progress = ((currentIdx) / exercises.length) * 100;

  useEffect(() => { setStartTime(Date.now()); setShowHint(false); }, [currentIdx]);

  const handleAnswer = useCallback(async (answer: any) => {
    if (submitting || result) return;
    setSubmitting(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    try {
      const res = await submitExerciseAttempt(current.id, answer, timeSpent, hintsUsed);
      setResult(res);
      if (res.isCorrect) {
        setStats(s => ({ correct: s.correct + 1, total: s.total + 1, points: s.points + (res.pointsEarned || 0) }));
        addToast(`+${res.pointsEarned} نقطة! 🎯`, 'success');
      } else {
        setStats(s => ({ ...s, total: s.total + 1 }));
      }
    } catch { addToast('حدث خطأ. حاول مرة أخرى', 'error'); }
    finally { setSubmitting(false); }
  }, [current, hintsUsed, startTime, submitting, result]);

  const handleNext = () => {
    if (!result?.isCorrect) { setResult(null); return; }
    if (currentIdx + 1 >= exercises.length) {
      setFinished(true);
      onComplete?.(stats);
    } else {
      setCurrentIdx(i => i + 1);
      setResult(null);
      setHintsUsed(0);
    }
  };

  if (finished) {
    const pct = Math.round((stats.correct / stats.total) * 100);
    return (
      <div className="text-center py-10 space-y-6 animate-fade-in">
        <div className="relative w-32 h-32 mx-auto">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl">
            <Trophy className="h-16 w-16 text-white" />
          </div>
          {pct >= 80 && <div className="absolute -top-2 -right-2 text-3xl animate-bounce-subtle">🌟</div>}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black">أحسنت! انتهت التمارين</h2>
          <p className="text-muted-foreground">لقد أكملت {stats.total} تمارين</p>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {[
            { label: 'إجابات صحيحة', value: stats.correct, icon: '✅' },
            { label: 'نسبة النجاح', value: `${pct}%`, icon: '📊' },
            { label: 'نقاط مكتسبة', value: stats.points, icon: '⭐' },
          ].map(s => (
            <div key={s.label} className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-black text-lg">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => { setCurrentIdx(0); setResult(null); setStats({ correct: 0, total: 0, points: 0 }); setFinished(false); }}>
            إعادة المحاولة
          </Button>
          <Button variant="gradient" asChild>
            <a href={`/subjects/${subjectId}/lessons/${lessonId}/quiz`}>الاختبار القصير</a>
          </Button>
        </div>
      </div>
    );
  }

  if (!current) return null;
  const diffColors: Record<string, string> = { EASY: 'bg-green-100 text-green-700', MEDIUM: 'bg-yellow-100 text-yellow-700', HARD: 'bg-red-100 text-red-700' };
  const diffLabels: Record<string, string> = { EASY: 'سهل', MEDIUM: 'متوسط', HARD: 'صعب' };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">التمرين {currentIdx + 1} من {exercises.length}</span>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-semibold">{stats.correct} ✓</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{currentIdx}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2.5" />
      </div>

      {/* Exercise card */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        {/* Question header */}
        <div className="p-5 border-b bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-sm shrink-0">
              {currentIdx + 1}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge className={`text-xs ${diffColors[current.difficulty]}`}>{diffLabels[current.difficulty]}</Badge>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                  <Star className="h-3 w-3 ml-0.5" />{current.points} نقطة
                </Badge>
              </div>
              <p className="font-semibold text-base leading-relaxed">{current.questionAr}</p>
            </div>
          </div>
        </div>

        {/* Answer area */}
        <div className="p-5">
          {!result ? (
            <>
              {current.type === 'MULTIPLE_CHOICE' && <MultipleChoice exercise={current} onAnswer={handleAnswer} disabled={submitting} />}
              {current.type === 'TRUE_FALSE' && <TrueFalse exercise={current} onAnswer={handleAnswer} disabled={submitting} />}
              {current.type === 'FILL_BLANK' && <FillBlank exercise={current} onAnswer={handleAnswer} disabled={submitting} />}
              {current.type === 'SHORT_ANSWER' && <ShortAnswer exercise={current} onAnswer={handleAnswer} disabled={submitting} />}
              {current.type === 'ORDERING' && <Ordering exercise={current} onAnswer={handleAnswer} disabled={submitting} />}
              {current.type === 'MATCHING' && <Matching exercise={current} onAnswer={handleAnswer} disabled={submitting} />}
            </>
          ) : (
            <ExerciseResult
              isCorrect={result.isCorrect}
              points={result.pointsEarned}
              explanation={result.explanation}
              correctAnswer={result.correctAnswer}
              onNext={handleNext}
            />
          )}

          {/* Hint */}
          {!result && current.hint && (
            <div className="mt-4">
              {!showHint ? (
                <button onClick={() => { setShowHint(true); setHintsUsed(h => h + 1); }}
                  className="flex items-center gap-1.5 text-sm text-yellow-600 hover:text-yellow-700 transition-colors">
                  <Lightbulb className="h-4 w-4" />
                  عرض التلميح (-2 نقطة)
                </button>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">{current.hint}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Skip button */}
      {!result && (
        <div className="flex justify-end">
          <button onClick={() => { setResult({ isCorrect: false, pointsEarned: 0, explanation: null }); setStats(s => ({ ...s, total: s.total + 1 })); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            تخطي هذا السؤال ←
          </button>
        </div>
      )}
    </div>
  );
}
