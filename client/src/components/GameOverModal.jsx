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

  const teamCode = matchConfig?.teamCode || 'BEB';
  const wicketsLeft = Math.max(0, (matchResult.maxWickets || 10) - (matchResult.wicketsLost || 0));
  const ballsLeft = Math.max(0, (matchResult.totalBalls || 120) - (matchResult.ballsFaced || 0));
  const totalScore = (matchConfig?.teamScoreBase || 167) + (matchResult.runsScored || 0) - (matchConfig?.initialChaseRuns || 0);
  const totalWickets = (matchConfig?.teamWicketsBase || 7) + (matchResult.wicketsLost || 0);
  const oversCompleted = (matchResult.ballsFaced / 6).toFixed(1);

  // Batting lineup matching Image 1
  const battingLineup = [
    { name: 'S. Anchalia', dismissal: 'out', r: 26, b: 33, fours: 0, sixes: 0 },
    { name: 'P. Sanzgiri', hand: 'L', dismissal: 'out', r: 20, b: 20, fours: 0, sixes: 0 },
    { name: 'F. Danby', dismissal: 'out', r: 26, b: 28, fours: 0, sixes: 0 },
    { name: 'T. Nallamby', dismissal: 'out', r: 23, b: 29, fours: 0, sixes: 0 },
    { name: 'S. Kinvara', hand: 'L', dismissal: 'lbw b Sarpotdar', r: 27, b: 30, fours: 0, sixes: 0 },
    { name: 'S. Kadam', hand: 'L', dismissal: 'lbw b Veldkamp', r: 23, b: 28, fours: 0, sixes: 0 },
    { name: 'A. Sonpurkar', dismissal: 'lbw b Sarpotdar', r: 0, b: 1, fours: 0, sixes: 0 },
    { name: 'K. Wintersgill', dismissal: '*', r: 0, b: 0, fours: 0, sixes: 0, notOut: true },
    { name: profile?.playerName ? profile.playerName : 'D. Salunkhe', dismissal: '*', r: matchResult.runsScored || 4, b: matchResult.ballsFaced || 4, fours: matchResult.fours || 1, sixes: matchResult.sixes || 0, notOut: true }
  ];

  // Bowling stats matching Image 1
  const bowlersData = [
    { name: 'N. Sarpotdar', o: 0, r: 2, w: 0, eco: '0.0' },
    { name: 'T. Veldkamp', o: 4, r: 1, w: 4, eco: '4.0' }
  ];

  // Recent overs matching Image 1
  const oversData = matchResult.overByOverHistory?.length
    ? matchResult.overByOverHistory.slice(-2)
    : [
        { overNum: 19, balls: ['•', '•', 'W', 'W'], runs: 0 },
        { overNum: 20, balls: ['•', 'W', '•', '4', '•', '•'], runs: 4 }
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
                  ? `Won by ${wicketsLeft} wickets · ${ballsLeft} ball${ballsLeft === 1 ? '' : 's'} left`
                  : `${Math.max(1, matchResult.targetRuns - matchResult.runsScored)} runs short`}
              </div>

              <div className="flex items-baseline justify-between mt-3 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-black text-white">{totalScore}-{totalWickets}</span>
                  <span className="text-xs font-semibold text-slate-400">{oversCompleted} ov</span>
                </div>
                <div className="text-xs font-bold text-slate-400">
                  Target <span className="text-white font-extrabold">{matchResult.targetRuns}</span>
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
                {battingLineup.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`font-bold truncate ${b.notOut ? 'text-[#facc15]' : 'text-white'}`}>
                        {b.name}{b.notOut ? '*' : ''}
                      </span>
                      {b.hand && <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 font-mono font-bold">{b.hand}</span>}
                      <span className="text-[11px] text-slate-400 truncate">{b.dismissal !== '*' ? b.dismissal : ''}</span>
                    </div>

                    <div className="flex items-center gap-4 text-right pr-2 flex-shrink-0 font-mono font-bold">
                      <span className={`w-6 ${b.notOut ? 'text-[#facc15] font-black' : 'text-white'}`}>{b.r}</span>
                      <span className="w-6 text-slate-400">{b.b}</span>
                      <span className="w-6 text-slate-400">{b.fours}</span>
                      <span className="w-6 text-slate-400">{b.sixes}</span>
                    </div>
                  </div>
                ))}
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
                      <span className="w-6 text-slate-300">{bow.o}</span>
                      <span className="w-6 text-white">{bow.r}</span>
                      <span className="w-6 text-red-400 font-black">{bow.w}</span>
                      <span className="w-8 text-slate-400">{bow.eco}</span>
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
