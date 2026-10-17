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

  setBatsmanHand(hand = 'right') {
    this.batsmanHand = hand === 'left' ? 'left' : 'right';
  }

  initDimensions() {
    this.cx = this.width / 2;
    this.cy = this.height * 0.52;
    const isPortrait = this.height > this.width;

    if (isPortrait) {
      // Authentic portrait cricket field matching reference screenshot (Image 2):
      // Centered pitch strip with clean grass margins on all sides
      this.pitchWidth = Math.min(88, Math.max(72, this.width * 0.22));
      this.pitchTop = this.height * 0.26;
      this.pitchBottom = this.height * 0.78;
      this.pitchLength = this.pitchBottom - this.pitchTop;

      this.bowlerCreaseY = this.pitchTop + 32;
      this.batsmanCreaseY = this.pitchBottom - 34;
      this.stumpsY = this.batsmanCreaseY + 16;
      this.bowlerStumpsY = this.bowlerCreaseY - 16;
      // 80-Meter Long Lengthy International Stadium Ground & Expansive 30-Yard Circle
      this.boundaryRadius = Math.max(720, Math.min(880, Math.max(this.width * 1.35, this.height * 0.90)));
      this.innerCircleRadiusX = Math.round(this.boundaryRadius * 0.36);
      this.innerCircleRadiusY = Math.round(this.boundaryRadius * 0.41);
    } else {
      this.pitchWidth = Math.min(110, Math.max(90, this.width * 0.28));
      this.pitchTop = this.height * 0.26;
      this.pitchBottom = this.height * 0.78;
      this.pitchLength = this.pitchBottom - this.pitchTop;

      this.bowlerCreaseY = this.pitchTop + 38;
      this.batsmanCreaseY = this.pitchBottom - 38;
      this.stumpsY = this.batsmanCreaseY + 18;
      this.bowlerStumpsY = this.bowlerCreaseY - 18;
      // 80-Meter Long Lengthy International Stadium Ground & Expansive 30-Yard Circle
      this.boundaryRadius = Math.max(780, Math.min(940, Math.max(this.width * 0.85, this.height * 1.15)));
      this.innerCircleRadiusX = Math.round(this.boundaryRadius * 0.35);
      this.innerCircleRadiusY = Math.round(this.boundaryRadius * 0.40);
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
      isStoppedByFielder: false,
      timeUntilArrivalMs: 0, // For batsman timing meter
      totalFlightTimeMs: 400,
      flightProgress: 0,
      trail: []
    };

    if (!this.batsmanHand) {
      this.batsmanHand = 'right';
    }

    // Bowler at top crease
    this.bowler = {
      x: this.cx - 20,
      y: this.pitchTop + 10,
      runUpProgress: 0,
      isBowling: false,
      bowlingArmAngle: 0,
      armSide: 'right',
      bowlingAngle: 'over', // 'over' or 'around' the wicket
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
      x: this.cx + this.pitchWidth * 0.44 + 8,
      y: this.bowlerCreaseY + 6
    };

    // Wicket Keeper directly behind bottom stumps
    this.keeper = {
      x: this.cx,
      y: this.stumpsY + 20,
      isStumping: false
    };

    this.stumpsHit = false;
    this.stumpPieces = [];
    this.particles = [];

    // Running Between Wickets State Machine (Interactive 1, 2, 3 Runs & Direct Hit Run Outs)
    this.running = {
      active: false,
      runsCompleted: 0,
      isCallingRun: false,
      isHolding: false,
      progress: 0, // 0 to 1 between creases
      direction: 1, // 1: striker to bowler crease, non-striker to batsman crease; -1: returning
      strikerX: this.cx - 16,
      strikerY: this.batsmanCreaseY,
      nonStrikerX: this.cx + 20,
      nonStrikerY: this.bowlerCreaseY,
      isSliding: false,
      throwActive: false,
      throwProgress: 0,
      throwFromX: 0,
      throwFromY: 0,
      throwTargetX: 0,
      throwTargetY: 0,
      throwTargetEnd: 'batsman',
      fielderRole: '',
      dangerLevel: 0
    };
    this.sixLanding = null;
  }

  commandRun() {
    if (!this.running || !this.running.active) return false;
    if (this.running.runsCompleted >= 3) return false;
    if (!this.running.isCallingRun) {
      this.running.isCallingRun = true;
      this.running.isHolding = false;
      return true;
    }
    return false;
  }

  commandHold() {
    if (!this.running || !this.running.active) return false;
    this.running.isHolding = true;
    this.running.isCallingRun = false;
    return true;
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
   * Strictly respects length, line, speed, bowling arm (right/left) and bowling angle (over/around).
   */
  startDelivery(deliveryConfig = 'fast', difficulty = 1.0) {
    this.reset();

    const config = typeof deliveryConfig === 'string'
      ? { bowlerType: deliveryConfig, length: 'auto', line: 'auto' }
      : deliveryConfig;

    const rawBowlerType = config.bowlerType || 'fast';
    const chosenLength = config.length || 'auto';
    const chosenLine = config.line || 'auto';
    const chosenArm = config.bowlingArm || (rawBowlerType.includes('leftarm') ? 'left' : 'right');
    const chosenAngle = config.bowlingAngle || 'over';

    // Intelligently resolve dynamic variation from bowler archetype if not explicitly passed
    const resolvedVariation = this.resolveBowlerVariation(rawBowlerType);
    const bType = resolvedVariation.type;
    this.ball.variationLabel = resolvedVariation.label;
    this.ball.archetype = rawBowlerType;

    this.ball.deliveryType = bType;
    this.ball.lengthType = chosenLength;
    this.ball.lineType = chosenLine;
    this.ball.bowlingArm = chosenArm;
    this.ball.bowlingAngle = chosenAngle;

    this.bowler.armSide = chosenArm;
    this.bowler.bowlingAngle = chosenAngle;
    this.bowler.isBowling = true;
    this.bowler.runUpProgress = 0;
    this.ball.state = 'RUN_UP';

    // 1. Authentic Crease Positioning based on Arm & Over/Around the wicket
    // Right-Arm Over: runs up on off-side (cx - 16) | Right-Arm Around: leg-side (cx + 18)
    // Left-Arm Over:  runs up on leg-side (cx + 16) | Left-Arm Around:  off-side (cx - 18)
    if (chosenArm === 'left') {
      this.bowler.x = (chosenAngle === 'over') ? (this.cx + 16) : (this.cx - 18);
    } else {
      this.bowler.x = (chosenAngle === 'over') ? (this.cx - 16) : (this.cx + 18);
    }

    // 2. Determine Pitch Bounce Spot (Length) - STRICTLY RESPECTS USER FILTER
    const isSpinBowler = bType.includes('spin') || bType.includes('break') || bType === 'googly' || bType === 'doosra' || bType === 'flipper' || bType === 'carrom' || bType === 'drifter' || bType === 'arm_ball' || rawBowlerType.includes('spin');

    let finalLength = chosenLength;
    if (finalLength === 'auto') {
      if (bType === 'bouncer') {
        finalLength = 'short';
      } else if (bType === 'yorker') {
        finalLength = 'yorker';
      } else if (isSpinBowler) {
        // Authentic Spin Length Repertoire
        const spinPool = [
          { l: 'slot', w: 30 },
          { l: 'good', w: 35 },
          { l: 'short', w: 18 },
          { l: 'yorker', w: 9 },
          { l: 'fulltoss', w: 8 }
        ];
        const r = Math.random() * 100;
        let acc = 0;
        for (const item of spinPool) {
          acc += item.w;
          if (r <= acc) { finalLength = item.l; break; }
        }
      } else {
        // Authentic Pace Length Repertoire
        const pacePool = [
          { l: 'short', w: 22 },
          { l: 'good', w: 34 },
          { l: 'slot', w: 24 },
          { l: 'yorker', w: 12 },
          { l: 'fulltoss', w: 8 }
        ];
        const r = Math.random() * 100;
        let acc = 0;
        for (const item of pacePool) {
          acc += item.w;
          if (r <= acc) { finalLength = item.l; break; }
        }
      }
    }

    let bounceRel = 0.58;
    let isFullToss = false;

    if (finalLength === 'short' || (chosenLength === 'auto' && bType === 'bouncer')) {
      bounceRel = 0.38 + (Math.random() - 0.5) * 0.04; // Short / Bouncer (36% to 40% down pitch)
    } else if (finalLength === 'good') {
      bounceRel = 0.58 + (Math.random() - 0.5) * 0.04; // Good Length (56% to 60% down pitch)
    } else if (finalLength === 'slot') {
      bounceRel = 0.74 + (Math.random() - 0.5) * 0.04; // In the Slot half-volley (72% to 76%)
    } else if (finalLength === 'yorker' || (chosenLength === 'auto' && bType === 'yorker')) {
      bounceRel = 0.91 + (Math.random() - 0.5) * 0.02; // Yorker at toes (90% to 92%)
    } else if (finalLength === 'fulltoss') {
      isFullToss = true;
      bounceRel = 1.25; // Full toss does not pitch
    }

    this.ball.isFullToss = isFullToss;
    this.ball.bounceSpotY = this.pitchTop + (this.pitchLength * bounceRel);

    // 3. Determine Line - STRICTLY RESPECTS USER FILTER & PREVENTS WIDE SPRAY
    let lineOffset = 0;
    let finalLine = chosenLine;
    if (finalLine === 'auto') {
      const lineRoll = Math.random();
      if (lineRoll < 0.04) {
        // Stray wide outside off (guideline is at cx - 24)
        lineOffset = -25 - Math.random() * 2;
      } else if (lineRoll < 0.08) {
        // Stray wide down leg (guideline is at cx + 15)
        lineOffset = +16 + Math.random() * 2;
      } else {
        // 92% right on the stumps / 4th stump corridor
        lineOffset = (Math.random() - 0.5) * 12;
      }
    } else if (finalLine === 'outside_off') {
      lineOffset = -14 + (Math.random() - 0.5) * 3; // Tight 4th stump channel (testing outside edge, NOT wide)
    } else if (finalLine === 'stumps') {
      lineOffset = (Math.random() - 0.5) * 3; // Directly hitting off / middle / leg stumps!
    } else if (finalLine === 'leg') {
      lineOffset = +9 + (Math.random() - 0.5) * 3; // On the pads / leg stump line (NOT wide)
    }

    this.ball.bounceSpotX = this.cx + lineOffset;

    // 4. Physical Dynamics, Authentic Speeds & Ball Movement (WITHOUT overwriting bounce spots!)
    switch (bType) {
      // ======================================================================
      // PACE VARIATIONS (90 - 160 km/h)
      // ======================================================================
      case 'fast':
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = config.speedKmh || Math.floor(145 + Math.random() * 7 * difficulty);
        this.ball.swingCurve = (Math.random() - 0.5) * 0.2;
        this.ball.spinLateralV = 0;
        break;

      case 'inswing':
      case 'fastmedium':
        this.bowler.actionType = 'fast_swing';
        this.ball.speedKmh = config.speedKmh || Math.floor(135 + Math.random() * 6);
        this.ball.swingCurve = +0.85; // Visibly hoops in towards stumps
        this.ball.spinLateralV = +0.35; // Cuts slightly in off pitch
        break;

      case 'outswing':
      case 'mediumfast':
      case 'swing':
        this.bowler.actionType = 'fast_swing';
        this.ball.speedKmh = config.speedKmh || Math.floor(134 + Math.random() * 6);
        this.ball.swingCurve = -0.85; // Visibly shapes away to 4th stump / slip
        this.ball.spinLateralV = -0.35; // Cuts slightly away off pitch
        break;

      case 'reverse_swing':
        this.bowler.actionType = 'slingshot';
        this.ball.speedKmh = config.speedKmh || Math.floor(142 + Math.random() * 6);
        this.ball.swingCurve = 0;
        this.ball.reverseSwingRate = +1.1; // Late vicious tail in final flight
        this.ball.spinLateralV = +0.4;
        break;

      case 'offcutter':
      case 'medium':
        this.bowler.actionType = 'fast_swing';
        this.ball.speedKmh = config.speedKmh || Math.floor(115 + Math.random() * 6);
        this.ball.swingCurve = -0.2;
        this.ball.spinLateralV = +0.65; // Grips turf and breaks in towards batsman
        break;

      case 'legcutter':
        this.bowler.actionType = 'fast_swing';
        this.ball.speedKmh = config.speedKmh || Math.floor(115 + Math.random() * 6);
        this.ball.swingCurve = +0.2;
        this.ball.spinLateralV = -0.65; // Grips turf and breaks away to off
        break;

      case 'straight_seam':
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = config.speedKmh || Math.floor(138 + Math.random() * 6);
        this.ball.swingCurve = 0;
        this.ball.spinLateralV = 0;
        break;

      case 'slow_ball':
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = config.speedKmh || Math.floor(106 + Math.random() * 6);
        this.ball.swingCurve = -0.2;
        this.ball.isSlowerBall = true;
        this.ball.spinLateralV = +0.3;
        break;

      case 'yorker':
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = config.speedKmh || Math.floor(145 + Math.random() * 6);
        this.ball.swingCurve = 0;
        this.ball.spinLateralV = 0;
        break;

      case 'bouncer':
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = config.speedKmh || Math.floor(146 + Math.random() * 6);
        this.ball.swingCurve = 0;
        this.ball.spinLateralV = 0;
        break;

      // ======================================================================
      // SPIN VARIATIONS (65 - 110 km/h) - AUTHENTIC TURN & FLIGHT DRIFT
      // ======================================================================
      case 'legbreak':
      case 'legspin':
      case 'spin':
        this.bowler.actionType = 'wrist_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(78 + Math.random() * 8 * difficulty);
        this.ball.swingCurve = +0.4; // Drifts leg side in flight
        this.ball.spinLateralV = -0.85; // Sharp turn across off stump
        break;

      case 'googly':
        this.bowler.actionType = 'wrist_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(80 + Math.random() * 7);
        this.ball.swingCurve = -0.35; // Deceptive drift away
        this.ball.spinLateralV = +0.85; // Turns sharply IN to pads/middle stump
        break;

      case 'topspinner':
        this.bowler.actionType = 'wrist_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(84 + Math.random() * 6);
        this.ball.swingCurve = 0;
        this.ball.spinLateralV = 0;
        break;

      case 'flipper':
        this.bowler.actionType = 'wrist_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(88 + Math.random() * 6);
        this.ball.swingCurve = 0;
        this.ball.spinLateralV = +0.2; // Skids low and fast under bat
        break;

      case 'drifter':
        this.bowler.actionType = 'finger_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(75 + Math.random() * 6);
        this.ball.swingCurve = -0.65; // Heavy flight drift
        this.ball.spinLateralV = -0.4;
        break;

      case 'offbreak':
      case 'offspin':
        this.bowler.actionType = 'finger_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(80 + Math.random() * 8 * difficulty);
        this.ball.swingCurve = -0.4; // Drifts away outside off in flight
        this.ball.spinLateralV = +0.85; // Rips sharply IN into right-hander's stumps
        break;

      case 'doosra':
        this.bowler.actionType = 'finger_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(82 + Math.random() * 7);
        this.ball.swingCurve = -0.25;
        this.ball.spinLateralV = -0.80; // Off-spin action that turns AWAY to off
        break;

      case 'carrom':
        this.bowler.actionType = 'unorthodox';
        this.ball.speedKmh = config.speedKmh || Math.floor(84 + Math.random() * 7);
        this.ball.swingCurve = -0.15;
        this.ball.spinLateralV = -0.45;
        break;

      case 'arm_ball':
        this.bowler.actionType = 'finger_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(88 + Math.random() * 6);
        this.ball.swingCurve = +0.3;
        this.ball.spinLateralV = 0; // Slides on with arm angle
        break;

      case 'leftarm_orthodox':
        this.bowler.actionType = 'finger_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(78 + Math.random() * 8);
        this.ball.swingCurve = +0.4;
        this.ball.spinLateralV = -0.80;
        break;

      case 'leftarm_chinaman':
        this.bowler.actionType = 'wrist_spin';
        this.ball.speedKmh = config.speedKmh || Math.floor(76 + Math.random() * 8);
        this.ball.swingCurve = -0.4;
        this.ball.spinLateralV = +0.85;
        break;

      case 'leftarm_fast':
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = config.speedKmh || Math.floor(138 + Math.random() * 7);
        this.ball.swingCurve = -0.7;
        this.ball.spinLateralV = 0;
        break;

      default:
        this.bowler.actionType = 'high_arm';
        this.ball.speedKmh = 136;
        this.ball.swingCurve = 0;
        this.ball.spinLateralV = 0;
    }

    if (config.bowlerAction || config.action) {
      this.bowler.actionType = config.bowlerAction || config.action;
    }
    if (config.skinTone) {
      this.bowler.skinTone = config.skinTone;
    }
    if (config.faceStyle) {
      this.bowler.faceStyle = config.faceStyle;
    }

    if (config.speedKmh) {
      this.ball.speedKmh = Number(config.speedKmh);
    }

    // Strictly enforce real cricket speed regulations requested by user:
    // Spinners strictly 65 - 110 km/h, Pacers strictly 90 - 160 km/h
    if (isSpinBowler) {
      this.ball.speedKmh = Math.max(65, Math.min(110, this.ball.speedKmh));
    } else {
      this.ball.speedKmh = Math.max(90, Math.min(160, this.ball.speedKmh));
    }

    // Counter-balance post-bounce seam/spin cut if bowler was commanded to target stumps
    if (finalLine === 'stumps') {
      const postBounceDrift = (this.ball.spinLateralV || 0) * 8;
      this.ball.bounceSpotX = this.cx - postBounceDrift + (Math.random() - 0.5) * 2;
    }

    return {
      variation: bType,
      label: this.ball.variationLabel || bType,
      speedKmh: this.ball.speedKmh,
      length: finalLength,
      line: finalLine,
      bowlingArm: chosenArm,
      bowlingAngle: chosenAngle
    };
  }

  releaseBall() {
    this.ball.state = 'BOWLED';
    this.ball.inPlay = true;
    this.ball.x = this.bowler.x + (this.bowler.armSide === 'left' ? -3 : 3);
    this.ball.y = this.bowlerCreaseY;
    this.ball.height = this.ball.isFullToss ? 12 : 13;
    this.ball.trail = [];

    // Realistic flight speed scaling
    const baseSpeed = (this.ball.speedKmh / 140) * 11;
    this.ball.vy = baseSpeed;

    const totalDistanceY = this.batsmanCreaseY - this.bowlerCreaseY;
    this.ball.totalFlightTimeMs = (totalDistanceY / baseSpeed) * 16.6;

    // Compensate initial velocity for aerodynamic curve so ball pitches EXACTLY on bounceSpotX
    const targetY = this.ball.isFullToss ? this.batsmanCreaseY : this.ball.bounceSpotY;
    const flightSteps = Math.max(1, (targetY - this.bowlerCreaseY) / (baseSpeed || 10));
    const swingAcc = (this.ball.swingCurve || 0) * 0.08;
    const swingDrift = 0.5 * swingAcc * Math.pow(flightSteps, 2);

    this.ball.vx = (this.ball.bounceSpotX - this.ball.x - swingDrift) / flightSteps;
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
    const isLeftHander = (this.batsmanHand === 'left');

    // For right-hander: rawLineDist < 0 is outside off, > 0 is leg
    // For left-hander: rawLineDist > 0 is outside off, < 0 is leg!
    const rawLineDist = ball.bounceSpotX - cx;
    const lineDist = isLeftHander ? -rawLineDist : rawLineDist;

    let touchSide = null;
    if (touchX !== null) {
      if (touchX < cx - 25) {
        touchSide = isLeftHander ? 'leg' : 'off';
      } else if (touchX > cx + 25) {
        touchSide = isLeftHander ? 'off' : 'leg';
      }
    }

    const lengthRel = (ball.bounceSpotY - this.pitchTop) / (this.pitchLength || 1);

    // 1. BOUNCER / SHORT LENGTH
    if (ball.lengthType === 'short' || ball.deliveryType === 'bouncer' || lengthRel < 0.50) {
      if (touchSide === 'off' || (touchSide === null && lineDist < -3)) {
        const isCut = Math.random() < 0.55;
        return {
          shotStyle: isCut ? 'square_cut' : 'upper_cut',
          aim: 'off',
          label: isCut ? 'Square Cut' : 'Upper Cut'
        };
      } else {
        const isHook = Math.random() < 0.45;
        return {
          shotStyle: isHook ? 'hook' : 'pull',
          aim: 'leg',
          label: isHook ? 'Hook Shot' : 'Swivel Pull'
        };
      }
    }

    // 2. YORKER AT THE TOES
    if (ball.lengthType === 'yorker' || ball.deliveryType === 'yorker' || lengthRel > 0.86) {
      if (touchSide === 'leg' || (touchSide === null && lineDist > 3)) {
        return { shotStyle: 'scoop', aim: 'straight', label: 'Scoop Ramp' };
      } else if (touchSide === 'off' || (touchSide === null && lineDist < -4)) {
        return { shotStyle: 'late_cut', aim: 'off', label: 'Late Cut Steer' };
      } else {
        const isBlock = Math.random() < 0.40;
        return {
          shotStyle: isBlock ? 'defense' : 'straight_drive',
          aim: 'straight',
          label: isBlock ? 'Yorker Dig Out' : 'Straight Jam Drive'
        };
      }
    }

    // 3. IN THE SLOT / FULL DRIVING LENGTH
    if (ball.lengthType === 'slot' || (lengthRel >= 0.70 && lengthRel <= 0.86)) {
      if (touchSide === 'off' || (touchSide === null && lineDist < -4)) {
        return { shotStyle: 'cover_drive', aim: 'off', label: 'Cover Drive' };
      } else if (touchSide === 'leg' || (touchSide === null && lineDist > 4)) {
        const isSweep = Math.random() < 0.45;
        return {
          shotStyle: isSweep ? 'sweep' : 'flick',
          aim: 'leg',
          label: isSweep ? 'Kneeling Sweep' : 'Wrist Flick'
        };
      } else {
        const isStep = Math.random() < 0.45;
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
      if (ball.deliveryType === 'legbreak' || ball.deliveryType === 'doosra') {
        const isRev = Math.random() < 0.35;
        return {
          shotStyle: isRev ? 'reverse_sweep' : 'cover_drive',
          aim: 'off',
          label: isRev ? 'Reverse Sweep' : 'Cover Drive'
        };
      }
      const r = Math.random();
      if (r < 0.40) {
        return { shotStyle: 'cover_drive', aim: 'off', label: 'Cover Drive' };
      } else if (r < 0.72) {
        return { shotStyle: 'square_cut', aim: 'off', label: 'Square Cut' };
      } else {
        return { shotStyle: 'late_cut', aim: 'off', label: 'Delicate Late Cut' };
      }
    } else if (touchSide === 'leg' || (touchSide === null && lineDist > 3)) {
      const isSweep = Math.random() < 0.40;
      return {
        shotStyle: isSweep ? 'sweep' : 'flick',
        aim: 'leg',
        label: isSweep ? 'Paddle Sweep' : 'Flick / On Drive'
      };
    } else {
      const isDef = Math.random() < 0.32;
      return {
        shotStyle: isDef ? 'defense' : 'straight_drive',
        aim: 'straight',
        label: isDef ? 'Forward Defense' : 'Straight Drive'
      };
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

    // Check lateral reach alignment & edge / late cut detection
    const lateralDiff = Math.abs(this.ball.x - this.batsman.x);
    const isBallOutsideOff = this.ball.x < this.batsman.x;
    const isShortBall = this.ball.lengthType === 'short' || this.ball.deliveryType === 'bouncer';

    // 1. TOP EDGE:
    // On short balls/bouncers, early or mistimed swings catch the top edge/shoulder of the bat!
    if (isShortBall && timingQuality !== 'MISS' && (timingQuality === 'EARLY' || (timingQuality === 'LATE' && Math.random() < 0.60))) {
      timingQuality = 'EDGE';
      dynamicShot.shotStyle = 'top_edge';
      dynamicShot.label = 'Top Edge Flyer';
      power = 0.50;
    }
    // 2. DELICATE LATE CUT:
    // When playing a ball outside off with late timing (-35ms to -95ms), deliberate or controlled late cut past slips!
    else if (isBallOutsideOff && timeDeltaMs < -35 && timeDeltaMs >= -95 && timingQuality !== 'MISS') {
      timingQuality = 'GOOD';
      dynamicShot.shotStyle = 'late_cut';
      dynamicShot.aim = 'off';
      dynamicShot.label = 'Delicate Late Cut';
      power = 0.70;
    }
    // 3. THICK OUTSIDE EDGE:
    // Reaching outside off stump (lateralDiff > 20) or late push outside off (-60ms to -150ms)
    else if (isBallOutsideOff && (lateralDiff > 20 || (timeDeltaMs < -60 && timeDeltaMs >= -150)) && timingQuality !== 'MISS') {
      timingQuality = 'EDGE';
      dynamicShot.shotStyle = 'outside_edge';
      dynamicShot.label = 'Thick Outside Edge';
      power = 0.42;
    }
    // 4. INSIDE EDGE:
    // Ball cutting in towards stumps/pads with late timing or cramped room
    else if (!isBallOutsideOff && (lateralDiff > 18 || (timeDeltaMs < -50 && timeDeltaMs >= -150)) && timingQuality !== 'MISS') {
      timingQuality = 'EDGE';
      dynamicShot.shotStyle = 'inside_edge';
      dynamicShot.label = 'Inside Edge';
      power = 0.38;
    } else if (lateralDiff > 42 && timingQuality !== 'MISS') {
      timingQuality = 'EDGE';
      dynamicShot.shotStyle = 'outside_edge';
      dynamicShot.label = 'Edge';
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
    if (style === 'cover_drive' || style === 'upper_cut' || style === 'reverse_sweep' || style === 'square_cut' || style === 'late_cut') return 'off';
    if (style === 'pull' || style === 'flick' || style === 'hook' || style === 'sweep' || style === 'paddle_sweep') return 'leg';
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

      case 'square_cut':
        // Horizontal slash cutting backward of point to off boundary rope
        exitAngle = -Math.PI * (0.48 + (Math.random() - 0.5) * 0.12);
        altitudeVz = timingQuality === 'PERFECT' ? 3.5 : 0.5;
        exitSpeed = 7.4 + power * 3.4;
        break;

      case 'pull':
        // Swats ball to mid-wicket / deep square leg
        exitAngle = Math.PI * 0.35 + (Math.random() - 0.5) * 0.18;
        altitudeVz = timingQuality === 'PERFECT' ? 16 : 4.0;
        break;

      case 'hook':
        // Cross-batted hook swatting over deep square leg
        exitAngle = Math.PI * (0.48 + (Math.random() - 0.5) * 0.16);
        altitudeVz = timingQuality === 'PERFECT' ? 17.0 : 4.5;
        break;

      case 'upper_cut':
        // Slices over slip cordon to third man
        exitAngle = -Math.PI * 0.45 + (Math.random() - 0.5) * 0.12;
        altitudeVz = 17.0; // High sailing cut over slips!
        break;

      case 'late_cut':
        // Delicate late cut: blade opened late, guiding backward past slips to third man!
        exitAngle = -Math.PI * (0.72 + (Math.random() - 0.5) * 0.10);
        altitudeVz = 0; // Flat skimming ground stroke
        exitSpeed = 7.0 + power * 3.4;
        break;

      case 'top_edge':
        // Sky-high top edge flyer backwards over keeper towards fine leg / third man!
        this.ball.edgeType = 'top';
        exitAngle = Math.PI * (0.84 + (Math.random() - 0.5) * 0.28);
        altitudeVz = 16.0 + Math.random() * 3.5;
        exitSpeed = 4.2 + power * 2.8;
        break;

      case 'outside_edge':
        // Thick outside edge slicing past slip cordon towards third man!
        this.ball.edgeType = 'outside';
        exitAngle = -Math.PI * (0.68 + (Math.random() - 0.5) * 0.16);
        // 40% catchable slip height vs 60% skimming turf edge to third man for 4!
        altitudeVz = Math.random() < 0.40 ? (6.5 + Math.random() * 5.0) : 0;
        exitSpeed = 6.4 + power * 3.4;
        break;

      case 'inside_edge':
        // Inside edge squirts backward past leg stump to fine leg!
        this.ball.edgeType = 'inside';
        exitAngle = Math.PI * (0.72 + (Math.random() - 0.5) * 0.14);
        altitudeVz = 0;
        exitSpeed = 5.2 + power * 3.2;
        break;

      case 'flick':
        // Supple wrists through mid-on / fine leg
        exitAngle = Math.PI * 0.22 + (Math.random() - 0.5) * 0.12;
        altitudeVz = 4.0;
        break;

      case 'sweep':
      case 'paddle_sweep':
        // Kneeling sweep shot skimming turf toward fine-leg / square-leg
        exitAngle = Math.PI * (0.65 + (Math.random() - 0.5) * 0.14);
        altitudeVz = 0.5;
        exitSpeed = 6.8 + power * 3.0;
        break;

      case 'defense':
        // Soft dead-bat block down the pitch
        exitAngle = (Math.random() - 0.5) * 0.25;
        altitudeVz = 0;
        exitSpeed = 1.6 + power * 1.2;
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

    // Deflections on early / late
    if (timingQuality === 'EARLY' && !shotStyle.includes('edge')) exitAngle += 0.30;
    if (timingQuality === 'LATE' && !shotStyle.includes('edge') && shotStyle !== 'late_cut') exitAngle -= 0.35;

    // Invert exit angle across vertical axis for Left-Handed batsman so shots go to authentic off/leg sectors!
    if (this.batsmanHand === 'left') {
      exitAngle = -exitAngle;
    }

    // Determine shot trajectory type: Six vs Four in Gap vs Aerial Four vs Gap Running 1, 2, 3
    const isLoftedSixStyle = (shotStyle === 'step_out' || shotStyle === 'scoop' || (timingQuality === 'PERFECT' && power >= 0.65 && (shotStyle === 'pull' || shotStyle === 'straight_drive' || shotStyle === 'upper_cut' || shotStyle === 'hook')));

    if (isLoftedSixStyle) {
      // 1. TOWERING MAXIMUM SIX ROCKET (Soars high above stadium stands!)
      this.ball.isAirborne = true;
      this.ball.isRocketSix = true;
      this.ball.isFourInGap = false;
      this.ball.isAerialFour = false;
      this.ball.height = 18;
      this.ball.vz = 15.5; // High towering altitude with slow majestic arc!
      exitSpeed = 4.2 + (power * 1.8);
      this.screenShake = 7;
      this.createSparks(this.ball.x, this.ball.y, '#f59e0b', 36);
      this.createRocketSmoke(this.ball.x, this.ball.y);
      this.ball.distanceMeters = Math.round(98 + power * 26 + Math.random() * 14);
      this.running.active = false;
    } else {
      this.ball.isRocketSix = false;
      // Activate interactive Running Between Wickets for all ground & gap strokes!
      this.running.active = true;
      this.running.runsCompleted = 0;
      this.running.isCallingRun = false;
      this.running.isHolding = false;
      this.running.progress = 0;
      this.running.direction = 1;
      this.running.strikerX = this.cx - 16;
      this.running.strikerY = this.batsmanCreaseY;
      this.running.nonStrikerX = this.cx + 20;
      this.running.nonStrikerY = this.bowlerCreaseY;
      this.running.isSliding = false;
      this.running.throwActive = false;
      this.running.throwProgress = 0;
      this.running.dangerLevel = 0;

      if (altitudeVz <= 5.5) {
        // Ground stroke: either a Bullet Four in Gap or Single/Double/Triple in Gap
        if (shotStyle === 'late_cut' || shotStyle === 'square_cut' || (shotStyle === 'outside_edge' && altitudeVz === 0) || timingQuality === 'PERFECT' || (timingQuality === 'GOOD' && power >= 0.52)) {
          // 2. BULLET FOUR IN GAP (Pierces the infield between fielders / steers past slips!)
          this.ball.isFourInGap = true;
          this.ball.isAerialFour = false;
          this.ball.isAirborne = false;
          this.ball.height = 0;
          this.ball.vz = 0;
          exitSpeed = 7.6 + (power * 3.4);
          this.screenShake = 3;
          this.createSparks(this.ball.x, this.ball.y, shotStyle === 'late_cut' ? '#f59e0b' : '#10b981', 20);
          this.ball.distanceMeters = Math.round(72 + power * 14);
        } else {
          // GAP STROKE FOR 1, 2, or 3 RUNS (Clean ground stroke, fielders chase)
          this.ball.isFourInGap = false;
          this.ball.isAerialFour = false;
          this.ball.isAirborne = false;
          this.ball.height = 0;
          this.ball.vz = 0;
          exitSpeed = 4.0 + (power * 2.2);
          this.createSparks(this.ball.x, this.ball.y, '#ffffff', 10);
          this.ball.distanceMeters = Math.round(35 + power * 25);
        }
      } else {
        // Lofted stroke: either an Aerial Four over infield or High Top Edge or Single in Deep Gap
        if (shotStyle === 'top_edge' || timingQuality === 'PERFECT' || (timingQuality === 'GOOD' && power >= 0.60)) {
          // 3. AERIAL FOUR OVER INFIELD / HIGH TOP EDGE FLYER
          this.ball.isFourInGap = false;
          this.ball.isAerialFour = true;
          this.ball.isAirborne = true;
          this.ball.height = shotStyle === 'top_edge' ? 14 : 12;
          this.ball.vz = altitudeVz;
          exitSpeed = shotStyle === 'top_edge' ? (4.2 + power * 2.6) : (4.8 + power * 2.8);
          this.screenShake = 3.5;
          this.createSparks(this.ball.x, this.ball.y, '#38bdf8', 22);
          this.ball.distanceMeters = Math.round(74 + power * 14);
        } else {
          // Lofted in vacant outfield for 1, 2, or 3 runs
          this.ball.isFourInGap = false;
          this.ball.isAerialFour = false;
          this.ball.isAirborne = true;
          this.ball.height = 8;
          this.ball.vz = altitudeVz * 0.7;
          exitSpeed = 3.5 + (power * 2.0);
          this.createSparks(this.ball.x, this.ball.y, '#94a3b8', 12);
          this.ball.distanceMeters = Math.round(38 + power * 22);
        }
      }
    }

    this.ball.vx = Math.sin(exitAngle) * exitSpeed;
    this.ball.vy = -Math.cos(exitAngle) * exitSpeed;
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

      // Realistic aerodynamic swing in air before bounce (perfectly matching release compensation)
      if (!this.ball.hasBounced && this.ball.swingCurve !== 0) {
        this.ball.vx += this.ball.swingCurve * 0.08 * dt;
      }

      // Late Reverse Swing in second half of flight
      if (this.ball.reverseSwingRate !== 0 && this.ball.flightProgress > 0.52) {
        this.ball.vx += this.ball.reverseSwingRate * 0.12 * dt;
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
          const isWideOff = this.ball.x < (this.cx - 36);
          const isWideLeg = this.ball.x > (this.cx + 22);
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
        const grassFriction = this.ball.isFourInGap ? 0.991 : 0.982;
        this.ball.vx *= grassFriction;
        this.ball.vy *= grassFriction;
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
        this.running.active = false;
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
          fourType: !isSix ? (this.ball.isFourInGap ? 'gap' : this.ball.isAerialFour ? 'air' : 'standard') : undefined,
          shotStyle: this.batsman.shotStyle,
          edgeType: this.ball.edgeType,
          distanceMeters: this.ball.distanceMeters || (isSix ? 96 : 68),
          landingX: isSix ? this.ball.x : undefined,
          landingY: isSix ? this.ball.y : undefined,
          crowdCheering: true
        };
      }

      // Running Between Wickets Progression (1, 2, 3 Runs, sliding bats & Direct Hit Run Outs)
      if (this.running && this.running.active) {
        const pitchSpan = this.batsmanCreaseY - this.bowlerCreaseY;

        // When batsmen are sprinting between wickets:
        if (this.running.isCallingRun) {
          // Sprint pace: ~1.1s for a single 22-yard pitch run
          this.running.progress += 0.016 * dt;
          this.running.isSliding = this.running.progress >= 0.82 && this.running.progress < 1.0;

          if (this.running.direction === 1) {
            // Striker runs from batsman crease to bowler crease (left side track)
            this.running.strikerY = this.batsmanCreaseY - this.running.progress * pitchSpan;
            // Non-striker runs from bowler crease to batsman crease (right side track)
            this.running.nonStrikerY = this.bowlerCreaseY + this.running.progress * pitchSpan;
          } else {
            // Striker returns from bowler crease to batsman crease
            this.running.strikerY = this.bowlerCreaseY + this.running.progress * pitchSpan;
            // Non-striker returns from batsman crease to bowler crease
            this.running.nonStrikerY = this.batsmanCreaseY - this.running.progress * pitchSpan;
          }

          if (this.running.progress >= 1.0) {
            this.running.runsCompleted += 1;
            this.running.progress = 0;
            this.running.direction = -this.running.direction;
            this.running.isSliding = false;
            this.running.isCallingRun = false; // Hold safe at crease unless player commands next run!

            if (this.running.runsCompleted >= 3) {
              this.running.active = false;
              this.ball.state = 'DEAD';
              return { event: 'RUNS', runs: 3 };
            }
          }
        }

        // Fielder laser throw arrival & Run-Out detection
        if (this.running.throwActive) {
          this.running.throwProgress += 0.045 * dt;
          this.running.dangerLevel = Math.min(1.0, this.running.throwProgress);

          if (this.running.throwProgress >= 1.0) {
            this.running.throwActive = false;
            // If batsman is running and has not reached popping crease safe zone (0.10 < progress < 0.82)
            if (this.running.isCallingRun && this.running.progress > 0.10 && this.running.progress < 0.82) {
              this.stumpsHit = true;
              this.running.active = false;
              this.ball.state = 'DEAD';
              this.createSparks(this.running.throwTargetX, this.running.throwTargetY, '#ef4444', 32);
              return {
                event: 'RUN_OUT',
                runs: this.running.runsCompleted,
                fielder: this.running.fielderRole || 'Fielder'
              };
            } else {
              // Safe in crease / grounded bat before throw hit stumps!
              this.createSparks(this.running.throwTargetX, this.running.throwTargetY, '#ffffff', 14);

              // If batsman is not running (holding crease or completed sprint), throw arrived at keeper/bowler!
              // The delivery concludes cleanly without waiting!
              if (!this.running.isCallingRun) {
                this.running.active = false;
                this.ball.state = 'DEAD';
                if (this.running.runsCompleted > 0) {
                  return { event: 'RUNS', runs: this.running.runsCompleted };
                } else {
                  return { event: 'DOT' };
                }
              }
            }
          }
        }

        // When ball has come to a stop or fielder gathered it:
        if (!this.ball.isAirborne && (currentSpeed < 0.28 || this.ball.isStoppedByFielder)) {
          if (this.running.isHolding || (!this.running.isCallingRun && !this.running.throwActive)) {
            this.running.active = false;
            this.ball.state = 'DEAD';
            if (this.running.runsCompleted > 0) {
              return { event: 'RUNS', runs: this.running.runsCompleted };
            } else {
              return { event: 'DOT' };
            }
          }
        }
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
