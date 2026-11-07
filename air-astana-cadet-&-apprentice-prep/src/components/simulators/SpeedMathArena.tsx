import React, { useState, useEffect } from 'react';
import { Timer, Zap, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface MentalMathProblem {
  question: string;
  context: string;
  formulaHint: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const GENERATE_PROBLEMS = (): MentalMathProblem[] => [
  {
    question: 'Groundspeed is 160 knots on a 3° ILS approach. Calculate the required Rate of Descent (ROD).',
    context: 'Standard Formula: ROD (fpm) = GS x 5',
    formulaHint: '160 * 5 = 800 fpm (or 160 / 2 = 80 -> 800)',
    options: ['700 fpm', '750 fpm', '800 fpm', '850 fpm'],
    correctIndex: 2,
    explanation: '160 kts * 5 = 800 fpm.',
  },
  {
    question: 'You are cruising at FL320 and cleared down to 5,000 ft. When do you start descent using the 3:1 rule?',
    context: '3:1 Descent Profile: Altitude to lose / 300',
    formulaHint: '(32,000 - 5,000) = 27,000 ft. 27,000 / 300 = 90 NM.',
    options: ['81 NM', '90 NM', '96 NM', '105 NM'],
    correctIndex: 1,
    explanation: '27,000 ft to lose / 300 = 90 NM (or 27 * 3 = 81 + decelerate).',
  },
  {
    question: 'Fuel burn is 2,400 kg/hr. Initial fuel is 7,000 kg. How much fuel remains after 45 minutes?',
    context: '45 mins = 0.75 hours. Burned = 2,400 * 0.75 = 1,800 kg.',
    formulaHint: '7,000 - 1,800 = 5,200 kg.',
    options: ['5,000 kg', '5,200 kg', '5,400 kg', '5,600 kg'],
    correctIndex: 1,
    explanation: '2,400 * 0.75 = 1,800 kg burned. 7,000 - 1,800 = 5,200 kg.',
  },
  {
    question: 'At 420 knots groundspeed, how many nautical miles does the aircraft cover in 12 minutes?',
    context: 'Speed = 420 NM/hr = 7 NM per minute.',
    formulaHint: '7 NM/min * 12 min = 84 NM.',
    options: ['72 NM', '84 NM', '90 NM', '98 NM'],
    correctIndex: 1,
    explanation: '420 / 60 = 7 NM/min. 7 * 12 = 84 NM.',
  },
  {
    question: 'Runway heading is 090°. Surface wind is 120° at 30 knots. What is the approximate crosswind component?',
    context: 'Angle difference = 30°. sin(30°) = 0.5.',
    formulaHint: 'Crosswind = 30 * 0.5 = 15 knots.',
    options: ['10 kts', '15 kts', '20 kts', '25 kts'],
    correctIndex: 1,
    explanation: '30° angle offset implies 50% of total wind as crosswind: 30 * 0.5 = 15 knots.',
  },
];

export const SpeedMathArena: React.FC = () => {
  const [problems] = useState<MentalMathProblem[]>(GENERATE_PROBLEMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const activeProblem = problems[currentIndex];

  useEffect(() => {
    if (isAnswered || completed) return;
    if (timeLeft <= 0) {
      setIsAnswered(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isAnswered, completed]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === activeProblem.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < problems.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(20);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(20);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="liquid-glass p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/15">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="font-cockpit text-sm font-bold uppercase tracking-wider text-white">
            Rapid Aviation Mental Arithmetic
          </h3>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono-avionics text-white/60">
            {currentIndex + 1}/{problems.length}
          </span>
          <div className={`flex items-center gap-1 font-mono-avionics text-xs font-bold px-3 py-1 rounded-full border ${
            timeLeft <= 5 ? 'bg-rose-500/25 text-rose-300 border-rose-400 animate-pulse' : 'liquid-glass-nested text-[#E0B85C] border-white/20'
          }`}>
            <Timer className="w-3.5 h-3.5" />
            <span>00:{String(timeLeft).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Progress countdown bar */}
      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mb-5 border border-white/10">
        <div
          className={`h-full transition-all duration-1000 ${
            timeLeft <= 5 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]' : 'bg-gradient-to-r from-amber-400 to-[#E0B85C] shadow-[0_0_10px_rgba(245,158,11,0.6)]'
          }`}
          style={{ width: `${(timeLeft / 20) * 100}%` }}
        />
      </div>

      {!completed ? (
        <div>
          <div className="text-sm font-semibold text-white mb-2 leading-relaxed">
            {activeProblem.question}
          </div>
          <div className="text-[11px] text-[#E0B85C] font-mono-avionics mb-5 liquid-glass-nested p-3">
            {activeProblem.context}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {activeProblem.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === activeProblem.correctIndex;

              let btnStyle = 'liquid-glass-nested border-white/10 hover:border-white/30 text-white/90';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-100 font-bold shadow-[0_0_20px_rgba(52,211,153,0.3)]';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-400 text-rose-200';
                } else {
                  btnStyle = 'opacity-35 liquid-glass-nested border-white/5 text-white/40';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(idx)}
                  className={`p-3.5 rounded-2xl border text-xs font-mono-avionics text-left transition-all ${btnStyle} flex items-center justify-between`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="p-4 liquid-glass-nested rounded-2xl text-xs space-y-1.5 mb-4 animate-fadeIn">
              <div className="font-semibold text-white">
                {selectedOption === activeProblem.correctIndex ? (
                  <span className="text-emerald-400">Correct! Air Astana Speed Accuracy Passed</span>
                ) : (
                  <span className="text-rose-400">
                    {selectedOption === null ? 'Time Expired!' : 'Incorrect Choice'}
                  </span>
                )}
              </div>
              <p className="text-white/80">{activeProblem.explanation}</p>
              <div className="text-[10px] text-[#E0B85C] font-mono-avionics">
                Cockpit Shortcut: {activeProblem.formulaHint}
              </div>
            </div>
          )}

          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full py-3 liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-1.5 hover:brightness-110 shadow-lg"
            >
              <span>{currentIndex + 1 === problems.length ? 'View Final Results' : 'Next Arithmetic Target'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="text-4xl font-mono-avionics font-bold text-[#E0B85C] mb-2">
            {score} / {problems.length}
          </div>
          <div className="text-xs uppercase font-cockpit text-white tracking-wider mb-2">
            {score >= 4 ? 'Aviation Mental Math Proficiency: HIGH' : 'Mental Math Hesitation Detected'}
          </div>
          <p className="text-xs text-white/70 max-w-xs mx-auto mb-5">
            Air Astana COMPASS screening tests allow no paper notes. Keep practicing the rule of 60 and GS x 5 formulas.
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 liquid-glass-pill-active font-cockpit font-bold text-xs uppercase rounded-full"
          >
            Run Speed Drill Again
          </button>
        </div>
      )}
    </div>
  );
};
