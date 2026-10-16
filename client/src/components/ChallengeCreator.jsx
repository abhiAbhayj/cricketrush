import React, { useState } from 'react';
import { api } from '../services/api';
import { sound } from '../game/SoundEffects';
import { haptics } from '../services/haptics';
import { ArrowLeft, Share2, Copy, Check, Play, Sparkles, Flame, Shield, Trophy } from 'lucide-react';

export default function ChallengeCreator({ onBack, onPlayChallenge, profile }) {
  const [title, setTitle] = useState('');
  const [targetRuns, setTargetRuns] = useState(24);
  const [ballsAllowed, setBallsAllowed] = useState(6);
  const [wicketsAllowed, setWicketsAllowed] = useState(2);
  const [bowlerType, setBowlerType] = useState('fast');
  const [bowlingArm, setBowlingArm] = useState('right');
  const [bowlingAngle, setBowlingAngle] = useState('over');
  const [difficulty, setDifficulty] = useState('Hard');
  const [description, setDescription] = useState('');
  const [customCode, setCustomCode] = useState('');

  const [createdChallenge, setCreatedChallenge] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    sound.playClick();
    haptics.medium();

    try {
      const challenge = await api.createChallenge({
        title: title.trim(),
        author: profile?.playerName || 'Guest Striker',
        targetRuns: Number(targetRuns),
        ballsAllowed: Number(ballsAllowed),
        wicketsAllowed: Number(wicketsAllowed),
        bowlerType,
        bowlingArm,
        bowlingAngle,
        difficulty,
        description: description.trim() || `Score ${targetRuns} off ${ballsAllowed} balls to conquer this challenge!`,
        customCode: customCode.trim() || undefined
      });

      setCreatedChallenge(challenge);
      sound.playCrowdCheer();
    } catch (err) {
      console.error('Failed to create challenge:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getShareUrl = (code) => {
    const origin = window.location.origin;
    return `${origin}/#challenge=${code}`;
  };

  const handleCopyLink = () => {
    if (!createdChallenge) return;
    const url = getShareUrl(createdChallenge.code);
    navigator.clipboard.writeText(url);
    setCopied(true);
    sound.playCoin();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (!createdChallenge) return;
    const url = getShareUrl(createdChallenge.code);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cricket Rush Challenge: ${createdChallenge.title}`,
          text: `Can you chase ${createdChallenge.targetRuns} runs in ${createdChallenge.ballsAllowed} balls? Enter code ${createdChallenge.code} on Cricket Rush!`,
          url
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
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
          <h1 className="text-2xl font-display font-extrabold tracking-wide text-white">
            CHALLENGE CREATOR
          </h1>
          <div className="w-16" />
        </div>

        {/* Modal: Challenge Created Success */}
        {createdChallenge ? (
          <div className="glass-panel-glow rounded-3xl p-6 text-center animate-bounce-subtle">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4 text-emerald-400">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-display font-extrabold text-white mb-1">
              CHALLENGE PUBLISHED!
            </h2>
            <p className="text-sm text-slate-300 mb-6">
              Your custom scenario is ready for web and Android players worldwide.
            </p>

            {/* Unique Code Pill */}
            <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 mb-6">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Challenge Code
              </span>
              <span className="text-3xl font-mono font-extrabold tracking-widest text-emerald-400">
                {createdChallenge.code}
              </span>
            </div>

            {/* Target Spec Summary */}
            <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs">
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Target</span>
                <span className="text-lg font-bold text-white">{createdChallenge.targetRuns} Runs</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Overs</span>
                <span className="text-lg font-bold text-white">{createdChallenge.ballsAllowed} Balls</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Bowler</span>
                <span className="text-lg font-bold text-white capitalize">{createdChallenge.bowlerType}</span>
              </div>
            </div>

            {/* Share and Play Buttons */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={handleNativeShare}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share Challenge
                </button>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onPlayChallenge(createdChallenge);
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-lg tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform active:scale-95"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                TEST PLAY NOW
              </button>
            </div>
          </div>
        ) : (
          /* Challenge Creation Form */
          <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Challenge Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Last Over Miracle, Spin Hell"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white text-sm"
              />
            </div>

            {/* Target Runs Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Runs to Chase
                </label>
                <span className="text-lg font-display font-extrabold text-emerald-400">
                  {targetRuns} Runs
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="42"
                step="2"
                value={targetRuns}
                onChange={(e) => setTargetRuns(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Balls Allowed */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Balls Allowed
                </label>
                <span className="text-lg font-display font-extrabold text-amber-400">
                  {ballsAllowed} Balls ({Math.floor(ballsAllowed / 6)}.{ballsAllowed % 6} overs)
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[3, 6, 12, 18].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => { setBallsAllowed(b); sound.playClick(); }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      ballsAllowed === b
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {b} Balls
                  </button>
                ))}
              </div>
            </div>

            {/* Bowler Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Opponent Bowler Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'fast', label: 'Express Fast', desc: '150 km/h yorkers' },
                  { id: 'swing', label: 'Swing Master', desc: 'Deadly late in/out swing' },
                  { id: 'spin', label: 'Mystery Spin', desc: 'Sharp turning googlies' }
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => { setBowlerType(b.id); sound.playClick(); }}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      bowlerType === b.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-display font-bold text-sm text-white">{b.label}</span>
                    <span className="text-[10px] text-slate-400 mt-1">{b.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bowling Hand & Approach Angle */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Bowling Hand
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setBowlingArm('right'); sound.playClick(); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      bowlingArm === 'right'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    ✋ Right-Arm
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBowlingArm('left'); sound.playClick(); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      bowlingArm === 'left'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    🤚 Left-Arm
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Approach Angle
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setBowlingAngle('over'); sound.playClick(); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      bowlingAngle === 'over'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    🔄 Over Wkt
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBowlingAngle('around'); sound.playClick(); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      bowlingAngle === 'around'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    ↪️ Around Wkt
                  </button>
                </div>
              </div>
            </div>

            {/* Wickets Allowed */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Wickets Allowed
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => { setWicketsAllowed(w); sound.playClick(); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        wicketsAllowed === w
                          ? 'bg-red-500/20 border-red-500 text-red-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {w} {w === 1 ? 'Wkt' : 'Wkts'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Custom Code (Optional)
                </label>
                <input
                  type="text"
                  maxLength={8}
                  placeholder="e.g. MIRACLE"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm uppercase"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Description & Flavor
              </label>
              <textarea
                rows={2}
                placeholder="Add special instructions or taunts for challengers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white text-sm"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-display font-extrabold text-lg tracking-wider shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 fill-slate-950" />
              {isSubmitting ? 'GENERATING CHALLENGE...' : 'CREATE & SHARE CHALLENGE'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
