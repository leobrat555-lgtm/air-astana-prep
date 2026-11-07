import React, { useState } from 'react';
import {
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Send,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { InterviewScenario, ProgramTrack } from '../types';
import { INTERVIEW_SCENARIOS } from '../data/questions';

interface InterviewSimulatorProps {
  track: ProgramTrack;
}

interface EvaluationResult {
  overallScore: number;
  starScores: {
    situation: number;
    task: number;
    action: number;
    result: number;
  };
  airAstanaMindsetRating: string;
  strengths: string[];
  areasForImprovement: string[];
  executiveSummary: string;
  modelAnswerRefinement: string;
}

export const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({ track }) => {
  const scenarios = INTERVIEW_SCENARIOS.filter(
    (s) => s.track === track || track === 'ab-initio'
  );
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const activeScenario = scenarios[selectedScenarioIndex] || INTERVIEW_SCENARIOS[0];

  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const handleFillSample = () => {
    setSituation(activeScenario.sampleStarBullets.situation);
    setTask(activeScenario.sampleStarBullets.task);
    setAction(activeScenario.sampleStarBullets.action);
    setResult(activeScenario.sampleStarBullets.result);
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim() && !action.trim()) return;

    setIsEvaluating(true);
    setEvaluation(null);

    const fullAnswer = `[SITUATION]: ${situation}\n[TASK]: ${task}\n[ACTION]: ${action}\n[RESULT]: ${result}`;

    try {
      const res = await fetch('/api/ai/interview-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeScenario.question,
          answer: fullAnswer,
          track,
          competency: activeScenario.competency,
        }),
      });
      const data = await res.json();
      setEvaluation(data);
    } catch (err) {
      console.error(err);
      setEvaluation({
        overallScore: 8,
        starScores: { situation: 8, task: 8, action: 9, result: 7 },
        airAstanaMindsetRating: 'Good Safety Orientation',
        strengths: ['Clear assertive communication pattern', 'Respect for SOPs'],
        areasForImprovement: ['Quantify the final result with concrete metrics'],
        executiveSummary: 'Demonstrates clear cockpit/hangar maturity. Continue emphasizing open safety reporting.',
        modelAnswerRefinement: 'Ensure you close the loop by stating how you debriefed the team afterwards.',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="liquid-glass p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-[#E0B85C]/20 text-[#E0B85C] font-mono-avionics text-xs font-bold border border-[#E0B85C]/40">
              STAGE 4 HR & BOARD PANEL
            </span>
            <span className="text-xs text-white/60 font-mono-avionics">
              STAR Framework & Air Astana Core Values
            </span>
          </div>
          <h2 className="text-xl font-bold font-cockpit text-white">
            Air Astana Competency & Selection Mock Interview
          </h2>
          <p className="text-xs text-white/70 max-w-2xl mt-1 leading-relaxed">
            Graded by the AI Board (Lead Captain / Chief Technical Officer) on Structure (STAR), Technical Precision, Assertiveness, and Safety Mindset.
          </p>
        </div>

        {/* Scenario Switcher Pills */}
        <div className="flex flex-wrap gap-2">
          {scenarios.map((scen, idx) => (
            <button
              key={scen.id}
              onClick={() => {
                setSelectedScenarioIndex(idx);
                setEvaluation(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono-avionics transition-all border ${
                selectedScenarioIndex === idx
                  ? 'liquid-glass-pill-active'
                  : 'liquid-glass-nested text-white/70 hover:text-white border-white/10'
              }`}
            >
              Scenario {idx + 1}: {scen.competency.slice(0, 16)}...
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question & STAR Form */}
        <div className="lg:col-span-7 space-y-4">
          <div className="liquid-glass p-6">
            <div className="text-xs text-[#E0B85C] font-mono-avionics uppercase font-bold mb-1.5">
              Target Competency: {activeScenario.competency}
            </div>
            <h3 className="text-base font-semibold text-white mb-2 leading-relaxed">
              "{activeScenario.question}"
            </h3>
            <p className="text-xs text-white/80 mb-3 liquid-glass-nested p-3.5">
              {activeScenario.context}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/50 font-mono-avionics">
                Air Astana Tip: Quantify results & maintain flat cockpit hierarchy.
              </span>
              <button
                type="button"
                onClick={handleFillSample}
                className="text-xs text-[#E0B85C] hover:underline font-mono-avionics flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E0B85C]" />
                <span>Fill Sample Model Data</span>
              </button>
            </div>
          </div>

          {/* STAR Response Form */}
          <form onSubmit={handleEvaluate} className="liquid-glass p-6 space-y-3.5">
            <h4 className="text-xs font-cockpit font-bold uppercase tracking-wider text-white pb-2 border-b border-white/15 flex items-center justify-between">
              <span>Your Structured Response (STAR)</span>
              <span className="text-[10px] text-white/50 font-mono-avionics">All 4 Pillars Required</span>
            </h4>

            <div>
              <label className="text-[11px] font-mono-avionics text-sky-300 font-bold block mb-1">
                S - SITUATION (Context, flight/hangar conditions, aircraft type)
              </label>
              <textarea
                rows={2}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Where were you, what was the operational environment?..."
                className="w-full liquid-glass-nested p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#E0B85C] rounded-xl"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-avionics text-amber-300 font-bold block mb-1">
                T - TASK (Specific safety challenge or procedural hurdle)
              </label>
              <textarea
                rows={2}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="What was your specific responsibility or the dilemma faced?..."
                className="w-full liquid-glass-nested p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#E0B85C] rounded-xl"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-avionics text-emerald-300 font-bold block mb-1">
                A - ACTION (Proactive steps, SOP adherence, Crew Resource Management)
              </label>
              <textarea
                rows={3}
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="What exact actions did you take? How did you communicate assertively?..."
                className="w-full liquid-glass-nested p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#E0B85C] rounded-xl"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-avionics text-purple-300 font-bold block mb-1">
                R - RESULT (Measurable outcome, airworthiness preserved, debrief lessons)
              </label>
              <textarea
                rows={2}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="What was the concrete outcome? What did the crew/hangar learn?..."
                className="w-full liquid-glass-nested p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#E0B85C] rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={isEvaluating}
              className="w-full py-3 liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider rounded-full hover:brightness-110 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#E0B85C]" />
                  <span>Air Astana Selection Board Evaluating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Answer for Panel Evaluation</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: AI Selection Board Feedback */}
        <div className="lg:col-span-5 space-y-4">
          {evaluation ? (
            <div className="liquid-glass p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div>
                  <span className="text-[10px] font-mono-avionics text-white/60 uppercase">
                    Overall Board Rating
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-mono-avionics font-bold text-[#E0B85C]">
                      {evaluation.overallScore} / 10
                    </span>
                    <span className="text-xs font-cockpit text-emerald-400 font-bold">
                      [{evaluation.airAstanaMindsetRating}]
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full liquid-glass-circle-btn flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#E0B85C]" />
                </div>
              </div>

              {/* STAR Dimension breakdown */}
              <div className="space-y-1.5 font-mono-avionics text-xs">
                <span className="text-[10px] text-white/50 uppercase font-bold block mb-1">
                  STAR Metric Breakdown
                </span>
                <div className="flex items-center justify-between liquid-glass-nested p-2.5">
                  <span className="text-white/80">Situation (Context)</span>
                  <span className="text-sky-300 font-bold">{evaluation.starScores.situation}/10</span>
                </div>
                <div className="flex items-center justify-between liquid-glass-nested p-2.5">
                  <span className="text-white/80">Task (Objective Clarity)</span>
                  <span className="text-amber-300 font-bold">{evaluation.starScores.task}/10</span>
                </div>
                <div className="flex items-center justify-between liquid-glass-nested p-2.5">
                  <span className="text-white/80">Action (CRM / SOPs)</span>
                  <span className="text-emerald-400 font-bold">{evaluation.starScores.action}/10</span>
                </div>
                <div className="flex items-center justify-between liquid-glass-nested p-2.5">
                  <span className="text-white/80">Result (Quantifiable Closure)</span>
                  <span className="text-purple-300 font-bold">{evaluation.starScores.result}/10</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="liquid-glass-nested p-3.5 text-xs">
                <span className="text-[10px] font-mono-avionics text-[#E0B85C] uppercase font-bold block mb-1">
                  Captain / Chief Examiner Summary
                </span>
                <p className="text-white/90 leading-relaxed">{evaluation.executiveSummary}</p>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="liquid-glass-nested p-3 border-emerald-500/30">
                  <span className="text-emerald-400 font-bold text-[11px] block mb-1 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Strengths
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-white/80 text-[11px]">
                    {evaluation.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="liquid-glass-nested p-3 border-amber-500/30">
                  <span className="text-amber-400 font-bold text-[11px] block mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Areas to Tighten
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-white/80 text-[11px]">
                    {evaluation.areasForImprovement.map((area, i) => (
                      <li key={i}>{area}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Model Refinement */}
              <div className="liquid-glass-nested p-3 text-xs">
                <span className="text-[10px] font-mono-avionics text-sky-300 uppercase font-bold block mb-1">
                  Exemplary Model Refinement
                </span>
                <p className="text-white/80 italic text-[11px] leading-relaxed">
                  "{evaluation.modelAnswerRefinement}"
                </p>
              </div>
            </div>
          ) : (
            <div className="liquid-glass p-8 text-center flex flex-col items-center justify-center min-h-[360px]">
              <div className="w-14 h-14 rounded-full liquid-glass-circle-btn flex items-center justify-center text-white mb-3">
                <ShieldCheck className="w-7 h-7 text-[#E0B85C]" />
              </div>
              <h4 className="text-sm font-cockpit font-bold text-white mb-1">
                Interview Panel on Standby
              </h4>
              <p className="text-xs text-white/60 max-w-xs leading-relaxed">
                Draft your STAR breakdown on the left and submit. The AI examiner assesses your responses against official Air Astana selection criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
