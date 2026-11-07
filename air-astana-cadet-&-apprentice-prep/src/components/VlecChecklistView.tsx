import React, { useState } from 'react';
import { HeartPulse, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { VLEC_CHECKLIST } from '../data/questions';
import { MedicalChecklistItem } from '../types';

export const VlecChecklistView: React.FC = () => {
  const [items, setItems] = useState<MedicalChecklistItem[]>(VLEC_CHECKLIST);

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'cleared' ? 'caution' : item.status === 'caution' ? 'pending' : 'cleared';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const clearedCount = items.filter((i) => i.status === 'cleared').length;

  return (
    <div className="space-y-6">
      <div className="liquid-glass p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono-avionics text-xs font-bold border border-rose-500/30">
              KAZAKHSTAN VLEC / EASA CLASS 1
            </span>
            <span className="text-xs text-white/60 font-mono-avionics">
              Pilot Cadet Flight Medical Commission Checklist
            </span>
          </div>
          <h2 className="text-xl font-bold font-cockpit text-white">
            Pre-Screening Medical Assessment (ВЛЭК)
          </h2>
          <p className="text-xs text-white/70 mt-1 max-w-2xl leading-relaxed">
            Air Astana requires candidates to pass strict Civil Aviation Medical Commission (ВЛЭК) standards in Almaty before final academy contracting.
          </p>
        </div>

        <div className="liquid-glass-nested px-5 py-3 rounded-2xl text-right font-mono-avionics">
          <div className="text-[10px] text-white/50 uppercase">Readiness Index</div>
          <div className="text-2xl font-bold text-emerald-400">
            {clearedCount} / {items.length} Cleared
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleStatus(item.id)}
            className="liquid-glass p-5 cursor-pointer hover:border-white/35 transition-all flex items-start justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono-avionics px-2.5 py-0.5 rounded-full liquid-glass-nested text-white/80">
                  {item.category}
                </span>
                <span className="text-sm font-semibold text-white">{item.title}</span>
              </div>
              <p className="text-xs text-white/85 leading-relaxed font-mono-avionics">
                {item.requirement}
              </p>
              <div className="text-[11px] text-[#E0B85C] italic">
                Note: {item.notes}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono-avionics">
              {item.status === 'cleared' && (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Cleared
                </span>
              )}
              {item.status === 'caution' && (
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Caution
                </span>
              )}
              {item.status === 'pending' && (
                <span className="text-white/40 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Pending Clinic
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
