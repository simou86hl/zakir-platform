'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const fallbackCountries = [
  { code: 'SA', nameAr: 'المملكة العربية السعودية', flag: '🇸🇦' },
  { code: 'EG', nameAr: 'مصر', flag: '🇪🇬' },
  { code: 'DZ', nameAr: 'الجزائر', flag: '🇩🇿' },
  { code: 'MA', nameAr: 'المغرب', flag: '🇲🇦' },
  { code: 'TN', nameAr: 'تونس', flag: '🇹🇳' },
  { code: 'IQ', nameAr: 'العراق', flag: '🇮🇶' },
  { code: 'JO', nameAr: 'الأردن', flag: '🇯🇴' },
  { code: 'AE', nameAr: 'الإمارات', flag: '🇦🇪' },
  { code: 'KW', nameAr: 'الكويت', flag: '🇰🇼' },
  { code: 'QA', nameAr: 'قطر', flag: '🇶🇦' },
  { code: 'BH', nameAr: 'البحرين', flag: '🇧🇭' },
  { code: 'OM', nameAr: 'عُمان', flag: '🇴🇲' },
  { code: 'YE', nameAr: 'اليمن', flag: '🇾🇪' },
  { code: 'SY', nameAr: 'سوريا', flag: '🇸🇾' },
  { code: 'LB', nameAr: 'لبنان', flag: '🇱🇧' },
  { code: 'PS', nameAr: 'فلسطين', flag: '🇵🇸' },
  { code: 'LY', nameAr: 'ليبيا', flag: '🇱🇾' },
  { code: 'SD', nameAr: 'السودان', flag: '🇸🇩' },
  { code: 'MR', nameAr: 'موريتانيا', flag: '🇲🇷' },
  { code: 'SO', nameAr: 'الصومال', flag: '🇸🇴' },
  { code: 'DJ', nameAr: 'جيبوتي', flag: '🇩🇯' },
  { code: 'KM', nameAr: 'جزر القمر', flag: '🇰🇲' },
];

export default function SelectCountryPage() {
  const router = useRouter();
  const [countries, setCountries] = useState(fallbackCountries);
  const [selected, setSelected] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/countries')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setCountries(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = countries.filter(c =>
    c.nameAr.includes(search) || c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleNext = () => {
    if (!selected) return;
    localStorage.setItem('onboarding_country', selected);
    router.push('/select-grade');
  };

  return (
    <div className="w-full max-w-2xl animate-fade-in">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1,2,3].map((step) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
              step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
              {step}
            </div>
            {step < 3 && <div className={cn('h-1 flex-1 rounded-full', step === 1 ? 'bg-primary' : 'bg-muted')} />}
          </div>
        ))}
      </div>

      <div className="text-center mb-8 space-y-2">
        <Badge className="bg-primary/10 text-primary border-primary/20">الخطوة 1 من 3</Badge>
        <h1 className="text-3xl font-black">اختر دولتك 🌍</h1>
        <p className="text-muted-foreground">سنعرض لك المناهج الدراسية المناسبة لبلدك</p>
      </div>

      <div className="relative mb-5">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" placeholder="ابحث عن دولتك..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-11 bg-background border rounded-xl pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pb-2 no-scrollbar">
          {filtered.map(country => (
            <button key={country.code} onClick={() => setSelected(country.code)}
              className={cn('flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-right',
                selected === country.code ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/40 hover:bg-muted/50')}>
              <span className="text-3xl shrink-0">{country.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{country.nameAr}</p>
                <p className="text-xs text-muted-foreground">{country.code}</p>
              </div>
              {selected === country.code && (
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {selected ? `✓ اخترت: ${countries.find(c => c.code === selected)?.nameAr}` : 'اختر دولتك للمتابعة'}
        </p>
        <Button onClick={handleNext} disabled={!selected} variant="gradient" size="lg">
          التالي <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
