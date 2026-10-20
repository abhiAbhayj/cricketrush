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
    if (this.batsman) {
      this.batsman.x = (this.batsmanHand === 'left' ? this.cx + 3 : this.cx - 3) + (this.batsman.creaseOffsetX || 0);
    }
    if (this.nonStriker) {
      this.nonStriker.x = this.batsmanHand === 'left' ? this.cx + 42 : this.cx - 42;
    }
  }

  initDimensions() {
    this.cx = this.width / 2;
    this.cy = this.height * 0.52;
    const isPortrait = this.height > this.width;

    if (isPortrait) {
      // Authentic portrait cricket field matching reference screenshot:
      // Wider pitch strip with generous crease width and expanded 30-yard circle
      this.pitchWidth = Math.min(124, Math.max(104, this.width * 0.29));
      this.pitchTop = this.height * 0.26;
      this.pitchBottom = this.height * 0.78;
      this.pitchLength = this.pitchBottom - this.pitchTop;

      this.bowlerCreaseY = this.pitchTop + 32;
      this.batsmanCreaseY = this.pitchBottom - 34;
      this.stumpsY = this.batsmanCreaseY + 16;
      this.bowlerStumpsY = this.bowlerCreaseY - 16;
      // Scaled International Stadium Ground & Expanded 30-Yard Circle (50% Ground Radius)
      this.boundaryRadius = Math.max(560, Math.min(680, Math.max(this.width * 1.25, this.height * 0.78)));
      this.innerCircleRadiusX = Math.round(this.boundaryRadius * 0.50);
      this.innerCircleRadiusY = Math.round(this.boundaryRadius * 0.53);
    } else {
      this.pitchWidth = Math.min(136, Math.max(116, this.width * 0.32));
      this.pitchTop = this.height * 0.26;
      this.pitchBottom = this.height * 0.78;
      this.pitchLength = this.pitchBottom - this.pitchTop;

      this.bowlerCreaseY = this.pitchTop + 38;
      this.batsmanCreaseY = this.pitchBottom - 38;
      this.stumpsY = this.batsmanCreaseY + 18;
      this.bowlerStumpsY = this.bowlerCreaseY - 18;
      // Scaled International Stadium Ground & Expanded 30-Yard Circle (50% Ground Radius)
      this.boundaryRadius = Math.max(600, Math.min(720, Math.max(this.width * 0.85, this.height * 0.85)));
      this.innerCircleRadiusX = Math.round(this.boundaryRadius * 0.50);
      this.innerCircleRadiusY = Math.round(this.boundaryRadius * 0.53);
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
      trail: [],
      airTrail: [],
      groundTrail: []
    };

    if (!this.batsmanHand) {
      this.batsmanHand = 'right';
    }

    // Bowler at top crease (Right side of stumps matching Reference Screenshot)
    this.bowler = {
      x: this.cx + 14,
      y: this.pitchTop + 10,
      runUpProgress: 0,
      isBowling: false,
      bowlingArmAngle: 0,
      followThroughProgress: 0,
      armSide: 'right',
      bowlingAngle: 'over', // 'over' or 'around' the wicket
      actionType: 'high_arm', // 'high_arm', 'slingshot', 'fast_swing', 'wrist_spin', 'finger_spin', 'unorthodox'
      faceStyle: 'afro',
      skinTone: '#c68656'
    };

    // Striker Batsman at bottom crease
    const prevCreaseX = (keepFootwork && this.batsman) ? this.batsman.creaseOffsetX : 0;
    const prevStepOut = (keepFootwork && this.batsman) ? this.batsman.isSteppingOut : false;
    const prevStepOffset = (keepFootwork && this.batsman) ? this.batsman.stepOutOffset : 0;
    const prevFootwork = (keepFootwork && this.batsman) ? this.batsman.footworkState : 'stance';
    const isLHB = this.batsmanHand === 'left';

    this.batsman = {
      x: (isLHB ? this.cx + 3 : this.cx - 3) + prevCreaseX,
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
      batAngle: isLHB ? 0.3 : -0.3,
      faceStyle: 'classic',
      skinTone: '#d49b70'
    };

    // Non-striker Batsman at top crease:
    // Stands on opposite side of striker to keep bowler line-of-sight clear (Image 4 vs 5)
    this.nonStriker = {
      x: isLHB ? this.cx + 44 : this.cx - 44,
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

    // Running Between Wickets State Machine (Interactive 1, 2, 3, 4, 5 Runs & Direct Hit Run Outs)
    this.running = {
      active: false,
      runsCompleted: 0,
      isCallingRun: false,
      isHolding: false,
      progress: 0, // 0 to 1 between creases
      direction: 1, // 1: striker to bowler crease, non-striker to batsman crease; -1: returning
      strikerX: isLHB ? this.cx + 16 : this.cx - 16,
      strikerY: this.batsmanCreaseY,
      nonStrikerX: isLHB ? this.cx - 20 : this.cx + 20,
      nonStrikerY: this.bowlerCreaseY,
      isSliding: false,
      idleCreaseTimer: 0,
      queuedRun: false,
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
    if (this.running.runsCompleted >= 6) return false;
    if (this.running.isCallingRun) {
      // Seamlessly queue the next run (2nd, 3rd, 4th, 5th, 6th) so batsmen turn and sprint without stopping!
      this.running.queuedRun = true;
      return true;
    }
    this.running.isCallingRun = true;
    this.running.isHolding = false;
    this.running.queuedRun = false;
    this.running.idleCreaseTimer = 0;
    return true;
  }

  commandHold() {
    if (!this.running || !this.running.active) return false;
    this.running.isHolding = true;
    this.running.isCallingRun = false;
    this.running.queuedRun = false;
    this.running.idleCreaseTimer = 0;
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

    // 3. Left-Arm Chinaman / Unorthodox Wrist Spin (Kuldeep, Shamsi, Noor)
    if (archetype === 'leftarm_chinaman' || archetype === 'chinaman') {
      const pool = [
        { type: 'leftarm_chinaman', weight: 34, label: 'Chinaman Turn' },
        { type: 'googly', weight: 26, label: "Wrong'un Googly" },
        { type: 'flipper', weight: 20, label: 'Skid Flipper' },
        { type: 'topspinner', weight: 20, label: 'Top Spinner' }
      ];
      return this.pickWeighted(pool);
    }

    // 4. Left-Arm Orthodox Finger Spin (Jadeja, Maharaj, Axar, Santner)
    if (archetype === 'leftarm_orthodox' || archetype === 'orthodox') {
      const pool = [
        { type: 'leftarm_orthodox', weight: 34, label: 'Orthodox Turn' },
        { type: 'arm_ball', weight: 26, label: 'Skidding Arm Ball' },
        { type: 'drifter', weight: 20, label: 'Flight Drifter' },
        { type: 'topspinner', weight: 20, label: 'Top Spinner' }
      ];
      return this.pickWeighted(pool);
    }

    // 5. Express Fast (140 - 155 km/h: Straight Seam, Bouncer, Yorker, Outswing, Inswing)
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

    // 6. Fast-Medium & Medium-Fast (125 - 140 km/h: Inswing, Outswing, Reverse Swing, Off-Cutter, Leg-Cutter, Slower Ball)
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

    // 7. Medium Pace (105 - 125 km/h: Off Cutter, Leg Cutter, Slower Knuckle Ball, Straight Seam)
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
      leftarm_chinaman: 'Chinaman Turn',
      leftarm_orthodox: 'Orthodox Turn',
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
    // 1. Authentic Crease Positioning based on Arm & Over/Around the wicket
    if (chosenArm === 'left') {
      this.bowler.x = (chosenAngle === 'over') ? (this.cx - 5) : (this.cx + 7);
    } else {
      this.bowler.x = (chosenAngle === 'over') ? (this.cx + 5) : (this.cx - 7);
    }
    // Non-striker positioned cleanly on the opposite side of the bowler
    this.nonStriker.x = (this.bowler.x > this.cx) ? (this.cx - 38) : (this.cx + 38);

    // 2. Determine Pitch Bounce Spot (Length) - STRICTLY RESPECTS USER FILTER
    const isSpinBowler = bType.includes('spin') || bType.includes('break') || bType === 'googly' || bType === 'doosra' || bType === 'flipper' || bType === 'carrom' || bType === 'drifter' || bType === 'arm_ball' || rawBowlerType.includes('spin') || rawBowlerType.includes('chinaman') || rawBowlerType.includes('orthodox');

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
      bounceRel = 0.38 + (Math.random() - 0.5) * 0.04;
    } else if (finalLength === 'good') {
      bounceRel = 0.58 + (Math.random() - 0.5) * 0.04;
    } else if (finalLength === 'slot') {
      bounceRel = 0.74 + (Math.random() - 0.5) * 0.04;
    } else if (finalLength === 'yorker' || (chosenLength === 'auto' && bType === 'yorker')) {
      bounceRel = 0.91 + (Math.random() - 0.5) * 0.02;
    } else if (finalLength === 'fulltoss') {
      isFullToss = true;
      bounceRel = 1.25;
    }

    this.ball.isFullToss = isFullToss;
    this.ball.bounceSpotY = this.pitchTop + (this.pitchLength * bounceRel);

    // 3. Physical Dynamics, Real-World Cricket Speeds, Aim Line & Movement
    let swingRate = 0;
    let spinLateralV = 0;
    let defaultAimOffset = 0;
    let speedKmh = 140;

    switch (bType) {
      // PACE VARIATIONS
      case 'fast':
        this.bowler.actionType = 'high_arm';
        speedKmh = config.speedKmh || Math.floor(145 + Math.random() * 7 * difficulty);
        swingRate = 0;
        spinLateralV = 0;
        defaultAimOffset = (Math.random() - 0.5) * 3;
        break;

      case 'inswing':
      case 'fastmedium':
        this.bowler.actionType = 'fast_swing';
        speedKmh = config.speedKmh || Math.floor(134 + Math.random() * 6);
        // INSWING: Pitches outside off / corridor, curves INSIDE into batsman's pads/stumps
        defaultAimOffset = +6 + (Math.random() - 0.5) * 2;
        swingRate = -0.038;
        spinLateralV = -0.22;
        break;

      case 'outswing':
      case 'mediumfast':
      case 'swing':
        this.bowler.actionType = 'fast_swing';
        speedKmh = config.speedKmh || Math.floor(134 + Math.random() * 6);
        // OUTSWING: Starts on middle/off, shapes OUTSIDE away from right-handed batsman towards slips
        defaultAimOffset = -1 + (Math.random() - 0.5) * 2;
        swingRate = +0.040;
        spinLateralV = +0.28;
        break;

      case 'reverse_swing':
        this.bowler.actionType = 'slingshot';
        speedKmh = config.speedKmh || Math.floor(142 + Math.random() * 6);
        defaultAimOffset = +5 + (Math.random() - 0.5) * 2;
        swingRate = -0.050;
        spinLateralV = -0.30;
        break;

      case 'offcutter':
      case 'medium':
        this.bowler.actionType = 'fast_swing';
        speedKmh = config.speedKmh || Math.floor(116 + Math.random() * 6);
        // OFF-CUTTER: Grips pitch and cuts INSIDE into right-handed batsman
        defaultAimOffset = +6 + (Math.random() - 0.5) * 2;
        swingRate = 0;
        spinLateralV = -0.45;
        break;

      case 'legcutter':
        this.bowler.actionType = 'fast_swing';
        speedKmh = config.speedKmh || Math.floor(116 + Math.random() * 6);
        // LEG-CUTTER: Grips pitch and cuts OUTSIDE away from right-handed batsman
        defaultAimOffset = -2 + (Math.random() - 0.5) * 2;
        swingRate = 0;
        spinLateralV = +0.45;
        break;

      case 'straight_seam':
        this.bowler.actionType = 'high_arm';
        speedKmh = config.speedKmh || Math.floor(138 + Math.random() * 6);
        swingRate = 0;
        spinLateralV = 0;
        defaultAimOffset = (Math.random() - 0.5) * 3;
        break;

      case 'slow_ball':
        this.bowler.actionType = 'high_arm';
        speedKmh = config.speedKmh || Math.floor(105 + Math.random() * 6);
        this.ball.isSlowerBall = true;
        swingRate = +0.010;
        spinLateralV = -0.20;
        defaultAimOffset = +4 + (Math.random() - 0.5) * 2;
        break;

      case 'yorker':
        this.bowler.actionType = 'high_arm';
        speedKmh = config.speedKmh || Math.floor(145 + Math.random() * 6);
        swingRate = 0;
        spinLateralV = 0;
        defaultAimOffset = (Math.random() - 0.5) * 2;
        break;

      case 'bouncer':
        this.bowler.actionType = 'high_arm';
        speedKmh = config.speedKmh || Math.floor(146 + Math.random() * 6);
        swingRate = 0;
        spinLateralV = 0;
        defaultAimOffset = (Math.random() - 0.5) * 3;
        break;

      // SPIN VARIATIONS
      case 'legbreak':
      case 'legspin':
      case 'spin':
        this.bowler.actionType = 'wrist_spin';
        speedKmh = config.speedKmh || Math.floor(76 + Math.random() * 6 * difficulty);
        // LEG-SPIN: Pitches on middle/leg, turns OUTSIDE away from right-handed batsman towards slips!
        defaultAimOffset = -3 + (Math.random() - 0.5) * 2;
        swingRate = -0.008;
        spinLateralV = +0.65; // Turns OUTSIDE for batter!
        break;

      case 'googly':
        this.bowler.actionType = 'wrist_spin';
        speedKmh = config.speedKmh || Math.floor(78 + Math.random() * 6);
        // GOOGLY: Leg-spinner wrong'un: Pitches outside off, spins INSIDE into stumps/pads!
        defaultAimOffset = +7 + (Math.random() - 0.5) * 2;
        swingRate = +0.008;
        spinLateralV = -0.65; // Turns INSIDE into stumps!
        break;

      case 'topspinner':
        this.bowler.actionType = 'wrist_spin';
        speedKmh = config.speedKmh || Math.floor(82 + Math.random() * 6);
        defaultAimOffset = (Math.random() - 0.5) * 2;
        swingRate = 0;
        spinLateralV = 0;
        break;

      case 'flipper':
        this.bowler.actionType = 'wrist_spin';
        speedKmh = config.speedKmh || Math.floor(86 + Math.random() * 6);
        defaultAimOffset = (Math.random() - 0.5) * 2;
        swingRate = 0;
        spinLateralV = -0.15;
        break;

      case 'drifter':
        this.bowler.actionType = 'finger_spin';
        speedKmh = config.speedKmh || Math.floor(74 + Math.random() * 6);
        // DRIFTER: Drifts in air towards off, turns INSIDE
        defaultAimOffset = +8 + (Math.random() - 0.5) * 2;
        swingRate = +0.015;
        spinLateralV = -0.40;
        break;

      case 'offbreak':
      case 'offspin':
        this.bowler.actionType = 'finger_spin';
        speedKmh = config.speedKmh || Math.floor(77 + Math.random() * 6 * difficulty);
        // OFF-SPIN: Pitches outside off, turns INSIDE into right-handed batsman towards stumps!
        defaultAimOffset = +9 + (Math.random() - 0.5) * 2;
        swingRate = +0.008;
        spinLateralV = -0.65; // Turns INSIDE into stumps!
        break;

      case 'doosra':
        this.bowler.actionType = 'finger_spin';
        speedKmh = config.speedKmh || Math.floor(80 + Math.random() * 6);
        // DOOSRA: Off-spinner wrong'un: Pitches around off/middle, turns OUTSIDE away from right-handed batsman!
        defaultAimOffset = +2 + (Math.random() - 0.5) * 2;
        swingRate = -0.006;
        spinLateralV = +0.60; // Turns OUTSIDE for batter!
        break;

      case 'carrom':
        this.bowler.actionType = 'unorthodox';
        speedKmh = config.speedKmh || Math.floor(82 + Math.random() * 6);
        // CARROM BALL: Mystery flick ball: turns OUTSIDE away from batter!
        defaultAimOffset = +2 + (Math.random() - 0.5) * 2;
        swingRate = 0;
        spinLateralV = +0.50; // Turns OUTSIDE for batter!
        break;

      case 'arm_ball':
        this.bowler.actionType = 'finger_spin';
        speedKmh = config.speedKmh || Math.floor(86 + Math.random() * 6);
        // ARM BALL: Slides straight on with the arm angle towards OUTSIDE
        defaultAimOffset = -3 + (Math.random() - 0.5) * 2;
        swingRate = -0.006;
        spinLateralV = +0.10; // Slides on OUTSIDE!
        break;

      case 'leftarm_orthodox':
        this.bowler.actionType = 'finger_spin';
        speedKmh = config.speedKmh || Math.floor(76 + Math.random() * 6);
        // LEFT-ARM ORTHODOX: Turns OUTSIDE away from right-handed batsman!
        defaultAimOffset = -3 + (Math.random() - 0.5) * 2;
        swingRate = -0.008;
        spinLateralV = +0.65; // Turns OUTSIDE for batter!
        break;

      case 'leftarm_chinaman':
        this.bowler.actionType = 'wrist_spin';
        speedKmh = config.speedKmh || Math.floor(75 + Math.random() * 6);
        // LEFT-ARM CHINAMAN: Turns INSIDE into right-handed batsman!
        defaultAimOffset = +8 + (Math.random() - 0.5) * 2;
        swingRate = +0.008;
        spinLateralV = -0.65; // Turns INSIDE into stumps!
        break;

      default:
        this.bowler.actionType = 'high_arm';
        speedKmh = 136;
        swingRate = 0;
        spinLateralV = 0;
        defaultAimOffset = 0;
    }

    // Mirror lateral directions for Left-Handed Batsman
    if (this.batsmanHand === 'left') {
      swingRate = -swingRate;
      spinLateralV = -spinLateralV;
      defaultAimOffset = -defaultAimOffset;
    }

    let lineOffset = defaultAimOffset;
    if (chosenLine === 'outside_off') {
      lineOffset = (this.batsmanHand === 'left' ? -14 : +14);
    } else if (chosenLine === 'stumps') {
      lineOffset = (Math.random() - 0.5) * 3;
    } else if (chosenLine === 'leg') {
      lineOffset = (this.batsmanHand === 'left' ? +10 : -10);
    }

    this.ball.lineOffset = lineOffset;
    this.ball.swingRate = swingRate;
    this.ball.swingCurve = swingRate * 20;
    this.ball.spinLateralV = spinLateralV;
    this.ball.speedKmh = speedKmh;
    this.ball.bounceSpotX = this.cx + lineOffset;

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

    // Enforce real cricket speed regulations
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
      line: chosenLine,
      bowlingArm: chosenArm,
      bowlingAngle: chosenAngle
    };
  }

  releaseBall() {
    this.ball.state = 'BOWLED';
    this.ball.inPlay = true;
    const armOffsetX = this.bowler.armSide === 'left' ? -4 : 4;
    this.ball.x = this.bowler.x + armOffsetX;
    this.ball.y = this.bowlerCreaseY - 12; // High-arm release overhead behind bowling crease
    this.ball.releaseX = this.ball.x;
    this.ball.releaseY = this.ball.y;
    this.bowler.followThroughProgress = 0;
    this.ball.height = this.ball.isFullToss ? 12 : 24;
    this.ball.releaseHeight = this.ball.height;
    this.ball.hasBounced = false;
    this.ball.bounceApexHeight = 15;
    this.ball.bounceImpactX = null;
    this.ball.bounceImpactY = null;
    this.ball.bounceTime = 0;
    this.ball.trail = [{ x: this.ball.x, y: this.ball.y, hasBounced: false }];

    // Authentic Cricket Pitch Flight Calibration:
    // Pace (140-155 km/h) -> 5.2 - 6.0 px/f (0.52 - 0.58s reaction time)
    // Medium / Cutters (105-125 km/h) -> 4.2 - 4.8 px/f (0.65 - 0.74s)
    // Spin (70-88 km/h) -> 2.8 - 3.4 px/f (0.95 - 1.15s authentic loopy flight, drift & turn)
    const isSpin = this.ball.speedKmh <= 95 ||
      this.ball.archetype?.includes('spin') ||
      this.ball.archetype?.includes('chinaman') ||
      this.ball.archetype?.includes('orthodox');
    const baseSpeed = isSpin
      ? Math.max(2.8, Math.min(3.4, 2.9 + ((this.ball.speedKmh - 70) / 25) * 0.5))
      : Math.max(4.2, Math.min(6.0, 4.4 + ((this.ball.speedKmh - 95) / 65) * 1.6));
    this.ball.vy = baseSpeed;

    const totalDistanceY = this.batsmanCreaseY - (this.bowlerCreaseY - 12);
    this.ball.totalFlightTimeMs = (totalDistanceY / baseSpeed) * 16.6;

    // Compensate initial velocity for aerodynamic curve so ball pitches EXACTLY on bounceSpotX
    const targetY = this.ball.isFullToss ? this.batsmanCreaseY : this.ball.bounceSpotY;
    const flightSteps = Math.max(1, (targetY - (this.bowlerCreaseY - 12)) / (baseSpeed || 10));
    const swingDrift = 0.5 * (this.ball.swingRate || 0) * Math.pow(flightSteps, 2);

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
    this.ball.airTrail = [{ x: this.ball.x, y: this.ball.y - this.ball.height }];
    this.ball.groundTrail = [{ x: this.ball.x, y: this.ball.y }];

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
      // Smallest six is strictly 80m, largest is strictly 110m based on timing power [0.0 - 1.0]
      const clampedPower = Math.min(1.0, Math.max(0, power));
      this.ball.distanceMeters = Math.min(110, Math.max(80, Math.round(80 + clampedPower * 30)));
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
      this.running.idleCreaseTimer = 0;
      this.running.queuedRun = false;
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

    if (this.batsmanHand === 'left') {
      exitAngle = -exitAngle;
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
      this.bowler.followThroughProgress = 0;

      // Realistic high-arm bowling wind-up:
      // Gathering stride (0 -> 0.65) then overhead windmill delivery (0.65 -> 1.0)
      if (this.bowler.runUpProgress < 0.65) {
        this.bowler.bowlingArmAngle = Math.sin(this.bowler.runUpProgress * Math.PI * 6) * 0.35;
      } else {
        const windProgress = (this.bowler.runUpProgress - 0.65) / 0.35;
        this.bowler.bowlingArmAngle = -Math.PI * 0.8 + (windProgress * Math.PI * 0.8);
      }

      // Dynamic Batsman Footwork & Trigger Movement during run-up!
      this.batsman.stanceProgress = (this.batsman.stanceProgress + 0.14 * dt) % (Math.PI * 2);
      this.batsman.triggerTap = Math.abs(Math.sin(this.batsman.stanceProgress * 3)) * 3;
      this.batsman.weightShiftX = Math.sin(this.batsman.stanceProgress) * 2;

      if (this.bowler.runUpProgress >= 1.0) {
        this.bowler.isBowling = false;
        this.bowler.bowlingArmAngle = 0; // High-arm vertical delivery apex!
        this.releaseBall();
      }
    } else {
      if (this.ball.state === 'BOWLED') {
        this.bowler.followThroughProgress = Math.min(1.0, (this.bowler.followThroughProgress || 0) + 0.08 * dt);
      }
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
      const startDeliveryY = this.bowlerCreaseY - 12;
      const currentDistY = this.ball.y - startDeliveryY;
      const totalDistY = effectiveBatsmanY - startDeliveryY;
      this.ball.flightProgress = Math.min(1.0, Math.max(0, currentDistY / totalDistY));
      this.ball.timeUntilArrivalMs = Math.max(0, ((effectiveBatsmanY - this.ball.y) / (this.ball.vy || 10)) * 16.6);

      // PRE-BOUNCE: Aerodynamic Swing & Parabolic Descent from High-Arm (24px) down to Dirt (0px)
      if (!this.ball.hasBounced) {
        // Continuous aerodynamic swing in air (precisely calibrated to match releaseBall drift)
        if (this.ball.swingRate) {
          this.ball.vx += this.ball.swingRate * dt;
        }

        // Late Reverse Swing in second half of flight
        if (this.ball.reverseSwingRate !== 0 && this.ball.flightProgress > 0.45) {
          this.ball.vx += this.ball.reverseSwingRate * 0.14 * dt;
        }

        // Slower ball dipper deceleration in mid-air
        if (this.ball.isSlowerBall && this.ball.flightProgress > 0.42) {
          this.ball.vy *= 0.982;
        }

        // 2.5D Parabolic Height Drop from High-Arm (24px) down to Dirt (0px):
        const distToBounce = Math.max(1, this.ball.bounceSpotY - startDeliveryY);
        const progressToBounce = Math.min(1.0, Math.max(0, (this.ball.y - startDeliveryY) / distToBounce));

        // Descends parabolically to touch the pitch surface (h = 0) at the bounce spot!
        this.ball.height = Math.max(0, (this.ball.releaseHeight || 24) * Math.pow(1 - progressToBounce, 1.35));

        // Pitch bounce detection with variation-specific kick & bounce heights
        if (!this.ball.isFullToss && this.ball.y >= this.ball.bounceSpotY) {
          this.ball.hasBounced = true;
          this.ball.height = 0; // Strictly touches down on the dirt!
          this.ball.bounceImpactX = this.ball.x;
          this.ball.bounceImpactY = this.ball.y;
          this.ball.bounceTime = Date.now();
          this.createPitchDust(this.ball.x, this.ball.y);

          // Variation-specific rebound apex heights:
          if (this.ball.lengthType === 'short' || this.ball.deliveryType === 'bouncer') {
            this.ball.bounceApexHeight = 24; // Bouncer kicks up to helmet height
          } else if (this.ball.deliveryType === 'topspinner') {
            this.ball.bounceApexHeight = 21; // Steep bounce topspinner
          } else if (this.ball.deliveryType === 'flipper') {
            this.ball.bounceApexHeight = 4.5; // Skids fast and low under willow
            this.ball.vy *= 1.08;
          } else if (this.ball.deliveryType === 'yorker') {
            this.ball.bounceApexHeight = 2.0; // Toe-crushing yorker
          } else if (this.ball.lengthType === 'slot') {
            this.ball.bounceApexHeight = 8.5; // Half-volley in the slot
          } else {
            this.ball.bounceApexHeight = 15; // Good length waist height
          }

          // VISIBLE SHARP LATERAL TURN / SEAM BREAK OFF THE DECK:
          if (this.ball.spinLateralV !== 0) {
            this.ball.vx += this.ball.spinLateralV * 1.5; // Sharp deviation off pitch!
          }
        }
      } else {
        // POST-BOUNCE: Rebound Parabolic Arc Rises from Dirt towards Batsman
        const distAfterBounce = Math.max(1, effectiveBatsmanY - this.ball.bounceSpotY);
        const progressAfterBounce = Math.min(1.0, Math.max(0, (this.ball.y - this.ball.bounceSpotY) / distAfterBounce));

        const apexHeight = this.ball.bounceApexHeight || 15;
        this.ball.height = Math.max(0, apexHeight * Math.sin(progressAfterBounce * Math.PI * 0.85));
      }

      // Track trajectory trail with bounce state for broadcast virtual-eye drawing
      this.ball.trail.push({
        x: this.ball.x,
        y: this.ball.y - this.ball.height,
        hasBounced: this.ball.hasBounced
      });
      if (this.ball.trail.length > 120) this.ball.trail.shift();

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

          // 1. MCC Regulation Law 21.7: Ball pitching off the pitch strip or outside return crease is a NO BALL!
          const halfPitch = (this.pitchWidth || 116) / 2;
          const pitchedOffPitch = this.ball.hasBounced && this.ball.bounceImpactX && Math.abs(this.ball.bounceImpactX - this.cx) > (halfPitch - 2);
          const wayOffPitch = Math.abs(this.ball.x - this.cx) > (halfPitch + 8);

          if (pitchedOffPitch || wayOffPitch) {
            return {
              event: 'NO_BALL',
              runs: 1,
              reason: 'PITCHED_OFF_PITCH',
              text: 'NO BALL! (Pitched off the pitch strip)'
            };
          }

          // 2. Regulation ICC Cricket Wide Ball rule (within pitch strip, but outside extended guidelines)
          const isWideOff = this.batsmanHand === 'left' ? this.ball.x < (this.cx - 32) : this.ball.x > (this.cx + 32);
          const isWideLeg = this.batsmanHand === 'left' ? this.ball.x > (this.cx + 20) : this.ball.x < (this.cx - 20);
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

      if (!this.ball.airTrail) this.ball.airTrail = [];
      if (!this.ball.groundTrail) this.ball.groundTrail = [];
      this.ball.airTrail.push({ x: this.ball.x, y: this.ball.y - this.ball.height });
      this.ball.groundTrail.push({ x: this.ball.x, y: this.ball.y });
      if (this.ball.airTrail.length > 60) this.ball.airTrail.shift();
      if (this.ball.groundTrail.length > 60) this.ball.groundTrail.shift();
      this.ball.trail = this.ball.airTrail;

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

      // Active Bowler Fielding & Chase towards nearby ball!
      const distBowlerToBall = Math.hypot(this.ball.x - this.bowler.x, this.ball.y - this.bowler.y);
      if (distBowlerToBall < 220 && this.ball.y < this.batsmanCreaseY - 15 && !this.ball.isStoppedByFielder && !this.running.throwActive) {
        const bdx = this.ball.x - this.bowler.x;
        const bdy = this.ball.y - this.bowler.y;
        const bdist = Math.hypot(bdx, bdy);
        if (bdist > 8) {
          this.bowler.x += (bdx / bdist) * 2.8 * dt;
          this.bowler.y += (bdy / bdist) * 2.8 * dt;
          this.bowler.isFielding = true;
        }

        // Bowler Interception Check:
        if (bdist < 26) {
          if (this.ball.isAirborne && this.ball.height < 24) {
            this.ball.state = 'DEAD';
            this.running.active = false;
            this.bowler.isFielding = false;
            this.screenShake = 6;
            this.createSparks(this.bowler.x, this.bowler.y, '#ef4444', 25);
            return {
              event: 'CAUGHT',
              fielder: 'Bowler (Caught & Bowled)',
              shotStyle: this.batsman.shotStyle
            };
          } else if (!this.ball.isAirborne || this.ball.height < 4) {
            this.ball.isStoppedByFielder = true;
            this.ball.vx = 0;
            this.ball.vy = 0;
            this.bowler.isFielding = false;
            this.running.throwActive = true;
            this.running.throwProgress = 0;
            this.running.throwFromX = this.bowler.x;
            this.running.throwFromY = this.bowler.y;
            this.running.throwTargetX = this.cx;
            this.running.throwTargetY = this.batsmanCreaseY;
            this.running.throwTargetEnd = 'batsman';
            this.running.fielderRole = 'Bowler';
          }
        }
      } else if (distBowlerToBall >= 220) {
        // Ball hit deep into the outfield: Bowler tracks back to top stumps to receive throw
        this.bowler.x += (this.cx + 8 - this.bowler.x) * 0.05 * dt;
        this.bowler.y += (this.bowlerStumpsY - this.bowler.y) * 0.05 * dt;
      }

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
            distanceMeters: Math.min(110, Math.max(80, this.ball.distanceMeters || 95)),
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
          distanceMeters: isSix ? Math.min(110, Math.max(80, this.ball.distanceMeters || 92)) : (this.ball.distanceMeters || 68),
          landingX: isSix ? this.ball.x : undefined,
          landingY: isSix ? this.ball.y : undefined,
          crowdCheering: true
        };
      }

      // Running Between Wickets Progression (1, 2, 3, 4, 5 Runs, sliding bats & Direct Hit Run Outs)
      if (this.running && this.running.active) {
        const pitchSpan = this.batsmanCreaseY - this.bowlerCreaseY;

        // When batsmen are sprinting between wickets:
        if (this.running.isCallingRun) {
          // Fast athletic sprint pace: ~0.7s per 22-yard pitch run
          this.running.progress += 0.024 * dt;
          this.running.isSliding = this.running.progress >= 0.78 && this.running.progress < 1.0;

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

            if (this.running.queuedRun) {
              this.running.queuedRun = false;
              this.running.isCallingRun = true;
              this.running.idleCreaseTimer = 0;
            } else {
              this.running.isCallingRun = false; // Hold safe at crease unless player commands next run!
              this.running.idleCreaseTimer = 75; // ~1.25s grace window for player to call or queue next run!
            }

            if (this.running.runsCompleted >= 6) {
              this.running.active = false;
              this.ball.state = 'DEAD';
              return { event: 'RUNS', runs: this.running.runsCompleted };
            }
          }
        } else if (this.running.idleCreaseTimer > 0) {
          this.running.idleCreaseTimer -= dt;
        }

        // Fielder realistic throw arrival & Run-Out detection
        if (this.running.throwActive) {
          const throwFromX = this.running.throwFromX ?? this.cx;
          const throwFromY = this.running.throwFromY ?? 0;
          const throwTargetX = this.running.throwTargetX ?? this.cx;
          const throwTargetY = this.running.throwTargetY ?? this.stumpsY;
          const throwDist = Math.hypot(throwTargetX - throwFromX, throwTargetY - throwFromY);
          const throwRate = Math.max(0.012, Math.min(0.024, 2.8 / Math.max(80, throwDist)));

          this.running.throwProgress += throwRate * dt;
          this.running.dangerLevel = Math.min(1.0, this.running.throwProgress);

          if (this.running.throwProgress >= 1.0) {
            this.running.throwActive = false;
            // If batsman is running and has not reached popping crease safe zone (0.12 < progress < 0.78)
            if (this.running.isCallingRun && this.running.progress > 0.12 && this.running.progress < 0.78) {
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
              // The delivery concludes cleanly without waiting once idle grace timer expires!
              if (!this.running.isCallingRun && (!this.running.idleCreaseTimer || this.running.idleCreaseTimer <= 0)) {
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
          if (this.running.isHolding || (!this.running.isCallingRun && !this.running.throwActive && (!this.running.idleCreaseTimer || this.running.idleCreaseTimer <= 0))) {
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

  signalUmpire() {}
}

