// Advanced 2D Physics, Authentic Cricket Speeds & Variations, Crease Footwork, Shot Dynamics & Dismissals

export class CricketPhysics {
  constructor(canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.screenShake = 0;
    this.initDimensions();
    this.reset();
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.initDimensions();
  }

  initDimensions() {
    this.cx = this.width / 2;
    this.cy = this.height * 0.52;
    const isPortrait = this.height > this.width;

    if (isPortrait) {
      // Authentic portrait cricket field matching reference screenshot:
      // Pitch in lower-middle half, leaving upper area for bowler run-up and scoreboard
      this.pitchWidth = Math.min(84, Math.max(68, this.width * 0.22));
      this.pitchTop = this.height * 0.48;
      this.pitchBottom = this.height * 0.83;
      this.pitchLength = this.pitchBottom - this.pitchTop;

      this.bowlerCreaseY = this.pitchTop + 32;
      this.batsmanCreaseY = this.pitchBottom - 34;
      this.stumpsY = this.batsmanCreaseY + 16;
      this.bowlerStumpsY = this.bowlerCreaseY - 16;
      this.boundaryRadius = Math.min(this.width * 0.48, this.height * 0.46);
    } else {
      this.pitchWidth = Math.min(110, Math.max(90, this.width * 0.28));
      this.pitchTop = this.height * 0.26;
      this.pitchBottom = this.height * 0.78;
      this.pitchLength = this.pitchBottom - this.pitchTop;

      this.bowlerCreaseY = this.pitchTop + 38;
      this.batsmanCreaseY = this.pitchBottom - 38;
      this.stumpsY = this.batsmanCreaseY + 18;
      this.bowlerStumpsY = this.bowlerCreaseY - 18;
      this.boundaryRadius = Math.min(this.width * 0.48, this.height * 0.46);
    }
  }

  reset(keepFootwork = true) {
    this.ball = {
      x: this.cx,
      y: this.bowlerCreaseY,
      vx: 0,
      vy: 0,
      height: 12,
      vz: 0,
      radius: 5,
      state: 'IDLE', // 'IDLE', 'RUN_UP', 'BOWLED', 'HIT', 'DEAD'
      inPlay: false,
      hasBounced: false,
      bounceSpotY: 0,
      bounceSpotX: 0,
      spinLateralV: 0,
      swingCurve: 0,
      reverseSwingRate: 0,
      isAirborne: false,
      speedKmh: 140,
      traveled: 0,
      distanceMeters: 0,
      deliveryType: 'fast',
      lengthType: 'good',
      lineType: 'stumps',
      isFullToss: false,
      timeUntilArrivalMs: 0, // For batsman timing meter
      totalFlightTimeMs: 400,
      flightProgress: 0,
      trail: []
    };

    // Bowler at top crease
    this.bowler = {
      x: this.cx - 14,
      y: this.pitchTop - 25,
      runUpProgress: 0,
      isBowling: false,
      bowlingArmAngle: 0,
      armSide: 'right',
      actionType: 'high_arm', // 'high_arm', 'slingshot', 'fast_swing', 'wrist_spin', 'finger_spin', 'unorthodox'
      faceStyle: 'classic',
      skinTone: '#c68656'
    };

    // Striker Batsman at bottom crease
    const prevCreaseX = (keepFootwork && this.batsman) ? this.batsman.creaseOffsetX : 0;
    const prevStepOut = (keepFootwork && this.batsman) ? this.batsman.isSteppingOut : false;
    const prevStepOffset = (keepFootwork && this.batsman) ? this.batsman.stepOutOffset : 0;
    const prevFootwork = (keepFootwork && this.batsman) ? this.batsman.footworkState : 'stance';

    this.batsman = {
      x: this.cx + prevCreaseX,
      y: this.batsmanCreaseY,
      creaseOffsetX: prevCreaseX, // Left / Right shuffle offset
      isSteppingOut: prevStepOut,
      stepOutOffset: prevStepOffset, // Charged down the pitch
      footworkState: prevFootwork,
      footworkAnim: 0,
      isSwinging: false,
      swingProgress: 0,
      stanceProgress: 0, // Dynamic stance tapping & trigger footwork
      triggerTap: 0,
      weightShiftX: 0,
      swingType: 'straight', // 'off', 'straight', 'leg'
      shotStyle: 'straight_drive', // 'cover_drive', 'straight_drive', 'pull', 'upper_cut', 'flick', 'reverse_sweep', 'scoop', 'step_out'
      shotQuality: null,
      batAngle: -0.3,
      faceStyle: 'classic',
      skinTone: '#d49b70'
    };

    // Non-striker Batsman at top crease
    this.nonStriker = {
      x: this.cx + this.pitchWidth * 0.42,
      y: this.bowlerCreaseY - 4
    };

    // Wicket Keeper directly behind bottom stumps
    this.keeper = {
      x: this.cx,
      y: this.stumpsY + 24,
      isStumping: false
    };

    this.stumpsHit = false;
    this.stumpPieces = [];
    this.particles = [];
  }

  // ==========================================================================
  // Crease Footwork & Movement Controls with Dynamic Foot Animation States
  // ==========================================================================
  shuffleLeft() {
    // Back away towards off side (left) to create room for inside-out drives & cuts
    if (!this.batsman) return;
    this.batsman.creaseOffsetX = Math.max(-30, (this.batsman.creaseOffsetX || 0) - 15);
    this.batsman.x = this.cx + this.batsman.creaseOffsetX;
    this.batsman.footworkState = 'shuffling_left';
    this.batsman.footworkAnim = 1.0;
  }

  shuffleRight() {
    // Walk across stumps towards leg side (right) to access flick, on-drive & ramp
    if (!this.batsman) return;
    this.batsman.creaseOffsetX = Math.min(30, (this.batsman.creaseOffsetX || 0) + 15);
    this.batsman.x = this.cx + this.batsman.creaseOffsetX;
    this.batsman.footworkState = 'shuffling_right';
    this.batsman.footworkAnim = 1.0;
  }

  stepOut() {
    // Charge down the deck towards bowler for massive +25% lofted six power!
    if (!this.batsman) return;
    this.batsman.isSteppingOut = true;
    this.batsman.stepOutOffset = 38;
    this.batsman.footworkState = 'stepping_out';
    this.batsman.footworkAnim = 1.0;
  }

  resetCrease() {
    if (!this.batsman) return;
    this.batsman.creaseOffsetX = 0;
    this.batsman.x = this.cx;
    this.batsman.isSteppingOut = false;
    this.batsman.stepOutOffset = 0;
    this.batsman.footworkState = 'stance';
    this.batsman.footworkAnim = 0;
  }

  pickWeighted(pool) {
    const totalWeight = pool.reduce((acc, item) => acc + item.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const item of pool) {
      if (rand < item.weight) return item;
      rand -= item.weight;
    }
    return pool[0];
  }

  resolveBowlerVariation(archetype) {
    // 1. Right-Arm Leg-Spin (Leg Break, Googly, Top Spinner, Flipper, Arm Ball)
    if (archetype === 'legspin' || archetype === 'spin') {
      const pool = [
        { type: 'legbreak', weight: 32, label: 'Leg Break' },
        { type: 'googly', weight: 26, label: "Wrong'un Googly" },
        { type: 'topspinner', weight: 16, label: 'Top Spinner' },
        { type: 'flipper', weight: 14, label: 'Skid Flipper' },
        { type: 'arm_ball', weight: 12, label: 'Skidding Arm Ball' }
      ];
      return this.pickWeighted(pool);
    }

    // 2. Right-Arm Off-Spin (Off Break, Doosra, Carrom Ball, Top Spinner, Drifter, Arm Ball)
    if (archetype === 'offspin') {
      const pool = [
        { type: 'offbreak', weight: 30, label: 'Off Break' },
        { type: 'doosra', weight: 22, label: 'Mystery Doosra' },
        { type: 'carrom', weight: 16, label: 'Carrom Ball' },
        { type: 'topspinner', weight: 12, label: 'Top Spinner' },
        { type: 'drifter', weight: 10, label: 'Flight Drifter' },
        { type: 'arm_ball', weight: 10, label: 'Skidding Arm Ball' }
      ];
      return this.pickWeighted(pool);
    }

    // 3. Express Fast (140 - 155 km/h: Straight Seam, Bouncer, Yorker, Outswing, Inswing)
    if (archetype === 'fast') {
      const pool = [
        { type: 'fast', weight: 30, label: 'Express Fast' },
        { type: 'bouncer', weight: 22, label: 'Sharp Bouncer' },
        { type: 'yorker', weight: 22, label: 'Toe-Crushing Yorker' },
        { type: 'outswing', weight: 14, label: 'Outswing Seam' },
        { type: 'inswing', weight: 12, label: 'Inswing Seam' }
      ];
      return this.pickWeighted(pool);
    }

    // 4. Fast-Medium & Medium-Fast (125 - 140 km/h: Inswing, Outswing, Reverse Swing, Off-Cutter, Leg-Cutter, Slower Ball)
    if (archetype === 'fastmedium' || archetype === 'mediumfast' || archetype === 'swing') {
      const pool = [
        { type: 'outswing', weight: 22, label: 'Late Outswing' },
        { type: 'inswing', weight: 22, label: 'Boomerang Inswing' },
        { type: 'reverse_swing', weight: 18, label: 'Reverse Swing' },
        { type: 'offcutter', weight: 14, label: 'Off Cutter' },
        { type: 'legcutter', weight: 12, label: 'Leg Cutter' },
        { type: 'slow_ball', weight: 12, label: 'Slower Dipper' }
      ];
      return this.pickWeighted(pool);
    }

    // 5. Medium Pace (105 - 125 km/h: Off Cutter, Leg Cutter, Slower Knuckle Ball, Straight Seam)
    if (archetype === 'medium') {
      const pool = [
        { type: 'offcutter', weight: 30, label: 'Seam Off Cutter' },
        { type: 'legcutter', weight: 25, label: 'Seam Leg Cutter' },
        { type: 'slow_ball', weight: 25, label: 'Deceptive Slower Ball' },
        { type: 'straight_seam', weight: 20, label: 'Upright Seam' }
      ];
      return this.pickWeighted(pool);
    }

    // If already a specific variation passed directly from Net Practice
    const labels = {
      legbreak: 'Leg Break',
      googly: "Wrong'un Googly",
      topspinner: 'Top Spinner',
      flipper: 'Skid Flipper',
      arm_ball: 'Skidding Arm Ball',
      offbreak: 'Off Break',
      doosra: 'Mystery Doosra',
      carrom: 'Carrom Ball',
      drifter: 'Flight Drifter',
      inswing: 'Inswing Seam',
      outswing: 'Outswing Seam',
      reverse_swing: 'Reverse Swing',
      offcutter: 'Off Cutter',
      legcutter: 'Leg Cutter',
      straight_seam: 'Straight Seam',
      slow_ball: 'Slower Dipper',
      yorker: 'Toe Yorker',
      bouncer: 'Sharp Bouncer',
      fast: 'Express Fast'
    };

    return { type: archetype, label: labels[archetype] || archetype.replace('_', ' ') };
  }

  /**
   * Start a delivery with authentic real-world cricket speeds, tight stump lines & dynamic variation selection.
   */
  startDelivery(deliveryConfig = 'fast', difficulty = 1.0) {
    this.reset();

    const config = typeof deliveryConfig === 'string'
      ? { bowlerType: deliveryConfig, length: 'auto', line: 'auto' }
      : deliveryConfig;

    const rawBowlerType = config.bowlerType || 'fast';
    const chosenLength = config.length || 'auto';
    const chosenLine = config.line || 'auto';

    // Intelligently resolve dynamic variation from bowler archetype if not explicitly passed
    const resolvedVariation = this.resolveBowlerVariation(rawBowlerType);
    const bType = resolvedVariation.type;
    this.ball.variationLabel = resolvedVariation.label;
    this.ball.archetype = rawBowlerType;

    this.ball.deliveryType = bType;
    this.ball.lengthType = chosenLength;
    this.ball.lineType = chosenLine;
    this.bowler.isBowling = true;
    this.bowler.runUpProgress = 0;
    this.ball.state = 'RUN_UP';

    // 1. Determine Pitch Bounce Spot (Length)
    const isSpinBowler = bType.includes('spin') || bType.includes('break') || bType === 'googly' || bType === 'doosra' || bType === 'flipper' || bType === 'carrom' || bType === 'drifter' || bType === 'arm_ball' || rawBowlerType.includes('spin');

    let finalLength = chosenLength;
    if (finalLength === 'auto') {
      if (bType === 'bouncer') {
        finalLength = 'short';
      } else if (bType === 'yorker') {
        finalLength = 'yorker';
      } else if (isSpinBowler) {
        // Authentic Spin Length Repertoire: 30% Flighted Slot, 30% Good, 20% Flatter Short, 10% Flipper/Yorker, 10% Full Toss
        const spinPool = [
          { l: 'slot', w: 30 },
          { l: 'good', w: 30 },
          { l: 'short', w: 20 },
          { l: 'yorker', w: 10 },
          { l: 'fulltoss', w: 10 }
        ];
        const r = Math.random() * 100;
        let acc = 0;
        for (const item of spinPool) {
          acc += item.w;
          if (r <= acc) { finalLength = item.l; break; }
        }
      } else {
        // Authentic Pace Length Repertoire: 25% Short/Bouncer, 25% Good, 25% In The Slot, 15% Yorker, 10% Dipping Full Toss
        const pacePool = [
          { l: 'short', w: 25 },
          { l: 'good', w: 25 },
          { l: 'slot', w: 25 },
          { l: 'yorker', w: 15 },
          { l: 'fulltoss', w: 10 }
        ];
        const r = Math.random() * 100;
        let acc = 0;
        for (const item of pacePool) {
          acc += item.w;
          if (r <= acc) { finalLength = item.l; break; }
        }
      }
    }

    let bounceRel = 0.61;
    let isFullToss = false;

    if (finalLength === 'short' || bType === 'bouncer') {
      bounceRel = 0.35 + Math.random() * 0.08; // Short / Bouncer (35% to 43% down pitch)
    } else if (finalLength === 'good') {
      bounceRel = 0.58 + Math.random() * 0.08; // Good Length (58% to 66% down pitch)
    } else if (finalLength === 'slot') {
      bounceRel = 0.72 + Math.random() * 0.09; // In the Slot half-volley (72% to 81%)
    } else if (finalLength === 'yorker' || bType === 'yorker') {
      bounceRel = 0.89 + Math.random() * 0.05; // Yorker at toes (89% to 94%)
    } else if (finalLength === 'fulltoss') {
      isFullToss = true;
      bounceRel = 1.25; // Full toss does not pitch
    }

    this.ball.isFullToss = isFullToss;
    this.ball.bounceSpotY = this.pitchTop + (this.pitchLength * bounceRel);

    // 2. Determine Line & Genuine Wide Ball Dispersion (Realistic Line Bowling)
    let lineOffset = 0;
    let finalLine = chosenLine;
    if (finalLine === 'auto') {
      const lineRoll = Math.random();
      if (lineRoll < 0.07) {
        // 7% chance stray wide outside off (wide guideline is at cx - 24)
        lineOffset = -25 - Math.random() * 5;
      } else if (lineRoll < 0.13) {
        // 6% chance stray wide down leg (wide guideline is at cx + 15)
        lineOffset = +16 + Math.random() * 5;
      } else {
        // 87% on corridor / off-middle-leg stumps
        lineOffset = (Math.random() - 0.5) * 18;
      }
    } else if (finalLine === 'outside_off') {
      lineOffset = -18 - (Math.random() * 9); // Outside off / guideline test
    } else if (finalLine === 'stumps') {
      lineOffset = (Math.random() - 0.5) * 8; // Directly on stumps
    } else if (finalLine === 'leg') {
      lineOffset = +12 + (Math.random() * 6); // On the pads / leg stump
    }

    this.ball.bounceSpotX = this.cx + lineOffset;

    // 3. Determine Bowler Arm, Action & Real Cricket Speed Calibration:
    const isLeftArm = bType.includes('leftarm') || rawBowlerType.includes('leftarm');
    this.bowler.armSide = isLeftArm ? 'left' : 'right';
    this.bowler.x = isLeftArm ? this.cx + 14 : this.cx - 14;

    switch (bType) {
      // ======================================================================
      // PACE VARIATIONS (105 - 155 km/h)
      // ======================================================================
      case 'fast':
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = config.speedKmh || Math.floor(145 + Math.random() * 8 * difficulty);
        this.ball.swingCurve = (Math.random() - 0.5) * 0.3;
        this.ball.spinLateralV = 0;
        break;

      case 'inswing':
      case 'fastmedium':
        this.bowler.actionType = 'fast_swing';
        this.ball.speedKmh = config.speedKmh || Math.floor(135 + Math.random() * 8);
        this.ball.swingCurve = +1.15; // Visibly hoops in from outside off to middle/leg
        this.ball.bounceSpotX = this.cx - 10;
        this.ball.spinLateralV = +0.5;
        break;

      case 'outswing':
      case 'mediumfast':
      case 'swing':
        this.bowler.actionType = 'fast_swing';
        this.ball.speedKmh = config.speedKmh || Math.floor(132 + Math.random() * 8);
        this.ball.swingCurve = -1.15; // Visibly shapes away towards 4th stump / slip
        this.ball.bounceSpotX = this.cx + 4;
        this.ball.spinLateralV = -0.5;
        break;

      case 'reverse_swing':
        this.bowler.actionType = 'slingshot';
        this.ball.speedKmh = config.speedKmh || Math.floor(142 + Math.random() * 8);
        this.ball.swingCurve = 0;
        this.ball.reverseSwingRate = +2.2; // Late vicious tail in final flight!
        this.ball.bounceSpotX = this.cx - 8;
        this.ball.spinLateralV = +0.8;
        break;

      case 'offcutter':
      case 'medium':
        this.bowler.actionType = 'fast_swing';
        this.ball.speedKmh = config.speedKmh || Math.floor(115 + Math.random() * 8);
        this.ball.swingCurve = -0.3;
        this.ball.spinLateralV = +2.6; // Grips turf and cuts sharply in towards right-hander
        this.ball.bounceSpotX = this.cx - 8;
        break;

      case 'legcutter':
        this.bowler.actionType = 'fast_swing';
        this.ball.speedKmh = config.speedKmh || Math.floor(115 + Math.random() * 8);
        this.ball.swingCurve = +0.3;
        this.ball.spinLateralV = -2.6; // Grips turf and cuts away to off after bounce
        this.ball.bounceSpotX = this.cx + 8;
        break;

      case 'straight_seam':
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = config.speedKmh || Math.floor(138 + Math.random() * 8);
        this.ball.swingCurve = 0;
        this.ball.spinLateralV = 0;
        break;

      case 'slow_ball':
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = config.speedKmh || Math.floor(106 + Math.random() * 8);
        this.ball.swingCurve = -0.3;
        this.ball.isSlowerBall = true;
        this.ball.spinLateralV = +0.8;
        break;

      case 'yorker':
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = config.speedKmh || Math.floor(145 + Math.random() * 7);
        this.ball.swingCurve = 0;
        this.ball.spinLateralV = 0;
        this.ball.bounceSpotY = this.pitchTop + (this.pitchLength * 0.93);
        this.ball.bounceSpotX = this.cx + (Math.random() - 0.5) * 6;
        break;

      case 'bouncer':
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = config.speedKmh || Math.floor(146 + Math.random() * 7);
        this.ball.swingCurve = 0;
        this.ball.spinLateralV = 0;
        this.ball.bounceSpotY = this.pitchTop + (this.pitchLength * 0.35);
        break;

      // ======================================================================
      // SPIN VARIATIONS (65 - 95 km/h, max 105 km/h) - AUTHENTIC TURN & DRIFT!
      // ======================================================================
      case 'legbreak':
      case 'legspin':
      case 'spin':
        this.bowler.actionType = 'wrist_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(75 + Math.random() * 10 * difficulty);
        this.ball.swingCurve = +0.65; // Drifts leg side in flight
        this.ball.spinLateralV = -3.8; // Sharp vicious turn across off stump!
        this.ball.bounceSpotX = this.cx + 8; // Pitches on middle/leg, turns across off
        break;

      case 'googly':
        this.bowler.actionType = 'wrist_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(77 + Math.random() * 9);
        this.ball.swingCurve = -0.55; // Deceptive drift away to off
        this.ball.spinLateralV = +3.8; // Wrist-spin wrong'un rips sharply IN to pads/middle stump!
        this.ball.bounceSpotX = this.cx - 9;
        break;

      case 'topspinner':
        this.bowler.actionType = 'wrist_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(82 + Math.random() * 8);
        this.ball.swingCurve = 0;
        this.ball.spinLateralV = 0; // True line, kicks high
        this.ball.bounceSpotX = this.cx;
        break;

      case 'flipper':
        this.bowler.actionType = 'wrist_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(87 + Math.random() * 7);
        this.ball.swingCurve = 0;
        this.ball.spinLateralV = +0.5; // Skids low and fast under bat
        this.ball.bounceSpotX = this.cx + 2;
        break;

      case 'drifter':
        this.bowler.actionType = 'finger_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(72 + Math.random() * 8);
        this.ball.swingCurve = -1.1; // Heavy aerodynamic float on breeze
        this.ball.spinLateralV = -1.5;
        this.ball.bounceSpotX = this.cx + 6;
        break;

      case 'offbreak':
      case 'offspin':
        this.bowler.actionType = 'finger_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(78 + Math.random() * 10 * difficulty);
        this.ball.swingCurve = -0.65; // Drifts away outside off in flight
        this.ball.spinLateralV = +4.0; // Rips sharply INWARDS into right-hander's stumps!
        this.ball.bounceSpotX = this.cx - 10; // Pitch outside off, turn into stumps
        break;

      case 'doosra':
        this.bowler.actionType = 'finger_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(79 + Math.random() * 9);
        this.ball.swingCurve = -0.3;
        this.ball.spinLateralV = -3.5; // The 'other one': off-spin action that spins AWAY to off!
        this.ball.bounceSpotX = this.cx + 5;
        break;

      case 'carrom':
        this.bowler.actionType = 'unorthodox';
        this.ball.speedKmh = config.speedKmh || Math.floor(82 + Math.random() * 9);
        this.ball.swingCurve = -0.2;
        this.ball.spinLateralV = -0.8; // Middle-finger flick skids straight/subtle away
        this.ball.bounceSpotX = this.cx - 4;
        break;

      case 'arm_ball':
        this.bowler.actionType = 'finger_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(88 + Math.random() * 7);
        this.ball.swingCurve = +0.5;
        this.ball.spinLateralV = 0; // Doesn't turn, slides on with arm angle
        this.ball.bounceSpotX = this.cx - 6;
        break;

      case 'leftarm_orthodox':
        this.bowler.actionType = 'finger_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(76 + Math.random() * 10);
        this.ball.swingCurve = +0.6;
        this.ball.spinLateralV = -3.4;
        this.ball.bounceSpotX = this.cx + 7;
        break;

      case 'leftarm_chinaman':
        this.bowler.actionType = 'wrist_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(75 + Math.random() * 10);
        this.ball.swingCurve = -0.6;
        this.ball.spinLateralV = +3.6;
        this.ball.bounceSpotX = this.cx - 8;
        break;

      case 'leftarm_fast':
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = config.speedKmh || Math.floor(138 + Math.random() * 8);
        this.ball.swingCurve = -0.9;
        this.ball.spinLateralV = 0;
        break;

      default:
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = 136;
        this.ball.swingCurve = 0;
        this.ball.spinLateralV = 0;
    }

    // Strictly enforce real cricket speed regulations requested by user:
    // Spinners strictly 65 - 110 km/h, Pacers strictly 90 - 160 km/h
    if (isSpinBowler) {
      this.ball.speedKmh = Math.max(65, Math.min(110, this.ball.speedKmh));
    } else {
      this.ball.speedKmh = Math.max(90, Math.min(160, this.ball.speedKmh));
    }

    return {
      variation: bType,
      label: this.ball.variationLabel || bType,
      speedKmh: this.ball.speedKmh,
      length: finalLength,
      line: finalLine
    };
  }

  releaseBall() {
    this.ball.state = 'BOWLED';
    this.ball.inPlay = true;
    this.ball.x = this.bowler.x;
    this.ball.y = this.bowlerCreaseY;
    this.ball.height = this.ball.isFullToss ? 12 : 13;
    this.ball.trail = [];

    // Realistic flight speed scaling
    const baseSpeed = (this.ball.speedKmh / 140) * 11;
    this.ball.vy = baseSpeed;

    const totalDistanceY = this.batsmanCreaseY - this.bowlerCreaseY;
    this.ball.totalFlightTimeMs = (totalDistanceY / baseSpeed) * 16.6;

    if (this.ball.isFullToss) {
      this.ball.vx = (this.ball.bounceSpotX - this.bowler.x) / ((this.batsmanCreaseY - this.bowlerCreaseY) / baseSpeed);
    } else {
      this.ball.vx = (this.ball.bounceSpotX - this.bowler.x) / ((this.ball.bounceSpotY - this.bowlerCreaseY) / baseSpeed);
    }
  }

  /**
   * Intelligently determine the most authentic cricket shot based on:
   * - Delivery Length (Bouncer, Good Length, In The Slot, Yorker)
   * - Delivery Line (Outside Off, Stumps, Pads/Leg)
   * - Bowler Variation (Pace / Spin)
   * - Optional Touch X position (left side = off shots, right side = leg shots)
   */
  determineDynamicShot(touchX = null) {
    const ball = this.ball;
    const cx = this.cx;

    // Optional touch bias if user tapped left or right side of screen
    let touchSide = null;
    if (touchX !== null) {
      if (touchX < cx - 30) touchSide = 'off';
      else if (touchX > cx + 30) touchSide = 'leg';
    }

    const lineDist = ball.bounceSpotX - cx; // < 0 is outside off, > 0 is leg
    const lengthRel = (ball.bounceSpotY - this.pitchTop) / (this.pitchLength || 1);

    // 1. BOUNCER / SHORT LENGTH (lengthRel < 0.48 or bouncer/short)
    if (ball.lengthType === 'short' || ball.deliveryType === 'bouncer' || lengthRel < 0.50) {
      if (touchSide === 'off' || (touchSide === null && lineDist < -3)) {
        return { shotStyle: 'upper_cut', aim: 'off', label: 'Upper Cut' };
      } else {
        return { shotStyle: 'pull', aim: 'leg', label: 'Pull Shot' };
      }
    }

    // 2. YORKER AT THE TOES (lengthRel > 0.86 or deliveryType yorker)
    if (ball.lengthType === 'yorker' || ball.deliveryType === 'yorker' || lengthRel > 0.86) {
      if (touchSide === 'leg' || Math.random() < 0.50) {
        return { shotStyle: 'scoop', aim: 'straight', label: 'Scoop Ramp' };
      } else {
        return { shotStyle: 'straight_drive', aim: 'straight', label: 'Straight Drive' };
      }
    }

    // 3. IN THE SLOT / FULL DRIVING LENGTH (0.70 <= lengthRel <= 0.86)
    if (ball.lengthType === 'slot' || (lengthRel >= 0.70 && lengthRel <= 0.86)) {
      if (touchSide === 'off' || (touchSide === null && lineDist < -5)) {
        return { shotStyle: 'cover_drive', aim: 'off', label: 'Cover Drive' };
      } else if (touchSide === 'leg' || (touchSide === null && lineDist > 5)) {
        return { shotStyle: 'flick', aim: 'leg', label: 'Wrist Flick' };
      } else {
        // Straight in the slot!
        const isStep = Math.random() < 0.40;
        if (isStep) {
          this.batsman.isSteppingOut = true;
          this.batsman.stepOutOffset = 30;
        }
        return {
          shotStyle: isStep ? 'step_out' : 'straight_drive',
          aim: 'straight',
          label: isStep ? 'Charge Down Loft' : 'Straight Loft'
        };
      }
    }

    // 4. GOOD LENGTH (Corridor of uncertainty)
    if (touchSide === 'off' || (touchSide === null && lineDist < -3)) {
      // Outside off stump channel
      if (ball.deliveryType === 'legbreak' || ball.deliveryType === 'doosra') {
        const isRev = Math.random() < 0.35;
        return {
          shotStyle: isRev ? 'reverse_sweep' : 'cover_drive',
          aim: 'off',
          label: isRev ? 'Reverse Sweep' : 'Cover Drive'
        };
      }
      return { shotStyle: 'cover_drive', aim: 'off', label: 'Cover Drive' };
    } else if (touchSide === 'leg' || (touchSide === null && lineDist > 3)) {
      return { shotStyle: 'flick', aim: 'leg', label: 'Flick / On Drive' };
    } else {
      return { shotStyle: 'straight_drive', aim: 'straight', label: 'Straight Drive' };
    }
  }

  /**
   * Swing bat with dynamic shot selection for pure Spacebar / Single Touch control
   */
  swingBat(touchX = null, shotStyleOverride = null) {
    if (this.batsman.isSwinging || this.ball.state !== 'BOWLED') return null;

    this.batsman.isSwinging = true;
    this.batsman.swingProgress = 0;

    const dynamicShot = shotStyleOverride
      ? { shotStyle: shotStyleOverride, aim: this.determineAimFromStyle(shotStyleOverride), label: shotStyleOverride.replace('_', ' ') }
      : this.determineDynamicShot(touchX);

    this.batsman.shotStyle = dynamicShot.shotStyle;
    this.batsman.swingType = dynamicShot.aim;

    const effectiveBatsmanY = this.batsmanCreaseY - (this.batsman.isSteppingOut ? this.batsman.stepOutOffset : 0);
    const distToBat = effectiveBatsmanY - this.ball.y;
    const timeDeltaMs = (distToBat / (this.ball.vy || 10)) * 16.6;

    let timingQuality = 'MISS';
    let power = 0;

    // Sweet Spot Timing Windows
    if (Math.abs(timeDeltaMs) <= 38) {
      timingQuality = 'PERFECT';
      power = 1.0;
    } else if (Math.abs(timeDeltaMs) <= 85) {
      timingQuality = 'GOOD';
      power = 0.72;
    } else if (timeDeltaMs > 85 && timeDeltaMs <= 150) {
      timingQuality = 'EARLY';
      power = 0.45;
    } else if (timeDeltaMs < -38 && timeDeltaMs >= -150) {
      timingQuality = 'LATE';
      power = 0.40;
    } else {
      timingQuality = 'MISS';
      power = 0;
    }

    // Check lateral reach alignment
    const lateralDiff = Math.abs(this.ball.x - this.batsman.x);
    if (lateralDiff > 44 && timingQuality !== 'MISS') {
      timingQuality = 'EDGE';
      power = 0.35;
    }

    this.batsman.shotQuality = timingQuality;

    if (timingQuality !== 'MISS') {
      this.executeHit(timingQuality, power, dynamicShot.shotStyle);
    }

    return {
      quality: timingQuality,
      power,
      timeDeltaMs: Math.round(timeDeltaMs),
      aim: dynamicShot.aim,
      shotStyle: dynamicShot.shotStyle,
      shotLabel: dynamicShot.label
    };
  }

  determineAimFromStyle(style) {
    if (style === 'cover_drive' || style === 'upper_cut' || style === 'reverse_sweep') return 'off';
    if (style === 'pull' || style === 'flick') return 'leg';
    return 'straight';
  }



  triggerBowled() {
    this.stumpsHit = true;
    this.ball.state = 'DEAD';
    this.ball.vx *= 0.15;
    this.ball.vy *= 0.15;
    this.screenShake = 8;

    this.stumpPieces = [
      { x: this.cx - 6, y: this.stumpsY, vx: -3 - Math.random() * 2, vy: 4 + Math.random() * 3, rot: 0, vRot: -0.2, length: 14, isBail: false },
      { x: this.cx, y: this.stumpsY, vx: (Math.random() - 0.5) * 3, vy: 5 + Math.random() * 4, rot: 0, vRot: 0.3, length: 14, isBail: false },
      { x: this.cx + 6, y: this.stumpsY, vx: 3 + Math.random() * 2, vy: 4 + Math.random() * 3, rot: 0, vRot: 0.25, length: 14, isBail: false },
      { x: this.cx - 3, y: this.stumpsY - 3, vx: -4 - Math.random() * 3, vy: -5 - Math.random() * 3, rot: 0, vRot: -0.4, length: 8, isBail: true },
      { x: this.cx + 3, y: this.stumpsY - 3, vx: 4 + Math.random() * 3, vy: -5 - Math.random() * 3, rot: 0, vRot: 0.4, length: 8, isBail: true }
    ];

    this.createSparks(this.cx, this.stumpsY, '#ef4444', 35);
  }

  triggerStumping() {
    this.keeper.isStumping = true;
    this.stumpsHit = true;
    this.ball.state = 'DEAD';
    this.ball.x = this.cx;
    this.ball.y = this.stumpsY;
    this.screenShake = 7;

    this.stumpPieces = [
      { x: this.cx - 5, y: this.stumpsY, vx: -2 - Math.random() * 2, vy: 3 + Math.random() * 2, rot: 0, vRot: -0.25, length: 14, isBail: false },
      { x: this.cx + 5, y: this.stumpsY, vx: 2 + Math.random() * 2, vy: 3 + Math.random() * 2, rot: 0, vRot: 0.25, length: 14, isBail: false },
      { x: this.cx - 2, y: this.stumpsY - 3, vx: -3, vy: -4, rot: 0, vRot: -0.4, length: 8, isBail: true },
      { x: this.cx + 2, y: this.stumpsY - 3, vx: 3, vy: -4, rot: 0, vRot: 0.4, length: 8, isBail: true }
    ];

    this.createSparks(this.cx, this.stumpsY, '#f59e0b', 30);
  }

  createSparks(x, y, color = '#fef08a', count = 15) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 3,
        color,
        life: 1.0,
        decay: 0.03 + Math.random() * 0.04
      });
    }
  }

  createPitchDust(x, y) {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color: 'rgba(217, 119, 6, 0.6)',
        life: 0.8,
        decay: 0.05
      });
    }
  }

  createRocketSmoke(x, y) {
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 3.8;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3.5 + Math.random() * 5,
        color: Math.random() > 0.4 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(245, 158, 11, 0.8)',
        life: 1.0,
        decay: 0.04
      });
    }
  }

  createGrassSpray(x, y) {
    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 2.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        color: '#4ade80',
        life: 0.7,
        decay: 0.06
      });
    }
  }

  /**
   * Execute bat-ball collision physics with distinct shot trajectories & heights
   */
  executeHit(timingQuality, power, shotStyle) {
    this.ball.state = 'HIT';
    this.ball.hasBounced = true;

    let exitAngle = 0;
    let altitudeVz = 0;
    // Calibrated ground and loft speeds: ground balls travel progressively so fielders can chase!
    let exitSpeed = 5.2 + (power * 4.6); // 5.2 - 9.8 px/frame (realistic rolling speed!)

    // Apply Step Out power boost!
    if (this.batsman.isSteppingOut) {
      exitSpeed *= 1.18;
      altitudeVz += 2.5;
    }

    switch (shotStyle) {
      case 'cover_drive':
        // Pierces covers / extra-cover boundary
        exitAngle = -Math.PI * 0.32 + (Math.random() - 0.5) * 0.15;
        altitudeVz = timingQuality === 'PERFECT' ? 10 : 1.5;
        break;

      case 'pull':
        // Swats ball to mid-wicket / deep square leg
        exitAngle = Math.PI * 0.35 + (Math.random() - 0.5) * 0.18;
        altitudeVz = timingQuality === 'PERFECT' ? 16 : 4.0;
        break;

      case 'upper_cut':
        // Slices over slip cordon to third man
        exitAngle = -Math.PI * 0.45 + (Math.random() - 0.5) * 0.12;
        altitudeVz = 17.0; // High sailing cut over slips!
        break;

      case 'flick':
        // Supple wrists through mid-on / fine leg
        exitAngle = Math.PI * 0.22 + (Math.random() - 0.5) * 0.12;
        altitudeVz = 4.0;
        break;

      case 'reverse_sweep':
        // Reverse paddle to third man / backward point
        exitAngle = -Math.PI * 0.52 + (Math.random() - 0.5) * 0.15;
        altitudeVz = 4.5;
        break;

      case 'scoop':
        // Ramps ball backwards over wicket-keeper's head!
        exitAngle = Math.PI * 0.95 + (Math.random() - 0.5) * 0.2;
        altitudeVz = 16.0; // High looping ramp over keeper!
        exitSpeed *= 0.92;
        break;

      case 'step_out':
        // Massive towering straight loft!
        exitAngle = (Math.random() - 0.5) * 0.18;
        altitudeVz = 18.5; // Towering six altitude!
        break;

      case 'straight_drive':
      default:
        exitAngle = (Math.random() - 0.5) * 0.20;
        altitudeVz = timingQuality === 'PERFECT' ? 16.0 : 5.0;
        break;
    }

    // Deflections on early / late / edge
    if (timingQuality === 'EARLY') exitAngle += 0.35;
    if (timingQuality === 'LATE' || timingQuality === 'EDGE') exitAngle -= 0.45;

    // Calibrated slow speeds: Six hangs majestically in the air, ground balls roll progressively
    if (timingQuality === 'PERFECT') {
      exitSpeed = 3.3 + (power * 1.2);
    } else if (altitudeVz <= 5.5) {
      exitSpeed = 4.2 + (power * 2.8);
    } else {
      exitSpeed = 3.6 + (power * 2.0);
    }

    this.ball.vx = Math.sin(exitAngle) * exitSpeed;
    this.ball.vy = -Math.cos(exitAngle) * exitSpeed;

    if (timingQuality === 'PERFECT') {
      this.ball.isAirborne = true;
      this.ball.isRocketSix = true; // Launch like a rocket to stadium stands!
      this.ball.height = 18;
      this.ball.vz = 14.5; // High towering altitude with slow majestic arc!
      this.screenShake = 7;
      this.createSparks(this.ball.x, this.ball.y, '#f59e0b', 36);
      this.createRocketSmoke(this.ball.x, this.ball.y);
      this.ball.distanceMeters = Math.round(98 + power * 24 + Math.random() * 14);
    } else if (timingQuality === 'GOOD') {
      this.ball.isAirborne = altitudeVz > 5.5;
      this.ball.isRocketFour = altitudeVz <= 5.5; // Blistering flat ground rocket 4
      this.ball.height = this.ball.isAirborne ? 12 : 0;
      this.ball.vz = altitudeVz;
      this.screenShake = 3;
      this.createSparks(this.ball.x, this.ball.y, '#ffffff', 20);
      this.ball.distanceMeters = Math.round(68 + power * 16);
    } else {
      this.ball.isAirborne = true;
      this.ball.height = 7;
      this.ball.vz = 3.5;
      this.createSparks(this.ball.x, this.ball.y, '#94a3b8', 12);
      this.ball.distanceMeters = Math.round(35 + Math.random() * 20);
    }
  }

  update(dt = 1) {
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - 0.4 * dt);
    }

    // 1. Bowler run-up progression
    if (this.bowler.isBowling && this.ball.state === 'RUN_UP') {
      this.bowler.runUpProgress += 0.035 * dt;
      this.bowler.y = (this.pitchTop - 25) + this.bowler.runUpProgress * 25;
      this.bowler.bowlingArmAngle = this.bowler.runUpProgress * Math.PI * 2;

      // Dynamic Batsman Footwork & Trigger Movement during run-up!
      this.batsman.stanceProgress = (this.batsman.stanceProgress + 0.14 * dt) % (Math.PI * 2);
      this.batsman.triggerTap = Math.abs(Math.sin(this.batsman.stanceProgress * 3)) * 3;
      this.batsman.weightShiftX = Math.sin(this.batsman.stanceProgress) * 2;

      if (this.bowler.runUpProgress >= 1.0) {
        this.bowler.isBowling = false;
        this.releaseBall();
      }
    } else {
      // Subtle idle breathing & stance balance
      this.batsman.stanceProgress = (this.batsman.stanceProgress + 0.05 * dt) % (Math.PI * 2);
      this.batsman.triggerTap = Math.abs(Math.sin(this.batsman.stanceProgress * 1.5)) * 1.5;
      this.batsman.weightShiftX = Math.sin(this.batsman.stanceProgress * 0.8) * 1;
    }

    // 2. Batsman swing animation
    if (this.batsman.isSwinging) {
      this.batsman.swingProgress += 0.12 * dt;
      if (this.batsman.swingProgress >= 1.0) {
        this.batsman.isSwinging = false;
        this.batsman.swingProgress = 0;
      }
    }

    // 3. Stumps & Bails flying physics
    this.stumpPieces.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vRot * dt;
      p.vy += 0.25 * dt;
      p.vx *= 0.98;
    });

    // 4. Ball in flight towards batsman
    if (this.ball.state === 'BOWLED') {
      this.ball.y += this.ball.vy * dt;
      this.ball.x += this.ball.vx * dt;

      // Update timing meter flight progress
      const effectiveBatsmanY = this.batsmanCreaseY - (this.batsman.isSteppingOut ? this.batsman.stepOutOffset : 0);
      const currentDistY = this.ball.y - this.bowlerCreaseY;
      const totalDistY = effectiveBatsmanY - this.bowlerCreaseY;
      this.ball.flightProgress = Math.min(1.0, Math.max(0, currentDistY / totalDistY));
      this.ball.timeUntilArrivalMs = Math.max(0, ((effectiveBatsmanY - this.ball.y) / (this.ball.vy || 10)) * 16.6);

      // Track trajectory trail with bounce state for broadcast virtual-eye drawing
      this.ball.trail.push({
        x: this.ball.x,
        y: this.ball.y - this.ball.height,
        hasBounced: this.ball.hasBounced
      });
      if (this.ball.trail.length > 40) this.ball.trail.shift();

      // Realistic aerodynamic swing in air before bounce (doubled rate for visible bend)
      if (!this.ball.hasBounced && this.ball.swingCurve !== 0) {
        this.ball.vx += this.ball.swingCurve * 0.16 * dt;
      }

      // Late Reverse Swing in second half of flight
      if (this.ball.reverseSwingRate !== 0 && this.ball.flightProgress > 0.52) {
        this.ball.vx += this.ball.reverseSwingRate * 0.24 * dt;
      }

      // Slower ball dipper deceleration in mid-air
      if (this.ball.isSlowerBall && this.ball.flightProgress > 0.48) {
        this.ball.vy *= 0.984;
      }

      // Pitch bounce detection with variation-specific kick & bounce heights
      if (!this.ball.isFullToss && !this.ball.hasBounced && this.ball.y >= this.ball.bounceSpotY) {
        this.ball.hasBounced = true;
        this.createPitchDust(this.ball.x, this.ball.y);

        if (this.ball.lengthType === 'short' || this.ball.deliveryType === 'bouncer') {
          this.ball.height = 24;
          this.ball.vz = 5.8;
        } else if (this.ball.deliveryType === 'topspinner') {
          this.ball.height = 22;
          this.ball.vz = 5.4;
        } else if (this.ball.deliveryType === 'flipper') {
          this.ball.height = 4.5;
          this.ball.vz = 0.5;
          this.ball.vy *= 1.08; // Skids fast under willow
        } else if (this.ball.deliveryType === 'yorker') {
          this.ball.height = 2;
          this.ball.vz = 0.2;
        } else {
          this.ball.height = 14;
          this.ball.vz = 3.4;
        }

        if (this.ball.spinLateralV !== 0) {
          this.ball.vx += this.ball.spinLateralV;
        }
      }

      // Ball reaches batsman crease
      if (this.ball.y >= effectiveBatsmanY - 4) {
        const distToStumps = Math.abs(this.ball.x - this.cx);
        const distToBatsman = Math.abs(this.ball.x - this.batsman.x);

        // Check Keeper Stumping: Batsman stepped out of crease and missed ball!
        if (this.batsman.isSteppingOut && (!this.batsman.isSwinging || this.batsman.shotQuality === 'MISS')) {
          if (this.ball.y >= this.stumpsY - 2 && distToStumps < 22) {
            this.triggerStumping();
            return { event: 'STUMPED' };
          }
        }

        // Check LBW
        if (this.ball.y >= effectiveBatsmanY && this.ball.y <= effectiveBatsmanY + 12 && distToBatsman < 12 && distToStumps < 14) {
          if (!this.batsman.isSwinging || this.batsman.shotQuality === 'MISS') {
            this.ball.state = 'DEAD';
            this.ball.vx *= 0.1;
            this.ball.vy *= 0.1;
            this.screenShake = 6;
            this.createSparks(this.ball.x, this.ball.y, '#ef4444', 20);
            return { event: 'LBW' };
          }
        }

        // Check Bowled
        if (this.ball.y >= this.stumpsY - 4 && distToStumps < 14) {
          this.triggerBowled();
          return { event: 'BOWLED' };
        } else if (this.ball.y > this.batsmanCreaseY + 45) {
          this.ball.state = 'DEAD';
          // Check genuine ICC cricket Wide Ball rule (untouched deliveries straying outside wide lines)
          const isWideOff = this.ball.x < (this.cx - 24);
          const isWideLeg = this.ball.x > (this.cx + 15);
          if (isWideOff || isWideLeg) {
            return {
              event: 'WIDE',
              runs: 1,
              wideSide: isWideOff ? 'off' : 'leg',
              text: isWideOff ? 'WIDE (OUTSIDE OFF)' : 'WIDE (DOWN LEG)'
            };
          }
          return { event: 'DOT' };
        }
      }
    }

    // 5. Ball after hit: Slow majestic meteor rocket trajectory into stadium spectators
    if (this.ball.state === 'HIT') {
      this.ball.x += this.ball.vx * dt;
      this.ball.y += this.ball.vy * dt;
      this.ball.traveled += Math.hypot(this.ball.vx, this.ball.vy);

      this.ball.trail.push({ x: this.ball.x, y: this.ball.y - this.ball.height });
      if (this.ball.trail.length > 30) this.ball.trail.shift();

      // Rocket Six Trail: blazing glowing sparks & fiery comet smoke
      if (this.ball.isRocketSix) {
        if (Math.random() < 0.75) {
          this.particles.push({
            x: this.ball.x + (Math.random() - 0.5) * 6,
            y: this.ball.y - this.ball.height + (Math.random() - 0.5) * 6,
            vx: -this.ball.vx * 0.14 + (Math.random() - 0.5) * 1.5,
            vy: -this.ball.vy * 0.14 + (Math.random() - 0.5) * 1.5,
            size: 3.5 + Math.random() * 4.0,
            color: Math.random() > 0.4 ? '#f59e0b' : '#ef4444',
            life: 0.9,
            decay: 0.035
          });
        }
      }

      if (this.ball.isAirborne) {
        this.ball.height += this.ball.vz * dt;
        // Slower majestic gravitational drop on towering sixes (stays aloft 2.4s):
        const gravity = this.ball.isRocketSix ? 0.20 : 0.44;
        this.ball.vz -= gravity * dt;
        if (this.ball.height <= 0) {
          this.ball.height = 0;
          this.ball.isAirborne = false;
          this.ball.vz = 0;
          this.createGrassSpray(this.ball.x, this.ball.y);
          this.ball.vx *= 0.82;
          this.ball.vy *= 0.82;
        }
      } else {
        // Flat ground stroke: realistic progressive grass resistance gives time for fielder sprint & slide!
        this.ball.vx *= 0.978;
        this.ball.vy *= 0.978;
        if (Math.random() < 0.40 && Math.hypot(this.ball.vx, this.ball.vy) > 1.2) {
          this.createGrassSpray(this.ball.x, this.ball.y);
        }
      }

      const currentSpeed = Math.hypot(this.ball.vx, this.ball.vy);
      const distFromCenter = Math.hypot(this.ball.x - this.cx, this.ball.y - this.cy);

      // Rocket SIX sails deep into the stadium stands among the cheering people!
      if (this.ball.isRocketSix) {
        const inStands = distFromCenter >= this.boundaryRadius + 20;
        if (inStands && (this.ball.height <= 4 || distFromCenter >= this.boundaryRadius + 55)) {
          this.ball.state = 'DEAD';
          this.screenShake = 9;
          this.sixLanding = {
            x: this.ball.x,
            y: this.ball.y,
            active: true,
            timestamp: Date.now()
          };
          this.createRocketSmoke(this.ball.x, this.ball.y);
          this.createSparks(this.ball.x, this.ball.y, '#f59e0b', 36);
          return {
            event: 'SIX',
            runs: 6,
            isRocketSix: true,
            distanceMeters: this.ball.distanceMeters || 104,
            landingX: this.ball.x,
            landingY: this.ball.y,
            crowdCheering: true
          };
        }
      } else if (distFromCenter >= this.boundaryRadius) {
        this.ball.state = 'DEAD';
        const isSix = this.ball.isAirborne && this.ball.height > 6;
        if (isSix) {
          this.screenShake = 7;
          this.sixLanding = { x: this.ball.x, y: this.ball.y, active: true, timestamp: Date.now() };
        } else {
          this.screenShake = 3.5;
        }
        return {
          event: isSix ? 'SIX' : 'FOUR',
          runs: isSix ? 6 : 4,
          isRocketSix: isSix,
          distanceMeters: this.ball.distanceMeters || (isSix ? 96 : 68),
          landingX: isSix ? this.ball.x : undefined,
          landingY: isSix ? this.ball.y : undefined,
          crowdCheering: true
        };
      }

      if (!this.ball.isAirborne && currentSpeed < 0.3) {
        this.ball.state = 'DEAD';
        let runs = 1;
        if (this.ball.traveled > this.boundaryRadius * 0.7) runs = 3;
        else if (this.ball.traveled > this.boundaryRadius * 0.4) runs = 2;
        return { event: 'RUNS', runs };
      }
    }

    // 6. Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    return null;
  }
}
