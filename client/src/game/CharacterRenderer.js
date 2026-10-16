// Realistic 2D Humanoid Cricket Characters, Facial Textures, Distinct Bowling Actions & Full Shot Geometries

export const CharacterRenderer = {
  /**
   * Draw Humanoid Striker Batsman with customizable faces, facial hair, helmet, pads, and distinct shot postures
   */
  drawBatsman(ctx, x, y, {
    isSwinging = false,
    swingProgress = 0,
    swingType = 'straight',
    shotStyle = 'straight_drive', // 'cover_drive', 'straight_drive', 'pull', 'upper_cut', 'flick', 'reverse_sweep', 'scoop', 'step_out', 'square_cut', 'hook', 'sweep', 'defense'
    isSteppingOut = false,
    stepOutOffset = 0,
    triggerTap = 0,
    weightShiftX = 0,
    footworkState = 'stance', // 'stance', 'shuffling_left', 'shuffling_right', 'stepping_out'
    isLeftHanded = false,
    batSkin = 'willow',
    jerseyColor = '#2563eb',
    skinTone = '#d49b70',
    faceStyle = 'beard' // 'classic', 'beard', 'stubble', 'headband'
  }) {
    ctx.save();
    // Dynamic footwork & stride interpolation
    const visualX = x + (isSwinging ? 0 : weightShiftX);
    const visualY = y - (isSteppingOut ? stepOutOffset : 0);
    ctx.translate(visualX, visualY);

    // Left-handed batsman authentic horizontal mirroring
    if (isLeftHanded) {
      ctx.scale(-1, 1);
    }

    // 1. Dynamic Humanoid Ground Shadow (shrinks/sharpens when jumping/stepping)
    ctx.beginPath();
    ctx.ellipse(0, 10, isSteppingOut ? 11 : 14, isSteppingOut ? 4.5 : 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();

    // 2. Batting Leg Pads & Cricket Spikes (Contoured Shin Guards with Straps & Foot Strides)
    let padOffsetLeft = -7;
    let padOffsetRight = 3;
    let padLeftY = 3;
    let padRightY = 4;

    if (isSteppingOut) {
      // Big aggressive forward stride down the track!
      padOffsetLeft = -6;
      padLeftY = -6; // Front foot stepped forward towards bowler!
      padOffsetRight = 4;
      padRightY = 8; // Back foot dragged on toe
    } else if (footworkState === 'shuffling_left') {
      // Backing away to off side
      padOffsetLeft = -12;
      padOffsetRight = 0;
    } else if (footworkState === 'shuffling_right') {
      // Shuffling across to leg side
      padOffsetLeft = -2;
      padOffsetRight = 10;
    } else if (shotStyle === 'pull') {
      padOffsetLeft = -11;
      padOffsetRight = 4;
    } else if (shotStyle === 'reverse_sweep') {
      padOffsetLeft = 4;
      padOffsetRight = -7;
    } else if (shotStyle === 'scoop') {
      padOffsetLeft = -5;
      padOffsetRight = 5;
    }

    // Tapping toe footwork while waiting in stance
    if (!isSwinging && !isSteppingOut) {
      padLeftY += triggerTap * 0.35;
    }

    // Left Batting Pad
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(padOffsetLeft, padLeftY, 6.5, 13, 3);
    ctx.fill();
    ctx.stroke();

    // Right Batting Pad
    ctx.beginPath();
    ctx.roundRect(padOffsetRight, padRightY, 6.5, 13, 3);
    ctx.fill();
    ctx.stroke();

    // Pad horizontal ribbed contours & straps
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(padOffsetLeft, padLeftY + 4); ctx.lineTo(padOffsetLeft + 6.5, padLeftY + 4);
    ctx.moveTo(padOffsetLeft, padLeftY + 8); ctx.lineTo(padOffsetLeft + 6.5, padLeftY + 8);
    ctx.moveTo(padOffsetRight, padRightY + 4); ctx.lineTo(padOffsetRight + 6.5, padRightY + 4);
    ctx.moveTo(padOffsetRight, padRightY + 8); ctx.lineTo(padOffsetRight + 6.5, padRightY + 8);
    ctx.stroke();

    // Cricket Spikes / Shoes (White leather with rubber soles)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.8;
    // Left Shoe
    ctx.beginPath();
    ctx.roundRect(padOffsetLeft - 0.5, padLeftY + 13, 7.5, 4, 1.5);
    ctx.fill();
    ctx.stroke();
    // Right Shoe
    ctx.beginPath();
    ctx.roundRect(padOffsetRight - 0.5, padRightY + 13, 7.5, 4, 1.5);
    ctx.fill();
    ctx.stroke();

    // 3. Torso & Broad Shoulders in Team Jersey
    ctx.save();
    let bodyRotation = 0;
    if (shotStyle === 'pull') bodyRotation = 0.48;
    else if (shotStyle === 'cover_drive') bodyRotation = -0.38;
    else if (shotStyle === 'reverse_sweep') bodyRotation = 0.95;
    else if (shotStyle === 'upper_cut') bodyRotation = -0.25;
    else if (shotStyle === 'flick') bodyRotation = 0.28;
    ctx.rotate(bodyRotation);

    ctx.fillStyle = jerseyColor;
    ctx.beginPath();
    ctx.roundRect(-10, -8, 20, 14, 4);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Collar & Chest Crest
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-4, -8); ctx.lineTo(0, -4.5); ctx.lineTo(4, -8);
    ctx.stroke();
    // Sponsor stripe across chest
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(-8, -2, 16, 3);
    ctx.restore();

    // 4. Detailed Batsman Head, Facial Textures & Helmet
    // Neck
    ctx.fillStyle = skinTone;
    ctx.fillRect(-2.5, -9, 5, 3);

    // Helmet Dome (Crisp White Batting Helmet - Image 2)
    ctx.beginPath();
    ctx.arc(0, -11, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff'; // White batting helmet
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Helmet Peak / Visor (Facing Bowler)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, -16, 5.5, 2.5, 0, 0, Math.PI);
    ctx.fill();

    // Face Window underneath helmet visor
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.ellipse(0, -11.5, 4.5, 3, 0, 0, Math.PI);
    ctx.fill();

    // Facial Textures (Beard / Stubble / Classic / Headband)
    if (faceStyle === 'beard') {
      // Trimmed dark beard along jawline and chin
      ctx.fillStyle = '#1e1b18';
      ctx.beginPath();
      ctx.ellipse(0, -9.5, 3.8, 1.8, 0, 0, Math.PI);
      ctx.fill();
      // Moustache
      ctx.fillRect(-2.5, -10.8, 5, 1);
    } else if (faceStyle === 'stubble') {
      ctx.fillStyle = 'rgba(30, 27, 24, 0.45)';
      ctx.fillRect(-3, -10.5, 6, 2.2);
    } else if (faceStyle === 'headband') {
      ctx.fillStyle = '#ef4444'; // Red headband
      ctx.fillRect(-4, -14, 8, 1.5);
    }

    // Facial Features: Eyes & Eyebrows focused on bowler
    ctx.fillStyle = '#0f172a';
    // Left eye & brow
    ctx.fillRect(-2.8, -13, 2, 1);
    ctx.beginPath(); ctx.arc(-2, -11.5, 0.9, 0, Math.PI * 2); ctx.fill();
    // Right eye & brow
    ctx.fillRect(0.8, -13, 2, 1);
    ctx.beginPath(); ctx.arc(2, -11.5, 0.9, 0, Math.PI * 2); ctx.fill();

    // Protective Steel Face Grille & Ear Protectors
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-4, -14); ctx.lineTo(-4, -9.5);
    ctx.moveTo(-1.5, -15); ctx.lineTo(-1.5, -9.5);
    ctx.moveTo(1.5, -15); ctx.lineTo(1.5, -9.5);
    ctx.moveTo(4, -14); ctx.lineTo(4, -9.5);
    // Horizontal chin bar
    ctx.moveTo(-4.5, -10); ctx.lineTo(4.5, -10);
    ctx.stroke();

    // 5. Realistic Arms, Batting Gloves and Bat Shot Physics
    ctx.save();
    let batAngle = 0.15;
    let reachX = 4;
    let reachY = 2;

    if (isSwinging) {
      const swingRatio = Math.sin(swingProgress * Math.PI);

      if (shotStyle === 'cover_drive') {
        // High left elbow, bent front knee, flowing drive through extra cover
        reachX = 4 - swingRatio * 9;
        reachY = 2 - swingRatio * 13;
        batAngle = 0.2 - swingRatio * 2.8;
      } else if (shotStyle === 'square_cut') {
        // Horizontal slash cutting backward of point to off boundary rope
        reachX = 4 + swingRatio * 9;
        reachY = 2 - swingRatio * 8;
        batAngle = -0.45 - swingRatio * 1.8;
      } else if (shotStyle === 'pull') {
        // Horizontal bat pull stroke across to deep mid-wicket
        reachX = 4 + swingRatio * 5;
        reachY = 2 - swingRatio * 6;
        batAngle = 0.1 + swingRatio * 2.6;
      } else if (shotStyle === 'hook') {
        // Cross-batted hook shot swatting over deep square leg
        reachX = 4 + swingRatio * 7;
        reachY = 2 - swingRatio * 11;
        batAngle = 0.15 + swingRatio * 3.0;
      } else if (shotStyle === 'sweep' || shotStyle === 'paddle_sweep') {
        // Kneeling sweep shot skimming turf toward fine-leg / square-leg
        reachX = -2 - swingRatio * 7;
        reachY = 2 - swingRatio * 8;
        batAngle = 0.35 + swingRatio * 2.2;
      } else if (shotStyle === 'defense') {
        // Soft dead-bat block down the pitch
        reachX = 2 - swingRatio * 2;
        reachY = 2 - swingRatio * 7;
        batAngle = 0.05 - swingRatio * 1.2;
      } else if (shotStyle === 'upper_cut') {
        // Leaning back, slicing vertically over slips to third man
        reachX = 4 + swingRatio * 7;
        reachY = 2 - swingRatio * 10;
        batAngle = 0.1 - swingRatio * 1.8;
      } else if (shotStyle === 'flick') {
        // Supple wrist flick to mid-on / square leg
        reachX = 4 - swingRatio * 6;
        reachY = 2 - swingRatio * 11;
        batAngle = 0.15 + swingRatio * 2.4;
      } else if (shotStyle === 'reverse_sweep') {
        // Hands swapped, rolling blade down to third man
        reachX = -4 + swingRatio * 8;
        reachY = 2 - swingRatio * 6;
        batAngle = -0.4 - swingRatio * 2.5;
      } else if (shotStyle === 'scoop') {
        // Low squat, ramping ball backwards over wicket keeper
        reachX = 2;
        reachY = 0 - swingRatio * 5;
        batAngle = 0.2 - swingRatio * 1.6;
      } else if (shotStyle === 'late_cut') {
        // Delicate late cut: blade opened late, guiding backward past slips
        reachX = 4 + swingRatio * 6;
        reachY = 2 - swingRatio * 4;
        batAngle = -0.35 - swingRatio * 1.5;
      } else if (shotStyle === 'top_edge') {
        // High top edge: bat swung high, checking through bouncer
        reachX = 3 + swingRatio * 4;
        reachY = 2 - swingRatio * 12;
        batAngle = 0.2 + swingRatio * 1.8;
      } else if (shotStyle === 'outside_edge' || shotStyle === 'inside_edge') {
        // Edge deflection: bat held firm on contact line
        reachX = 4 + swingRatio * 3;
        reachY = 2 - swingRatio * 7;
        batAngle = 0.05 - swingRatio * 1.6;
      } else if (shotStyle === 'step_out') {
        // Stepping out down the pitch, massive high loft
        reachX = 2;
        reachY = 2 - swingRatio * 16;
        batAngle = 0.15 - swingRatio * 3.4;
      } else {
        // Default straight drive / loft (High along vertical axis)
        reachX = 4 - swingRatio * 3;
        reachY = 2 - swingRatio * 14;
        batAngle = 0.15 - swingRatio * 3.3;
      }
    } else {
      // Authentic batsman stance: hands at waist, bat blade grounded tapping pitch behind crease
      reachX = 3;
      reachY = 2 + triggerTap * 0.4;
      batAngle = 0.12 + (triggerTap * 0.08);
    }

    // Arms in Team Jersey
    ctx.strokeStyle = jerseyColor;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    // Back arm (from right shoulder)
    ctx.beginPath();
    ctx.moveTo(6, -4);
    ctx.lineTo(reachX + 2, reachY);
    ctx.stroke();
    // Front arm (from left shoulder with elbow articulation)
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.lineTo(reachX - 2, reachY - 2);
    ctx.stroke();

    // Batting Gloves with white foam sausage padding & palm grip
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(reachX - 1, reachY - 2, 3.6, 0, Math.PI * 2);
    ctx.arc(reachX + 1, reachY + 1, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // Glove padding ridges
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(reachX - 3, reachY - 2); ctx.lineTo(reachX + 1, reachY - 2);
    ctx.moveTo(reachX - 1, reachY + 1); ctx.lineTo(reachX + 3, reachY + 1);
    ctx.stroke();

    // ========================================================================
    // Realistic Cricket Bat with Grain Texture, Wood Splice & Profile Spine
    // Bat Origin is at Hands: Handle extends up to hands, Blade extends down to pitch
    // ========================================================================
    ctx.translate(reachX, reachY);
    ctx.rotate(batAngle);

    let bladeColor = '#d97706'; // English willow natural golden grain
    let spineColor = '#b45309';
    let stickerColor = '#2563eb';

    if (batSkin === 'flame') {
      bladeColor = '#ef4444'; spineColor = '#b91c1c'; stickerColor = '#f59e0b';
    } else if (batSkin === 'carbon') {
      bladeColor = '#1e293b'; spineColor = '#0f172a'; stickerColor = '#10b981';
    } else if (batSkin === 'gold') {
      bladeColor = '#eab308'; spineColor = '#ca8a04'; stickerColor = '#ffffff';
    } else if (batSkin === 'kahuna') {
      bladeColor = '#d97706'; spineColor = '#15803d'; stickerColor = '#22c55e';
    } else if (batSkin === 'mrf') {
      bladeColor = '#d97706'; spineColor = '#dc2626'; stickerColor = '#ef4444';
    } else if (batSkin === 'spartan') {
      bladeColor = '#d97706'; spineColor = '#c2410c'; stickerColor = '#f97316';
    } else if (batSkin === 'legend') {
      bladeColor = '#b45309'; spineColor = '#78350f'; stickerColor = '#dc2626';
    } else if (batSkin === 'cyber') {
      bladeColor = '#064e3b'; spineColor = '#022c22'; stickerColor = '#10b981';
    } else if (batSkin === 'diamond') {
      bladeColor = '#f8fafc'; spineColor = '#cbd5e1'; stickerColor = '#38bdf8';
    } else if (batSkin === 'vintage') {
      bladeColor = '#92400e'; spineColor = '#78350f'; stickerColor = '#1e293b';
    } else if (batSkin === 'titan') {
      bladeColor = '#475569'; spineColor = '#334155'; stickerColor = '#a855f7';
    }

    // Cylindrical Cane Handle with Chevron Rubber Grip (held in gloves, extending UP towards hips)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(-1.5, -10, 3, 10);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 0.6;
    for (let gy = -9; gy <= -2; gy += 2) {
      ctx.beginPath(); ctx.moveTo(-1.5, gy); ctx.lineTo(1.5, gy); ctx.stroke();
    }
    // Handle rubber end cap / pommel
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-2, -11, 4, 1.5);

    // Traditional Wood V-Splice at Top of Blade
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(-2, 0); ctx.lineTo(0, 3); ctx.lineTo(2, 0);
    ctx.fill();

    // Willow Blade with Contoured Sweet Spot extending DOWN to pitch turf
    ctx.fillStyle = bladeColor;
    ctx.beginPath();
    ctx.moveTo(-3.2, 0.5);
    ctx.lineTo(3.2, 0.5);
    ctx.lineTo(4.2, 13); // Sweet spot swell
    ctx.lineTo(3.2, 20);  // Tapered toe
    ctx.lineTo(-3.2, 20);
    ctx.lineTo(-4.2, 13);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = spineColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Central Profile Spine (3D wood edge contour)
    ctx.strokeStyle = spineColor;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 1.5);
    ctx.lineTo(0, 18);
    ctx.stroke();

    // Bat Manufacturer Brand Sticker
    ctx.fillStyle = stickerColor;
    ctx.fillRect(-2.5, 3.5, 5, 4);

    // Rubber Toe Guard (protects base from moisture & yorker impact on turf)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-3, 19.5, 6, 2);

    ctx.restore();
    ctx.restore();
  },

  /**
   * Draw Bowler with distinct bowling action animations and facial textures
   * Actions: 'high_arm', 'slingshot', 'fast_swing', 'wrist_spin', 'finger_spin', 'unorthodox'
   */
  drawBowler(ctx, x, y, {
    runUpProgress = 0,
    bowlingArmAngle = 0,
    actionType = 'high_arm',
    armSide = 'right',
    skinTone = '#c68656',
    faceStyle = 'headband' // 'headband', 'beard', 'classic', 'spiky'
  }) {
    ctx.save();
    ctx.translate(x, y);

    // Ground Shadow
    ctx.beginPath();
    ctx.ellipse(0, 8, 12, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Athletic Running Stride (Red Athletic Trousers with White Stripe - Image 2)
    const stride = Math.sin(runUpProgress * Math.PI * 8) * 5.5;
    // Red athletic trousers
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(-7, 2 - stride, 5.5, 10, 2);
    ctx.roundRect(2, 2 + stride, 5.5, 10, 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Crisp White Athletic Side Stripes (Image 2)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7, 2 - stride, 1.4, 10);
    ctx.fillRect(6.1, 2 + stride, 1.4, 10);

    // Black Athletic Shoes with White Soles
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-7, 11.5 - stride, 5.5, 2.5);
    ctx.fillRect(2, 11.5 + stride, 5.5, 2.5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7, 13.5 - stride, 5.5, 1);
    ctx.fillRect(2, 13.5 + stride, 5.5, 1);

    // Athletic Red Jersey Torso
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(-9, -8, 18, 12, 3);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // White collar & chest crest
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-3, -8); ctx.lineTo(0, -5); ctx.lineTo(3, -8);
    ctx.stroke();

    // Jersey side athletic panels
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-9, -6, 2, 8);
    ctx.fillRect(7, -6, 2, 8);

    // Head, Hair/Cap & Facial Features
    ctx.fillStyle = skinTone;
    ctx.fillRect(-2, -9, 4, 3); // Neck

    // Head
    ctx.beginPath();
    ctx.arc(0, -11, 7, 0, Math.PI * 2);
    ctx.fillStyle = skinTone;
    ctx.fill();

    // Hair / Headband / Cap Textures
    if (faceStyle === 'headband') {
      // Dark spiky hair with white sports headband
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, -12, 7, Math.PI, 0);
      ctx.fill();
      // White headband
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-6.5, -13, 13, 2.2);
    } else if (faceStyle === 'beard') {
      // Dark cap
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, -12, 7, Math.PI, 0);
      ctx.fill();
      // Facial stubble / beard
      ctx.fillStyle = '#1e1b18';
      ctx.beginPath();
      ctx.arc(0, -9, 4.5, 0, Math.PI);
      ctx.fill();
    } else {
      // Standard Bowler Cap with visor
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, -12, 7, Math.PI, 0);
      ctx.fill();

      // Cap Visor facing DOWN towards batsman
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(0, -5, 4.5, 2.2, 0, 0, Math.PI);
      ctx.fill();
    }

    // Bowler Eyes focused intently on pitch bounce target
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-2.5, -8, 1.8, 1.2);
    ctx.fillRect(0.7, -8, 1.8, 1.2);

    // ========================================================================
    // Distinct Bowling Actions (High-Arm, Slingshot, Swing, Wrist Spin, Finger Spin)
    // ========================================================================
    ctx.save();
    const armBaseX = armSide === 'left' ? -9 : 9;
    ctx.translate(armBaseX, -4);

    const effectiveArmAngle = bowlingArmAngle;
    const armLength = 15;

    if (actionType === 'slingshot') {
      // Round-arm side-on whip (Malinga / Bumrah low angle)
      ctx.rotate(effectiveArmAngle + 0.45);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(armSide === 'left' ? -15 : 15, -6);
      ctx.stroke();
      ctx.fillStyle = skinTone;
      ctx.beginPath();
      ctx.arc(armSide === 'left' ? -15.5 : 15.5, -6.5, 2.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (actionType === 'wrist_spin') {
      // Loop flight wrist-flick action (Warne / Rashid)
      ctx.rotate(effectiveArmAngle);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -armLength);
      ctx.stroke();
      // Cocked wrist holding ball at angle
      ctx.fillStyle = skinTone;
      ctx.beginPath();
      ctx.arc(2.2, -armLength - 1, 2.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (actionType === 'finger_spin') {
      // Finger spin orthodox release (Ashwin / Lyon)
      ctx.rotate(effectiveArmAngle);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -armLength);
      ctx.stroke();
      // Index/middle finger rip
      ctx.fillStyle = skinTone;
      ctx.beginPath();
      ctx.arc(-1.5, -armLength - 1.5, 2.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (actionType === 'fast_swing') {
      // Repeatable chest-on swing action (Anderson / Steyn)
      ctx.rotate(effectiveArmAngle + 0.15);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -armLength);
      ctx.stroke();
      ctx.fillStyle = skinTone;
      ctx.beginPath();
      ctx.arc(0, -armLength - 1.5, 2.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // High-Arm Fast Bowling Windmill (McGrath / Cummins 12-to-6)
      ctx.rotate(effectiveArmAngle);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -armLength);
      ctx.stroke();
      ctx.fillStyle = skinTone;
      ctx.beginPath();
      ctx.arc(0, -armLength - 1.5, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    ctx.restore();
  },

  /**
   * Draw Crouched Wicket-Keeper with pads and raised webbing gloves (or stumping lunge)
   */
  drawWicketKeeper(ctx, x, y, { skinTone = '#d49b70', isStumping = false } = {}) {
    ctx.save();
    ctx.translate(x, y);

    // Ground Shadow
    ctx.beginPath();
    ctx.ellipse(0, 8, isStumping ? 18 : 14, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Crouched Keeper Pads (bent knees)
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.roundRect(-10, 0, 7, 10, 3);
    ctx.roundRect(3, 0, 7, 10, 3);
    ctx.fill();
    ctx.stroke();

    // Torso in Red Keeper Jersey
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(-9, isStumping ? -14 : -9, 18, 11, 4);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Head with White Helmet & Face Mesh
    ctx.beginPath();
    ctx.arc(0, isStumping ? -16 : -11, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Keeper Eyes under helmet
    ctx.fillStyle = skinTone;
    ctx.fillRect(-3, isStumping ? -16 : -11, 6, 2.5);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-2, isStumping ? -16 : -11, 1.5, 1);
    ctx.fillRect(0.5, isStumping ? -16 : -11, 1.5, 1);

    // Wicket-Keeping Gloves with Colored Webbing
    const gloveY = isStumping ? -22 : -12;
    ctx.fillStyle = '#3b82f6';
    // Left glove
    ctx.beginPath();
    ctx.ellipse(-11, gloveY, 4.8, 3.8, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    // Glove webbing detail
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-13, gloveY - 1, 2, 3);

    // Right glove (if stumping, smashing into stumps!)
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.ellipse(isStumping ? 2 : 11, gloveY, 4.8, 3.8, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(isStumping ? 2 : 11, gloveY - 1, 2, 3);

    ctx.restore();
  },

  /**
   * Draw Humanoid Non-Striker standing at popping crease
   */
  drawNonStriker(ctx, x, y, { skinTone = '#d49b70' } = {}) {
    ctx.save();
    ctx.translate(x, y);

    // Shadow
    ctx.beginPath();
    ctx.ellipse(0, 8, 10, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    // Pads
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-6, 2, 4, 9);
    ctx.fillRect(2, 2, 4, 9);

    // Blue Jersey
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(-8, -7, 16, 11, 3);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Helmet & Face
    ctx.beginPath();
    ctx.arc(0, -9, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Bat held rested on turf
    ctx.fillStyle = '#d97706';
    ctx.fillRect(7, -5, 3, 17);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(7, -8, 3, 4);

    ctx.restore();
  },

  /**
   * Draw Athletic Running Batsman sprinting between wickets
   * With pumping stride, leaning torso, forward-extended bat sliding to ground crease!
   */
  drawRunner(ctx, x, y, {
    isStriker = true,
    runProgress = 0,
    runDirection = 1, // 1 = running towards bowler end (up, -y), -1 = running towards striker end (down, +y)
    isSliding = false,
    jerseyColor = '#2563eb',
    skinTone = '#d49b70'
  } = {}) {
    ctx.save();
    ctx.translate(x, y);

    // Lean into sprint direction (tilted forward)
    const leanAngle = runDirection > 0 ? -0.18 : 0.18;
    ctx.rotate(leanAngle);

    // Ground Shadow (stretches with sprint)
    ctx.beginPath();
    ctx.ellipse(0, 10, 13, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Athletic Running Stride: Alternating pads and cricket spikes
    const stride = Math.sin(runProgress * Math.PI * 10) * 6.5;

    // Left Batting Pad & Spikes
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-7, 2 - stride, 5.5, 12, 2.5);
    ctx.fill();
    ctx.stroke();
    // Left shoe spike
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-7, 13 - stride, 5.5, 3);

    // Right Batting Pad & Spikes
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(2, 2 + stride, 5.5, 12, 2.5);
    ctx.fill();
    ctx.stroke();
    // Right shoe spike
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(2, 13 + stride, 5.5, 3);

    // Athletic Torso in Team Jersey
    ctx.fillStyle = jerseyColor;
    ctx.beginPath();
    ctx.roundRect(-9, -8, 18, 12, 3);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Player Number / Name Stripe
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(-7, -4, 14, 3);

    // White Batting Helmet & Visor facing running direction (Image 2)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -11, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Helmet Peak pointing in run direction
    const peakY = runDirection > 0 ? -16 : -7;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, peakY, 5, 2.5, 0, 0, Math.PI);
    ctx.fill();

    // Face / Eyes
    ctx.fillStyle = skinTone;
    ctx.fillRect(-2.5, -10, 5, 2);

    // Arms & Outstretched Bat sliding along the turf!
    ctx.save();
    // Left arm pumping
    ctx.strokeStyle = jerseyColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-7, -4);
    ctx.lineTo(-12, stride > 0 ? 3 : -8);
    ctx.stroke();

    // Right arm holding bat extended forward towards the crease line
    const batReachY = runDirection > 0 ? (isSliding ? -22 : -16) : (isSliding ? 18 : 12);
    const batAngle = runDirection > 0 ? (isSliding ? -Math.PI / 2 - 0.2 : -Math.PI / 2 + 0.3) : (isSliding ? Math.PI / 2 + 0.2 : Math.PI / 2 - 0.3);

    ctx.beginPath();
    ctx.moveTo(7, -4);
    ctx.lineTo(8, batReachY + (runDirection > 0 ? 8 : -8));
    ctx.stroke();

    // Batting Glove
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(8, batReachY + (runDirection > 0 ? 6 : -6), 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Outstretched Cricket Bat grounding into crease
    ctx.translate(8, batReachY);
    ctx.rotate(batAngle);

    // Cane Handle
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(-1.5, -6, 3, 6);

    // Willow Blade sliding across turf
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(3, 0);
    ctx.lineTo(3.5, 18);
    ctx.lineTo(-3.5, 18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Rubber Toe Guard
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-3, 17, 6, 2);

    // Bat slide sparks if sliding into the crease!
    if (isSliding && Math.random() < 0.6) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 19, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    ctx.restore();
  },

  /**
   * Draw Official 30-Yard Inner Circle with regulation painted white discs & dashed ring
   */
  draw30YardCircle(ctx, cx, cy, rx = 150, ry = 165) {
    ctx.save();
    // Semi-transparent inner white dashed line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.40)';
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 8]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 24 Regulation White Marker Discs spaced evenly along the 30-yard ring
    const numDiscs = 24;
    for (let d = 0; d < numDiscs; d++) {
      const angle = (d / numDiscs) * Math.PI * 2;
      const dx = cx + Math.cos(angle) * rx;
      const dy = cy + Math.sin(angle) * ry;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(dx, dy, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // "30 YARDS" Turf Lettering
    ctx.font = 'bold 9px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.textAlign = 'center';
    ctx.fillText('• 30 YARDS •', cx, cy - ry + 16);
    ctx.fillText('• 30 YARDS •', cx, cy + ry - 10);
    ctx.restore();
  },

  /**
   * Draw Humanoid Fielder in running, diving slide or athletic leaping catch stance
   * Exact match to Image 2: red athletic trousers with white vertical stripe, red jersey, dark cap, no text clutter
   */
  drawFielder(ctx, x, y, role, jerseyColor = '#ef4444', isDiving = false, isCatching = false) {
    ctx.save();
    ctx.translate(x, y);

    if (isCatching) {
      // 1. LEAPING CATCH POSTURE (Airborne jump, cupped hands grasping ball)
      // Detached ground shadow below jumping fielder
      ctx.beginPath();
      ctx.ellipse(0, 16, 8, 3.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.fill();

      // Body jumped up
      ctx.translate(0, -9);

      // Red Athletic Trousers with Crisp White Side Stripe (Image 2)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(-6, 3, 4.5, 8, 2);
      ctx.roundRect(1.5, 2, 4.5, 9, 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // White Side Stripes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-6, 3, 1.2, 8);
      ctx.fillRect(4.8, 2, 1.2, 9);

      // Black Athletic Shoes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, 11, 4.5, 2.5);
      ctx.fillRect(1.5, 11, 4.5, 2.5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-6, 13, 4.5, 0.8);
      ctx.fillRect(1.5, 13, 4.5, 0.8);

      // Torso angled up towards ball
      ctx.fillStyle = jerseyColor;
      ctx.beginPath();
      ctx.roundRect(-8, -8, 16, 12, 3);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // White collar
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-3, -8); ctx.lineTo(0, -5); ctx.lineTo(3, -8);
      ctx.stroke();

      // Head tilted up with dark cricket cap
      ctx.beginPath();
      ctx.arc(0, -11, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Extended arms with cupped hands clutching the red cricket ball!
      ctx.strokeStyle = '#c68656';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-5, -4); ctx.lineTo(-2, -18);
      ctx.moveTo(5, -4); ctx.lineTo(2, -18);
      ctx.stroke();

      // White Fielding Gloves clutching ball
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-2, -19, 3.2, 0, Math.PI * 2);
      ctx.arc(2, -19, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Red Cricket Ball securely caught between gloves!
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -19, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Catch burst star sparkles
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -26); ctx.lineTo(0, -22);
      ctx.moveTo(-4, -19); ctx.lineTo(-8, -19);
      ctx.moveTo(4, -19); ctx.lineTo(8, -19);
      ctx.stroke();
    } else if (isDiving) {
      // 2. DIVING SLIDE POSTURE (Horizontal grass slide with extended arm stop)
      ctx.beginPath();
      ctx.ellipse(0, 3, 16, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fill();

      // Diving horizontal body slide
      ctx.rotate(0.3);
      // Red athletic trousers
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-12, 1, 10, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-12, 1, 10, 1);

      // Red Jersey Torso
      ctx.fillStyle = jerseyColor;
      ctx.beginPath();
      ctx.roundRect(-6, -4, 16, 9, 3);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Extended arms cutting off ball
      ctx.strokeStyle = '#c68656';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(10, 0); ctx.lineTo(19, -2);
      ctx.stroke();

      // Head with Cap
      ctx.beginPath();
      ctx.arc(-8, -6, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
    } else {
      // 3. UPRIGHT ATHLETIC POSTURE (Alert stance / sprinting - Exact Image 2 Style)
      // Ground Shadow
      ctx.beginPath();
      ctx.ellipse(0, 14, 11, 4.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fill();

      // Red Athletic Trousers with Crisp White Side Stripe (Image 2)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(-6.5, 3, 5, 10, 2);
      ctx.roundRect(1.5, 3, 5, 10, 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // White Side Stripes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-6.5, 3, 1.4, 10);
      ctx.fillRect(5.1, 3, 1.4, 10);

      // Black Athletic Shoes with White Soles
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6.5, 12, 5, 2.5);
      ctx.fillRect(1.5, 12, 5, 2.5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-6.5, 14, 5, 1);
      ctx.fillRect(1.5, 14, 5, 1);

      // Red Athletic Jersey Torso
      ctx.fillStyle = jerseyColor;
      ctx.beginPath();
      ctx.roundRect(-8, -7, 16, 11, 3);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // White collar
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-3, -7); ctx.lineTo(0, -4); ctx.lineTo(3, -7);
      ctx.stroke();

      // Alert Arms
      ctx.strokeStyle = jerseyColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-6, -4); ctx.lineTo(-9, 1);
      ctx.moveTo(6, -4); ctx.lineTo(9, 1);
      ctx.stroke();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Skin hands
      ctx.fillStyle = '#c68656';
      ctx.beginPath();
      ctx.arc(-9, 2, 2, 0, Math.PI * 2);
      ctx.arc(9, 2, 2, 0, Math.PI * 2);
      ctx.fill();

      // Head & Dark Cricket Cap (Facing pitch center)
      ctx.beginPath();
      ctx.arc(0, -11, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Cap Visor pointing towards batsman
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, -6.5, 4, 2, 0, 0, Math.PI);
      ctx.fill();

      // Focused Eyes
      ctx.fillStyle = '#c68656';
      ctx.fillRect(-3, -11, 6, 2.5);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-2, -10.5, 1.5, 1);
      ctx.fillRect(0.5, -10.5, 1.5, 1);
      // NOTE: Zero text labels rendered here for maximum visual clarity!
    }

    ctx.restore();
  },

  /**
   * Draw Realistic Stadium Crowd Stands & Tiered Spectators along the boundary (matching Image 3)
   * With dynamic jumping, waving arms, camera flash cheering animations and ball landing in the stands!
   */
  drawStadiumCrowdStands(ctx, cx, cy, boundaryRadius, width, height, crowdState = {}) {
    ctx.save();
    const isCheering = crowdState.isCheering || crowdState.isRocketSix;
    const landing = crowdState.sixLanding || null; // { x, y, progress, active }
    const now = Date.now();

    // 1. Boundary Rope Ring (White with yellow foam wedges)
    ctx.beginPath();
    ctx.arc(cx, cy, boundaryRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Foam Boundary Toblerone Markers (Yellow & Red sponsor blocks)
    const numMarkers = 36;
    for (let i = 0; i < numMarkers; i++) {
      const angle = (i / numMarkers) * Math.PI * 2;
      const mx = cx + Math.cos(angle) * (boundaryRadius + 4);
      const my = cy + Math.sin(angle) * (boundaryRadius + 4);

      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillStyle = i % 2 === 0 ? '#eab308' : '#ef4444';
      ctx.fillRect(-6, -2.5, 12, 5);
      ctx.restore();
    }

    // 2. Crowd Stands & Tiers along upper corners & outer perimeter
    // Tiered concrete steps for expanded grand stadium
    const stepDistances = [
      boundaryRadius + 14,
      boundaryRadius + 32,
      boundaryRadius + 52,
      boundaryRadius + 74,
      boundaryRadius + 98,
      boundaryRadius + 124
    ];
    const colors = ['#2563eb', '#ef4444', '#f59e0b', '#10b981', '#a855f7', '#ffffff', '#0284c7', '#ea580c'];

    stepDistances.forEach((dist, stepIdx) => {
      ctx.beginPath();
      ctx.arc(cx, cy, dist, 0, Math.PI * 2);
      ctx.strokeStyle = stepIdx % 2 === 0 ? 'rgba(30, 41, 59, 0.85)' : 'rgba(15, 23, 42, 0.9)';
      ctx.lineWidth = 15;
      ctx.stroke();

      // Handrail
      ctx.beginPath();
      ctx.arc(cx, cy, dist + 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Spectators along this tier
      const specCount = 36 + stepIdx * 10;
      for (let s = 0; s < specCount; s++) {
        const sAngle = (s / specCount) * Math.PI * 2;
        let sx = cx + Math.cos(sAngle) * dist;
        let sy = cy + Math.sin(sAngle) * dist;

        // Skip spectators out of canvas bounds
        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;

        // If ball is landing in this spectator section, animate spectators reacting!
        let isNearLanding = false;
        if (landing && landing.active) {
          const dToLanding = Math.hypot(sx - landing.x, sy - landing.y);
          if (dToLanding < 55) {
            isNearLanding = true;
            // Spectators scatter or lunge to catch the six!
            const scatterAngle = Math.atan2(sy - landing.y, sx - landing.x);
            sx += Math.cos(scatterAngle) * 6;
            sy += Math.sin(scatterAngle) * 6 - 5;
          }
        }

        // Dynamic cheering: spectators jump up and down in excitement!
        if (isCheering || isNearLanding) {
          const jumpOffset = Math.abs(Math.sin(now * 0.009 + s * 0.7)) * 4.5;
          sy -= jumpOffset;
        }

        // Cheering raised arms \o/
        if ((isCheering || isNearLanding) && (s % 2 === 0 || isNearLanding)) {
          ctx.strokeStyle = '#d49b70';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(sx - 2.5, sy); ctx.lineTo(sx - 5, sy - 6);
          ctx.moveTo(sx + 2.5, sy); ctx.lineTo(sx + 5, sy - 6);
          ctx.stroke();
        }

        // Spectator Shirt
        ctx.fillStyle = isNearLanding ? '#fef08a' : colors[(s * 7 + stepIdx * 3) % colors.length];
        ctx.beginPath();
        ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Spectator Head
        ctx.fillStyle = '#d49b70';
        ctx.beginPath();
        ctx.arc(sx, sy - 2.8, 2, 0, Math.PI * 2);
        ctx.fill();

        // Random camera flash in stands when cheering!
        if (isCheering && Math.random() < 0.025) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(sx, sy - 1, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // 3. Ball landing impact effect in the stands between people!
    if (landing && landing.active) {
      ctx.save();
      const lx = landing.x;
      const ly = landing.y;

      // Ripple shockwave in stands
      ctx.beginPath();
      ctx.arc(lx, ly, 18 + Math.sin(now * 0.01) * 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Camera Flash Burst
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(lx, ly, 26, 0, Math.PI * 2);
      ctx.fill();

      // Floating text in stands
      ctx.font = '900 12px "Inter", sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 6;
      ctx.fillText('INTO THE STANDS! 🚀', lx, ly - 22);
      ctx.restore();
    }

    ctx.restore();
  }
};
