'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Target, ChevronLeft, Trophy, BookOpen, Zap, ArrowLeft } from 'lucide-react';

type DiagQuestion = {
  id: string; questionAr: string; type: string;
  options?: any[]; correctAnswer: any; difficulty: string; topic: string;
};

type DiagQuiz = {
  id: string; nameAr: string; timeLimit?: number | null;
  totalQuestions: number; questions: DiagQuestion[];
};

type Subject = { id: string; nameAr: string; icon: string; color: string };

function checkDiagAnswer(type: string, correct: any, user: any): boolean {
  if (!user) return false;
  if (type === 'MULTIPLE_CHOICE') return String(user?.id || user) === String(correct?.id || correct);
  if (type === 'TRUE_FALSE') return Boolean(user?.value ?? user) === Boolean(correct?.value ?? correct);
  if (type === 'FILL_BLANK') {
    const answers = correct?.answers || [];
    return answers.some((a: string) => a.toLowerCase() === String(user?.value || user).trim().toLowerCase());
  }
  return false;
}

export function DiagnosticQuizClient({ quiz, subject, subjectId }: {
  quiz: DiagQuiz; subject: Subject; subjectId: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<{ score: number; level: string; byTopic: Record<string, { correct: number; total: number }> } | null>(null);

  const q = quiz.questions[current];

  const handleAnswer = (val: any) => {
    setAnswers(prev => ({ ...prev, [q.id]: val }));
    setTimeout(() => {
      if (current + 1 >= quiz.questions.length) {
        calculateResults();
      } else {
        setCurrent(i => i + 1);
      }
    }, 300);
  };

  const calculateResults = () => {
    let correct = 0;
    const byTopic: Record<string, { correct: number; total: number }> = {};

    quiz.questions.forEach(q => {
      const isCorrect = checkDiagAnswer(q.type, q.correctAnswer, answers[q.id]);
      if (isCorrect) correct++;
      const topic = q.topic || 'عام';
      if (!byTopic[topic]) byTopic[topic] = { correct: 0, total: 0 };
      byTopic[topic].total++;
      if (isCorrect) byTopic[topic].correct++;
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const level = score >= 71 ? 'advanced' : score >= 41 ? 'medium' : 'beginner';
    setResults({ score, level, byTopic });
    setPhase('results');

    // Save to DB
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'diagnostic', subjectId, score, level }),
    }).catch(() => {});
  };

  const levelInfo = {
    advanced: { label: 'متقدم 🚀', color: 'from-purple-500 to-purple-700', desc: 'ممتاز! مستواك متقدم في هذه المادة. سنقترح عليك المحتوى المتقدم.' },
    medium:   { label: 'متوسط 📚', color: 'from-blue-500 to-blue-600', desc: 'جيد! مستواك متوسط. سنبدأ من الدروس المتوسطة لتطوير مهاراتك.' },
    beginner: { label: 'مبتدئ 🌱', color: 'from-green-500 to-emerald-600', desc: 'لا بأس! سنبدأ معك من الأساسيات لبناء قاعدة قوية.' },
  };

  if (phase === 'intro') {
    return (
      <div className="max-w-lg mx-auto text-center py-10 space-y-6 animate-fade-in">
        <div className="flex items-center gap-3 justify-center">
          <span className="text-5xl">{subject.icon}</span>
          <div className="text-right">
            <h1 className="text-2xl font-black">{subject.nameAr}</h1>
            <p className="text-muted-foreground">اختبار تحديد المستوى</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-purple-50 dark:to-purple-950/20 border border-primary/20 rounded-2xl p-6 space-y-4">
          <Target className="h-10 w-10 text-primary mx-auto" />
          <h2 className="text-lg font-bold">لماذا هذا الاختبار؟</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            سيساعدنا هذا الاختبار في تحديد مستواك الحقيقي وتقديم محتوى تعليمي مخصص لك
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { icon: '❓', val: quiz.questions.length, label: 'سؤال' },
              { icon: '⏱️', val: quiz.timeLimit ? `${quiz.timeLimit}د` : 'مرن', label: 'الوقت' },
              { icon: '🎯', val: '3', label: 'مستويات' },
            ].map(s => (
              <div key={s.label} className="bg-white/60 dark:bg-black/20 rounded-xl p-3">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-black">{s.val}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <Button size="xl" variant="gradient" onClick={() => setPhase('quiz')} className="px-12">
          <Zap className="h-5 w-5 ml-2" />
          ابدأ الاختبار التشخيصي
        </Button>
      </div>
    );
  }

  if (phase === 'results' && results) {
    const info = levelInfo[results.level as keyof typeof levelInfo];
    return (
      <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
        <div className={`bg-gradient-to-br ${info.color} text-white rounded-2xl p-8 text-center space-y-4 shadow-xl`}>
          <div className="text-6xl">{results.level === 'advanced' ? '🏆' : results.level === 'medium' ? '⭐' : '🌱'}</div>
          <div>
            <div className="text-5xl font-black">{results.score}%</div>
            <div className="text-xl font-bold mt-1">{info.label}</div>
          </div>
          <p className="text-sm opacity-90 leading-relaxed">{info.desc}</p>
        </div>

        {/* Topic breakdown */}
        {Object.keys(results.byTopic).length > 0 && (
          <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold">تحليل أدائك بالموضوع:</h3>
            {Object.entries(results.byTopic).map(([topic, data]) => {
              const pct = Math.round((data.correct / data.total) * 100);
              return (
                <div key={topic} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{topic}</span>
                    <span className={cn('font-bold', pct >= 70 ? 'text-green-600' : pct >= 40 ? 'text-yellow-600' : 'text-red-600')}>
                      {data.correct}/{data.total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500')}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => router.push(`/subjects/${subjectId}`)}>
            <BookOpen className="h-4 w-4 ml-1" />
            عرض الدروس
          </Button>
          <Button variant="gradient" className="flex-1" onClick={() => router.push('/subjects')}>
            <ArrowLeft className="h-4 w-4 icon-rtl ml-1" />
            متابعة التعلم
          </Button>
        </div>
      </div>
    );
  }

  // Quiz phase
  if (!q) return null;
  const progress = ((current) / quiz.questions.length) * 100;
  const diffColors: Record<string, string> = { EASY: 'bg-green-100 text-green-700', MEDIUM: 'bg-yellow-100 text-yellow-700', HARD: 'bg-red-100 text-red-700' };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>السؤال {current + 1} من {quiz.questions.length}</span>
          <span className="font-medium">{subject.nameAr}</span>
        </div>
        <Progress value={progress} className="h-2.5" />
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 text-white"
              style={{ backgroundColor: subject.color }}>
              {current + 1}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-1">
                <Badge className={`text-xs ${diffColors[q.difficulty] || ''}`}>{q.difficulty === 'EASY' ? 'سهل' : q.difficulty === 'HARD' ? 'صعب' : 'متوسط'}</Badge>
                {q.topic && <Badge variant="outline" className="text-xs">{q.topic}</Badge>}
              </div>
              <p className="font-semibold text-base leading-relaxed">{q.questionAr}</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          {q.type === 'MULTIPLE_CHOICE' && (
            <div className="space-y-2.5">
              {(q.options || []).map((opt: any) => (
                <button key={opt.id} onClick={() => handleAnswer({ id: opt.id })}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 text-right transition-all">
                  <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-xs font-bold shrink-0">
                    {opt.id.toUpperCase()}
                  </div>
                  <span className="text-sm">{opt.text}</span>
                </button>
              ))}
            </div>
          )}
          {q.type === 'TRUE_FALSE' && (
            <div className="grid grid-cols-2 gap-4">
              {[{v: true, l: '✅ صحيح'}, {v: false, l: '❌ خطأ'}].map(o => (
                <button key={String(o.v)} onClick={() => handleAnswer({ value: o.v })}
                  className="p-5 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 text-center font-bold text-lg transition-all">
                  {o.l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={() => { setAnswers(prev => ({ ...prev, [q.id]: null })); handleAnswer(null); }}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-center">
        تخطي هذا السؤال ←
      </button>
    </div>
  );
}
