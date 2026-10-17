import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../game/SoundEffects';
import { ArrowLeft, Play, Flame, Search, PlusCircle, Trophy, Zap, AlertCircle } from 'lucide-react';

export default function ChallengeList({ onBack, onPlayChallenge, onCreateNew }) {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'fast', 'spin', 'swing'

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setIsLoading(true);
    try {
      const data = await api.getChallenges();
      setChallenges(data);
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectCodeSubmit = async (e) => {
    e.preventDefault();
    if (!codeInput.trim()) return;

    setCodeError('');
    sound.playClick();
    const cleanCode = codeInput.trim().toUpperCase();

    try {
      const challenge = await api.getChallengeByCode(cleanCode);
      if (challenge) {
        onPlayChallenge(challenge);
      } else {
        setCodeError(`Challenge code "${cleanCode}" not found.`);
      }
    } catch {
      setCodeError('Error retrieving challenge.');
    }
  };

  const filteredChallenges = challenges.filter(c => {
    if (activeTab === 'all') return true;
    if (activeTab === 'daily') return [6, 10, 12, 16, 18, 20, 22, 24, 30, 40, 60].includes(Number(c.ballsAllowed));
    if (activeTab === 'fast') return c.bowlerType === 'fast' || c.bowlerType === 'fastmedium';
    if (activeTab === 'spin') return c.bowlerType === 'spin' || c.bowlerType === 'legspin' || c.bowlerType === 'offspin';
    if (activeTab === 'swing') return c.bowlerType === 'swing' || c.bowlerType === 'mediumfast';
    return c.bowlerType === activeTab;
  });

  return (
    <div className="w-full h-full flex flex-col bg-cricket-dark text-slate-100 overflow-y-auto safe-p-top safe-p-bottom px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
          <button
            onClick={() => { sound.playClick(); onBack(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-lg sm:text-2xl font-display font-extrabold tracking-wide text-white text-center">
            CHALLENGE ARENA
          </h1>
          <button
            onClick={() => { sound.playClick(); onCreateNew(); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs sm:text-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create</span>
          </button>
        </div>

        {/* Direct Code Join Input */}
        <form onSubmit={handleDirectCodeSubmit} className="glass-panel rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
          <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Have a Friend's Challenge Code?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. CHASE6, DEATH18, SPIN6..."
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              className="flex-1 px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white font-mono text-xs sm:text-sm tracking-wider uppercase min-w-0"
            />
            <button
              type="submit"
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-xs sm:text-sm tracking-wider flex items-center gap-1.5 transition-transform active:scale-95 flex-shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>PLAY</span>
            </button>
          </div>
          {codeError && (
            <div className="flex items-center gap-1.5 text-xs text-red-400 mt-2 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {codeError}
            </div>
          )}
        </form>

        {/* Bowler & Format Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 text-xs font-bold scrollbar-none">
          {[
            { id: 'all', label: 'All' },
            { id: 'daily', label: '🔥 Daily (10-60B)' },
            { id: 'fast', label: '⚡ Fast Bowling' },
            { id: 'spin', label: '🌀 Spin Attack' },
            { id: 'swing', label: '🌪️ Swing Scenarios' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { sound.playClick(); setActiveTab(tab.id); }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all text-xs font-bold ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Challenges List */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 animate-pulse font-medium">
            Loading challenges from server...
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredChallenges.map(c => (
              <div
                key={c.code}
                className="glass-panel rounded-2xl p-4 hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-emerald-400 font-bold">
                      {c.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      c.difficulty === 'Extreme' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      c.difficulty === 'Hard' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {c.difficulty || 'Medium'}
                    </span>
                    <span className="text-xs text-slate-400">by {c.author}</span>
                  </div>

                  <h3 className="text-lg font-display font-bold text-white mb-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1 mb-2">
                    {c.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="text-emerald-400 font-bold">Target: {c.targetRuns} runs</span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">{c.ballsAllowed} balls</span>
                    <span>•</span>
                    <span className="capitalize">{c.bowlerType} bowling</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onPlayChallenge(c);
                  }}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-display font-black text-sm tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  CHALLENGE
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
