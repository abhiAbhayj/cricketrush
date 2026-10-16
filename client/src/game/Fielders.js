// Dynamic AI Fielders for Top-Down Cricket with Authentic Zone Coverage & Diving Slides
import { CharacterRenderer } from './CharacterRenderer';

export class FielderManager {
  constructor(canvasWidth, canvasHeight, boundaryRadius) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.boundaryRadius = boundaryRadius;
    this.fielders = [];
    this.throwTracer = null; // { fromX, fromY, toX, toY, progress }
    this.currentPreset = 'balanced';
    this.fieldNotice = null;
    this.resetPositions();
  }

  resize(canvasWidth, canvasHeight, boundaryRadius) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.boundaryRadius = boundaryRadius;
    this.applyFieldPreset(this.currentPreset || 'balanced', false);
  }

  resetPositions() {
    this.applyFieldPreset(this.currentPreset || 'balanced', true);
  }

  /**
   * Apply tactical cricket fielding presets with automatic positioning
   * Presets: 'balanced', 'attacking', 'offside_defensive', 'legside_defensive', 'boundary_defense'
   */
  applyFieldPreset(preset = 'balanced', snap = false) {
    this.currentPreset = preset;
    const cx = this.width / 2;
    const cy = this.height * 0.52;
    const pitchH = this.height * 0.46;
    const batsmanY = cy + pitchH * 0.38;
    const br = this.boundaryRadius;

    this.throwTracer = null;
    this.primaryChaserId = null;
    this.backupFielderId = null;

    let targetPlacements = [];

    if (preset === 'attacking') {
      // Aggressive wicket-taking field: 2 Slips in, Short Leg, Silly Point, Ring Up!
      targetPlacements = [
        { id: 'slip1', role: '1st Slip', x: cx - 28, y: batsmanY + 28, speed: 3.8, zone: 'slips' },
        { id: 'slip2', role: '2nd Slip', x: cx - 44, y: batsmanY + 34, speed: 3.8, zone: 'slips' },
        { id: 'gully', role: 'Gully', x: cx - 68, y: batsmanY + 20, speed: 3.9, zone: 'gully' },
        { id: 'sillypoint', role: 'Silly Point', x: cx - 45, y: batsmanY - 30, speed: 3.6, zone: 'sillypoint' },
        { id: 'cover', role: 'Short Cover', x: cx - br * 0.36, y: batsmanY - 80, speed: 3.8, zone: 'cover' },
        { id: 'midoff', role: 'Mid-Off', x: cx - 55, y: cy - 70, speed: 3.5, zone: 'midoff' },
        { id: 'midon', role: 'Mid-On', x: cx + 55, y: cy - 70, speed: 3.5, zone: 'midon' },
        { id: 'shortleg', role: 'Short Leg', x: cx + 38, y: batsmanY - 20, speed: 3.7, zone: 'shortleg' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.65, y: cy - br * 0.45, speed: 4.2, zone: 'deep_leg' }
      ];
    } else if (preset === 'offside_defensive') {
      // Packed off-side boundary ring: Deep Extra Cover back, Deep Point back, Third Man back
      targetPlacements = [
        { id: 'thirdman', role: 'Deep 3rd Man', x: cx - br * 0.58, y: batsmanY + br * 0.48, speed: 4.2, zone: 'thirdman' },
        { id: 'point', role: 'Deep Point', x: cx - br * 0.75, y: batsmanY - 20, speed: 4.0, zone: 'point' },
        { id: 'deepcover', role: 'Deep Cover', x: cx - br * 0.72, y: cy - br * 0.35, speed: 4.2, zone: 'cover' },
        { id: 'cover', role: 'Extra Cover', x: cx - br * 0.38, y: batsmanY - 90, speed: 3.7, zone: 'cover' },
        { id: 'midoff', role: 'Long-Off', x: cx - br * 0.60, y: cy - br * 0.65, speed: 4.1, zone: 'midoff' },
        { id: 'midon', role: 'Mid-On', x: cx + 65, y: cy - 75, speed: 3.5, zone: 'midon' },
        { id: 'midwicket', role: 'Mid-Wicket', x: cx + br * 0.42, y: batsmanY - 75, speed: 3.6, zone: 'midwicket' },
        { id: 'sqleg', role: 'Square Leg', x: cx + br * 0.50, y: batsmanY + 15, speed: 3.5, zone: 'sqleg' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.65, y: cy - br * 0.48, speed: 4.2, zone: 'deep_leg' }
      ];
    } else if (preset === 'legside_defensive') {
      // Leg-side trap: Deep Square Leg, Deep Mid-Wicket, Long-On back on rope!
      targetPlacements = [
        { id: 'slip', role: 'Slip', x: cx - 38, y: batsmanY + 30, speed: 3.5, zone: 'slips' },
        { id: 'point', role: 'Point', x: cx - br * 0.50, y: batsmanY - 15, speed: 3.6, zone: 'point' },
        { id: 'cover', role: 'Cover', x: cx - br * 0.42, y: batsmanY - 90, speed: 3.8, zone: 'cover' },
        { id: 'midoff', role: 'Mid-Off', x: cx - 65, y: cy - 75, speed: 3.4, zone: 'midoff' },
        { id: 'longon', role: 'Long-On', x: cx + br * 0.55, y: cy - br * 0.65, speed: 4.2, zone: 'longon' },
        { id: 'midwicket', role: 'Mid-Wicket', x: cx + br * 0.38, y: batsmanY - 75, speed: 3.6, zone: 'midwicket' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.72, y: cy - br * 0.38, speed: 4.3, zone: 'deep_leg' },
        { id: 'sqleg', role: 'Deep Sq Leg', x: cx + br * 0.70, y: batsmanY + 25, speed: 4.2, zone: 'deep_sqleg' },
        { id: 'fineleg', role: 'Short Fine Leg', x: cx + 45, y: batsmanY + 38, speed: 3.6, zone: 'fineleg' }
      ];
    } else {
      // Balanced Standard Cricket Field (Default)
      targetPlacements = [
        { id: 'slip', role: 'Slip', x: cx - 38, y: batsmanY + 32, speed: 3.4, zone: 'slips' },
        { id: 'point', role: 'Point', x: cx - br * 0.52, y: batsmanY - 15, speed: 3.6, zone: 'point' },
        { id: 'cover', role: 'Cover', x: cx - br * 0.44, y: batsmanY - 95, speed: 3.8, zone: 'cover' },
        { id: 'midoff', role: 'Mid-Off', x: cx - 65, y: cy - 75, speed: 3.4, zone: 'midoff' },
        { id: 'midon', role: 'Mid-On', x: cx + 65, y: cy - 75, speed: 3.4, zone: 'midon' },
        { id: 'midwicket', role: 'Mid-Wicket', x: cx + br * 0.46, y: batsmanY - 80, speed: 3.7, zone: 'midwicket' },
        { id: 'sqleg', role: 'Square Leg', x: cx + br * 0.52, y: batsmanY + 12, speed: 3.5, zone: 'sqleg' },
        { id: 'longoff', role: 'Deep Long-Off', x: cx - br * 0.65, y: cy - br * 0.62, speed: 4.2, zone: 'deep_off' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.68, y: cy - br * 0.52, speed: 4.2, zone: 'deep_leg' }
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

  update(ball) {
    if (this.throwTracer) {
      this.throwTracer.progress += 0.08;
      if (this.throwTracer.progress >= 1.0) {
        this.throwTracer = null;
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

    // 1. Select the SINGLE closest/best-positioned Primary Chaser
    if (!this.primaryChaserId) {
      let closestFielder = null;
      let minScore = Infinity;

      this.fielders.forEach(f => {
        const dx = ball.x - f.x;
        const dy = ball.y - f.y;
        const dist = Math.hypot(dx, dy);

        // Predict where ball is heading in next 15 frames
        const predBallX = ball.x + (ball.vx || 0) * 15;
        const predBallY = ball.y + (ball.vy || 0) * 15;
        const predDist = Math.hypot(predBallX - f.x, predBallY - f.y);

        const score = dist * 0.6 + predDist * 0.4;
        if (score < minScore) {
          minScore = score;
          closestFielder = f;
        }
      });

      if (closestFielder) {
        this.primaryChaserId = closestFielder.id;
        // Find secondary backup fielder (adjacent boundary sweeper)
        let backupFielder = null;
        let backupMinDist = Infinity;
        this.fielders.forEach(f => {
          if (f.id !== closestFielder.id) {
            const d = Math.hypot(f.x - closestFielder.x, f.y - closestFielder.y);
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
    }

    // 2. Intelligent, Sector-Bounded Movement (NO CLUMPING!)
    this.fielders.forEach(f => {
      const isPrimary = f.id === this.primaryChaserId;
      const isBackup = f.id === this.backupFielderId;

      if (isPrimary) {
        // Primary fielder sprints directly to intercept ball
        const dx = ball.x - f.x;
        const dy = ball.y - f.y;
        const dist = Math.hypot(dx, dy);

        // Diving slide trigger when within grasping reach of fast ball
        if (dist < 40 && dist > 14 && ballSpeed > 5 && !ball.isAirborne) {
          f.isDiving = true;
        }

        const moveSpeed = f.isDiving ? f.speed * 1.35 : f.speed;
        if (dist > 5) {
          f.vx = (dx / dist) * moveSpeed;
          f.vy = (dy / dist) * moveSpeed;
        } else {
          f.vx *= 0.5;
          f.vy *= 0.5;
        }
        f.x += f.vx;
        f.y += f.vy;
      } else if (isBackup) {
        // Backup fielder tracks to cut off boundary angle behind primary chaser
        const primary = this.fielders.find(p => p.id === this.primaryChaserId);
        const targetX = primary ? (ball.x + primary.x) / 2 : ball.x;
        const targetY = primary ? (ball.y + primary.y) / 2 : ball.y;

        const dx = targetX - f.x;
        const dy = targetY - f.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 35) {
          f.vx = (dx / dist) * (f.speed * 0.85);
          f.vy = (dy / dist) * (f.speed * 0.85);
        } else {
          f.vx *= 0.6;
          f.vy *= 0.6;
        }
        f.x += f.vx;
        f.y += f.vy;
      } else {
        // All other fielders hold defensive shape with subtle shift towards stumps to back up
        const cx = this.width / 2;
        const cy = this.height * 0.52;
        const targetX = f.homeX + (cx - f.homeX) * 0.15;
        const targetY = f.homeY + (cy - f.homeY) * 0.15;

        f.x += (targetX - f.x) * 0.03;
        f.y += (targetY - f.y) * 0.03;
      }
    });
  }

  checkFieldInterception(ball) {
    if (!ball || ball.state !== 'HIT') return null;

    const ballSpeed = Math.hypot(ball.vx || 0, ball.vy || 0);

    for (let f of this.fielders) {
      const dist = Math.hypot(ball.x - f.x, ball.y - f.y);

      // Catch detection (Airborne ball at catchable height)
      if (ball.isAirborne && ball.height < 24 && dist < 32) {
        f.isDiving = true;
        f.isCatching = true;
        f.catchTimer = 90;
        this.startThrowTracer(f.x, f.y);
        return { type: 'CATCH', fielder: f.role };
      }

      // Ground stop detection along the turf
      if (!ball.isAirborne && dist < 26 && ballSpeed < 14) {
        f.isDiving = dist < 22;
        this.startThrowTracer(f.x, f.y);
        return { type: 'STOP', fielder: f.role, distanceTraveled: ball.traveled };
      }
    }
    return null;
  }

  startThrowTracer(fromX, fromY) {
    const cx = this.width / 2;
    const cy = this.height * 0.52;
    const stumpsY = cy + this.height * 0.46 * 0.38 + 18;
    this.throwTracer = {
      fromX,
      fromY,
      toX: cx,
      toY: stumpsY,
      progress: 0
    };
  }

  draw(ctx, jerseyColor = '#ef4444') {
    // Laser throw tracer from fielder to stumps
    if (this.throwTracer) {
      const { fromX, fromY, toX, toY, progress } = this.throwTracer;
      const currentX = fromX + (toX - fromX) * progress;
      const currentY = fromY + (toY - fromY) * progress;

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

      // Airborne thrown ball
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 4.5, 0, Math.PI * 2);
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
}

