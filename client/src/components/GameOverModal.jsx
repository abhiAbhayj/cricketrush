import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { storageService } from '../services/storage';
import { sound } from '../game/SoundEffects';
import { haptics } from '../services/haptics';
import { Trophy, RotateCcw, Home, Share2, Coins, Zap, Check, Flame, ChevronRight, Gauge } from 'lucide-react';

export default function GameOverModal({
  matchResult,
  matchConfig,
  onPlayAgain,
  onBackToMenu,
  onOpenPractice,
  profile,
  onProfileUpdate
}) {
  const [rewards, setRewards] = useState({ coinsEarned: 0, xpEarned: 0 });
  const [copied, setCopied] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [campaignUnlockedNext, setCampaignUnlockedNext] = useState(false);

  useEffect(() => {
    // 1. Calculate rewards and update streak & profile
    const resultRewards = storageService.addMatchReward({
      runs: matchResult.runsScored,
      won: matchResult.won,
      sixes: matchResult.sixes,
      fours: matchResult.fours
    });
    setRewards(resultRewards);

    // 2. Unlock next campaign stage if campaign level was won
    if (matchResult.won && matchConfig?.campaignLevelId) {
      const unlockRes = storageService.unlockCampaignLevel(matchConfig.campaignLevelId);
      if (unlockRes.unlockedNext) {
        setCampaignUnlockedNext(true);
      }
      if (onProfileUpdate) onProfileUpdate(unlockRes.profile);
    } else {
      if (onProfileUpdate) onProfileUpdate(resultRewards.profile);
    }

    // 3. Submit to server leaderboard
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
    }).then(() => {
      setScoreSubmitted(true);
    }).catch(() => {});
  }, []);

  const handleShareResult = async () => {
    sound.playClick();
    const shareText = matchResult.won
      ? `🏏 VICTORY! Smashed ${matchResult.runsScored} runs (${matchResult.sixes} sixes) off ${matchResult.ballsFaced} balls in Cricket Rush! Streak: ${profile?.dailyStreak || 2} days. Can you beat my chase?`
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

  // Generate or read Over-by-Over Breakdown (matching Image 2)
  const oversData = matchResult.overByOverHistory || [
    { overNum: 1, balls: ['4', '6', '4', '1', '6', '1'], runs: 22 },
    { overNum: 2, balls: ['4', '1', '2', '4', '4', '4'], runs: 19 },
    { overNum: 3, balls: ['4', '6', 'W', '1', '6', '4'], runs: 21 },
    { overNum: 4, balls: ['4', '6', '2', '4', '2', '6'], runs: 24 }
  ];

  const teamCode = matchConfig?.teamCode || 'HYB';
  const wicketsLeft = Math.max(0, (matchResult.maxWickets || 7) - (matchResult.wicketsLost || 0));
  const ballsLeft = Math.max(0, (matchResult.totalBalls || 30) - (matchResult.ballsFaced || 0));
  const totalScore = (matchConfig?.teamScoreBase || 104) + matchResult.runsScored;
  const totalWickets = (matchConfig?.teamWicketsBase || 3) + matchResult.wicketsLost;
  const oversCompleted = (matchResult.ballsFaced / 6).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-sm sm:max-w-md bg-[#0a101b] rounded-3xl p-4 sm:p-5 text-left border border-emerald-500/50 shadow-2xl animate-bounce-subtle my-auto">
        {/* Top Header Card (Replication of Image 2) */}
        <div className="p-3.5 rounded-2xl bg-[#0f1728] border border-slate-800 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#84cc16] font-display font-black text-xs text-slate-950 uppercase tracking-wider">
              {teamCode}
            </span>
            <span className={`text-2xl font-display font-black tracking-tight ${matchResult.won ? 'text-[#4ade80]' : 'text-red-500'}`}>
              {matchResult.won ? 'WON' : 'LOST'}
            </span>
          </div>

          <div className="text-xs text-slate-300 font-medium">
            {matchResult.won
              ? `by ${wicketsLeft} wickets · ${ballsLeft} ball${ballsLeft === 1 ? '' : 's'} left`
              : `fell short by ${Math.max(1, matchResult.targetRuns - matchResult.runsScored)} runs`}
          </div>

          <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-display font-black text-white">{totalScore}-{totalWickets}</span>
              <span className="text-xs font-semibold text-slate-400">{oversCompleted} ov</span>
            </div>
            <div className="text-xs font-bold text-slate-400">
              Target <span className="text-white font-extrabold">{matchResult.targetRuns}</span>
            </div>
          </div>
        </div>

        {/* Campaign Unlock Banner */}
        {campaignUnlockedNext && (
          <div className="mb-3 p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>CAMPAIGN STAGE COMPLETED! Next Stadium Unlocked!</span>
          </div>
        )}

        {/* Batsman Mini Scorecard (matching Image 2) */}
        <div className="p-3 rounded-2xl bg-[#0b1320] border border-slate-800/80 mb-3 text-xs">
          <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-800">
            <span className="col-span-6">BATSMAN</span>
            <span className="col-span-2 text-right">R</span>
            <span className="col-span-2 text-right">B</span>
            <span className="col-span-2 text-right">SR</span>
          </div>

          <div className="grid grid-cols-12 py-1 text-slate-200 font-medium border-b border-slate-800/50 items-center">
            <span className="col-span-6 font-bold text-white truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
              {profile?.playerName || 'M. Sarkhel'}
            </span>
            <span className="col-span-2 text-right font-extrabold text-white">{matchResult.runsScored}</span>
            <span className="col-span-2 text-right text-slate-400">{matchResult.ballsFaced}</span>
            <span className="col-span-2 text-right text-emerald-400 font-mono text-[11px]">{matchResult.strikeRate}</span>
          </div>

          <div className="grid grid-cols-12 py-1 text-slate-300 items-center text-[11px]">
            <span className="col-span-6 text-slate-400 truncate">R. Fairhurst</span>
            <span className="col-span-2 text-right font-bold text-slate-300">36</span>
            <span className="col-span-2 text-right text-slate-400">10</span>
            <span className="col-span-2 text-right text-slate-400 font-mono text-[11px]">360.0</span>
          </div>
        </div>

        {/* OVER BY OVER Breakdown Table (Exact match of Image 2) */}
        <div className="p-3.5 rounded-2xl bg-[#0b1320] border border-slate-800 mb-3 max-h-52 overflow-y-auto">
          <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">
            OVER BY OVER
          </div>

          <div className="space-y-1.5">
            {oversData.map((over, oIdx) => (
              <div key={oIdx} className="flex items-center justify-between text-xs">
                <span className="w-5 font-mono font-bold text-slate-400 text-[11px]">
                  {over.overNum || oIdx + 1}
                </span>

                {/* Over Balls Array */}
                <div className="flex items-center gap-1 flex-1 px-2 overflow-x-auto">
                  {over.balls.map((bVal, bIdx) => {
                    const isSix = bVal === '6';
                    const isFour = bVal === '4';
                    const isWicket = bVal === 'W';
                    const isWide = bVal === 'wd';

                    return (
                      <div
                        key={bIdx}
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-display font-black text-[10px] text-white flex-shrink-0 shadow-sm ${
                          isSix
                            ? 'bg-[#9333ea] shadow-purple-500/40'
                            : isFour
                            ? 'bg-[#16a34a] shadow-emerald-500/40'
                            : isWicket
                            ? 'bg-[#ef4444] shadow-red-500/40'
                            : isWide
                            ? 'bg-[#b45309] text-[9px]'
                            : 'bg-[#334155]'
                        }`}
                      >
                        {bVal}
                      </div>
                    );
                  })}
                </div>

                {/* Total Over Runs */}
                <span className="font-display font-extrabold text-white text-xs w-6 text-right">
                  {over.runs}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Pill & Rewards (Replication of Image 2) */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Streak pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e293b] border border-slate-700 text-xs font-bold text-white shadow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{profile?.dailyStreak || 2}-day streak</span>
          </div>

          {/* Coins Earned */}
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
              <Coins className="w-3.5 h-3.5" /> +{rewards.coinsEarned}
            </span>
            <span className="flex items-center gap-1 font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">
              <Zap className="w-3.5 h-3.5" /> +{rewards.xpEarned}
            </span>
          </div>
        </div>

        {/* Community Card (Matching Image 2) */}
        <div className="p-2.5 rounded-2xl bg-[#0f1728] border border-slate-800 flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-sm">
              🏏
            </div>
            <div>
              <div className="font-bold text-white">Cricket Rush</div>
              <div className="text-[10px] text-slate-400">New chases & leaderboards</div>
            </div>
          </div>
          <button
            onClick={handleShareResult}
            className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
          >
            + Join
          </button>
        </div>

        {/* Action Buttons (Matching Image 2) */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {/* Post/Share Score Button (Neon Green) */}
          <button
            onClick={handleShareResult}
            className="py-3 px-4 rounded-2xl bg-[#84cc16] hover:bg-[#a3e635] text-slate-950 font-display font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-lime-500/25 active:scale-95 transition-transform"
          >
            <Share2 className="w-4 h-4" />
            {copied ? 'Copied Link!' : 'Post score'}
          </button>

          {/* Play Again Button */}
          <button
            onClick={() => { sound.playClick(); onPlayAgain(); }}
            className="py-3 px-4 rounded-2xl bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-white font-display font-extrabold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <RotateCcw className="w-4 h-4" />
            Play again
          </button>
        </div>

        {/* Bottom Utility Navigation Links */}
        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-400 pt-2 border-t border-slate-800">
          <button
            onClick={() => { sound.playClick(); onOpenPractice?.(); }}
            className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <Gauge className="w-3.5 h-3.5" /> Practice nets
          </button>
          <span>•</span>
          <button
            onClick={() => { sound.playClick(); onBackToMenu(); }}
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <Home className="w-3.5 h-3.5" /> Back
          </button>
        </div>
      </div>
    </div>
  );
}

