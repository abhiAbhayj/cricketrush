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

    const onBoundary = (angleRad, distRatio = 0.75) => ({
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
      const dLongOff = onBoundary(-1.95, 0.75);
      const dMidWkt = onBoundary(-0.48, 0.75);
      const dFineLeg = onBoundary(0.85, 0.75);

      targetPlacements = [
        { id: 'midoff', role: 'Mid-Off', x: mOff.x, y: mOff.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: mOn.x, y: mOn.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'cover', role: 'Extra Cover', x: cov.x, y: cov.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'point', role: 'Backward Point', x: pt.x, y: pt.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'midwicket', role: 'Mid-Wicket', x: mWkt.x, y: mWkt.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'sqleg', role: 'Square Leg', x: sqL.x, y: sqL.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'longoff', role: 'Deep Long-Off', x: dLongOff.x, y: dLongOff.y, speed: 2.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: dMidWkt.x, y: dMidWkt.y, speed: 2.8, zone: 'boundary' },
        { id: 'fineleg', role: 'Deep Fine Leg', x: dFineLeg.x, y: dFineLeg.y, speed: 2.8, zone: 'boundary' }
      ];
    } else if (preset === 'death_overs') {
      // DEATH OVERS: Exactly 4 Fielders ON the 30-Yard Circle Line, 5 deep on 80m boundary
      const cov = onCircle(-2.55);
      const mOff = onCircle(-1.95);
      const mOn = onCircle(-1.19);
      const sqL = onCircle(0.25);
      const dCov = onBoundary(-2.55, 0.75);
      const dLongOff = onBoundary(-1.95, 0.75);
      const dLongOn = onBoundary(-1.19, 0.75);
      const dMidWkt = onBoundary(-0.48, 0.75);
      const dThirdMan = onBoundary(2.35, 0.75);

      targetPlacements = [
        { id: 'cover', role: 'Cover', x: cov.x, y: cov.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: mOff.x, y: mOff.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: mOn.x, y: mOn.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'sqleg', role: 'Square Leg', x: sqL.x, y: sqL.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'deepcover', role: 'Deep Extra Cover', x: dCov.x, y: dCov.y, speed: 2.8, zone: 'boundary' },
        { id: 'longoff', role: 'Long-Off', x: dLongOff.x, y: dLongOff.y, speed: 2.8, zone: 'boundary' },
        { id: 'longon', role: 'Long-On', x: dLongOn.x, y: dLongOn.y, speed: 2.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: dMidWkt.x, y: dMidWkt.y, speed: 2.8, zone: 'boundary' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: dThirdMan.x, y: dThirdMan.y, speed: 2.8, zone: 'boundary' }
      ];
    } else if (preset === 'attacking') {
      // Aggressive wicket-taking field: 2 Slips & Gully close, 3 on 30-Yard Circle Line, 3 deep on boundary
      const cov = onCircle(-2.55);
      const mOff = onCircle(-1.95);
      const mOn = onCircle(-1.19);
      const dThirdMan = onBoundary(2.35, 0.75);
      const dMidWkt = onBoundary(-0.48, 0.75);
      const dFineLeg = onBoundary(0.85, 0.75);

      targetPlacements = [
        { id: 'slip1', role: '1st Slip', x: cx - 40, y: batsmanY + 36, speed: 2.4, zone: 'slips' },
        { id: 'slip2', role: '2nd Slip', x: cx - 68, y: batsmanY + 44, speed: 2.4, zone: 'slips' },
        { id: 'gully', role: 'Gully', x: cx - 110, y: batsmanY + 20, speed: 2.4, zone: 'gully' },
        { id: 'cover', role: 'Cover', x: cov.x, y: cov.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: mOff.x, y: mOff.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: mOn.x, y: mOn.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: dThirdMan.x, y: dThirdMan.y, speed: 2.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: dMidWkt.x, y: dMidWkt.y, speed: 2.8, zone: 'boundary' },
        { id: 'fineleg', role: 'Deep Fine Leg', x: dFineLeg.x, y: dFineLeg.y, speed: 2.8, zone: 'boundary' }
      ];
    } else if (preset === 'offside_defensive') {
      // Packed off-side ring: 4 on 30-yard circle line, 5 on 80m boundary
      const mOff = onCircle(-1.95);
      const mOn = onCircle(-1.19);
      const mWkt = onCircle(-0.48);
      const sqL = onCircle(0.25);
      const dThirdMan = onBoundary(2.35, 0.75);
      const dPoint = onBoundary(2.95, 0.75);
      const dCover = onBoundary(-2.55, 0.75);
      const dLongOff = onBoundary(-1.95, 0.75);
      const dMidWkt = onBoundary(-0.48, 0.75);

      targetPlacements = [
        { id: 'midoff', role: 'Mid-Off', x: mOff.x, y: mOff.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: mOn.x, y: mOn.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'midwicket', role: 'Mid-Wicket', x: mWkt.x, y: mWkt.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'sqleg', role: 'Square Leg', x: sqL.x, y: sqL.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: dThirdMan.x, y: dThirdMan.y, speed: 2.8, zone: 'boundary' },
        { id: 'point', role: 'Deep Point', x: dPoint.x, y: dPoint.y, speed: 2.8, zone: 'boundary' },
        { id: 'deepcover', role: 'Deep Cover', x: dCover.x, y: dCover.y, speed: 2.8, zone: 'boundary' },
        { id: 'longoff', role: 'Long-Off', x: dLongOff.x, y: dLongOff.y, speed: 2.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: dMidWkt.x, y: dMidWkt.y, speed: 2.8, zone: 'boundary' }
      ];
    } else if (preset === 'legside_defensive') {
      // Leg-side trap: 4 on 30-yard circle line, 5 on 80m boundary
      const pt = onCircle(2.88);
      const cov = onCircle(-2.55);
      const mOff = onCircle(-1.95);
      const mOn = onCircle(-1.19);
      const dLongOn = onBoundary(-1.19, 0.75);
      const dMidWkt = onBoundary(-0.48, 0.75);
      const dSqLeg = onBoundary(0.35, 0.75);
      const dFineLeg = onBoundary(0.85, 0.75);
      const dCover = onBoundary(-2.55, 0.75);

      targetPlacements = [
        { id: 'point', role: 'Point', x: pt.x, y: pt.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'cover', role: 'Cover', x: cov.x, y: cov.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: mOff.x, y: mOff.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: mOn.x, y: mOn.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'longon', role: 'Long-On', x: dLongOn.x, y: dLongOn.y, speed: 2.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: dMidWkt.x, y: dMidWkt.y, speed: 2.8, zone: 'boundary' },
        { id: 'deepsqleg', role: 'Deep Sq Leg', x: dSqLeg.x, y: dSqLeg.y, speed: 2.8, zone: 'boundary' },
        { id: 'fineleg', role: 'Fine Leg', x: dFineLeg.x, y: dFineLeg.y, speed: 2.8, zone: 'boundary' },
        { id: 'deepcover', role: 'Deep Cover', x: dCover.x, y: dCover.y, speed: 2.8, zone: 'boundary' }
      ];
    } else {
      // Balanced Standard Cricket Field: 4 ON 30-Yard Circle Line, 5 deep on 80m boundary
      const cov = onCircle(-2.55);
      const mOff = onCircle(-1.95);
      const mOn = onCircle(-1.19);
      const sqL = onCircle(0.25);
      const dPt = onBoundary(2.95, 0.75);
      const dLongOff = onBoundary(-1.95, 0.75);
      const dLongOn = onBoundary(-1.19, 0.75);
      const dMidWkt = onBoundary(-0.48, 0.75);
      const dThirdMan = onBoundary(2.35, 0.75);

      targetPlacements = [
        { id: 'cover', role: 'Cover', x: cov.x, y: cov.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: mOff.x, y: mOff.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: mOn.x, y: mOn.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'sqleg', role: 'Square Leg', x: sqL.x, y: sqL.y, speed: 2.4, zone: 'infield_ring' },
        { id: 'deeppoint', role: 'Deep Point', x: dPt.x, y: dPt.y, speed: 2.8, zone: 'boundary' },
        { id: 'longoff', role: 'Deep Long-Off', x: dLongOff.x, y: dLongOff.y, speed: 2.8, zone: 'boundary' },
        { id: 'longon', role: 'Deep Long-On', x: dLongOn.x, y: dLongOn.y, speed: 2.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: dMidWkt.x, y: dMidWkt.y, speed: 2.8, zone: 'boundary' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: dThirdMan.x, y: dThirdMan.y, speed: 2.8, zone: 'boundary' }
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
      const throwDist = Math.hypot(this.throwTracer.toX - this.throwTracer.fromX, this.throwTracer.toY - this.throwTracer.fromY);
      const tracerRate = Math.max(0.012, Math.min(0.024, 2.8 / Math.max(80, throwDist)));
      this.throwTracer.progress += tracerRate * dt;
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
      this.primaryChaserId = null;
      this.backupFielderId = null;

      // Active pre-delivery stance: infielders walk in with bowler, outfielders ready-hop!
      const isDelivering = ball && (ball.state === 'RUN_UP' || ball.state === 'BOWLED');
      const cx = this.width / 2;
      const cy = this.height * 0.52;
      const walkInFactor = isDelivering ? Math.min(1.0, (engine?.bowler?.runUpProgress || 0.45)) : 0;

      this.fielders.forEach(f => {
        f.isDiving = false;
        if (isDelivering) {
          f.isFielding = true;
          if (f.zone === 'infield_ring' || f.zone === 'slips' || f.zone === 'gully') {
            // Infielders walk in 10-14px towards pitch with the bowler
            const walkDist = 12 * walkInFactor;
            const targetX = f.homeX + (cx - f.homeX) * 0.05 * walkInFactor;
            const targetY = f.homeY + (cy - f.homeY) * 0.08 * walkInFactor;
            f.x += (targetX - f.x) * 0.12;
            f.y += (targetY - f.y) * 0.12;
            f.vx = (targetX - f.x) * 0.5;
            f.vy = (targetY - f.y) * 0.5;
          } else {
            // Outfielders ready stance on their toes with subtle athletic bobbing
            const bobX = Math.sin(Date.now() * 0.005 + f.homeX) * 0.4;
            const bobY = Math.cos(Date.now() * 0.005 + f.homeY) * 0.3;
            f.x += (f.homeX + bobX - f.x) * 0.08;
            f.y += (f.homeY + bobY - f.y) * 0.08;
            f.vx = bobX;
            f.vy = bobY;
          }
        } else {
          // Dead ball / intermission: return smoothly to home stations
          f.isFielding = false;
          f.vx *= 0.82;
          f.vy *= 0.82;
          f.x += (f.homeX - f.x) * 0.06 + f.vx;
          f.y += (f.homeY - f.y) * 0.06 + f.vy;
        }
      });
      return;
    }

    const ballSpeed = Math.hypot(ball.vx || 0, ball.vy || 0);
    const cx = this.width / 2;
    const cy = this.height * 0.52;
    const ballDistFromCenter = Math.hypot(ball.x - cx, ball.y - cy);
    const rx = this.innerCircleRadiusX || Math.round(this.boundaryRadius * 0.36);
    const ballAngle = Math.atan2(ball.y - cy, ball.x - cx);

    // 1. Dynamic continuous selection of Primary Chaser (outfielders prioritized for outfield hits!)
    let bestFielder = null;
    let minScore = Infinity;

    this.fielders.forEach(f => {
      const dist = Math.hypot(ball.x - f.x, ball.y - f.y);
      const predBallX = ball.x + (ball.vx || 0) * 14;
      const predBallY = ball.y + (ball.vy || 0) * 14;
      const predDist = Math.hypot(predBallX - f.x, predBallY - f.y);

      let score = dist * 0.45 + predDist * 0.55;
      // If ball is crossing 30-yard circle or heading to outfield, boundary sweepers get top priority!
      if (ballDistFromCenter > rx * 0.70 && f.zone === 'boundary') {
        score *= 0.38;
      }
      if (score < minScore) {
        minScore = score;
        bestFielder = f;
      }
    });

    if (bestFielder) {
      this.primaryChaserId = bestFielder.id;
    }

    // 2. Active, Multi-Fielder Dynamic Outfield Movement for EVERY Fielder!
    this.fielders.forEach(f => {
      const isPrimary = f.id === this.primaryChaserId;
      const distToBall = Math.hypot(ball.x - f.x, ball.y - f.y);
      const fAngle = Math.atan2(f.y - cy, f.x - cx);
      let aDiff = Math.abs(ballAngle - fAngle);
      if (aDiff > Math.PI) aDiff = 2 * Math.PI - aDiff;
      const inSector = aDiff < 1.40; // Within ~80° of the ball's direction

      f.isFielding = true;

      if (isPrimary) {
        // Primary chaser sprints at maximum speed to intercept the ball
        const predX = ball.x + (ball.vx || 0) * 8;
        const predY = ball.y + (ball.vy || 0) * 8;
        const dx = predX - f.x;
        const dy = predY - f.y;
        const d = Math.hypot(dx, dy) || 1;

        // Diving slide trigger when within grasping reach of fast moving ball
        if (distToBall < 30 && distToBall > 8 && ballSpeed > 2.5 && !ball.isAirborne) {
          f.isDiving = true;
        }

        const moveSpeed = f.isDiving ? (f.speed * 1.18) : (f.speed * 1.06);
        if (distToBall > 4) {
          f.vx = (dx / d) * moveSpeed;
          f.vy = (dy / d) * moveSpeed;
        } else {
          f.vx *= 0.5;
          f.vy *= 0.5;
        }
        f.x += f.vx;
        f.y += f.vy;
      } else if (f.zone === 'boundary' && inSector) {
        // ALL Outfielders in the active sector sprint to cut off boundary angles!
        const predX = ball.x + (ball.vx || 0) * 16;
        const predY = ball.y + (ball.vy || 0) * 16;
        const dx = predX - f.x;
        const dy = predY - f.y;
        const d = Math.hypot(dx, dy) || 1;

        if (d > 12) {
          f.vx = (dx / d) * (f.speed * 1.04);
          f.vy = (dy / d) * (f.speed * 1.04);
        } else {
          f.vx *= 0.6;
          f.vy *= 0.6;
        }
        f.x += f.vx;
        f.y += f.vy;
      } else if (f.zone !== 'boundary' && inSector) {
        // Infielders in sector: if ball has cleared 30y ring, turn and pursue!
        if (ballDistFromCenter > rx * 0.75) {
          const dx = ball.x - f.x;
          const dy = ball.y - f.y;
          const d = Math.hypot(dx, dy) || 1;
          f.vx = (dx / d) * (f.speed * 0.95);
          f.vy = (dy / d) * (f.speed * 0.95);
        } else {
          // Ball in ring: converge to intercept
          const dx = ball.x - f.x;
          const dy = ball.y - f.y;
          const d = Math.hypot(dx, dy) || 1;
          f.vx = (dx / d) * (f.speed * 1.02);
          f.vy = (dy / d) * (f.speed * 1.02);
        }
        f.x += f.vx;
        f.y += f.vy;
      } else {
        // Fielders on opposite side of ground run in towards pitch to BACK UP THE STUMPS!
        const targetStumpsY = (ball.y < cy) ? (cy + 60) : (cy - 60);
        const backupTargetX = cx + (f.x > cx ? 35 : -35);
        const backupTargetY = targetStumpsY;

        const dx = backupTargetX - f.x;
        const dy = backupTargetY - f.y;
        const d = Math.hypot(dx, dy) || 1;

        if (d > 25) {
          f.vx = (dx / d) * (f.speed * 0.82);
          f.vy = (dy / d) * (f.speed * 0.82);
        } else {
          f.vx *= 0.7;
          f.vy *= 0.7;
        }
        f.x += f.vx;
        f.y += f.vy;
      }
    });

    // Realistic field pickup: if ball has slowed down on turf and fielder reaches close reach
    if (ball && ball.state === 'HIT' && !ball.isAirborne && !ball.isStoppedByFielder && !this.throwTracer && !engine?.running?.throwActive) {
      for (let f of this.fielders) {
        const d = Math.hypot(f.x - ball.x, f.y - ball.y);
        if (d < 18 && ballSpeed < 3.2) {
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
      if (ball.isAirborne && ball.height < 24 && dist < 20) {
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
      if (!ball.isAirborne && dist < 18 && ballSpeed < 4.5) {
        ball.isStoppedByFielder = true;
        ball.vx = 0;
        ball.vy = 0;
        f.isDiving = dist < 15;
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
      CharacterRenderer.drawFielder(ctx, f.x, f.y, f.role, jerseyColor, f.isDiving, f.isCatching, f.vx, f.vy, f.isFielding, typeof jerseyColor === 'object' ? jerseyColor : null);
    });
  }

  getPrimaryChaser() {
    if (!this.primaryChaserId) return null;
    return this.fielders.find(f => f.id === this.primaryChaserId) || null;
  }
}

