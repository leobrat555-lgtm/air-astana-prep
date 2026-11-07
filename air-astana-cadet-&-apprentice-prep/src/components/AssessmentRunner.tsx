import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Volume2,
  FileText,
  Languages,
} from 'lucide-react';
import { Question, ProgramTrack, ActiveModule, UserAttempt, LanguageMode } from '../types';
import { AttitudeIndicator } from './simulators/AttitudeIndicator';
import { CubeFoldingSimulator } from './simulators/CubeFoldingSimulator';
import { translations } from '../utils/i18n';

interface AssessmentRunnerProps {
  questions: Question[];
  track: ProgramTrack;
  activeModule: ActiveModule;
  language: LanguageMode;
  onLanguageToggle: () => void;
  onOpenAIHint: (question: Question, selectedIndex: number | null) => void;
  onOpenAIDebrief: (question: Question, selectedIndex: number | null) => void;
  onRecordAttempt: (attempt: UserAttempt) => void;
}

export const AssessmentRunner: React.FC<AssessmentRunnerProps> = ({
  questions,
  track,
  activeModule,
  language,
  onLanguageToggle,
  onOpenAIHint,
  onOpenAIDebrief,
  onRecordAttempt,
}) => {
  const t = translations[language];

  // Filter questions for current track and active module
  const filteredQuestions = questions.filter(
    (q) => (q.track === track || q.track === 'both') && q.module === activeModule
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [explanationLang, setExplanationLang] = useState<LanguageMode>(language);

  // Sync explanation language when global language changes
  useEffect(() => {
    setExplanationLang(language);
  }, [language]);

  const activeQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Countdown Timer
  useEffect(() => {
    if (!activeQuestion || isAnswered || sessionCompleted) return;

    setTimeLeft(activeQuestion.timeLimitSeconds || 25);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, activeQuestion, isAnswered, sessionCompleted]);

  const handleTimeExpire = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(null);

    if (activeQuestion) {
      onRecordAttempt({
        questionId: activeQuestion.id,
        category: activeQuestion.category,
        module: activeQuestion.module,
        track,
        selectedOptionIndex: -1,
        correctAnswerIndex: activeQuestion.correctAnswerIndex,
        isCorrect: false,
        timeSpentSeconds: activeQuestion.timeLimitSeconds || 25,
        timestamp: Date.now(),
      });
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === activeQuestion.correctAnswerIndex;
    if (isCorrect) {
      setSessionScore((prev) => prev + 1);
    }

    const timeSpent = (activeQuestion.timeLimitSeconds || 25) - timeLeft;

    onRecordAttempt({
      questionId: activeQuestion.id,
      category: activeQuestion.category,
      module: activeQuestion.module,
      track,
      selectedOptionIndex: idx,
      correctAnswerIndex: activeQuestion.correctAnswerIndex,
      isCorrect,
      timeSpentSeconds: Math.max(1, timeSpent),
      timestamp: Date.now(),
    });
  };

  const handleNext = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setSessionCompleted(false);
    setSessionScore(0);
  };

  if (!activeQuestion || filteredQuestions.length === 0) {
    return (
      <div className="liquid-glass p-8 text-center text-slate-800 space-y-4 border border-white/95 shadow-md">
        <h3 className="font-cockpit text-lg font-bold text-slate-950">
          {language === 'ru' ? 'Модуль формируется...' : 'Preparing assessment module...'}
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          {language === 'ru'
            ? 'Для выбранного трека подготавливается банк вопросов Air Astana.'
            : 'Generating Air Astana testing scenarios for this program track.'}
        </p>
        <button
          onClick={handleRestart}
          className="px-6 py-2.5 rounded-full liquid-glass-pill-active font-cockpit text-xs font-bold uppercase tracking-wider text-white shadow-md"
        >
          {t.restartModuleBtn}
        </button>
      </div>
    );
  }

  // Session Completed Summary Screen
  if (sessionCompleted) {
    const total = filteredQuestions.length;
    const percentage = Math.round((sessionScore / total) * 100);
    const passed = percentage >= 75;

    return (
      <div className="liquid-glass p-6 sm:p-8 space-y-6 text-slate-800 border border-white/95 shadow-xl animate-fadeIn">
        <div className="text-center space-y-2">
          <div
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center border shadow-md ${
              passed
                ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                : 'bg-amber-100 border-amber-300 text-amber-700'
            }`}
          >
            {passed ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>
          <h2 className="font-cockpit text-xl sm:text-2xl font-bold text-slate-950 uppercase tracking-tight">
            {t.summaryTitle}
          </h2>
          <p className="text-xs text-slate-600">
            {track === 'ab-initio' ? t.trackA : t.trackB} • {activeModule.toUpperCase()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto font-mono-avionics text-center">
          <div className="liquid-glass-nested p-4 bg-white/80 border border-white shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              {t.summaryScore}
            </span>
            <div className={`text-3xl font-bold ${passed ? 'text-emerald-700' : 'text-amber-700'}`}>
              {percentage}%
            </div>
            <span className="text-[10px] text-slate-600 mt-0.5 block">
              {sessionScore} / {total}
            </span>
          </div>
          <div className="liquid-glass-nested p-4 bg-white/80 border border-white shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              {t.passingTarget}
            </span>
            <div className="text-3xl font-bold text-blue-700">75%</div>
            <span className="text-[10px] text-slate-600 mt-0.5 block">
              Air Astana Screening
            </span>
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl text-xs font-medium leading-relaxed max-w-md mx-auto border ${
            passed
              ? 'bg-emerald-50/90 text-emerald-950 border-emerald-200'
              : 'bg-amber-50/90 text-amber-950 border-amber-200'
          }`}
        >
          {passed ? t.summaryPassed : t.summaryNeedsWork}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-full liquid-glass-pill-active font-cockpit text-xs font-bold uppercase tracking-wider text-white shadow-md flex items-center gap-2 hover:brightness-105 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.restartModuleBtn}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Question Card (High Contrast) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="liquid-glass p-5 sm:p-6 relative overflow-hidden border border-white/95 shadow-lg text-slate-900">
            {/* Top Bar: Category, Difficulty, Hint Button & Timer */}
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200/80 flex-wrap">
              <div className="space-y-0.5">
                <span className="text-xs font-cockpit text-blue-700 font-bold uppercase tracking-wider block">
                  {activeQuestion.category}
                </span>
                <span className="text-[11px] font-mono-avionics text-slate-600 font-medium">
                  {language === 'ru' ? 'Сложность: ' : 'Difficulty: '}
                  <strong className="text-slate-900 font-bold">{activeQuestion.difficulty}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Glowing Socratic Hint Button */}
                <button
                  onClick={() => onOpenAIHint(activeQuestion, selectedOption)}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-cockpit font-bold text-xs uppercase tracking-wider shadow-sm shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-1.5"
                  title={t.hintTitle}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                  <span>{t.hintBtn}</span>
                </button>

                <span className="text-xs font-mono-avionics text-slate-700 font-bold hidden sm:inline">
                  {currentIndex + 1} {t.ofTotal} {filteredQuestions.length}
                </span>

                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono-avionics text-xs font-bold border ${
                    timeLeft <= 5
                      ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                      : 'liquid-glass-nested text-blue-800 border-white/90 shadow-xs'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>00:{String(timeLeft).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            {/* Question Statement (Dark, Crisp & High Contrast) */}
            <h2 className="text-sm sm:text-base font-semibold text-slate-950 leading-relaxed mb-4">
              {activeQuestion.question}
            </h2>

            {/* Context Passage / Operational Document */}
            {activeQuestion.contextPassage && (
              <div className="liquid-glass-nested p-3.5 mb-4 text-xs text-slate-800 font-mono-avionics leading-relaxed flex items-start gap-2.5 border border-slate-300 shadow-xs bg-white/85">
                <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-600 uppercase font-bold block mb-0.5">
                    Operational Context / Document
                  </span>
                  {activeQuestion.contextPassage}
                </div>
              </div>
            )}

            {/* Diagram / Instrument Embeds */}
            {activeQuestion.diagramType === 'gauge' && activeQuestion.diagramData && (
              <div className="my-5 p-4 liquid-glass-nested flex justify-center bg-white/80 border border-white">
                <AttitudeIndicator
                  pitchDeg={activeQuestion.diagramData.pitchDeg}
                  bankDeg={activeQuestion.diagramData.bankDeg}
                  headingDeg={activeQuestion.diagramData.headingDeg}
                />
              </div>
            )}

            {activeQuestion.diagramType === 'cube' && (
              <div className="my-5">
                <CubeFoldingSimulator />
              </div>
            )}

            {/* Audio Transcript / Frequency Readback */}
            {activeQuestion.diagramType === 'audio-transcript' && activeQuestion.diagramData && (
              <div className="my-4 p-4 liquid-glass-nested border-blue-300/80 bg-white/90 flex items-start gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 border border-blue-200">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div className="font-mono-avionics text-xs">
                  <span className="text-blue-800 font-bold block mb-1">
                    ATC AUDIO FREQUENCY READBACK [{activeQuestion.diagramData.speaker}]
                  </span>
                  <p className="text-slate-950 font-semibold italic text-sm">
                    "{activeQuestion.diagramData.audioText}"
                  </p>
                </div>
              </div>
            )}

            {/* High-Contrast Hydraulic Diagram Subplate */}
            {activeQuestion.diagramType === 'hydraulic' && activeQuestion.diagramData && (
              <div className="my-4 p-3.5 liquid-glass-nested font-mono-avionics text-xs grid grid-cols-2 md:grid-cols-4 gap-2 text-center bg-white/90 border border-slate-200 shadow-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Input Force</span>
                  <span className="text-amber-700 font-bold text-sm">{activeQuestion.diagramData.inputForce}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Master Area</span>
                  <span className="text-slate-900 font-bold text-sm">{activeQuestion.diagramData.inputArea}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Slave Area</span>
                  <span className="text-slate-900 font-bold text-sm">{activeQuestion.diagramData.outputArea}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Hydraulic Fluid</span>
                  <span className="text-emerald-700 font-bold text-sm">{activeQuestion.diagramData.fluid}</span>
                </div>
              </div>
            )}

            {/* High-Contrast Circuit Diagram Subplate */}
            {activeQuestion.diagramType === 'circuit' && activeQuestion.diagramData && (
              <div className="my-4 p-3.5 liquid-glass-nested font-mono-avionics text-xs grid grid-cols-3 gap-2 text-center bg-white/90 border border-slate-200 shadow-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">DC Bus Voltage</span>
                  <span className="text-blue-700 font-bold text-sm">{activeQuestion.diagramData.busVoltage}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Coil Resistance</span>
                  <span className="text-amber-700 font-bold text-sm">{activeQuestion.diagramData.resistance}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Component</span>
                  <span className="text-slate-900 font-bold text-sm">{activeQuestion.diagramData.component}</span>
                </div>
              </div>
            )}

            {/* Options List (Ultra-High Contrast with Dedicated Letter Badges) */}
            <div className="space-y-3">
              {activeQuestion.options.map((optionText, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === activeQuestion.correctAnswerIndex;

                let optionStyle = 'bg-white/90 hover:bg-white border-slate-200/90 text-slate-900 shadow-xs hover:border-blue-300';
                let badgeStyle = 'bg-slate-900 text-white';

                if (isAnswered) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-md';
                    badgeStyle = 'bg-white text-emerald-950 font-bold';
                  } else if (isSelected) {
                    optionStyle = 'bg-rose-600 text-white border-rose-600 font-semibold shadow-md';
                    badgeStyle = 'bg-white text-rose-950 font-bold';
                  } else {
                    optionStyle = 'opacity-40 bg-white/50 border-slate-200 text-slate-500';
                    badgeStyle = 'bg-slate-300 text-slate-700';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs font-mono-avionics transition-all flex items-center justify-between group active:scale-[0.99] ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 shadow-xs transition-colors ${badgeStyle}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-snug">{optionText}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-2" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-white shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Post-Answer Feedback & Bilingual Explanation */}
            {isAnswered && (
              <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-cockpit font-bold uppercase tracking-wider flex items-center gap-2">
                    {selectedOption === activeQuestion.correctAnswerIndex ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 shadow-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t.correctAnswer}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1.5 shadow-xs font-bold">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> {t.incorrectAnswer}
                      </span>
                    )}
                  </span>

                  {/* Bilingual toggle button for explanation */}
                  <div className="flex items-center gap-1 text-[11px] font-mono-avionics liquid-glass-nested px-2 py-0.5 rounded-full border border-white/90 shadow-2xs">
                    <Languages className="w-3 h-3 text-blue-600" />
                    <button
                      onClick={() => setExplanationLang('ru')}
                      className={`px-1.5 py-0.5 rounded-md font-bold transition-all ${
                        explanationLang === 'ru' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      RU
                    </button>
                    <button
                      onClick={() => setExplanationLang('en')}
                      className={`px-1.5 py-0.5 rounded-md font-bold transition-all ${
                        explanationLang === 'en' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                {/* Explanation text (High Contrast Dark Slate) */}
                <div className="liquid-glass-nested p-3.5 text-xs text-slate-900 leading-relaxed font-mono-avionics bg-white/90 border border-slate-200 shadow-2xs">
                  {explanationLang === 'en' ? activeQuestion.explanationEn : activeQuestion.explanationRu}
                </div>

                {activeQuestion.formulaShortcut && (
                  <div className="p-3 rounded-xl bg-amber-50/95 border border-amber-300 text-xs text-amber-950 font-mono-avionics shadow-2xs">
                    <span className="font-bold text-amber-900">{t.shortcutLabel} </span>
                    {activeQuestion.formulaShortcut}
                  </div>
                )}

                {/* Actions bar */}
                <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
                  <button
                    onClick={() => onOpenAIDebrief(activeQuestion, selectedOption)}
                    className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-mono-avionics font-bold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>{t.debriefAiBtn}</span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider text-white hover:brightness-105 active:scale-95 flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <span>{t.nextQuestionBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Guidance & Air Astana Criteria (High Contrast) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="liquid-glass p-5 space-y-3 border border-white/95 shadow-md text-slate-800">
            <div className="flex items-center gap-2 text-xs font-cockpit text-amber-700 font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>{t.socraticBoxTitle}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {t.socraticBoxDesc}
            </p>
            <button
              onClick={() => onOpenAIHint(activeQuestion, selectedOption)}
              className="w-full py-2.5 rounded-full liquid-glass-pill-active font-mono-avionics font-bold text-xs flex items-center justify-center gap-2 text-white shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{t.hintBtn}</span>
            </button>
          </div>

          <div className="liquid-glass p-5 space-y-3 text-xs font-mono-avionics border border-white/95 shadow-md text-slate-800">
            <div className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
              {t.criteriaBoxTitle}
            </div>
            <ul className="space-y-2 text-slate-700 text-[11px] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>{t.crit1}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>{t.crit2}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>{t.crit3}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
