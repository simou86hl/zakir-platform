'use client';
import { useState } from 'react';
import { FileText, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export function LessonNotepad({ lessonId }: { lessonId: string }) {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const saveNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await fetch('/api/lessons/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, content: note }),
      });
      addToast('✅ تم حفظ الملاحظة', 'success');
    } catch { addToast('حدث خطأ', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className={cn('border rounded-xl overflow-hidden transition-all shadow-sm', open ? 'shadow-md' : '')}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full p-4 hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <FileText className="h-4 w-4 text-primary" />
          📝 ملاحظاتي
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t p-4 space-y-3 animate-fade-in">
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="أضف ملاحظاتك هنا... (مثال: نقطة مهمة، سؤال لاحق، ...)"
            className="w-full h-28 bg-muted/30 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button size="sm" onClick={saveNote} loading={saving} variant="outline" className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            حفظ الملاحظة
          </Button>
        </div>
      )}
    </div>
  );
}
