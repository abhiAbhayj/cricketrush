import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { storageService } from '../services/storage';
import { sound } from '../game/SoundEffects';
import { ArrowLeft, Trophy, Medal, Flame, Globe, User } from 'lucide-react';

export default function LeaderboardModal({ onBack }) {
  const [activeTab, setActiveTab] = useState('global'); // 'global' or 'local'
  const [boardData, setBoardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    if (activeTab === 'global') {
      try {
        const data = await api.getLeaderboard();
        setBoardData(data);
      } catch (err) {
        console.error('Failed to load global leaderboard:', err);
        setBoardData(storageService.getLocalScores());
      }
    } else {
      setBoardData(storageService.getLocalScores());
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-cricket-dark text-slate-100 overflow-y-auto safe-p-top safe-p-bottom px-4 py-6">
      <div className="max-w-2xl mx-auto w-full">
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
            <Trophy className="w-6 h-6 text-amber-400" />
            HALL OF FAME
          </h1>
          <div className="w-16" />
        </div>

        {/* Global vs Local Switch */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800 mb-6">
          <button
            onClick={() => { sound.playClick(); setActiveTab('global'); }}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'global'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            Global Leaders
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('local'); }}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'local'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            My Match History
          </button>
        </div>

        {/* Leaderboard Table / Cards */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 animate-pulse font-medium">
            Loading leaderboard standings...
          </div>
        ) : boardData.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-base font-bold text-white">No entries recorded yet</p>
            <p className="text-xs text-slate-400 mt-1">Play matches and crush targets to claim your spot!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {boardData.map((entry, index) => {
              const isTop1 = index === 0;
              const isTop2 = index === 1;
              const isTop3 = index === 2;

              return (
                <div
                  key={entry.id || index}
                  className={`glass-panel rounded-2xl p-3.5 flex items-center justify-between border transition-all ${
                    isTop1
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : isTop2
                      ? 'border-slate-400/50 bg-slate-400/10'
                      : isTop3
                      ? 'border-amber-700/50 bg-amber-700/10'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Rank & Name */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-extrabold text-sm ${
                        isTop1
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/50'
                          : isTop2
                          ? 'bg-slate-300 text-slate-950'
                          : isTop3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                        {entry.playerName}
                        {isTop1 && <span className="text-xs">👑</span>}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{entry.mode || 'Quick Play'}</span>
                        <span>•</span>
                        <span>{entry.ballsFaced} balls</span>
                        {entry.sixes > 0 && <span>• {entry.sixes}x 🚀</span>}
                      </div>
                    </div>
                  </div>

                  {/* Score & Strike Rate */}
                  <div className="text-right">
                    <div className="text-xl font-display font-black text-emerald-400">
                      {entry.score} <span className="text-xs font-normal text-slate-400">runs</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      SR: <strong className="text-slate-200">{entry.strikeRate}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
