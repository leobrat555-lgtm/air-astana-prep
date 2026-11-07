import React from 'react';
import {
  Home,
  CheckSquare,
  Zap,
  BookOpen,
  Award,
} from 'lucide-react';
import { ActiveModule, LanguageMode } from '../types';
import { translations } from '../utils/i18n';

interface BottomNavProps {
  activeModule: ActiveModule;
  onModuleChange: (mod: ActiveModule) => void;
  language?: LanguageMode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeModule,
  onModuleChange,
  language = 'ru',
}) => {
  const t = translations[language];

  const isPracticeActive =
    activeModule === 'english' ||
    activeModule === 'psychometrics' ||
    activeModule === 'cognitive';

  return (
    <div className="fixed bottom-5 inset-x-4 max-w-md mx-auto z-40">
      <nav className="liquid-glass-dock px-2 py-2 flex items-center justify-around shadow-2xl border border-white/95">
        {/* Tab 1: Dashboard / Home */}
        <button
          onClick={() => onModuleChange('dashboard')}
          className={`flex-1 min-h-[48px] py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            activeModule === 'dashboard'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
          }`}
          title={t.navHome}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-cockpit font-bold uppercase tracking-tight">
            {t.navHome}
          </span>
        </button>

        {/* Tab 2: Stages Roadmap */}
        <button
          onClick={() => onModuleChange('stages')}
          className={`flex-1 min-h-[48px] py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            activeModule === 'stages'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
          }`}
          title={t.navStages}
        >
          <CheckSquare className="w-4 h-4" />
          <span className="text-[10px] font-cockpit font-bold uppercase tracking-tight">
            {t.navStages}
          </span>
        </button>

        {/* Tab 3: Central Highlighted Examiner */}
        <button
          onClick={() => onModuleChange('examiner')}
          className={`flex-1 min-h-[48px] py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            activeModule === 'examiner'
              ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/30'
              : 'text-amber-800 hover:text-amber-950 hover:bg-amber-100/50'
          }`}
          title={t.navTrainer}
        >
          <Zap className="w-4 h-4" />
          <span className="text-[10px] font-cockpit font-bold uppercase tracking-tight">
            {t.navTrainer}
          </span>
        </button>

        {/* Tab 4: Practice Labs */}
        <button
          onClick={() => onModuleChange('english')}
          className={`flex-1 min-h-[48px] py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            isPracticeActive
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
          }`}
          title={t.navTests}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px] font-cockpit font-bold uppercase tracking-tight">
            {t.navTests}
          </span>
        </button>

        {/* Tab 5: Final Stage / Interview */}
        <button
          onClick={() => onModuleChange('interview')}
          className={`flex-1 min-h-[48px] py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            activeModule === 'interview'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
          }`}
          title={t.navInterview}
        >
          <Award className="w-4 h-4" />
          <span className="text-[10px] font-cockpit font-bold uppercase tracking-tight">
            {t.navInterview}
          </span>
        </button>
      </nav>
    </div>
  );
};
