import React, { useState } from 'react';
import { RotateCcw, Box } from 'lucide-react';

interface CubeFaceData {
  top: string;
  center: string;
  bottom: string;
  left: string;
  right: string;
  farBottom: string;
}

interface CubeFoldingSimulatorProps {
  faces?: CubeFaceData;
}

export const CubeFoldingSimulator: React.FC<CubeFoldingSimulatorProps> = ({
  faces = {
    top: '● Circle',
    center: '■ Square',
    bottom: '★ Star',
    left: '▲ Triangle',
    right: '◆ Diamond',
    farBottom: '⬢ Hexagon',
  },
}) => {
  const [is3DMode, setIs3DMode] = useState(false);
  const [rotX, setRotX] = useState(-20);
  const [rotY, setRotY] = useState(35);

  const handleReset = () => {
    setRotX(-20);
    setRotY(35);
  };

  return (
    <div className="flex flex-col items-center bg-slate-900/80 p-4 rounded-xl border border-slate-700/80">
      <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-[#CBA135]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Spatial Net Visualizer
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className={`text-xs px-2.5 py-1 rounded transition-colors font-mono-avionics ${
              is3DMode
                ? 'bg-[#CBA135] text-slate-950 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {is3DMode ? 'View 2D Net' : 'Fold to 3D Cube'}
          </button>
          {is3DMode && (
            <button
              onClick={handleReset}
              className="text-xs p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
              title="Reset Rotation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {!is3DMode ? (
        /* 2D Unfolded Net View */
        <div className="flex flex-col items-center py-2">
          <div className="text-[11px] text-slate-400 mb-2 font-mono-avionics">
            [CROSS NET UNFOLDED]
          </div>

          <div className="grid grid-cols-3 gap-1.5 w-52 text-center text-xs font-mono-avionics">
            {/* Row 1: Empty, Top, Empty */}
            <div />
            <div className="h-12 bg-sky-950/80 border border-sky-400/50 rounded flex items-center justify-center text-sky-200 font-bold p-1 shadow-inner">
              {faces.top}
            </div>
            <div />

            {/* Row 2: Left, Center, Right */}
            <div className="h-12 bg-amber-950/80 border border-amber-400/50 rounded flex items-center justify-center text-amber-200 font-bold p-1 shadow-inner">
              {faces.left}
            </div>
            <div className="h-12 bg-emerald-950/80 border border-emerald-400/50 rounded flex items-center justify-center text-emerald-200 font-bold p-1 shadow-inner">
              {faces.center}
            </div>
            <div className="h-12 bg-purple-950/80 border border-purple-400/50 rounded flex items-center justify-center text-purple-200 font-bold p-1 shadow-inner">
              {faces.right}
            </div>

            {/* Row 3: Empty, Bottom, Empty */}
            <div />
            <div className="h-12 bg-rose-950/80 border border-rose-400/50 rounded flex items-center justify-center text-rose-200 font-bold p-1 shadow-inner">
              {faces.bottom}
            </div>
            <div />

            {/* Row 4: Empty, Far Bottom, Empty */}
            <div />
            <div className="h-12 bg-cyan-950/80 border border-cyan-400/50 rounded flex items-center justify-center text-cyan-200 font-bold p-1 shadow-inner">
              {faces.farBottom}
            </div>
            <div />
          </div>

          <div className="mt-3 text-[11px] text-slate-400 text-center max-w-xs">
            Tip: In a linear row or column, faces with <strong>one face between them</strong> are opposite faces when folded.
          </div>
        </div>
      ) : (
        /* 3D CSS Cube View */
        <div className="flex flex-col items-center py-4 select-none">
          <div
            className="w-48 h-48 flex items-center justify-center"
            style={{ perspective: '800px' }}
          >
            <div
              className="relative w-28 h-28 transition-transform duration-100 ease-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              }}
            >
              {/* Front Face (Center) */}
              <div
                className="absolute inset-0 bg-emerald-900/90 border-2 border-emerald-400 rounded flex items-center justify-center text-xs font-bold text-white shadow"
                style={{ transform: 'translateZ(56px)' }}
              >
                {faces.center}
              </div>

              {/* Back Face (Far Bottom) */}
              <div
                className="absolute inset-0 bg-cyan-900/90 border-2 border-cyan-400 rounded flex items-center justify-center text-xs font-bold text-white shadow"
                style={{ transform: 'rotateY(180deg) translateZ(56px)' }}
              >
                {faces.farBottom}
              </div>

              {/* Top Face (Top) */}
              <div
                className="absolute inset-0 bg-sky-900/90 border-2 border-sky-400 rounded flex items-center justify-center text-xs font-bold text-white shadow"
                style={{ transform: 'rotateX(90deg) translateZ(56px)' }}
              >
                {faces.top}
              </div>

              {/* Bottom Face (Bottom) */}
              <div
                className="absolute inset-0 bg-rose-900/90 border-2 border-rose-400 rounded flex items-center justify-center text-xs font-bold text-white shadow"
                style={{ transform: 'rotateX(-90deg) translateZ(56px)' }}
              >
                {faces.bottom}
              </div>

              {/* Right Face (Right) */}
              <div
                className="absolute inset-0 bg-purple-900/90 border-2 border-purple-400 rounded flex items-center justify-center text-xs font-bold text-white shadow"
                style={{ transform: 'rotateY(90deg) translateZ(56px)' }}
              >
                {faces.right}
              </div>

              {/* Left Face (Left) */}
              <div
                className="absolute inset-0 bg-amber-900/90 border-2 border-amber-400 rounded flex items-center justify-center text-xs font-bold text-white shadow"
                style={{ transform: 'rotateY(-90deg) translateZ(56px)' }}
              >
                {faces.left}
              </div>
            </div>
          </div>

          {/* Rotation sliders */}
          <div className="w-full max-w-xs space-y-1.5 mt-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Rotate Horizontally</span>
              <span>{rotY}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={rotY}
              onChange={(e) => setRotY(Number(e.target.value))}
              className="w-full accent-[#CBA135]"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Tilt Vertically</span>
              <span>{rotX}°</span>
            </div>
            <input
              type="range"
              min="-90"
              max="90"
              value={rotX}
              onChange={(e) => setRotX(Number(e.target.value))}
              className="w-full accent-sky-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};
