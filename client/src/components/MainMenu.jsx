import React from 'react';
import { sound } from '../game/SoundEffects';
import { Play, Flame, Trophy, PlusCircle, Target, ShoppingBag, Settings, Coins, Zap, Shield, Sparkles, Compass, Gauge } from 'lucide-react';

export default function MainMenu({
  profile,
  onStartQuickPlay,
  onOpenPractice,
  onOpenChallenges,
  onOpenCreator,
  onOpenCampaign,
  onOpenQuests,
  onOpenShop,
  onOpenLeaderboard,
  onOpenSettings
}) {
  const currentXpInLevel = profile.xp % 100;

  return (
    <div className="w-full h-full flex flex-col bg-cricket-dark text-slate-100 overflow-y-auto safe-p-top safe-p-bottom px-4 py-4 sm:py-6">
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-between">
        {/* Top Profile & Header Bar */}
        <div className="glass-panel rounded-3xl p-3.5 sm:p-4 mb-4 flex items-center justify-between border border-slate-800">
          {/* Player avatar & level */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 p-0.5 shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-display font-extrabold text-xl text-emerald-400">
                  {profile.playerName.slice(0, 1).toUpperCase()}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-display font-extrabold text-[10px] rounded-md shadow">
                LVL {profile.level}
              </span>
            </div>

            <div>
              <h2 className="font-display font-extrabold text-lg text-white leading-tight">
                {profile.playerName}
              </h2>
              {/* Level XP Bar */}
              <div className="w-28 sm:w-36 h-2 rounded-full bg-slate-800 mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                  style={{ width: `${currentXpInLevel}%` }}
                />
              </div>
            </div>
          </div>

          {/* Streak, Coins & Settings */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 font-bold text-xs shadow-sm">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{profile?.dailyStreak || 2} Streak</span>
            </div>

            <div
              onClick={() => { sound.playClick(); onOpenShop(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-amber-300 font-bold text-xs cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{profile.coins}</span>
            </div>

            <button
              onClick={() => { sound.playClick(); onOpenSettings(); }}
              className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Title & Branding */}
        <div className="text-center my-2 sm:my-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Arcade Chase 2.0
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white uppercase italic">
            CRICKET <span className="text-emerald-400 text-glow-green">RUSH</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Master the timing. Smash boundaries. Defend & Chase!
          </p>
        </div>

        {/* Action Modes Grid */}
        <div className="space-y-3 my-2">
          {/* Quick Play Action Card with 10, 12, 22, 30, 40, 60 Ball Formats */}
          <div className="w-full relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-slate-950 shadow-xl shadow-emerald-500/25">
            <div
              onClick={() => { sound.playClick(); onStartQuickPlay(); }}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="text-left z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900/80 block">
                  Instant Match
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-wide text-slate-950 flex items-center gap-2">
                  QUICK PLAY
                  <Play className="w-5 h-5 fill-slate-950" />
                </h3>
                <p className="text-xs text-slate-900/90 font-semibold">
                  Tap for a random chase or pick ball format below:
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-slate-950 z-10 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 fill-slate-950" />
              </div>
            </div>

            {/* Ball Formats Bar */}
            <div className="mt-3 pt-2.5 border-t border-slate-950/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-950/70 whitespace-nowrap mr-1">
                Formats:
              </span>
              {[10, 12, 22, 30, 40, 60].map((balls) => (
                <button
                  key={balls}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    onStartQuickPlay(balls);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-950/85 hover:bg-slate-950 text-white font-mono font-bold text-xs shadow hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                  title={`Play ${balls} ball match`}
                >
                  {balls}B
                </button>
              ))}
            </div>
          </div>

          {/* NET PRACTICE CARD (NEW!) */}
          <button
            onClick={() => { sound.playClick(); onOpenPractice(); }}
            className="w-full group relative overflow-hidden rounded-3xl p-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-500 hover:to-blue-500 text-white shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-between border border-blue-400/30"
          >
            <div className="text-left z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-200 block">
                Training Facility
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wide text-white flex items-center gap-2">
                NET PRACTICE & TRAINER
                <Gauge className="w-5 h-5 text-cyan-300" />
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Pace, swing, leg-spin, bouncer, yorker, slot & full toss variations!
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white z-10 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🏏</span>
            </div>
          </button>
        </div>

        {/* Secondary Game Modes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          {/* Challenge Arena */}
          <button
            onClick={() => { sound.playClick(); onOpenChallenges(); }}
            className="glass-panel hover:border-emerald-500/40 rounded-3xl p-3.5 text-left flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-0.5">
                <Flame className="w-3.5 h-3.5" />
                COMMUNITY & PRESET
              </div>
              <h4 className="text-base font-display font-extrabold text-white">
                CHALLENGE ARENA
              </h4>
              <p className="text-[11px] text-slate-400">Play curated & friend scenarios</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </button>

          {/* Create Challenge */}
          <button
            onClick={() => { sound.playClick(); onOpenCreator(); }}
            className="glass-panel hover:border-emerald-500/40 rounded-3xl p-3.5 text-left flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-0.5">
                <PlusCircle className="w-3.5 h-3.5" />
                CUSTOM BUILDER
              </div>
              <h4 className="text-base font-display font-extrabold text-white">
                CREATE CHALLENGE
              </h4>
              <p className="text-[11px] text-slate-400">Build & share your scenario code</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <PlusCircle className="w-4 h-4" />
            </div>
          </button>

          {/* Stadium Campaign */}
          <button
            onClick={() => { sound.playClick(); onOpenCampaign(); }}
            className="sm:col-span-2 glass-panel hover:border-emerald-500/40 rounded-3xl p-3.5 text-left flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 mb-0.5">
                <Trophy className="w-3.5 h-3.5" />
                CAREER PROGRESSION
              </div>
              <h4 className="text-base font-display font-extrabold text-white">
                STADIUM CAMPAIGN TOUR
              </h4>
              <p className="text-[11px] text-slate-400">Melbourne • Eden Gardens • Sharjah • Lord's Pavilion</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Bottom Utility Bar (Quests, Shop, Leaderboard) */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => { sound.playClick(); onOpenQuests(); }}
            className="glass-panel hover:border-slate-700 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <div className="relative">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse" />
            </div>
            <span className="text-[11px] font-bold">Quests</span>
          </button>

          <button
            onClick={() => { sound.playClick(); onOpenShop(); }}
            className="glass-panel hover:border-slate-700 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold">Gear Shop</span>
          </button>

          <button
            onClick={() => { sound.playClick(); onOpenLeaderboard(); }}
            className="glass-panel hover:border-slate-700 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <Trophy className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-bold">Hall of Fame</span>
          </button>
        </div>
      </div>
    </div>
  );
}
