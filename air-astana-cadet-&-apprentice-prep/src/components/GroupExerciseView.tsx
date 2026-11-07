import React, { useState } from 'react';
import { Users2, AlertTriangle, CheckCircle, ChevronRight, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { GroupExerciseScenario, ProgramTrack } from '../types';
import { GROUP_EXERCISES } from '../data/questions';

interface GroupExerciseViewProps {
  track: ProgramTrack;
}

export const GroupExerciseView: React.FC<GroupExerciseViewProps> = ({ track }) => {
  const scenarios = GROUP_EXERCISES.filter((g) => g.track === track || track === 'ab-initio');
  const [activeScenario, setActiveScenario] = useState<GroupExerciseScenario>(scenarios[0] || GROUP_EXERCISES[0]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [userStrategyNotes, setUserStrategyNotes] = useState('');
  const [submittedReview, setSubmittedReview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOptionId) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const selected = activeScenario.options.find((o) => o.id === selectedOptionId);
      const isConservative = selected?.risk === 'Low';
      const feedback = isConservative
        ? `Air Astana Selection Board Consensus: Excellent decision prioritizing safety and fleet recoverability. Choosing ${selected?.title} mitigates high-risk runway excursion and provides an established engineering/medical hub. Your task delegation ensures fuel monitoring is assigned to Pilot Monitoring while Pilot Flying maintains high-speed cruise.`
        : `Air Astana Selection Board Consensus: High-risk operational gamble. While ${selected?.title} minimizes fuel burn, operating into degraded braking action with gusting crosswinds violates conservative airline SMS margins. In an actual Air Astana assessment, always prioritize CAVOK hubs when weather is marginal.`;
      setSubmittedReview(feedback);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="liquid-glass p-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono-avionics text-xs font-bold border border-amber-500/30">
            AIR ASTANA GROUP ASSESSMENT
          </span>
          <span className="text-xs text-white/60 font-mono-avionics">
            Multi-Crew Resource Management & Tactical Decision Making
          </span>
        </div>
        <h2 className="text-xl font-bold font-cockpit text-white">
          {activeScenario.title}
        </h2>
        <p className="text-xs text-white/70 mt-1 max-w-3xl leading-relaxed">
          {activeScenario.background}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Constraints & Operational Options */}
        <div className="lg:col-span-7 space-y-4">
          <div className="liquid-glass p-5">
            <h4 className="text-xs font-cockpit font-bold uppercase tracking-wider text-[#E0B85C] mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Operational Constraints & Bottlenecks</span>
            </h4>
            <ul className="space-y-2 text-xs font-mono-avionics text-white/80">
              {activeScenario.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5 liquid-glass-nested p-2.5">
                  <span className="text-[#E0B85C] font-bold">[{i + 1}]</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Decision Options */}
          <div className="space-y-3">
            <h4 className="text-xs font-cockpit font-bold uppercase tracking-wider text-white">
              Available Strategic Options:
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {activeScenario.options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedOptionId === opt.id
                      ? 'liquid-glass border-[#E0B85C] shadow-[0_0_20px_rgba(224,184,92,0.3)]'
                      : 'liquid-glass-nested border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-white flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${selectedOptionId === opt.id ? 'bg-[#E0B85C]' : 'bg-white/20'}`} />
                      {opt.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono-avionics px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        opt.risk === 'Low'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                      }`}
                    >
                      {opt.risk} Risk Profile
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono-avionics mt-3">
                    <div className="liquid-glass-nested p-2.5 text-white/80 border-emerald-500/20">
                      <span className="text-emerald-400 font-bold block mb-1">Pros:</span>
                      {opt.pros.join('; ')}
                    </div>
                    <div className="liquid-glass-nested p-2.5 text-white/80 border-rose-500/20">
                      <span className="text-rose-400 font-bold block mb-1">Cons / Vulnerabilities:</span>
                      {opt.cons.join('; ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Strategy Formulation & AI Assessment */}
        <div className="lg:col-span-5 space-y-4">
          <form
            onSubmit={handleSubmitStrategy}
            className="liquid-glass p-6 space-y-3.5"
          >
            <h4 className="text-xs font-cockpit font-bold uppercase tracking-wider text-white pb-2 border-b border-white/15">
              Your Team Strategy & Task Delegation
            </h4>

            <div>
              <label className="text-[11px] text-white/60 block mb-1 font-mono-avionics">
                Briefly summarize your tactical plan & crew delegation:
              </label>
              <textarea
                rows={4}
                required
                value={userStrategyNotes}
                onChange={(e) => setUserStrategyNotes(e.target.value)}
                placeholder="E.g., Designate Pilot Flying to establish high-speed cruise to Astana. Assign Pilot Monitoring to notify Astana Operations, calculate fuel burn buffer, and request airport paramedics to meet aircraft at gate..."
                className="w-full liquid-glass-nested p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#E0B85C] rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedOptionId || isSubmitting}
              className="w-full py-3 liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider rounded-full hover:brightness-110 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Submit Tactical Solution</span>
            </button>
          </form>

          {submittedReview && (
            <div className="liquid-glass p-6 space-y-2 border-[#E0B85C]/40 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-cockpit text-[#E0B85C] font-bold uppercase">
                <Sparkles className="w-4 h-4 text-[#E0B85C]" />
                <span>Air Astana Selection Board Critique</span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-mono-avionics liquid-glass-nested p-3.5">
                {submittedReview}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
