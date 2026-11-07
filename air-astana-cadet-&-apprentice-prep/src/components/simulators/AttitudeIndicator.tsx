import React from 'react';

interface AttitudeIndicatorProps {
  pitchDeg?: number; // positive = nose up
  bankDeg?: number;  // positive = bank right
  headingDeg?: number;
  interactive?: boolean;
  onPitchChange?: (pitch: number) => void;
  onBankChange?: (bank: number) => void;
}

export const AttitudeIndicator: React.FC<AttitudeIndicatorProps> = ({
  pitchDeg = 0,
  bankDeg = 0,
  headingDeg = 360,
  interactive = false,
  onPitchChange,
  onBankChange,
}) => {
  // Pitch pixel offset: 1 degree pitch = ~3 pixels
  const pitchOffset = -pitchDeg * 3;

  return (
    <div className="flex flex-col items-center select-none">
      {/* Outer bezel */}
      <div className="relative w-56 h-56 rounded-full bg-slate-950 border-4 border-[#CBA135]/60 shadow-[0_0_25px_rgba(203,161,53,0.3)] overflow-hidden flex items-center justify-center">
        {/* Rotating horizon sphere / disc */}
        <div
          className="absolute w-80 h-80 transition-transform duration-300 ease-out"
          style={{
            transform: `rotate(${-bankDeg}deg)`,
          }}
        >
          {/* Pitch translation layer */}
          <div
            className="w-full h-full relative transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(${pitchOffset}px)`,
            }}
          >
            {/* Sky (Upper half) */}
            <div className="w-full h-40 bg-gradient-to-b from-[#0ea5e9] to-[#0284c7]" />
            {/* Ground (Lower half) */}
            <div className="w-full h-40 bg-gradient-to-b from-[#854d0e] to-[#713f12]" />

            {/* Horizon dividing line */}
            <div className="absolute top-40 left-0 w-full h-[2px] bg-white shadow-sm" />

            {/* Pitch Ladder Marks (+20, +10, 0, -10, -20) */}
            {/* +20 deg */}
            <div className="absolute top-[100px] left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-mono-avionics text-white">
              <span>20</span>
              <div className="w-16 h-[2px] bg-white" />
              <span>20</span>
            </div>
            {/* +10 deg */}
            <div className="absolute top-[130px] left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-mono-avionics text-white">
              <span>10</span>
              <div className="w-10 h-[2px] bg-white" />
              <span>10</span>
            </div>
            {/* -10 deg */}
            <div className="absolute top-[190px] left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-mono-avionics text-white">
              <span>10</span>
              <div className="w-10 h-[2px] bg-white/80 border-dashed" />
              <span>10</span>
            </div>
            {/* -20 deg */}
            <div className="absolute top-[220px] left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-mono-avionics text-white">
              <span>20</span>
              <div className="w-16 h-[2px] bg-white/80 border-dashed" />
              <span>20</span>
            </div>
          </div>
        </div>

        {/* Fixed Aircraft Symbol (Yellow / Gold chevron) */}
        <div className="absolute z-10 pointer-events-none flex items-center justify-center">
          {/* Left Wing bar */}
          <div className="w-12 h-2 bg-[#CBA135] border border-black shadow" />
          {/* Center pip */}
          <div className="w-3 h-3 bg-[#CBA135] rounded-full mx-1 border border-black shadow" />
          {/* Right Wing bar */}
          <div className="w-12 h-2 bg-[#CBA135] border border-black shadow" />
        </div>

        {/* Bank Roll Scale Top Triangle */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#CBA135]" />
        </div>

        {/* Glass reflection gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />
      </div>

      {/* Readout bar */}
      <div className="mt-3 flex items-center gap-4 text-xs font-mono-avionics bg-slate-900/90 px-3 py-1.5 rounded border border-slate-700">
        <div>
          <span className="text-slate-400">PITCH: </span>
          <span className={`font-bold ${pitchDeg > 0 ? 'text-emerald-400' : pitchDeg < 0 ? 'text-amber-400' : 'text-slate-200'}`}>
            {pitchDeg > 0 ? `+${pitchDeg}°` : `${pitchDeg}°`}
          </span>
        </div>
        <div className="h-3 w-[1px] bg-slate-700" />
        <div>
          <span className="text-slate-400">BANK: </span>
          <span className={`font-bold ${bankDeg !== 0 ? 'text-sky-400' : 'text-slate-200'}`}>
            {bankDeg > 0 ? `${bankDeg}° R` : bankDeg < 0 ? `${Math.abs(bankDeg)}° L` : '0°'}
          </span>
        </div>
        <div className="h-3 w-[1px] bg-slate-700" />
        <div>
          <span className="text-slate-400">HDG: </span>
          <span className="text-[#CBA135] font-bold">
            {String(headingDeg).padStart(3, '0')}°
          </span>
        </div>
      </div>

      {/* Interactive Controls if enabled */}
      {interactive && (
        <div className="mt-3 w-full max-w-xs space-y-2 text-xs">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Adjust Pitch (-30° to +30°)</span>
              <span>{pitchDeg}°</span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              value={pitchDeg}
              onChange={(e) => onPitchChange?.(Number(e.target.value))}
              className="w-full accent-[#CBA135] cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Adjust Bank (-45° L to +45° R)</span>
              <span>{bankDeg}°</span>
            </div>
            <input
              type="range"
              min="-45"
              max="45"
              value={bankDeg}
              onChange={(e) => onBankChange?.(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
