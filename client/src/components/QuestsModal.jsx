import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { storageService } from '../services/storage';
import { sound } from '../game/SoundEffects';
import { ArrowLeft, Target, Coins, Zap, CheckCircle2, Award } from 'lucide-react';

export default function QuestsModal({ onBack, onProfileUpdate }) {
  const [quests, setQuests] = useState([]);
  const [progress, setProgress] = useState(storageService.getQuestProgress());

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    const data = await api.getQuests();
    setQuests(data);
  };

  const handleClaim = (quest) => {
    const success = storageService.claimQuest(quest.id, quest.rewardCoins, quest.rewardXP);
    if (success) {
      sound.playCoin();
      setProgress(storageService.getQuestProgress());
      if (onProfileUpdate) onProfileUpdate(storageService.getProfile());
    }
  };

  const getMetricCount = (type) => {
    if (type === 'sixes') return progress.sixes || 0;
    if (type === 'chases') return progress.chases || 0;
    if (type === 'no_wickets') return progress.no_wickets || 0;
    if (type === 'play_challenge') return progress.play_challenge || 0;
    return 0;
  };

  return (
    <div className="w-full h-full flex flex-col bg-cricket-dark text-slate-100 overflow-y-auto safe-p-top safe-p-bottom px-4 py-6">
      <div className="max-w-xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => { sound.playClick(); onBack(); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-display font-extrabold tracking-wide text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            DAILY QUESTS
          </h1>
          <div className="w-16" />
        </div>

        {/* Quests List */}
        <div className="space-y-4">
          {quests.map(quest => {
            const current = getMetricCount(quest.type);
            const target = quest.target;
            const isCompleted = current >= target;
            const isClaimed = progress.claimed && progress.claimed.includes(quest.id);
            const percentage = Math.min(100, Math.round((current / target) * 100));

            return (
              <div
                key={quest.id}
                className={`glass-panel rounded-2xl p-4 border transition-all ${
                  isClaimed
                    ? 'border-slate-800/50 opacity-70'
                    : isCompleted
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                      {quest.title}
                      {isClaimed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {quest.description}
                    </p>
                  </div>

                  {/* Rewards badge */}
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                      <Coins className="w-3.5 h-3.5" />
                      +{quest.rewardCoins}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold">
                      <Zap className="w-3.5 h-3.5" />
                      +{quest.rewardXP} XP
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold">
                    <span>Progress</span>
                    <span>{current} / {target}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Claim Action */}
                <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
                  {isClaimed ? (
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> CLAIMED
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(quest)}
                      className="py-1.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-xs tracking-wider shadow-md shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95 transition-transform"
                    >
                      <Award className="w-4 h-4" /> CLAIM REWARD
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">In Progress</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
