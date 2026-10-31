import React from 'react';
import { Target, X, Check, Shield, Flame, Activity } from 'lucide-react';
import { sound } from '../game/SoundEffects';

export default function BowlerSelectModal({
  isOpen,
  onClose,
  bowlers = [],
  selectedIndex = 0,
  onSelectBowler,
  bowlingScorecard = [],
  teamName = 'Team',
  teamCode = 'IND'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-[#0b121e] border-2 border-amber-500/80 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3 max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-amber-400 tracking-wider uppercase">
                BOWLER ROTATION • {teamCode}
              </div>
              <div className="text-[10px] text-slate-400">
                Select your active bowler for this over
              </div>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bowlers Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-0.5 space-y-2">
          {bowlers.map((b, idx) => {
            const isSelected = (idx === selectedIndex);
            const scorecardEntry = bowlingScorecard.find(bw => bw.name === b.name || bw.name === b.shortName);
            const oversBowled = scorecardEntry?.o || '0.0';
            const runsConceded = scorecardEntry?.r || 0;
            const wicketsTaken = scorecardEntry?.w || 0;
            const economy = scorecardEntry?.eco || '0.0';

            const isSpin = ['legspin', 'offspin', 'leftarm_chinaman', 'leftarm_orthodox', 'spin', 'wrist_spin', 'finger_spin'].includes(b.type);
            const armLabel = b.arm === 'left' ? 'Left-Arm' : 'Right-Arm';

            return (
              <div
                key={idx}
                onClick={() => {
                  sound.playClick();
                  onSelectBowler(idx);
                  onClose();
                }}
                className={`p-3 rounded-2xl border transition-all active:scale-98 cursor-pointer flex items-center justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/15'
                    : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left: Avatar & Details */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-display font-black text-sm flex-shrink-0 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {b.shortName?.slice(0, 2).toUpperCase() || b.name?.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-white truncate">
                        {b.name}
                      </span>
                      {isSelected && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono font-semibold">
                        {armLabel}
                      </span>
                      <span className="text-slate-300 font-medium truncate">
                        {b.role || (isSpin ? 'Spinner' : 'Fast Bowler')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Match Bowling Figures & Selector */}
                <div className="text-right flex-shrink-0 flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <div className="text-xs font-mono font-bold text-white">
                      {wicketsTaken}/{runsConceded}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {oversBowled} ov · Econ {economy}
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-amber-400 border-amber-300 text-slate-950 shadow'
                        : 'border-slate-700 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800/80 pt-2 text-center text-[10px] text-slate-400">
          Tip: Match the bowler's swing/spin skills to the pitch and batsman weakness!
        </div>
      </div>
    </div>
  );
}
