// Dynamic AI Fielders for Top-Down Cricket with Authentic Zone Coverage & Diving Slides
import { CharacterRenderer } from './CharacterRenderer.js';

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
   * Fielders strictly observe pitch safety boundaries and never stand on or encroach upon the pitch strip.
   * Infielders are stationed strategically around the 30-yard ring,
   * while boundary sweepers protect the boundary perimeter with aggressive cutoff angles.
   */
  applyFieldPreset(preset = 'balanced', snap = false, isLeftHanded = false) {
    // Normalize tactical preset aliases (attacking, normal, defending)
    if (preset === 'normal') preset = 'balanced';
    if (preset === 'defending') preset = 'death_overs';
    this.currentPreset = preset;
    this.currentIsLeftHanded = isLeftHanded;
    const cx = this.width / 2;
    const cy = this.height * 0.52;
    const pitchH = this.height * 0.46;
    const batsmanY = cy + pitchH * 0.38;
    const br = this.boundaryRadius;
    const rx = this.innerCircleRadiusX || Math.round(br * 0.40);
    const ry = this.innerCircleRadiusY || Math.round(br * 0.44);

    // Pitch clearance keep-out zone (half pitch is ~58-68px; keep fielders at least 84px away from cx)
    const pitchClearance = Math.max(86, Math.round(this.width * 0.16) + 20);
    const pitchTop = cy - pitchH * 0.50 - 15;
    const pitchBottom = cy + pitchH * 0.50 + 15;

    // Helper to enforce that fielders NEVER stand on or cross the pitch corridor
    const clampOutsidePitch = (x, y) => {
      if (y >= pitchTop && y <= pitchBottom) {
        if (x <= cx) {
          return Math.min(x, cx - pitchClearance);
        } else {
          return Math.max(x, cx + pitchClearance);
        }
      }
      return x;
    };

    this.throwTracer = null;
    this.primaryChaserId = null;
    this.backupFielderId = null;

    let targetPlacements = [];

    if (preset === 'death_overs' || preset === 'defending') {
      // DEFENDING FIELD: 4 in ring cutting off singles, 5 deep boundary sweepers saving 4s and 6s
      targetPlacements = [
        { id: 'cover', role: 'Cover', x: cx - rx * 0.86, y: cy - ry * 0.15, speed: 3.2, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: cx - Math.max(pitchClearance + 20, rx * 0.40), y: cy - ry * 0.48, speed: 3.2, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: cx + Math.max(pitchClearance + 20, rx * 0.40), y: cy - ry * 0.48, speed: 3.2, zone: 'infield_ring' },
        { id: 'midwicket', role: 'Mid-Wkt', x: cx + rx * 0.82, y: cy - ry * 0.15, speed: 3.2, zone: 'infield_ring' },
        { id: 'deepcover', role: 'Deep Cover', x: cx - br * 0.82, y: cy - br * 0.35, speed: 3.8, zone: 'boundary' },
        { id: 'longoff', role: 'Long-Off', x: cx - br * 0.38, y: cy - br * 0.84, speed: 3.8, zone: 'boundary' },
        { id: 'longon', role: 'Long-On', x: cx + br * 0.38, y: cy - br * 0.84, speed: 3.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.78, y: cy - br * 0.42, speed: 3.8, zone: 'boundary' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: cx - br * 0.68, y: cy + br * 0.58, speed: 3.8, zone: 'boundary' }
      ];
    } else if (preset === 'attacking') {
      // ATTACKING FIELD: 1st Slip, 2nd Slip, Gully, ring catchers up saving singles
      targetPlacements = [
        { id: 'slip1', role: '1st Slip', x: cx - 44, y: batsmanY + 36, speed: 3.2, zone: 'slips' },
        { id: 'slip2', role: '2nd Slip', x: cx - 74, y: batsmanY + 44, speed: 3.2, zone: 'slips' },
        { id: 'gully', role: 'Gully', x: cx - rx * 0.76, y: batsmanY + 12, speed: 3.2, zone: 'infield_ring' },
        { id: 'cover', role: 'Cover', x: cx - rx * 0.86, y: cy - ry * 0.15, speed: 3.2, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: cx - Math.max(pitchClearance + 20, rx * 0.40), y: cy - ry * 0.48, speed: 3.2, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: cx + Math.max(pitchClearance + 20, rx * 0.40), y: cy - ry * 0.48, speed: 3.2, zone: 'infield_ring' },
        { id: 'shortmidwicket', role: 'Short Mid-Wkt', x: cx + Math.max(pitchClearance + 30, rx * 0.60), y: cy - ry * 0.10, speed: 3.2, zone: 'infield_ring' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: cx - br * 0.68, y: cy + br * 0.58, speed: 3.8, zone: 'boundary' },
        { id: 'fineleg', role: 'Deep Fine Leg', x: cx + br * 0.68, y: cy + br * 0.58, speed: 3.8, zone: 'boundary' }
      ];
    } else if (preset === 'offside_defensive') {
      // Packed off-side ring & boundary: Point, Cover, Mid-Off, 5 boundary riders
      targetPlacements = [
        { id: 'point', role: 'Point', x: cx - rx * 0.94, y: batsmanY - 10, speed: 3.2, zone: 'infield_ring' },
        { id: 'cover', role: 'Cover', x: cx - rx * 0.86, y: cy - ry * 0.15, speed: 3.2, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: cx - Math.max(pitchClearance + 20, rx * 0.40), y: cy - ry * 0.48, speed: 3.2, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: cx + Math.max(pitchClearance + 20, rx * 0.40), y: cy - ry * 0.48, speed: 3.2, zone: 'infield_ring' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: cx - br * 0.68, y: cy + br * 0.58, speed: 3.8, zone: 'boundary' },
        { id: 'deeppoint', role: 'Deep Point', x: cx - br * 0.88, y: cy + br * 0.08, speed: 3.8, zone: 'boundary' },
        { id: 'deepcover', role: 'Deep Cover', x: cx - br * 0.82, y: cy - br * 0.35, speed: 3.8, zone: 'boundary' },
        { id: 'longoff', role: 'Long-Off', x: cx - br * 0.38, y: cy - br * 0.84, speed: 3.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.78, y: cy - br * 0.42, speed: 3.8, zone: 'boundary' }
      ];
    } else if (preset === 'legside_defensive') {
      // Leg-side trap: Cover, Mid-Off, Mid-On, Square Leg + 5 deep boundary riders
      targetPlacements = [
        { id: 'cover', role: 'Cover', x: cx - rx * 0.86, y: cy - ry * 0.15, speed: 3.2, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: cx - Math.max(pitchClearance + 20, rx * 0.40), y: cy - ry * 0.48, speed: 3.2, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: cx + Math.max(pitchClearance + 20, rx * 0.40), y: cy - ry * 0.48, speed: 3.2, zone: 'infield_ring' },
        { id: 'sqleg', role: 'Square Leg', x: cx + rx * 0.90, y: batsmanY - 10, speed: 3.2, zone: 'infield_ring' },
        { id: 'longon', role: 'Long-On', x: cx + br * 0.38, y: cy - br * 0.84, speed: 3.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.78, y: cy - br * 0.42, speed: 3.8, zone: 'boundary' },
        { id: 'deepsqleg', role: 'Deep Sq Leg', x: cx + br * 0.88, y: cy + br * 0.08, speed: 3.8, zone: 'boundary' },
        { id: 'fineleg', role: 'Fine Leg', x: cx + br * 0.68, y: cy + br * 0.58, speed: 3.8, zone: 'boundary' },
        { id: 'deepcover', role: 'Deep Cover', x: cx - br * 0.82, y: cy - br * 0.35, speed: 3.8, zone: 'boundary' }
      ];
    } else if (preset === 'powerplay') {
      // POWERPLAY: 2 outside 30y ring, 7 inside ring / slips attacking
      targetPlacements = [
        { id: 'slip1', role: '1st Slip', x: cx - 44, y: batsmanY + 36, speed: 3.2, zone: 'slips' },
        { id: 'gully', role: 'Gully', x: cx - rx * 0.76, y: batsmanY + 12, speed: 3.2, zone: 'infield_ring' },
        { id: 'point', role: 'Point', x: cx - rx * 0.94, y: batsmanY - 10, speed: 3.2, zone: 'infield_ring' },
        { id: 'cover', role: 'Cover', x: cx - rx * 0.86, y: cy - ry * 0.15, speed: 3.2, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: cx - Math.max(pitchClearance + 20, rx * 0.40), y: cy - ry * 0.48, speed: 3.2, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: cx + Math.max(pitchClearance + 20, rx * 0.40), y: cy - ry * 0.48, speed: 3.2, zone: 'infield_ring' },
        { id: 'midwicket', role: 'Mid-Wkt', x: cx + rx * 0.82, y: cy - ry * 0.15, speed: 3.2, zone: 'infield_ring' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: cx - br * 0.68, y: cy + br * 0.58, speed: 3.8, zone: 'boundary' },
        { id: 'deepsqleg', role: 'Deep Sq Leg', x: cx + br * 0.88, y: cy + br * 0.08, speed: 3.8, zone: 'boundary' }
      ];
    } else {
      // Balanced Standard Cricket Field: 4 in ring, 5 deep on boundary
      targetPlacements = [
        { id: 'cover', role: 'Cover', x: cx - rx * 0.86, y: cy - ry * 0.15, speed: 3.2, zone: 'infield_ring' },
        { id: 'midoff', role: 'Mid-Off', x: cx - Math.max(pitchClearance + 20, rx * 0.40), y: cy - ry * 0.48, speed: 3.2, zone: 'infield_ring' },
        { id: 'midon', role: 'Mid-On', x: cx + Math.max(pitchClearance + 20, rx * 0.40), y: cy - ry * 0.48, speed: 3.2, zone: 'infield_ring' },
        { id: 'sqleg', role: 'Square Leg', x: cx + rx * 0.90, y: batsmanY - 10, speed: 3.2, zone: 'infield_ring' },
        { id: 'deeppoint', role: 'Deep Point', x: cx - br * 0.88, y: cy + br * 0.08, speed: 3.8, zone: 'boundary' },
        { id: 'longoff', role: 'Deep Long-Off', x: cx - br * 0.38, y: cy - br * 0.84, speed: 3.8, zone: 'boundary' },
        { id: 'longon', role: 'Deep Long-On', x: cx + br * 0.38, y: cy - br * 0.84, speed: 3.8, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.78, y: cy - br * 0.42, speed: 3.8, zone: 'boundary' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: cx - br * 0.68, y: cy + br * 0.58, speed: 3.8, zone: 'boundary' }
      ];
    }

    // Strictly enforce pitch keep-out boundary on all positions
    targetPlacements.forEach(t => {
      t.x = clampOutsidePitch(t.x, t.y);
    });

    // Mirror laterally for Left-Handed Batsman
    if (isLeftHanded) {
      targetPlacements.forEach(t => {
        t.x = cx - (t.x - cx);
        t.x = clampOutsidePitch(t.x, t.y);
      });
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
      const tracerRate = Math.max(0.014, Math.min(0.028, 3.2 / Math.max(80, throwDist)));
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

    const cx = this.width / 2;
    const cy = this.height * 0.52;
    const pitchH = this.height * 0.46;
    const pitchClearance = Math.max(86, ((engine?.pitchWidth || 116) / 2) + 24);
    const pitchTop = (engine?.pitchTop || (cy - pitchH * 0.50)) - 15;
    const pitchBottom = (engine?.pitchBottom || (cy + pitchH * 0.50)) + 15;

    // Helper: keep fielders off the pitch strip
    const clampOutsidePitch = (x, y) => {
      if (y >= pitchTop && y <= pitchBottom) {
        if (x <= cx) {
          return Math.min(x, cx - pitchClearance);
        } else {
          return Math.max(x, cx + pitchClearance);
        }
      }
      return x;
    };

    if (!ball || ball.state !== 'HIT') {
      this.primaryChaserId = null;
      this.backupFielderId = null;

      // Active pre-delivery stance: infielders walk in with bowler, outfielders ready-hop!
      const isDelivering = ball && (ball.state === 'RUN_UP' || ball.state === 'BOWLED');
      const walkInFactor = isDelivering ? Math.min(1.0, (engine?.bowler?.runUpProgress || 0.45)) : 0;

      this.fielders.forEach(f => {
        f.isDiving = false;
        if (isDelivering) {
          f.isFielding = true;
          if (f.zone === 'infield_ring' || f.zone === 'slips' || f.zone === 'gully') {
            // Infielders walk in 10-14px forward towards batsman crease, STRICTLY outside pitch corridor!
            const targetX = f.homeX; // Maintain lateral distance, never wander sideways onto pitch
            const targetY = f.homeY + 12 * walkInFactor;
            const safeX = clampOutsidePitch(targetX, targetY);
            f.x += (safeX - f.x) * 0.12;
            f.y += (targetY - f.y) * 0.12;
            f.vx = (safeX - f.x) * 0.5;
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
          // Dead ball / intermission: return smoothly to home stations (always outside pitch)
          f.isFielding = false;
          f.vx *= 0.82;
          f.vy *= 0.82;
          const safeHomeX = clampOutsidePitch(f.homeX, f.homeY);
          f.x += (safeHomeX - f.x) * 0.06 + f.vx;
          f.y += (f.homeY - f.y) * 0.06 + f.vy;
          f.x = clampOutsidePitch(f.x, f.y);
        }
      });
      return;
    }

    const ballSpeed = Math.hypot(ball.vx || 0, ball.vy || 0);
    const ballDistFromCenter = Math.hypot(ball.x - cx, ball.y - cy);
    const br = this.boundaryRadius;
    const rx = this.innerCircleRadiusX || Math.round(br * 0.40);
    const ballAngle = Math.atan2(ball.y - cy, ball.x - cx);

    // 1. Dynamic continuous selection of Primary Chaser (boundary sweepers prioritized for deep hits!)
    let bestFielder = null;
    let minScore = Infinity;

    this.fielders.forEach(f => {
      const dist = Math.hypot(ball.x - f.x, ball.y - f.y);
      const distToRope = Math.max(10, br - ballDistFromCenter);
      const framesToRope = distToRope / Math.max(1.8, ballSpeed);
      const leadFrames = Math.max(8, Math.min(framesToRope, dist / 4.2));
      const predBallX = ball.x + (ball.vx || 0) * leadFrames;
      const predBallY = ball.y + (ball.vy || 0) * leadFrames;
      const predDist = Math.hypot(predBallX - f.x, predBallY - f.y);

      let score = dist * 0.35 + predDist * 0.65;
      // If ball is heading to outfield, boundary sweepers get top priority!
      if ((ballDistFromCenter > rx * 0.60 || ballSpeed > 5.0) && f.zone === 'boundary') {
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

    // 2. Athletic, Multi-Fielder Dynamic Cutoff Movement for Boundary Protection
    this.fielders.forEach(f => {
      const isPrimary = f.id === this.primaryChaserId;
      const distToBall = Math.hypot(ball.x - f.x, ball.y - f.y);
      const fAngle = Math.atan2(f.y - cy, f.x - cx);
      let aDiff = Math.abs(ballAngle - fAngle);
      if (aDiff > Math.PI) aDiff = 2 * Math.PI - aDiff;
      const inSector = aDiff < 1.45; // Within ~85° of the ball's direction

      f.isFielding = true;

      if (isPrimary) {
        // Primary chaser calculates dynamic intercept point to cut off boundary
        const distToRope = Math.max(5, br - ballDistFromCenter);
        const framesToRope = distToRope / Math.max(1.8, ballSpeed);
        const lead = Math.max(6, Math.min(framesToRope, distToBall / 4.0));
        let targetX = ball.x + (ball.vx || 0) * lead;
        let targetY = ball.y + (ball.vy || 0) * lead;

        // If predicted intercept is near or outside boundary rope, station cutoff right on rope inside
        const targetDist = Math.hypot(targetX - cx, targetY - cy);
        if (targetDist > br - 18) {
          const bAngle = Math.atan2(targetY - cy, targetX - cx);
          targetX = cx + Math.cos(bAngle) * (br - 18);
          targetY = cy + Math.sin(bAngle) * (br - 18);
        }

        const dx = targetX - f.x;
        const dy = targetY - f.y;
        const d = Math.hypot(dx, dy) || 1;

        // Athletic sprint pace: scales up to 6.2 px/f when ball is hit hard to boundary!
        const baseSprint = Math.max(4.6, Math.min(6.2, 3.8 + ballSpeed * 0.32));

        // Diving slide trigger: athletic slide when within reach of rolling ball
        const nearRope = Math.hypot(f.x - cx, f.y - cy) > br * 0.72 || distToRope < 75;
        const diveReach = nearRope ? 46 : 34;
        if (distToBall < diveReach && distToBall > 6 && ballSpeed > 1.6 && !ball.isAirborne) {
          f.isDiving = true;
        }

        const moveSpeed = f.isDiving ? (baseSprint * 1.25) : baseSprint;
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
        // Supporting outfielders in sector sprint on a cutoff angle to back up
        const distToRope = Math.max(5, br - ballDistFromCenter);
        const framesToRope = distToRope / Math.max(1.8, ballSpeed);
        const lead = Math.max(10, Math.min(framesToRope, distToBall / 3.6));
        let targetX = ball.x + (ball.vx || 0) * lead;
        let targetY = ball.y + (ball.vy || 0) * lead;

        const targetDist = Math.hypot(targetX - cx, targetY - cy);
        if (targetDist > br - 18) {
          const bAngle = Math.atan2(targetY - cy, targetX - cx);
          targetX = cx + Math.cos(bAngle) * (br - 18);
          targetY = cy + Math.sin(bAngle) * (br - 18);
        }

        const dx = targetX - f.x;
        const dy = targetY - f.y;
        const d = Math.hypot(dx, dy) || 1;
        const sweeperSpeed = Math.max(4.2, Math.min(5.5, 3.4 + ballSpeed * 0.26));

        if (d > 10) {
          f.vx = (dx / d) * sweeperSpeed;
          f.vy = (dy / d) * sweeperSpeed;
        } else {
          f.vx *= 0.6;
          f.vy *= 0.6;
        }
        f.x += f.vx;
        f.y += f.vy;
      } else if (f.zone !== 'boundary' && inSector) {
        // Infielders in sector pursue ball aggressively
        const dx = ball.x - f.x;
        const dy = ball.y - f.y;
        const d = Math.hypot(dx, dy) || 1;
        const infielderSpeed = Math.max(3.8, Math.min(4.8, 3.2 + ballSpeed * 0.22));
        f.vx = (dx / d) * infielderSpeed;
        f.vy = (dy / d) * infielderSpeed;
        f.x += f.vx;
        f.y += f.vy;
        f.x = clampOutsidePitch(f.x, f.y);
      } else {
        // Fielders on opposite side run in to BACK UP THE STUMPS (well clear of the pitch strip!)
        const targetStumpsY = (ball.y < cy) ? (cy + 60) : (cy - 60);
        const backupTargetX = cx + (f.x > cx ? (pitchClearance + 20) : -(pitchClearance + 20));
        const backupTargetY = targetStumpsY;

        const dx = backupTargetX - f.x;
        const dy = backupTargetY - f.y;
        const d = Math.hypot(dx, dy) || 1;

        if (d > 20) {
          f.vx = (dx / d) * 3.2;
          f.vy = (dy / d) * 3.2;
        } else {
          f.vx *= 0.7;
          f.vy *= 0.7;
        }
        f.x += f.vx;
        f.y += f.vy;
        f.x = clampOutsidePitch(f.x, f.y);
      }
    });

    // Realistic field pickup: if ball is rolling and fielder reaches close reach
    if (ball && ball.state === 'HIT' && !ball.isAirborne && !ball.isStoppedByFielder && !this.throwTracer && !engine?.running?.throwActive) {
      for (let f of this.fielders) {
        const d = Math.hypot(f.x - ball.x, f.y - ball.y);
        const reach = f.isDiving ? 32 : 22;
        if (d < reach && ballSpeed < 6.0) {
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
    const cx = this.width / 2;
    const cy = this.height * 0.52;
    const br = this.boundaryRadius;

    for (let f of this.fielders) {
      const dist = Math.hypot(ball.x - f.x, ball.y - f.y);

      // 1. Catch detection (Airborne ball at catchable height)
      const catchReach = f.isDiving ? 32 : 22;
      if (ball.isAirborne && ball.height < 28 && dist < catchReach) {
        ball.isStoppedByFielder = true;
        ball.vx = 0;
        ball.vy = 0;
        f.isDiving = true;
        f.isCatching = true;
        f.catchTimer = 90;
        this.startThrowTracer(f.x, f.y, engine, f.role);
        return { type: 'CATCH', fielder: f.role };
      }

      // 2. Ground stop & boundary save detection along the turf
      if (!ball.isAirborne) {
        const reach = f.isDiving ? 34 : 22;
        // Stops high speed balls up to 10.5 px/f when fielder reaches the ball
        if (dist < reach && ballSpeed < 10.5) {
          ball.isStoppedByFielder = true;
          ball.vx = 0;
          ball.vy = 0;

          const ballDistFromCenter = Math.hypot(ball.x - cx, ball.y - cy);
          const isBoundarySave = (br - ballDistFromCenter) < 70;

          // If sliding near boundary rope, pull the ball cleanly inside the boundary
          if (ballDistFromCenter > br - 14) {
            const bAngle = Math.atan2(ball.y - cy, ball.x - cx);
            ball.x = cx + Math.cos(bAngle) * (br - 16);
            ball.y = cy + Math.sin(bAngle) * (br - 16);
          }

          f.isDiving = true;
          this.startThrowTracer(f.x, f.y, engine, f.role);
          return {
            type: 'STOP',
            fielder: f.role,
            isBoundarySave,
            distanceTraveled: ball.traveled
          };
        }
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

  draw(ctx, jerseyColor = '#ef4444', timeOfDay = 'day') {
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
      CharacterRenderer.drawFielder(ctx, f.x, f.y, f.role, jerseyColor, f.isDiving, f.isCatching, f.vx, f.vy, f.isFielding, typeof jerseyColor === 'object' ? jerseyColor : null, timeOfDay);
    });
  }

  getPrimaryChaser() {
    if (!this.primaryChaserId) return null;
    return this.fielders.find(f => f.id === this.primaryChaserId) || null;
  }
}

