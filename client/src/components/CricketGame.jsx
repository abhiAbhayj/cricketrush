import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CricketPhysics } from '../game/PhysicsEngine';
import { FielderManager } from '../game/Fielders';
import { CharacterRenderer } from '../game/CharacterRenderer';
import { STADIUMS } from '../game/Stadiums';
import { sound } from '../game/SoundEffects';
import { haptics } from '../services/haptics';
import PauseModal from './PauseModal';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Home,
  Zap,
  Award,
  Trophy,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  Gauge,
  Sparkles,
  MoveLeft,
  MoveRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SHOT_TYPES = [
  { id: 'cover_drive', label: 'Cover Drive', key: 'Q', aim: 'off', icon: '🏏', desc: 'Through extra cover' },
  { id: 'straight_drive', label: 'Straight Loft', key: 'W', aim: 'straight', icon: '🚀', desc: 'Over bowler head' },
  { id: 'pull', label: 'Pull Shot', key: 'E', aim: 'leg', icon: '⚡', desc: 'Over mid-wicket' },
  { id: 'upper_cut', label: 'Upper Cut', key: 'R', aim: 'off', icon: '✨', desc: 'Slices over 3rd man' },
  { id: 'flick', label: 'Flick / On Drive', key: 'F', aim: 'leg', icon: '🪄', desc: 'Through mid-on' },
  { id: 'reverse_sweep', label: 'Rev Sweep', key: 'A', aim: 'off', icon: '🔄', desc: 'Reverse face behind' },
  { id: 'step_out', label: 'Charge Loft', key: 'S', aim: 'straight', icon: '🔥', desc: 'Steps out for massive six' },
  { id: 'scoop', label: 'Scoop Ramp', key: 'D', aim: 'straight', icon: '🎯', desc: 'Ramps over keeper' }
];

export default function CricketGame({
  matchConfig,
  onGameOver,
  onBackToMenu,
  profile,
  settings
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const fieldersRef = useRef(null);
  const animFrameRef = useRef(null);

  // Match State initialized matching authentic situational chase (Image 1 & 2)
  const [teamCode] = useState(matchConfig?.teamCode || 'JAJ');
  const [teamScoreBase] = useState(matchConfig?.teamScoreBase ?? 124);
  const [teamWicketsBase] = useState(matchConfig?.teamWicketsBase ?? 1);
  const [targetRuns] = useState(matchConfig?.targetRuns || 43);
  const [totalBalls] = useState(matchConfig?.ballsAllowed || 18);
  const [maxWickets] = useState(matchConfig?.wicketsAllowed || 5);
  const [bowlerType] = useState(matchConfig?.bowlerType || 'fast');
  const [bowlingArm, setBowlingArm] = useState(matchConfig?.bowlingArm || (matchConfig?.bowlerType?.includes('leftarm') ? 'left' : 'right'));
  const [bowlingAngle, setBowlingAngle] = useState(matchConfig?.bowlingAngle || 'over');
  const [stadiumKey] = useState(matchConfig?.stadiumKey || 'colosseum');

  // Dynamic In-Match Live Scoring
  const [currentRunsScored, setCurrentRunsScored] = useState(0);
  const [currentBallsFaced, setCurrentBallsFaced] = useState(0);
  const [currentWicketsLost, setCurrentWicketsLost] = useState(0);

  // Batsmen and Bowler details (authentic match initialization from 0)
  const [striker, setStriker] = useState({
    name: profile?.playerName || matchConfig?.strikerName || 'R. Bhende',
    runs: 0,
    balls: 0,
    fiftiesClaimed: false,
    centuriesClaimed: false
  });

  const [nonStriker] = useState({
    name: matchConfig?.nonStrikerName || 'S. Ghatpande',
    runs: 15,
    balls: 5
  });

  const [bowler, setBowler] = useState({
    name: matchConfig?.bowlerName || 'E. Kirtland',
    wickets: 0,
    runsConceded: 21,
    overs: '1.0'
  });

  // Current over balls array: starts empty [ ]
  const [currentOverBalls, setCurrentOverBalls] = useState([]);
  const [currentOverRuns, setCurrentOverRuns] = useState(0);
  const [allOversHistory, setAllOversHistory] = useState([]);
  const [consecutiveDots, setConsecutiveDots] = useState(0);
  const [fieldChangeNotice, setFieldChangeNotice] = useState(null);
  const [deliveryVariationNotice, setDeliveryVariationNotice] = useState(null);
  const [batsmanCreasePosition, setBatsmanCreasePosition] = useState('center');
  const [sixesCount, setSixesCount] = useState(0);
  const [foursCount, setFoursCount] = useState(0);

  // Game flow states
  const [gameState, setGameState] = useState('READY');
  const [feedback, setFeedback] = useState(null);
  const [celebrationOverlay, setCelebrationOverlay] = useState(null);
  const [commentary, setCommentary] = useState(`Match On! Chase ${targetRuns} runs off ${totalBalls} balls against ${bowler.name}.`);
  const [commentaryLog, setCommentaryLog] = useState([
    { ball: '0.0', text: `Match On! Target: ${targetRuns} runs from ${totalBalls} balls against ${bowler.name}.` }
  ]);
  const [aimDirection, setAimDirection] = useState('straight');
  const [selectedShot, setSelectedShot] = useState('straight_drive');
  const [lastShotPlayed, setLastShotPlayed] = useState('Straight Loft');
  const [isMuted, setIsMuted] = useState(!settings?.soundEnabled);
  const [hapticsEnabled, setHapticsEnabled] = useState(settings?.hapticsEnabled ?? true);
  const [isPaused, setIsPaused] = useState(false);
  const [isCrowdCheering, setIsCrowdCheering] = useState(false);

  // Batsman Real-Time Timing Meter State
  const [timingMeterProgress, setTimingMeterProgress] = useState(0); // 0 to 1
  const [timingDeltaRecord, setTimingDeltaRecord] = useState(null);

  // Wagon wheel shot tracking for desktop sidebar
  const [wagonWheelShots, setWagonWheelShots] = useState([]);
  const [showPhaseBanner, setShowPhaseBanner] = useState(true);
  const [footworkNotice, setFootworkNotice] = useState(null);
  const pointerStartRef = useRef({ x: 0, y: 0, time: 0 });

  const showFootworkAlert = (text) => {
    setFootworkNotice(text);
    setTimeout(() => {
      setFootworkNotice(prev => (prev === text ? null : prev));
    }, 1400);
  };

  // Auto-hide cinematic match phase intro banner
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPhaseBanner(false);
    }, 3400);
    return () => clearTimeout(timer);
  }, []);

  const stadium = STADIUMS[stadiumKey] || STADIUMS.colosseum;

  // Canvas Resize and Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const parent = containerRef.current;
      if (!parent) return;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      if (!engineRef.current) {
        engineRef.current = new CricketPhysics(width, height);
        fieldersRef.current = new FielderManager(width, height, engineRef.current.boundaryRadius);
      } else {
        engineRef.current.resize(width, height);
        fieldersRef.current.resize(width, height, engineRef.current.boundaryRadius);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Audio state toggle
  useEffect(() => {
    sound.enabled = !isMuted;
  }, [isMuted]);

  // Main 60 FPS Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 16.66, 2.0);
      lastTime = currentTime;

      const engine = engineRef.current;
      const fielders = fieldersRef.current;

      if (engine && fielders && !isPaused) {
        const physicsEvent = engine.update(dt);
        fielders.update(engine.ball);

        // Update Timing Meter while ball is in flight
        if (engine.ball.state === 'BOWLED') {
          setTimingMeterProgress(engine.ball.flightProgress || 0);
        }

        // Check fielder interception
        if (engine.ball.state === 'HIT') {
          const interception = fielders.checkFieldInterception(engine.ball);
          if (interception) {
            if (interception.type === 'CATCH') {
              engine.ball.state = 'DEAD';
              handleBallOutcome({ event: 'CAUGHT', fielder: interception.fielder });
            } else if (interception.type === 'STOP') {
              engine.ball.state = 'DEAD';
              let runs = 1;
              if (engine.ball.traveled > engine.boundaryRadius * 0.62) runs = 2;
              handleBallOutcome({ event: 'RUNS', runs, fielder: interception.fielder });
            }
          }
        }

        if (physicsEvent) {
          handleBallOutcome(physicsEvent);
        }

        // Draw Scene
        drawScene(ctx, engine, fielders, stadium, profile);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPaused, stadium, profile, currentRunsScored, currentBallsFaced, currentWicketsLost, striker, selectedShot]);

  // Handle Ball Outcome & Trigger Celebrations
  const handleBallOutcome = useCallback((outcome) => {
    const engine = engineRef.current;
    if (!engine) return;

    let runsScored = 0;
    let isWicket = false;
    let isWide = false;
    let badgeText = '';
    let badgeType = 'good';
    let commentaryLine = '';

    if (outcome.event === 'WIDE') {
      isWide = true;
      runsScored = 1;
      badgeText = 'WIDE BALL! +1 RUN ↔️';
      badgeType = 'wide';
      commentaryLine = outcome.wideSide === 'leg'
        ? 'Strayed down leg side! Umpire signals WIDE (+1 extra run & re-bowl).'
        : 'Way outside off past the guideline! Umpire signals WIDE (+1 extra run & re-bowl).';
      sound.playClick();
      if (hapticsEnabled) haptics.light();
    } else if (outcome.event === 'SIX') {
      runsScored = 6;
      setSixesCount(prev => prev + 1);
      sound.playBatHit(true);
      sound.playCrowdCheer();
      setIsCrowdCheering(true);
      setTimeout(() => setIsCrowdCheering(false), 3200);
      if (hapticsEnabled) haptics.heavy();
      const dist = outcome.distanceMeters || 104;
      badgeText = `MAXIMUM! 6 RUNS 🚀 (${dist}m)`;
      badgeType = 'perfect';
      commentaryLine = `BOOM! Smashed high and handsome into the stands for a colossal SIX (${dist}m)!`;
      triggerSpecialCelebration('six', 'MAXIMUM SIX!', 'ROCKET INTO THE STANDS', dist);
    } else if (outcome.event === 'FOUR') {
      runsScored = 4;
      setFoursCount(prev => prev + 1);
      sound.playBatHit(true);
      sound.playCrowdCheer();
      setIsCrowdCheering(true);
      setTimeout(() => setIsCrowdCheering(false), 2800);
      if (hapticsEnabled) haptics.heavy();
      badgeText = 'CRACKING FOUR! TO THE ROPE 🔥';
      badgeType = 'perfect';
      commentaryLine = 'Sensational boundary! Bullet stroke rips across the grass turf for FOUR!';
      triggerSpecialCelebration('four', 'CRACKING FOUR!', 'BULLET TO THE ROPE', 68);
    } else if (outcome.event === 'RUNS') {
      runsScored = outcome.runs;
      sound.playCoin();
      if (hapticsEnabled) haptics.medium();
      badgeText = `${runsScored} RUN${runsScored > 1 ? 'S' : ''} 🏃`;
      badgeType = 'good';
      commentaryLine = `Pushed into the gap, swift running between wickets for ${runsScored}!`;
    } else if (outcome.event === 'BOWLED') {
      isWicket = true;
      sound.playWicket();
      if (hapticsEnabled) haptics.wicket();
      badgeText = 'CLEAN BOWLED! 💥';
      badgeType = 'wicket';
      commentaryLine = 'TIMBER! Stumps shattered and bails go flying!';
      triggerSpecialCelebration('bowled', 'CLEAN BOWLED!', 'STUMPS SHATTERED INTO PIECES');
    } else if (outcome.event === 'STUMPED') {
      isWicket = true;
      sound.playStumping();
      if (hapticsEnabled) haptics.wicket();
      badgeText = 'STUMPED OUT! 🧤';
      badgeType = 'wicket';
      commentaryLine = 'BEATEN IN THE AIR! Batsman stranded down the pitch, keeper whips bails in a flash!';
      triggerSpecialCelebration('stumped', 'STUMPED OUT! 🧤', 'STRANDED DOWN THE PITCH - KEEPER WHIPS OFF BAILS');
    } else if (outcome.event === 'LBW') {
      isWicket = true;
      sound.playUmpireAppeal();
      sound.playWicket();
      if (hapticsEnabled) haptics.wicket();
      badgeText = 'LBW! GIVEN OUT! ☝️';
      badgeType = 'wicket';
      commentaryLine = 'HOWZAT! Struck on the pads right in front, umpire raises the finger!';
      triggerSpecialCelebration('lbw', 'LBW! GIVEN OUT ☝️', 'PLUMB IN FRONT OF MIDDLE STUMP');
    } else if (outcome.event === 'CAUGHT') {
      isWicket = true;
      sound.playWicket();
      if (hapticsEnabled) haptics.wicket();
      badgeText = `CAUGHT BY ${outcome.fielder.toUpperCase()}! 🧤`;
      badgeType = 'wicket';
      commentaryLine = `Mistimed in the air and taken cleanly by ${outcome.fielder}!`;
      triggerSpecialCelebration('catch', 'CAUGHT OUT! 🧤', `BRILLIANT CATCH BY ${outcome.fielder.toUpperCase()}`);
    } else if (outcome.event === 'DOT') {
      sound.playKeeperGlove();
      badgeText = 'DOT BALL •';
      badgeType = 'late';
      commentaryLine = 'Beaten outside off! Clean take by the wicket-keeper.';
    }

    setFeedback({ text: badgeText, type: badgeType });
    setCommentary(commentaryLine);

    // Accurate cricket over tracking
    const nextBallsFaced = currentBallsFaced + (isWide ? 0 : 1);
    const completedOvers = Math.floor(nextBallsFaced / 6);
    const ballsInOver = nextBallsFaced % 6;
    const currentOverFloat = `${completedOvers}.${ballsInOver}`;
    setCommentaryLog(prev => [{ ball: currentOverFloat, text: commentaryLine }, ...prev.slice(0, 9)]);

    const nextRunsScored = currentRunsScored + runsScored;
    const nextWicketsLost = currentWicketsLost + (isWicket ? 1 : 0);

    setCurrentRunsScored(nextRunsScored);
    setCurrentBallsFaced(nextBallsFaced);
    setCurrentWicketsLost(nextWicketsLost);

    // Striker milestones (50 and 100) - Only legal batsman runs count!
    if (!isWide) {
      setStriker(prev => {
        const nextStrikerRuns = prev.runs + runsScored;
        const nextStrikerBalls = prev.balls + 1;

        if (nextStrikerRuns >= 50 && !prev.fiftiesClaimed) {
          setTimeout(() => {
            sound.playFiftyFanfare();
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
            triggerSpecialCelebration('fifty', `FIFTY! ${nextStrikerRuns}* (${nextStrikerBalls}b) 🎉`, 'SUPERB HALF-CENTURY MILESTONE!');
          }, 500);
          return { ...prev, runs: nextStrikerRuns, balls: nextStrikerBalls, fiftiesClaimed: true };
        }

        if (nextStrikerRuns >= 100 && !prev.centuriesClaimed) {
          setTimeout(() => {
            sound.playCenturyFanfare();
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 } });
            triggerSpecialCelebration('century', `CENTURY! ${nextStrikerRuns}* (${nextStrikerBalls}b) 👑`, 'MAGNIFICENT CENTURY FOR THE RECORD BOOKS!');
          }, 500);
          return { ...prev, runs: nextStrikerRuns, balls: nextStrikerBalls, centuriesClaimed: true };
        }

        return { ...prev, runs: nextStrikerRuns, balls: nextStrikerBalls };
      });
    }

    // Bowler stats
    setBowler(prev => ({
      ...prev,
      wickets: prev.wickets + (isWicket ? 1 : 0),
      runsConceded: prev.runsConceded + runsScored,
      overs: `${completedOvers}.${ballsInOver}`
    }));

    // Over balls history
    const ballSymbol = isWide ? 'wd' : isWicket ? 'W' : runsScored === 0 ? '•' : `${runsScored}`;
    const nextOverBalls = [...currentOverBalls, ballSymbol];
    const nextOverRuns = currentOverRuns + runsScored;
    const legalBallsInCurrentOver = nextOverBalls.filter(b => b !== 'wd').length;

    if (legalBallsInCurrentOver >= 6) {
      setAllOversHistory(prev => [
        ...prev,
        { overNum: prev.length + 1, balls: nextOverBalls, runs: nextOverRuns }
      ]);
      setCurrentOverBalls([]);
      setCurrentOverRuns(0);
    } else {
      setCurrentOverBalls(nextOverBalls);
      setCurrentOverRuns(nextOverRuns);
    }

    if (runsScored > 0 && !isWide) {
      setWagonWheelShots(prev => [
        { angle: (Math.random() - 0.5) * 1.2, runs: runsScored, type: aimDirection },
        ...prev.slice(0, 15)
      ]);
    }

    // Automatic Match Fielding Adjustment Intelligence
    if (!isWide && fieldersRef.current) {
      if (outcome.event === 'SIX' || outcome.event === 'FOUR') {
        setConsecutiveDots(0);
        if (selectedShot === 'cover_drive' || selectedShot === 'upper_cut' || selectedShot === 'reverse_sweep' || aimDirection === 'off') {
          fieldersRef.current.applyFieldPreset('offside_defensive');
          setFieldChangeNotice('FIELD CHANGE: DEEP EXTRA COVER BACK 🛡️');
          setTimeout(() => setFieldChangeNotice(null), 3000);
        } else if (selectedShot === 'pull' || selectedShot === 'flick' || aimDirection === 'leg') {
          fieldersRef.current.applyFieldPreset('legside_defensive');
          setFieldChangeNotice('FIELD CHANGE: DEEP MID-WICKET TO BOUNDARY 🛡️');
          setTimeout(() => setFieldChangeNotice(null), 3000);
        }
      } else if (isWicket) {
        setConsecutiveDots(0);
        fieldersRef.current.applyFieldPreset('attacking');
        setFieldChangeNotice('FIELD CHANGE: 2 SLIPS BROUGHT IN! ATTACKING FIELD ⚡');
        setTimeout(() => setFieldChangeNotice(null), 3000);
      } else if (outcome.event === 'DOT') {
        setConsecutiveDots(prev => {
          const next = prev + 1;
          if (next >= 2) {
            fieldersRef.current.applyFieldPreset('attacking');
            setFieldChangeNotice('FIELD CHANGE: DOT BALL PRESSURE! RING BROUGHT UP ⚡');
            setTimeout(() => setFieldChangeNotice(null), 3000);
          }
          return next;
        });
      } else {
        setConsecutiveDots(0);
      }
    }

    setGameState('OVER_PAUSE');

    const won = nextRunsScored >= targetRuns;
    const lost = nextWicketsLost >= maxWickets || (nextBallsFaced >= totalBalls && nextRunsScored < targetRuns);

    if (won || lost) {
      setTimeout(() => {
        setGameState('FINISHED');
        if (won) {
          confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
        }

        const finalOversHistory = [...allOversHistory];
        if (nextOverBalls.length > 0 && legalBallsInCurrentOver < 6) {
          finalOversHistory.push({
            overNum: finalOversHistory.length + 1,
            balls: nextOverBalls,
            runs: nextOverRuns
          });
        }

        onGameOver({
          won,
          runsScored: nextRunsScored,
          targetRuns,
          ballsFaced: nextBallsFaced,
          totalBalls,
          wicketsLost: nextWicketsLost,
          maxWickets,
          sixes: sixesCount + (outcome.event === 'SIX' ? 1 : 0),
          fours: foursCount + (outcome.event === 'FOUR' ? 1 : 0),
          strikeRate: ((nextRunsScored / (nextBallsFaced || 1)) * 100).toFixed(1),
          overByOverHistory: finalOversHistory
        });
      }, 1500);
    } else {
      setTimeout(() => {
        triggerNextDelivery();
      }, isWide ? 1400 : 1800);
    }
  }, [currentRunsScored, currentBallsFaced, currentWicketsLost, targetRuns, totalBalls, maxWickets, sixesCount, foursCount, aimDirection, selectedShot, hapticsEnabled, currentOverBalls, currentOverRuns, allOversHistory, onGameOver]);

  const triggerSpecialCelebration = (type, title, subTitle, distanceMeters = null) => {
    setCelebrationOverlay({ type, title, subTitle, distanceMeters });
    setTimeout(() => {
      setCelebrationOverlay(null);
    }, 2400);
  };

  const triggerNextDelivery = () => {
    if (gameState === 'FINISHED' || isPaused) return;
    setFeedback(null);
    setTimingMeterProgress(0);
    setTimingDeltaRecord(null);
    setGameState('BOWLING');
    const engine = engineRef.current;
    if (engine) {
      const deliveryInfo = engine.startDelivery({
        bowlerType,
        bowlingArm,
        bowlingAngle
      }, 1.0);
      sound.playBowlerRelease();
      if (deliveryInfo) {
        setDeliveryVariationNotice(deliveryInfo);
        const armLabel = (deliveryInfo.bowlingArm === 'left' ? 'LA' : 'RA');
        const angleLabel = deliveryInfo.bowlingAngle === 'around' ? 'Around' : 'Over';
        const variationLine = `${bowler.name} (${armLabel} ${angleLabel}) bowls: ${deliveryInfo.label} (${deliveryInfo.speedKmh} km/h, ${deliveryInfo.length.toUpperCase()})`;
        setCommentary(variationLine);
      }
    }
  };

  // Bat Swing Action with Dynamic Shot Detection & Timing Meter
  const handleBatSwing = (touchX = null) => {
    const engine = engineRef.current;
    if (!engine || engine.ball.state !== 'BOWLED' || engine.batsman.isSwinging) return;

    const swingResult = engine.swingBat(touchX);

    if (swingResult) {
      setTimingDeltaRecord(swingResult.timeDeltaMs);
      const shotName = swingResult.shotLabel || 'Stroke';
      setLastShotPlayed(shotName);

      if (swingResult.quality === 'PERFECT') {
        sound.playBatHit(true);
        if (hapticsEnabled) haptics.heavy();
        setFeedback({ text: `PERFECT! ⚡ ${shotName.toUpperCase()} (${Math.abs(swingResult.timeDeltaMs)}ms)`, type: 'perfect' });
      } else if (swingResult.quality === 'GOOD') {
        sound.playBatHit(false);
        if (hapticsEnabled) haptics.medium();
        setFeedback({ text: `GOOD! ✨ ${shotName.toUpperCase()} (${swingResult.timeDeltaMs > 0 ? '+' : ''}${swingResult.timeDeltaMs}ms)`, type: 'good' });
      } else if (swingResult.quality === 'EARLY') {
        sound.playBatHit(false);
        if (hapticsEnabled) haptics.light();
        setFeedback({ text: `EARLY! ⏱️ ${shotName.toUpperCase()} (+${swingResult.timeDeltaMs}ms)`, type: 'early' });
      } else if (swingResult.quality === 'LATE' || swingResult.quality === 'EDGE') {
        sound.playEdgeSnick();
        if (hapticsEnabled) haptics.light();
        setFeedback({ text: `EDGE! ⚠️ ${shotName.toUpperCase()} (${swingResult.timeDeltaMs}ms)`, type: 'late' });
      } else {
        if (hapticsEnabled) haptics.light();
        setFeedback({ text: 'SWING & MISS! 💨', type: 'late' });
      }
    }
  };

  // Restart match handler (resets score cleanly from 0)
  const handleRestartChase = () => {
    setIsPaused(false);
    setShowPhaseBanner(true);
    setCurrentRunsScored(0);
    setCurrentBallsFaced(0);
    setCurrentWicketsLost(0);
    setCurrentOverBalls([]);
    setCurrentOverRuns(0);
    setAllOversHistory([]);
    setSixesCount(0);
    setFoursCount(0);
    setWagonWheelShots([]);
    setConsecutiveDots(0);
    setFieldChangeNotice(null);
    setStriker({ name: profile?.playerName || 'M. Sarkhel', runs: 0, balls: 0, fiftiesClaimed: false, centuriesClaimed: false });
    setBowler(prev => ({ ...prev, wickets: 0, runsConceded: 0, overs: '0.0' }));
    setGameState('READY');
    triggerNextDelivery();
  };

  // Pure Spacebar listener for laptop, Arrow keys for crease footwork, & Escape/P for pause
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleBatSwing(null);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        engineRef.current?.shuffleLeft();
        setBatsmanCreasePosition('left');
        sound.playClick();
        showFootworkAlert('SHUFFLE OFF ⬅️');
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        engineRef.current?.shuffleRight();
        setBatsmanCreasePosition('right');
        sound.playClick();
        showFootworkAlert('SHUFFLE LEG ➡️');
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        engineRef.current?.stepOut();
        setBatsmanCreasePosition('step_out');
        sound.playClick();
        showFootworkAlert('CHARGE DOWN TRACK ⬆️ (+25% POWER)');
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        engineRef.current?.resetCrease();
        setBatsmanCreasePosition('center');
        sound.playClick();
        showFootworkAlert('CREASE STANCE ⬇️');
      } else if (e.code === 'Escape' || e.code === 'KeyP') {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial delivery
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerNextDelivery();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // --------------------------------------------------------------------------
  // Canvas Scene Drawing: Humanoid Cricketers, Outfield & Pitch
  // --------------------------------------------------------------------------
  const drawScene = (ctx, engine, fielders, currentStadium, userProfile) => {
    const { width, height } = engine;
    const cx = engine.cx;

    ctx.save();
    if (engine.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * engine.screenShake * 2;
      const shakeY = (Math.random() - 0.5) * engine.screenShake * 2;
      ctx.translate(shakeX, shakeY);
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Outfield Grass with Vertical Stripes (Exact Match)
    const stripeWidth = Math.max(34, width / 14);
    const numStripes = Math.ceil(width / stripeWidth) + 1;
    for (let i = 0; i < numStripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#2e5b27' : '#35682d';
      ctx.fillRect(i * stripeWidth, 0, stripeWidth, height);
    }

    // 2. Realistic Stadium Crowd Stands & Advertising Boundary with Cheering Spectators & Crowd Catch Reaction
    CharacterRenderer.drawStadiumCrowdStands(ctx, cx, engine.cy, engine.boundaryRadius, width, height, {
      isCheering: isCrowdCheering || celebrationOverlay?.type === 'six' || celebrationOverlay?.type === 'four',
      isRocketSix: celebrationOverlay?.type === 'six' || engine.ball.isRocketSix,
      sixLanding: engine.sixLanding
    });

    // 3. Pitch Strip: Sandy beige turf pitch
    const pw = engine.pitchWidth;
    const pt = engine.pitchTop;
    const pb = engine.pitchBottom;
    const ph = pb - pt;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.fillRect(cx - pw / 2 + 3, pt + 4, pw, ph);

    ctx.fillStyle = '#dfcaa4';
    ctx.fillRect(cx - pw / 2, pt, pw, ph);

    // Subtle pitch turf blocky texture & patches
    ctx.fillStyle = '#d5be96';
    ctx.fillRect(cx - pw / 2 + pw * 0.15, pt + ph * 0.35, pw * 0.45, 18);
    ctx.fillRect(cx - pw / 2 + pw * 0.40, pt + ph * 0.52, pw * 0.40, 22);
    ctx.fillRect(cx - pw / 2 + pw * 0.20, pt + ph * 0.68, pw * 0.50, 16);

    // Crease lines (White)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - pw / 2 + 6, pt + 10, pw - 12, 36);
    ctx.strokeRect(cx - pw / 2 + 6, pb - 46, pw - 12, 36);

    // Official ICC Wide Guidelines (Crisp white lines on batting popping crease)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Off-side wide guideline (24px outside off)
    ctx.moveTo(cx - 24, pb - 46); ctx.lineTo(cx - 24, pb - 10);
    // Leg-side wide guideline (15px down leg)
    ctx.moveTo(cx + 15, pb - 46); ctx.lineTo(cx + 15, pb - 10);
    ctx.stroke();

    // Batsman Crease Footwork Marker (Clear visual indicator of current foot stance)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(engine.batsman.x - 10, engine.batsmanCreaseY + 6, 20, 2.5);

    // 4. Stumps & Bails (White stumps with Red bails)
    ctx.fillStyle = '#ffffff';
    for (let s = -7; s <= 7; s += 7) {
      ctx.fillRect(cx + s - 1.5, engine.bowlerStumpsY - 2, 3, 5);
      if (!engine.stumpsHit) {
        ctx.fillRect(cx + s - 1.5, engine.stumpsY - 2, 3, 5);
      }
    }
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - 8, engine.bowlerStumpsY - 4, 16, 2.5);
    if (!engine.stumpsHit) {
      ctx.fillRect(cx - 8, engine.stumpsY - 4, 16, 2.5);
    } else {
      engine.stumpPieces.forEach(piece => {
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rot);
        ctx.fillStyle = piece.isBail ? '#ef4444' : '#ffffff';
        if (piece.isBail) ctx.fillRect(-piece.length / 2, -1.5, piece.length, 3);
        else ctx.fillRect(-1.5, -piece.length / 2, 3, piece.length);
        ctx.restore();
      });
    }

    // 5. Professional Animated Pitch Cursor / Bounce Landing Reticle
    if (engine.ball.state === 'BOWLED') {
      const bx = engine.ball.bounceSpotX;
      const by = engine.ball.bounceSpotY;
      const isShort = engine.ball.lengthType === 'short' || engine.ball.deliveryType === 'bouncer';
      const isSlot = engine.ball.lengthType === 'slot';
      const isYorker = engine.ball.lengthType === 'yorker' || engine.ball.deliveryType === 'yorker';

      const lengthColor = isShort ? '#ef4444' : isSlot ? '#10b981' : isYorker ? '#a855f7' : '#f59e0b';
      const lengthLabel = isShort ? 'BOUNCER / SHORT' : isSlot ? 'IN THE SLOT' : isYorker ? 'YORKER' : 'GOOD LENGTH';
      const varTitle = (engine.ball.variationLabel || engine.ball.deliveryType || '').toUpperCase();

      const pulse = Math.sin(Date.now() / 130) * 3.5;
      const ringRadius = Math.max(8, 28 * (1 - (engine.ball.flightProgress || 0)));

      ctx.save();
      // Outer Pulsing Reticle Ring
      ctx.beginPath();
      ctx.arc(bx, by, 12 + pulse, 0, Math.PI * 2);
      ctx.strokeStyle = lengthColor;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Inner Convergence Ring (shrinks as ball gets closer to pitch landing spot)
      ctx.beginPath();
      ctx.arc(bx, by, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center Crosshairs (+)
      ctx.strokeStyle = lengthColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx - 7, by); ctx.lineTo(bx + 7, by);
      ctx.moveTo(bx, by - 7); ctx.lineTo(bx, by + 7);
      ctx.stroke();

      // Floating Pitch Zone & Bowler Variation Name Badge
      ctx.font = 'bold 9px "Inter", sans-serif';
      ctx.fillStyle = lengthColor;
      ctx.textAlign = 'center';
      ctx.fillText(`${varTitle} • ${lengthLabel}`, bx, by - 16);
      ctx.restore();
    }

    // 6. Realistic Humanoid Non-Striker (Top Crease Right Side)
    CharacterRenderer.drawNonStriker(ctx, engine.nonStriker.x, engine.nonStriker.y);

    // 7. Realistic Humanoid Bowler (Top Crease with Run-Up & Distinct Bowling Action)
    CharacterRenderer.drawBowler(ctx, engine.bowler.x, engine.bowler.y, {
      runUpProgress: engine.bowler.runUpProgress,
      bowlingArmAngle: engine.bowler.bowlingArmAngle,
      armSide: engine.bowler.armSide,
      actionType: engine.bowler.actionType || 'high_arm',
      faceStyle: engine.bowler.faceStyle || 'headband',
      skinTone: engine.bowler.skinTone || '#c68656'
    });

    // 8. Realistic Humanoid Striker Batsman (Bottom Crease with Helmet, Facial Texture & Living Footwork)
    CharacterRenderer.drawBatsman(ctx, engine.batsman.x, engine.batsman.y, {
      isSwinging: engine.batsman.isSwinging,
      swingProgress: engine.batsman.swingProgress,
      swingType: engine.batsman.swingType,
      shotStyle: engine.batsman.shotStyle || selectedShot,
      isSteppingOut: engine.batsman.isSteppingOut,
      stepOutOffset: engine.batsman.stepOutOffset,
      triggerTap: engine.batsman.triggerTap || 0,
      weightShiftX: engine.batsman.weightShiftX || 0,
      footworkState: batsmanCreasePosition === 'left' ? 'shuffling_left' : batsmanCreasePosition === 'right' ? 'shuffling_right' : batsmanCreasePosition === 'step_out' ? 'stepping_out' : 'stance',
      batSkin: userProfile?.equippedBat,
      jerseyColor: userProfile?.equippedJersey === 'gold' ? '#eab308' : userProfile?.equippedJersey === 'crimson' ? '#dc2626' : userProfile?.equippedJersey === 'emerald' ? '#10b981' : '#2563eb',
      faceStyle: 'beard',
      skinTone: '#d49b70'
    });

    // 8. Realistic Crouched Wicket-Keeper (Behind Stumps with Webbed Gloves & Stumping Action)
    CharacterRenderer.drawWicketKeeper(ctx, engine.keeper.x, engine.keeper.y, {
      isStumping: engine.keeper.isStumping
    });

    // 9. Realistic Humanoid Fielders (with Diving Slides & Throw Tracers)
    fielders.draw(ctx, '#ef4444');

    // 10. Cricket Ball (with 2.5D height, shadow scaling & rotating seam)
    if (engine.ball.inPlay) {
      const b = engine.ball;
      const h = b.height || 0;
      const shadowRadius = Math.max(2.5, b.radius * (1 / (1 + h * 0.045)));
      const shadowAlpha = Math.max(0.10, 0.45 / (1 + h * 0.05));

      // Dynamic ground shadow
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, shadowRadius * 1.3, shadowRadius * 0.65, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
      ctx.fill();

      // Trajectory Flight & Rocket Comet Tail Tracer Line
      if (b.trail && b.trail.length > 2) {
        if (b.state === 'BOWLED') {
          // Virtual-Eye Delivery Flight Tracer (Broadcast Ball Tracking)
          ctx.save();
          for (let i = 1; i < b.trail.length; i++) {
            const p1 = b.trail[i - 1];
            const p2 = b.trail[i];
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // Pre-bounce: neon cyan; Post-bounce: vibrant amber showing seam/spin deviation!
            ctx.strokeStyle = p2.hasBounced ? 'rgba(250, 204, 21, 0.95)' : 'rgba(56, 189, 248, 0.9)';
            ctx.lineWidth = 3.5;
            ctx.shadowColor = p2.hasBounced ? '#eab308' : '#0284c7';
            ctx.shadowBlur = 8;
            ctx.stroke();
          }
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.moveTo(b.trail[0].x, b.trail[0].y);
          for (let i = 1; i < b.trail.length; i++) {
            ctx.lineTo(b.trail[i].x, b.trail[i].y);
          }
          ctx.strokeStyle = b.isRocketSix ? 'rgba(245, 158, 11, 0.95)' : b.state === 'HIT' ? 'rgba(234, 179, 8, 0.75)' : 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = b.isRocketSix ? 4.0 : 2.5;
          ctx.stroke();
        }
      }

      // Scaled airborne cricket ball with rocket altitude
      const visualY = b.y - h;
      const visualRadius = b.radius + (h * (b.isRocketSix ? 0.22 : 0.14));

      // Fiery rocket aura for towering sixes
      if (b.isRocketSix) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, visualY, visualRadius + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.fill();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(b.x, visualY, visualRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Rotating seam line
      const seamAngle = (b.traveled || 0) * 0.12;
      ctx.beginPath();
      ctx.arc(b.x, visualY, visualRadius * 0.75, seamAngle, seamAngle + Math.PI * 0.55);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // 11. Particles (Grass spray, dust & boundary sparks)
    engine.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    ctx.restore();
  };

  const totalTeamScore = teamScoreBase + currentRunsScored;
  const totalTeamWickets = teamWicketsBase + currentWicketsLost;
  const runsRemaining = Math.max(0, targetRuns - currentRunsScored);
  const ballsRemaining = Math.max(0, totalBalls - currentBallsFaced);
  const rrr = ballsRemaining > 0 ? ((runsRemaining / ballsRemaining) * 6).toFixed(2) : '0.00';

  return (
    <div className="w-full h-full flex flex-col lg:flex-row bg-[#080d1a] text-slate-100 overflow-hidden select-none">
      {/* ==================================================================== */}
      {/* DESKTOP / TABLET LEFT SIDEBAR                                        */}
      {/* ==================================================================== */}
      <div className="hidden lg:flex w-80 xl:w-96 flex-col border-r border-slate-800 bg-[#0c1322] p-4 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-blue-600 font-display font-black text-xs text-white uppercase italic">
              {teamCode}
            </span>
            <div>
              <h3 className="font-display font-extrabold text-sm text-white">CHASE MASTER T20</h3>
              <span className="text-[11px] text-slate-400">Super Over Final</span>
            </div>
          </div>
          <button
            onClick={onBackToMenu}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Menu"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Stadium Info Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> {stadium.name}
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">{stadium.location}</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{stadium.description}</p>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Bowler: <strong className="text-white capitalize">{bowlerType}</strong></span>
            <span>Conditions: <strong className="text-amber-400">Floodlights</strong></span>
          </div>
        </div>

        {/* Wagon Wheel Visualizer */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
            <span>STRIKER WAGON WHEEL</span>
            <span className="text-[10px] text-emerald-400">Live Shot Map</span>
          </div>
          <div className="relative w-44 h-44 mx-auto my-2 rounded-full border-2 border-dashed border-emerald-500/40 bg-[#0e192c] flex items-center justify-center overflow-hidden">
            <div className="w-24 h-24 rounded-full border border-slate-700 pointer-events-none" />
            <div className="w-3 h-10 bg-amber-800/40 rounded absolute pointer-events-none" />
            {wagonWheelShots.map((shot, idx) => {
              const length = shot.runs === 6 ? 80 : shot.runs === 4 ? 70 : 45;
              const color = shot.runs === 6 ? '#a855f7' : shot.runs === 4 ? '#10b981' : '#f59e0b';
              return (
                <div
                  key={idx}
                  className="absolute origin-bottom pointer-events-none"
                  style={{
                    height: `${length}px`,
                    width: '2px',
                    backgroundColor: color,
                    bottom: '50%',
                    transform: `rotate(${shot.angle * 80}deg)`
                  }}
                />
              );
            })}
            <div className="w-3 h-3 rounded-full bg-blue-500 z-10" />
          </div>
          <div className="flex items-center justify-around text-[10px] font-bold mt-2">
            <span className="text-purple-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> 6s ({sixesCount})</span>
            <span className="text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> 4s ({foursCount})</span>
            <span className="text-amber-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> 1s/2s</span>
          </div>
        </div>

        {/* Milestone Tracker */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-400" /> Milestone Tracker</span>
            <span className="text-amber-400 font-mono text-sm">{striker.runs}* runs</span>
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Road to Fifty (50)</span>
              <span>{Math.min(50, striker.runs)} / 50</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (striker.runs / 50) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CENTER PITCH PLAYING ARENA                                           */}
      {/* ==================================================================== */}
      <div ref={containerRef} className="relative flex-1 h-full flex flex-col items-center justify-center overflow-hidden bg-black">
        {/* ================================================================== */}
        {/* TOP SCOREBOARD (Exact Replication of Reference Screenshot)          */}
        {/* ================================================================== */}
        <div className="absolute top-2 left-3 right-3 sm:left-6 sm:right-6 max-w-xl mx-auto z-30">
          <div className="bg-[#0b121e] border border-[#1e2a3f] rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md">
            {/* ROW 1: Team Pill, Score, Overs, Target Equation, RRR Pill */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-lg bg-[#0284c7] font-display font-black text-sm italic tracking-wider text-white shadow-sm">
                  {teamCode}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                    {totalTeamScore}-{totalTeamWickets}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-400">
                    {Math.floor(currentBallsFaced / 6)}.{currentBallsFaced % 6} <span className="text-[11px] font-normal">ov</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs sm:text-sm font-bold text-white tracking-tight whitespace-nowrap">
                  Need <span className="text-[#facc15] font-black">{runsRemaining}</span> off <span className="text-white">{ballsRemaining}</span>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-[#facc15] font-display font-black text-xs text-slate-950 tracking-wider whitespace-nowrap shadow-sm">
                  RRR {rrr}
                </div>
              </div>
            </div>

            {/* ROW 2: Striker (Gold Arrow) & Non-Striker details */}
            <div className="mt-2 pt-1.5 border-t border-[#182337] flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="text-[#facc15] font-black text-xs">▸</span>
                <span className="font-bold text-white truncate max-w-[120px] sm:max-w-none">{striker.name}</span>
                <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 font-mono">L</span>
                <span className="font-extrabold text-white">{striker.runs}</span>
                <span className="text-slate-400 text-[11px]">({striker.balls})</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="truncate max-w-[110px] sm:max-w-none text-slate-300">{nonStriker.name}</span>
                <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 font-mono">L</span>
                <span className="font-bold text-slate-200">{nonStriker.runs}</span>
                <span className="text-slate-400 text-[11px]">({nonStriker.balls})</span>
              </div>
            </div>

            {/* ROW 3: Bowler Stats, Delivery Variation Badge & Current Over Circles */}
            <div className="mt-1 flex items-center justify-between text-xs gap-1">
              <div className="flex items-center gap-1.5 text-slate-300 truncate">
                <span className="text-red-500 font-bold text-xs">⦿</span>
                <span className="font-medium text-slate-200 truncate">{bowler.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {bowlingArm === 'left' ? 'LA' : 'RA'} {bowlingAngle === 'around' ? 'Around' : 'Over'}
                </span>
                <span className="font-bold text-white">{bowler.wickets}-{bowler.runsConceded}</span>
                <span className="text-slate-400 text-[11px]">({bowler.overs})</span>
                {deliveryVariationNotice && (
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-[10px] animate-pulse">
                    {deliveryVariationNotice.label} • {deliveryVariationNotice.speedKmh} km/h
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const ballVal = currentOverBalls[idx];
                  if (!ballVal) {
                    return (
                      <div key={idx} className="w-5 h-5 rounded-full border border-[#2a374f] bg-transparent" />
                    );
                  }
                  const isSix = ballVal === '6';
                  const isFour = ballVal === '4';
                  const isWicket = ballVal === 'W';
                  const isWide = ballVal === 'wd';
                  return (
                    <div
                      key={idx}
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-display font-black text-[10px] text-white shadow-sm ${
                        isSix ? 'bg-[#9333ea]' : isFour ? 'bg-[#16a34a]' : isWicket ? 'bg-red-600' : isWide ? 'bg-amber-600' : 'bg-[#1e293b] text-slate-300'
                      }`}
                    >
                      {ballVal}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Delivery Variation Banner */}
            {deliveryVariationNotice && (
              <div className="sm:hidden mt-1 pt-1 border-t border-[#182337] flex items-center justify-between text-[10px] text-amber-300 font-bold">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                  {deliveryVariationNotice.label}
                </span>
                <span className="font-mono text-slate-300">{deliveryVariationNotice.speedKmh} km/h</span>
              </div>
            )}
          </div>
        </div>

        {/* ================================================================== */}
        {/* MATCH PHASE CINEMATIC INTRO BANNER (Exact Replica of Image 2)      */}
        {/* ================================================================== */}
        {showPhaseBanner && (
          <div
            onClick={() => setShowPhaseBanner(false)}
            className="absolute inset-x-0 top-[40%] -translate-y-1/2 z-40 flex flex-col items-center justify-center py-4 sm:py-5 bg-[#09111e]/90 border-y-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.35)] backdrop-blur-sm pointer-events-auto cursor-pointer animate-fade-in"
          >
            <span className="text-[11px] sm:text-xs font-black tracking-[0.35em] uppercase text-cyan-400 mb-1">
              {matchConfig?.roundTitle || 'ROUND 1'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {totalBalls <= 6 ? 'SUPER OVER' : totalBalls <= 18 ? 'DEATH OVERS' : totalBalls <= 24 ? 'POWERPLAY' : 'CHASE MASTER'}
            </h2>
            <span className="text-xs sm:text-sm font-mono font-black tracking-widest uppercase text-white mt-1 drop-shadow">
              NEED {runsRemaining} OFF {ballsRemaining}
            </span>
            <span className="text-[9.5px] text-cyan-300/80 tracking-wider mt-1.5 uppercase font-medium">
              Swipe ↔️ Leg/Off • ⬆️ Charge • Tap anywhere to Swing
            </span>
          </div>
        )}

        {/* ================================================================== */}
        {/* TACTICAL AUTOMATIC FIELD ADJUSTMENT NOTICE                        */}
        {/* ================================================================== */}
        {fieldChangeNotice && (
          <div className="absolute top-28 left-1/2 -translate-x-1/2 z-35 pointer-events-none animate-bounce-subtle">
            <div className="px-4 py-1.5 rounded-xl bg-slate-950/90 border border-amber-400/60 text-amber-300 font-display font-black text-xs sm:text-sm tracking-wider uppercase shadow-2xl backdrop-blur-md flex items-center gap-1.5">
              <span>{fieldChangeNotice}</span>
            </div>
          </div>
        )}

        {/* Footwork Gesture Alert */}
        {footworkNotice && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-35 pointer-events-none animate-fade-in">
            <div className="px-3.5 py-1 rounded-xl bg-slate-950/90 border border-cyan-400 text-cyan-300 font-black text-xs tracking-wider shadow-2xl">
              {footworkNotice}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MAIN GAME CANVAS (Touch anywhere to Swing, Swipe for Footwork)    */}
        {/* ================================================================== */}
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            pointerStartRef.current = {
              x: e.clientX,
              y: e.clientY,
              time: performance.now()
            };
          }}
          onPointerUp={(e) => {
            const start = pointerStartRef.current;
            const dx = e.clientX - start.x;
            const dy = e.clientY - start.y;
            const dist = Math.hypot(dx, dy);
            const rect = canvasRef.current?.getBoundingClientRect();
            const touchX = rect ? (e.clientX - rect.left) : null;

            if (dist < 18) {
              // Single Tap -> Bat swing!
              handleBatSwing(touchX);
            } else {
              // Swipe gesture -> Dynamic Crease Footwork!
              if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) {
                  // Swipe Right -> Leg side shuffle
                  engineRef.current?.shuffleRight();
                  setBatsmanCreasePosition('right');
                  sound.playClick();
                  showFootworkAlert('SHUFFLE LEG ➡️');
                } else {
                  // Swipe Left -> Off side shuffle
                  engineRef.current?.shuffleLeft();
                  setBatsmanCreasePosition('left');
                  sound.playClick();
                  showFootworkAlert('SHUFFLE OFF ⬅️');
                }
              } else {
                if (dy < 0) {
                  // Swipe Up -> Step out charge (+25% power)
                  engineRef.current?.stepOut();
                  setBatsmanCreasePosition('step_out');
                  sound.playClick();
                  showFootworkAlert('CHARGE DOWN TRACK ⬆️ (+25% POWER)');
                } else {
                  // Swipe Down -> Reset crease stance
                  engineRef.current?.resetCrease();
                  setBatsmanCreasePosition('center');
                  sound.playClick();
                  showFootworkAlert('CREASE STANCE ⬇️');
                }
              }
            }
          }}
          className="w-full h-full cursor-pointer touch-none"
        />

        {/* ================================================================== */}
        {/* TIMING QUALITY BADGE (Positioned at top so it does not obscure pitch) */}
        {/* ================================================================== */}
        {feedback && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce-subtle">
            <div
              className={`px-5 py-2 rounded-2xl font-display font-black text-sm sm:text-base tracking-wider uppercase border shadow-2xl backdrop-blur-md ${
                feedback.type === 'perfect'
                  ? 'bg-emerald-500/95 text-slate-950 border-emerald-300 shadow-emerald-500/50'
                  : feedback.type === 'good'
                  ? 'bg-blue-500/95 text-white border-blue-300 shadow-blue-500/50'
                  : feedback.type === 'wicket'
                  ? 'bg-red-600/95 text-white border-red-300 shadow-red-600/50'
                  : 'bg-amber-500/95 text-slate-950 border-amber-300'
              }`}
            >
              {feedback.text}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* NON-INTRUSIVE FLOATING CELEBRATION (BORDERLESS - DOES NOT DISTURB MATCH) */}
        {/* ================================================================== */}
        {celebrationOverlay && (
          <div className="absolute top-24 left-0 right-0 z-40 flex flex-col items-center justify-center pointer-events-none animate-bounce-subtle px-4">
            {celebrationOverlay.type === 'six' ? (
              <div className="text-center flex flex-col items-center">
                <div className="text-5xl sm:text-7xl font-display font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-rose-500 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] animate-pulse">
                  🚀 MAXIMUM SIX!
                </div>
                <div className="mt-1 text-xs sm:text-sm font-mono font-black text-amber-300 uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  {celebrationOverlay.distanceMeters || 104}M ROCKET INTO THE STANDS! • NEED {runsRemaining} OFF {ballsRemaining}
                </div>
              </div>
            ) : celebrationOverlay.type === 'four' ? (
              <div className="text-center flex flex-col items-center">
                <div className="text-5xl sm:text-6xl font-display font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] animate-pulse">
                  ⚡ CRACKING FOUR!
                </div>
                <div className="mt-1 text-xs sm:text-sm font-mono font-black text-emerald-300 uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  BULLET BOUNDARY TO THE ROPE! • NEED {runsRemaining} OFF {ballsRemaining}
                </div>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center">
                <div className="text-4xl sm:text-5xl font-display font-black tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-500 to-amber-400 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                  {celebrationOverlay.title}
                </div>
                <div className="mt-1 text-xs font-mono font-bold text-slate-200 tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  {celebrationOverlay.subTitle}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* VISUAL BATSMAN TIMING METER (Shows Dynamic Shot + ms Delta!)       */}
        {/* ================================================================== */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-60 sm:w-68">
          <div className="bg-[#0c1424]/90 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider mb-1">
              <span className="text-amber-400">Early</span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> SWEET SPOT
              </span>
              <span className="text-red-400">Late</span>
            </div>
            {/* Timing Track */}
            <div className="relative w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex">
              {/* Early Zone */}
              <div className="w-[35%] h-full bg-amber-500/30 border-r border-amber-500/40" />
              {/* Perfect Zone */}
              <div className="w-[30%] h-full bg-emerald-500/60 shadow-inner" />
              {/* Late Zone */}
              <div className="w-[35%] h-full bg-red-500/30 border-l border-red-500/40" />
              {/* Sweeping Needle Indicator */}
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-white rounded-full shadow-md shadow-white transition-all duration-75"
                style={{
                  left: `calc(${timingMeterProgress * 100}% - 5px)`
                }}
              />
            </div>
            {/* Shot Name & Digital Readout */}
            <div className="flex justify-between items-center mt-1 text-[10px] font-mono font-bold">
              <span className="text-emerald-300 uppercase">{lastShotPlayed}</span>
              {timingDeltaRecord !== null && (
                <span className={Math.abs(timingDeltaRecord) <= 38 ? 'text-emerald-400' : 'text-amber-400'}>
                  {timingDeltaRecord > 0 ? `+${timingDeltaRecord}ms` : `${timingDeltaRecord}ms`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* BOTTOM-LEFT FLOATING HUD (Pause, Sound & Circular Mini-Radar Map)  */}
        {/* Exact Replica of Reference Screenshot (Image 1)                  */}
        {/* ================================================================== */}
        <div className="absolute bottom-4 left-3 z-30 flex flex-col items-start gap-2 pointer-events-auto">
          {/* Circular Pause Button */}
          <button
            onClick={() => setIsPaused(true)}
            className="w-10 h-10 rounded-full bg-[#0c1424]/90 border border-slate-700/80 hover:bg-slate-800 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
            title="Pause Match"
          >
            <Pause className="w-4 h-4" />
          </button>

          {/* Circular Sound Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full bg-[#0c1424]/90 border border-slate-700/80 hover:bg-slate-800 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Authentic Circular Ground Radar Mini-Map (Image 1) */}
          <div className="w-22 h-26 sm:w-26 sm:h-30 rounded-2xl bg-[#08101c]/95 border border-[#1e2a3f] p-1.5 shadow-2xl relative flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#1b3a1a] border border-emerald-500/50 relative flex items-center justify-center overflow-hidden">
              {/* Inner 30-Yard Circle */}
              <div className="w-[62%] h-[62%] rounded-full border border-emerald-500/30" />
              {/* Center Pitch Turf */}
              <div className="w-2 h-5 bg-[#dfcaa4]/80 rounded-[1px] absolute" />

              {/* 9 Fielders on Radar (Red Dots) */}
              {fieldersRef.current?.fielders.map((f, idx) => {
                const radarRadius = 32;
                const engine = engineRef.current;
                const rx = engine ? ((f.x - engine.cx) / engine.boundaryRadius) * radarRadius : 0;
                const ry = engine ? ((f.y - engine.cy) / engine.boundaryRadius) * radarRadius : 0;
                return (
                  <div
                    key={idx}
                    className="w-1.5 h-1.5 rounded-full bg-red-500 absolute shadow-sm shadow-red-500 pointer-events-none"
                    style={{ transform: `translate(${rx}px, ${ry}px)` }}
                  />
                );
              })}

              {/* Striker Batsman on Radar (Yellow Dot) */}
              <div
                className="w-2 h-2 rounded-full bg-yellow-400 absolute shadow-sm shadow-yellow-400 pointer-events-none"
                style={{
                  transform: `translate(${
                    engineRef.current ? ((engineRef.current.batsman.x - engineRef.current.cx) / engineRef.current.boundaryRadius) * 32 : 0
                  }px, ${
                    engineRef.current ? ((engineRef.current.batsman.y - engineRef.current.cy) / engineRef.current.boundaryRadius) * 32 : 0
                  }px)`
                }}
              />

              {/* Cricket Ball on Radar (White/Yellow Pulsing Dot) */}
              {engineRef.current?.ball.inPlay && (
                <div
                  className="w-1.5 h-1.5 rounded-full bg-white absolute shadow-md shadow-white pointer-events-none animate-ping"
                  style={{
                    transform: `translate(${
                      ((engineRef.current.ball.x - engineRef.current.cx) / engineRef.current.boundaryRadius) * 32
                    }px, ${
                      ((engineRef.current.ball.y - engineRef.current.cy) / engineRef.current.boundaryRadius) * 32
                    }px)`
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* IN-GAME PAUSE MODAL (Resume, Restart, Sound, Haptics, Quit)        */}
        {/* ================================================================== */}
        {isPaused && (
          <PauseModal
            onResume={() => setIsPaused(false)}
            onRestart={handleRestartChase}
            onQuit={onBackToMenu}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(prev => !prev)}
            hapticsEnabled={hapticsEnabled}
            onToggleHaptics={() => setHapticsEnabled(prev => !prev)}
            matchStats={{
              score: `${totalTeamScore}-${totalTeamWickets}`,
              runsNeeded: runsRemaining,
              ballsLeft: ballsRemaining,
              rrr
            }}
          />
        )}
      </div>

      {/* ==================================================================== */}
      {/* DESKTOP / TABLET RIGHT SIDEBAR                                       */}
      {/* ==================================================================== */}
      <div className="hidden lg:flex w-80 xl:w-96 flex-col border-l border-slate-800 bg-[#0c1322] p-4 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-display font-extrabold text-sm text-white flex items-center gap-1.5">
            🎙️ BALL-BY-BALL COMMENTARY
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase">
            Live Feed
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/30 text-xs text-white">
          <span className="font-bold text-emerald-400 block mb-0.5">CURRENT DELIVERY:</span>
          {commentary}
        </div>

        <div className="space-y-2 flex-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Recent Overs</span>
          {commentaryLog.map((log, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
              <span className="font-mono text-[11px] font-bold text-amber-400 mr-2">{log.ball}</span>
              {log.text}
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
          <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Controls Guide</span>
          <div className="flex items-center justify-between text-slate-300">
            <span>Play Shot (Laptop):</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[11px] text-white">Spacebar</kbd>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Play Shot (Mobile/Tablet):</span>
            <span className="text-[11px] text-emerald-400 font-semibold">Touch Screen</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Pause / Menu:</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[11px] text-white">Esc / P</kbd>
          </div>
          <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800 leading-relaxed">
            *Batsman dynamically executes the authentic shot (Cover Drive, Pull, Upper Cut, Straight Loft, Scoop Ramp, Flick) according to incoming line, length, and timing!
          </div>
        </div>
      </div>
    </div>
  );
}
