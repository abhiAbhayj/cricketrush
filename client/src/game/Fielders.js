// Dynamic AI Fielders for Top-Down Cricket with Authentic Zone Coverage & Diving Slides
import { CharacterRenderer } from './CharacterRenderer';

export class FielderManager {
  constructor(canvasWidth, canvasHeight, boundaryRadius, innerCircleRadiusX = null, innerCircleRadiusY = null) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.boundaryRadius = boundaryRadius;
    this.innerCircleRadiusX = innerCircleRadiusX || Math.round(boundaryRadius * 0.36);
    this.innerCircleRadiusY = innerCircleRadiusY || Math.round(boundaryRadius * 0.41);
    this.fielders = [];
    this.throwTracer = null; // { fromX, fromY, toX, toY, progress }
    this.currentPreset = 'balanced';
    this.fieldNotice = null;
    this.resetPositions();
  }

  resize(canvasWidth, canvasHeight, boundaryRadius, innerCircleRadiusX = null, innerCircleRadiusY = null) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.boundaryRadius = boundaryRadius;
    if (innerCircleRadiusX) this.innerCircleRadiusX = innerCircleRadiusX;
    if (innerCircleRadiusY) this.innerCircleRadiusY = innerCircleRadiusY;
    this.applyFieldPreset(this.currentPreset || 'balanced', false);
  }

  resetPositions() {
    this.applyFieldPreset(this.currentPreset || 'balanced', true);
  }

  /**
   * Apply tactical cricket fielding presets with automatic positioning.
   * Infielders are mathematically stationed directly ON the 30-yard circle line,
   * while boundary sweepers protect the 80-meter boundary perimeter.
   */
  applyFieldPreset(preset = 'balanced', snap = false) {
    this.currentPreset = preset;
    const cx = this.width / 2;
    const cy = this.height * 0.52;
    const pitchH = this.height * 0.46;
    const batsmanY = cy + pitchH * 0.38;
    const br = this.boundaryRadius;
    const rx = this.innerCircleRadiusX || Math.round(br * 0.36);
    const ry = this.innerCircleRadiusY || Math.round(br * 0.41);

    this.throwTracer = null;
    this.primaryChaserId = null;
    this.backupFielderId = null;

    // Helpers to place fielders EXACTLY along 30-yard circle line or 80-meter boundary
    const onCircle = (angleRad) => ({
      x: cx + Math.cos(angleRad) * rx,
      y: cy + Math.sin(angleRad) * ry
    });

    const onBoundary = (angleRad, distRatio = 0.92) => ({
      x: cx + Math.cos(angleRad) * (br * distRatio),
      y: cy + Math.sin(angleRad) * (br * distRatio)
    });

    let targetPlacements = [];

    if (preset === 'powerplay') {
      // POWERPLAY: Exactly 6 Fielders stationed ON the 30-Yard Circle Line, 3 deep on 80m boundary
      const mOff = onCircle(-1.95);
      const mOn = onCircle(-1.19);
      const cov = onCircle(-2.65);
      const pt = onCircle(2.88);
      const mWkt = onCircle(-0.48);
      const sqL = onCircle(0.25);
      const dLongOff = onBoundary(-1.95, 0.92);
      const dMidWkt = onBoundary(-0.48, 0.92);
      const dFineLeg = onBoundary(0.85, 0.92);

      targetPlacements = [
        { id: 'midoff', role: 'Mid-Off', x: mOff.x, y: mOff.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: mOn.x, y: mOn.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'cover', role: 'Extra Cover', x: cov.x, y: cov.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'point', role: 'Backward Point', x: pt.x, y: pt.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'midwicket', role: 'Mid-Wicket', x: mWkt.x, y: mWkt.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'sqleg', role: 'Square Leg', x: sqL.x, y: sqL.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'longoff', role: 'Deep Long-Off', x: dLongOff.x, y: dLongOff.y, speed: 3.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: dMidWkt.x, y: dMidWkt.y, speed: 3.8, zone: 'boundary' },
        { id: 'fineleg', role: 'Deep Fine Leg', x: dFineLeg.x, y: dFineLeg.y, speed: 3.8, zone: 'boundary' }
      ];
    } else if (preset === 'death_overs') {
      // DEATH OVERS: Exactly 4 Fielders ON the 30-Yard Circle Line, 5 deep on 80m boundary
      const cov = onCircle(-2.55);
      const mOff = onCircle(-1.95);
      const mOn = onCircle(-1.19);
      const sqL = onCircle(0.25);
      const dCov = onBoundary(-2.55, 0.92);
      const dLongOff = onBoundary(-1.95, 0.92);
      const dLongOn = onBoundary(-1.19, 0.92);
      const dMidWkt = onBoundary(-0.48, 0.92);
      const dThirdMan = onBoundary(2.35, 0.92);

      targetPlacements = [
        { id: 'cover', role: 'Cover', x: cov.x, y: cov.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: mOff.x, y: mOff.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: mOn.x, y: mOn.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'sqleg', role: 'Square Leg', x: sqL.x, y: sqL.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'deepcover', role: 'Deep Extra Cover', x: dCov.x, y: dCov.y, speed: 3.8, zone: 'boundary' },
        { id: 'longoff', role: 'Long-Off', x: dLongOff.x, y: dLongOff.y, speed: 3.8, zone: 'boundary' },
        { id: 'longon', role: 'Long-On', x: dLongOn.x, y: dLongOn.y, speed: 3.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: dMidWkt.x, y: dMidWkt.y, speed: 3.8, zone: 'boundary' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: dThirdMan.x, y: dThirdMan.y, speed: 3.8, zone: 'boundary' }
      ];
    } else if (preset === 'attacking') {
      // Aggressive wicket-taking field: 2 Slips & Gully close, 3 on 30-Yard Circle Line, 3 deep on boundary
      const cov = onCircle(-2.55);
      const mOff = onCircle(-1.95);
      const mOn = onCircle(-1.19);
      const dThirdMan = onBoundary(2.35, 0.92);
      const dMidWkt = onBoundary(-0.48, 0.92);
      const dFineLeg = onBoundary(0.85, 0.92);

      targetPlacements = [
        { id: 'slip1', role: '1st Slip', x: cx - 40, y: batsmanY + 36, speed: 3.2, zone: 'slips' },
        { id: 'slip2', role: '2nd Slip', x: cx - 68, y: batsmanY + 44, speed: 3.2, zone: 'slips' },
        { id: 'gully', role: 'Gully', x: cx - 110, y: batsmanY + 20, speed: 3.2, zone: 'gully' },
        { id: 'cover', role: 'Cover', x: cov.x, y: cov.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: mOff.x, y: mOff.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: mOn.x, y: mOn.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: dThirdMan.x, y: dThirdMan.y, speed: 3.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: dMidWkt.x, y: dMidWkt.y, speed: 3.8, zone: 'boundary' },
        { id: 'fineleg', role: 'Deep Fine Leg', x: dFineLeg.x, y: dFineLeg.y, speed: 3.8, zone: 'boundary' }
      ];
    } else if (preset === 'offside_defensive') {
      // Packed off-side ring: 4 on 30-yard circle line, 5 on 80m boundary
      const mOff = onCircle(-1.95);
      const mOn = onCircle(-1.19);
      const mWkt = onCircle(-0.48);
      const sqL = onCircle(0.25);
      const dThirdMan = onBoundary(2.35, 0.92);
      const dPoint = onBoundary(2.95, 0.92);
      const dCover = onBoundary(-2.55, 0.92);
      const dLongOff = onBoundary(-1.95, 0.92);
      const dMidWkt = onBoundary(-0.48, 0.92);

      targetPlacements = [
        { id: 'midoff', role: 'Mid-Off', x: mOff.x, y: mOff.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: mOn.x, y: mOn.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'midwicket', role: 'Mid-Wicket', x: mWkt.x, y: mWkt.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'sqleg', role: 'Square Leg', x: sqL.x, y: sqL.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: dThirdMan.x, y: dThirdMan.y, speed: 3.8, zone: 'boundary' },
        { id: 'point', role: 'Deep Point', x: dPoint.x, y: dPoint.y, speed: 3.8, zone: 'boundary' },
        { id: 'deepcover', role: 'Deep Cover', x: dCover.x, y: dCover.y, speed: 3.8, zone: 'boundary' },
        { id: 'longoff', role: 'Long-Off', x: dLongOff.x, y: dLongOff.y, speed: 3.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: dMidWkt.x, y: dMidWkt.y, speed: 3.8, zone: 'boundary' }
      ];
    } else if (preset === 'legside_defensive') {
      // Leg-side trap: 4 on 30-yard circle line, 5 on 80m boundary
      const pt = onCircle(2.88);
      const cov = onCircle(-2.55);
      const mOff = onCircle(-1.95);
      const mOn = onCircle(-1.19);
      const dLongOn = onBoundary(-1.19, 0.92);
      const dMidWkt = onBoundary(-0.48, 0.92);
      const dSqLeg = onBoundary(0.35, 0.92);
      const dFineLeg = onBoundary(0.85, 0.92);
      const dCover = onBoundary(-2.55, 0.92);

      targetPlacements = [
        { id: 'point', role: 'Point', x: pt.x, y: pt.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'cover', role: 'Cover', x: cov.x, y: cov.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: mOff.x, y: mOff.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: mOn.x, y: mOn.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'longon', role: 'Long-On', x: dLongOn.x, y: dLongOn.y, speed: 3.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: dMidWkt.x, y: dMidWkt.y, speed: 3.8, zone: 'boundary' },
        { id: 'deepsqleg', role: 'Deep Sq Leg', x: dSqLeg.x, y: dSqLeg.y, speed: 3.8, zone: 'boundary' },
        { id: 'fineleg', role: 'Fine Leg', x: dFineLeg.x, y: dFineLeg.y, speed: 3.8, zone: 'boundary' },
        { id: 'deepcover', role: 'Deep Cover', x: dCover.x, y: dCover.y, speed: 3.8, zone: 'boundary' }
      ];
    } else {
      // Balanced Standard Cricket Field: 4 ON 30-Yard Circle Line, 5 deep on 80m boundary
      const cov = onCircle(-2.55);
      const mOff = onCircle(-1.95);
      const mOn = onCircle(-1.19);
      const sqL = onCircle(0.25);
      const dPt = onBoundary(2.95, 0.92);
      const dLongOff = onBoundary(-1.95, 0.92);
      const dLongOn = onBoundary(-1.19, 0.92);
      const dMidWkt = onBoundary(-0.48, 0.92);
      const dThirdMan = onBoundary(2.35, 0.92);

      targetPlacements = [
        { id: 'cover', role: 'Cover', x: cov.x, y: cov.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: mOff.x, y: mOff.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: mOn.x, y: mOn.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'sqleg', role: 'Square Leg', x: sqL.x, y: sqL.y, speed: 3.2, zone: 'infield_ring' },
        { id: 'deeppoint', role: 'Deep Point', x: dPt.x, y: dPt.y, speed: 3.8, zone: 'boundary' },
        { id: 'longoff', role: 'Deep Long-Off', x: dLongOff.x, y: dLongOff.y, speed: 3.8, zone: 'boundary' },
        { id: 'longon', role: 'Deep Long-On', x: dLongOn.x, y: dLongOn.y, speed: 3.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: dMidWkt.x, y: dMidWkt.y, speed: 3.8, zone: 'boundary' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: dThirdMan.x, y: dThirdMan.y, speed: 3.8, zone: 'boundary' }
      ];
    }

    if (snap || this.fielders.length === 0) {
      this.fielders = targetPlacements.map(t => ({
        ...t,
        homeX: t.x,
        homeY: t.y,
        vx: 0,
        vy: 0,
        isDiving: false,
        isCatching: false,
        catchTimer: 0
      }));
    } else {
      // Smoothly transition existing fielders to new home stations
      targetPlacements.forEach((t, i) => {
        if (this.fielders[i]) {
          this.fielders[i].role = t.role;
          this.fielders[i].homeX = t.x;
          this.fielders[i].homeY = t.y;
          this.fielders[i].speed = t.speed;
          this.fielders[i].zone = t.zone;
        } else {
          this.fielders.push({
            ...t,
            homeX: t.x,
            homeY: t.y,
            vx: 0,
            vy: 0,
            isDiving: false,
            isCatching: false,
            catchTimer: 0
          });
        }
      });
    }
  }

  update(ball, dt = 1, engine = null) {
    if (this.throwTracer) {
      this.throwTracer.progress += 0.055 * dt;
      if (engine?.running?.throwActive) {
        engine.running.throwProgress = this.throwTracer.progress;
      }
      if (this.throwTracer.progress >= 1.0) {
        this.throwTracer.progress = 1.0;
        this.throwTracer.active = false;
        if (engine?.running) {
          engine.running.throwProgress = 1.0;
        }
        if (!this.throwTracer.fadeTimer) this.throwTracer.fadeTimer = 12;
        this.throwTracer.fadeTimer -= dt;
        if (this.throwTracer.fadeTimer <= 0) {
          this.throwTracer = null;
        }
      }
    }

    if (!ball || ball.state !== 'HIT') {
      // Return smoothly to defensive home stations when ball is dead or before hit
      this.primaryChaserId = null;
      this.backupFielderId = null;
      this.fielders.forEach(f => {
        f.isDiving = false;
        f.vx *= 0.85;
        f.vy *= 0.85;
        f.x += (f.homeX - f.x) * 0.05 + f.vx;
        f.y += (f.homeY - f.y) * 0.05 + f.vy;
      });
      return;
    }

    const ballSpeed = Math.hypot(ball.vx || 0, ball.vy || 0);
    const cx = this.width / 2;
    const cy = this.height * 0.52;
    const ballDistFromCenter = Math.hypot(ball.x - cx, ball.y - cy);
    const rx = this.innerCircleRadiusX || Math.round(this.boundaryRadius * 0.36);

    // 1. Dynamic continuous selection of Primary Chaser & Backup Sweeper
    // Deep boundary fielders take immediate priority once ball nears or enters outfield!
    let bestFielder = null;
    let minScore = Infinity;

    this.fielders.forEach(f => {
      const dist = Math.hypot(ball.x - f.x, ball.y - f.y);
      const predBallX = ball.x + (ball.vx || 0) * 16;
      const predBallY = ball.y + (ball.vy || 0) * 16;
      const predDist = Math.hypot(predBallX - f.x, predBallY - f.y);

      let score = dist * 0.5 + predDist * 0.5;
      // If ball is crossing 30-yard circle or in outfield, boundary sweepers get strong priority
      if (ballDistFromCenter > rx * 0.82 && f.zone === 'boundary') {
        score *= 0.55;
      }
      if (score < minScore) {
        minScore = score;
        bestFielder = f;
      }
    });

    if (bestFielder) {
      this.primaryChaserId = bestFielder.id;
      // Select secondary backup fielder in that sector to cut off boundary angle
      let backupFielder = null;
      let backupMinDist = Infinity;
      this.fielders.forEach(f => {
        if (f.id !== bestFielder.id) {
          const d = Math.hypot(f.x - bestFielder.x, f.y - bestFielder.y);
          if (d < backupMinDist) {
            backupMinDist = d;
            backupFielder = f;
          }
        }
      });
      if (backupFielder) {
        this.backupFielderId = backupFielder.id;
      }
    }

    // 2. Active, Sector-Bounded Multi-Fielder Pursuit (NO FROZEN FIELDERS!)
    this.fielders.forEach(f => {
      const isPrimary = f.id === this.primaryChaserId;
      const isBackup = f.id === this.backupFielderId;
      const distToBall = Math.hypot(ball.x - f.x, ball.y - f.y);

      if (isPrimary) {
        // Primary fielder sprints at full throttle directly to intercept ball
        const dx = ball.x - f.x;
        const dy = ball.y - f.y;

        // Diving slide trigger when within grasping reach of fast ball
        if (distToBall < 48 && distToBall > 12 && ballSpeed > 3.0 && !ball.isAirborne) {
          f.isDiving = true;
        }

        const moveSpeed = f.isDiving ? (f.speed * 1.45) : (f.speed * 1.25);
        if (distToBall > 4) {
          f.vx = (dx / distToBall) * moveSpeed;
          f.vy = (dy / distToBall) * moveSpeed;
        } else {
          f.vx *= 0.5;
          f.vy *= 0.5;
        }
        f.x += f.vx;
        f.y += f.vy;
      } else if (isBackup || (distToBall < 200 && ballSpeed > 2.0 && ballDistFromCenter > rx * 0.8)) {
        // Backup sweepers and adjacent outfielders across 30-yard circle converge to cut off boundary ropes!
        const primary = this.fielders.find(p => p.id === this.primaryChaserId);
        const targetX = primary ? (ball.x * 0.7 + primary.x * 0.3) : ball.x;
        const targetY = primary ? (ball.y * 0.7 + primary.y * 0.3) : ball.y;

        const dx = targetX - f.x;
        const dy = targetY - f.y;
        const d = Math.hypot(dx, dy);

        if (d > 16) {
          f.vx = (dx / d) * (f.speed * 1.05);
          f.vy = (dy / d) * (f.speed * 1.05);
        } else {
          f.vx *= 0.6;
          f.vy *= 0.6;
        }
        f.x += f.vx;
        f.y += f.vy;
      } else {
        // Other fielders hold defensive position, subtly shifting towards stumps to back up
        const targetX = f.homeX + (cx - f.homeX) * 0.18;
        const targetY = f.homeY + (cy - f.homeY) * 0.18;

        f.x += (targetX - f.x) * 0.04;
        f.y += (targetY - f.y) * 0.04;
      }
    });

    // Automatic field pickup: if ball has slowed down on turf and ANY fielder reaches it, scoop up & throw immediately!
    if (ball && ball.state === 'HIT' && !ball.isAirborne && !ball.isStoppedByFielder && !this.throwTracer && !engine?.running?.throwActive) {
      for (let f of this.fielders) {
        const d = Math.hypot(f.x - ball.x, f.y - ball.y);
        if (d < 38 && ballSpeed < 6.0) {
          ball.isStoppedByFielder = true;
          ball.vx = 0;
          ball.vy = 0;
          this.startThrowTracer(f.x, f.y, engine, f.role);
          break;
        }
      }
    }
  }

  checkFieldInterception(ball, engine = null) {
    if (!ball || ball.state !== 'HIT' || ball.isStoppedByFielder || this.throwTracer?.active || engine?.running?.throwActive) {
      return null;
    }

    const ballSpeed = Math.hypot(ball.vx || 0, ball.vy || 0);

    for (let f of this.fielders) {
      const dist = Math.hypot(ball.x - f.x, ball.y - f.y);

      // Catch detection (Airborne ball at catchable height)
      if (ball.isAirborne && ball.height < 34 && dist < 36) {
        ball.isStoppedByFielder = true;
        ball.vx = 0;
        ball.vy = 0;
        f.isDiving = true;
        f.isCatching = true;
        f.catchTimer = 90;
        this.startThrowTracer(f.x, f.y, engine, f.role);
        return { type: 'CATCH', fielder: f.role };
      }

      // Ground stop detection along the turf (Fielder stops ball cleanly for 1, 2, 3+ runs)
      if (!ball.isAirborne && dist < 32 && ballSpeed < 10.5) {
        ball.isStoppedByFielder = true;
        ball.vx = 0;
        ball.vy = 0;
        f.isDiving = dist < 26;
        this.startThrowTracer(f.x, f.y, engine, f.role);
        return { type: 'STOP', fielder: f.role, distanceTraveled: ball.traveled };
      }
    }
    return null;
  }

  startThrowTracer(fromX, fromY, engine = null, fielderRole = 'Fielder') {
    if (this.throwTracer?.active) return;

    const cx = this.width / 2;
    const cy = this.height * 0.52;
    const stumpsY = engine?.stumpsY || (cy + this.height * 0.46 * 0.38 + 18);
    const bowlerStumpsY = engine?.bowlerStumpsY || (cy - this.height * 0.46 * 0.38 - 18);

    // Pick target stumps based on runner direction and closest threat
    let targetY = stumpsY;
    let targetEnd = 'keeper';

    if (engine?.running?.active) {
      if (engine.running.isCallingRun) {
        // Direct hit attempt at running batsman's approaching end!
        const isBowlerEnd = engine.running.direction === 1
          ? engine.running.progress < 0.5
          : engine.running.progress > 0.5;
        targetY = isBowlerEnd ? bowlerStumpsY : stumpsY;
        targetEnd = isBowlerEnd ? 'bowler' : 'keeper';
      } else {
        // Batsmen not running: return ball directly to Keeper (bottom) or Bowler (top)
        targetY = fromY > cy ? stumpsY : bowlerStumpsY;
        targetEnd = fromY > cy ? 'keeper' : 'bowler';
      }

      engine.running.throwActive = true;
      engine.running.throwProgress = 0;
      engine.running.throwFromX = fromX;
      engine.running.throwFromY = fromY;
      engine.running.throwTargetX = cx;
      engine.running.throwTargetY = targetY;
      engine.running.throwTargetEnd = targetEnd;
      engine.running.fielderRole = fielderRole;
    }

    this.throwTracer = {
      fromX,
      fromY,
      toX: cx,
      toY: targetY,
      targetEnd,
      progress: 0,
      active: true,
      fielderRole
    };
  }

  draw(ctx, jerseyColor = '#ef4444') {
    // Laser throw tracer with 2.5D flight arc from fielder to keeper/bowler/stumps
    if (this.throwTracer) {
      const { fromX, fromY, toX, toY, progress } = this.throwTracer;
      const currentX = fromX + (toX - fromX) * progress;
      const currentY = fromY + (toY - fromY) * progress;
      const throwArcH = Math.sin(progress * Math.PI) * 16;

      ctx.save();
      // Glowing throw trajectory
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ball shadow on ground
      ctx.beginPath();
      ctx.ellipse(currentX, currentY, 4.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fill();

      // Thrown ball in flight with arc
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(currentX, currentY - throwArcH, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    }

    // Render individual humanoid fielders
    this.fielders.forEach(f => {
      if (f.catchTimer > 0) {
        f.catchTimer--;
        if (f.catchTimer <= 0) f.isCatching = false;
      }
      CharacterRenderer.drawFielder(ctx, f.x, f.y, f.role, jerseyColor, f.isDiving, f.isCatching);
    });
  }

  getPrimaryChaser() {
    if (!this.primaryChaserId) return null;
    return this.fielders.find(f => f.id === this.primaryChaserId) || null;
  }
}

