import React from 'react';
import { sound } from '../game/SoundEffects';
import { Play, RotateCcw, Home, Volume2, VolumeX, Smartphone, X } from 'lucide-react';

export default function PauseModal({
  onResume,
  onRestart,
  onQuit,
  isMuted,
  onToggleMute,
  hapticsEnabled,
  onToggleHaptics,
  matchStats
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm glass-panel-glow rounded-3xl p-6 border border-slate-700 text-center animate-bounce-subtle">
        {/* Title Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <h2 className="text-xl font-display font-extrabold text-white tracking-wide">
            MATCH PAUSED
          </h2>
          <button
            onClick={onResume}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Match Snapshot Banner */}
        {matchStats && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 mb-5 flex items-center justify-around text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
              <span className="text-xl font-display font-black text-white">{matchStats.score}</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Need</span>
              <span className="text-xl font-display font-black text-red-400">{matchStats.runsNeeded} ({matchStats.ballsLeft}b)</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">RRR</span>
              <span className="text-xl font-mono font-bold text-amber-400">{matchStats.rrr}</span>
            </div>
          </div>
        )}

        {/* Audio & Haptic Toggles */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            onClick={() => { sound.playClick(); onToggleMute(); }}
            className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              !isMuted
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'Muted' : 'Sound ON'}</span>
          </button>

          <button
            onClick={() => { sound.playClick(); onToggleHaptics(); }}
            className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              hapticsEnabled
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>{hapticsEnabled ? 'Haptics ON' : 'Haptics OFF'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Resume Match */}
          <button
            onClick={() => { sound.playClick(); onResume(); }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-display font-black text-base tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-transform"
          >
            <Play className="w-5 h-5 fill-slate-950" /> RESUME MATCH
          </button>

          {/* Restart Chase */}
          <button
            onClick={() => { sound.playClick(); onRestart(); }}
            className="w-full py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" /> RESTART CHASE
          </button>

          {/* Quit to Main Menu */}
          <button
            onClick={() => { sound.playClick(); onQuit(); }}
            className="w-full py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm font-bold text-slate-400 hover:text-red-400 flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <Home className="w-4 h-4" /> QUIT TO MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
