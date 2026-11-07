import React, { useState, useEffect } from 'react';
import { Settings, Key, Check, Trash2, ExternalLink, ShieldCheck, User, Plane, Wrench, X } from 'lucide-react';
import { ProgramTrack, LanguageMode } from '../types';
import { translations } from '../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentTrack: ProgramTrack;
  currentApiKey?: string;
  language?: LanguageMode;
  onLanguageChange?: (lang: LanguageMode) => void;
  onSaveProfile: (name: string, track: ProgramTrack, apiKey?: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentName,
  currentTrack,
  currentApiKey,
  language = 'ru',
  onLanguageChange,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentName);
  const [track, setTrack] = useState<ProgramTrack>(currentTrack);
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{ success: boolean; message: string } | null>(null);

  const t = translations[language];

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setTrack(currentTrack);
      setApiKey(currentApiKey || '');
      setValidationStatus(null);
    }
  }, [isOpen, currentName, currentTrack, currentApiKey]);

  if (!isOpen) return null;

  const hasActiveKey = Boolean(apiKey && apiKey.trim().length > 10);

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setValidationStatus({ success: false, message: language === 'ru' ? 'Ключ не введен' : 'No key provided' });
      return;
    }
    setIsValidating(true);
    setValidationStatus(null);
    try {
      const res = await fetch('/api/ai/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey.trim(),
        },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setValidationStatus({
          success: true,
          message: language === 'ru' ? '🟢 Ключ валиден и готов к работе!' : '🟢 API Key verified and active!',
        });
      } else {
        setValidationStatus({
          success: false,
          message: data.error || (language === 'ru' ? 'Ошибка проверки ключа' : 'Key validation error'),
        });
      }
    } catch (e: any) {
      setValidationStatus({
        success: false,
        message: language === 'ru' ? 'Сетевая ошибка при проверке' : 'Network error verifying key',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    onSaveProfile(name.trim() || t.candidate, track, apiKey.trim() || undefined);
    onClose();
  };

  const handleRemoveKey = () => {
    setApiKey('');
    setValidationStatus({
      success: false,
      message: language === 'ru' ? '⚪ Ключ удален. Режим переключен на Офлайн.' : '⚪ Key removed. Switched to offline mode.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm liquid-glass p-6 relative overflow-hidden text-slate-900 shadow-2xl border border-white/95 max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cockpit text-sm font-bold text-slate-950">
                {t.settingsModalTitle}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                {hasActiveKey ? (
                  <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t.aiActiveBadge}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-700 font-semibold flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {t.offlineBadge}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Candidate Name Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono-avionics uppercase font-bold text-slate-700 tracking-wider block">
            {t.candidateNameLabel}
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.candidateNamePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/95 border border-slate-300 text-xs font-semibold text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
            <User className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Track Switcher */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono-avionics uppercase font-bold text-slate-700 tracking-wider block">
            {t.programTrackLabel}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTrack('ab-initio')}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                track === 'ab-initio'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-white/85 text-slate-800 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5 font-cockpit font-bold text-xs">
                <Plane className="w-3.5 h-3.5" />
                <span>{t.trackAShort}</span>
              </div>
              <span className={`text-[10px] block mt-0.5 ${track === 'ab-initio' ? 'text-blue-100' : 'text-slate-600'}`}>
                {t.cadetPilot}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTrack('apprentice')}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                track === 'apprentice'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                  : 'bg-white/85 text-slate-800 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5 font-cockpit font-bold text-xs">
                <Wrench className="w-3.5 h-3.5" />
                <span>{t.trackBShort}</span>
              </div>
              <span className={`text-[10px] block mt-0.5 ${track === 'apprentice' ? 'text-amber-100' : 'text-slate-600'}`}>
                {t.easaEngineer}
              </span>
            </button>
          </div>
        </div>

        {/* Gemini API Key Management */}
        <div className="space-y-2 pt-1 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono-avionics uppercase font-bold text-slate-700 tracking-wider flex items-center gap-1">
              <Key className="w-3 h-3 text-blue-700" />
              <span>{t.apiKeyLabel}</span>
            </label>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold text-blue-700 hover:text-blue-900 underline inline-flex items-center gap-0.5"
            >
              {t.getKeyLink} <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="relative">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setValidationStatus(null);
              }}
              placeholder={t.keyPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/95 border border-slate-300 text-xs font-mono-avionics text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isValidating || !apiKey.trim()}
              className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-mono-avionics font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isValidating ? (
                <span>{t.testingKey}</span>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-blue-700" />
                  <span>{t.testKeyBtn}</span>
                </>
              )}
            </button>

            {apiKey && (
              <button
                type="button"
                onClick={handleRemoveKey}
                title={t.removeKeyBtn}
                className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-mono-avionics font-semibold flex items-center justify-center transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {validationStatus && (
            <div
              className={`p-2.5 rounded-xl text-xs font-medium leading-tight ${
                validationStatus.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {validationStatus.message}
            </div>
          )}

          <div className="text-[10px] text-slate-600 font-medium leading-snug flex items-start gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{t.keyPrivacyNotice}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider text-white shadow-md hover:brightness-105 active:scale-[0.98] transition-all"
          >
            {t.saveSettingsBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
