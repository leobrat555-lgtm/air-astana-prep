import React, { useState } from 'react';
import { Sparkles, RotateCw, BookOpen, Zap, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { AviationFact, ProgramTrack, LanguageMode } from '../types';
import { AVIATION_FACTS } from '../data/aviation-facts';
import { translations } from '../utils/i18n';

interface AviationDiscoveryHubProps {
  track: ProgramTrack;
  language?: LanguageMode;
  onOpenAITheory?: (fact: AviationFact) => void;
}

export const AviationDiscoveryHub: React.FC<AviationDiscoveryHubProps> = ({
  track,
  language = 'ru',
  onOpenAITheory,
}) => {
  const t = translations[language];

  // Filter facts by track or both
  const trackFacts = AVIATION_FACTS.filter((f) => f.track === track || f.track === 'both');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [factsList, setFactsList] = useState<AviationFact[]>(trackFacts);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Blitz mode state
  const [isBlitzOpen, setIsBlitzOpen] = useState(false);
  const [selectedBlitzOption, setSelectedBlitzOption] = useState<number | null>(null);
  const [hasSubmittedBlitz, setHasSubmittedBlitz] = useState(false);

  // Deep Theory Modal state
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  const currentFact = factsList[currentIndex % factsList.length] || trackFacts[0];

  const handleRotateFact = () => {
    setIsBlitzOpen(false);
    setSelectedBlitzOption(null);
    setHasSubmittedBlitz(false);
    setCurrentIndex((prev) => (prev + 1) % factsList.length);
  };

  const handleFetchAIFact = async () => {
    setIsGeneratingAI(true);
    setIsBlitzOpen(false);
    setSelectedBlitzOption(null);
    setHasSubmittedBlitz(false);
    try {
      const res = await fetch('/api/ai/fact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track }),
      });
      const data = await res.json();
      if (data.fact) {
        const newFact: AviationFact = {
          id: `ai-fact-${Date.now()}`,
          track,
          badgeCategory: data.fact.category || (track === 'ab-initio' ? t.factPilotTag : t.factEngTag),
          title: data.fact.title,
          snippet: data.fact.snippet,
          deepTheory: data.fact.deepTheory,
          formulaOrRule: data.fact.formulaOrRule,
          blitzQuestion: data.fact.blitzQuestion,
        };
        setFactsList((prev) => [newFact, ...prev]);
        setCurrentIndex(0);
      }
    } catch (e) {
      console.warn('AI fact fetch failed, rotating local:', e);
      handleRotateFact();
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSelectBlitzOption = (index: number) => {
    if (hasSubmittedBlitz) return;
    setSelectedBlitzOption(index);
    setHasSubmittedBlitz(true);
  };

  return (
    <div className="liquid-glass p-5 relative overflow-hidden text-slate-900 shadow-lg border border-white/95">
      {/* Soft atmospheric background lighting */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header Badge & Action Controls */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-50/90 text-[11px] font-mono-avionics font-bold text-blue-800 border border-blue-200 shadow-2xs flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{track === 'ab-initio' ? t.factPilotTag : t.factEngTag}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRotateFact}
              title={t.nextFact}
              className="px-2.5 py-1.5 rounded-full liquid-glass-nested hover:bg-white text-slate-700 hover:text-slate-950 text-xs font-mono-avionics font-semibold flex items-center gap-1 transition-all shadow-xs active:scale-95 border border-white/90"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.nextFact}</span>
            </button>

            <button
              onClick={handleFetchAIFact}
              disabled={isGeneratingAI}
              title={t.aiFactBtn}
              className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono-avionics font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin text-amber-300' : 'text-amber-300'}`} />
              <span>{isGeneratingAI ? '...' : t.aiFactBtn}</span>
            </button>
          </div>
        </div>

        {/* Fact Title & Snippet (High-Contrast Slate) */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold font-cockpit text-slate-950 tracking-tight leading-snug">
            {currentFact.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {currentFact.snippet}
          </p>
        </div>

        {/* Action Buttons: Deep Theory & Blitz Question */}
        <div className="pt-1 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsTheoryOpen(true)}
            className="flex-1 min-h-[44px] py-2 px-3 rounded-2xl bg-white/90 hover:bg-white text-blue-800 font-cockpit font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-blue-200 shadow-xs transition-all active:scale-[0.98]"
          >
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span>{t.discussAi}</span>
          </button>

          <button
            onClick={() => {
              setIsBlitzOpen(!isBlitzOpen);
              setSelectedBlitzOption(null);
              setHasSubmittedBlitz(false);
            }}
            className={`flex-1 min-h-[44px] py-2 px-3 rounded-2xl font-cockpit font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98] ${
              isBlitzOpen
                ? 'bg-amber-500 text-white shadow-amber-500/25'
                : 'bg-white/90 hover:bg-white text-amber-900 border border-amber-300'
            }`}
          >
            <Zap className={`w-4 h-4 ${isBlitzOpen ? 'text-white' : 'text-amber-600'}`} />
            <span>{isBlitzOpen ? (language === 'ru' ? 'Скрыть блиц' : 'Hide Blitz') : t.blitzBtn}</span>
          </button>
        </div>

        {/* Interactive Blitz Question Panel */}
        {isBlitzOpen && currentFact.blitzQuestion && (
          <div className="pt-3 border-t border-slate-200/80 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono-avionics uppercase font-bold text-amber-900 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.blitzTitle}</span>
              </span>
              <span className="text-[10px] text-slate-600 font-mono-avionics font-medium">1 attempt</span>
            </div>

            <p className="text-xs font-semibold text-slate-950 leading-snug">
              {currentFact.blitzQuestion.question}
            </p>

            <div className="space-y-1.5">
              {currentFact.blitzQuestion.options.map((option, idx) => {
                const isSelected = selectedBlitzOption === idx;
                const isCorrect = idx === currentFact.blitzQuestion.correctIndex;

                let btnStyle = 'bg-white/90 hover:bg-white text-slate-900 border-slate-200 shadow-2xs';
                let badgeStyle = 'bg-slate-900 text-white';

                if (hasSubmittedBlitz) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs';
                    badgeStyle = 'bg-white text-emerald-950';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-600 text-white border-rose-600 font-bold';
                    badgeStyle = 'bg-white text-rose-950';
                  } else {
                    btnStyle = 'opacity-40 bg-white/60 text-slate-500 border-slate-200';
                    badgeStyle = 'bg-slate-300 text-slate-700';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasSubmittedBlitz}
                    onClick={() => handleSelectBlitzOption(idx)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 border font-mono-avionics font-medium ${btnStyle}`}
                  >
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${badgeStyle}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug pt-0.5">{option}</span>
                  </button>
                );
              })}
            </div>

            {hasSubmittedBlitz && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-900 space-y-1 animate-fade-in shadow-2xs">
                <div className="font-bold flex items-center gap-1.5">
                  {selectedBlitzOption === currentFact.blitzQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-800 font-bold">{t.correctStandard}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span className="text-rose-800 font-bold">{t.incorrectStandard}</span>
                    </>
                  )}
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed font-medium">
                  {currentFact.blitzQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deep Theory Modal / Sheet */}
      {isTheoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md liquid-glass p-6 text-slate-900 relative shadow-2xl max-h-[90vh] overflow-y-auto space-y-4 border border-white/95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  📖
                </div>
                <div>
                  <h4 className="text-sm font-bold font-cockpit text-slate-950">
                    {language === 'ru' ? 'Экспресс-теория и формулы' : 'Express Theory & Flight Rules'}
                  </h4>
                  <span className="text-[10px] font-mono-avionics text-blue-700 font-bold">
                    {track === 'ab-initio' ? 'Air Astana Pilot Academy' : 'EASA Part-66 Engineering'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsTheoryOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 font-semibold shadow-2xs">
                {currentFact.snippet}
              </div>

              <div className="space-y-1.5">
                <span className="font-mono-avionics text-[11px] uppercase font-bold text-slate-700 block">
                  {language === 'ru' ? 'Теоретический базис и практика Air Astana:' : 'Theoretical Core & Airline Practice:'}
                </span>
                <p className="text-slate-900 leading-relaxed bg-white/90 p-3.5 rounded-xl border border-slate-200 font-medium shadow-2xs">
                  {currentFact.deepTheory}
                </p>
              </div>

              {currentFact.formulaOrRule && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-mono-avionics font-bold uppercase text-amber-900 block">
                    {t.shortcutLabel}
                  </span>
                  <div className="font-mono-avionics font-bold text-xs text-amber-950">
                    {currentFact.formulaOrRule}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsTheoryOpen(false)}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider text-white shadow-md hover:brightness-105 active:scale-[0.98]"
            >
              {language === 'ru' ? 'Понятно, продолжить подготовку' : 'Understood, Continue Training'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
