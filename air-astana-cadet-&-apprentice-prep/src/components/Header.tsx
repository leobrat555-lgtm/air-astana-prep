import React, { useState, useEffect } from 'react';
import {
  Plane,
  Wrench,
  Bot,
  Settings,
  Languages,
  User,
  Sparkles,
  Flame,
} from 'lucide-react';
import { ProgramTrack, LanguageMode } from '../types';
import { CockpitWeatherHud } from './CockpitWeatherHud';
import { translations, getGreeting } from '../utils/i18n';

interface HeaderProps {
  track: ProgramTrack;
  onTrackChange: (t: ProgramTrack) => void;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  onToggleAIDrawer: () => void;
  isAIDrawerOpen: boolean;
  accuracy: number;
  streak: number;
  userName: string;
  hasApiKey: boolean;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  track,
  onTrackChange,
  language,
  onLanguageChange,
  onToggleAIDrawer,
  isAIDrawerOpen,
  accuracy,
  streak,
  userName,
  hasApiKey,
  onOpenSettings,
}) => {
  const [greeting, setGreeting] = useState(() => getGreeting(language));
  const t = translations[language];

  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting(language));
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [language]);

  return (
    <header className="space-y-2.5 pt-2">
      {/* 1. Live Cockpit HUD: Device System Time & Open-Meteo Aviation Weather for Almaty */}
      <CockpitWeatherHud language={language} />

      {/* 2. Secondary Utility Bar: Brand, AI Status Badge, Telemetry & Gear Settings */}
      <div className="liquid-glass-dock px-3.5 py-1.5 flex items-center justify-between text-xs font-mono-avionics text-slate-800 shadow-sm border border-white/95">
        {/* Brand & AI Mode Status */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs font-bold shrink-0">
            {track === 'ab-initio' ? (
              <Plane className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Wrench className="w-3.5 h-3.5 text-sky-200" />
            )}
          </div>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 hover:opacity-85 transition-opacity text-left"
            title={t.settingsTitle}
          >
            {hasApiKey ? (
              <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1.5 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.aiActiveBadgeShort}
              </span>
            ) : (
              <span className="text-[10px] text-slate-700 font-semibold flex items-center gap-1.5 bg-slate-100/90 px-2.5 py-0.5 rounded-full border border-slate-300 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                {t.offlineBadgeShort}
              </span>
            )}
          </button>
        </div>

        {/* Right Controls: Accuracy, Streak, Languages & Settings Gear */}
        <div className="flex items-center gap-1.5">
          {/* Accuracy & Streak */}
          <div className="liquid-glass-nested px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 border border-white/90 font-mono-avionics">
            <span className="font-bold text-blue-700">{accuracy}%</span>
            {streak > 0 && (
              <span className="text-amber-700 font-bold flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                {streak}
              </span>
            )}
          </div>

          {/* Bilingual Toggle Capsule: RU ⟷ EN */}
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-full border border-white/90 text-[10px] font-mono-avionics shadow-inner">
            <button
              onClick={() => onLanguageChange('ru')}
              className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                language === 'ru'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
              title="Переключить на русский язык"
            >
              RU
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
              title="Switch to English"
            >
              EN
            </button>
          </div>

          {/* AI Drawer Trigger */}
          <button
            onClick={onToggleAIDrawer}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isAIDrawerOpen
                ? 'bg-blue-600 text-white shadow-md'
                : 'liquid-glass-nested text-blue-600 hover:bg-white/90 border border-white/90'
            }`}
            title={t.openAiInstructor}
          >
            <Bot className="w-3.5 h-3.5" />
          </button>

          {/* Permanent Settings Gear Icon ⚙️ */}
          <button
            onClick={onOpenSettings}
            className="w-7 h-7 rounded-full liquid-glass-nested hover:bg-white/90 flex items-center justify-center text-slate-700 hover:text-slate-950 transition-all border border-white/90 shadow-xs"
            title={t.settingsTitle}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Dynamic Greeting & Candidate Profile Card */}
      <div className="liquid-glass p-3.5 relative overflow-hidden text-slate-800 border border-white/95 shadow-sm">
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold font-cockpit text-slate-950 tracking-tight">
              <span>{greeting.text}, {userName || t.candidate}</span>
              <span>{greeting.emoji}</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-tight">
              {track === 'ab-initio' ? t.academySubtitlePilot : t.academySubtitleEng}
            </p>
          </div>

          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-xl liquid-glass-nested border border-white/90 flex items-center justify-center hover:bg-white/90 active:scale-95 transition-all shrink-0 shadow-xs"
            title={t.editProfile}
          >
            <User className="w-4 h-4 text-blue-700" />
          </button>
        </div>

        {/* Dual Track Switcher Pill */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 grid grid-cols-2 gap-2">
          <button
            onClick={() => onTrackChange('ab-initio')}
            className={`min-h-[42px] py-1.5 px-3 rounded-xl font-cockpit font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              track === 'ab-initio'
                ? 'liquid-glass-pill-active shadow-sm text-white'
                : 'liquid-glass-nested text-slate-700 hover:text-slate-950 hover:bg-white/90'
            }`}
          >
            <Plane className={`w-3.5 h-3.5 ${track === 'ab-initio' ? 'text-amber-300' : 'text-blue-600'}`} />
            <span>{t.trackAShort}</span>
          </button>

          <button
            onClick={() => onTrackChange('apprentice')}
            className={`min-h-[42px] py-1.5 px-3 rounded-xl font-cockpit font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              track === 'apprentice'
                ? 'liquid-glass-pill-gold shadow-sm text-white'
                : 'liquid-glass-nested text-slate-700 hover:text-slate-950 hover:bg-white/90'
            }`}
          >
            <Wrench className={`w-3.5 h-3.5 ${track === 'apprentice' ? 'text-amber-200' : 'text-amber-600'}`} />
            <span>{t.trackBShort}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
