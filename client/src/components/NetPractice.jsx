import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CricketPhysics } from '../game/PhysicsEngine';
import { CharacterRenderer } from '../game/CharacterRenderer';
import { sound } from '../game/SoundEffects';
import { haptics } from '../services/haptics';
import {
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  Zap,
  Target,
  Sliders,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowUpLeft,
  ArrowUpRight,
  Gauge,
  Flame,
  Award,
  Shield,
  HelpCircle
} from 'lucide-react';

// Comprehensive 18 Bowling Variations with Authentic Cricket Speed Calibration:
// Spinners: strictly 65 - 95 km/h (max 105 km/h). Pace: 105 - 155 km/h.
const PACE_VARIATIONS = [
  { id: 'fast', label: 'Express Fast', speedRange: '145-155 km/h', defaultSpeed: 148, desc: 'Searing pace, steep deck bounce', icon: '⚡', min: 140, max: 155 },
  { id: 'inswing', label: 'Inswing Seam', speedRange: '132-142 km/h', defaultSpeed: 136, desc: 'Hoops into pads/middle stump', icon: '🎯', min: 125, max: 144 },
  { id: 'outswing', label: 'Outswing Seam', speedRange: '130-142 km/h', defaultSpeed: 134, desc: 'Shapes away to 4th stump/slips', icon: '🌪️', min: 125, max: 144 },
  { id: 'reverse_swing', label: 'Reverse Swing', speedRange: '140-150 km/h', defaultSpeed: 144, desc: 'Late vicious tail in final flight', icon: '🔥', min: 135, max: 152 },
  { id: 'offcutter', label: 'Off Cutter', speedRange: '110-125 km/h', defaultSpeed: 116, desc: 'Grips turf and breaks into pads', icon: '✂️', min: 105, max: 128 },
  { id: 'legcutter', label: 'Leg Cutter', speedRange: '110-125 km/h', defaultSpeed: 116, desc: 'Grips turf and breaks away to off', icon: '🗡️', min: 105, max: 128 },
  { id: 'straight_seam', label: 'Straight Seam', speedRange: '135-146 km/h', defaultSpeed: 140, desc: 'Upright seam holds true line', icon: '📏', min: 128, max: 148 },
  { id: 'slow_ball', label: 'Slower Dipper', speedRange: '105-118 km/h', defaultSpeed: 110, desc: 'Deceptive dip with fast arm disguise', icon: '🐢', min: 98, max: 122 },
  { id: 'yorker', label: 'Toe Yorker', speedRange: '140-152 km/h', defaultSpeed: 145, desc: 'Fired directly at toes/base of stumps', icon: '💥', min: 135, max: 155 },
  { id: 'bouncer', label: 'Sharp Bouncer', speedRange: '140-152 km/h', defaultSpeed: 146, desc: 'Violent pitch hit rising to chest/neck', icon: '🚀', min: 135, max: 155 }
];

const SPIN_VARIATIONS = [
  { id: 'legbreak', label: 'Leg Break', speedRange: '72-88 km/h', defaultSpeed: 78, desc: 'Drifts in, rips away across off stump', icon: '🌀', min: 65, max: 96 },
  { id: 'googly', label: 'Wrong\'un Googly', speedRange: '74-90 km/h', defaultSpeed: 80, desc: 'Deceptive wrist spin turns IN to pads', icon: '🪄', min: 65, max: 98 },
  { id: 'topspinner', label: 'Top Spinner', speedRange: '78-92 km/h', defaultSpeed: 84, desc: 'Forward overspin, dips and kicks high', icon: '🔝', min: 68, max: 100 },
  { id: 'flipper', label: 'Skid Flipper', speedRange: '82-96 km/h', defaultSpeed: 88, desc: 'Underhand click, skids low through gate', icon: '⚡', min: 72, max: 102 },
  { id: 'drifter', label: 'Flight Drifter', speedRange: '70-85 km/h', defaultSpeed: 75, desc: 'Floats on breeze, dips late outside off', icon: '☁️', min: 65, max: 92 },
  { id: 'offbreak', label: 'Off Break', speedRange: '74-90 km/h', defaultSpeed: 82, desc: 'Angles in, turns sharply into stumps', icon: '🔄', min: 65, max: 98 },
  { id: 'doosra', label: 'Mystery Doosra', speedRange: '76-92 km/h', defaultSpeed: 84, desc: 'Off-spin action that spins away to off', icon: '🎭', min: 68, max: 102 },
  { id: 'carrom', label: 'Carrom Ball', speedRange: '78-94 km/h', defaultSpeed: 85, desc: 'Middle-finger flick skids straight/away', icon: '🎯', min: 70, max: 102 },
  { id: 'arm_ball', label: 'Skidding Arm', speedRange: '82-96 km/h', defaultSpeed: 88, desc: 'Doesn\'t turn, slides straight on angle', icon: '🏹', min: 72, max: 104 }
];

const ALL_VARIATIONS = [...PACE_VARIATIONS, ...SPIN_VARIATIONS];

const LENGTHS = [
  { id: 'auto', label: 'Random Length', desc: 'Varied realistic length' },
  { id: 'short', label: 'Bouncer / Short', desc: 'Rises sharply to chest' },
  { id: 'good', label: 'Good Length', desc: 'Corridor of uncertainty' },
  { id: 'slot', label: 'In The Slot', desc: 'Half-volley driving length' },
  { id: 'yorker', label: 'Yorker', desc: 'Base of stumps / toes' },
  { id: 'fulltoss', label: 'Full Toss', desc: 'Direct flight, no bounce' }
];

const LINES = [
  { id: 'auto', label: 'Random' },
  { id: 'outside_off', label: 'Outside Off' },
  { id: 'stumps', label: 'On Stumps' },
  { id: 'leg', label: 'Down Leg' }
];

const SHOT_TYPES = [
  { id: 'cover_drive', label: 'Cover Drive', key: 'Q', aim: 'off', icon: '🏏' },
  { id: 'straight_drive', label: 'Straight Loft', key: 'W', aim: 'straight', icon: '🚀' },
  { id: 'pull', label: 'Pull Shot', key: 'E', aim: 'leg', icon: '⚡' },
  { id: 'upper_cut', label: 'Upper Cut', key: 'R', aim: 'off', icon: '✨' },
  { id: 'flick', label: 'Flick', key: 'F', aim: 'leg', icon: '🪄' },
  { id: 'reverse_sweep', label: 'Rev Sweep', key: 'A', aim: 'off', icon: '🔄' },
  { id: 'step_out', label: 'Charge Loft', key: 'S', aim: 'straight', icon: '🔥' },
  { id: 'scoop', label: 'Scoop Ramp', key: 'D', aim: 'straight', icon: '🎯' }
];

export default function NetPractice({ onBack, profile, settings }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const animFrameRef = useRef(null);

  // Left-Handed batsman detection
  const isLeftHanded = profile?.battingHand === 'left' ||
    (profile?.playerName || '').toLowerCase().includes('[l]') ||
    (profile?.playerName || '').toLowerCase().includes('(l)');

  // Practice Configurations
  const [bowlingCategory, setBowlingCategory] = useState('spin'); // 'pace' or 'spin'
  const [bowlerStyle, setBowlerStyle] = useState('legbreak');
  const [deliveryLength, setDeliveryLength] = useState('good');
  const [deliveryLine, setDeliveryLine] = useState('auto');
  const [speedKmh, setSpeedKmh] = useState(78);
  const [bowlingArm, setBowlingArm] = useState('right'); // 'right' or 'left'
  const [bowlingAngle, setBowlingAngle] = useState('over'); // 'over' or 'around' the wicket
  const [autoBowl, setAutoBowl] = useState(true);

  // Persistent reference for auto-bowling so it always reads the exact latest user configuration
  const configRef = useRef({
    bowlerStyle: 'legbreak',
    deliveryLength: 'good',
    deliveryLine: 'auto',
    speedKmh: 78,
    bowlingArm: 'right',
    bowlingAngle: 'over'
  });

  useEffect(() => {
    configRef.current = {
      bowlerStyle,
      deliveryLength,
      deliveryLine,
      speedKmh,
      bowlingArm,
      bowlingAngle
    };
  }, [bowlerStyle, deliveryLength, deliveryLine, speedKmh, bowlingArm, bowlingAngle]);

  // Batting Shot & Footwork
  const [selectedShot, setSelectedShot] = useState('cover_drive');
  const [lastShotName, setLastShotName] = useState('Cover Drive');
  const [aimDirection, setAimDirection] = useState('off');
  const [batsmanCreasePosition, setBatsmanCreasePosition] = useState('center'); // 'center', 'left', 'right', 'step_out'
  const [feedback, setFeedback] = useState(null);
  const [timingMeterProgress, setTimingMeterProgress] = useState(0);
  const [timingDeltaRecord, setTimingDeltaRecord] = useState(null);

  // Performance Telemetry
  const [stats, setStats] = useState({
    ballsFaced: 0,
    perfectHits: 0,
    goodHits: 0,
    edges: 0,
    misses: 0,
    sixes: 0,
    fours: 0,
    topSpeed: 0
  });

  const currentStyleObj = ALL_VARIATIONS.find(s => s.id === bowlerStyle) || ALL_VARIATIONS[0];

  // Initialize Canvas & Physics
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
      } else {
        engineRef.current.resize(width, height);
        engineRef.current.setBatsmanHand(isLeftHanded ? 'left' : 'right');
      }
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

  // Update speed default when bowler style changes
  useEffect(() => {
    const styleObj = ALL_VARIATIONS.find(s => s.id === bowlerStyle);
    if (styleObj) {
      setSpeedKmh(styleObj.defaultSpeed);
    }
  }, [bowlerStyle]);

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
      if (engine) {
        const physicsEvent = engine.update(dt);

        if (engine.ball.state === 'BOWLED') {
          setTimingMeterProgress(engine.ball.flightProgress || 0);
        }

        if (physicsEvent) {
          handleBallOutcome(physicsEvent);
        }

        drawPracticeScene(ctx, engine, profile);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [profile, selectedShot]);

  // Handle outcome & telemetry in practice
  const handleBallOutcome = useCallback((outcome) => {
    let feedbackText = '';
    let feedbackType = 'good';

    if (outcome.event === 'WIDE') {
      sound.playClick();
      feedbackText = outcome.wideSide === 'leg' ? 'WIDE! DOWN LEG SIDE ↔️' : 'WIDE! OUTSIDE OFF GUIDELINE ↔️';
      feedbackType = 'wide';
      // Wides do not consume balls faced in practice stats!
    } else if (outcome.event === 'SIX') {
      sound.playBatHit(true);
      feedbackText = `MAXIMUM! 6 RUNS 🚀 (${outcome.distanceMeters || 95}m)`;
      feedbackType = 'perfect';
      setStats(prev => ({ ...prev, sixes: prev.sixes + 1, ballsFaced: prev.ballsFaced + 1 }));
    } else if (outcome.event === 'FOUR') {
      sound.playBatHit(true);
      feedbackText = 'FOUR! CRACKING BOUNDARY 🔥';
      feedbackType = 'perfect';
      setStats(prev => ({ ...prev, fours: prev.fours + 1, ballsFaced: prev.ballsFaced + 1 }));
    } else if (outcome.event === 'RUNS') {
      sound.playCoin();
      feedbackText = `${outcome.runs} RUN${outcome.runs > 1 ? 'S' : ''} (GAP SHOT) ✨`;
      feedbackType = 'good';
      setStats(prev => ({ ...prev, ballsFaced: prev.ballsFaced + 1 }));
    } else if (outcome.event === 'BOWLED') {
      sound.playWicket();
      feedbackText = 'CLEAN BOWLED! 💥';
      feedbackType = 'wicket';
      setStats(prev => ({ ...prev, misses: prev.misses + 1, ballsFaced: prev.ballsFaced + 1 }));
    } else if (outcome.event === 'STUMPED') {
      sound.playStumping();
      feedbackText = 'STUMPED OUT! 🧤 (STEPPED OUT & MISSED)';
      feedbackType = 'wicket';
      setStats(prev => ({ ...prev, misses: prev.misses + 1, ballsFaced: prev.ballsFaced + 1 }));
    } else if (outcome.event === 'LBW') {
      sound.playUmpireAppeal();
      feedbackText = 'LBW! GIVEN OUT ☝️';
      feedbackType = 'wicket';
      setStats(prev => ({ ...prev, misses: prev.misses + 1, ballsFaced: prev.ballsFaced + 1 }));
    } else if (outcome.event === 'DOT') {
      sound.playKeeperGlove();
      feedbackText = 'BEATEN! DOT BALL •';
      feedbackType = 'late';
      setStats(prev => ({ ...prev, misses: prev.misses + 1, ballsFaced: prev.ballsFaced + 1 }));
    }

    setFeedback({ text: feedbackText, type: feedbackType });

    if (autoBowl) {
      setTimeout(() => {
        triggerDelivery();
      }, 1600);
    }
  }, [autoBowl]);

  const triggerDelivery = (overrideConfig = null) => {
    setFeedback(null);
    setTimingMeterProgress(0);
    setTimingDeltaRecord(null);

    const cfg = overrideConfig || configRef.current;
    const engine = engineRef.current;
    if (engine) {
      engine.startDelivery({
        bowlerType: cfg.bowlerStyle,
        length: cfg.deliveryLength,
        line: cfg.deliveryLine,
        speedKmh: cfg.speedKmh,
        bowlingArm: cfg.bowlingArm,
        bowlingAngle: cfg.bowlingAngle
      }, 1.0);
      sound.playBowlerRelease();
    }
  };

  const updateDeliveryConfig = (patch) => {
    sound.playClick();
    if (patch.bowlerStyle !== undefined) setBowlerStyle(patch.bowlerStyle);
    if (patch.deliveryLength !== undefined) setDeliveryLength(patch.deliveryLength);
    if (patch.deliveryLine !== undefined) setDeliveryLine(patch.deliveryLine);
    if (patch.speedKmh !== undefined) setSpeedKmh(patch.speedKmh);
    if (patch.bowlingArm !== undefined) setBowlingArm(patch.bowlingArm);
    if (patch.bowlingAngle !== undefined) setBowlingAngle(patch.bowlingAngle);

    const updated = { ...configRef.current, ...patch };
    configRef.current = updated;
    triggerDelivery(updated);
  };

  // Bat Swing Action in Nets with Dynamic Shot Detection
  const handleBatSwing = (touchX = null) => {
    const engine = engineRef.current;
    if (!engine || engine.ball.state !== 'BOWLED' || engine.batsman.isSwinging) return;

    const swingResult = engine.swingBat(touchX);

    if (swingResult) {
      setTimingDeltaRecord(swingResult.timeDeltaMs);
      const shotName = swingResult.shotLabel || 'Stroke';
      setLastShotName(shotName);

      if (swingResult.quality === 'PERFECT') {
        sound.playBatHit(true);
        haptics.heavy();
        setStats(prev => ({ ...prev, perfectHits: prev.perfectHits + 1 }));
        setFeedback({ text: `SWEET SPOT! ⚡ ${shotName.toUpperCase()} (${Math.abs(swingResult.timeDeltaMs)}ms)`, type: 'perfect' });
      } else if (swingResult.quality === 'GOOD') {
        sound.playBatHit(false);
        haptics.medium();
        setStats(prev => ({ ...prev, goodHits: prev.goodHits + 1 }));
        setFeedback({ text: `GOOD! ✨ ${shotName.toUpperCase()} (${swingResult.timeDeltaMs > 0 ? '+' : ''}${swingResult.timeDeltaMs}ms)`, type: 'good' });
      } else if (swingResult.quality === 'EARLY') {
        sound.playBatHit(false);
        haptics.light();
        setStats(prev => ({ ...prev, edges: prev.edges + 1 }));
        setFeedback({ text: `EARLY! ⏱️ ${shotName.toUpperCase()} (+${swingResult.timeDeltaMs}ms)`, type: 'early' });
      } else if (swingResult.quality === 'LATE' || swingResult.quality === 'EDGE') {
        sound.playEdgeSnick();
        haptics.light();
        setStats(prev => ({ ...prev, edges: prev.edges + 1 }));
        setFeedback({ text: `EDGE! ⚠️ ${shotName.toUpperCase()} (${swingResult.timeDeltaMs}ms)`, type: 'late' });
      } else {
        haptics.light();
        setFeedback({ text: 'SWING & MISS! 💨', type: 'late' });
      }
    }
  };

  // Keyboard controls for laptop: Spacebar for hitting, Arrow keys / WASD for footwork
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleBatSwing(null);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        engineRef.current?.shuffleLeft();
        setBatsmanCreasePosition('left');
        sound.playClick();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        engineRef.current?.shuffleRight();
        setBatsmanCreasePosition('right');
        sound.playClick();
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        engineRef.current?.stepOut();
        setBatsmanCreasePosition('step_out');
        sound.playClick();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        engineRef.current?.resetCrease();
        setBatsmanCreasePosition('center');
        sound.playClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial delivery
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerDelivery();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // --------------------------------------------------------------------------
  // Practice Net Canvas Drawing: Netting, Pitch Zones with STAMPED LABELS & Humanoids
  // --------------------------------------------------------------------------
  const drawPracticeScene = (ctx, engine, userProfile) => {
    const { width, height } = engine;
    const cx = engine.cx;

    ctx.clearRect(0, 0, width, height);

    // 1. Synthetic Net Outfield Grass
    ctx.fillStyle = '#1e3d1c';
    ctx.fillRect(0, 0, width, height);

    // 2. Practice Mesh Netting Enclosure (Left & Right Sides)
    const netXLeft = cx - engine.pitchWidth / 2 - 24;
    const netXRight = cx + engine.pitchWidth / 2 + 24;

    // Left Mesh
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.28)';
    ctx.lineWidth = 1;
    for (let x = 0; x < netXLeft; x += 14) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 14) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(netXLeft, y); ctx.stroke();
    }
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(netXLeft, 0); ctx.lineTo(netXLeft, height); ctx.stroke();

    // Right Mesh
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.28)';
    ctx.lineWidth = 1;
    for (let x = netXRight; x < width; x += 14) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 14) {
      ctx.beginPath(); ctx.moveTo(netXRight, y); ctx.lineTo(width, y); ctx.stroke();
    }
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(netXRight, 0); ctx.lineTo(netXRight, height); ctx.stroke();

    // 3. Practice Pitch Surface
    const pw = engine.pitchWidth;
    const pt = engine.pitchTop;
    const pb = engine.pitchBottom;
    const ph = pb - pt;

    ctx.fillStyle = '#059669'; // High-grip synthetic practice turf
    ctx.fillRect(cx - pw / 2, pt, pw, ph);

    // Crease lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - pw / 2 + 6, pt + 10, pw - 12, 36);
    ctx.strokeRect(cx - pw / 2 + 6, pb - 46, pw - 12, 36);

    // Official ICC Wide Guidelines (White guidelines on batting crease)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 24, pb - 46); ctx.lineTo(cx - 24, pb - 10);
    ctx.moveTo(cx + 15, pb - 46); ctx.lineTo(cx + 15, pb - 10);
    ctx.stroke();

    // ------------------------------------------------------------------------
    // PITCH LENGTH ZONES WITH DISTINCT COLORS & STAMPED TEXT LABELS!
    // ------------------------------------------------------------------------
    // A. BOUNCER / SHORT ZONE (Red Tint)
    const shortY = pt + ph * 0.38;
    const shortH = ph * 0.16;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.fillRect(cx - pw / 2, shortY, pw, shortH);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.strokeRect(cx - pw / 2, shortY, pw, shortH);
    ctx.font = 'bold 9px "Inter", sans-serif';
    ctx.fillStyle = '#fca5a5';
    ctx.textAlign = 'center';
    ctx.fillText('BOUNCER / SHORT', cx, shortY + shortH / 2 + 3);

    // B. GOOD LENGTH ZONE (Amber Tint)
    const goodY = pt + ph * 0.56;
    const goodH = ph * 0.15;
    ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.fillRect(cx - pw / 2, goodY, pw, goodH);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.strokeRect(cx - pw / 2, goodY, pw, goodH);
    ctx.fillStyle = '#fde68a';
    ctx.fillText('GOOD LENGTH', cx, goodY + goodH / 2 + 3);

    // C. IN THE SLOT ZONE (Bright Emerald Tint)
    const slotY = pt + ph * 0.72;
    const slotH = ph * 0.13;
    ctx.fillStyle = 'rgba(16, 185, 129, 0.30)';
    ctx.fillRect(cx - pw / 2, slotY, pw, slotH);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.strokeRect(cx - pw / 2, slotY, pw, slotH);
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText('IN THE SLOT', cx, slotY + slotH / 2 + 3);

    // D. YORKER ZONE (Purple / Magenta Tint)
    const yorkerY = pt + ph * 0.86;
    const yorkerH = ph * 0.10;
    ctx.fillStyle = 'rgba(168, 85, 247, 0.32)';
    ctx.fillRect(cx - pw / 2, yorkerY, pw, yorkerH);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.85)';
    ctx.strokeRect(cx - pw / 2, yorkerY, pw, yorkerH);
    ctx.fillStyle = '#e9d5ff';
    ctx.fillText('YORKER', cx, yorkerY + yorkerH / 2 + 3);

    // 4. White Stumps with Red Bails
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

    // 5. Professional Multi-Ring Pitch Landing Reticle Cursor
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

    // Visual Crease Footwork Stance Marker
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(engine.batsman.x - 10, engine.batsmanCreaseY + 6, 20, 2.5);

    // 6. Trajectory Flight Path Tracer Line
    if (engine.ball.trail.length > 2) {
      ctx.beginPath();
      ctx.moveTo(engine.ball.trail[0].x, engine.ball.trail[0].y);
      for (let i = 1; i < engine.ball.trail.length; i++) {
        ctx.lineTo(engine.ball.trail[i].x, engine.ball.trail[i].y);
      }
      ctx.strokeStyle = engine.ball.state === 'HIT' ? 'rgba(234, 179, 8, 0.7)' : 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 7. Realistic Humanoid Bowler (Top Crease)
    CharacterRenderer.drawBowler(ctx, engine.bowler.x, engine.bowler.y, {
      runUpProgress: engine.bowler.runUpProgress,
      bowlingArmAngle: engine.bowler.bowlingArmAngle,
      armSide: engine.bowler.armSide,
      actionType: engine.bowler.actionType || 'high_arm',
      faceStyle: 'headband',
      skinTone: '#c68656'
    });

    // 8. Realistic Humanoid Striker Batsman (Bottom Crease with Footwork & Spikes)
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
      jerseyColor: userProfile?.equippedJersey === 'gold' ? '#eab308' : '#2563eb',
      faceStyle: 'beard',
      skinTone: '#d49b70'
    });

    // 9. Realistic Crouched Wicket-Keeper (Behind Stumps)
    CharacterRenderer.drawWicketKeeper(ctx, engine.keeper.x, engine.keeper.y, {
      isStumping: engine.keeper.isStumping
    });

    // 10. Cricket Ball (with 2.5D height, shadow scaling & rotating seam)
    if (engine.ball.inPlay) {
      const b = engine.ball;
      const h = b.height || 0;
      const shadowRadius = Math.max(2.5, b.radius * (1 / (1 + h * 0.045)));
      const shadowAlpha = Math.max(0.10, 0.45 / (1 + h * 0.05));

      ctx.beginPath();
      ctx.ellipse(b.x, b.y, shadowRadius * 1.3, shadowRadius * 0.65, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
      ctx.fill();

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

    // 11. Particles
    engine.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });
  };

  const perfectPct = stats.ballsFaced > 0 ? Math.round((stats.perfectHits / stats.ballsFaced) * 100) : 0;
  const currentCategoryList = bowlingCategory === 'pace' ? PACE_VARIATIONS : SPIN_VARIATIONS;

  return (
    <div className="w-full h-full flex flex-col lg:flex-row bg-[#080d1a] text-slate-100 overflow-hidden select-none">
      {/* ==================================================================== */}
      {/* LEFT TRAINING PANEL: 18 BOWLING VARIATIONS & LENGTH ZONES            */}
      {/* ==================================================================== */}
      <div className="w-full lg:w-96 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#0c1322] p-4 overflow-y-auto space-y-3.5 max-h-[42vh] lg:max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <h2 className="font-display font-extrabold text-base text-white flex items-center gap-1.5">
            🏏 BATTING NETS & TRAINER
          </h2>
          <div className="w-12" />
        </div>

        {/* Category Toggle: PACE vs SPIN */}
        <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setBowlingCategory('spin');
              setBowlerStyle('legbreak');
              sound.playClick();
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              bowlingCategory === 'spin'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌀 Spin Bowling (65 - 95 km/h)
          </button>
          <button
            onClick={() => {
              setBowlingCategory('pace');
              setBowlerStyle('fast');
              sound.playClick();
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              bowlingCategory === 'pace'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Pace & Swing (105 - 155 km/h)
          </button>
        </div>

        {/* Bowling Hand & Approach Angle Selectors (Right/Left Arm & Over/Around the Wicket) */}
        <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Bowling Hand
            </label>
            <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => updateDeliveryConfig({ bowlingArm: 'right' })}
                className={`py-1 rounded text-[11px] font-bold transition-all text-center ${
                  bowlingArm === 'right'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ✋ Right
              </button>
              <button
                type="button"
                onClick={() => updateDeliveryConfig({ bowlingArm: 'left' })}
                className={`py-1 rounded text-[11px] font-bold transition-all text-center ${
                  bowlingArm === 'left'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🤚 Left
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Approach
            </label>
            <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => updateDeliveryConfig({ bowlingAngle: 'over' })}
                className={`py-1 rounded text-[11px] font-bold transition-all text-center ${
                  bowlingAngle === 'over'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔄 Over
              </button>
              <button
                type="button"
                onClick={() => updateDeliveryConfig({ bowlingAngle: 'around' })}
                className={`py-1 rounded text-[11px] font-bold transition-all text-center ${
                  bowlingAngle === 'around'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ↪️ Around
              </button>
            </div>
          </div>
        </div>

        {/* 1. Bowler Variations Grid */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Select Bowling Variation ({currentCategoryList.length} Styles)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1">
            {currentCategoryList.map(style => (
              <button
                key={style.id}
                onClick={() => updateDeliveryConfig({ bowlerStyle: style.id, speedKmh: style.defaultSpeed })}
                className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  bowlerStyle === style.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-display font-bold text-[11px] truncate flex items-center gap-1">
                  <span>{style.icon}</span> {style.label}
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5">{style.speedRange}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Pitch Length Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Delivery Length (Zones Marked on Turf)
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {LENGTHS.map(len => (
              <button
                key={len.id}
                onClick={() => updateDeliveryConfig({ deliveryLength: len.id })}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                  deliveryLength === len.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {len.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Line Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Delivery Line
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {LINES.map(line => (
              <button
                key={line.id}
                onClick={() => updateDeliveryConfig({ deliveryLine: line.id })}
                className={`py-1.5 px-1.5 rounded-xl text-xs font-bold border transition-all text-center ${
                  deliveryLine === line.id
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {line.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Speed Customizer Slider */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-amber-400" /> Delivery Speed
            </span>
            <span className="font-mono font-extrabold text-white text-sm">
              {speedKmh} km/h
            </span>
          </div>
          <input
            type="range"
            min={currentStyleObj.min}
            max={currentStyleObj.max}
            step="1"
            value={speedKmh}
            onChange={(e) => updateDeliveryConfig({ speedKmh: Number(e.target.value) })}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* 5. Practice Actions & Auto-Bowl */}
        <div className="flex gap-2">
          <button
            onClick={() => { sound.playClick(); triggerDelivery(); }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-display font-black text-sm tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-transform"
          >
            <Play className="w-4 h-4 fill-slate-950" /> BOWL NOW
          </button>
          <button
            onClick={() => { setAutoBowl(!autoBowl); sound.playClick(); }}
            className={`py-3 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              autoBowl
                ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            Auto: {autoBowl ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CENTER PRACTICE NET PITCH CANVAS                                     */}
      {/* ==================================================================== */}
      <div ref={containerRef} className="relative flex-1 h-full flex flex-col items-center justify-center overflow-hidden bg-black">
        {/* Practice Net Header Status */}
        <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between max-w-md mx-auto pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#0c1322]/90 border border-slate-800 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {bowlingArm === 'left' ? 'LA' : 'RA'} {bowlingAngle === 'around' ? 'Around' : 'Over'}
            </span>
            <span className="font-bold text-white uppercase">{bowlerStyle.replace('_', ' ')}</span>
            <span className="text-amber-400 font-mono">({speedKmh} km/h)</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#0c1322]/90 border border-slate-800 text-xs font-bold text-slate-300">
            Zone: <span className="text-emerald-400 capitalize">{deliveryLength}</span> • <span className="text-cyan-400 capitalize">{deliveryLine}</span>
          </div>
        </div>

        {/* Canvas (Touch anywhere on screen to play shot) */}
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            const touchX = rect ? (e.clientX - rect.left) : null;
            handleBatSwing(touchX);
          }}
          className="w-full h-full cursor-pointer touch-none"
        />

        {/* Timing Feedback Banner (Positioned at top so it does not obscure pitch) */}
        {feedback && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce-subtle">
            <div
              className={`px-4 py-1.5 rounded-2xl font-display font-black text-xs sm:text-sm tracking-wider uppercase border shadow-2xl backdrop-blur-md ${
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

        {/* Real-Time Visual Timing Meter */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-58 sm:w-66">
          <div className="bg-[#0c1424]/90 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider mb-1">
              <span className="text-amber-400">Early</span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> SWEET SPOT
              </span>
              <span className="text-red-400">Late</span>
            </div>
            <div className="relative w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex">
              <div className="w-[35%] h-full bg-amber-500/30 border-r border-amber-500/40" />
              <div className="w-[30%] h-full bg-emerald-500/60 shadow-inner" />
              <div className="w-[35%] h-full bg-red-500/30 border-l border-red-500/40" />
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-white rounded-full shadow-md shadow-white transition-all duration-75"
                style={{ left: `calc(${timingMeterProgress * 100}% - 5px)` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1 text-[10px] font-mono font-bold">
              <span className="text-emerald-300 uppercase">{lastShotName}</span>
              {timingDeltaRecord !== null && (
                <span className={Math.abs(timingDeltaRecord) <= 38 ? 'text-emerald-400' : 'text-amber-400'}>
                  {timingDeltaRecord > 0 ? `+${timingDeltaRecord}ms` : `${timingDeltaRecord}ms`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons: Footwork Controls + Swing Bat */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 w-full max-w-xs px-3 pointer-events-auto">
          {/* Batsman Crease Footwork Controls */}
          <div className="flex items-center justify-between gap-1 mb-1.5 bg-[#0c1424]/90 p-1 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur-md">
            <button
              onClick={(e) => { e.stopPropagation(); engineRef.current?.shuffleLeft(); setBatsmanCreasePosition('left'); sound.playClick(); }}
              className={`flex-1 py-1 px-1 rounded-xl text-[9.5px] font-bold flex items-center justify-center gap-0.5 transition-all active:scale-95 ${
                batsmanCreasePosition === 'left' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Shuffle Off Side (ArrowLeft / A)"
            >
              ◀ Off
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); engineRef.current?.resetCrease(); setBatsmanCreasePosition('center'); sound.playClick(); }}
              className={`flex-1 py-1 px-1 rounded-xl text-[9.5px] font-bold transition-all active:scale-95 ${
                batsmanCreasePosition === 'center' ? 'bg-slate-700 text-white font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Reset Crease (ArrowDown / S)"
            >
              Crease
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); engineRef.current?.shuffleRight(); setBatsmanCreasePosition('right'); sound.playClick(); }}
              className={`flex-1 py-1 px-1 rounded-xl text-[9.5px] font-bold flex items-center justify-center gap-0.5 transition-all active:scale-95 ${
                batsmanCreasePosition === 'right' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Shuffle Leg Side (ArrowRight / D)"
            >
              Leg ▶
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); engineRef.current?.stepOut(); setBatsmanCreasePosition('step_out'); sound.playClick(); }}
              className={`flex-1 py-1 px-1 rounded-xl text-[9.5px] font-bold flex items-center justify-center gap-0.5 transition-all active:scale-95 ${
                batsmanCreasePosition === 'step_out' ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white font-black shadow-md' : 'text-amber-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Step Out / Charge Down Pitch (ArrowUp / W) +25% Power!"
            >
              ⚡ Charge
            </button>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleBatSwing(null); }}
            disabled={engineRef.current?.batsman.isSwinging}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 active:scale-95 text-slate-950 font-display font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-2xl shadow-emerald-500/30 transition-all border border-emerald-300/40"
          >
            <Zap className="w-4 h-4 fill-slate-950" /> SWING BAT
          </button>
          <div className="text-center mt-1 text-[10px] text-slate-400 font-medium">
            Tap screen / <kbd className="px-1 py-0.5 rounded bg-slate-800 text-white font-mono font-bold text-[9px]">Spacebar</kbd> to hit • Arrow Keys / WASD for footwork
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* RIGHT TELEMETRY & STATS PANEL                                        */}
      {/* ==================================================================== */}
      <div className="hidden lg:flex w-80 xl:w-96 flex-col border-l border-slate-800 bg-[#0c1322] p-4 overflow-y-auto space-y-4">
        <h3 className="font-display font-extrabold text-sm text-white flex items-center gap-1.5 pb-2 border-b border-slate-800">
          📊 PRACTICE SESSION TELEMETRY
        </h3>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Balls Faced</span>
            <span className="text-2xl font-display font-black text-white">{stats.ballsFaced}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sweet Spot %</span>
            <span className="text-2xl font-display font-black text-emerald-400">{perfectPct}%</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-300 block mb-1">Timing Accuracy</span>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-emerald-400 font-bold">Perfect (Sweet Spot)</span>
              <span>{stats.perfectHits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400 font-bold">Good Contact</span>
              <span>{stats.goodHits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-400 font-bold">Early / Late Edges</span>
              <span>{stats.edges}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-400 font-bold">Beaten / Misses</span>
              <span>{stats.misses}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
            <span className="text-purple-300 font-semibold">Sixes 🚀</span>
            <span className="font-extrabold text-white text-base">{stats.sixes}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <span className="text-emerald-300 font-semibold">Fours 🔥</span>
            <span className="font-extrabold text-white text-base">{stats.fours}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-400 uppercase">Max Exit Speed</span>
          <span className="font-mono font-black text-amber-400 text-base">{stats.topSpeed || 154} km/h</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <span className="font-bold text-emerald-400 uppercase tracking-wider block">Training Coaching Notes</span>
          <p>• <strong>Bouncers & Short Balls:</strong> Use Pull Shot (E) or Upper Cut (R) over third man.</p>
          <p>• <strong>Yorkers:</strong> Time right at the toes or use Scoop Ramp (D) over keeper.</p>
          <p>• <strong>Spin Variations:</strong> Watch out for the Googly / Doosra spinning opposite to expected break.</p>
          <p>• <strong>Charge Down (S / ↓):</strong> Gives +25% loft power, but missing results in an instant stumping!</p>
        </div>
      </div>
    </div>
  );
}
