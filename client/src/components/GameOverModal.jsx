import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { storageService } from '../services/storage';
import { sound } from '../game/SoundEffects';
import { RotateCcw } from 'lucide-react';

export default function GameOverModal({
  matchResult,
  matchConfig,
  onPlayAgain,
  onBackToMenu,
  onOpenPractice,
  profile,
  onProfileUpdate
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Calculate rewards and update profile
    const resultRewards = storageService.addMatchReward({
      runs: matchResult.runsScored,
      won: matchResult.won,
      sixes: matchResult.sixes,
      fours: matchResult.fours
    });

    if (matchResult.won && matchConfig?.campaignLevelId) {
      const unlockRes = storageService.unlockCampaignLevel(matchConfig.campaignLevelId);
      if (onProfileUpdate) onProfileUpdate(unlockRes.profile);
    } else {
      if (onProfileUpdate) onProfileUpdate(resultRewards.profile);
    }

    // 2. Submit to leaderboard
    api.submitScore({
      playerName: profile?.playerName || 'Guest Striker',
      score: matchResult.runsScored,
      ballsFaced: matchResult.ballsFaced,
      strikeRate: matchResult.strikeRate,
      sixes: matchResult.sixes,
      fours: matchResult.fours,
      mode: matchConfig?.title || 'Quick Play',
      challengeCode: matchConfig?.code || null,
      won: matchResult.won
    }).catch(() => {});
  }, []);

  const handleShareResult = async () => {
    sound.playClick();
    const shareText = matchResult.won
      ? `🏏 VICTORY! Smashed ${matchResult.runsScored} runs (${matchResult.sixes} sixes) off ${matchResult.ballsFaced} balls in Cricket Rush! Can you beat my chase?`
      : `🏏 Scored ${matchResult.runsScored} runs in Cricket Rush. Can you conquer this chase?`;

    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cricket Rush Match Summary',
          text: shareText,
          url: shareUrl
        });
      } catch {
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const teamCode = matchResult.teamCode || matchConfig?.teamCode || 'BEB';
  const totalScore = matchResult.totalScore ?? ((matchConfig?.teamScoreBase || 0) + (matchResult.runsScored || 0));
  const totalWickets = matchResult.totalWickets ?? ((matchConfig?.teamWicketsBase || 0) + (matchResult.wicketsLost || 0));
  const totalTarget = matchResult.totalTarget ?? ((matchConfig?.teamScoreBase || 0) + (matchResult.targetRuns || 0));
  const wicketsLeft = Math.max(0, (matchResult.maxWickets || 10) - (matchResult.wicketsLost || 0));
  const ballsLeft = Math.max(0, (matchResult.totalBalls || 0) - (matchResult.ballsFaced || 0));
  const runsShort = Math.max(1, totalTarget - totalScore);

  const totalInningsBalls = (matchResult.initialBalls !== undefined ? matchResult.initialBalls : (matchConfig?.initialBalls ?? 0)) + (matchResult.ballsFaced || 0);
  const oversCompleted = `${Math.floor(totalInningsBalls / 6)}.${totalInningsBalls % 6}`;

  // Batting lineup: Dynamically populated from match statistics
  const battingLineup = matchResult.battingScorecard && matchResult.battingScorecard.length > 0
    ? matchResult.battingScorecard
    : (matchResult.battingLineup || [
        { name: profile?.playerName || 'D. Salunkhe', dismissal: '*', r: matchResult.runsScored || 0, b: matchResult.ballsFaced || 0, fours: matchResult.fours || 0, sixes: matchResult.sixes || 0, notOut: true }
      ]);

  // Bowling stats: Dynamically populated from match statistics
  const bowlersData = matchResult.bowlingScorecard && matchResult.bowlingScorecard.length > 0
    ? matchResult.bowlingScorecard
    : (matchResult.bowlersData || [
        { name: matchConfig?.bowlerName || 'Bowler', o: `${Math.floor((matchResult.ballsFaced || 0) / 6)}.${(matchResult.ballsFaced || 0) % 6}`, r: matchResult.runsScored || 0, w: matchResult.wicketsLost || 0, eco: matchResult.ballsFaced > 0 ? ((matchResult.runsScored / (matchResult.ballsFaced / 6)).toFixed(1)) : '0.0' }
      ]);

  // Recent overs: Dynamically populated from match statistics
  const oversData = matchResult.overByOverHistory && matchResult.overByOverHistory.length > 0
    ? matchResult.overByOverHistory.slice(-4)
    : [
        { overNum: Math.max(1, Math.ceil((matchResult.ballsFaced || 1) / 6)), balls: ['•'], runs: matchResult.runsScored || 0 }
      ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
      <div className="w-full max-w-4xl bg-[#090e1a] rounded-3xl border-2 border-[#ef4444] p-5 sm:p-7 text-white shadow-[0_0_60px_rgba(0,0,0,0.9)] animate-fade-in my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================================================================ */}
          {/* LEFT COLUMN: Header, Community, Actions & Links (Image 1)        */}
          {/* ================================================================ */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-1 rounded bg-[#0284c7] font-black italic text-xs text-white uppercase tracking-wider">
                  {teamCode}
                </span>
                <span className={`text-4xl sm:text-5xl font-display font-black tracking-tight uppercase ${matchResult.won ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                  {matchResult.won ? 'WON' : 'LOST'}
                </span>
              </div>

              <div className="text-sm text-slate-300 font-medium">
                {matchResult.won
                  ? `Won by ${wicketsLeft} wicket${wicketsLeft === 1 ? '' : 's'} · ${ballsLeft} ball${ballsLeft === 1 ? '' : 's'} left`
                  : `${runsShort} run${runsShort === 1 ? '' : 's'} short`}
              </div>

              <div className="flex items-baseline justify-between mt-3 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-black text-white">{totalScore}-{totalWickets}</span>
                  <span className="text-xs font-semibold text-slate-400">{oversCompleted} ov</span>
                </div>
                <div className="text-xs font-bold text-slate-400">
                  Target <span className="text-white font-extrabold">{totalTarget}</span>
                </div>
              </div>
            </div>

            {/* r/CricketRush Community Box (Exact Replication of Image 1) */}
            <div className="p-3 rounded-2xl bg-[#11192b] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-sm">
                  🏏
                </div>
                <div>
                  <div className="font-bold text-white text-xs">r/CricketRush</div>
                  <div className="text-[10px] text-slate-400">New chases & leaderboards</div>
                </div>
              </div>
              <button
                onClick={handleShareResult}
                className="px-3.5 py-1 rounded-full bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-xs transition-colors cursor-pointer"
              >
                + Join
              </button>
            </div>

            {/* Action Buttons: Post score (Blue) & Play again (Dark) */}
            <div className="space-y-2">
              <button
                onClick={handleShareResult}
                className="w-full py-3 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-display font-black text-sm tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                {copied ? 'Link Copied!' : 'Post score'}
              </button>
              <button
                onClick={() => { sound.playClick(); onPlayAgain(); }}
                className="w-full py-3 rounded-2xl bg-[#182235] hover:bg-[#22304a] text-white font-display font-black text-sm tracking-wider flex items-center justify-center gap-2 border border-slate-700/80 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Play again
              </button>
            </div>

            {/* Footer Links (Image 1) */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => { sound.playClick(); onOpenPractice?.(); }}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                © Practise what got you out
              </button>
              <button
                onClick={() => { sound.playClick(); onBackToMenu(); }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Back
              </button>
              <span className="text-slate-500 hover:text-slate-300 cursor-pointer">Report</span>
            </div>
          </div>

          {/* ================================================================ */}
          {/* RIGHT COLUMN: Batting, Bowling & Over-By-Over (Image 1)          */}
          {/* ================================================================ */}
          <div className="lg:col-span-7 flex flex-col space-y-3.5">
            {/* BATTING TABLE */}
            <div className="bg-[#0b1322] rounded-2xl p-3 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-800/80">
                <span>BATTING</span>
                <div className="flex items-center gap-4 text-right pr-2">
                  <span className="w-6">R</span>
                  <span className="w-6">B</span>
                  <span className="w-6">4s</span>
                  <span className="w-6">6s</span>
                </div>
              </div>

              <div className="space-y-1.5 mt-2 max-h-48 overflow-y-auto">
                {battingLineup.map((b, idx) => {
                  const runs = b.r ?? b.runs ?? 0;
                  const balls = b.b ?? b.balls ?? 0;
                  const fours = b.fours ?? 0;
                  const sixes = b.sixes ?? 0;
                  const isNotOut = b.notOut ?? (b.dismissal === '*' || !b.dismissal);
                  const dismissalDisplay = isNotOut ? '' : (b.dismissal && b.dismissal !== '*' ? b.dismissal : '');

                  return (
                    <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`font-bold truncate ${isNotOut ? 'text-[#facc15]' : 'text-white'}`}>
                          {b.name}{isNotOut ? '*' : ''}
                        </span>
                        {b.hand && <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 font-mono font-bold">{b.hand}</span>}
                        {dismissalDisplay && (
                          <span className="text-[11px] text-slate-400 truncate">{dismissalDisplay}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-right pr-2 flex-shrink-0 font-mono font-bold">
                        <span className={`w-6 ${isNotOut ? 'text-[#facc15] font-black' : 'text-white'}`}>{runs}</span>
                        <span className="w-6 text-slate-400">{balls}</span>
                        <span className="w-6 text-slate-400">{fours}</span>
                        <span className="w-6 text-slate-400">{sixes}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOWLING TABLE */}
            <div className="bg-[#0b1322] rounded-2xl p-3 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-800/80">
                <span>BOWLING</span>
                <div className="flex items-center gap-4 text-right pr-2">
                  <span className="w-6">O</span>
                  <span className="w-6">R</span>
                  <span className="w-6">W</span>
                  <span className="w-8">ECO</span>
                </div>
              </div>

              <div className="space-y-1.5 mt-2">
                {bowlersData.map((bow, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                    <span className="font-bold text-white truncate">{bow.name}</span>
                    <div className="flex items-center gap-4 text-right pr-2 flex-shrink-0 font-mono font-bold">
                      <span className="w-6 text-slate-300">{bow.o ?? bow.overs ?? '0.0'}</span>
                      <span className="w-6 text-white">{bow.r ?? bow.runsConceded ?? 0}</span>
                      <span className="w-6 text-red-400 font-black">{bow.w ?? bow.wickets ?? 0}</span>
                      <span className="w-8 text-slate-400">{bow.eco ?? '0.0'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OVER BY OVER */}
            <div className="bg-[#0b1322] rounded-2xl p-3 border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                OVER BY OVER
              </div>

              <div className="space-y-2">
                {oversData.map((over, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-400 w-6">{over.overNum}</span>
                    <div className="flex items-center gap-1.5 flex-1 px-3">
                      {over.balls.map((bVal, bIdx) => {
                        const isSix = bVal === '6';
                        const isFour = bVal === '4';
                        const isWicket = bVal === 'W';
                        const isWide = bVal === 'wd';
                        return (
                          <div
                            key={bIdx}
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-display font-black text-[10px] text-white shadow-sm ${
                              isSix
                                ? 'bg-[#9333ea]'
                                : isFour
                                ? 'bg-[#16a34a]'
                                : isWicket
                                ? 'bg-[#ef4444]'
                                : isWide
                                ? 'bg-[#d97706]'
                                : 'bg-[#1e293b] text-slate-300'
                            }`}
                          >
                            {bVal}
                          </div>
                        );
                      })}
                    </div>
                    <span className="font-display font-black text-white text-xs w-6 text-right">{over.runs}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
