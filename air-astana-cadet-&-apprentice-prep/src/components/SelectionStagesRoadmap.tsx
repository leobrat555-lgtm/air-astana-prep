import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Plane,
  Wrench,
  Clock,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Users,
  Compass,
  BookOpen,
} from 'lucide-react';
import { ProgramTrack, ActiveModule, SelectionStage, LanguageMode } from '../types';
import { AB_INITIO_STAGES, APPRENTICE_STAGES } from '../data/selection-stages';
import { translations } from '../utils/i18n';

interface SelectionStagesRoadmapProps {
  track: ProgramTrack;
  language?: LanguageMode;
  onNavigateModule: (module: ActiveModule) => void;
}

export const SelectionStagesRoadmap: React.FC<SelectionStagesRoadmapProps> = ({
  track,
  language = 'ru',
  onNavigateModule,
}) => {
  const t = translations[language];
  const stages: SelectionStage[] = track === 'ab-initio' ? AB_INITIO_STAGES : APPRENTICE_STAGES;
  const [selectedStageId, setSelectedStageId] = useState<string>(stages[0].id);

  const activeStage = stages.find((s) => s.id === selectedStageId) || stages[0];

  const getStageIcon = (step: number, currentTrack: ProgramTrack) => {
    if (currentTrack === 'ab-initio') {
      switch (step) {
        case 1: return <FileText className="w-4 h-4 text-blue-600" />;
        case 2: return <BookOpen className="w-4 h-4 text-sky-600" />;
        case 3: return <Clock className="w-4 h-4 text-indigo-600" />;
        case 4: return <Compass className="w-4 h-4 text-purple-600" />;
        case 5: return <Stethoscope className="w-4 h-4 text-rose-600" />;
        case 6: return <Plane className="w-4 h-4 text-amber-600" />;
        case 7: return <Users className="w-4 h-4 text-emerald-600" />;
        default: return <Sparkles className="w-4 h-4 text-blue-600" />;
      }
    } else {
      switch (step) {
        case 1: return <FileText className="w-4 h-4 text-amber-600" />;
        case 2: return <BookOpen className="w-4 h-4 text-blue-600" />;
        case 3: return <Wrench className="w-4 h-4 text-indigo-600" />;
        case 4: return <Users className="w-4 h-4 text-emerald-600" />;
        default: return <Sparkles className="w-4 h-4 text-amber-600" />;
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Track Title Banner */}
      <div className="liquid-glass p-5 relative overflow-hidden text-slate-900 shadow-md border border-white/95">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="px-3 py-0.5 rounded-full bg-blue-50 text-blue-800 font-mono-avionics text-[10px] font-bold uppercase tracking-wider border border-blue-200">
            {track === 'ab-initio' ? t.trackA : t.trackB}
          </span>
          <span className="text-[11px] font-mono-avionics text-slate-700 font-semibold">
            {stages.length} {language === 'ru' ? 'этапов' : 'stages'}
          </span>
        </div>
        <h2 className="text-xl font-bold font-cockpit text-slate-950 tracking-tight">
          {t.stagesTitle}
        </h2>
        <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
          {t.stagesSubtitle}
        </p>
      </div>

      {/* Stages Stepper with High-Contrast Content */}
      <div className="space-y-2.5">
        {stages.map((stage) => {
          const isSelected = stage.id === activeStage.id;
          return (
            <div
              key={stage.id}
              onClick={() => setSelectedStageId(stage.id)}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-white/95 border-blue-500 shadow-md ring-2 ring-blue-400/30'
                  : 'liquid-glass hover:bg-white/85 border-white/90 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-cockpit font-bold text-xs shadow-xs ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-900 border border-slate-300'
                    }`}
                  >
                    {stage.stepNumber}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold font-cockpit text-slate-950 leading-tight">
                      {stage.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium line-clamp-1 mt-0.5">
                      {stage.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {getStageIcon(stage.stepNumber, track)}
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isSelected ? 'rotate-90 text-blue-600' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Stage Details */}
              {isSelected && (
                <div className="mt-3.5 pt-3 border-t border-slate-200/90 space-y-3 text-xs animate-fade-in">
                  <div className="space-y-1.5">
                    <span className="font-mono-avionics text-[10px] uppercase font-bold text-slate-700 block">
                      {language === 'ru' ? 'Требования и регламент допуска:' : 'Mandatory Criteria & Requirements:'}
                    </span>
                    <ul className="space-y-1">
                      {stage.fullRequirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-800 text-[11px] leading-relaxed font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {stage.documentsNeeded && stage.documentsNeeded.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                      <span className="font-mono-avionics text-[10px] uppercase font-bold text-slate-700 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-500" />
                        <span>{language === 'ru' ? 'Пакет документов для подачи:' : 'Required Document Package:'}</span>
                      </span>
                      <div className="text-[11px] text-slate-700 flex flex-wrap gap-1.5 font-medium">
                        {stage.documentsNeeded.map((doc, idx) => (
                          <span
                            key={idx}
                            className="bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs"
                          >
                            • {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-amber-50/95 border border-amber-300 space-y-1 text-amber-950 shadow-2xs">
                    <span className="font-mono-avionics text-[10px] uppercase font-bold text-amber-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>{t.airAstanaTipLabel}</span>
                    </span>
                    <p className="text-[11px] leading-relaxed font-medium">
                      {stage.airAstanaAdvice}
                    </p>
                  </div>

                  {stage.actionModule && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (stage.actionModule) onNavigateModule(stage.actionModule);
                      }}
                      className="w-full min-h-[42px] py-2 px-3 rounded-xl liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-1.5 hover:brightness-105"
                    >
                      <span>{stage.actionLabel || t.toTrainerBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
