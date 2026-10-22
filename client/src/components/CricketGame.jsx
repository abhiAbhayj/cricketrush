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
  MoveRight,
  Camera,
  Shield,
  Crosshair,
  Target
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

import { GLOBAL_WORLD_BOWLERS, GLOBAL_BATSMEN_LINEUP, getJerseyColor, getJerseyData, TEAMS, isPlayerLeftHanded } from '../game/TeamData';

export const WORLD_BOWLERS = GLOBAL_WORLD_BOWLERS;
export const DEFAULT_BATSMEN_LINEUP = GLOBAL_BATSMEN_LINEUP;

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

  const battingLineup = matchConfig?.battingLineup || DEFAULT_BATSMEN_LINEUP;
  const bowlerList = (matchConfig?.bowlerList && matchConfig.bowlerList.length > 0)
    ? matchConfig.bowlerList
    : (matchConfig?.bowlingTeamCode && TEAMS[matchConfig.bowlingTeamCode]?.bowlers)
      ? TEAMS[matchConfig.bowlingTeamCode].bowlers
      : WORLD_BOWLERS;

  const matchAllowedBalls = matchConfig?.ballsAllowed || 18;
  const [totalBalls] = useState(matchAllowedBalls);
  const [targetRuns] = useState(matchConfig?.targetRuns || 43);
  const [maxWickets] = useState(matchConfig?.wicketsAllowed || 5);
  const [teamCode] = useState(matchConfig?.teamCode || 'BEB');
  const [teamScoreBase] = useState(matchConfig?.teamScoreBase ?? 124);
  const [teamWicketsBase] = useState(matchConfig?.teamWicketsBase ?? 1);
  const isDeathOvers = (totalBalls <= 12);

  const isSpinType = (t) => ['legspin', 'offspin', 'leftarm_chinaman', 'leftarm_orthodox', 'spin', 'wrist_spin', 'finger_spin'].includes(t);

  const initialBowlerIndex = matchConfig?.bowlerName
    ? Math.max(0, bowlerList.findIndex(b => b.name === matchConfig.bowlerName || b.shortName === matchConfig.bowlerName))
    : matchConfig?.bowlerType
      ? Math.max(0, bowlerList.findIndex(b => b.type === matchConfig.bowlerType || (isSpinType(matchConfig.bowlerType) && isSpinType(b.type))))
      : 0;

  const initialBowler = bowlerList[initialBowlerIndex] || bowlerList[0] || WORLD_BOWLERS[0];
  const firstOverTargetBalls = (matchAllowedBalls % 6 === 0) ? 6 : (matchAllowedBalls % 6);

  const [bowlerType, setBowlerType] = useState(initialBowler.type || matchConfig?.bowlerType);
  const [bowlingArm, setBowlingArm] = useState(initialBowler.arm || matchConfig?.bowlingArm);
  const [bowlingAngle, setBowlingAngle] = useState(initialBowler.angle || matchConfig?.bowlingAngle);
  const [bowlerAction, setBowlerAction] = useState(initialBowler.action || matchConfig?.bowlerAction);
  const [stadiumKey] = useState(matchConfig?.stadiumKey || 'colosseum');
  const [isFreeHit, setIsFreeHit] = useState(false);
  const [showMatchIntro, setShowMatchIntro] = useState(true);

  // Tactical Role, Broadcast Camera & Fielding Controls
  const [gameRole, setGameRole] = useState(matchConfig?.gameRole || 'BATTING'); // 'BATTING' or 'BOWLING'
  const [cameraAngle, setCameraAngle] = useState('BOWLER_END'); // 'BOWLER_END', 'BATSMAN_END', 'BROADCAST'
  const [tacticalField, setTacticalField] = useState(isDeathOvers ? 'defending' : 'normal'); // 'normal', 'attacking', 'defending'
  const [userLockedField, setUserLockedField] = useState(false);

  // Manual Bowling Arsenal & Pitch Landing Reticle
  const [selectedBowlerIndex, setSelectedBowlerIndex] = useState(initialBowlerIndex);
  const [manualLength, setManualLength] = useState('good'); // 'yorker', 'slot', 'good', 'short'
  const [manualLine, setManualLine] = useState('stumps'); // 'outside_off', 'stumps', 'leg'
  const [manualVariation, setManualVariation] = useState(
    isSpinType(initialBowler.type) ? 'legbreak' : 'outswing'
  );
  const [pitchTarget, setPitchTarget] = useState(null); // { x, y, length, line }

  // Dynamic In-Match Live Scoring
  const [currentRunsScored, setCurrentRunsScored] = useState(0);
  const [currentBallsFaced, setCurrentBallsFaced] = useState(0);
  const [currentWicketsLost, setCurrentWicketsLost] = useState(0);

  // Accurate situational match balls calculation
  const initialBalls = matchConfig?.initialBalls !== undefined
    ? matchConfig.initialBalls
    : (totalBalls < 120 && teamScoreBase > 0 ? 120 - totalBalls : 0);

  const safeInitialWickets = Math.min(teamWicketsBase, Math.max(0, battingLineup.length - 2));
  const initialStrikerName = matchConfig?.strikerName || battingLineup[safeInitialWickets] || battingLineup[0] || 'Rohit Sharma';
  const initialNonStrikerName = matchConfig?.nonStrikerName || battingLineup[(safeInitialWickets + 1) % battingLineup.length] || battingLineup[1] || 'Virat Kohli';
  const initialNonStrikerRuns = teamWicketsBase > 1 ? 0 : (teamWicketsBase === 1 ? 14 : 0);
  const initialNonStrikerBalls = teamWicketsBase > 1 ? 0 : (teamWicketsBase === 1 ? 6 : 0);

  // Batsmen and Bowler details (authentic match initialization from 0)
  const [striker, setStriker] = useState({
    name: initialStrikerName,
    runs: 0,
    balls: 0,
    fiftiesClaimed: false,
    centuriesClaimed: false
  });

  const [nonStriker, setNonStriker] = useState({
    name: initialNonStrikerName,
    runs: initialNonStrikerRuns,
    balls: initialNonStrikerBalls
  });

  // Intelligent Left-Handed Batsman Detection (Master Roster + Profile + Tag check)
  const isLeftHanded = isPlayerLeftHanded(striker?.name || initialStrikerName) ||
    (striker?.name === profile?.playerName && profile?.battingHand === 'left') ||
    profile?.battingHand === 'left' ||
    (profile?.playerName || '').toLowerCase().includes('[l]') ||
    (profile?.playerName || '').toLowerCase().includes('(l)') ||
    (matchConfig?.strikerName || '').toLowerCase().includes('[l]') ||
    (matchConfig?.strikerName || '').toLowerCase().includes('(l)');

  const [bowler, setBowler] = useState({
    name: matchConfig?.bowlerName || initialBowler.name,
    wickets: 0,
    runsConceded: 0,
    overs: '0.0'
  });

  const strikerRef = useRef(striker);
  strikerRef.current = striker;
  const nonStrikerRef = useRef(nonStriker);
  nonStrikerRef.current = nonStriker;
  const bowlerRef = useRef(bowler);
  bowlerRef.current = bowler;

  // Dynamic Live Batting Scorecard Ref (retains full innings history)
  const battingScorecardRef = useRef(null);
  if (!battingScorecardRef.current) {
    if (teamWicketsBase === 7) {
      battingScorecardRef.current = [
        { name: battingLineup[0] || 'Batter 1', hand: isPlayerLeftHanded(battingLineup[0]) ? 'L' : undefined, r: 26, b: 33, fours: 2, sixes: 0, notOut: false, dismissal: `b ${initialBowler.name}` },
        { name: battingLineup[1] || 'Batter 2', hand: isPlayerLeftHanded(battingLineup[1]) ? 'L' : undefined, r: 20, b: 20, fours: 1, sixes: 1, notOut: false, dismissal: `c Cover b ${(bowlerList[1] || WORLD_BOWLERS[1]).name}` },
        { name: battingLineup[2] || 'Batter 3', hand: isPlayerLeftHanded(battingLineup[2]) ? 'L' : undefined, r: 26, b: 28, fours: 3, sixes: 0, notOut: false, dismissal: `c Long-on b ${(bowlerList[2] || WORLD_BOWLERS[2]).name}` },
        { name: battingLineup[3] || 'Batter 4', hand: isPlayerLeftHanded(battingLineup[3]) ? 'L' : undefined, r: 23, b: 29, fours: 2, sixes: 0, notOut: false, dismissal: `c Keeper b ${(bowlerList[3] || WORLD_BOWLERS[3]).name}` },
        { name: battingLineup[4] || 'Batter 5', hand: isPlayerLeftHanded(battingLineup[4]) ? 'L' : undefined, r: 27, b: 30, fours: 3, sixes: 0, notOut: false, dismissal: `lbw b ${initialBowler.name}` },
        { name: battingLineup[5] || 'Batter 6', hand: isPlayerLeftHanded(battingLineup[5]) ? 'L' : undefined, r: 23, b: 28, fours: 2, sixes: 0, notOut: false, dismissal: `lbw b ${(bowlerList[1] || WORLD_BOWLERS[1]).name}` },
        { name: battingLineup[6] || 'Batter 7', hand: isPlayerLeftHanded(battingLineup[6]) ? 'L' : undefined, r: 0, b: 1, fours: 0, sixes: 0, notOut: false, dismissal: `lbw b ${initialBowler.name}` },
        { name: initialNonStrikerName, hand: isPlayerLeftHanded(initialNonStrikerName) ? 'L' : undefined, r: 0, b: 0, fours: 0, sixes: 0, notOut: true, dismissal: '*' },
        { name: initialStrikerName, hand: isLeftHanded ? 'L' : undefined, r: 0, b: 0, fours: 0, sixes: 0, notOut: true, dismissal: '*' }
      ];
    } else if (teamWicketsBase > 0) {
      const prior = [];
      const runsPerBatter = Math.floor(Math.max(10, teamScoreBase - initialNonStrikerRuns) / teamWicketsBase);
      for (let i = 0; i < teamWicketsBase; i++) {
        const bName = battingLineup[i] || `Batter #${i + 1}`;
        const bHand = isPlayerLeftHanded(bName) ? 'L' : undefined;
        const bBowler = (bowlerList[(i + 1) % bowlerList.length] || WORLD_BOWLERS[(i + 1) % WORLD_BOWLERS.length]).name;
        prior.push({
          name: bName,
          hand: bHand,
          r: runsPerBatter,
          b: Math.max(1, Math.round(runsPerBatter * 0.85)),
          fours: Math.floor(runsPerBatter / 8),
          sixes: Math.floor(runsPerBatter / 15),
          notOut: false,
          dismissal: i % 2 === 0 ? `c Deep Mid-Wicket b ${bBowler}` : `b ${bBowler}`
        });
      }
      prior.push({
        name: initialNonStrikerName,
        hand: isPlayerLeftHanded(initialNonStrikerName) ? 'L' : undefined,
        r: initialNonStrikerRuns,
        b: initialNonStrikerBalls,
        fours: initialNonStrikerRuns >= 4 ? 1 : 0,
        sixes: 0,
        notOut: true,
        dismissal: '*'
      });
      prior.push({
        name: initialStrikerName,
        hand: isLeftHanded ? 'L' : undefined,
        r: 0,
        b: 0,
        fours: 0,
        sixes: 0,
        notOut: true,
        dismissal: '*'
      });
      battingScorecardRef.current = prior;
    } else {
      battingScorecardRef.current = [
        {
          name: initialStrikerName,
          hand: isLeftHanded ? 'L' : undefined,
          r: 0,
          b: 0,
          fours: 0,
          sixes: 0,
          notOut: true,
          dismissal: '*'
        },
        {
          name: initialNonStrikerName,
          hand: initialNonStrikerName.toLowerCase().includes('[l]') ? 'L' : undefined,
          r: 0,
          b: 0,
          fours: 0,
          sixes: 0,
          notOut: true,
          dismissal: '*'
        }
      ];
    }
  }

  // Dynamic Live Bowling Scorecard Ref (tracks all bowlers spells & economy)
  const bowlingScorecardRef = useRef(null);
  if (!bowlingScorecardRef.current) {
    if (teamScoreBase > 0) {
      const priorBowler = bowlerList.find(b => b.name !== initialBowler.name && b.shortName !== initialBowler.name) || bowlerList[1] || WORLD_BOWLERS[1];
      const priorBowlerName = priorBowler.name;
      const priorOvers = Math.min(4, Math.max(1, Math.floor(initialBalls / 18)));
      const priorRuns = Math.round(teamScoreBase * 0.45);
      const priorWickets = Math.min(teamWicketsBase, 2);
      bowlingScorecardRef.current = [
        {
          name: priorBowlerName,
          balls: priorOvers * 6,
          o: `${priorOvers}.0`,
          r: priorRuns,
          w: priorWickets,
          eco: (priorRuns / priorOvers).toFixed(1)
        },
        {
          name: initialBowler.name,
          balls: 0,
          o: '0.0',
          r: 0,
          w: 0,
          eco: '0.0'
        }
      ];
    } else {
      bowlingScorecardRef.current = [
        {
          name: initialBowler.name,
          balls: 0,
          o: '0.0',
          r: 0,
          w: 0,
          eco: '0.0'
        }
      ];
    }
  }

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

  // Dynamic Multi-Angle Broadcast Camera System (Centered pitch view matching Image 2)
  const cameraRef = useRef({
    x: 0,
    y: 0,
    zoom: 1.0,
    targetX: 0,
    targetY: 0,
    targetZoom: 1.0,
    mode: 'PITCH_CENTER'
  });

  // Interactive Running Between Wickets State
  const [runningState, setRunningState] = useState(null);
  const prevRunningRef = useRef({ active: false, runs: 0, isCalling: false, throw: false, isSliding: false });

  const showFootworkAlert = (text) => {
    setFootworkNotice(text);
    setTimeout(() => {
      setFootworkNotice(prev => (prev === text ? null : prev));
    }, 1400);
  };

  // Auto-hide cinematic match phase intro banner & match intro broadcast card
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPhaseBanner(false);
      setShowMatchIntro(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const stadium = STADIUMS[stadiumKey] || STADIUMS.colosseum;

  // Canvas Resize and Setup with ResizeObserver & Dimensions Safeguard
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const parent = containerRef.current;
      if (!parent) return;
      const width = parent.clientWidth || window.innerWidth || 400;
      const height = parent.clientHeight || window.innerHeight || 600;
      if (width <= 0 || height <= 0) return;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      if (!engineRef.current) {
        engineRef.current = new CricketPhysics(width, height);
        engineRef.current.setBatsmanHand(isLeftHanded ? 'left' : 'right');
        fieldersRef.current = new FielderManager(
          width,
          height,
          engineRef.current.boundaryRadius,
          engineRef.current.innerCircleRadiusX,
          engineRef.current.innerCircleRadiusY
        );
        fieldersRef.current.applyFieldPreset(isDeathOvers ? 'death_overs' : 'balanced', true, isLeftHanded);
      } else {
        engineRef.current.resize(width, height);
        engineRef.current.setBatsmanHand(isLeftHanded ? 'left' : 'right');
        fieldersRef.current.resize(
          width,
          height,
          engineRef.current.boundaryRadius,
          engineRef.current.innerCircleRadiusX,
          engineRef.current.innerCircleRadiusY
        );
      }

      // Initialize camera centered on pitch (matching Image 2)
      cameraRef.current.x = width / 2;
      cameraRef.current.y = height * 0.52;
      cameraRef.current.targetX = width / 2;
      cameraRef.current.targetY = height * 0.52;
      cameraRef.current.zoom = 1.0;
      cameraRef.current.targetZoom = 1.0;
    };

    updateSize();

    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => {
        updateSize();
      });
      ro.observe(containerRef.current);
    }

    window.addEventListener('resize', updateSize);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [isLeftHanded]);

  // Synchronize Batsman Batting Hand on Striker Changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setBatsmanHand(isLeftHanded ? 'left' : 'right');
    }
  }, [isLeftHanded, striker?.name]);

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
        try {
          const physicsEvent = engine.update(dt);
          fielders.update(engine.ball, dt, engine);

          // AI Batsman reaction against manual delivery in BOWLING mode
          if (gameRole === 'BOWLING' && engine.ball.state === 'BOWLED' && !engine.batsman.isSwinging) {
            const effectiveBatsmanY = engine.batsmanCreaseY - (engine.batsman.isSteppingOut ? engine.batsman.stepOutOffset : 0);
            const distToBat = effectiveBatsmanY - engine.ball.y;
            const timeDeltaMs = (distToBat / (engine.ball.vy || 10)) * 16.6;

            if (timeDeltaMs <= 42 && timeDeltaMs >= -18) {
              const ballX = engine.ball.x;
              const isYorker = engine.ball.lengthType === 'yorker' || engine.ball.bounceSpotY > engine.batsmanCreaseY - 28;
              const isBouncer = engine.ball.lengthType === 'short' || engine.ball.bounceSpotY < engine.pitchTop + 140;
              const isOutsideOff = Math.abs(ballX - cx) > 22;
              const isSharpMovement = Math.abs(engine.ball.swingRate || 0) > 0.035 || Math.abs(engine.ball.spinLateralV || 0) > 0.22;

              let aiShot = 'straight_drive';
              const roll = Math.random();

              if (isYorker) {
                if (roll < 0.35 && Math.abs(ballX - cx) < 14) {
                  aiShot = null; // Clean bowled or LBW
                } else if (roll < 0.70) {
                  aiShot = 'straight_drive';
                } else {
                  aiShot = 'flick';
                }
              } else if (isBouncer) {
                if (roll < 0.50) {
                  aiShot = 'pull';
                } else if (roll < 0.80) {
                  aiShot = 'upper_cut';
                } else {
                  aiShot = null; // Duck
                }
              } else if (isOutsideOff && isSharpMovement) {
                if (roll < 0.45) {
                  aiShot = 'cover_drive'; // Edge to slips/keeper
                } else if (roll < 0.75) {
                  aiShot = 'upper_cut';
                } else {
                  aiShot = 'cover_drive';
                }
              } else {
                if (ballX < cx - 6) {
                  aiShot = 'cover_drive';
                } else if (ballX > cx + 6) {
                  aiShot = roll < 0.5 ? 'pull' : 'flick';
                } else {
                  aiShot = roll < 0.5 ? 'straight_drive' : 'flick';
                }
              }

              if (aiShot) {
                const swingRes = engine.swingBat(null, aiShot);
                if (swingRes) {
                  sound.playBatHit(swingRes.quality === 'PERFECT');
                }
              }
            }
          }

          // Update Camera Targets based on game action & broadcast angles (Image 2):
          const cam = cameraRef.current;
          const cx = engine.cx;
          const cy = engine.cy;

          if (engine.ball.state === 'BOWLED' || engine.ball.state === 'RUN_UP' || engine.ball.state === 'IDLE' || engine.ball.state === 'READY') {
            if (cameraAngle === 'BOWLER_END') {
              // Angle 1: BOWLER_END - high angle from behind the bowler looking down the pitch towards batsman
              cam.mode = 'BOWLER_END';
              cam.targetX = cx;
              cam.targetY = engine.bowlerCreaseY + 68;
              cam.targetZoom = 1.06;
            } else if (cameraAngle === 'BATSMAN_END') {
              // Angle 2: BATSMAN_END - low angle from behind the batsman looking towards the bowler
              cam.mode = 'BATSMAN_END';
              cam.targetX = cx;
              cam.targetY = engine.batsmanCreaseY - 58;
              cam.targetZoom = 1.06;
            } else {
              // Angle 3: BROADCAST - clean centered pitch view
              cam.mode = 'PITCH_CENTER';
              cam.targetX = cx;
              cam.targetY = cy;
              cam.targetZoom = 0.94;
            }
          } else if (engine.ball.state === 'HIT') {
            if (engine.ball.isRocketSix) {
              // Angle 4: SIX_SKYCAM - broadcast tracking camera for soaring six into crowd stands
              cam.mode = 'SIX_SKYCAM';
              cam.targetX = engine.ball.x * 0.88 + cx * 0.12;
              cam.targetY = engine.ball.y * 0.88 + cy * 0.12;
              cam.targetZoom = 0.74; // Perfectly balanced broadcast framing showing ball landing in crowd stands!
            } else if (engine.running?.active && engine.running?.isCallingRun) {
              // Angle 3: RUNNING_PITCH - wide broadcast view showing BOTH pitch runners AND active outfield chasers!
              cam.mode = 'RUNNING_PITCH';
              cam.targetX = cx * 0.40 + engine.ball.x * 0.60;
              cam.targetY = cy * 0.40 + engine.ball.y * 0.60;
              cam.targetZoom = 0.78;
            } else if (engine.ball.isAerialFour) {
              // Angle 5: AERIAL_FOUR - dynamic tracking camera tracking lofted boundary clearing infield
              cam.mode = 'AERIAL_FOUR';
              cam.targetX = engine.ball.x;
              cam.targetY = engine.ball.y;
              cam.targetZoom = 0.74;
            } else {
              // Angle 2: BALL_CHASE - traveling camera following ball and chasing fielder across 80m ground
              cam.mode = 'BALL_CHASE';
              const chaser = fielders.getPrimaryChaser();
              if (chaser) {
                cam.targetX = engine.ball.x * 0.70 + chaser.x * 0.30;
                cam.targetY = engine.ball.y * 0.70 + chaser.y * 0.30;
              } else {
                cam.targetX = engine.ball.x;
                cam.targetY = engine.ball.y;
              }
              const distFromPitch = Math.hypot(engine.ball.x - cx, engine.ball.y - cy);
              cam.targetZoom = distFromPitch > (engine.innerCircleRadiusX || 260) ? 0.72 : 0.88;
            }
          } else {
            // DEAD / OVER_PAUSE
            if (cameraAngle === 'BOWLER_END') {
              cam.targetX = cx;
              cam.targetY = engine.bowlerCreaseY + 68;
              cam.targetZoom = 1.04;
            } else if (cameraAngle === 'BATSMAN_END') {
              cam.targetX = cx;
              cam.targetY = engine.batsmanCreaseY - 58;
              cam.targetZoom = 1.04;
            } else {
              cam.targetX = cx;
              cam.targetY = cy;
              cam.targetZoom = 0.94;
            }
          }

          // Smooth camera matrix interpolation
          cam.x += (cam.targetX - cam.x) * 0.08 * dt;
          cam.y += (cam.targetY - cam.y) * 0.08 * dt;
          cam.zoom += (cam.targetZoom - cam.zoom) * 0.08 * dt;

          // Guards against NaN, negative, or zero camera matrix values
          if (!Number.isFinite(cam.x)) cam.x = cx || engine.width / 2;
          if (!Number.isFinite(cam.y)) cam.y = cy || engine.height * 0.52;
          if (!Number.isFinite(cam.zoom) || cam.zoom <= 0.1 || cam.zoom > 5.0) cam.zoom = 1.0;
          if (!Number.isFinite(cam.targetZoom) || cam.targetZoom <= 0.1) cam.targetZoom = 1.0;

          // Sync Running State to React (debounced to avoid unnecessary re-renders)
          const r = engine.running;
          if (r && r.active) {
            if (!prevRunningRef.current.active ||
                prevRunningRef.current.runs !== r.runsCompleted ||
                prevRunningRef.current.isCalling !== r.isCallingRun ||
                prevRunningRef.current.throw !== r.throwActive ||
                prevRunningRef.current.isSliding !== r.isSliding) {
              prevRunningRef.current = {
                active: true,
                runs: r.runsCompleted,
                isCalling: r.isCallingRun,
                throw: r.throwActive,
                isSliding: r.isSliding
              };
              setRunningState({
                active: true,
                runsCompleted: r.runsCompleted,
                isCallingRun: r.isCallingRun,
                isHolding: r.isHolding,
                isSliding: r.isSliding,
                throwActive: r.throwActive,
                dangerLevel: r.dangerLevel
              });
            }
          } else if (prevRunningRef.current.active) {
            prevRunningRef.current = { active: false, runs: 0, isCalling: false, throw: false, isSliding: false };
            setRunningState(null);
          }

          // Update Timing Meter while ball is in flight
          if (engine.ball.state === 'BOWLED') {
            setTimingMeterProgress(engine.ball.flightProgress || 0);
          }

          // Check fielder and keeper interception
          if (engine.ball.state === 'HIT') {
            // 1. Check Wicket-Keeper catch for outside edges or top edges behind stumps
            const kd = Math.hypot(engine.ball.x - engine.keeper.x, engine.ball.y - engine.keeper.y);
            if (engine.ball.isAirborne && engine.ball.height < 24 && kd < 36 && (engine.ball.edgeType === 'outside' || engine.ball.edgeType === 'top')) {
              engine.ball.state = 'DEAD';
              engine.running.active = false;
              engine.keeper.isStumping = true; // quick glove catch animation
              setTimeout(() => { if (engineRef.current) engineRef.current.keeper.isStumping = false; }, 800);
              handleBallOutcome({
                event: 'CAUGHT',
                fielder: 'Wicket-Keeper',
                isEdge: true,
                edgeType: engine.ball.edgeType,
                shotStyle: engine.batsman.shotStyle
              });
            } else {
              const interception = fielders.checkFieldInterception(engine.ball, engine);
              if (interception) {
                if (interception.type === 'CATCH') {
                  engine.ball.state = 'DEAD';
                  engine.running.active = false;
                  handleBallOutcome({
                    event: 'CAUGHT',
                    fielder: interception.fielder,
                    isEdge: !!engine.ball.edgeType,
                    edgeType: engine.ball.edgeType,
                    shotStyle: engine.batsman.shotStyle
                  });
                }
                // For 'STOP', fielder throws ball to stumps/keeper; engine.running resolves running/run-outs!
              }
            }
          }

          if (physicsEvent) {
            handleBallOutcome(physicsEvent);
          }

          // Draw Scene
          drawScene(ctx, engine, fielders, stadium, profile);
        } catch (renderError) {
          console.error("Critical error in CricketGame render loop:", renderError);
        }
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
    let isNoBall = false;
    let badgeText = '';
    let badgeType = 'good';
    let commentaryLine = '';

    if (outcome.event === 'NO_BALL') {
      isNoBall = true;
      runsScored = 1;
      badgeText = 'NO BALL! +1 RUN ⚠️ FREE HIT!';
      badgeType = 'wide';
      commentaryLine = outcome.reason === 'PITCHED_OFF_PITCH'
        ? 'NO BALL! Delivery pitched completely outside the pitch strip (+1 extra run, re-bowl & FREE HIT)!'
        : 'NO BALL! Illegal delivery (+1 extra run, re-bowl & FREE HIT)!';
      sound.playClick();
      if (hapticsEnabled) haptics.heavy();
      setIsFreeHit(true);
    } else if (outcome.event === 'WIDE') {
      isWide = true;
      runsScored = 1;
      badgeText = 'WIDE BALL! +1 RUN ↔️';
      badgeType = 'wide';
      commentaryLine = outcome.wideSide === 'leg'
        ? 'Strayed down leg side! Wide ball called (+1 extra run & re-bowl).'
        : 'Way outside off past the guideline! Wide ball called (+1 extra run & re-bowl).';
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

      if (outcome.shotStyle === 'late_cut') {
        badgeText = 'DELICATE LATE CUT! ⚡';
        badgeType = 'perfect';
        commentaryLine = 'EXQUISITE LATE CUT! Opened the face of the bat, steered past slips down to third man for FOUR!';
        triggerSpecialCelebration('late_cut', 'DELICATE LATE CUT! ⚡', 'STEERED PAST SLIPS TO THIRD MAN', 66);
      } else if (outcome.edgeType === 'outside' || outcome.shotStyle === 'outside_edge') {
        badgeText = 'THICK OUTSIDE EDGE! 🔥';
        badgeType = 'good';
        commentaryLine = 'THICK EDGE! Slices past the diving slip cordon, races away to third man for FOUR!';
        triggerSpecialCelebration('four', 'THICK EDGE FOR FOUR! 🔥', 'SLICED PAST SLIPS TO THIRD MAN', 64);
      } else if (outcome.edgeType === 'top' || outcome.shotStyle === 'top_edge') {
        badgeText = 'TOP EDGE FLIES OVER KEEPER! 🚀';
        badgeType = 'good';
        commentaryLine = 'TOP EDGE! Loops high over the wicket-keeper, one bounce into the boundary cushions for FOUR!';
        triggerSpecialCelebration('four_air', 'TOP EDGE OVER KEEPER! 🚀', 'LOOPS HIGH BEHIND STUMPS TO THE ROPE', 70);
      } else if (outcome.edgeType === 'inside' || outcome.shotStyle === 'inside_edge') {
        badgeText = 'INSIDE EDGE TO FINE LEG! ⚡';
        badgeType = 'good';
        commentaryLine = 'INSIDE EDGE! Squirts past the leg stump, races away to fine leg for FOUR!';
        triggerSpecialCelebration('four_gap', 'INSIDE EDGE FOR FOUR! ⚡', 'PAST LEG STUMP TO FINE LEG ROPE', 60);
      } else if (outcome.fourType === 'gap') {
        badgeText = 'BULLET FOUR IN GAP! ⚡';
        badgeType = 'perfect';
        commentaryLine = 'Precision in the gap! Pierces the infield ring and races away across the turf for FOUR!';
        triggerSpecialCelebration('four_gap', 'BULLET FOUR IN GAP! ⚡', 'PIERCED INFIELD WITH SURGICAL PRECISION', 64);
      } else if (outcome.fourType === 'air') {
        badgeText = 'LOFTED FOUR OVER INFIELD! 🚀';
        badgeType = 'perfect';
        commentaryLine = 'Lofted beautifully over the 30-yard ring, one bounce and into the boundary cushions for FOUR!';
        triggerSpecialCelebration('four_air', 'LOFTED FOUR OVER INFIELD! 🚀', 'CLEARED 30-YARD CIRCLE WITH EASE', 72);
      } else {
        badgeText = 'CRACKING FOUR! TO THE ROPE 🔥';
        badgeType = 'perfect';
        commentaryLine = 'Sensational boundary! Bullet stroke rips across the grass turf for FOUR!';
        triggerSpecialCelebration('four', 'CRACKING FOUR!', 'BULLET TO THE ROPE', 68);
      }
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
      if (outcome.edgeType === 'outside' || outcome.shotStyle === 'outside_edge') {
        badgeText = `EDGED & TAKEN! 🧤 BY ${outcome.fielder.toUpperCase()}`;
        badgeType = 'wicket';
        commentaryLine = `EDGED AND TAKEN! Thick outside edge flies into the cordon, sensational catch by ${outcome.fielder}!`;
        triggerSpecialCelebration('catch', 'EDGED & TAKEN! 🧤', `BRILLIANT CATCH BY ${outcome.fielder.toUpperCase()}`);
      } else if (outcome.edgeType === 'top' || outcome.shotStyle === 'top_edge') {
        badgeText = `TOP EDGE CAUGHT! 🧤 BY ${outcome.fielder.toUpperCase()}`;
        badgeType = 'wicket';
        commentaryLine = `TOP EDGE! Sky-high mistimed pull taken cleanly under pressure by ${outcome.fielder}!`;
        triggerSpecialCelebration('catch', 'TOP EDGE CAUGHT! 🧤', `WELL JUDGED CATCH BY ${outcome.fielder.toUpperCase()}`);
      } else {
        badgeText = `CAUGHT BY ${outcome.fielder.toUpperCase()}! 🧤`;
        badgeType = 'wicket';
        commentaryLine = `Mistimed in the air and taken cleanly by ${outcome.fielder}!`;
        triggerSpecialCelebration('catch', 'CAUGHT OUT! 🧤', `BRILLIANT CATCH BY ${outcome.fielder.toUpperCase()}`);
      }
    } else if (outcome.event === 'RUN_OUT') {
      isWicket = true;
      runsScored = outcome.runs || 0;
      sound.playWicket();
      if (hapticsEnabled) haptics.wicket();
      badgeText = 'DIRECT HIT! RUN OUT! 🎯';
      badgeType = 'wicket';
      commentaryLine = `WHAT A THROW! Direct hit at the stumps from ${outcome.fielder || 'deep'} — batsman falls short of the crease!`;
      triggerSpecialCelebration('bowled', 'RUN OUT! 🎯', `DIRECT HIT BY ${outcome.fielder ? outcome.fielder.toUpperCase() : 'FIELDER'}`);
    } else if (outcome.event === 'DOT') {
      sound.playKeeperGlove();
      badgeText = 'DOT BALL •';
      badgeType = 'late';
      commentaryLine = 'Beaten outside off! Clean take by the wicket-keeper.';
    }

    let bigText = null;
    if (outcome.event === 'SIX') bigText = 'SIX';
    else if (outcome.event === 'FOUR') bigText = 'FOUR';
    else if (outcome.event === 'DOT') bigText = 'DOT';
    else if (isWicket) bigText = 'OUT';
    else if (isNoBall) bigText = 'NO BALL';
    else if (isWide) bigText = 'WIDE';

    // Free Hit dismissal immunity (MCC Law: Batsman cannot be dismissed bowled, caught, lbw or stumped on free hit)
    if (isFreeHit && isWicket && outcome.event !== 'RUN_OUT') {
      isWicket = false;
      badgeText = 'FREE HIT! NOT OUT! 🛡️';
      badgeType = 'good';
      bigText = 'NOT OUT';
      commentaryLine = `FREE HIT IMMUNITY! ${outcome.event} on a Free Hit — NOT OUT!`;
    }

    // Reset Free Hit on legal deliveries (Wides and No Balls preserve Free Hit)
    if (!isWide && !isNoBall) {
      setIsFreeHit(false);
    }

    setFeedback({
      text: badgeText,
      type: badgeType,
      bigText,
      shotLabel: lastShotPlayed || 'WORKED TO LEG'
    });
    setCommentary(commentaryLine);

    // Accurate cricket over tracking
    const nextBallsFaced = currentBallsFaced + (isWide || isNoBall ? 0 : 1);
    const completedOvers = Math.floor(nextBallsFaced / 6);
    const ballsInOver = nextBallsFaced % 6;
    const currentOverFloat = `${completedOvers}.${ballsInOver}`;
    setCommentaryLog(prev => [{ ball: currentOverFloat, text: commentaryLine }, ...prev.slice(0, 9)]);

    const nextRunsScored = currentRunsScored + runsScored;
    const nextWicketsLost = currentWicketsLost + (isWicket ? 1 : 0);

    setCurrentRunsScored(nextRunsScored);
    setCurrentBallsFaced(nextBallsFaced);
    setCurrentWicketsLost(nextWicketsLost);

    // 1. Update active striker in dynamic battingScorecardRef
    const currentStrikerName = strikerRef.current?.name || striker.name;
    let activeStrikerEntry = battingScorecardRef.current.find(b => b.name === currentStrikerName);
    if (!activeStrikerEntry) {
      activeStrikerEntry = {
        name: currentStrikerName,
        hand: isLeftHanded ? 'L' : undefined,
        r: 0,
        b: 0,
        fours: 0,
        sixes: 0,
        notOut: true,
        dismissal: '*'
      };
      battingScorecardRef.current.push(activeStrikerEntry);
    }

    if (!isWide && !isNoBall) {
      activeStrikerEntry.b += 1;
      activeStrikerEntry.r += runsScored;
      if (outcome.event === 'FOUR') activeStrikerEntry.fours += 1;
      if (outcome.event === 'SIX') activeStrikerEntry.sixes += 1;
    }

    // 2. Striker milestones (50 and 100) or New Batsman Incoming on Wicket!
    if (!isWide) {
      if (isWicket) {
        const activeBowlerName = bowlerRef.current?.name || bowler.name;
        activeStrikerEntry.notOut = false;
        let dismissalStr = `b ${activeBowlerName}`;
        if (outcome.event === 'CAUGHT') {
          const fName = outcome.fielder || 'Cover';
          dismissalStr = `c ${fName} b ${activeBowlerName}`;
        } else if (outcome.event === 'LBW') {
          dismissalStr = `lbw b ${activeBowlerName}`;
        } else if (outcome.event === 'STUMPED') {
          dismissalStr = `st †Keeper b ${activeBowlerName}`;
        } else if (outcome.event === 'RUN_OUT') {
          const fName = outcome.fielder || 'Direct Hit';
          dismissalStr = `run out (${fName})`;
        } else if (outcome.event === 'BOWLED') {
          dismissalStr = `b ${activeBowlerName}`;
        }
        activeStrikerEntry.dismissal = dismissalStr;

        // Current batsman is out! Rotate to the next batsman from battingLineup
        const nextBatterIndex = teamWicketsBase + nextWicketsLost + 1;
        const nextBatterName = battingLineup[nextBatterIndex] || `Batter #${nextBatterIndex + 1}`;
        const nextBatterHand = isPlayerLeftHanded(nextBatterName) ? 'L' : undefined;

        const newBatterEntry = {
          name: nextBatterName,
          hand: nextBatterHand,
          r: 0,
          b: 0,
          fours: 0,
          sixes: 0,
          notOut: true,
          dismissal: '*'
        };
        battingScorecardRef.current.push(newBatterEntry);

        setTimeout(() => {
          const newStrikerObj = {
            name: nextBatterName,
            runs: 0,
            balls: 0,
            fiftiesClaimed: false,
            centuriesClaimed: false
          };
          strikerRef.current = newStrikerObj;
          setStriker(newStrikerObj);
          setFieldChangeNotice(`NEW BATSMAN IN: ${nextBatterName.toUpperCase()} 🏏`);
          setTimeout(() => setFieldChangeNotice(null), 3200);
        }, 1100);
      } else {
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

          const updated = { ...prev, runs: nextStrikerRuns, balls: nextStrikerBalls };
          strikerRef.current = updated;
          return updated;
        });
      }
    }

    // 3. Dynamic Bowler Stats Tracking in bowlingScorecardRef
    const activeBowlerName = bowlerRef.current?.name || bowler.name;
    let activeBowlerEntry = bowlingScorecardRef.current.find(bw => bw.name === activeBowlerName);
    if (!activeBowlerEntry) {
      activeBowlerEntry = {
        name: activeBowlerName,
        balls: 0,
        o: '0.0',
        r: 0,
        w: 0,
        eco: '0.0'
      };
      bowlingScorecardRef.current.push(activeBowlerEntry);
    }
    if (!isWide && !isNoBall) {
      activeBowlerEntry.balls += 1;
    }
    activeBowlerEntry.r += runsScored;
    if (isWicket && outcome.event !== 'RUN_OUT') {
      activeBowlerEntry.w += 1;
    }
    const bCompOvers = Math.floor(activeBowlerEntry.balls / 6);
    const bBallsInOver = activeBowlerEntry.balls % 6;
    activeBowlerEntry.o = `${bCompOvers}.${bBallsInOver}`;
    activeBowlerEntry.eco = activeBowlerEntry.balls > 0
      ? (activeBowlerEntry.r / (activeBowlerEntry.balls / 6)).toFixed(1)
      : '0.0';

    const bowlerObj = {
      name: activeBowlerEntry.name,
      wickets: activeBowlerEntry.w,
      runsConceded: activeBowlerEntry.r,
      overs: activeBowlerEntry.o
    };
    bowlerRef.current = bowlerObj;
    setBowler(bowlerObj);

    // 4. Over balls history with authentic base over numbering & accurate over bounds
    const ballSymbol = isNoBall ? 'nb' : isWide ? 'wd' : isWicket ? 'W' : runsScored === 0 ? '•' : `${runsScored}`;
    const nextOverBalls = [...currentOverBalls, ballSymbol];
    const nextOverRuns = currentOverRuns + runsScored;
    const legalBallsInCurrentOver = nextOverBalls.filter(b => b !== 'wd' && b !== 'nb').length;
    const baseOver = Math.floor(initialBalls / 6);
    const completedOversCount = allOversHistory.length;
    const targetBallsForThisOver = completedOversCount === 0 ? firstOverTargetBalls : 6;
    const isOverEnd = legalBallsInCurrentOver >= targetBallsForThisOver;

    if (isOverEnd) {
      setAllOversHistory(prev => [
        ...prev,
        { overNum: baseOver + prev.length + 1, balls: nextOverBalls, runs: nextOverRuns }
      ]);
      setCurrentOverBalls([]);
      setCurrentOverRuns(0);

      // Rotate to next bowler if innings continues (alternating Pace and Spin)
      if (nextBallsFaced < totalBalls && nextWicketsLost < maxWickets && nextRunsScored < targetRuns) {
        const nextOverNum = completedOversCount + 1;
        const currentBowlerType = bowlerType || initialBowler.type;
        const isCurrentSpin = isSpinType(currentBowlerType);

        // Filter eligible bowlers from bowlerList (excluding the bowler who just completed their over)
        const currentBowlerName = bowlerRef.current?.name || bowler.name;
        const candidates = bowlerList.filter(b => b.name !== currentBowlerName);
        // Alternate pace and spin: if current over was Pace, pick Spin; if current over was Spin, pick Pace!
        const preferred = candidates.filter(b => {
          const bSpin = isSpinType(b.type);
          return isCurrentSpin ? !bSpin : bSpin;
        });

        const nextB = preferred.length > 0
          ? preferred[Math.floor(Math.random() * preferred.length)]
          : (candidates.length > 0
              ? candidates[Math.floor(Math.random() * candidates.length)]
              : bowlerList[(initialBowlerIndex + nextOverNum) % bowlerList.length]);

        let nextBowlerEntry = bowlingScorecardRef.current?.find(bw => bw.name === nextB.name);
        if (!nextBowlerEntry) {
          nextBowlerEntry = {
            name: nextB.name,
            balls: 0,
            o: '0.0',
            r: 0,
            w: 0,
            eco: '0.0'
          };
          bowlingScorecardRef.current?.push(nextBowlerEntry);
        }

        const nextBowlerObj = {
          name: nextB.name,
          wickets: nextBowlerEntry.w || 0,
          runsConceded: nextBowlerEntry.r || 0,
          overs: nextBowlerEntry.o || '0.0'
        };
        bowlerRef.current = nextBowlerObj;
        setBowler(nextBowlerObj);
        setBowlerType(nextB.type);
        setBowlingArm(nextB.arm || 'right');
        setBowlingAngle(nextB.angle || 'over');
        setBowlerAction(nextB.action || 'high_arm');

        if (engineRef.current) {
          engineRef.current.bowler.skinTone = nextB.skinTone || '#c68656';
          engineRef.current.bowler.faceStyle = nextB.faceStyle || 'classic';
          engineRef.current.bowler.actionType = nextB.action || 'high_arm';
          engineRef.current.bowler.armSide = nextB.arm || 'right';
        }

        const remainingAfterOver = totalBalls - nextBallsFaced;
        const isDeathOver = remainingAfterOver <= 6;
        const spinOrPace = isSpinType(nextB.type) ? 'SPIN' : 'PACE';
        const overNotice = isDeathOver
          ? `END OF OVER ${baseOver + nextOverNum} • FINAL OVER: ${nextB.name.toUpperCase()} TO BOWL DEATH OVER 🎯`
          : `END OF OVER ${baseOver + nextOverNum} • NEW BOWLER: ${nextB.name.toUpperCase()} (${(nextB.arm === 'left' ? 'LA' : 'RA')} ${spinOrPace} - ${nextB.type.toUpperCase()}) INTO ATTACK 🎯`;

        setFieldChangeNotice(overNotice);
        setTimeout(() => setFieldChangeNotice(null), 3500);

        if (fieldersRef.current) {
          if (isDeathOver) {
            fieldersRef.current.applyFieldPreset('death_overs');
          } else {
            fieldersRef.current.applyFieldPreset('balanced');
          }
        }
      }
    } else {
      setCurrentOverBalls(nextOverBalls);
      setCurrentOverRuns(nextOverRuns);
    }

    // 5. Strike rotation on odd runs (1, 3) or at over end (completed over)
    const rotateOnRuns = (runsScored % 2 === 1) && !isWide;
    const shouldRotateStrike = (rotateOnRuns && !isOverEnd) || (!rotateOnRuns && isOverEnd);

    if (!isWicket && shouldRotateStrike) {
      setTimeout(() => {
        const prevS = strikerRef.current;
        const prevNS = nonStrikerRef.current;
        strikerRef.current = prevNS;
        nonStrikerRef.current = prevS;
        setStriker(prevNS);
        setNonStriker(prevS);

        // Check if handedness changed and flip field accordingly
        const prevHandedness = isPlayerLeftHanded(prevS.name);
        const nextHandedness = isPlayerLeftHanded(prevNS.name);
        if (fieldersRef.current && prevHandedness !== nextHandedness) {
          fieldersRef.current.applyFieldPreset(fieldersRef.current.currentPreset || 'death_overs', false, nextHandedness);
          setFieldChangeNotice(`FIELD CHANGE: FIELD FLIPPED FOR ${nextHandedness ? 'LEFT-HANDER (LHB)' : 'RIGHT-HANDER (RHB)'} 🔄`);
          setTimeout(() => setFieldChangeNotice(null), 3000);
        }
      }, 700);
    }

    if (runsScored > 0 && !isWide) {
      setWagonWheelShots(prev => [
        { angle: (Math.random() - 0.5) * 1.2, runs: runsScored, type: aimDirection },
        ...prev.slice(0, 15)
      ]);
    }

    // Dynamic Regular Fielding Placement Updates (Constantly adapting tactics)
    if (!isWide && fieldersRef.current) {
      const currentStrikerLeft = isLeftHanded;
      if (outcome.event === 'SIX' || outcome.event === 'FOUR') {
        setConsecutiveDots(0);
        if (selectedShot === 'cover_drive' || selectedShot === 'upper_cut' || selectedShot === 'reverse_sweep' || aimDirection === 'off') {
          fieldersRef.current.applyFieldPreset('offside_defensive', false, currentStrikerLeft);
          setFieldChangeNotice('FIELD CHANGE: OFF-SIDE BOUNDARY PROTECTED 🛡️');
          setTimeout(() => setFieldChangeNotice(null), 3000);
        } else if (selectedShot === 'pull' || selectedShot === 'flick' || aimDirection === 'leg') {
          fieldersRef.current.applyFieldPreset('legside_defensive', false, currentStrikerLeft);
          setFieldChangeNotice('FIELD CHANGE: DEEP MID-WICKET & SQ LEG ON FENCE 🛡️');
          setTimeout(() => setFieldChangeNotice(null), 3000);
        } else {
          fieldersRef.current.applyFieldPreset('death_overs', false, currentStrikerLeft);
          setFieldChangeNotice('FIELD CHANGE: LONG-OFF & LONG-ON DEEP TO PREVENT BOUNDARY 🛡️');
          setTimeout(() => setFieldChangeNotice(null), 3000);
        }
      } else if (isWicket) {
        setConsecutiveDots(0);
        fieldersRef.current.applyFieldPreset('attacking', false, currentStrikerLeft);
        setFieldChangeNotice('FIELD CHANGE: SLIP BROUGHT IN! ATTACKING FIELD ⚡');
        setTimeout(() => setFieldChangeNotice(null), 3000);
      } else if (outcome.event === 'DOT') {
        setConsecutiveDots(prev => {
          const next = prev + 1;
          if (next >= 2) {
            fieldersRef.current.applyFieldPreset('attacking', false, currentStrikerLeft);
            setFieldChangeNotice('FIELD CHANGE: DOT BALL PRESSURE! RING INFIELDERS CREEPING UP ⚡');
            setTimeout(() => setFieldChangeNotice(null), 3000);
          } else {
            // Subtle shift between balanced and death_overs
            const altPreset = fieldersRef.current.currentPreset === 'death_overs' ? 'balanced' : 'death_overs';
            fieldersRef.current.applyFieldPreset(altPreset, false, currentStrikerLeft);
          }
          return next;
        });
      } else {
        // Singles / Twos: Regular tactical fielder rotation
        setConsecutiveDots(0);
        const regularCycle = ['death_overs', 'balanced', 'offside_defensive', 'legside_defensive'];
        const currentIdx = regularCycle.indexOf(fieldersRef.current.currentPreset);
        const nextPreset = regularCycle[(currentIdx + 1) % regularCycle.length];
        fieldersRef.current.applyFieldPreset(nextPreset, false, currentStrikerLeft);
        if (Math.random() > 0.45) {
          const label = nextPreset === 'death_overs' ? '5 DEEP BOUNDARY SWEEPERS SPREAD'
            : nextPreset === 'offside_defensive' ? 'DEEP COVER & THIRD MAN POSTED'
            : nextPreset === 'legside_defensive' ? 'MID-WICKET & FINE LEG ON THE ROPE'
            : 'BALANCED RING & BOUNDARY COVER';
          setFieldChangeNotice(`FIELD UPDATE: ${label} 🛡️`);
          setTimeout(() => setFieldChangeNotice(null), 2500);
        }
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
            overNum: baseOver + finalOversHistory.length + 1,
            balls: nextOverBalls,
            runs: nextOverRuns
          });
        }

        const finalBattingScorecard = battingScorecardRef.current.map(b => ({ ...b }));
        const finalBowlingScorecard = bowlingScorecardRef.current.map(bw => ({ ...bw }));

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
          overByOverHistory: finalOversHistory,
          battingScorecard: finalBattingScorecard,
          bowlingScorecard: finalBowlingScorecard,
          teamCode,
          teamScoreBase,
          teamWicketsBase,
          initialBalls,
          totalScore: teamScoreBase + nextRunsScored,
          totalWickets: teamWicketsBase + nextWicketsLost,
          totalTarget: teamScoreBase + targetRuns
        });
      }, 1500);
    } else {
      if (gameRole === 'BOWLING') {
        setTimeout(() => {
          if (gameState !== 'FINISHED' && !isPaused) {
            setGameState('READY');
          }
        }, isWide ? 1000 : 1400);
      } else {
        setTimeout(() => {
          triggerNextDelivery();
        }, isWide ? 1400 : 1800);
      }
    }
  }, [currentRunsScored, currentBallsFaced, currentWicketsLost, targetRuns, totalBalls, maxWickets, sixesCount, foursCount, aimDirection, selectedShot, hapticsEnabled, currentOverBalls, currentOverRuns, allOversHistory, onGameOver, initialBalls, teamCode, teamScoreBase, teamWicketsBase, battingLineup, isLeftHanded, bowler, bowlerList, initialBowlerIndex, firstOverTargetBalls, gameRole, tacticalField, userLockedField]);

  const triggerSpecialCelebration = (type, title, subTitle, distanceMeters = null) => {
    setCelebrationOverlay({ type, title, subTitle, distanceMeters });
    setTimeout(() => {
      setCelebrationOverlay(null);
    }, 2400);
  };

  const handleFieldPresetChange = (preset) => {
    setTacticalField(preset);
    setUserLockedField(true);
    sound.playClick();
    if (fieldersRef.current) {
      fieldersRef.current.applyFieldPreset(preset, false, isLeftHanded);
      const label = preset === 'attacking'
        ? '⚔️ ATTACKING FIELD: 2 Slips & Close Infield Active!'
        : preset === 'defending'
          ? '🛡️ DEFENDING FIELD: Boundary Riders Deep on Fence!'
          : '⚖️ NORMAL FIELD: Standard Balanced Ring & Sweepers!';
      setFieldChangeNotice(label);
      setTimeout(() => setFieldChangeNotice(null), 3200);
    }
  };

  const handleCameraToggle = () => {
    sound.playClick();
    setCameraAngle(prev => {
      let next = 'BOWLER_END';
      if (prev === 'BOWLER_END') next = 'BATSMAN_END';
      else if (prev === 'BATSMAN_END') next = 'BROADCAST';
      else next = 'BOWLER_END';

      const label = next === 'BOWLER_END'
        ? '🎯 CAMERA: BOWLER END VIEW (BEHIND BOWLER)'
        : next === 'BATSMAN_END'
          ? '🏏 CAMERA: BATSMAN END VIEW (BEHIND STRIKER)'
          : '📡 CAMERA: BROADCAST TRACKING VIEW';
      setFootworkNotice(label);
      setTimeout(() => setFootworkNotice(null), 2500);
      return next;
    });
  };

  const handleRoleToggle = () => {
    sound.playClick();
    setGameRole(prev => {
      const next = prev === 'BATTING' ? 'BOWLING' : 'BATTING';
      const label = next === 'BOWLING'
        ? '🎯 BOWLING MODE ACTIVE: BOWL MANUALLY & SET FIELD!'
        : '🏏 BATTING MODE ACTIVE: CHASE TARGET!';
      setFootworkNotice(label);
      setTimeout(() => setFootworkNotice(null), 3000);
      if (next === 'BOWLING') {
        setCameraAngle('BOWLER_END');
        setGameState('READY');
      }
      return next;
    });
  };

  const handleUserBowl = () => {
    if (gameState === 'BOWLING' || gameState === 'FINISHED' || isPaused) return;
    const activeBowlerData = bowlerList[selectedBowlerIndex] || bowlerList[0] || WORLD_BOWLERS[0];

    let targetX = pitchTarget?.x;
    let targetY = pitchTarget?.y;

    if (!targetX || !targetY) {
      const cx = engineRef.current?.cx || 200;
      const pt = engineRef.current?.pitchTop || 120;
      const pl = engineRef.current?.pitchLength || 320;
      const relY = manualLength === 'yorker' ? 0.91 : manualLength === 'slot' ? 0.74 : manualLength === 'short' ? 0.38 : 0.58;
      targetY = pt + pl * relY;
      const offset = manualLine === 'outside_off' ? (isLeftHanded ? -14 : 14) : manualLine === 'leg' ? (isLeftHanded ? 12 : -12) : 0;
      targetX = cx + offset;
    }

    triggerNextDelivery({
      bowlerType: activeBowlerData.type,
      bowlingArm: activeBowlerData.arm || 'right',
      bowlingAngle: activeBowlerData.angle || 'over',
      bowlerAction: activeBowlerData.action || 'high_arm',
      skinTone: activeBowlerData.skinTone || '#c68656',
      faceStyle: activeBowlerData.faceStyle || 'classic',
      variation: manualVariation,
      length: manualLength,
      line: manualLine,
      targetX,
      targetY
    });
  };

  const triggerNextDelivery = (manualDeliveryConfig = null) => {
    if (gameState === 'FINISHED' || isPaused) return;
    setFeedback(null);
    setTimingMeterProgress(0);
    setTimingDeltaRecord(null);
    setGameState('BOWLING');

    const engine = engineRef.current;
    if (engine) {
      const activeBowlerName = bowlerRef.current?.name || bowler.name;
      const activeBowlerData = bowlerList[selectedBowlerIndex] || bowlerList.find(b => b.name === activeBowlerName || b.shortName === activeBowlerName) || bowlerList[0] || WORLD_BOWLERS[0];

      // Ensure engine has active bowler's appearance and action
      engine.bowler.skinTone = activeBowlerData.skinTone || '#c68656';
      engine.bowler.faceStyle = activeBowlerData.faceStyle || 'classic';
      engine.bowler.actionType = activeBowlerData.action || 'high_arm';
      engine.bowler.armSide = activeBowlerData.arm || 'right';

      const deliveryPayload = {
        bowlerType: activeBowlerData.type || bowlerType,
        bowlingArm: activeBowlerData.arm || bowlingArm || 'right',
        bowlingAngle: activeBowlerData.angle || bowlingAngle || 'over',
        bowlerAction: activeBowlerData.action || bowlerAction || 'high_arm',
        action: activeBowlerData.action || bowlerAction || 'high_arm',
        skinTone: activeBowlerData.skinTone || '#c68656',
        faceStyle: activeBowlerData.faceStyle || 'classic',
        ...(manualDeliveryConfig || {})
      };

      const deliveryInfo = engine.startDelivery(deliveryPayload, 1.0);
      sound.playBowlerRelease();
      if (deliveryInfo) {
        setDeliveryVariationNotice(deliveryInfo);
        const armLabel = (deliveryInfo.bowlingArm === 'left' ? 'LA' : 'RA');
        const angleLabel = deliveryInfo.bowlingAngle === 'around' ? 'Around' : 'Over';
        const variationLine = `${activeBowlerData.name || activeBowlerName} (${armLabel} ${angleLabel}) bowls: ${deliveryInfo.label} (${deliveryInfo.speedKmh} km/h, ${deliveryInfo.length.toUpperCase()})`;
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
    const safeRestartWickets = Math.min(teamWicketsBase, Math.max(0, battingLineup.length - 2));
    setStriker({ name: matchConfig?.strikerName || battingLineup[safeRestartWickets] || battingLineup[0] || 'Rohit Sharma', runs: 0, balls: 0, fiftiesClaimed: false, centuriesClaimed: false });
    setNonStriker({ name: matchConfig?.nonStrikerName || battingLineup[(safeRestartWickets + 1) % battingLineup.length] || battingLineup[1] || 'Virat Kohli' });
    setBowler(prev => ({ ...prev, wickets: 0, runsConceded: 0, overs: '0.0' }));
    setGameState('READY');
    triggerNextDelivery();
  };

  // Pure Spacebar listener for laptop, Arrow keys for crease footwork, & Escape/P for pause
  useEffect(() => {
    const handleKeyDown = (e) => {
      const engine = engineRef.current;
      if (e.code === 'KeyC' || e.code === 'KeyV') {
        e.preventDefault();
        handleCameraToggle();
        return;
      }
      if (e.code === 'KeyB') {
        e.preventDefault();
        handleRoleToggle();
        return;
      }
      if (e.code === 'KeyF') {
        e.preventDefault();
        const presets = ['normal', 'attacking', 'defending'];
        const next = presets[(presets.indexOf(tacticalField) + 1) % presets.length];
        handleFieldPresetChange(next);
        return;
      }
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        // If ball is in play and running between wickets is active, Spacebar commands RUN!
        if (engine && engine.ball.state === 'HIT' && engine.running?.active) {
          const called = engine.commandRun();
          if (called) {
            sound.playRunning();
            if (hapticsEnabled) haptics.light();
            showFootworkAlert(`RUNNING FOR RUN ${(engine.running.runsCompleted || 0) + 1} 🏃`);
          }
        } else if (gameRole === 'BOWLING' && engine && engine.ball.state !== 'BOWLED' && engine.ball.state !== 'HIT') {
          handleUserBowl();
        } else {
          handleBatSwing(null);
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        if (engine && engine.ball.state === 'HIT' && engine.running?.active) {
          const called = engine.commandRun();
          if (called) {
            sound.playRunning();
            if (hapticsEnabled) haptics.light();
            showFootworkAlert(`RUNNING FOR RUN ${(engine.running.runsCompleted || 0) + 1} 🏃`);
          }
        }
      } else if (e.code === 'KeyS' || e.code === 'KeyH') {
        e.preventDefault();
        if (engine && engine.ball.state === 'HIT' && engine.running?.active) {
          engine.commandHold();
          sound.playClick();
          showFootworkAlert('HOLD / TURN BACK ✋');
        } else {
          engineRef.current?.resetCrease();
          setBatsmanCreasePosition('center');
          sound.playClick();
          showFootworkAlert('CREASE STANCE ⬇️');
        }
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        engineRef.current?.shuffleLeft();
        setBatsmanCreasePosition('left');
        sound.playClick();
        showFootworkAlert('SHUFFLE OFF ⬅️');
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        engineRef.current?.shuffleRight();
        setBatsmanCreasePosition('right');
        sound.playClick();
        showFootworkAlert('SHUFFLE LEG ➡️');
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        engineRef.current?.stepOut();
        setBatsmanCreasePosition('step_out');
        sound.playClick();
        showFootworkAlert('CHARGE DOWN TRACK ⬆️ (+25% POWER)');
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        if (engine && engine.ball.state === 'HIT' && engine.running?.active) {
          engine.commandHold();
          sound.playClick();
          showFootworkAlert('HOLD / TURN BACK ✋');
        } else {
          engineRef.current?.resetCrease();
          setBatsmanCreasePosition('center');
          sound.playClick();
          showFootworkAlert('CREASE STANCE ⬇️');
        }
      } else if (e.code === 'Escape' || e.code === 'KeyP') {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial delivery
  useEffect(() => {
    if (fieldersRef.current) {
      fieldersRef.current.applyFieldPreset(isDeathOvers ? 'death_overs' : 'powerplay', true, isLeftHanded);
    }
    const timer = setTimeout(() => {
      triggerNextDelivery();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // --------------------------------------------------------------------------
  // Canvas Scene Drawing: Humanoid Cricketers, Outfield & Pitch
  // --------------------------------------------------------------------------
  const drawScene = (ctx, engine, fielders, currentStadium, userProfile) => {
    if (!ctx || !engine) return;
    const width = engine.width || 400;
    const height = engine.height || 600;
    const cx = engine.cx || width / 2;
    const cy = engine.cy || height * 0.52;
    const cam = cameraRef.current;

    ctx.save();
    try {
      ctx.clearRect(0, 0, width, height);

    // Dynamic Multi-Angle Broadcast Camera Matrix (Pan & Zoom)
    const safeZoom = (Number.isFinite(cam.zoom) && cam.zoom > 0.1) ? cam.zoom : 1.0;
    const safeX = Number.isFinite(cam.x) ? cam.x : cx;
    const safeY = Number.isFinite(cam.y) ? cam.y : cy;

    ctx.translate(width / 2, height / 2);
    ctx.scale(safeZoom, safeZoom);
    ctx.translate(-safeX, -safeY);

    if (engine.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * engine.screenShake * 2;
      const shakeY = (Math.random() - 0.5) * engine.screenShake * 2;
      ctx.translate(shakeX, shakeY);
    }

    // 1. Outfield Grass with Vertical Stripes (Expansive coverage for Big Stadium)
    const outfieldRadius = engine.boundaryRadius + 240;
    const minGrassX = cx - outfieldRadius;
    const maxGrassX = cx + outfieldRadius;
    const minGrassY = cy - outfieldRadius;
    const grassHeight = outfieldRadius * 2;
    const stripeWidth = Math.max(34, width / 14);
    const numStripes = Math.ceil((maxGrassX - minGrassX) / stripeWidth) + 1;
    for (let i = 0; i < numStripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#2e5b27' : '#35682d';
      ctx.fillRect(minGrassX + i * stripeWidth, minGrassY, stripeWidth, grassHeight);
    }

    // 2. Realistic Stadium Crowd Stands & Advertising Boundary with Cheering Spectators & Crowd Catch Reaction
    CharacterRenderer.drawStadiumCrowdStands(ctx, cx, engine.cy, engine.boundaryRadius, width, height, {
      isCheering: isCrowdCheering || celebrationOverlay?.type === 'six' || celebrationOverlay?.type === 'four',
      isRocketSix: celebrationOverlay?.type === 'six' || engine.ball.isRocketSix,
      sixLanding: engine.sixLanding
    });

    // 2.5 Regulation 30-Yard Inner Circle with Painted Marker Discs on Outfield Turf
    CharacterRenderer.draw30YardCircle(
      ctx,
      cx,
      cy,
      engine.innerCircleRadiusX,
      engine.innerCircleRadiusY
    );

    // 3. Pitch Strip Dimensions
    const pw = engine.pitchWidth || 116;
    const pt = engine.pitchTop || (height * 0.26);
    const pb = engine.pitchBottom || (height * 0.78);
    const ph = pb - pt;

    // 3. Pitch Strip: Sandy beige turf pitch

    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.fillRect(cx - pw / 2 + 3, pt + 4, pw, ph);

    ctx.fillStyle = '#dfcaa4';
    ctx.fillRect(cx - pw / 2, pt, pw, ph);

    // Subtle pitch turf blocky texture & patches
    ctx.fillStyle = '#d5be96';
    ctx.fillRect(cx - pw / 2 + pw * 0.15, pt + ph * 0.35, pw * 0.45, 18);
    ctx.fillRect(cx - pw / 2 + pw * 0.40, pt + ph * 0.52, pw * 0.40, 22);
    ctx.fillRect(cx - pw / 2 + pw * 0.20, pt + ph * 0.68, pw * 0.50, 16);

    // Crease lines (White) - Increased width extending beyond pitch turf
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;

    // Batting Popping Crease (extends beyond sandy pitch edges)
    ctx.beginPath();
    ctx.moveTo(cx - pw / 2 - 8, pb - 46);
    ctx.lineTo(cx + pw / 2 + 8, pb - 46);
    // Bowling Popping Crease
    ctx.moveTo(cx - pw / 2 - 8, pt + 46);
    ctx.lineTo(cx + pw / 2 + 8, pt + 46);
    ctx.stroke();

    // Crease boxes & side return creases
    ctx.lineWidth = 1.8;
    ctx.strokeRect(cx - pw / 2 + 2, pt + 10, pw - 4, 36);
    ctx.strokeRect(cx - pw / 2 + 2, pb - 46, pw - 4, 36);

    // Official ICC Wide Guidelines (Crisp white lines with extended length & tick marks)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    // Off-side wide guideline (32px outside off, extended length)
    const offWideX = isLeftHanded ? (cx - 32) : (cx + 32);
    ctx.moveTo(offWideX, pb - 68); ctx.lineTo(offWideX, pb - 10);
    // Tick marks on off-side wide line
    ctx.moveTo(offWideX - 3, pb - 68); ctx.lineTo(offWideX + 3, pb - 68);
    ctx.moveTo(offWideX - 3, pb - 10); ctx.lineTo(offWideX + 3, pb - 10);

    // Leg-side wide guideline (20px down leg, extended length)
    const legWideX = isLeftHanded ? (cx + 20) : (cx - 20);
    ctx.moveTo(legWideX, pb - 68); ctx.lineTo(legWideX, pb - 10);
    // Tick marks on leg-side wide line
    ctx.moveTo(legWideX - 3, pb - 68); ctx.lineTo(legWideX + 3, pb - 68);
    ctx.moveTo(legWideX - 3, pb - 10); ctx.lineTo(legWideX + 3, pb - 10);
    ctx.stroke();

    // Batsman Crease Footwork Marker (Clear visual indicator of current foot stance)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(engine.batsman.x - 12, engine.batsmanCreaseY + 6, 24, 2.8);

    // 4. Stumps & Bails (3 Crisp White Stumps with 3 Bright RED Bails matching Reference Screenshot)
    const renderWicketSet = (stumpY) => {
      // 3 vertical white wickets with rounded caps & dark 1px outline
      ctx.fillStyle = '#ffffff';
      for (let s = -7; s <= 7; s += 7) {
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(cx + s - 1.5, stumpY - 15, 3, 15, 1);
        } else {
          ctx.rect(cx + s - 1.5, stumpY - 15, 3, 15);
        }
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      // 3 bright RED horizontal bails perched across the stumps
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(cx - 8.5, stumpY - 17, 17, 2.5);
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 0.6;
      ctx.strokeRect(cx - 8.5, stumpY - 17, 17, 2.5);
    };

    renderWicketSet(engine.bowlerStumpsY);

    if (!engine.stumpsHit) {
      renderWicketSet(engine.stumpsY);
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

    // 5. Professional Hawk-Eye Animated Pitch Cursor / Bounce Landing Reticle
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
      // 1. Soft radial landing zone halo
      const haloGrad = ctx.createRadialGradient(bx, by, 2, bx, by, 22 + pulse);
      haloGrad.addColorStop(0, `${lengthColor}55`);
      haloGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(bx, by, 22 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // 2. Outer Pulsing Reticle Ring
      ctx.beginPath();
      ctx.arc(bx, by, 12 + pulse, 0, Math.PI * 2);
      ctx.strokeStyle = lengthColor;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // 3. Inner Convergence Ring (shrinks as ball gets closer to pitch landing spot)
      ctx.beginPath();
      ctx.arc(bx, by, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Center Crosshairs (+) with 4 compass corner ticks
      ctx.strokeStyle = lengthColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(bx - 8, by); ctx.lineTo(bx + 8, by);
      ctx.moveTo(bx, by - 8); ctx.lineTo(bx, by + 8);
      ctx.stroke();

      // 5. Sleek Dark Pill Badge with glowing border for variation & length label
      const badgeText = `${varTitle} • ${lengthLabel}`;
      ctx.font = 'bold 8.5px "Inter", sans-serif';
      const textWidth = ctx.measureText(badgeText).width;
      const pillW = textWidth + 14;
      const pillH = 16;
      const pillX = bx - pillW / 2;
      const pillY = by - 24;

      // Dark background pill
      ctx.fillStyle = 'rgba(10, 16, 28, 0.90)';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(pillX, pillY, pillW, pillH, 8);
      } else {
        ctx.rect(pillX, pillY, pillW, pillH);
      }
      ctx.fill();
      ctx.strokeStyle = lengthColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Badge text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, bx, pillY + pillH / 2);
      ctx.restore();
    }

    // 5.2 Interactive Pitch Target Reticle (for Manual Bowling)
    if ((gameRole === 'BOWLING' || pitchTarget) && engine.ball.state !== 'BOWLED' && engine.ball.state !== 'HIT') {
      const relY = manualLength === 'yorker' ? 0.91 : manualLength === 'slot' ? 0.74 : manualLength === 'short' ? 0.38 : 0.58;
      const defaultY = engine.pitchTop + engine.pitchLength * relY;
      const defaultOffset = manualLine === 'outside_off' ? (isLeftHanded ? -14 : 14) : manualLine === 'leg' ? (isLeftHanded ? 12 : -12) : 0;
      const defaultX = cx + defaultOffset;

      const tx = pitchTarget ? pitchTarget.x : defaultX;
      const ty = pitchTarget ? pitchTarget.y : defaultY;

      const targetColor = manualLength === 'short' ? '#ef4444' : manualLength === 'slot' ? '#10b981' : manualLength === 'yorker' ? '#a855f7' : '#f59e0b';
      const pulse = Math.sin(Date.now() / 140) * 2.5;

      ctx.save();
      // Glowing halo
      const halo = ctx.createRadialGradient(tx, ty, 2, tx, ty, 18 + pulse);
      halo.addColorStop(0, `${targetColor}66`);
      halo.addColorStop(1, 'transparent');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(tx, ty, 18 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing Reticle Ring
      ctx.beginPath();
      ctx.arc(tx, ty, 11 + pulse, 0, Math.PI * 2);
      ctx.strokeStyle = targetColor;
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // Inner Bulls-Eye Dot
      ctx.beginPath();
      ctx.arc(tx, ty, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Crosshairs
      ctx.strokeStyle = targetColor;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(tx - 15, ty); ctx.lineTo(tx + 15, ty);
      ctx.moveTo(tx, ty - 15); ctx.lineTo(tx, ty + 15);
      ctx.stroke();

      // Reticle Tag
      const tagText = `🎯 ${manualVariation.toUpperCase()} • ${manualLength.toUpperCase()}`;
      ctx.font = 'bold 8.5px monospace';
      const tw = ctx.measureText(tagText).width;
      ctx.fillStyle = 'rgba(10, 16, 28, 0.92)';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(tx - tw / 2 - 5, ty - 24, tw + 10, 14, 4);
      } else {
        ctx.rect(tx - tw / 2 - 5, ty - 24, tw + 10, 14);
      }
      ctx.fill();
      ctx.strokeStyle = targetColor;
      ctx.lineWidth = 1.0;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tagText, tx, ty - 17);
      ctx.restore();
    }

    const defaultBatKit = { color: '#0066b2', secondaryColor: '#ff9933', pantsColor: '#004c85', stripeColor: '#ff9933' };
    const defaultFieldKit = { color: '#ffcd00', secondaryColor: '#00573d', pantsColor: '#004225', stripeColor: '#00573d' };
    const userTeamCode = matchConfig?.teamCode || 'IND';
    const oppTeamCode = matchConfig?.bowlingTeamCode || (userTeamCode === 'AUS' ? 'IND' : 'AUS');

    // Authentic Team Kits: Match teamCode and teamJersey STRICTLY take priority over stored profile
    const userTeamKit = getJerseyData(matchConfig?.teamJersey || userTeamCode) || defaultBatKit;
    const oppTeamKit = getJerseyData(matchConfig?.bowlingJersey || oppTeamCode) || defaultFieldKit;

    const isUserBowling = (gameRole === 'BOWLING');
    const battingKit = isUserBowling ? oppTeamKit : userTeamKit;
    const fieldingKit = isUserBowling ? userTeamKit : oppTeamKit;
    const battingJerseyColor = battingKit?.color || '#0066b2';
    const fieldingJerseyColor = fieldingKit?.color || '#ffcd00';

    // 6 & 8. Batsmen: Either sprinting between wickets or standard stance
    if (engine.running?.active && (engine.running.isCallingRun || engine.running.runsCompleted > 0)) {
      // Dynamic Running Batsmen Sprinting Between Wickets!
      // Striker Runner
      CharacterRenderer.drawRunner(ctx, engine.running.strikerX, engine.running.strikerY, {
        isStriker: true,
        runProgress: engine.running.progress,
        runDirection: engine.running.direction,
        isSliding: engine.running.isSliding,
        jerseyColor: battingJerseyColor,
        kit: battingKit
      });

      // Non-Striker Runner
      CharacterRenderer.drawRunner(ctx, engine.running.nonStrikerX, engine.running.nonStrikerY, {
        isStriker: false,
        runProgress: engine.running.progress,
        runDirection: -engine.running.direction,
        isSliding: engine.running.isSliding,
        jerseyColor: battingJerseyColor,
        kit: battingKit
      });
    } else {
      // 6. Realistic Humanoid Non-Striker (Top Crease with 1-handed grounded bat & backing-up stance)
      CharacterRenderer.drawNonStriker(ctx, engine.nonStriker.x, engine.nonStriker.y, {
        jerseyColor: battingJerseyColor,
        kit: battingKit,
        pitchCenterX: cx,
        isLeftHanded: isPlayerLeftHanded(nonStriker.name)
      });

      // 8. Realistic Humanoid Striker Batsman (Bottom Crease with Side-On Stance & Backlift)
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
        isLeftHanded,
        batSkin: userProfile?.equippedBat,
        jerseyColor: battingJerseyColor,
        kit: battingKit,
        faceStyle: 'beard',
        skinTone: '#d49b70'
      });
    }

    // 7. Realistic Vector Bowler (Top Crease with High-Arm Action, Sprint Reach & Fielding)
    CharacterRenderer.drawBowler(ctx, engine.bowler.x, engine.bowler.y, {
      runUpProgress: engine.bowler.runUpProgress,
      bowlingArmAngle: engine.bowler.bowlingArmAngle,
      followThroughProgress: engine.bowler.followThroughProgress || 0,
      armSide: engine.bowler.armSide,
      actionType: engine.bowler.actionType || 'high_arm',
      faceStyle: engine.bowler.faceStyle || 'afro',
      skinTone: engine.bowler.skinTone || '#c68656',
      jerseyColor: fieldingJerseyColor,
      kit: fieldingKit,
      isFielding: engine.bowler.isFielding,
      hasBall: engine.bowler.hasBall
    });

    // 8. Realistic Crouched Wicket-Keeper (Behind Stumps with Webbed Gloves & Stumping Action)
    CharacterRenderer.drawWicketKeeper(ctx, engine.keeper.x, engine.keeper.y, {
      isStumping: engine.keeper.isStumping,
      jerseyColor: fieldingJerseyColor,
      kit: fieldingKit
    });

    // 9. Realistic Humanoid Fielders (with Diving Slides & Throw Tracers)
    fielders.draw(ctx, fieldingKit);

    // 10. Cricket Ball (with 2.5D height, shadow scaling & rotating seam)
    if (engine.ball.inPlay) {
      const b = engine.ball;
      const h = b.height || 0;
      const shadowRadius = Math.max(2.5, b.radius * (1 / (1 + h * 0.045)));
      const shadowAlpha = Math.max(0.10, 0.45 / (1 + h * 0.05));

      // 1. Faint Ground Shadow Trail on Turf (matching Reference Screenshot!)
      if (b.groundTrail && b.groundTrail.length > 1) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(b.groundTrail[0].x, b.groundTrail[0].y);
        for (let i = 1; i < b.groundTrail.length; i++) {
          ctx.lineTo(b.groundTrail[i].x, b.groundTrail[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // 2. Dynamic Ground Shadow on the grass turf below the airborne ball
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, shadowRadius * 1.3, shadowRadius * 0.65, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
      ctx.fill();

      // Pitch bounce impact ring on dirt
      if (b.bounceImpactX && b.bounceImpactY && (Date.now() - (b.bounceTime || 0) < 600)) {
        const age = (Date.now() - b.bounceTime) / 600;
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.bounceImpactX, b.bounceImpactY, 3 + age * 16, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - age})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.restore();
      }

      // 3. Smooth Aerial Trajectory Arc Trail in the sky (matching Reference Screenshot!)
      if (b.airTrail && b.airTrail.length > 1) {
        ctx.save();
        ctx.strokeStyle = 'rgba(235, 220, 190, 0.85)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(b.airTrail[0].x, b.airTrail[0].y);
        for (let i = 1; i < b.airTrail.length; i++) {
          ctx.lineTo(b.airTrail[i].x, b.airTrail[i].y);
        }
        ctx.stroke();
        ctx.restore();
      } else if (b.trail && b.trail.length > 1 && b.state === 'BOWLED') {
        // Thin dotted red laser trajectory line connecting bowler release to ball
        ctx.save();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.lineWidth = 3.6;
        ctx.beginPath();
        ctx.moveTo(b.trail[0].x, b.trail[0].y);
        for (let i = 1; i < b.trail.length; i++) {
          ctx.lineTo(b.trail[i].x, b.trail[i].y);
        }
        ctx.stroke();

        ctx.strokeStyle = b.hasBounced ? '#f59e0b' : '#ef4444';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(b.trail[0].x, b.trail[0].y);
        for (let i = 1; i < b.trail.length; i++) {
          ctx.lineTo(b.trail[i].x, b.trail[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // Scaled airborne cricket ball with rocket altitude
      const visualY = b.y - h;
      const visualRadius = b.radius + (h * (b.isRocketSix ? 0.18 : 0.12));

      // 3D Leather Cricket Ball with Radial Light Reflection & Stitched Seam
      const ballGrad = ctx.createRadialGradient(
        b.x - visualRadius * 0.35,
        visualY - visualRadius * 0.35,
        visualRadius * 0.15,
        b.x,
        visualY,
        visualRadius
      );
      ballGrad.addColorStop(0, '#f87171'); // Highlight light reflection
      ballGrad.addColorStop(0.35, '#dc2626'); // Rich crimson leather
      ballGrad.addColorStop(0.85, '#991b1b'); // Deep cherry core
      ballGrad.addColorStop(1, '#450a0a'); // Shadow rim

      ctx.beginPath();
      ctx.arc(b.x, visualY, visualRadius, 0, Math.PI * 2);
      ctx.fillStyle = ballGrad;
      ctx.fill();
      ctx.strokeStyle = '#450a0a';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Authentic Curved Rotating White Stitched Cricket Seam
      const seamAngle = (b.traveled || 0) * 0.14;
      ctx.save();
      ctx.translate(b.x, visualY);
      ctx.rotate(seamAngle);
      ctx.beginPath();
      ctx.ellipse(0, 0, visualRadius * 0.88, visualRadius * 0.30, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.1;
      ctx.setLineDash([2, 2]); // Stitched thread dashes
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
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
    } catch (e) {
      console.error("Error drawing scene:", e);
    } finally {
      ctx.restore();
    }
  };

  const totalTeamScore = teamScoreBase + currentRunsScored;
  const totalTeamWickets = teamWicketsBase + currentWicketsLost;
  const runsRemaining = Math.max(0, targetRuns - currentRunsScored);
  const ballsRemaining = Math.max(0, totalBalls - currentBallsFaced);
  const rrr = ballsRemaining > 0 ? ((runsRemaining / ballsRemaining) * 6).toFixed(2) : '0.00';

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#080d1a] select-none flex items-center justify-center">
      {/* ==================================================================== */}
      {/* 1. FULL-SCREEN FIELD CANVAS (Full Viewport Arena - Images 2, 3, 4, 5)*/}
      {/* ==================================================================== */}
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
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
              const engine = engineRef.current;
              if (gameRole === 'BOWLING' && engine && engine.ball.state !== 'BOWLED' && engine.ball.state !== 'HIT') {
                const cam = cameraRef.current;
                const canvasW = canvasRef.current?.clientWidth || 400;
                const canvasH = canvasRef.current?.clientHeight || 600;
                const worldX = cam ? cam.x + ((e.clientX - rect.left) - canvasW / 2) / cam.zoom : e.clientX - rect.left;
                const worldY = cam ? cam.y + ((e.clientY - rect.top) - canvasH / 2) / cam.zoom : e.clientY - rect.top;

                const cx = engine.cx;
                const clampedX = Math.max(cx - 38, Math.min(cx + 38, worldX));
                const clampedY = Math.max(engine.bowlerCreaseY + 15, Math.min(engine.batsmanCreaseY - 5, worldY));

                const relY = (clampedY - engine.pitchTop) / engine.pitchLength;
                let newLength = 'good';
                if (relY > 0.85) newLength = 'yorker';
                else if (relY > 0.68) newLength = 'slot';
                else if (relY < 0.48) newLength = 'short';

                let newLine = 'stumps';
                if (clampedX < cx - 10) newLine = isLeftHanded ? 'leg' : 'outside_off';
                else if (clampedX > cx + 10) newLine = isLeftHanded ? 'outside_off' : 'leg';

                setPitchTarget({ x: clampedX, y: clampedY, length: newLength, line: newLine });
                setManualLength(newLength);
                setManualLine(newLine);
                sound.playClick();
                showFootworkAlert(`AIM: ${newLength.toUpperCase()} • ${newLine.toUpperCase()} 🎯`);
              } else if (engine && engine.ball.state === 'HIT' && engine.running?.active) {
                const called = engine.commandRun();
                if (called) {
                  sound.playRunning();
                  if (hapticsEnabled) haptics.light();
                  showFootworkAlert(`RUNNING FOR RUN ${(engine.running.runsCompleted || 0) + 1} 🏃`);
                }
              } else {
                const cam = cameraRef.current;
                const canvasW = canvasRef.current?.clientWidth || 400;
                const worldX = cam ? cam.x + ((touchX || 0) - canvasW / 2) / cam.zoom : touchX;
                handleBatSwing(worldX);
              }
            } else {
              // If batsmen are currently running between wickets:
              if (engineRef.current?.running?.active) {
                if (dy > 20) {
                  // Swipe Down = Turn Back / Hold Crease!
                  engineRef.current?.commandHold();
                  sound.playClick();
                  showFootworkAlert('HOLD / TURN BACK ✋');
                } else {
                  // Any other swipe commands the next run!
                  const called = engineRef.current?.commandRun();
                  if (called) {
                    sound.playRunning();
                    if (hapticsEnabled) haptics.light();
                    showFootworkAlert(`RUNNING FOR RUN ${(engineRef.current.running.runsCompleted || 0) + 1} 🏃`);
                  }
                }
              } else {
                // When facing bowler at crease: 4-Way Dynamic Footwork Gestures!
                if (Math.abs(dx) > Math.abs(dy)) {
                  if (dx > 0) {
                    engineRef.current?.shuffleRight();
                    setBatsmanCreasePosition('right');
                    sound.playClick();
                    showFootworkAlert('SHUFFLE LEG ➡️');
                  } else {
                    engineRef.current?.shuffleLeft();
                    setBatsmanCreasePosition('left');
                    sound.playClick();
                    showFootworkAlert('SHUFFLE OFF ⬅️');
                  }
                } else {
                  if (dy < 0) {
                    engineRef.current?.stepOut();
                    setBatsmanCreasePosition('step_out');
                    sound.playClick();
                    showFootworkAlert('CHARGE DOWN TRACK ⬆️ (+25% POWER)');
                  } else {
                    engineRef.current?.resetCrease();
                    setBatsmanCreasePosition('center');
                    sound.playClick();
                    showFootworkAlert('CREASE STANCE ⬇️');
                  }
                }
              }
            }
          }}
          className="w-full h-full cursor-pointer touch-none"
        />

        {/* ================================================================== */}
        {/* 2. SLEEK TOP HUD BAR (Mobile-Optimized Responsive Layout)          */}
        {/* ================================================================== */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-[96%] max-w-3xl pointer-events-auto">
          <div className="bg-[#0b121e]/95 border border-[#1e2a3f] rounded-2xl px-2.5 py-1.5 sm:px-4 sm:py-2 shadow-2xl backdrop-blur-md flex flex-col gap-1 sm:gap-1.5">
            {/* ROW 1: Team Pill, Score, Overs, Target Equation, RRR Pill, Over Balls Circles */}
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="px-2 sm:px-2.5 py-0.5 rounded bg-[#0284c7] font-black italic text-[11px] sm:text-xs tracking-wider text-white shadow-sm">
                  {teamCode}
                </div>
                <div className="flex items-baseline gap-1 sm:gap-1.5">
                  <span className="text-xl sm:text-3xl font-display font-black text-white tracking-tight">
                    {totalTeamScore}-{totalTeamWickets}
                  </span>
                  <span className="text-[11px] sm:text-sm font-semibold text-slate-400">
                    {teamScoreBase > 0
                      ? `${Math.floor((initialBalls + currentBallsFaced) / 6)}.${(initialBalls + currentBallsFaced) % 6}`
                      : `${Math.floor(currentBallsFaced / 6)}.${currentBallsFaced % 6}`
                    }<span className="text-[9px] sm:text-[11px] font-normal">ov</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <div className="text-[11px] sm:text-sm font-bold text-white tracking-tight whitespace-nowrap truncate">
                  Need <span className="text-[#ef4444] font-black">{runsRemaining}</span> off <span className="text-white">{ballsRemaining}</span>
                </div>
                <div className="px-1.5 sm:px-2 py-0.5 rounded bg-[#ef4444] font-display font-black text-[10px] sm:text-xs text-white tracking-wider whitespace-nowrap shadow-sm flex-shrink-0">
                  RRR {rrr}
                </div>
              </div>

              {/* Over Balls Array on Right of Row 1 */}
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                {Array.from({ length: allOversHistory.length === 0 ? firstOverTargetBalls : 6 }).map((_, idx) => {
                  const ballVal = currentOverBalls[idx];
                  if (!ballVal) {
                    return (
                      <div key={idx} className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-[#2a374f] bg-transparent" />
                    );
                  }
                  const isSix = ballVal === '6';
                  const isFour = ballVal === '4';
                  const isWicket = ballVal === 'W';
                  const isWide = ballVal === 'wd';
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-display font-black text-[8px] sm:text-[10px] text-white shadow-sm ${
                        isSix ? 'bg-[#9333ea]' : isFour ? 'bg-[#16a34a]' : isWicket ? 'bg-[#dc2626]' : isWide ? 'bg-[#d97706]' : 'bg-[#1e293b] text-slate-300'
                      }`}
                    >
                      {ballVal}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ROW 2: Striker, Non-Striker & Bowler with prominent Handedness Badges */}
            <div className="pt-1 border-t border-[#182337] flex items-center justify-between text-[11px] sm:text-xs text-slate-300 gap-1 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap min-w-0">
                {/* Striker */}
                <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 sm:px-2 py-0.5 rounded-lg border border-amber-500/50 flex-shrink-0">
                  <span className="px-1 py-0.2 rounded bg-amber-500 text-slate-950 font-black text-[8px] sm:text-[9px] uppercase tracking-wider">
                    STRIKE
                  </span>
                  <span className="font-bold text-white truncate max-w-[80px] sm:max-w-none">{striker.name}*</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-black text-[8px] sm:text-[9px] border border-amber-400/50" title="Batting Hand">
                    {isLeftHanded ? 'LHB' : 'RHB'}
                  </span>
                  {currentWicketsLost > 0 && striker.balls <= 1 && (
                    <span className="text-[8px] sm:text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-bold">NEW</span>
                  )}
                  <span className="font-black text-amber-300 ml-0.5">{striker.runs}</span>
                  <span className="text-slate-400 text-[9px] sm:text-[10px]">({striker.balls})</span>
                </div>

                {/* Non-Striker */}
                <div className="flex items-center gap-1 bg-slate-900/70 px-1.5 sm:px-2 py-0.5 rounded-lg border border-slate-700/60 flex-shrink-0">
                  <span className="px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-bold text-[8px] sm:text-[9px] uppercase tracking-wider">
                    NON
                  </span>
                  <span className="text-slate-200 font-medium truncate max-w-[70px] sm:max-w-none">{nonStriker.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-black text-[8px] sm:text-[9px] border border-cyan-500/40" title="Batting Hand">
                    {isPlayerLeftHanded(nonStriker.name) ? 'LHB' : 'RHB'}
                  </span>
                  <span className="font-bold text-slate-300 ml-0.5">{nonStriker.runs}</span>
                  <span className="text-slate-400 text-[9px] sm:text-[10px]">({nonStriker.balls})</span>
                </div>
              </div>

              {/* Bowler */}
              <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 sm:px-2 py-0.5 rounded-lg border border-red-500/40 flex-shrink-0 ml-1">
                <span className="px-1 py-0.2 rounded bg-red-600 text-white font-black text-[8px] sm:text-[9px] uppercase tracking-wider">
                  BOWL
                </span>
                <span className="font-bold text-white truncate max-w-[75px] sm:max-w-none">{bowler.name}</span>
                <span className="text-[8px] sm:text-[9px] px-1 py-0.2 rounded bg-slate-800 text-red-300 font-medium border border-slate-700">
                  {bowlingArm === 'left' ? 'LA' : 'RA'}
                </span>
                <span className="font-black text-red-400 ml-0.5">{bowler.wickets}-{bowler.runsConceded}</span>
                <span className="text-slate-400 text-[9px] sm:text-[10px]">({bowler.overs})</span>
              </div>
            </div>

            {/* ROW 3: Tactical Mode, Camera Angle & Fielding Presets */}
            <div className="pt-1 border-t border-[#182337] flex items-center justify-between text-[10px] sm:text-xs text-slate-300 gap-1.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                {/* Camera View Switcher */}
                <button
                  onClick={handleCameraToggle}
                  className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold border border-slate-700/80 flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                  title="Switch Camera View: Bowler End / Batsman End / Broadcast (Key C)"
                >
                  <Camera className="w-3 h-3 text-cyan-400" />
                  <span>
                    {cameraAngle === 'BOWLER_END' ? 'Bowler View' : cameraAngle === 'BATSMAN_END' ? 'Batsman View' : 'Broadcast'}
                  </span>
                </button>

                {/* Role Switcher (Bat / Bowl) */}
                <button
                  onClick={handleRoleToggle}
                  className={`px-2 py-0.5 rounded-lg border font-black text-[9px] sm:text-[10px] flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm ${
                    gameRole === 'BOWLING'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  }`}
                  title="Toggle Batting or Bowling Role (Key B)"
                >
                  <span>{gameRole === 'BOWLING' ? '🎯 BOWLING' : '🏏 BATTING'}</span>
                </button>
              </div>

              {/* Fielding Presets (Attacking / Normal / Defending) */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold uppercase px-1 flex items-center gap-0.5">
                  <Shield className="w-2.5 h-2.5 text-slate-400" /> Field:
                </span>
                <button
                  onClick={() => handleFieldPresetChange('attacking')}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-black flex items-center gap-0.5 cursor-pointer transition-all ${
                    tacticalField === 'attacking'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Attacking Field: 2 Slips & Close Catchers deployed"
                >
                  ⚔️ Attack
                </button>
                <button
                  onClick={() => handleFieldPresetChange('normal')}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-black flex items-center gap-0.5 cursor-pointer transition-all ${
                    tacticalField === 'normal' || tacticalField === 'balanced'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Normal Field: Standard 30-yard ring & boundary sweepers"
                >
                  ⚖️ Normal
                </button>
                <button
                  onClick={() => handleFieldPresetChange('defending')}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-black flex items-center gap-0.5 cursor-pointer transition-all ${
                    tacticalField === 'defending' || tacticalField === 'death_overs'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Defending Field: 5 Deep boundary riders guarding the ropes"
                >
                  🛡️ Defend
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Manual Bowling Control Deck (Active in Bowling Mode) */}
        {gameRole === 'BOWLING' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-35 w-[96%] max-w-lg pointer-events-auto animate-fade-in">
            <div className="bg-[#0b1220]/95 border-2 border-amber-500/70 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md flex flex-col gap-2">
              {/* Row 1: Active Bowler & Next Bowler Button */}
              <div className="flex items-center justify-between gap-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-black text-xs uppercase tracking-wider flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" /> {bowlerList[selectedBowlerIndex]?.name || bowler.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                    {bowlerList[selectedBowlerIndex]?.arm === 'left' ? 'LA' : 'RA'} {bowlerList[selectedBowlerIndex]?.type?.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    const nextIdx = (selectedBowlerIndex + 1) % bowlerList.length;
                    setSelectedBowlerIndex(nextIdx);
                    const nextB = bowlerList[nextIdx];
                    setBowler(prev => ({ ...prev, name: nextB.name }));
                    if (isSpinType(nextB.type)) {
                      setManualVariation('legbreak');
                    } else {
                      setManualVariation('outswing');
                    }
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-cyan-300 border border-slate-700 cursor-pointer"
                >
                  ⇄ Change Bowler
                </button>
              </div>

              {/* Row 2: Delivery Variations (Pace vs Spin Repertoire) */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase mr-1 flex-shrink-0">Type:</span>
                {(isSpinType(bowlerList[selectedBowlerIndex]?.type || bowlerType)
                  ? [
                      { id: 'legbreak', label: 'Leg Break' },
                      { id: 'offbreak', label: 'Off Break' },
                      { id: 'googly', label: 'Googly' },
                      { id: 'doosra', label: 'Doosra' },
                      { id: 'flipper', label: 'Flipper' },
                      { id: 'carrom', label: 'Carrom' }
                    ]
                  : [
                      { id: 'outswing', label: 'Outswing' },
                      { id: 'inswing', label: 'Inswing' },
                      { id: 'yorker', label: 'Yorker' },
                      { id: 'bouncer', label: 'Bouncer' },
                      { id: 'offcutter', label: 'Cutter' },
                      { id: 'slow_ball', label: 'Slower' }
                    ]
                ).map(v => (
                  <button
                    key={v.id}
                    onClick={() => {
                      sound.playClick();
                      setManualVariation(v.id);
                      if (v.id === 'yorker') setManualLength('yorker');
                      if (v.id === 'bouncer') setManualLength('short');
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                      manualVariation === v.id
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              {/* Row 3: Length & Line Buttons */}
              <div className="flex items-center justify-between gap-1 text-[10px]">
                {/* Length */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-bold uppercase">Length:</span>
                  {['yorker', 'slot', 'good', 'short'].map(l => (
                    <button
                      key={l}
                      onClick={() => {
                        sound.playClick();
                        setManualLength(l);
                        setPitchTarget(null);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer ${
                        manualLength === l
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {l === 'slot' ? 'Full' : l}
                    </button>
                  ))}
                </div>

                {/* Line */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-bold uppercase">Line:</span>
                  {['outside_off', 'stumps', 'leg'].map(ln => (
                    <button
                      key={ln}
                      onClick={() => {
                        sound.playClick();
                        setManualLine(ln);
                        setPitchTarget(null);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer ${
                        manualLine === ln
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {ln === 'outside_off' ? 'Off' : ln === 'stumps' ? 'Mid' : 'Leg'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Big BOWL Action Button & Pitch Target Guidance */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>🎯 Tap pitch to set landing reticle!</span>
                </div>
                <button
                  onClick={handleUserBowl}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:brightness-110 active:scale-95 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>BOWL (SPACE)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Free Hit Pulsing Badge */}
        {isFreeHit && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-35 pointer-events-none animate-bounce-subtle">
            <div className="px-3.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs tracking-wider shadow-2xl border-2 border-white flex items-center gap-1.5">
              <span>⚠️</span>
              <span>FREE HIT NEXT BALL • NO WICKET DISMISSAL</span>
              <span>🛡️</span>
            </div>
          </div>
        )}

        {/* TV Broadcast Match Intro Card */}
        {showMatchIntro && (
          <div
            onClick={() => setShowMatchIntro(false)}
            className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
          >
            <div className="bg-[#0b1220] border-2 border-amber-400/60 rounded-3xl p-4 sm:p-5 max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col gap-2.5 sm:gap-3.5 text-center transform transition-transform animate-scale-up">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                  🏏 TV BROADCAST • MATCH INTRO
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {matchConfig?.title || `${teamCode} CHASE`}
                </span>
              </div>

              {/* Match Equation Target */}
              <div className="bg-gradient-to-r from-red-950/40 via-red-900/30 to-red-950/40 border border-red-500/40 rounded-2xl py-2.5 px-3">
                <div className="text-[11px] text-red-200 uppercase font-black tracking-wider">TARGET CHASE EQUATION</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Need <span className="text-amber-300">{targetRuns} Runs</span> from <span className="text-amber-300">{matchAllowedBalls} Balls</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Required Run Rate: <span className="font-bold text-red-400">{rrr}</span> • Max Wickets: {maxWickets}
                </div>
              </div>

              {/* Players Grid: Striker, Non-Striker, Bowler */}
              <div className="grid grid-cols-1 gap-2.5 text-left">
                {/* Striker */}
                <div className="bg-slate-900/90 border border-amber-500/50 rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-base">
                      🏏
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase text-amber-400 tracking-wider">BATSMAN ON STRIKE</div>
                      <div className="text-sm font-bold text-white leading-tight">{striker.name}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-400/30">
                    {isLeftHanded ? 'LHB' : 'RHB'}
                  </span>
                </div>

                {/* Non-Striker */}
                <div className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-base">
                      🏃
                    </div>
                    <div>
                      <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">NON-STRIKER</div>
                      <div className="text-sm font-bold text-slate-200 leading-tight">{nonStriker.name}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700">
                    {isPlayerLeftHanded(nonStriker.name) ? 'LHB' : 'RHB'}
                  </span>
                </div>

                {/* Opening Bowler */}
                <div className="bg-slate-900/90 border border-red-500/40 rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-400/40 flex items-center justify-center text-base">
                      ⚡
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase text-red-400 tracking-wider">OPENING BOWLER</div>
                      <div className="text-sm font-bold text-white leading-tight">{bowler.name}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 font-extrabold text-xs border border-red-400/30">
                    {bowlingArm === 'left' ? 'LA' : 'RA'} {bowlerType?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Tap to commence button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  setShowMatchIntro(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-98 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition-all"
              >
                PLAY BALL 🏏 (TAP TO START)
              </button>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* 3. SHOT & TIMING STAMP (Image 5)                                   */}
        {/* ================================================================== */}
        {feedback && (
          <div className="absolute top-24 left-6 z-30 pointer-events-none animate-fade-in">
            <div className="text-xl sm:text-2xl font-black italic tracking-wide uppercase text-[#eab308] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] flex items-center gap-2">
              <span>{feedback.shotLabel || lastShotPlayed || 'WORKED TO LEG'}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-black/70 text-amber-300 font-mono font-bold not-italic border border-amber-400/40">
                {feedback.type?.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* 4. BIG 3D METALLIC EVENT STAMP: DOT / FOUR / SIX / OUT (Image 5)   */}
        {/* ================================================================== */}
        {feedback && feedback.bigText && (
          <div className="absolute top-1/2 right-12 -translate-y-1/2 z-30 pointer-events-none animate-bounce-subtle">
            <div className="text-6xl sm:text-8xl font-display font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)]">
              {feedback.bigText}
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
        {/* 5. BOTTOM-LEFT CONTROLS & RADAR MINI-MAP (Mobile Responsive)       */}
        {/* ================================================================== */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-30 flex flex-col items-start gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            {/* Circular Pause Button */}
            <button
              onClick={() => setIsPaused(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0c1424]/90 border border-slate-700/80 hover:bg-slate-800 flex items-center justify-center text-white shadow-xl active:scale-90 transition-all cursor-pointer backdrop-blur-sm"
              title="Pause Match"
            >
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
            </button>

            {/* Circular Sound Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0c1424]/90 border border-slate-700/80 hover:bg-slate-800 flex items-center justify-center text-white shadow-xl active:scale-90 transition-all cursor-pointer backdrop-blur-sm"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />}
            </button>
          </div>

          {/* Radar Mini-Map (Scaled responsively for mobile) */}
          <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-2xl bg-[#0c1424]/90 border border-slate-700/90 p-1 shadow-2xl relative flex items-center justify-center overflow-hidden backdrop-blur-sm">
            <div className="w-full h-full rounded-full bg-[#183617] border border-emerald-500/40 relative flex items-center justify-center overflow-hidden">
              {/* Inner 30-Yard Circle */}
              <div className="w-[50%] h-[50%] rounded-full border border-dashed border-white/60 pointer-events-none" />
              {/* Center Pitch Turf */}
              <div className="w-1.5 h-4 bg-[#dfcaa4] rounded-[1px] absolute pointer-events-none" />

              {/* Fielders on Radar (Red Dots) */}
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
                className="w-2 h-2 rounded-full bg-yellow-400 absolute shadow-sm pointer-events-none"
                style={{
                  transform: `translate(${
                    engineRef.current ? ((engineRef.current.batsman.x - engineRef.current.cx) / engineRef.current.boundaryRadius) * 32 : 0
                  }px, ${
                    engineRef.current ? ((engineRef.current.batsman.y - engineRef.current.cy) / engineRef.current.boundaryRadius) * 32 : 0
                  }px)`
                }}
              />

              {/* Cricket Ball on Radar */}
              {engineRef.current?.ball.inPlay && (
                <div
                  className="w-1.5 h-1.5 rounded-full bg-[#facc15] absolute shadow-md shadow-yellow-400 pointer-events-none animate-ping"
                  style={{
                    transform: `translate(${
                      ((engineRef.current.ball.x - engineRef.current.cx) / engineRef.current.boundaryRadius) * 32
                    }px, ${
                      ((engineRef.current.ball.y - engineRef.current.cy) / engineRef.current.boundaryRadius) * 32
                    }px)`
                  }}
                />
              )}

              {/* Camera Viewport Wireframe */}
              {engineRef.current && (
                <div
                  className="absolute border border-yellow-400/80 bg-yellow-400/10 pointer-events-none rounded-[1px]"
                  style={{
                    width: `${Math.min(40, Math.max(16, (400 / (cameraRef.current.zoom * (engineRef.current.boundaryRadius || 780) * 1.6)) * 52))}px`,
                    height: `${Math.min(40, Math.max(16, (600 / (cameraRef.current.zoom * (engineRef.current.boundaryRadius || 780) * 1.6)) * 52))}px`,
                    transform: `translate(${
                      (((cameraRef.current.x || engineRef.current.cx) - engineRef.current.cx) / (engineRef.current.boundaryRadius || 780)) * 32
                    }px, ${
                      (((cameraRef.current.y || engineRef.current.cy) - engineRef.current.cy) / (engineRef.current.boundaryRadius || 780)) * 32
                    }px)`
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 6. RUNNING INTERFACE CAMERA (Shown ONLY when batsmen are sprinting)*/}
        {/* ================================================================== */}
        {runningState?.active && (
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-30 pointer-events-none animate-in fade-in duration-150">
            <div className="bg-[#0b121e]/90 border border-emerald-500/60 rounded-2xl p-2.5 flex flex-col items-center shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xl font-black text-amber-300 font-display">{runningState.runsCompleted}</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-white">RUNS</span>
              </div>

              {/* Mini pitch camera track with animated runner dots */}
              <div className="w-16 h-20 bg-[#142e13] rounded-lg relative flex flex-col justify-between items-center py-1.5 px-1 border border-emerald-600/40 overflow-hidden my-0.5">
                <div className="text-[7px] font-mono font-bold text-amber-500">TTT</div>
                <div className="text-[7px] font-mono font-bold text-amber-500">TTT</div>
                {/* Striker runner dot */}
                <div
                  className="absolute w-3 h-3 rounded-full bg-amber-400 border border-white flex items-center justify-center shadow-md transition-all duration-300"
                  style={{
                    top: ((runningState?.runsCompleted || 0) % 2 === 1) ? '12%' : '72%',
                    left: '20%'
                  }}
                />
                {/* Non-striker runner dot */}
                <div
                  className="absolute w-3 h-3 rounded-full bg-cyan-400 border border-white flex items-center justify-center shadow-md transition-all duration-300"
                  style={{
                    top: ((runningState?.runsCompleted || 0) % 2 === 1) ? '72%' : '12%',
                    right: '20%'
                  }}
                />
              </div>

              <div className="text-[8px] font-bold text-emerald-400/90 mt-1 uppercase tracking-wider">
                TAP: RUN • SWIPE ↓: HOLD
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* 7. IN-GAME PAUSE MODAL                                             */}
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
    </div>
  );
}
