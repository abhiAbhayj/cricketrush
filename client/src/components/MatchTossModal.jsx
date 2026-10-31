import React, { useState } from 'react';
import { Coins, Zap, Shield, Sparkles, Check, ChevronRight } from 'lucide-react';
import { TEAMS, getTeam } from '../game/TeamData';
import { sound } from '../game/SoundEffects';

export default function MatchTossModal({
  userTeamCode = 'IND',
  oppTeamCode = 'AUS',
  stadiumName = 'Colosseum Mega Arena',
  matchBalls = 18,
  onTossComplete,
  onSkip
}) {
  const [step, setStep] = useState('CALL'); // 'CALL', 'FLIPPING', 'DECISION', 'OPP_DECISION'
  const [userCall, setUserCall] = useState('HEADS'); // 'HEADS' or 'TAILS'
  const [tossResult, setTossResult] = useState(null); // 'HEADS' or 'TAILS'
  const [tossWinner, setTossWinner] = useState(null); // 'USER' or 'OPP'
  const [oppDecision, setOppDecision] = useState(null); // 'BAT' or 'BOWL'

  const userTeam = getTeam(userTeamCode);
  const oppTeam = getTeam(oppTeamCode);

  const userCaptain = userTeam.batsmen?.[0] || 'Captain';
  const oppCaptain = oppTeam.batsmen?.[0] || 'Opposition Captain';

  const handleStartFlip = () => {
    sound.playClick();
    setStep('FLIPPING');
    try {
      sound.playCoin();
    } catch {}

    // Random outcome: 50% Heads, 50% Tails
    const result = Math.random() < 0.5 ? 'HEADS' : 'TAILS';
    const isUserWinner = result === userCall;

    setTimeout(() => {
      setTossResult(result);
      if (isUserWinner) {
        setTossWinner('USER');
        setStep('DECISION');
      } else {
        setTossWinner('OPP');
        // AI Decision: 55% bowl first on good pitches, 45% bat first
        const aiChoice = Math.random() < 0.55 ? 'BOWL' : 'BAT';
        setOppDecision(aiChoice);
        setStep('OPP_DECISION');
      }
    }, 1800);
  };

  const handleUserDecision = (decision) => {
    sound.playClick();
    onTossComplete({
      winner: 'USER',
      tossCall: userCall,
      tossResult,
      decision, // 'BAT' or 'BOWL'
      gameRole: decision === 'BAT' ? 'BATTING' : 'BOWLING'
    });
  };

  const handleProceedOppDecision = () => {
    sound.playClick();
    onTossComplete({
      winner: 'OPP',
      tossCall: userCall,
      tossResult,
      decision: oppDecision,
      // If OPP chooses to BOWL, user must BAT. If OPP chooses to BAT, user must BOWL!
      gameRole: oppDecision === 'BOWL' ? 'BATTING' : 'BOWLING'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-[#0b121e] border-2 border-amber-400/70 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col items-center text-center overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Skip Toss Quick Pill */}
        <button
          onClick={onSkip}
          className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>Quick Start</span>
          <ChevronRight className="w-3 h-3" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black tracking-widest uppercase mb-1">
          <Coins className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>OFFICIAL MATCH TOSS</span>
        </div>

        {/* Rivalry Banner */}
        <div className="flex items-center justify-center gap-3 w-full py-2 my-1 border-y border-slate-800/80">
          <div className="flex items-center gap-1.5 text-left">
            <span className="text-xl sm:text-2xl">{userTeam.flag || '🏏'}</span>
            <div>
              <div className="text-xs font-black text-white uppercase">{userTeam.name}</div>
              <div className="text-[10px] text-slate-400">{userCaptain} (C)</div>
            </div>
          </div>
          <span className="text-xs font-black text-amber-400 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800">VS</span>
          <div className="flex items-center gap-1.5 text-right flex-row-reverse">
            <span className="text-xl sm:text-2xl">{oppTeam.flag || '🏏'}</span>
            <div>
              <div className="text-xs font-black text-white uppercase">{oppTeam.name}</div>
              <div className="text-[10px] text-slate-400">{oppCaptain} (C)</div>
            </div>
          </div>
        </div>

        {/* Match Details Pill */}
        <div className="text-[11px] text-slate-400 mt-1 mb-3">
          {stadiumName} • <span className="text-slate-300 font-semibold">{Math.ceil(matchBalls / 6)} Overs Match</span>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STEP 1: CAPTAIN'S CALL (HEADS OR TAILS)                       */}
        {/* ------------------------------------------------------------- */}
        {step === 'CALL' && (
          <div className="w-full flex flex-col items-center gap-4 animate-scale-up">
            <div className="text-xs font-bold text-slate-200">
              {userCaptain}, call the toss:
            </div>

            {/* Coin Graphic Buttons */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
              {/* Heads Coin */}
              <button
                onClick={() => { sound.playClick(); setUserCall('HEADS'); }}
                className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center gap-1 border-2 transition-all active:scale-95 cursor-pointer shadow-xl ${
                  userCall === 'HEADS'
                    ? 'bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border-white ring-4 ring-amber-400/40 scale-105'
                    : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-amber-400/50 opacity-80'
                }`}
              >
                <div className="w-16 h-16 rounded-full border border-dashed border-amber-950/40 flex items-center justify-center bg-amber-400/20">
                  <span className="text-2xl">👑</span>
                </div>
                <span className={`text-xs font-black tracking-wider uppercase ${userCall === 'HEADS' ? 'text-slate-950 font-black' : 'text-slate-300'}`}>
                  HEADS
                </span>
                {userCall === 'HEADS' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>

              {/* Tails Coin */}
              <button
                onClick={() => { sound.playClick(); setUserCall('TAILS'); }}
                className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center gap-1 border-2 transition-all active:scale-95 cursor-pointer shadow-xl ${
                  userCall === 'TAILS'
                    ? 'bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border-white ring-4 ring-amber-400/40 scale-105'
                    : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-amber-400/50 opacity-80'
                }`}
              >
                <div className="w-16 h-16 rounded-full border border-dashed border-amber-950/40 flex items-center justify-center bg-amber-400/20">
                  <span className="text-2xl">🏏</span>
                </div>
                <span className={`text-xs font-black tracking-wider uppercase ${userCall === 'TAILS' ? 'text-slate-950 font-black' : 'text-slate-300'}`}>
                  TAILS
                </span>
                {userCall === 'TAILS' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            </div>

            {/* Flip Coin Action Button */}
            <button
              onClick={handleStartFlip}
              className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Coins className="w-4 h-4 fill-slate-950" />
              <span>FLIP THE COIN 🚀</span>
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 2: 3D COIN SPINNING ANIMATION                            */}
        {/* ------------------------------------------------------------- */}
        {step === 'FLIPPING' && (
          <div className="w-full py-8 flex flex-col items-center justify-center gap-4">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-amber-700 border-4 border-yellow-200 shadow-[0_0_35px_rgba(250,204,21,0.6)] animate-spin flex items-center justify-center">
                <span className="text-3xl font-black text-slate-950">🪙</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/50 animate-ping opacity-30" />
            </div>

            <div className="text-sm font-black text-amber-400 uppercase tracking-widest animate-pulse">
              Flipping Coin in the Air...
            </div>
            <div className="text-xs text-slate-400">
              {userTeam.name} called <span className="font-bold text-white">{userCall}</span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 3: USER WON TOSS (CHOOSE BAT OR BOWL)                    */}
        {/* ------------------------------------------------------------- */}
        {step === 'DECISION' && (
          <div className="w-full flex flex-col items-center gap-3.5 animate-scale-up">
            {/* Won Banner */}
            <div className="w-full py-2 px-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center gap-2 text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs sm:text-sm font-black uppercase">
                🎉 {userTeam.name} WON THE TOSS!
              </span>
            </div>

            <div className="text-xs text-slate-300 font-medium">
              Coin landed on <span className="font-bold text-amber-400">{tossResult}</span>. What would you like to do?
            </div>

            {/* Decision Cards: BAT FIRST vs BOWL FIRST */}
            <div className="grid grid-cols-2 gap-3 w-full mt-1">
              {/* Option 1: Bat First */}
              <button
                onClick={() => handleUserDecision('BAT')}
                className="group p-4 rounded-2xl bg-[#0f1c14] hover:bg-[#152a1d] border-2 border-emerald-500/60 hover:border-emerald-400 active:scale-95 flex flex-col items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30 flex items-center justify-center text-2xl">
                  🏏
                </div>
                <div className="text-xs sm:text-sm font-black text-white uppercase tracking-wide">
                  BAT FIRST
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  Set a commanding match total
                </div>
              </button>

              {/* Option 2: Bowl First */}
              <button
                onClick={() => handleUserDecision('BOWL')}
                className="group p-4 rounded-2xl bg-[#0f172a] hover:bg-[#172544] border-2 border-cyan-500/60 hover:border-cyan-400 active:scale-95 flex flex-col items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/30 flex items-center justify-center text-2xl">
                  🎯
                </div>
                <div className="text-xs sm:text-sm font-black text-white uppercase tracking-wide">
                  BOWL FIRST
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  Manual bowling & hunt wickets
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 4: OPPONENT WON TOSS (SHOW DECISION & PROCEED)           */}
        {/* ------------------------------------------------------------- */}
        {step === 'OPP_DECISION' && (
          <div className="w-full flex flex-col items-center gap-3.5 animate-scale-up">
            {/* Opponent Won Banner */}
            <div className="w-full py-2 px-3 rounded-2xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center gap-2 text-amber-300">
              <span className="text-xs sm:text-sm font-black uppercase">
                🪙 {oppTeam.name} WON THE TOSS
              </span>
            </div>

            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 w-full flex flex-col gap-1.5 text-center">
              <div className="text-xs text-slate-400">
                Coin landed on <span className="font-bold text-amber-400">{tossResult}</span>
              </div>
              <div className="text-sm sm:text-base font-black text-white">
                {oppCaptain} elected to <span className="text-amber-400 uppercase font-black">{oppDecision} FIRST</span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {oppDecision === 'BOWL'
                  ? `👉 ${userTeam.name} will BAT FIRST!`
                  : `👉 ${userTeam.name} will BOWL FIRST!`}
              </div>
            </div>

            <button
              onClick={handleProceedOppDecision}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-110 active:scale-95 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all mt-1"
            >
              <span>PROCEED TO MATCH 🚀</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
