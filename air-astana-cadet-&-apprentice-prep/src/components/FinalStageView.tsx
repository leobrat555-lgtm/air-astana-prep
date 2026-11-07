import React, { useState } from 'react';
import { Users, Award, Wrench, HeartPulse } from 'lucide-react';
import { ProgramTrack } from '../types';
import { InterviewSimulator } from './InterviewSimulator';
import { GroupExerciseView } from './GroupExerciseView';
import { HangarBenchView } from './HangarBenchView';
import { VlecChecklistView } from './VlecChecklistView';

interface FinalStageViewProps {
  track: ProgramTrack;
}

export const FinalStageView: React.FC<FinalStageViewProps> = ({ track }) => {
  const [subTab, setSubTab] = useState<'interview' | 'group' | 'specialized'>('interview');

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Navigation as Liquid Glass Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <button
          onClick={() => setSubTab('interview')}
          className={`px-4 py-2 rounded-full text-xs font-cockpit font-bold uppercase tracking-wider flex items-center gap-2 transition-all border ${
            subTab === 'interview'
              ? 'liquid-glass-pill-active'
              : 'liquid-glass-nested text-white/70 hover:text-white border-white/10'
          }`}
        >
          <Award className="w-4 h-4 text-[#E0B85C]" />
          <span>Air Astana STAR Competency Interview</span>
        </button>

        <button
          onClick={() => setSubTab('group')}
          className={`px-4 py-2 rounded-full text-xs font-cockpit font-bold uppercase tracking-wider flex items-center gap-2 transition-all border ${
            subTab === 'group'
              ? 'liquid-glass-pill-active'
              : 'liquid-glass-nested text-white/70 hover:text-white border-white/10'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Group Exercise Tactical Sandbox</span>
        </button>

        {track === 'ab-initio' ? (
          <button
            onClick={() => setSubTab('specialized')}
            className={`px-4 py-2 rounded-full text-xs font-cockpit font-bold uppercase tracking-wider flex items-center gap-2 transition-all border ${
              subTab === 'specialized'
                ? 'liquid-glass-pill-active'
                : 'liquid-glass-nested text-white/70 hover:text-white border-white/10'
            }`}
          >
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <span>Kazakhstan VLEC Class 1 Checklist</span>
          </button>
        ) : (
          <button
            onClick={() => setSubTab('specialized')}
            className={`px-4 py-2 rounded-full text-xs font-cockpit font-bold uppercase tracking-wider flex items-center gap-2 transition-all border ${
              subTab === 'specialized'
                ? 'liquid-glass-pill-active'
                : 'liquid-glass-nested text-white/70 hover:text-white border-white/10'
            }`}
          >
            <Wrench className="w-4 h-4 text-emerald-400" />
            <span>Practical Hangar Bench Test</span>
          </button>
        )}
      </div>

      {/* Render Active Sub-View */}
      {subTab === 'interview' && <InterviewSimulator track={track} />}
      {subTab === 'group' && <GroupExerciseView track={track} />}
      {subTab === 'specialized' && (track === 'ab-initio' ? <VlecChecklistView /> : <HangarBenchView />)}
    </div>
  );
};
