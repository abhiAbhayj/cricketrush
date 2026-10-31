import React from 'react';
import { Trophy, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import { sound } from '../game/SoundEffects';

export default function InningsBreakModal({
  isOpen,
  firstInningsTeamCode = 'AUS',
  firstInningsTeamName = 'Australia',
  firstInningsScore = 38,
  firstInningsWickets = 2,
  firstInningsOvers = '3.0',
  targetRuns = 39,
  ballsAllowed = 18,
  secondInningsTeamCode = 'IND',
  secondInningsTeamName = 'India',
  nextRole = 'BATTING', // 'BATTING' or 'BOWLING'
  onStartSecondInnings
}) {
  if (!isOpen) return null;

  const rrr = ((targetRuns / ballsAllowed) * 6).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-[#0b121e] border-2 border-amber-400/80 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex flex-col items-center text-center overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black tracking-widest uppercase mb-1">
          <Trophy className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>INNINGS BREAK • 1ST INNINGS COMPLETE</span>
        </div>

        {/* 1st Innings Summary Box */}
        <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 my-2 flex flex-col items-center gap-1">
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            {firstInningsTeamName} Total
          </div>
          <div className="text-3xl font-display font-black text-white">
            {firstInningsScore}/{firstInningsWickets}
            <span className="text-sm font-normal text-slate-400 ml-2 font-mono">
              ({firstInningsOvers} ov)
            </span>
          </div>
        </div>

        {/* Target Chase Equation */}
        <div className="w-full bg-gradient-to-r from-red-950/40 via-red-900/30 to-red-950/40 border border-red-500/50 rounded-2xl py-3 px-4 my-2 text-center">
          <div className="text-[11px] text-red-300 font-black tracking-widest uppercase">
            TARGET EQUATION FOR {secondInningsTeamName.toUpperCase()}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            Need <span className="text-amber-300">{targetRuns} Runs</span> from <span className="text-amber-300">{ballsAllowed} Balls</span>
          </div>
          <div className="text-[11px] text-slate-300 mt-1">
            Required Run Rate: <span className="font-bold text-red-400">{rrr}</span>
          </div>
        </div>

        {/* Next Role Description */}
        <div className="text-xs text-slate-300 my-2">
          {nextRole === 'BATTING' ? (
            <span>
              🏏 Put on your pads! <strong className="text-white">{secondInningsTeamName}</strong> is batting to chase the target!
            </span>
          ) : (
            <span>
              🎯 Take the ball! <strong className="text-white">{secondInningsTeamName}</strong> is bowling to defend the target!
            </span>
          )}
        </div>

        {/* Start 2nd Innings Action Button */}
        <button
          onClick={() => {
            sound.playClick();
            onStartSecondInnings();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:brightness-110 active:scale-95 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
        >
          <span>START 2ND INNINGS 🚀</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>

      </div>
    </div>
  );
}
