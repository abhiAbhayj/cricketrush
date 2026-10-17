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

export const WORLD_BOWLERS = [
  { name: 'J. Bumrah', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#c68656', faceStyle: 'beard' },
  { name: 'M. Starc', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic' },
  { name: 'R. Jadeja', type: 'leftarm_orthodox', arm: 'left', angle: 'over', action: 'finger_spin', skinTone: '#b57948', faceStyle: 'beard' },
  { name: 'Rashid Khan', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'beard' },
  { name: 'R. Ashwin', type: 'offspin', arm: 'right', angle: 'around', action: 'finger_spin', skinTone: '#b57948', faceStyle: 'classic' },
  { name: 'S. Afridi', type: 'fast', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#d49b70', faceStyle: 'headband' },
  { name: 'K. Yadav', type: 'leftarm_chinaman', arm: 'left', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic' },
  { name: 'P. Cummins', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'headband' },
  { name: 'J. Archer', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'headband' },
  { name: 'T. Boult', type: 'fastmedium', arm: 'left', angle: 'around', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic' },
  { name: 'Sunil Narine', type: 'offspin', arm: 'right', angle: 'around', action: 'unorthodox', skinTone: '#5a3d28', faceStyle: 'spiky' },
  { name: 'A. Nortje', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic' }
];

export const DEFAULT_BATSMEN_LINEUP = [
  'V. Kohli',
  'R. Sharma',
  'S. Gill',
  'S. Yadav',
  'KL Rahul',
  'H. Pandya',
  'R. Pant',
  'A. Patel',
  'R. Jadeja',
  'T. Head',
  'H. Klaasen',
  'G. Maxwell'
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

  const battingLineup = matchConfig?.battingLineup || DEFAULT_BATSMEN_LINEUP;
  const initialBowler = WORLD_BOWLERS.find(b => b.name === matchConfig?.bowlerName) ||
    WORLD_BOWLERS.find(b => b.type === matchConfig?.bowlerType) ||
    WORLD_BOWLERS[0];

  // Match State initialized matching authentic situational chase (Image 1 & 2)
  const [teamCode] = useState(matchConfig?.teamCode || 'JAJ');
  const [teamScoreBase] = useState(matchConfig?.teamScoreBase ?? 124);
  const [teamWicketsBase] = useState(matchConfig?.teamWicketsBase ?? 1);
  const [targetRuns] = useState(matchConfig?.targetRuns || 43);
  const [totalBalls] = useState(matchConfig?.ballsAllowed || 18);
  const [maxWickets] = useState(matchConfig?.wicketsAllowed || 5);
  const [bowlerType, setBowlerType] = useState(matchConfig?.bowlerType || initialBowler.type);
  const [bowlingArm, setBowlingArm] = useState(matchConfig?.bowlingArm || initialBowler.arm);
  const [bowlingAngle, setBowlingAngle] = useState(matchConfig?.bowlingAngle || initialBowler.angle);
  const [bowlerAction, setBowlerAction] = useState(matchConfig?.bowlerAction || initialBowler.action);
  const [stadiumKey] = useState(matchConfig?.stadiumKey || 'colosseum');

  // Intelligent Left-Handed Batsman Detection
  const isLeftHanded = profile?.battingHand === 'left' ||
    (profile?.playerName || '').toLowerCase().includes('[l]') ||
    (profile?.playerName || '').toLowerCase().includes('(l)') ||
    (matchConfig?.strikerName || '').toLowerCase().includes('[l]') ||
    (matchConfig?.strikerName || '').toLowerCase().includes('(l)');

  // Dynamic In-Match Live Scoring
  const [currentRunsScored, setCurrentRunsScored] = useState(0);
  const [currentBallsFaced, setCurrentBallsFaced] = useState(0);
  const [currentWicketsLost, setCurrentWicketsLost] = useState(0);

  // Batsmen and Bowler details (authentic match initialization from 0)
  const [striker, setStriker] = useState({
    name: profile?.playerName || matchConfig?.strikerName || battingLineup[0],
    runs: 0,
    balls: 0,
    fiftiesClaimed: false,
    centuriesClaimed: false
  });

  const [nonStriker, setNonStriker] = useState({
    name: matchConfig?.nonStrikerName || battingLineup[1],
    runs: 14,
    balls: 6
  });

  const [bowler, setBowler] = useState({
    name: matchConfig?.bowlerName || initialBowler.name,
    wickets: 0,
    runsConceded: 0,
    overs: '0.0'
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

  // Auto-hide cinematic match phase intro banner
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPhaseBanner(false);
    }, 3400);
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
        fieldersRef.current = new FielderManager(width, height, engineRef.current.boundaryRadius);
        fieldersRef.current.applyFieldPreset('powerplay', true);
      } else {
        engineRef.current.resize(width, height);
        engineRef.current.setBatsmanHand(isLeftHanded ? 'left' : 'right');
        fieldersRef.current.resize(width, height, engineRef.current.boundaryRadius);
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

          // Update Camera Targets based on game action & broadcast angles (Image 2):
          const cam = cameraRef.current;
          const cx = engine.cx;
          const cy = engine.cy;

          if (engine.ball.state === 'BOWLED' || engine.ball.state === 'RUN_UP' || engine.ball.state === 'IDLE') {
            // Clean centered pitch view matching Image 2
            cam.mode = 'PITCH_CENTER';
            cam.targetX = cx;
            cam.targetY = cy;
            cam.targetZoom = 1.0;
          } else if (engine.ball.state === 'HIT') {
            if (engine.ball.isRocketSix) {
              // Angle 4: SIX_SKYCAM - panoramic skycam tracking rocket six into crowd stands
              cam.mode = 'SIX_SKYCAM';
              cam.targetX = engine.ball.x;
              cam.targetY = engine.ball.y;
              cam.targetZoom = 0.80; // Broad view of the entire stands and crowd
            } else if (engine.running?.active && engine.running?.isCallingRun) {
              // Angle 3: RUNNING_PITCH - broadcast running pitch view showing batsmen sprinting!
              cam.mode = 'RUNNING_PITCH';
              cam.targetX = cx;
              cam.targetY = cy;
              cam.targetZoom = 1.08;
            } else if (engine.ball.isAerialFour) {
              // Angle 5: AERIAL_FOUR - dynamic tracking camera tracking lofted boundary clearing infield
              cam.mode = 'AERIAL_FOUR';
              cam.targetX = engine.ball.x;
              cam.targetY = engine.ball.y;
              cam.targetZoom = 0.86;
            } else {
              // Angle 2: BALL_CHASE - traveling camera following ball and chasing fielder in gap
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
              cam.targetZoom = distFromPitch > (engine.innerCircleRadiusX || 140) ? 0.88 : 0.98;
            }
          } else {
            // DEAD / OVER_PAUSE
            cam.targetX = cx;
            cam.targetY = cy;
            cam.targetZoom = 1.0;
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

    // Striker milestones (50 and 100) or New Batsman Incoming on Wicket!
    if (!isWide) {
      if (isWicket) {
        // Current batsman is out! Rotate to the next batsman from battingLineup
        const nextBatterIndex = nextWicketsLost + 1; // 0 was striker, 1 was nonStriker; 1st wicket brings battingLineup[2]
        const nextBatterName = battingLineup[nextBatterIndex] || `Batter #${nextBatterIndex + 1}`;
        setTimeout(() => {
          setStriker({
            name: nextBatterName,
            runs: 0,
            balls: 0,
            fiftiesClaimed: false,
            centuriesClaimed: false
          });
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

          return { ...prev, runs: nextStrikerRuns, balls: nextStrikerBalls };
        });
      }
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

    // Over-by-Over Automatic Field Regulations & Transitions
    if (fieldersRef.current) {
      const overIndex = Math.floor(currentBallsFaced / 6);
      const isStartOfOver = (currentBallsFaced % 6 === 0);
      const totalOvers = Math.ceil(totalBalls / 6);
      const isDeathOvers = (totalOvers <= 2 && overIndex >= 1) || (overIndex >= 2) || (totalBalls - currentBallsFaced <= 12);

      if (isStartOfOver) {
        if (overIndex > 0) {
          // Dynamic Over-by-Over Bowler Rotation with unique actions and styles
          const nextB = WORLD_BOWLERS[overIndex % WORLD_BOWLERS.length];
          setBowler(prev => ({ ...prev, name: nextB.name, wickets: 0, overs: `${overIndex}.0` }));
          setBowlerType(nextB.type);
          setBowlingArm(nextB.arm);
          setBowlingAngle(nextB.angle);
          setBowlerAction(nextB.action);
          if (engineRef.current) {
            engineRef.current.bowler.skinTone = nextB.skinTone;
            engineRef.current.bowler.faceStyle = nextB.faceStyle;
            engineRef.current.bowler.actionType = nextB.action;
          }
          setFieldChangeNotice(`NEW OVER: ${nextB.name.toUpperCase()} (${nextB.arm === 'left' ? 'LA' : 'RA'} ${nextB.angle.toUpperCase()}) INTO THE ATTACK 🎯`);
          setTimeout(() => setFieldChangeNotice(null), 3000);
        }

        if (overIndex === 0) {
          fieldersRef.current.applyFieldPreset('powerplay');
          setFieldChangeNotice('POWERPLAY: EXACTLY 6 FIELDERS INSIDE 30-YD CIRCLE 🛡️');
          setTimeout(() => setFieldChangeNotice(null), 3200);
        } else if (isDeathOvers) {
          fieldersRef.current.applyFieldPreset('death_overs');
          setFieldChangeNotice('DEATH OVERS: 4 INSIDE 30-YD CIRCLE, 5 ON BOUNDARY 🛡️');
          setTimeout(() => setFieldChangeNotice(null), 3200);
        } else {
          fieldersRef.current.applyFieldPreset('balanced');
          setFieldChangeNotice('MIDDLE OVERS: BALANCED FIELD SPREAD 🛡️');
          setTimeout(() => setFieldChangeNotice(null), 3200);
        }
      }
    }

    const engine = engineRef.current;
    if (engine) {
      const activeBowlerData = WORLD_BOWLERS.find(b => b.name === bowler.name) || WORLD_BOWLERS[0];
      const deliveryInfo = engine.startDelivery({
        bowlerType,
        bowlingArm,
        bowlingAngle,
        bowlerAction: bowlerAction || activeBowlerData.action,
        action: bowlerAction || activeBowlerData.action,
        skinTone: activeBowlerData.skinTone,
        faceStyle: activeBowlerData.faceStyle
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
      const engine = engineRef.current;
      if (e.code === 'Space') {
        e.preventDefault();
        // If ball is in play and running between wickets is active, Spacebar commands RUN!
        if (engine && engine.ball.state === 'HIT' && engine.running?.active) {
          const called = engine.commandRun();
          if (called) {
            sound.playRunning();
            if (hapticsEnabled) haptics.light();
          }
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
          }
        }
      } else if (e.code === 'KeyS') {
        e.preventDefault();
        if (engine && engine.ball.state === 'HIT' && engine.running?.active) {
          engine.commandHold();
          sound.playClick();
        }
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
    if (!ctx || !engine) return;
    const width = engine.width || 400;
    const height = engine.height || 600;
    const cx = engine.cx || width / 2;
    const cy = engine.cy || height * 0.52;
    const cam = cameraRef.current;

    ctx.save();
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
      ctx.roundRect(pillX, pillY, pillW, pillH, 8);
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

    const jerseyColor = userProfile?.equippedJersey === 'gold' ? '#eab308' : userProfile?.equippedJersey === 'crimson' ? '#dc2626' : userProfile?.equippedJersey === 'emerald' ? '#10b981' : '#2563eb';

    // 6 & 8. Batsmen: Either sprinting between wickets or standard stance
    if (engine.running?.active && (engine.running.isCallingRun || engine.running.runsCompleted > 0)) {
      // Dynamic Running Batsmen Sprinting Between Wickets!
      // Striker Runner
      CharacterRenderer.drawRunner(ctx, engine.running.strikerX, engine.running.strikerY, {
        isStriker: true,
        runProgress: engine.running.progress,
        runDirection: engine.running.direction,
        isSliding: engine.running.isSliding,
        jerseyColor
      });

      // Non-Striker Runner
      CharacterRenderer.drawRunner(ctx, engine.running.nonStrikerX, engine.running.nonStrikerY, {
        isStriker: false,
        runProgress: engine.running.progress,
        runDirection: -engine.running.direction,
        isSliding: engine.running.isSliding,
        jerseyColor
      });
    } else {
      // 6. Realistic Humanoid Non-Striker (Top Crease Right Side)
      CharacterRenderer.drawNonStriker(ctx, engine.nonStriker.x, engine.nonStriker.y);

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
        isLeftHanded,
        batSkin: userProfile?.equippedBat,
        jerseyColor,
        faceStyle: 'beard',
        skinTone: '#d49b70'
      });
    }

    // 7. Realistic Humanoid Bowler (Top Crease with Run-Up & Distinct Bowling Action)
    CharacterRenderer.drawBowler(ctx, engine.bowler.x, engine.bowler.y, {
      runUpProgress: engine.bowler.runUpProgress,
      bowlingArmAngle: engine.bowler.bowlingArmAngle,
      armSide: engine.bowler.armSide,
      actionType: engine.bowler.actionType || 'high_arm',
      faceStyle: engine.bowler.faceStyle || 'headband',
      skinTone: engine.bowler.skinTone || '#c68656'
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
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(b.trail[0].x, b.trail[0].y);
          for (let i = 1; i < b.trail.length; i++) {
            ctx.lineTo(b.trail[i].x, b.trail[i].y);
          }
          if (b.isRocketSix) {
            // Fiery Meteor Comet Tail for sixes
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.95)';
            ctx.lineWidth = 4.5;
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 14;
          } else if (b.isFourInGap) {
            // Emerald speed streak for bullet four in gap
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.95)';
            ctx.lineWidth = 3.5;
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 10;
          } else if (b.isAerialFour) {
            // Cyan/teal loft arc for aerial four over infield
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.95)';
            ctx.lineWidth = 3.5;
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 10;
          } else {
            ctx.strokeStyle = b.state === 'HIT' ? 'rgba(234, 179, 8, 0.75)' : 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2.5;
          }
          ctx.stroke();
          ctx.restore();
        }
      }

      // Scaled airborne cricket ball with rocket altitude
      const visualY = b.y - h;
      const visualRadius = b.radius + (h * (b.isRocketSix ? 0.22 : 0.14));

      // Fiery rocket aura for towering sixes & speed aura for gap/aerial boundaries
      if (b.isRocketSix) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, visualY, visualRadius + 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.fill();
        ctx.restore();
      } else if (b.isFourInGap) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, visualY, visualRadius + 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
        ctx.fill();
        ctx.restore();
      } else if (b.isAerialFour) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, visualY, visualRadius + 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.fill();
        ctx.restore();
      }

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
                  Need <span className="text-[#ef4444] font-black">{runsRemaining}</span> off <span className="text-white">{ballsRemaining}</span>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-[#ef4444] font-display font-black text-xs text-white tracking-wider whitespace-nowrap shadow-sm">
                  RRR {rrr}
                </div>
              </div>
            </div>

            {/* ROW 2: Striker (Gold Arrow) & Non-Striker details */}
            <div className="mt-2 pt-1.5 border-t border-[#182337] flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="text-[#facc15] font-black text-xs">▸</span>
                <span className="font-bold text-white truncate max-w-[120px] sm:max-w-none">{striker.name}</span>
                <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-300 font-mono font-bold">{isLeftHanded ? 'L' : 'R'}</span>
                <span className="font-extrabold text-white">{striker.runs}</span>
                <span className="text-slate-400 text-[11px]">({striker.balls})</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="truncate max-w-[110px] sm:max-w-none text-slate-300">{nonStriker.name}</span>
                <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 font-mono font-bold">R</span>
                <span className="font-bold text-slate-200">{nonStriker.runs}</span>
                <span className="text-slate-400 text-[11px]">({nonStriker.balls})</span>
              </div>
            </div>

            {/* ROW 3: Bowler Stats, Delivery Variation Badge & Current Over Circles */}
            <div className="mt-1 flex items-center justify-between text-xs gap-1">
              <div className="flex items-center gap-1.5 text-slate-300 truncate">
                <span className="text-red-500 font-bold text-xs">⦿</span>
                <span className="font-medium text-slate-200 truncate">{bowler.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setBowlingArm(prev => (prev === 'left' ? 'right' : 'left'));
                  }}
                  className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-500/25 hover:bg-blue-500/40 text-blue-300 border border-blue-400/40 active:scale-95 transition-all cursor-pointer"
                  title="Click to toggle Right / Left Arm Bowler"
                >
                  {bowlingArm === 'left' ? '🤚 LA' : '✋ RA'}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setBowlingAngle(prev => (prev === 'over' ? 'around' : 'over'));
                  }}
                  className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500/25 hover:bg-amber-500/40 text-amber-300 border border-amber-400/40 active:scale-95 transition-all cursor-pointer"
                  title="Click to toggle Over / Around the Wicket"
                >
                  {bowlingAngle === 'around' ? '↪️ Around' : '🔄 Over'}
                </button>
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
        {/* SLEEK MATCH PHASE BROADCAST PILL (Top-16, non-intrusive, does not block pitch) */}
        {/* ================================================================== */}
        {showPhaseBanner && (
          <div
            onClick={() => setShowPhaseBanner(false)}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-35 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/92 border border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md cursor-pointer animate-fade-in pointer-events-auto"
          >
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              {matchConfig?.roundTitle || 'ROUND 1'}
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs font-display font-black text-white uppercase tracking-wider">
              {totalBalls <= 6 ? 'SUPER OVER' : totalBalls <= 18 ? 'DEATH OVERS' : totalBalls <= 24 ? 'POWERPLAY' : 'CHASE MASTER'}
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-[10px] font-mono font-bold text-amber-300 uppercase">
              NEED {runsRemaining} OFF {ballsRemaining}
            </span>
          </div>
        )}

        {/* ================================================================== */}
        {/* TACTICAL AUTOMATIC FIELD ADJUSTMENT NOTICE (Top-22, sleek badge)   */}
        {/* ================================================================== */}
        {fieldChangeNotice && (
          <div className="absolute top-22 left-1/2 -translate-x-1/2 z-35 pointer-events-none animate-bounce-subtle">
            <div className="px-3.5 py-1 rounded-xl bg-slate-950/92 border border-amber-400/70 text-amber-300 font-display font-black text-[11px] sm:text-xs tracking-wider uppercase shadow-xl backdrop-blur-md flex items-center gap-1.5">
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
              const engine = engineRef.current;
              // If ball has already been hit and running between wickets is active:
              // Mobile & Tablet screen tap triggers RUN!
              if (engine && engine.ball.state === 'HIT' && engine.running?.active) {
                const called = engine.commandRun();
                if (called) {
                  sound.playRunning();
                  if (hapticsEnabled) haptics.light();
                }
              } else {
                // Otherwise: tap swings bat with world-accurate coordinates!
                const cam = cameraRef.current;
                const canvasW = canvasRef.current?.clientWidth || 400;
                const worldX = cam ? cam.x + ((touchX || 0) - canvasW / 2) / cam.zoom : touchX;
                handleBatSwing(worldX);
              }
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
        {/* SLEEK BROADCAST EVENT BADGE (TOP-16, COMPLETELY NON-INTRUSIVE)    */}
        {/* ================================================================== */}
        {celebrationOverlay && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-fade-in flex flex-col items-center">
            <div className={`px-4 py-1.5 rounded-full backdrop-blur-md shadow-2xl flex items-center gap-2.5 border ${
              celebrationOverlay.type === 'six'
                ? 'bg-gradient-to-r from-amber-500/95 via-orange-500/95 to-rose-600/95 border-amber-300 text-white shadow-amber-500/40'
                : celebrationOverlay.type?.includes('four') || celebrationOverlay.type === 'late_cut'
                ? 'bg-gradient-to-r from-emerald-600/95 via-teal-600/95 to-cyan-600/95 border-emerald-300 text-white shadow-emerald-500/40'
                : 'bg-gradient-to-r from-red-600/95 to-rose-700/95 border-rose-300 text-white shadow-rose-600/40'
            }`}>
              <span className="font-display font-black text-xs sm:text-sm tracking-wide uppercase drop-shadow flex items-center gap-1.5">
                {celebrationOverlay.type === 'six' ? '🚀' : celebrationOverlay.type?.includes('four') ? '⚡' : '💥'}
                {celebrationOverlay.title}
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-200 tracking-wider uppercase px-2 py-0.5 rounded bg-black/45">
                {celebrationOverlay.distanceMeters ? `${celebrationOverlay.distanceMeters}M` : celebrationOverlay.subTitle}
              </span>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* INTERACTIVE RUNNING BETWEEN WICKETS HUD (LAPTOP & MOBILE CONTROLS)  */}
        {/* ================================================================== */}
        {runningState?.active && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-auto animate-fade-in w-11/12 max-w-sm sm:max-w-md">
            <div className="w-full bg-[#0a1220]/95 border-2 border-emerald-400/80 rounded-2xl p-3 shadow-[0_0_30px_rgba(16,185,129,0.35)] backdrop-blur-md flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-1 text-xs font-mono font-bold">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  RUNS: {runningState.runsCompleted} / 3
                </span>
                <span className="text-slate-300">
                  {runningState.throwActive ? (
                    <span className="text-amber-400 flex items-center gap-1 animate-pulse font-bold">
                      🎯 THROW IN FLIGHT ({Math.round(runningState.dangerLevel * 100)}%)
                    </span>
                  ) : (
                    <span className="text-emerald-300">BALL IN PLAY</span>
                  )}
                </span>
              </div>

              {/* Status readout */}
              <div className="text-center font-display font-black text-sm uppercase tracking-wide my-1">
                {runningState.isCallingRun ? (
                  <span className={runningState.isSliding ? 'text-amber-400 animate-pulse' : 'text-emerald-300'}>
                    {runningState.isSliding ? '⚡ SLIDING BAT INTO CREASE!' : `🏃 SPRINTING FOR RUN ${runningState.runsCompleted + 1}...`}
                  </span>
                ) : (
                  <span className="text-white">
                    {runningState.runsCompleted > 0
                      ? '✅ SAFE IN CREASE • TAP RUN FOR NEXT RUN!'
                      : 'TAP SCREEN OR "RUN" BUTTON TO SPRINT!'}
                  </span>
                )}
              </div>

              {/* Mobile Prompt */}
              <div className="text-[10px] text-cyan-300/80 uppercase tracking-widest mt-0.5 font-mono">
                📱 MOBILE: TAP SCREEN TO RUN • 💻 LAPTOP: SPACEBAR / R
              </div>

              {/* Action Buttons: RUN and HOLD */}
              <div className="flex items-center gap-2.5 w-full mt-2">
                <button
                  onClick={() => {
                    const called = engineRef.current?.commandRun();
                    if (called) {
                      sound.playRunning();
                      if (hapticsEnabled) haptics.light();
                    }
                  }}
                  disabled={runningState.runsCompleted >= 3}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-display font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span>🏃 RUN</span>
                  <span className="text-[10px] font-mono opacity-80">(Space / R)</span>
                </button>

                <button
                  onClick={() => {
                    engineRef.current?.commandHold();
                    sound.playClick();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-amber-300 font-display font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>✋ HOLD</span>
                  <span className="text-[10px] font-mono opacity-80">(S)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* VISUAL BATSMAN TIMING METER (Shows Dynamic Shot + ms Delta!)       */}
        {/* ================================================================== */}
        {!runningState?.active && (
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
        )}

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
            <span>Run 1, 2, 3 (Laptop):</span>
            <kbd className="px-2 py-0.5 rounded bg-emerald-800/80 font-mono text-[11px] text-emerald-200">Space / R</kbd>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Run 1, 2, 3 (Mobile):</span>
            <span className="text-[11px] text-emerald-400 font-semibold">Tap Screen to Run</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Hold Crease:</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[11px] text-amber-300">S Key</kbd>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Pause / Menu:</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[11px] text-white">Esc / P</kbd>
          </div>
          <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800 leading-relaxed">
            *Dynamic Multi-Angle Broadcast Camera automatically tracks the ball across the 30-yard ring, shows close-up running pitch action with bat slides, and aerial skycam for towering sixes!
          </div>
        </div>
      </div>
    </div>
  );
}
