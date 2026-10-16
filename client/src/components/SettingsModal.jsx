import React, { useState } from 'react';
import { storageService } from '../services/storage';
import { sound } from '../game/SoundEffects';
import { ArrowLeft, Volume2, VolumeX, Smartphone, User, HelpCircle, Check } from 'lucide-react';

export default function SettingsModal({ onBack, profile, onProfileUpdate, settings, onSettingsUpdate }) {
  const [playerName, setPlayerName] = useState(profile?.playerName || 'Cricket Fan');
  const [battingHand, setBattingHand] = useState(profile?.battingHand || (profile?.playerName?.toLowerCase().includes('[l]') ? 'left' : 'right'));
  const [soundEnabled, setSoundEnabled] = useState(settings?.soundEnabled ?? true);
  const [hapticsEnabled, setHapticsEnabled] = useState(settings?.hapticsEnabled ?? true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    sound.playClick();

    const updatedProfile = storageService.updateProfile({
      playerName: playerName.trim() || 'Cricket Fan',
      battingHand
    });
    const updatedSettings = { ...settings, soundEnabled, hapticsEnabled };
    storageService.saveSettings(updatedSettings);

    onProfileUpdate(updatedProfile);
    onSettingsUpdate(updatedSettings);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-cricket-dark text-slate-100 overflow-y-auto safe-p-top safe-p-bottom px-4 py-6">
      <div className="max-w-md mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => { sound.playClick(); onBack(); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-display font-extrabold tracking-wide text-white">
            GAME SETTINGS
          </h1>
          <div className="w-16" />
        </div>

        <form onSubmit={handleSave} className="glass-panel rounded-3xl p-6 space-y-5">
          {/* Player Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              Striker Handle / Nickname
            </label>
            <input
              type="text"
              maxLength={18}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Batting Stance / Hand (RHB vs LHB) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <span>🏏</span>
              Batting Stance / Hand
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => { sound.playClick(); setBattingHand('right'); }}
                className={`py-2 px-3 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  battingHand === 'right'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>✋ Right (RHB)</span>
              </button>
              <button
                type="button"
                onClick={() => { sound.playClick(); setBattingHand('left'); }}
                className={`py-2 px-3 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  battingHand === 'left'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🤚 Left (LHB)</span>
              </button>
            </div>
          </div>

          {/* Sound & Haptics Toggles */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
                <div>
                  <h4 className="text-sm font-bold text-white">Sound Effects & Crowd</h4>
                  <p className="text-[11px] text-slate-400">Bat hits, crowd roar, bails rattle</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Mobile Haptic Feedback</h4>
                  <p className="text-[11px] text-slate-400">Vibrations on timing and boundaries</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={hapticsEnabled}
                onChange={(e) => setHapticsEnabled(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* How to Play Guide */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              Batting Timing Tips
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong className="text-white">Tap / Click:</strong> Swing when ball reaches popping crease.</li>
              <li><strong className="text-emerald-400">Perfect:</strong> Within ±38ms produces 4 or 6.</li>
              <li><strong className="text-blue-400">Aim Direction:</strong> Use Off, Straight, or Leg buttons to target gaps.</li>
              <li><strong className="text-amber-400">Spinners:</strong> Watch for late turn after ball bounces on pitch!</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-base tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
          >
            {saved ? <Check className="w-5 h-5" /> : null}
            {saved ? 'SETTINGS SAVED!' : 'SAVE SETTINGS'}
          </button>
        </form>
      </div>
    </div>
  );
}
