import React, { useState, useEffect } from 'react';
import { Play, Brain, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface ClearanceItem {
  callsign: string;
  altitude: string;
  heading: string;
  squawk: string;
  frequency: string;
}

const PRESET_CLEARANCES: ClearanceItem[] = [
  { callsign: 'KZR 214', altitude: 'FL 280', heading: '085°', squawk: '4210', frequency: '124.70' },
  { callsign: 'KZR 881', altitude: '5,000 ft', heading: '240°', squawk: '7105', frequency: '118.30' },
  { callsign: 'KZR 342', altitude: 'FL 330', heading: '310°', squawk: '5512', frequency: '131.25' },
  { callsign: 'KZR 109', altitude: '7,000 ft', heading: '175°', squawk: '3601', frequency: '128.55' },
];

export const MemorySpanGame: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'flashing' | 'distractor' | 'recall' | 'result'>('idle');
  const [countdown, setCountdown] = useState(5);
  const [activeClearance, setActiveClearance] = useState<ClearanceItem>(PRESET_CLEARANCES[0]);
  
  const [distractorNum1, setDistractorNum1] = useState(24);
  const [distractorNum2, setDistractorNum2] = useState(17);
  const [userDistractorAnswer, setUserDistractorAnswer] = useState('');
  const [distractorCorrect, setDistractorCorrect] = useState<boolean | null>(null);

  const [recallCallsign, setRecallCallsign] = useState('');
  const [recallAltitude, setRecallAltitude] = useState('');
  const [recallHeading, setRecallHeading] = useState('');
  const [recallSquawk, setRecallSquawk] = useState('');
  const [recallFrequency, setRecallFrequency] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'flashing') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setGameState('distractor');
        setCountdown(8);
      }
    } else if (gameState === 'distractor') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setGameState('recall');
      }
    }
    return () => clearTimeout(timer);
  }, [gameState, countdown]);

  const startTest = () => {
    const randomClearance = PRESET_CLEARANCES[Math.floor(Math.random() * PRESET_CLEARANCES.length)];
    setActiveClearance(randomClearance);
    const n1 = Math.floor(Math.random() * 40) + 15;
    const n2 = Math.floor(Math.random() * 30) + 10;
    setDistractorNum1(n1);
    setDistractorNum2(n2);
    setUserDistractorAnswer('');
    setDistractorCorrect(null);
    setRecallCallsign('');
    setRecallAltitude('');
    setRecallHeading('');
    setRecallSquawk('');
    setRecallFrequency('');
    setScore(0);
    setCountdown(5);
    setGameState('flashing');
  };

  const submitDistractor = (e: React.FormEvent) => {
    e.preventDefault();
    const correctVal = distractorNum1 + distractorNum2;
    const isOk = parseInt(userDistractorAnswer.trim(), 10) === correctVal;
    setDistractorCorrect(isOk);
    setGameState('recall');
  };

  const submitRecall = (e: React.FormEvent) => {
    e.preventDefault();
    let points = 0;
    if (recallCallsign.trim().toUpperCase() === activeClearance.callsign.toUpperCase()) points += 20;
    if (recallAltitude.trim().toUpperCase() === activeClearance.altitude.toUpperCase()) points += 20;
    if (recallHeading.replace('°', '').trim() === activeClearance.heading.replace('°', '').trim()) points += 20;
    if (recallSquawk.trim() === activeClearance.squawk.trim()) points += 20;
    if (recallFrequency.trim() === activeClearance.frequency.trim()) points += 20;

    setScore(points);
    setGameState('result');
  };

  return (
    <div className="liquid-glass p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/15">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#E0B85C]" />
          <div>
            <h3 className="font-cockpit text-sm font-bold uppercase tracking-wider text-white">
              COMPASS Short-Term Memory Span
            </h3>
            <p className="text-[11px] text-white/60">
              Clearance Flash (5s) → Math Distractor → 5-Parameter Precision Recall
            </p>
          </div>
        </div>
        {gameState !== 'idle' && (
          <button
            onClick={startTest}
            className="p-2 rounded-full liquid-glass-nested text-white/80 hover:text-white"
            title="Restart Drill"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {gameState === 'idle' && (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full liquid-glass-circle-btn flex items-center justify-center mx-auto mb-3">
            <Brain className="w-7 h-7 text-[#E0B85C]" />
          </div>
          <h4 className="text-sm font-semibold text-white mb-1.5">
            Ready for Multi-Tasking Working Memory Drill?
          </h4>
          <p className="text-xs text-white/70 max-w-sm mx-auto mb-5 leading-relaxed">
            Simulates real high-stress ATC clearance retention during turbulent flight while processing secondary tasks.
          </p>
          <button
            onClick={startTest}
            className="px-6 py-2.5 rounded-full liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg"
          >
            Initiate Memory Test
          </button>
        </div>
      )}

      {gameState === 'flashing' && (
        <div className="py-4 text-center">
          <div className="inline-block px-4 py-1 liquid-glass-pill-active rounded-full font-mono-avionics text-xs font-bold mb-4">
            MEMORIZE CLEARANCE: 00:0{countdown}s
          </div>
          <div className="grid grid-cols-2 gap-3 text-left liquid-glass-nested p-5 font-mono-avionics">
            <div>
              <span className="text-[10px] text-white/50 uppercase block">Callsign</span>
              <span className="text-emerald-400 font-bold text-sm">{activeClearance.callsign}</span>
            </div>
            <div>
              <span className="text-[10px] text-white/50 uppercase block">Altitude</span>
              <span className="text-sky-300 font-bold text-sm">{activeClearance.altitude}</span>
            </div>
            <div>
              <span className="text-[10px] text-white/50 uppercase block">Heading</span>
              <span className="text-amber-300 font-bold text-sm">{activeClearance.heading}</span>
            </div>
            <div>
              <span className="text-[10px] text-white/50 uppercase block">Squawk (SSR)</span>
              <span className="text-purple-300 font-bold text-sm">{activeClearance.squawk}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-white/10">
              <span className="text-[10px] text-white/50 uppercase block">Frequency</span>
              <span className="text-rose-300 font-bold text-sm">{activeClearance.frequency} MHz</span>
            </div>
          </div>
        </div>
      )}

      {gameState === 'distractor' && (
        <form onSubmit={submitDistractor} className="py-4 text-center">
          <div className="inline-block px-4 py-1 bg-sky-500/25 border border-sky-400/50 text-sky-200 rounded-full font-mono-avionics text-xs font-bold mb-4">
            TASK INTERRUPTION (DISTRACTOR): 00:0{countdown}s
          </div>
          <div className="liquid-glass-nested p-6 mb-3">
            <span className="text-xs text-white/60 block mb-2 font-mono-avionics">Quick Mental Arithmetic</span>
            <div className="text-3xl font-bold font-mono-avionics text-white mb-4">
              {distractorNum1} + {distractorNum2} = ?
            </div>
            <div className="flex items-center justify-center gap-2">
              <input
                type="number"
                autoFocus
                value={userDistractorAnswer}
                onChange={(e) => setUserDistractorAnswer(e.target.value)}
                placeholder="Result"
                className="w-32 px-3 py-2 liquid-glass-nested text-center text-sm font-mono-avionics text-white focus:outline-none focus:border-[#E0B85C] rounded-xl"
              />
              <button
                type="submit"
                className="px-5 py-2 liquid-glass-pill-active rounded-full font-bold text-xs uppercase"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}

      {gameState === 'recall' && (
        <form onSubmit={submitRecall} className="py-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#E0B85C] uppercase font-cockpit">
              Recall All 5 Flight Parameters:
            </span>
            {distractorCorrect !== null && (
              <span className={`text-[10px] font-mono-avionics ${distractorCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                Distractor Math: {distractorCorrect ? 'CORRECT (+)' : 'MISSED (-)'}
              </span>
            )}
          </div>

          <div className="space-y-3 font-mono-avionics text-xs">
            <div>
              <label className="text-[10px] text-white/50 block mb-1">1. Aircraft Callsign (e.g. KZR 214)</label>
              <input
                type="text"
                required
                value={recallCallsign}
                onChange={(e) => setRecallCallsign(e.target.value)}
                placeholder="Callsign..."
                className="w-full px-3 py-2 liquid-glass-nested text-white focus:border-[#E0B85C] focus:outline-none rounded-xl"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/50 block mb-1">2. Assigned Altitude (e.g. FL 280 or 5,000 ft)</label>
              <input
                type="text"
                required
                value={recallAltitude}
                onChange={(e) => setRecallAltitude(e.target.value)}
                placeholder="Altitude..."
                className="w-full px-3 py-2 liquid-glass-nested text-white focus:border-[#E0B85C] focus:outline-none rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-white/50 block mb-1">3. Heading (e.g. 085°)</label>
                <input
                  type="text"
                  required
                  value={recallHeading}
                  onChange={(e) => setRecallHeading(e.target.value)}
                  placeholder="Heading..."
                  className="w-full px-3 py-2 liquid-glass-nested text-white focus:border-[#E0B85C] focus:outline-none rounded-xl"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/50 block mb-1">4. Squawk (SSR Code)</label>
                <input
                  type="text"
                  required
                  value={recallSquawk}
                  onChange={(e) => setRecallSquawk(e.target.value)}
                  placeholder="4 digits..."
                  className="w-full px-3 py-2 liquid-glass-nested text-white focus:border-[#E0B85C] focus:outline-none rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/50 block mb-1">5. Frequency (MHz e.g. 124.70)</label>
              <input
                type="text"
                required
                value={recallFrequency}
                onChange={(e) => setRecallFrequency(e.target.value)}
                placeholder="e.g. 124.70"
                className="w-full px-3 py-2 liquid-glass-nested text-white focus:border-[#E0B85C] focus:outline-none rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 w-full py-3 liquid-glass-pill-active text-white font-bold text-xs uppercase font-cockpit rounded-full hover:brightness-110 shadow-lg"
          >
            Verify Recall Accuracy
          </button>
        </form>
      )}

      {gameState === 'result' && (
        <div className="py-4 text-center">
          <div className={`text-4xl font-bold font-mono-avionics mb-1 ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-[#E0B85C]' : 'text-rose-400'}`}>
            {score}%
          </div>
          <div className="text-xs uppercase font-cockpit text-white tracking-wider mb-4">
            {score >= 80 ? 'COMPASS Standard Met (Class 1)' : 'Needs Multi-Tasking Attention Conditioning'}
          </div>

          <div className="liquid-glass-nested p-4 text-left font-mono-avionics text-xs space-y-2 mb-5">
            <div className="flex justify-between items-center pb-2 border-b border-white/10 text-white/50">
              <span>Parameter</span>
              <span>Target / Your Input</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Callsign:</span>
              <span className="text-white/80">{activeClearance.callsign} | <span className="text-[#E0B85C]">{recallCallsign || '-'}</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Altitude:</span>
              <span className="text-white/80">{activeClearance.altitude} | <span className="text-[#E0B85C]">{recallAltitude || '-'}</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Heading:</span>
              <span className="text-white/80">{activeClearance.heading} | <span className="text-[#E0B85C]">{recallHeading || '-'}</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Squawk:</span>
              <span className="text-white/80">{activeClearance.squawk} | <span className="text-[#E0B85C]">{recallSquawk || '-'}</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Frequency:</span>
              <span className="text-white/80">{activeClearance.frequency} MHz | <span className="text-[#E0B85C]">{recallFrequency || '-'}</span></span>
            </div>
          </div>

          <button
            onClick={startTest}
            className="w-full py-3 liquid-glass-pill-active text-white font-cockpit font-bold text-xs uppercase tracking-wider rounded-full"
          >
            Attempt Another Run
          </button>
        </div>
      )}
    </div>
  );
};
