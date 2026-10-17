import React, { useState } from 'react';
import { sound } from '../game/SoundEffects';
import {
  Play,
  Flame,
  Trophy,
  PlusCircle,
  Target,
  ShoppingBag,
  Settings,
  Coins,
  Zap,
  Shield,
  Sparkles,
  Compass,
  Gauge,
  ChevronDown,
  Check,
  X,
  Shuffle,
  Globe,
  Users
} from 'lucide-react';
import { TEAMS } from '../game/TeamData';

const RIVALRIES = [
  { bat: 'IND', bowl: 'SA', label: 'IND vs SA', badge: '🇮🇳 v 🇿🇦' },
  { bat: 'IND', bowl: 'AUS', label: 'IND vs AUS', badge: '🇮🇳 v 🇦🇺' },
  { bat: 'IND', bowl: 'PAK', label: 'IND vs PAK', badge: '🇮🇳 v 🇵🇰' },
  { bat: 'CSK', bowl: 'MI', label: 'CSK vs MI', badge: '💛 v 💙' },
  { bat: 'SRH', bowl: 'KKR', label: 'SRH vs KKR', badge: '🧡 v 💜' },
  { bat: 'RCB', bowl: 'RR', label: 'RCB vs RR', badge: '❤️ v 🩷' }
];

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

  // Selected Batting and Bowling Teams for Quick Play
  const [battingTeamKey, setBattingTeamKey] = useState('IND');
  const [bowlingTeamKey, setBowlingTeamKey] = useState('SA');

  // Team Selector Modal State
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamModalTab, setTeamModalTab] = useState('batting'); // 'batting' or 'bowling'
  const [teamCategoryFilter, setTeamCategoryFilter] = useState('all'); // 'all', 'international', 'ipl'

  const currentBattingTeam = TEAMS[battingTeamKey] || TEAMS.IND;
  const currentBowlingTeam = TEAMS[bowlingTeamKey] || TEAMS.SA;

  const teamList = Object.values(TEAMS);
  const filteredTeams = teamCategoryFilter === 'all'
    ? teamList
    : teamList.filter(t => t.type === teamCategoryFilter);

  const handleRandomizeRivalry = (e) => {
    e.stopPropagation();
    sound.playClick();
    const allKeys = Object.keys(TEAMS);
    const randomBat = allKeys[Math.floor(Math.random() * allKeys.length)];
    let randomBowl = allKeys[Math.floor(Math.random() * allKeys.length)];
    if (randomBowl === randomBat) {
      randomBowl = allKeys.find(k => k !== randomBat) || 'SA';
    }
    setBattingTeamKey(randomBat);
    setBowlingTeamKey(randomBowl);
  };

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
            T20 World & IPL Edition
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
          {/* Quick Play Action Card with Interactive Matchup Selection & Formats */}
          <div className="w-full relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-slate-950 shadow-xl shadow-emerald-500/25">
            <div
              onClick={() => { sound.playClick(); onStartQuickPlay(null, battingTeamKey, bowlingTeamKey); }}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="text-left z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900/80 block">
                  Instant Match • {currentBattingTeam.code} vs {currentBowlingTeam.code}
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-wide text-slate-950 flex items-center gap-2">
                  QUICK PLAY
                  <Play className="w-5 h-5 fill-slate-950" />
                </h3>
                <p className="text-xs text-slate-900/90 font-semibold">
                  Tap to play or choose teams & ball format below:
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-slate-950 z-10 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 fill-slate-950" />
              </div>
            </div>

            {/* Matchup Team Selector Bar */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                setShowTeamModal(true);
              }}
              className="mt-3 p-2.5 sm:px-3 sm:py-2 rounded-2xl bg-slate-950/90 hover:bg-slate-950 text-white border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer transition-all shadow-md group"
            >
              <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 flex-1 min-w-0">
                {/* Batting Team */}
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base sm:text-lg border border-white/20 shadow-sm flex-shrink-0"
                    style={{
                      background: currentBattingTeam.jersey?.color || '#2563eb'
                    }}
                  >
                    {currentBattingTeam.badge}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-300 font-display font-black text-xs sm:text-sm">
                        {currentBattingTeam.code}
                      </span>
                      <span className="text-[9px] font-bold px-1 rounded bg-amber-400/20 text-amber-300">
                        BAT
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium truncate block max-w-[100px] sm:max-w-[140px]">
                      {currentBattingTeam.batsmen?.[0]}
                    </span>
                  </div>
                </div>

                {/* VS Badge */}
                <div className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                  VS
                </div>

                {/* Bowling Team */}
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base sm:text-lg border border-white/20 shadow-sm flex-shrink-0"
                    style={{
                      background: currentBowlingTeam.jersey?.color || '#059669'
                    }}
                  >
                    {currentBowlingTeam.badge}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-cyan-300 font-display font-black text-xs sm:text-sm">
                        {currentBowlingTeam.code}
                      </span>
                      <span className="text-[9px] font-bold px-1 rounded bg-cyan-400/20 text-cyan-300">
                        BOWL
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium truncate block max-w-[100px] sm:max-w-[140px]">
                      {currentBowlingTeam.bowlers?.[0]?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Change Button */}
              <div className="flex items-center justify-center sm:justify-end gap-1 text-[11px] font-bold text-emerald-400 group-hover:text-emerald-300 py-1 sm:py-0 border-t sm:border-t-0 border-slate-800">
                <span>Change Teams</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Quick Rivalry Shortcuts */}
            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-950/75 whitespace-nowrap mr-0.5">
                Rivals:
              </span>
              {RIVALRIES.map(r => (
                <button
                  key={r.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setBattingTeamKey(r.bat);
                    setBowlingTeamKey(r.bowl);
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all active:scale-95 ${
                    battingTeamKey === r.bat && bowlingTeamKey === r.bowl
                      ? 'bg-slate-950 text-amber-300 shadow font-black ring-1 ring-amber-400'
                      : 'bg-slate-950/30 hover:bg-slate-950/60 text-slate-950 font-bold'
                  }`}
                >
                  {r.badge} {r.label}
                </button>
              ))}

              <button
                onClick={handleRandomizeRivalry}
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-slate-950/30 hover:bg-slate-950 text-slate-950 hover:text-white transition-all flex items-center gap-1 whitespace-nowrap active:scale-95"
                title="Random Rivalry"
              >
                <Shuffle className="w-3 h-3" />
                <span>Random</span>
              </button>
            </div>

            {/* Ball Formats Bar */}
            <div className="mt-2 pt-2 border-t border-slate-950/15 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-950/75 whitespace-nowrap mr-1">
                Overs:
              </span>
              {[
                { balls: 6, label: '6B (1 Over)' },
                { balls: 12, label: '12B (2 Ov)' },
                { balls: 18, label: '18B (3 Ov)' },
                { balls: 24, label: '24B (4 Ov)' },
                { balls: 30, label: '30B (5 Ov)' }
              ].map(({ balls, label }) => (
                <button
                  key={balls}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    onStartQuickPlay(balls, battingTeamKey, bowlingTeamKey);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-950/85 hover:bg-slate-950 text-white font-mono font-bold text-xs shadow hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                  title={`Play ${balls} ball match with ${currentBattingTeam.code} vs ${currentBowlingTeam.code}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* NET PRACTICE CARD */}
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

      {/* ==================================================================== */}
      {/* Interactive Team Selector Modal (All Countries & IPL Teams) */}
      {/* ==================================================================== */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4">
          <div className="glass-panel w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/98 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-display font-black text-white flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  CHOOSE MATCHUP TEAMS
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Select your batting lineup and bowling opponent
                </p>
              </div>
              <button
                onClick={() => { sound.playClick(); setShowTeamModal(false); }}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Batting vs Bowling Switcher Tab */}
            <div className="px-3 sm:px-4 pt-3 flex gap-2">
              <button
                onClick={() => { sound.playClick(); setTeamModalTab('batting'); }}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  teamModalTab === 'batting'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>Batting:</span>
                <span className="font-extrabold">{currentBattingTeam.badge} {currentBattingTeam.code}</span>
              </button>

              <button
                onClick={() => { sound.playClick(); setTeamModalTab('bowling'); }}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  teamModalTab === 'bowling'
                    ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>Bowling:</span>
                <span className="font-extrabold">{currentBowlingTeam.badge} {currentBowlingTeam.code}</span>
              </button>
            </div>

            {/* League filter: All / International / IPL */}
            <div className="px-3 sm:px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => { sound.playClick(); setTeamCategoryFilter('all'); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  teamCategoryFilter === 'all'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Teams ({teamList.length})
              </button>
              <button
                onClick={() => { sound.playClick(); setTeamCategoryFilter('international'); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  teamCategoryFilter === 'international'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🌍 Countries (9)
              </button>
              <button
                onClick={() => { sound.playClick(); setTeamCategoryFilter('ipl'); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  teamCategoryFilter === 'ipl'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ⚡ IPL Franchises (10)
              </button>
            </div>

            {/* Teams Grid */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {filteredTeams.map((team) => {
                const isSelected = teamModalTab === 'batting'
                  ? battingTeamKey === team.code
                  : bowlingTeamKey === team.code;

                return (
                  <div
                    key={team.code}
                    onClick={() => {
                      sound.playClick();
                      if (teamModalTab === 'batting') {
                        setBattingTeamKey(team.code);
                        // If bowling team matches new batting team, auto-swap to rival
                        if (bowlingTeamKey === team.code) {
                          setBowlingTeamKey(team.code === 'SA' ? 'IND' : 'SA');
                        }
                      } else {
                        setBowlingTeamKey(team.code);
                        if (battingTeamKey === team.code) {
                          setBattingTeamKey(team.code === 'IND' ? 'SA' : 'IND');
                        }
                      }
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/15 shadow-md shadow-emerald-500/20'
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/20 shadow-md text-2xl select-none"
                        style={{
                          background: team.jersey?.secondaryColor
                            ? `linear-gradient(135deg, ${team.jersey.color} 50%, ${team.jersey.secondaryColor} 50%)`
                            : team.jersey?.color || '#2563eb'
                        }}
                      >
                        {team.badge}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-extrabold text-white text-sm">
                            {team.name}
                          </h4>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-slate-700">
                            {team.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                          {teamModalTab === 'batting'
                            ? `Batters: ${team.batsmen?.slice(0, 4).join(', ')}...`
                            : `Bowlers: ${team.bowlers?.map(b => b.name).slice(0, 3).join(', ')}...`}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-white">
                          <span className="text-xs">+</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Confirm Button */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-400">Matchup: </span>
                <span className="font-bold text-amber-400">{currentBattingTeam.code}</span>
                <span className="text-slate-500"> vs </span>
                <span className="font-bold text-cyan-400">{currentBowlingTeam.code}</span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowTeamModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Confirm Matchup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
