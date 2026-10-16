import React from 'react';
import { STADIUMS } from '../game/Stadiums';
import { sound } from '../game/SoundEffects';
import { ArrowLeft, Play, Lock, CheckCircle2, Trophy, MapPin, Zap } from 'lucide-react';

const CAMPAIGN_LEVELS = [
  {
    id: 1,
    title: 'Melbourne Super Over',
    stadiumKey: 'colosseum',
    targetRuns: 18,
    ballsAllowed: 6,
    wicketsAllowed: 2,
    bowlerType: 'fast',
    rewardCoins: 200,
    desc: 'Kick off your campaign with an intense 1-over Super Over under the Melbourne floodlights.'
  },
  {
    id: 2,
    title: 'Sharjah Death Overs Blast',
    stadiumKey: 'sharjah',
    targetRuns: 34,
    ballsAllowed: 12,
    wicketsAllowed: 2,
    bowlerType: 'legspin',
    rewardCoins: 350,
    desc: '2-over death chase! Read the googlies and launch maximums into the desert night sky.'
  },
  {
    id: 3,
    title: 'Eden Gardens Spin Web',
    stadiumKey: 'eden',
    targetRuns: 44,
    ballsAllowed: 18,
    wicketsAllowed: 3,
    bowlerType: 'offspin',
    rewardCoins: 500,
    desc: 'Need 44 off 18 balls against mystery doosra and carrom balls in front of 80,000 fans.'
  },
  {
    id: 4,
    title: "Lord's Powerplay Masterclass",
    stadiumKey: 'lords',
    targetRuns: 48,
    ballsAllowed: 20,
    wicketsAllowed: 3,
    bowlerType: 'swing',
    rewardCoins: 650,
    desc: '20-ball powerplay! Punish the swinging Dukes ball into the iconic Lord\'s pavilion.'
  },
  {
    id: 5,
    title: 'Grand World Final Climax',
    stadiumKey: 'colosseum',
    targetRuns: 56,
    ballsAllowed: 24,
    wicketsAllowed: 4,
    bowlerType: 'fast',
    rewardCoins: 1200,
    desc: '4 overs, 56 runs to glory! The ultimate championship chase against 150 km/h express pace.'
  }
];

export default function CampaignModal({ onBack, onStartLevel, profile }) {
  const unlockedCampaignLevel = profile?.campaignLevelUnlocked || 1;

  return (
    <div className="w-full h-full flex flex-col bg-cricket-dark text-slate-100 overflow-y-auto safe-p-top safe-p-bottom px-4 py-6">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => { sound.playClick(); onBack(); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-display font-extrabold tracking-wide text-white flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              STADIUM CAMPAIGN TOUR
            </h1>
            <p className="text-xs text-slate-400">Level {unlockedCampaignLevel} of 5 Unlocked</p>
          </div>
          <div className="w-16" />
        </div>

        {/* Level List */}
        <div className="space-y-4">
          {CAMPAIGN_LEVELS.map((lvl) => {
            const isCompleted = unlockedCampaignLevel > lvl.id;
            const isCurrent = unlockedCampaignLevel === lvl.id;
            const isLocked = unlockedCampaignLevel < lvl.id;
            const stadium = STADIUMS[lvl.stadiumKey] || STADIUMS.colosseum;

            return (
              <div
                key={lvl.id}
                className={`glass-panel rounded-3xl p-5 border transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/15'
                    : isCompleted
                    ? 'border-slate-700 hover:border-slate-600 bg-slate-900/60'
                    : 'border-slate-800/60 opacity-55'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-6 h-6 rounded-full font-display font-black text-xs flex items-center justify-center ${
                        isCompleted ? 'bg-emerald-500 text-slate-950' : isCurrent ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {lvl.id}
                      </span>
                      <h3 className="font-display font-extrabold text-lg text-white">
                        {lvl.title}
                      </h3>
                      {isCompleted && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> WON
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          NEXT GOAL
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {stadium.name} ({stadium.location})
                    </div>

                    <p className="text-xs text-slate-300 mb-3">
                      {lvl.desc}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-bold">
                        Chase {lvl.targetRuns} off {lvl.ballsAllowed} balls
                      </span>
                      <span className="capitalize text-amber-400 font-semibold px-2 py-0.5 bg-slate-900 rounded">
                        {lvl.bowlerType} Bowler
                      </span>
                      <span className="text-slate-400">
                        Max {lvl.wicketsAllowed} Wickets
                      </span>
                      <span className="text-amber-400 font-mono text-[11px]">
                        +{lvl.rewardCoins} Coins
                      </span>
                    </div>
                  </div>

                  <div>
                    {!isLocked ? (
                      <button
                        onClick={() => {
                          sound.playClick();
                          onStartLevel({ ...lvl, campaignLevelId: lvl.id });
                        }}
                        className={`w-full sm:w-auto py-3 px-6 rounded-2xl font-display font-black text-sm tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-transform ${
                          isCurrent
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        {isCurrent ? 'START MATCH' : 'REPLAY'}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-500 text-xs font-bold whitespace-nowrap">
                        <Lock className="w-4 h-4 text-slate-500" /> Complete Level {lvl.id - 1} to Unlock
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
