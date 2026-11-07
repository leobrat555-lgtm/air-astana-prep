import React, { useState } from 'react';
import { Wrench, CheckCircle, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { PRACTICAL_BENCH_TASKS } from '../data/questions';

export const HangarBenchView: React.FC = () => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const activeTask = PRACTICAL_BENCH_TASKS[currentTaskIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === activeTask.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentTaskIndex + 1 < PRACTICAL_BENCH_TASKS.length) {
      setCurrentTaskIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      alert(`Practical Bench Complete! Score: ${score} / ${PRACTICAL_BENCH_TASKS.length}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="liquid-glass p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-avionics text-xs font-bold border border-emerald-400/30">
              EASA PART-66 / PART-145 BENCH
            </span>
            <span className="text-xs text-white/60 font-mono-avionics">
              Standard Practices ATA 20 & Hangar Hand-Skills
            </span>
          </div>
          <h2 className="text-xl font-bold font-cockpit text-white">
            Practical Aircraft Maintenance Bench Test
          </h2>
          <p className="text-xs text-white/70 mt-1">
            Safety-wire locking geometry, torque wrench extension calibration, and airworthiness defect troubleshooting.
          </p>
        </div>
        <div className="text-right font-mono-avionics text-xs">
          <span className="text-white/50">TASK: </span>
          <span className="text-[#E0B85C] font-bold text-sm">{currentTaskIndex + 1} / {PRACTICAL_BENCH_TASKS.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Component & Task Scenario */}
        <div className="lg:col-span-7 space-y-4">
          <div className="liquid-glass p-6">
            <div className="flex items-center justify-between text-xs font-mono-avionics text-[#E0B85C] mb-3">
              <span className="font-bold">{activeTask.title}</span>
              <span className="px-2.5 py-0.5 rounded-full liquid-glass-nested text-white/80">{activeTask.ataChapter}</span>
            </div>

            <div className="liquid-glass-nested p-4 mb-4 font-mono-avionics text-xs space-y-3">
              <div>
                <div className="text-white/50 mb-0.5 uppercase font-bold text-[10px]">Component & Spec:</div>
                <div className="text-white font-semibold">{activeTask.component}</div>
              </div>
              <div>
                <div className="text-white/50 mb-0.5 uppercase font-bold text-[10px]">Scenario:</div>
                <div className="text-white/85 leading-relaxed">{activeTask.scenario}</div>
              </div>
              <div>
                <div className="text-white/50 mb-0.5 uppercase font-bold text-[10px]">Technical Directive:</div>
                <div className="text-amber-300">{activeTask.instruction}</div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {activeTask.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === activeTask.correctIndex;

                let style = 'liquid-glass-nested border-white/10 hover:border-white/25 text-white/90';
                if (isAnswered) {
                  if (isCorrect) {
                    style = 'bg-emerald-950/80 border-emerald-400 text-emerald-100 font-bold shadow-[0_0_20px_rgba(52,211,153,0.3)]';
                  } else if (isSelected) {
                    style = 'bg-rose-950/80 border-rose-400 text-rose-200';
                  } else {
                    style = 'opacity-35 liquid-glass-nested border-white/5 text-white/40';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs font-mono-avionics transition-all flex items-center justify-between ${style}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <button
                onClick={handleNext}
                className="mt-5 w-full py-3 liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider rounded-full hover:brightness-110 flex items-center justify-center gap-2"
              >
                <span>{currentTaskIndex + 1 < PRACTICAL_BENCH_TASKS.length ? 'Next Bench Scenario' : 'Bench Drill Complete'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Technical Explanation & Safety Check */}
        <div className="lg:col-span-5 space-y-4">
          <div className="liquid-glass p-6 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-cockpit text-emerald-400 font-bold uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>EASA Part-145 Airworthiness Check</span>
            </div>

            <div className="liquid-glass-nested p-4 text-xs">
              <span className="text-[10px] font-mono-avionics text-[#E0B85C] uppercase font-bold block mb-1">
                Mandatory Quality Safety Protocol:
              </span>
              <p className="text-white/85 font-mono-avionics text-[11px] leading-relaxed">
                {activeTask.safetyCheck}
              </p>
            </div>

            {isAnswered && (
              <div className="liquid-glass-nested p-4 text-xs animate-fadeIn">
                <span className="text-[10px] font-mono-avionics text-sky-300 uppercase font-bold block mb-1">
                  Technical Standard Explanation:
                </span>
                <p className="text-white/85 text-[11px] leading-relaxed">
                  {activeTask.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
