'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const stageColors = { PRIMARY: 'from-green-500 to-emerald-600', MIDDLE: 'from-blue-500 to-blue-600', SECONDARY: 'from-purple-500 to-purple-600' };
const stageIcons = { PRIMARY: '🎒', MIDDLE: '📓', SECONDARY: '🎓' };
const stageLabels = { PRIMARY: 'ابتدائي', MIDDLE: 'متوسط', SECONDARY: 'ثانوي' };

type Curriculum = { id: string; nameAr: string; grades: { id: string; grade: { id: string; nameAr: string; level: number; educationStage: string } }[] };

export default function SelectGradePage() {
  const router = useRouter();
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurriculum, setSelectedCurriculum] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState('');

  const countryCode = typeof window !== 'undefined' ? localStorage.getItem('onboarding_country') || 'SA' : 'SA';

  useEffect(() => {
    fetch(`/api/curricula?country=${countryCode}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCurricula(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [countryCode]);

  const currentCurriculum = curricula.find(c => c.id === selectedCurriculum);
  const stagesInCurriculum = currentCurriculum
    ? [...new Set(currentCurriculum.grades.map(cg => cg.grade.educationStage))]
    : [];
  const gradesInStage = currentCurriculum?.grades
    .filter(cg => cg.grade.educationStage === selectedStage)
    .sort((a, b) => a.grade.level - b.grade.level) || [];

  const handleNext = () => {
    if (!selectedCurriculum || !selectedGradeId || !selectedStage) return;
    localStorage.setItem('onboarding_curriculum', selectedCurriculum);
    localStorage.setItem('onboarding_grade_id', selectedGradeId);
    localStorage.setItem('onboarding_stage', selectedStage);
    router.push('/select-plan');
  };

  return (
    <div className="w-full max-w-2xl animate-fade-in">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1,2,3].map((step) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
              step <= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
              {step === 1 ? '✓' : step}
            </div>
            {step < 3 && <div className={cn('h-1 flex-1 rounded-full', step <= 2 ? 'bg-primary' : 'bg-muted')} />}
          </div>
        ))}
      </div>

      <div className="text-center mb-8 space-y-2">
        <Badge className="bg-primary/10 text-primary border-primary/20">الخطوة 2 من 3</Badge>
        <h1 className="text-3xl font-black">اختر مرحلتك الدراسية 📚</h1>
        <p className="text-muted-foreground">حدد المنهج والمرحلة والصف الدراسي</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Curriculum selection */}
          {curricula.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-3">اختر المنهج:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {curricula.map(curr => (
                  <button key={curr.id} onClick={() => { setSelectedCurriculum(curr.id); setSelectedStage(''); setSelectedGradeId(''); }}
                    className={cn('p-4 rounded-xl border-2 text-right transition-all',
                      selectedCurriculum === curr.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/40')}>
                    <p className="font-bold text-sm">{curr.nameAr}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{curr.grades.length} صف دراسي</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stage selection */}
          {selectedCurriculum && stagesInCurriculum.length > 0 && (
            <div className="animate-fade-in">
              <p className="text-sm font-semibold mb-3">اختر المرحلة:</p>
              <div className="grid grid-cols-3 gap-3">
                {stagesInCurriculum.map(stage => (
                  <button key={stage} onClick={() => { setSelectedStage(stage); setSelectedGradeId(''); }}
                    className={cn('p-4 rounded-2xl border-2 text-center space-y-2 transition-all',
                      selectedStage === stage ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/40')}>
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stageColors[stage as keyof typeof stageColors] || 'from-gray-400 to-gray-500'} flex items-center justify-center text-2xl shadow-sm`}>
                      {stageIcons[stage as keyof typeof stageIcons]}
                    </div>
                    <p className="text-xs font-bold">{stageLabels[stage as keyof typeof stageLabels] || stage}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grade selection */}
          {selectedStage && gradesInStage.length > 0 && (
            <div className="animate-fade-in">
              <p className="text-sm font-semibold mb-3">اختر الصف:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gradesInStage.map(cg => (
                  <button key={cg.grade.id} onClick={() => setSelectedGradeId(cg.grade.id)}
                    className={cn('p-3 rounded-xl border-2 text-sm font-medium transition-all',
                      selectedGradeId === cg.grade.id ? 'border-primary bg-primary text-primary-foreground shadow-md' : 'border-border hover:border-primary/50 hover:bg-muted/50')}>
                    {cg.grade.nameAr}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No DB data fallback */}
          {!loading && curricula.length === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-semibold mb-1">⚠️ قاعدة البيانات فارغة</p>
              <p>شغّل أمر البذر: <code className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">npx tsx data/seed/index.ts</code></p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronRight className="h-4 w-4" /> السابق
        </Button>
        <Button onClick={handleNext} disabled={!selectedCurriculum || !selectedGradeId || !selectedStage} variant="gradient" size="lg">
          التالي <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
