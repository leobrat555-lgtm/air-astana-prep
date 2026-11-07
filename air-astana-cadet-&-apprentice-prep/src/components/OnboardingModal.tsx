import React, { useState, useEffect } from 'react';
import { Plane, Wrench, Sparkles, Check, User, Key, ExternalLink, ShieldCheck, ArrowRight, Languages } from 'lucide-react';
import { ProgramTrack, LanguageMode } from '../types';
import { translations } from '../utils/i18n';

interface OnboardingModalProps {
  isOpen: boolean;
  currentName: string;
  currentTrack: ProgramTrack;
  language?: LanguageMode;
  onLanguageChange?: (lang: LanguageMode) => void;
  onComplete: (name: string, track: ProgramTrack, apiKey?: string) => void;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  currentName,
  currentTrack,
  language = 'ru',
  onLanguageChange,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState(currentName || '');
  const [selectedTrack, setSelectedTrack] = useState<ProgramTrack>(currentTrack || 'ab-initio');
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const t = translations[language];

  useEffect(() => {
    if (isOpen) {
      if (currentName) setName(currentName);
      if (currentTrack) setSelectedTrack(currentTrack);
    }
  }, [isOpen, currentName, currentTrack]);

  if (!isOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep(2);
  };

  const handleActivateKey = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setValidationError(language === 'ru' ? 'Пожалуйста, вставьте скопированный ключ' : 'Please paste your copied API key');
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const res = await fetch('/api/ai/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': trimmed,
        },
        body: JSON.stringify({ apiKey: trimmed }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        onComplete(name.trim(), selectedTrack, trimmed);
      } else {
        setValidationError(data.error || (language === 'ru' ? 'Не удалось активировать ключ. Проверьте правильность.' : 'Failed to validate key. Please check key correctness.'));
      }
    } catch (err: any) {
      onComplete(name.trim(), selectedTrack, trimmed);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSkipKey = () => {
    onComplete(name.trim(), selectedTrack, undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm liquid-glass p-6 sm:p-7 relative overflow-hidden text-slate-900 shadow-2xl border border-white/95">
        {/* Top bar with RU / EN switcher and steps */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`h-1.5 rounded-full transition-all ${step === 1 ? 'w-8 bg-blue-600' : 'w-3 bg-slate-300'}`} />
            <div className={`h-1.5 rounded-full transition-all ${step === 2 ? 'w-8 bg-blue-600' : 'w-3 bg-slate-300'}`} />
          </div>

          {onLanguageChange && (
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-full border border-white/90 text-[10px] font-mono-avionics shadow-inner">
              <button
                type="button"
                onClick={() => onLanguageChange('ru')}
                className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                  language === 'ru' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                RU
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                  language === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                EN
              </button>
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-xs mb-2">
                <span className="text-2xl">✈️</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-cockpit text-slate-950 tracking-tight">
                {t.onboardWelcome}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {t.onboardStep1Title}
              </p>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono-avionics uppercase font-bold text-slate-700 tracking-wider block">
                  {t.candidateNameLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.onboardNamePlaceholder}
                    autoFocus
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white/95 border border-slate-300 text-sm font-semibold text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono-avionics uppercase font-bold text-slate-700 tracking-wider block">
                  {t.onboardTargetTrack}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTrack('ab-initio')}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      selectedTrack === 'ab-initio'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-400/40'
                        : 'bg-white/85 text-slate-800 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <Plane className={`w-4 h-4 mb-1.5 ${selectedTrack === 'ab-initio' ? 'text-white' : 'text-blue-600'}`} />
                    <div className="text-xs font-bold leading-tight">{t.trackAShort}</div>
                    <div className={`text-[10px] ${selectedTrack === 'ab-initio' ? 'text-blue-100' : 'text-slate-600'}`}>
                      {t.cadetPilot}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTrack('apprentice')}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      selectedTrack === 'apprentice'
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-white/85 text-slate-800 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <Wrench className={`w-4 h-4 mb-1.5 ${selectedTrack === 'apprentice' ? 'text-white' : 'text-amber-600'}`} />
                    <div className="text-xs font-bold leading-tight">{t.trackBShort}</div>
                    <div className={`text-[10px] ${selectedTrack === 'apprentice' ? 'text-amber-100' : 'text-slate-600'}`}>
                      {t.easaEngineer}
                    </div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full min-h-[48px] py-3 px-4 rounded-2xl liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider text-white shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{t.onboardNextStep}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shadow-sm mb-1">
                <Sparkles className="w-6 h-6 text-blue-700" />
              </div>
              <h2 className="text-base sm:text-lg font-bold font-cockpit text-slate-950 tracking-tight leading-snug">
                {t.onboardStep2Title}
              </h2>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                {t.onboardStep2Desc}
              </p>
            </div>

            {/* Instruction Card */}
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2 text-xs shadow-2xs">
              <div className="font-bold text-blue-950 flex items-center gap-1.5 text-[11px]">
                <Key className="w-3.5 h-3.5 text-blue-700" />
                <span>{t.onboardGuideTitle}</span>
              </div>
              <ol className="space-y-1 text-[11px] text-blue-900 list-decimal list-inside leading-relaxed font-medium">
                <li>
                  {t.onboardGuideStep1}{' '}
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline text-blue-700 hover:text-blue-950 inline-flex items-center gap-0.5"
                  >
                    Google AI Studio <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>{t.onboardGuideStep2}</li>
              </ol>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono-avionics uppercase font-bold text-slate-700 tracking-wider block">
                {t.apiKeyLabel}
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setValidationError(null);
                }}
                placeholder={t.keyPlaceholder}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/95 border border-slate-300 text-sm font-mono-avionics text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
              {validationError && (
                <div className="text-[11px] text-rose-700 font-bold">
                  {validationError}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleActivateKey}
                disabled={isValidating || !apiKey.trim()}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-2xl liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider text-white shadow-md hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isValidating ? t.testingKey : t.onboardActivateBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleSkipKey}
                className="w-full min-h-[40px] py-2 px-3 rounded-2xl bg-white/80 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-950 text-xs font-cockpit font-bold flex items-center justify-center transition-all shadow-xs"
              >
                {t.onboardSkipBtn}
              </button>
            </div>

            <div className="text-[10px] text-slate-600 font-medium text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.keyPrivacyNotice}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
