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
  Users,
  Plus
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

const CHASE_FORMATS = {
  18: {
    tag: 'DEATH OVER',
    author: 'u/Informal_Wrap2297',
    authorRole: 'Century maker',
    runs: 55,
    balls: 18,
    rrr: '18.33',
    score: '101-0 · 17.0 ov'
  },
  6: {
    tag: 'SUPER OVER',
    author: 'u/SuperStriker',
    authorRole: 'Clutch Finisher',
    runs: 22,
    balls: 6,
    rrr: '22.00',
    score: '0-0 · 0.0 ov'
  },
  12: {
    tag: 'THRILLER',
    author: 'u/BoundaryHunter',
    authorRole: 'Six Machine',
    runs: 28,
    balls: 12,
    rrr: '14.00',
    score: '167-7 · 18.0 ov'
  },
  24: {
    tag: 'MATCH PLAY',
    author: 'u/MasterChaser',
    authorRole: 'Anchor',
    runs: 54,
    balls: 24,
    rrr: '13.50',
    score: '95-2 · 16.0 ov'
  },
  30: {
    tag: 'T5 CUP',
    author: 'u/CaptainClutch',
    authorRole: 'World Champ',
    runs: 68,
    balls: 30,
    rrr: '13.60',
    score: '80-2 · 15.0 ov'
  }
};

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
  // Selected Batting and Bowling Teams for Quick Play / Chase
  const [battingTeamKey, setBattingTeamKey] = useState('IND');
  const [bowlingTeamKey, setBowlingTeamKey] = useState('SA');

  // Selected format for the featured Chase Card (default 18 balls matching Reference Image 2)
  const [selectedBalls, setSelectedBalls] = useState(18);

  // Team Selector Modal State
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamModalTab, setTeamModalTab] = useState('batting'); // 'batting' or 'bowling'
  const [teamCategoryFilter, setTeamCategoryFilter] = useState('all'); // 'all', 'international', 'ipl'

  const currentBattingTeam = TEAMS[battingTeamKey] || TEAMS.IND;
  const currentBowlingTeam = TEAMS[bowlingTeamKey] || TEAMS.SA;
  const currentFormat = CHASE_FORMATS[selectedBalls] || CHASE_FORMATS[18];

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
    <div className="relative w-full h-full flex flex-col bg-[#07130a] text-slate-100 overflow-y-auto safe-p-top safe-p-bottom select-none">
      {/* ==================================================================== */}
      {/* AUTHENTIC CRICKET OUTFIELD BACKGROUND (Exact Replica of Image 2)     */}
      {/* ==================================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Alternating vertical striped lawn-mower grass bands */}
        <div className="absolute inset-0 opacity-45 bg-[repeating-linear-gradient(90deg,#0a1c11_0px,#0a1c11_44px,#0f2a1a_44px,#0f2a1a_88px)]" />

        {/* 30-Yard Fielding Circle Curve (White Dashed Arc) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none">
          <ellipse
            cx="50%"
            cy="36%"
            rx="56%"
            ry="42%"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeDasharray="7 7"
          />
        </svg>

        {/* Fielder standing near 30-yard ring line with aiming trace (Image 2) */}
        <div className="absolute top-[34%] left-[49%] -translate-x-1/2 pointer-events-none flex flex-col items-center opacity-75">
          {/* Subtle throw guide ray pointing down-right */}
          <div className="w-[1px] h-20 bg-gradient-to-b from-amber-400/50 via-amber-400/20 to-transparent rotate-[28deg] origin-top mt-2" />
          <div className="absolute top-0 w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg">
            <div className="w-2 h-2 rounded-full bg-red-600" />
          </div>
        </div>

        {/* Deep boundary fielder in distance (top-left) */}
        <div className="absolute top-[16%] left-[8%] pointer-events-none opacity-40">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
        </div>

        {/* Ambient Dark Edge Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85" />
      </div>

      {/* ==================================================================== */}
      {/* TOP HEADER BAR (Exact Replica of Image 2)                           */}
      {/* ==================================================================== */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 pt-3 pb-2 flex items-center justify-between">
        <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-[#fef9c3] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          CRICKET RUSH
        </h1>

        <div className="flex items-center gap-2">
          {/* Plus Button: Opens Custom Challenge Creator */}
          <button
            onClick={() => { sound.playClick(); onOpenCreator(); }}
            className="w-9 h-9 rounded-full bg-[#132117]/95 hover:bg-[#1c3022] active:scale-95 border border-white/10 flex items-center justify-center text-white shadow-xl transition-all cursor-pointer"
            title="Create Custom Challenge (+)"
          >
            <Plus className="w-4 h-4 text-white stroke-[2.5]" />
          </button>

          {/* Profile / Status Button: Opens Settings & Profile */}
          <button
            onClick={() => { sound.playClick(); onOpenSettings(); }}
            className="w-9 h-9 rounded-full bg-[#132117]/95 hover:bg-[#1c3022] active:scale-95 border border-white/10 flex items-center justify-center text-slate-300 shadow-xl transition-all cursor-pointer relative"
            title="Settings & Level"
          >
            <div className="w-4 h-4 rounded-full border-2 border-slate-400 bg-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MAIN CONTAINER: FEATURE CHASE CARD + MODES SHELF                     */}
      {/* ==================================================================== */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 flex-1 flex flex-col justify-end pb-3 space-y-3">
        {/* ================================================================== */}
        {/* HERO CHASE CARD (Exact 1:1 Pixel Match of Image 2)                 */}
        {/* ================================================================== */}
        <div className="w-full bg-[#0b140e]/95 border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
          {/* Tag Badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#facc15] text-slate-950 font-display font-black text-xs px-2.5 py-0.5 rounded tracking-wider uppercase shadow-sm">
              {currentFormat.tag}
            </span>
          </div>

          {/* Creator Attribution */}
          <div className="text-xs text-slate-300 font-medium mb-3">
            Set by <span className="font-bold text-white">{currentFormat.author}</span>
            <span className="text-amber-400 font-bold ml-2">{currentFormat.authorRole}</span>
          </div>

          {/* Team Matchup Pills & Score/Overs */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div
              onClick={() => { sound.playClick(); setShowTeamModal(true); }}
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 active:scale-95 transition-all group"
              title="Click to Choose Teams"
            >
              <span
                className="px-2.5 py-0.5 rounded font-display font-black text-xs text-white uppercase tracking-wider shadow-sm flex items-center gap-1"
                style={{ background: currentBattingTeam.jersey?.color || '#0284c7' }}
              >
                {currentBattingTeam.code}
              </span>
              <span className="text-[11px] font-bold italic text-slate-400">vs</span>
              <span
                className="px-2.5 py-0.5 rounded font-display font-black text-xs text-white uppercase tracking-wider shadow-sm flex items-center gap-1"
                style={{ background: currentBowlingTeam.jersey?.color || '#ea580c' }}
              >
                {currentBowlingTeam.code}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            </div>

            <div className="text-xs font-mono font-bold text-slate-300 tracking-tight">
              {currentFormat.score}
            </div>
          </div>

          {/* Big Target Equation: Runs Needed off Balls */}
          <div className="flex items-end justify-between gap-3 my-2">
            <div className="flex items-baseline gap-2.5">
              <span className="font-display font-black text-5xl sm:text-6xl text-white tracking-tight leading-none drop-shadow-md">
                {currentFormat.runs}
              </span>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">runs</span>
                <span className="text-xs text-slate-300">
                  off <span className="font-black text-white text-sm">{selectedBalls}</span> balls
                </span>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#ef4444] text-white font-display font-black text-xs tracking-wider shadow-md whitespace-nowrap">
              RRR {currentFormat.rrr}
            </div>
          </div>

          {/* Action Buttons: ▶ PLAY THE CHASE + ◎ Nets */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => {
                sound.playClick();
                onStartQuickPlay(selectedBalls, battingTeamKey, bowlingTeamKey);
              }}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#f95738] via-[#fa4f33] to-[#ef4444] hover:brightness-110 active:scale-98 text-white font-display font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-orange-600/30 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" /> PLAY THE CHASE
            </button>

            <button
              onClick={() => { sound.playClick(); onOpenPractice(); }}
              className="py-3.5 px-4 rounded-2xl bg-[#121c16]/95 hover:bg-[#1a2920] active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10 shadow-lg transition-all cursor-pointer"
              title="Practice in Nets"
            >
              <Target className="w-4 h-4 text-emerald-400" /> Nets
            </button>
          </div>

          {/* Leaderboard / Winner Ticker Pill */}
          <div
            onClick={() => { sound.playClick(); onOpenLeaderboard(); }}
            className="mt-3 bg-[#08110b]/90 border border-white/5 hover:border-white/10 rounded-xl px-3 py-2 flex items-center justify-between text-xs cursor-pointer transition-all active:scale-98 group"
          >
            <div className="flex items-center min-w-0">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center mr-2 flex-shrink-0">
                1
              </span>
              <span className="font-bold text-white truncate max-w-[110px] sm:max-w-none">
                Ouagadogou
              </span>
              <span className="text-emerald-400 font-semibold ml-2 text-[11px] truncate">
                Won · 7 balls left
              </span>
            </div>
            <span className="text-amber-400 font-bold group-hover:text-amber-300 flex items-center gap-0.5 ml-2 flex-shrink-0">
              All ›
            </span>
          </div>
        </div>

        {/* ================================================================== */}
        {/* QUICK FORMAT & OVERS CHIPS (6B, 12B, 18B, 24B, 30B)                */}
        {/* ================================================================== */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {[
            { balls: 18, label: '18B Death Over' },
            { balls: 6, label: '6B Super Over' },
            { balls: 12, label: '12B Thriller' },
            { balls: 24, label: '24B Match Play' },
            { balls: 30, label: '30B T5 Cup' }
          ].map(fmt => (
            <button
              key={fmt.balls}
              onClick={() => { sound.playClick(); setSelectedBalls(fmt.balls); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                selectedBalls === fmt.balls
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20'
                  : 'bg-[#0f1c14]/90 hover:bg-[#172b1e] text-slate-300 border border-white/5'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>

        {/* ================================================================== */}
        {/* ALL GAME MODES SHELF (Quick, Challenges, Campaign, Nets, etc.)      */}
        {/* ================================================================== */}
        <div className="grid grid-cols-2 gap-2">
          {/* Challenge Arena */}
          <button
            onClick={() => { sound.playClick(); onOpenChallenges(); }}
            className="bg-[#0b140e]/90 hover:bg-[#122016] border border-white/5 hover:border-emerald-500/30 p-2.5 rounded-2xl text-left flex items-center justify-between group active:scale-95 transition-all cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                <Flame className="w-3 h-3 text-amber-400" /> SCENARIOS
              </div>
              <h4 className="text-xs sm:text-sm font-display font-extrabold text-white">
                CHALLENGES
              </h4>
            </div>
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Stadium Campaign */}
          <button
            onClick={() => { sound.playClick(); onOpenCampaign(); }}
            className="bg-[#0b140e]/90 hover:bg-[#122016] border border-white/5 hover:border-purple-500/30 p-2.5 rounded-2xl text-left flex items-center justify-between group active:scale-95 transition-all cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-purple-400">
                <Trophy className="w-3 h-3 text-purple-400" /> CAREER TOUR
              </div>
              <h4 className="text-xs sm:text-sm font-display font-extrabold text-white">
                STADIUM TOUR
              </h4>
            </div>
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Trophy className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* Rivalries Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 whitespace-nowrap mr-0.5">
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
              className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                battingTeamKey === r.bat && bowlingTeamKey === r.bowl
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'bg-[#101e14]/90 hover:bg-[#172c1e] text-slate-300 border border-white/5'
              }`}
            >
              {r.badge} {r.label}
            </button>
          ))}
          <button
            onClick={handleRandomizeRivalry}
            className="px-2 py-0.5 rounded-lg text-[10.5px] font-bold bg-[#101e14]/90 hover:bg-[#172c1e] text-slate-300 border border-white/5 flex items-center gap-1 whitespace-nowrap active:scale-95 cursor-pointer"
            title="Random Matchup"
          >
            <Shuffle className="w-3 h-3 text-amber-400" />
            <span>Random</span>
          </button>
        </div>

        {/* ================================================================== */}
        {/* BOTTOM UTILITY DOCK (Quests, Shop, Leaderboard, Settings)           */}
        {/* ================================================================== */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <button
            onClick={() => { sound.playClick(); onOpenQuests(); }}
            className="bg-[#0b140e]/90 hover:bg-[#132317] border border-white/5 p-2 rounded-xl flex flex-col items-center justify-center gap-0.5 text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-ping" />
            </div>
            <span className="text-[10px] font-bold">Quests</span>
          </button>

          <button
            onClick={() => { sound.playClick(); onOpenShop(); }}
            className="bg-[#0b140e]/90 hover:bg-[#132317] border border-white/5 p-2 rounded-xl flex flex-col items-center justify-center gap-0.5 text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold">Shop</span>
          </button>

          <button
            onClick={() => { sound.playClick(); onOpenLeaderboard(); }}
            className="bg-[#0b140e]/90 hover:bg-[#132317] border border-white/5 p-2 rounded-xl flex flex-col items-center justify-center gap-0.5 text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-bold">Fame</span>
          </button>

          <button
            onClick={() => { sound.playClick(); onOpenSettings(); }}
            className="bg-[#0b140e]/90 hover:bg-[#132317] border border-white/5 p-2 rounded-xl flex flex-col items-center justify-center gap-0.5 text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold">Settings</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* Choose Matchup Teams Modal (All Countries & IPL Teams)               */}
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
                  Select batting lineup and bowling opponent
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
                🌍 Countries ({teamList.filter(t => t.type === 'international').length})
              </button>
              <button
                onClick={() => { sound.playClick(); setTeamCategoryFilter('ipl'); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  teamCategoryFilter === 'ipl'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ⚡ IPL Franchises ({teamList.filter(t => t.type === 'ipl').length})
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
