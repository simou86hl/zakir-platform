'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { submitQuizAttempt } from '@/actions/lesson.actions';
import { cn } from '@/lib/utils';
import {
  Clock, CheckCircle2, XCircle, Trophy, ChevronLeft,
  AlertCircle, Zap, Target, RotateCcw
} from 'lucide-react';

type QuizQuestion = {
  id: string; type: string; questionAr: string;
  options?: any[]; correctAnswer: any; explanation?: string | null; points: number;
};

type Quiz = {
  id: string; nameAr: string; description?: string | null;
  timeLimit?: number | null; passingScore: number; questions: QuizQuestion[];
};

// ===== Timer =====
function Timer({ seconds, onExpire, warning = 60 }: { seconds: number; onExpire: () => void; warning?: number }) {
  const [remaining, setRemaining] = useState(seconds);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); onExpire(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [onExpire]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isWarning = remaining <= warning;

  return (
    <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full font-mono font-bold text-sm transition-colors',
      isWarning ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-muted text-foreground')}>
      <Clock className="h-4 w-4" />
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
}

// ===== Question renderer =====
function QuestionView({ q, answer, onChange, submitted }: {
  q: QuizQuestion; answer: any; onChange: (v: any) => void; submitted: boolean;
}) {
  const correct = q.correctAnswer;
  const isCorrect = submitted && (() => {
    if (q.type === 'MULTIPLE_CHOICE') return answer?.id === (correct?.id || correct);
    if (q.type === 'TRUE_FALSE') return Boolean(answer?.value) === Boolean(correct?.value ?? correct);
    return false;
  })();

  if (q.type === 'MULTIPLE_CHOICE') {
    return (
      <div className="space-y-2.5">
        {(q.options || []).map((opt: any) => {
          const isSelected = answer?.id === opt.id;
          const isCorrectOpt = submitted && (correct?.id === opt.id || correct === opt.id);
          const isWrongSelected = submitted && isSelected && !isCorrectOpt;
          return (
            <button key={opt.id} onClick={() => !submitted && onChange({ id: opt.id })} disabled={submitted}
              className={cn('w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-right transition-all',
                isCorrectOpt ? 'border-green-500 bg-green-50 dark:bg-green-950/30' :
                isWrongSelected ? 'border-red-500 bg-red-50 dark:bg-red-950/30' :
                isSelected ? 'border-primary bg-primary/10' :
                'border-border hover:border-primary/40')}>
              <div className={cn('h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0',
                isCorrectOpt ? 'border-green-600 bg-green-500 text-white' :
                isWrongSelected ? 'border-red-600 bg-red-500 text-white' :
                isSelected ? 'border-primary bg-primary text-white' : 'border-muted-foreground/40')}>
                {isCorrectOpt ? '✓' : isWrongSelected ? '✗' : opt.id.toUpperCase()}
              </div>
              <span className="text-sm">{opt.text}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (q.type === 'TRUE_FALSE') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[{ v: true, label: '✅ صحيح' }, { v: false, label: '❌ خطأ' }].map(opt => {
          const isSelected = Boolean(answer?.value) === opt.v && answer !== undefined;
          const isCorrectOpt = submitted && (Boolean(correct?.value ?? correct) === opt.v);
          const isWrong = submitted && isSelected && !isCorrectOpt;
          return (
            <button key={String(opt.v)} onClick={() => !submitted && onChange({ value: opt.v })} disabled={submitted}
              className={cn('p-4 rounded-xl border-2 text-center font-bold transition-all',
                isCorrectOpt ? 'border-green-500 bg-green-50' :
                isWrong ? 'border-red-500 bg-red-50' :
                isSelected ? 'border-primary bg-primary/10' :
                'border-border hover:border-primary/40')}>
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (q.type === 'FILL_BLANK') {
    const parts = q.questionAr.split('___');
    return (
      <div className="text-lg font-medium flex flex-wrap items-center gap-1">
        {parts.map((part, i) => (
          <span key={i}>{part}
            {i < parts.length - 1 && (
              <input value={answer?.value || ''} onChange={e => onChange({ value: e.target.value })}
                disabled={submitted}
                className={cn('inline-block w-32 border-b-2 bg-transparent text-center font-bold mx-1 focus:outline-none',
                  submitted ? (isCorrect ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700') : 'border-primary text-primary')} />
            )}
          </span>
        ))}
      </div>
    );
  }

  return (
    <input value={answer?.value || ''} onChange={e => onChange({ value: e.target.value })} disabled={submitted}
      placeholder="اكتب إجابتك..."
      className="w-full h-11 border rounded-xl px-4 text-sm bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
  );
}

// ===== Quiz Results =====
function QuizResults({ score, isPassed, passingScore, earnedPoints, totalPoints, questionResults, questions, onRetry, subjectId, lessonId }: any) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      {/* Score card */}
      <div className={cn('rounded-2xl p-8 text-center space-y-4',
        isPassed ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 border border-green-200'
                 : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200')}>
        <div className={cn('w-24 h-24 rounded-full mx-auto flex items-center justify-center shadow-xl',
          isPassed ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-red-400 to-orange-500')}>
          {isPassed ? <Trophy className="h-12 w-12 text-white" /> : <Target className="h-12 w-12 text-white" />}
        </div>
        <div>
          <div className="text-5xl font-black">{score}%</div>
          <p className={cn('text-lg font-bold mt-1', isPassed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400')}>
            {isPassed ? '🎉 مبروك! اجتزت الاختبار' : '💪 لم تجتز الاختبار، حاول مرة أخرى'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">درجة النجاح: {passingScore}%</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'إجابات صحيحة', value: questionResults.filter((r: any) => r.isCorrect).length },
            { label: 'إجابات خاطئة', value: questionResults.filter((r: any) => !r.isCorrect).length },
            { label: 'نقاط مكتسبة', value: `${earnedPoints}/${totalPoints}` },
          ].map(s => (
            <div key={s.label} className="bg-white/60 dark:bg-black/20 rounded-xl p-3 text-center">
              <div className="font-black text-xl">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer review */}
      <div className="space-y-3">
        <h3 className="font-bold text-base">مراجعة الإجابات:</h3>
        {questions.map((q: QuizQuestion, i: number) => {
          const r = questionResults[i];
          return (
            <div key={q.id} className={cn('p-4 rounded-xl border',
              r?.isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : 'border-red-200 bg-red-50 dark:bg-red-950/20')}>
              <div className="flex items-start gap-3">
                {r?.isCorrect
                  ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  : <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm font-medium">{q.questionAr}</p>
                  {r?.explanation && (
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">💡 {r.explanation}</p>
                  )}
                </div>
                <Badge className={r?.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {r?.isCorrect ? `+${r.points}` : '0'} نقطة
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 gap-2" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" />إعادة الاختبار
        </Button>
        <Button variant="gradient" className="flex-1" asChild>
          <a href={`/subjects/${subjectId}`}>العودة للمادة ✓</a>
        </Button>
      </div>
    </div>
  );
}

// ===== محرك الاختبار الرئيسي =====
interface QuizEngineProps { quiz: Quiz; subjectId: string; lessonId: string; }

export function QuizEngine({ quiz, subjectId, lessonId }: QuizEngineProps) {
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  const handleTimeExpire = useCallback(() => handleSubmit(), [answers]);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    try {
      const res = await submitQuizAttempt(quiz.id, answers, timeSpent);
      if (res.success) {
        setResults(res);
        setPhase('results');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setPhase('intro');
    setCurrentIdx(0);
    setAnswers({});
    setResults(null);
  };

  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto text-center py-8 space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto shadow-xl">
          <Target className="h-10 w-10 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black">{quiz.nameAr}</h1>
          {quiz.description && <p className="text-muted-foreground">{quiz.description}</p>}
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {[
            { icon: '❓', label: 'أسئلة', value: quiz.questions.length },
            { icon: '⏱️', label: 'الوقت', value: quiz.timeLimit ? `${quiz.timeLimit}د` : 'بلا حد' },
            { icon: '🎯', label: 'للنجاح', value: `${quiz.passingScore}%` },
          ].map(s => (
            <div key={s.label} className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-black text-lg">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200 text-right space-y-1">
          <p className="font-semibold">📋 تعليمات:</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs">
            <li>اقرأ كل سؤال بعناية قبل الإجابة</li>
            <li>يمكنك التنقل بين الأسئلة</li>
            {quiz.timeLimit && <li>سينتهي الاختبار تلقائياً عند انتهاء الوقت</li>}
          </ul>
        </div>
        <Button size="xl" variant="gradient" onClick={() => setPhase('quiz')} className="px-12">
          <Zap className="h-5 w-5 ml-2" />
          ابدأ الاختبار
        </Button>
      </div>
    );
  }

  if (phase === 'results' && results) {
    return <QuizResults {...results} questions={quiz.questions} onRetry={handleRetry} subjectId={subjectId} lessonId={lessonId} passingScore={quiz.passingScore} />;
  }

  const q = quiz.questions[currentIdx];
  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;
  const allAnswered = quiz.questions.every(qu => answers[qu.id] !== undefined);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Quiz header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">{quiz.nameAr}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{currentIdx + 1}/{quiz.questions.length}</span>
        </div>
        {quiz.timeLimit && (
          <Timer seconds={quiz.timeLimit * 60} onExpire={handleSubmit} />
        )}
      </div>

      <Progress value={progress} className="h-2" />

      {/* Question navigation */}
      <div className="flex gap-1.5 flex-wrap">
        {quiz.questions.map((qu, i) => (
          <button key={qu.id} onClick={() => setCurrentIdx(i)}
            className={cn('h-8 w-8 rounded-lg text-xs font-bold transition-all',
              i === currentIdx ? 'bg-primary text-white shadow-md' :
              answers[qu.id] !== undefined ? 'bg-green-100 text-green-700' :
              'bg-muted text-muted-foreground hover:bg-muted/80')}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-muted/20">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-base leading-relaxed">{q.questionAr}</p>
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs shrink-0">{q.points} نقطة</Badge>
          </div>
        </div>
        <div className="p-5">
          <QuestionView
            q={q}
            answer={answers[q.id]}
            onChange={v => setAnswers(prev => ({ ...prev, [q.id]: v }))}
            submitted={false}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={currentIdx === 0} onClick={() => setCurrentIdx(i => i - 1)}>
          <ChevronLeft className="h-4 w-4 icon-rtl" /> السابق
        </Button>

        {currentIdx < quiz.questions.length - 1 ? (
          <Button variant="gradient" onClick={() => setCurrentIdx(i => i + 1)}>
            التالي <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="gradient" onClick={handleSubmit} loading={submitting}
            className={!allAnswered ? 'opacity-80' : ''}>
            {!allAnswered && <AlertCircle className="h-4 w-4 ml-1" />}
            تسليم الاختبار
          </Button>
        )}
      </div>

      {!allAnswered && (
        <p className="text-xs text-center text-muted-foreground">
          {quiz.questions.filter(qu => answers[qu.id] === undefined).length} أسئلة لم تجب عليها
        </p>
      )}
    </div>
  );
}
