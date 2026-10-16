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

    if (preset === 'powerplay') {
      // POWERPLAY: Exactly 6 Fielders Inside 30-Yard Circle, 3 on Boundary (Wide Gaps)
      targetPlacements = [
        // 6 Infielders pushed out to 30-yard ring (leaving 120-210px gaps between fielders)
        { id: 'midoff', role: 'Mid-Off', x: cx - 105, y: cy - 165, speed: 2.4, zone: 'infield_straight' },
        { id: 'midon', role: 'Mid-On', x: cx + 105, y: cy - 165, speed: 2.4, zone: 'infield_straight' },
        { id: 'cover', role: 'Extra Cover', x: cx - 170, y: cy - 65, speed: 2.5, zone: 'infield_off' },
        { id: 'point', role: 'Backward Point', x: cx - 185, y: cy + 30, speed: 2.5, zone: 'infield_off' },
        { id: 'midwicket', role: 'Mid-Wicket', x: cx + 170, y: cy - 65, speed: 2.5, zone: 'infield_leg' },
        { id: 'sqleg', role: 'Square Leg', x: cx + 185, y: cy + 30, speed: 2.4, zone: 'infield_leg' },
        // 3 Outfielders deep on boundary rope
        { id: 'longoff', role: 'Deep Long-Off', x: cx - br * 0.52, y: cy - br * 0.72, speed: 2.7, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.76, y: cy - br * 0.38, speed: 2.7, zone: 'boundary' },
        { id: 'fineleg', role: 'Deep Fine Leg', x: cx + br * 0.65, y: batsmanY + br * 0.40, speed: 2.7, zone: 'boundary' }
      ];
    } else if (preset === 'death_overs') {
      // DEATH OVERS: Exactly 4 Fielders Inside 30-Yard Circle, 5 on Boundary (Wide Gaps)
      targetPlacements = [
        // 4 Infielders on 30-yard ring
        { id: 'cover', role: 'Cover', x: cx - 160, y: cy - 50, speed: 2.5, zone: 'infield_off' },
        { id: 'midoff', role: 'Mid-Off', x: cx - 95, y: cy - 160, speed: 2.4, zone: 'infield_straight' },
        { id: 'midon', role: 'Mid-On', x: cx + 95, y: cy - 160, speed: 2.4, zone: 'infield_straight' },
        { id: 'sqleg', role: 'Square Leg', x: cx + 175, y: cy + 25, speed: 2.4, zone: 'infield_leg' },
        // 5 Boundary sweepers protecting boundaries near the fence
        { id: 'deepcover', role: 'Deep Extra Cover', x: cx - br * 0.78, y: cy - br * 0.35, speed: 2.7, zone: 'boundary' },
        { id: 'longoff', role: 'Long-Off', x: cx - br * 0.50, y: cy - br * 0.72, speed: 2.7, zone: 'boundary' },
        { id: 'longon', role: 'Long-On', x: cx + br * 0.50, y: cy - br * 0.72, speed: 2.7, zone: 'boundary' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.78, y: cy - br * 0.35, speed: 2.7, zone: 'boundary' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: cx - br * 0.65, y: batsmanY + br * 0.40, speed: 2.7, zone: 'boundary' }
      ];
    } else if (preset === 'attacking') {
      // Aggressive wicket-taking field: 2 Slips, Gully, Cover, Mid-Off, Mid-On inside; 3 boundary
      targetPlacements = [
        { id: 'slip1', role: '1st Slip', x: cx - 42, y: batsmanY + 36, speed: 2.5, zone: 'slips' },
        { id: 'slip2', role: '2nd Slip', x: cx - 72, y: batsmanY + 44, speed: 2.5, zone: 'slips' },
        { id: 'gully', role: 'Gully', x: cx - 118, y: batsmanY + 18, speed: 2.5, zone: 'gully' },
        { id: 'cover', role: 'Cover', x: cx - 165, y: cy - 60, speed: 2.5, zone: 'cover' },
        { id: 'midoff', role: 'Mid-Off', x: cx - 95, y: cy - 160, speed: 2.4, zone: 'midoff' },
        { id: 'midon', role: 'Mid-On', x: cx + 95, y: cy - 160, speed: 2.4, zone: 'midon' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: cx - br * 0.65, y: batsmanY + br * 0.42, speed: 2.7, zone: 'thirdman' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.76, y: cy - br * 0.40, speed: 2.7, zone: 'deep_leg' },
        { id: 'fineleg', role: 'Deep Fine Leg', x: cx + br * 0.65, y: batsmanY + br * 0.42, speed: 2.7, zone: 'fineleg' }
      ];
    } else if (preset === 'offside_defensive') {
      // Packed off-side boundary ring: 4 inside, 5 on boundary
      targetPlacements = [
        { id: 'midoff', role: 'Mid-Off', x: cx - 95, y: cy - 155, speed: 2.4, zone: 'midoff' },
        { id: 'midon', role: 'Mid-On', x: cx + 95, y: cy - 155, speed: 2.4, zone: 'midon' },
        { id: 'midwicket', role: 'Mid-Wicket', x: cx + 170, y: cy - 50, speed: 2.4, zone: 'midwicket' },
        { id: 'sqleg', role: 'Square Leg', x: cx + 180, y: cy + 30, speed: 2.4, zone: 'sqleg' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: cx - br * 0.65, y: batsmanY + br * 0.42, speed: 2.7, zone: 'thirdman' },
        { id: 'point', role: 'Deep Point', x: cx - br * 0.82, y: batsmanY - 15, speed: 2.7, zone: 'point' },
        { id: 'deepcover', role: 'Deep Cover', x: cx - br * 0.78, y: cy - br * 0.35, speed: 2.7, zone: 'cover' },
        { id: 'longoff', role: 'Long-Off', x: cx - br * 0.50, y: cy - br * 0.72, speed: 2.7, zone: 'midoff' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.76, y: cy - br * 0.40, speed: 2.7, zone: 'deep_leg' }
      ];
    } else if (preset === 'legside_defensive') {
      // Leg-side trap: 4 inside, 5 on boundary
      targetPlacements = [
        { id: 'point', role: 'Point', x: cx - 180, y: cy + 20, speed: 2.4, zone: 'point' },
        { id: 'cover', role: 'Cover', x: cx - 160, y: cy - 55, speed: 2.4, zone: 'cover' },
        { id: 'midoff', role: 'Mid-Off', x: cx - 95, y: cy - 155, speed: 2.4, zone: 'midoff' },
        { id: 'midon', role: 'Mid-On', x: cx + 95, y: cy - 155, speed: 2.4, zone: 'midon' },
        { id: 'longon', role: 'Long-On', x: cx + br * 0.50, y: cy - br * 0.72, speed: 2.7, zone: 'longon' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.78, y: cy - br * 0.35, speed: 2.7, zone: 'deep_leg' },
        { id: 'deepsqleg', role: 'Deep Sq Leg', x: cx + br * 0.78, y: batsmanY + br * 0.25, speed: 2.7, zone: 'deep_sqleg' },
        { id: 'fineleg', role: 'Fine Leg', x: cx + br * 0.65, y: batsmanY + br * 0.42, speed: 2.7, zone: 'fineleg' },
        { id: 'deepcover', role: 'Deep Cover', x: cx - br * 0.78, y: cy - br * 0.35, speed: 2.7, zone: 'cover' }
      ];
    } else {
      // Balanced Standard Cricket Field (Default: 4 inside, 5 on boundary with wide gaps)
      targetPlacements = [
        { id: 'cover', role: 'Cover', x: cx - 160, y: cy - 55, speed: 2.4, zone: 'cover' },
        { id: 'midoff', role: 'Mid-Off', x: cx - 95, y: cy - 160, speed: 2.4, zone: 'midoff' },
        { id: 'midon', role: 'Mid-On', x: cx + 95, y: cy - 160, speed: 2.4, zone: 'midon' },
        { id: 'sqleg', role: 'Square Leg', x: cx + 175, y: cy + 25, speed: 2.4, zone: 'sqleg' },
        { id: 'deeppoint', role: 'Deep Point', x: cx - br * 0.80, y: batsmanY - 15, speed: 2.7, zone: 'point' },
        { id: 'longoff', role: 'Deep Long-Off', x: cx - br * 0.52, y: cy - br * 0.70, speed: 2.7, zone: 'deep_off' },
        { id: 'longon', role: 'Deep Long-On', x: cx + br * 0.52, y: cy - br * 0.70, speed: 2.7, zone: 'longon' },
        { id: 'deepmidwicket', role: 'Deep Mid-Wkt', x: cx + br * 0.78, y: cy - br * 0.38, speed: 2.7, zone: 'deep_leg' },
        { id: 'thirdman', role: 'Deep 3rd Man', x: cx - br * 0.65, y: batsmanY + br * 0.42, speed: 2.7, zone: 'thirdman' }
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
      if (this.throwTracer.progress >= 1.0) {
        this.throwTracer.progress = 1.0;
        this.throwTracer.active = false;
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

        const moveSpeed = f.isDiving ? f.speed * 1.15 : f.speed;
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
          f.vx = (dx / dist) * (f.speed * 0.75);
          f.vy = (dy / dist) * (f.speed * 0.75);
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

    // Automatic field pickup: if ball has slowed down on turf and fielder reaches it, scoop up & throw immediately!
    if (ball && ball.state === 'HIT' && !ball.isAirborne && !this.throwTracer) {
      const primary = this.fielders.find(f => f.id === this.primaryChaserId);
      if (primary) {
        const d = Math.hypot(primary.x - ball.x, primary.y - ball.y);
        if (d < 32 && ballSpeed < 5.0) {
          ball.vx = 0;
          ball.vy = 0;
          this.startThrowTracer(primary.x, primary.y, engine, primary.role);
        }
      }
    }
  }

  checkFieldInterception(ball, engine = null) {
    if (!ball || ball.state !== 'HIT') return null;

    const ballSpeed = Math.hypot(ball.vx || 0, ball.vy || 0);

    for (let f of this.fielders) {
      const dist = Math.hypot(ball.x - f.x, ball.y - f.y);

      // Catch detection (Airborne ball at catchable height)
      if (ball.isAirborne && ball.height < 24 && dist < 32) {
        f.isDiving = true;
        f.isCatching = true;
        f.catchTimer = 90;
        this.startThrowTracer(f.x, f.y, engine, f.role);
        return { type: 'CATCH', fielder: f.role };
      }

      // Ground stop detection along the turf (Fielder stops ball cleanly for 1, 2, or 3 runs)
      if (!ball.isAirborne && dist < 24 && ballSpeed < 9.5) {
        f.isDiving = dist < 20;
        this.startThrowTracer(f.x, f.y, engine, f.role);
        // Decelerate stopped ball to 0
        ball.vx = 0;
        ball.vy = 0;
        return { type: 'STOP', fielder: f.role, distanceTraveled: ball.traveled };
      }
    }
    return null;
  }

  startThrowTracer(fromX, fromY, engine = null, fielderRole = 'Fielder') {
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

