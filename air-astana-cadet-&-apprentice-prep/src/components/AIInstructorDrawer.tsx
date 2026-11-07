import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  HelpCircle,
  BookOpen,
  PlusCircle,
  Send,
  X,
  ChevronRight,
  ChevronLeft,
  Volume2,
  RefreshCw,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { Question, ProgramTrack, ActiveModule, LanguageMode } from '../types';

interface AIInstructorDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  track: ProgramTrack;
  activeModule: ActiveModule;
  currentQuestion?: Question | null;
  selectedOptionIndex?: number | null;
  isAnswerSubmitted?: boolean;
  onInjectNewQuestion?: (newQuestion: Question) => void;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
}

export const AIInstructorDrawer: React.FC<AIInstructorDrawerProps> = ({
  isOpen,
  onToggle,
  track,
  activeModule,
  currentQuestion,
  selectedOptionIndex,
  onInjectNewQuestion,
  language,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState<'socratic' | 'debrief' | 'generator' | 'consultation'>('socratic');
  const [isLoading, setIsLoading] = useState(false);
  const [hintContent, setHintContent] = useState<string | null>(null);
  const [debriefContent, setDebriefContent] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'instructor'; text: string }>>([
    {
      sender: 'instructor',
      text: track === 'ab-initio'
        ? 'Приветствую, кандидат. Я твой персональный экзаменатор и инструктор отбора Air Astana. Готов разобрать любую задачу COMPASS, формулу глиссады или разобрать ошибки в реальном времени.'
        : 'Приветствую, курсант. Я ведущий инженер-инструктор по программе Air Astana Apprentice EASA Part-66. Задавай вопросы по гидросистемам, закону Паскаля, электрике М3 или регламентам AMM.',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [genDifficulty, setGenDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const getAuthHeaders = () => {
    const key = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : '';
    return {
      'Content-Type': 'application/json',
      ...(key ? { 'x-gemini-api-key': key } : {}),
    };
  };

  const handleRequestHint = async () => {
    if (!currentQuestion) return;
    setIsLoading(true);
    setHintContent(null);
    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          questionText: currentQuestion.question,
          options: currentQuestion.options,
          track,
          category: currentQuestion.category,
          language,
        }),
      });
      const data = await res.json();
      setHintContent(data.hint || data.fallbackHint);
    } catch (err) {
      console.error(err);
      setHintContent('Socratic Guidance: Break down the required units first. If calculating descent rate, recall that 3 degrees corresponds to 5 times groundspeed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestDebrief = async () => {
    if (!currentQuestion) return;
    setIsLoading(true);
    setDebriefContent(null);
    try {
      const selected = selectedOptionIndex !== null && selectedOptionIndex !== undefined
        ? currentQuestion.options[selectedOptionIndex]
        : 'No answer selected yet';
      const correct = currentQuestion.options[currentQuestion.correctAnswerIndex];

      const res = await fetch('/api/ai/debrief', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          questionText: currentQuestion.question,
          options: currentQuestion.options,
          selectedOption: selected,
          correctOption: correct,
          track,
          language,
        }),
      });
      const data = await res.json();
      setDebriefContent(data.debrief || data.fallbackDebrief);
    } catch (err) {
      console.error(err);
      setDebriefContent('Debrief unavailable. Review standard operating manual procedures.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuestion = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/generate-question', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          track,
          moduleType: activeModule,
          category: currentQuestion?.category || 'General Aptitude',
          difficulty: genDifficulty,
        }),
      });
      const data = await res.json();
      if (data.question && onInjectNewQuestion) {
        const generatedQ: Question = {
          id: data.question.id || `gen-${Date.now()}`,
          track,
          module: activeModule === 'dashboard' || activeModule === 'examiner' ? 'psychometrics' : (activeModule as any),
          category: data.question.category || 'AI Generated Assessment',
          difficulty: genDifficulty,
          question: data.question.question,
          contextPassage: data.question.contextPassage,
          options: data.question.options,
          correctAnswerIndex: data.question.correctAnswerIndex ?? 0,
          explanationEn: data.question.explanation || 'Detailed AI step-by-step logic.',
          explanationRu: 'Пошаговый технический разбор от бортового инструктора.',
          formulaShortcut: data.question.formulaShortcut,
          timeLimitSeconds: 30,
        };
        onInjectNewQuestion(generatedQ);
        alert(`New ${genDifficulty} Question Injected into Module!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: userText,
          options: ['Consultation query'],
          track,
          category: 'Direct Consultation',
          language,
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'instructor',
          text: data.hint || data.fallbackHint || 'Understood. Focus on precision and standardized communication.',
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'instructor',
          text: 'Communication link degraded. Maintain standard operating procedures.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Drawer Toggle Handle when collapsed (Floating Liquid Glass Pill) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 liquid-glass-dock rounded-r-none px-2.5 py-5 shadow-2xl flex flex-col items-center gap-2 group hover:scale-105 transition-all border-r-0"
          title="Open AI Instructor Panel"
        >
          <Bot className="w-5 h-5 text-[#E0B85C] group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-rl] text-[10px] font-cockpit font-bold uppercase tracking-wider text-white">
            AI Co-Pilot / Instructor
          </span>
          <ChevronLeft className="w-4 h-4 text-[#E0B85C]" />
        </button>
      )}

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-96 max-w-[92vw] z-50 liquid-glass rounded-l-3xl rounded-r-none border-r-0 flex flex-col transition-transform duration-300 ease-in-out shadow-[-15px_0_50px_rgba(0,0,0,0.7)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full liquid-glass-circle-btn flex items-center justify-center text-[#E0B85C]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cockpit text-sm font-bold text-white uppercase tracking-wide">
                  AI Flight Instructor
                </h3>
                <span className="text-[9px] font-mono-avionics px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                  ONLINE
                </span>
              </div>
              <p className="text-[10px] text-white/60 font-mono-avionics">
                {track === 'ab-initio' ? 'Air Astana Pilot Academy' : 'EASA Part-66 Maintenance'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'ru' : 'en')}
              className="text-[10px] font-mono-avionics px-2.5 py-1 rounded-full liquid-glass-nested text-[#E0B85C] border-white/20"
              title="Toggle AI Language (EN / RU)"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-4 p-1.5 liquid-glass-nested m-3 rounded-full border border-white/10 text-[10px] font-cockpit uppercase">
          <button
            onClick={() => setActiveTab('socratic')}
            className={`py-1.5 px-1 text-center rounded-full transition-all ${
              activeTab === 'socratic'
                ? 'liquid-glass-pill-active font-bold text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Hint
          </button>
          <button
            onClick={() => setActiveTab('debrief')}
            className={`py-1.5 px-1 text-center rounded-full transition-all ${
              activeTab === 'debrief'
                ? 'liquid-glass-pill-active font-bold text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Debrief
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`py-1.5 px-1 text-center rounded-full transition-all ${
              activeTab === 'generator'
                ? 'liquid-glass-pill-active font-bold text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Gen Q
          </button>
          <button
            onClick={() => setActiveTab('consultation')}
            className={`py-1.5 px-1 text-center rounded-full transition-all ${
              activeTab === 'consultation'
                ? 'liquid-glass-pill-active font-bold text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Ask AI
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentQuestion && (
            <div className="liquid-glass-nested p-3 text-xs">
              <div className="flex items-center justify-between text-[10px] text-white/50 mb-1">
                <span className="font-mono-avionics text-[#E0B85C]">{currentQuestion.category}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                  {currentQuestion.difficulty}
                </span>
              </div>
              <p className="text-white/80 line-clamp-2 italic text-[11px]">
                "{currentQuestion.question}"
              </p>
            </div>
          )}

          {/* TAB 1: Socratic Hint */}
          {activeTab === 'socratic' && (
            <div className="space-y-3">
              <div className="liquid-glass-nested p-3.5 text-xs text-amber-200 border-amber-500/30">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <HelpCircle className="w-4 h-4 text-[#E0B85C]" />
                  <span>Socratic Guidance Mode</span>
                </div>
                <p className="text-[11px] text-white/80">
                  Инструктор направляет по физическим законам и математическим лайфхакам, не раскрывая правильный ответ.
                </p>
              </div>

              <button
                disabled={isLoading || !currentQuestion}
                onClick={handleRequestHint}
                className="w-full py-3 rounded-full liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider hover:brightness-110 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#E0B85C]" />
                    <span>Analyzing Flight Physics...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#E0B85C]" />
                    <span>Request Socratic Hint</span>
                  </>
                )}
              </button>

              {hintContent && (
                <div className="liquid-glass-nested p-4 space-y-2 text-xs leading-relaxed text-white/90 animate-fadeIn">
                  <div className="text-[10px] font-mono-avionics text-[#E0B85C] uppercase font-bold">
                    Instructor Step-by-Step Breakdown:
                  </div>
                  <div className="whitespace-pre-line text-xs font-mono-avionics bg-black/40 p-3 rounded-xl border border-white/10 text-emerald-300">
                    {hintContent}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Post-Answer Deep Debrief */}
          {activeTab === 'debrief' && (
            <div className="space-y-3">
              <div className="liquid-glass-nested p-3.5 text-xs text-sky-200 border-sky-500/30">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <span>Post-Answer Deep Debrief</span>
                </div>
                <p className="text-[11px] text-white/80">
                  Разбор ловушек в дистракторах, соответствие регламентам Air Astana и правила быстрого прикидочного счета.
                </p>
              </div>

              <button
                disabled={isLoading || !currentQuestion}
                onClick={handleRequestDebrief}
                className="w-full py-3 rounded-full liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#E0B85C]" />
                    <span>Analyzing Operational Data...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 text-[#E0B85C]" />
                    <span>Generate Deep Technical Debrief</span>
                  </>
                )}
              </button>

              {debriefContent && (
                <div className="liquid-glass-nested p-4 space-y-2 text-xs leading-relaxed text-white/90 animate-fadeIn">
                  <div className="text-[10px] font-mono-avionics text-[#E0B85C] uppercase font-bold">
                    Air Astana Training Captain Debrief:
                  </div>
                  <div className="whitespace-pre-line text-xs text-white/90 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/10">
                    {debriefContent}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Dynamic Question Generator */}
          {activeTab === 'generator' && (
            <div className="space-y-3">
              <div className="liquid-glass-nested p-3.5 text-xs text-purple-200 border-purple-500/30">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <PlusCircle className="w-4 h-4 text-purple-400" />
                  <span>Dynamic AI Question Generator</span>
                </div>
                <p className="text-[11px] text-white/80">
                  Генерация новых вопросов по стандартам SHL/COMPASS для программ Ab-Initio и Apprentice.
                </p>
              </div>

              <div className="liquid-glass-nested p-3 space-y-2 text-xs">
                <label className="text-[10px] text-white/60 uppercase font-mono-avionics block">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setGenDifficulty(lvl)}
                      className={`py-1.5 rounded-full text-xs font-mono-avionics ${
                        genDifficulty === lvl
                          ? 'liquid-glass-pill-active font-bold text-white'
                          : 'liquid-glass-nested text-white/70 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={isLoading}
                onClick={handleGenerateQuestion}
                className="w-full py-3 rounded-full liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider hover:brightness-110 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#E0B85C]" />
                    <span>Generating Air Astana Exam Item...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#E0B85C]" />
                    <span>Generate & Inject Question</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 4: Consultation / Ask AI */}
          {activeTab === 'consultation' && (
            <div className="flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono-avionics text-xs">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl max-w-[88%] text-[11px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'ml-auto liquid-glass-pill-active text-white'
                        : 'mr-auto liquid-glass-nested text-white/90'
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold block mb-1 text-white/50">
                      {msg.sender === 'user' ? 'Candidate' : 'Air Astana Examiner'}
                    </span>
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-2 pt-2 border-t border-white/15 flex gap-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Задайте вопрос экзаменатору..."
                  className="flex-1 liquid-glass-nested px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#E0B85C] rounded-full"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputQuery.trim()}
                  className="w-9 h-9 liquid-glass-circle-btn flex items-center justify-center text-white shrink-0 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
