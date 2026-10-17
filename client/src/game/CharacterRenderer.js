// ============================================================================
// CRICKET RUSH - 2D Pixel Art Character & Stadium Presentation Engine
// Retro 16-Bit Arcade Pixel Art Sprites: Striker Batsman, Bowler, Wicket-Keeper,
// Fielders, Runners, Non-Striker, 80-Meter Stadium Crowd Stands & 30-Yard Circle
// ============================================================================

/**
 * Helper to draw crisp pixel-aligned rectangles with optional 1px dark retro border
 */
function pxRect(ctx, x, y, w, h, fill, stroke = null) {
  const rx = Math.round(x);
  const ry = Math.round(y);
  const rw = Math.round(w);
  const rh = Math.round(h);
  ctx.fillStyle = fill;
  ctx.fillRect(rx, ry, rw, rh);
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.strokeRect(rx + 0.5, ry + 0.5, rw - 1, rh - 1);
  }
}

/**
 * Helper to draw a pixelated circle / disk with blocky stepped pixels
 */
function pxDisc(ctx, cx, cy, r, fill, stroke = null) {
  const icx = Math.round(cx);
  const icy = Math.round(cy);
  const ir = Math.round(r);
  ctx.fillStyle = fill;
  for (let dy = -ir; dy <= ir; dy++) {
    const dxLimit = Math.round(Math.sqrt(Math.max(0, ir * ir - dy * dy)));
    ctx.fillRect(icx - dxLimit, icy + dy, dxLimit * 2 + 1, 1);
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(icx, icy, ir, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export const CharacterRenderer = {
  /**
   * Draw 2D Pixel Art Striker Batsman with customizable team jersey, pixel helmet with steel grille,
   * ribbed pixel batting pads with straps, pixel spikes, and authentic willow bat physics
   */
  drawBatsman(ctx, x, y, {
    isSwinging = false,
    swingProgress = 0,
    swingType = 'straight',
    shotStyle = 'straight_drive',
    isSteppingOut = false,
    stepOutOffset = 0,
    triggerTap = 0,
    weightShiftX = 0,
    footworkState = 'stance',
    isLeftHanded = false,
    batSkin = 'willow',
    jerseyColor = '#2563eb',
    skinTone = '#d49b70',
    faceStyle = 'beard'
  }) {
    ctx.save();

    // Dynamic footwork & stride interpolation
    const visualX = Math.round(x + (isSwinging ? 0 : weightShiftX));
    const visualY = Math.round(y - (isSteppingOut ? stepOutOffset : 0));
    ctx.translate(visualX, visualY);

    // Left-handed batsman authentic horizontal mirroring
    if (isLeftHanded) {
      ctx.scale(-1, 1);
    }

    // 1. Pixel Ground Shadow (Stepped pixel oval)
    const shadowW = isSteppingOut ? 12 : 15;
    const shadowH = isSteppingOut ? 4 : 5;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    pxRect(ctx, -shadowW, 10, shadowW * 2, shadowH, 'rgba(0, 0, 0, 0.42)');
    pxRect(ctx, -shadowW + 2, 9, (shadowW - 2) * 2, 1, 'rgba(0, 0, 0, 0.28)');
    pxRect(ctx, -shadowW + 2, 10 + shadowH, (shadowW - 2) * 2, 1, 'rgba(0, 0, 0, 0.28)');

    // 2. Batting Leg Pads & Cricket Spikes (2D Pixel Contoured Shin Guards with Straps)
    let padOffsetLeft = -7;
    let padOffsetRight = 3;
    let padLeftY = 3;
    let padRightY = 4;

    if (isSteppingOut) {
      padOffsetLeft = -6;
      padLeftY = -6; // Front foot stepped forward towards bowler!
      padOffsetRight = 4;
      padRightY = 8; // Back foot dragged on toe
    } else if (footworkState === 'shuffling_left') {
      padOffsetLeft = -12;
      padOffsetRight = 0;
    } else if (footworkState === 'shuffling_right') {
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
      padLeftY += Math.round(triggerTap * 0.4);
    }

    // Left Batting Pad (Pixel White Pad with Slate Shade and 1px Dark Outline)
    pxRect(ctx, padOffsetLeft, padLeftY, 7, 13, '#f8fafc', '#0f172a');
    // Right-edge pixel shadow on pad
    pxRect(ctx, padOffsetLeft + 5, padLeftY + 1, 1, 11, '#cbd5e1');
    // Pad horizontal strap notches (retro pixel straps)
    pxRect(ctx, padOffsetLeft, padLeftY + 4, 7, 1, '#94a3b8');
    pxRect(ctx, padOffsetLeft, padLeftY + 8, 7, 1, '#94a3b8');
    // Knee roll pixel highlight
    pxRect(ctx, padOffsetLeft + 1, padLeftY + 2, 5, 1, '#ffffff');

    // Right Batting Pad
    pxRect(ctx, padOffsetRight, padRightY, 7, 13, '#f8fafc', '#0f172a');
    pxRect(ctx, padOffsetRight + 5, padRightY + 1, 1, 11, '#cbd5e1');
    pxRect(ctx, padOffsetRight, padRightY + 4, 7, 1, '#94a3b8');
    pxRect(ctx, padOffsetRight, padRightY + 8, 7, 1, '#94a3b8');
    pxRect(ctx, padOffsetRight + 1, padRightY + 2, 5, 1, '#ffffff');

    // Cricket Spikes / Shoes (Black pixel leather with white studded rubber sole)
    pxRect(ctx, padOffsetLeft - 0.5, padLeftY + 13, 8, 3, '#0f172a');
    pxRect(ctx, padOffsetLeft - 0.5, padLeftY + 15, 8, 1, '#ffffff');
    pxRect(ctx, padOffsetRight - 0.5, padRightY + 13, 8, 3, '#0f172a');
    pxRect(ctx, padOffsetRight - 0.5, padRightY + 15, 8, 1, '#ffffff');

    // 3. Torso & Broad Shoulders in 2D Pixel Team Jersey
    ctx.save();
    let bodyRotation = 0;
    if (shotStyle === 'pull') bodyRotation = 0.48;
    else if (shotStyle === 'cover_drive') bodyRotation = -0.38;
    else if (shotStyle === 'reverse_sweep') bodyRotation = 0.95;
    else if (shotStyle === 'upper_cut') bodyRotation = -0.25;
    else if (shotStyle === 'flick') bodyRotation = 0.28;
    ctx.rotate(bodyRotation);

    // Pixel Jersey Block (Chunky arcade torso with beveled shoulder pixels)
    pxRect(ctx, -10, -8, 20, 14, jerseyColor, '#0f172a');
    // Stepped pixel shoulder cutouts
    pxRect(ctx, -10, -8, 2, 1, '#0f172a');
    pxRect(ctx, 8, -8, 2, 1, '#0f172a');

    // Darker shade along bottom and right flank for pixel depth
    pxRect(ctx, -9, 4, 18, 1, 'rgba(0, 0, 0, 0.28)');
    pxRect(ctx, 8, -7, 1, 11, 'rgba(0, 0, 0, 0.28)');

    // White V-Neck Collar Pixels
    pxRect(ctx, -3, -8, 6, 2, '#ffffff');
    pxRect(ctx, -1, -6, 2, 2, '#ffffff');
    pxRect(ctx, -0.5, -4, 1, 1, '#ffffff');

    // Chest Sponsor / Team Striping Pixels
    pxRect(ctx, -7, -2, 14, 2.5, 'rgba(255, 255, 255, 0.40)');
    pxRect(ctx, -5, -1, 10, 1, '#ffffff');
    ctx.restore();

    // 4. 2D Pixel Batsman Head, Facial Textures & Batting Helmet
    // Neck Pixel Block
    pxRect(ctx, -2.5, -9, 5, 3, skinTone, '#0f172a');

    // Batting Helmet Dome (Pixelated White Batting Helmet with beveled crown)
    pxRect(ctx, -7, -17, 14, 10, '#ffffff', '#0f172a');
    // Top beveled pixel steps
    pxRect(ctx, -5, -18, 10, 1, '#ffffff');
    pxRect(ctx, -7, -17, 2, 1, '#0f172a');
    pxRect(ctx, 5, -17, 2, 1, '#0f172a');
    // Helmet shadow / bevel band
    pxRect(ctx, -6, -16, 12, 1, '#e2e8f0');

    // Dark Helmet Visor / Peak extending forward towards bowler
    pxRect(ctx, -5, -14, 10, 3, '#0f172a');
    pxRect(ctx, -4, -13, 8, 1, '#334155');

    // Face Window underneath helmet visor
    pxRect(ctx, -4, -12, 8, 4, skinTone);

    // Facial Textures (Pixel Beard / Stubble / Classic / Headband)
    if (faceStyle === 'beard') {
      // Dark trimmed pixel beard along jaw and chin
      pxRect(ctx, -4, -10, 8, 2, '#1e1b18');
      pxRect(ctx, -3, -8, 6, 1, '#1e1b18');
      // Moustache pixel row
      pxRect(ctx, -2.5, -10.5, 5, 1, '#1e1b18');
    } else if (faceStyle === 'stubble') {
      pxRect(ctx, -3.5, -10, 7, 2, 'rgba(30, 27, 24, 0.48)');
    } else if (faceStyle === 'headband') {
      pxRect(ctx, -5, -15, 10, 2, '#ef4444');
    }

    // Focused Batsman Pixel Eyes
    pxRect(ctx, -3, -12, 2, 1, '#0f172a'); // Left brow
    pxRect(ctx, -2.5, -11, 1.5, 1.5, '#0f172a'); // Left eye pupil
    pxRect(ctx, 1, -12, 2, 1, '#0f172a'); // Right brow
    pxRect(ctx, 1, -11, 1.5, 1.5, '#0f172a'); // Right eye pupil

    // Steel Face Grille & Ear Guards (1px Pixel Mesh Bars)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Vertical steel bars
    ctx.moveTo(-3.5, -13.5); ctx.lineTo(-3.5, -8.5);
    ctx.moveTo(-1.5, -13.5); ctx.lineTo(-1.5, -8.5);
    ctx.moveTo(1.5, -13.5); ctx.lineTo(1.5, -8.5);
    ctx.moveTo(3.5, -13.5); ctx.lineTo(3.5, -8.5);
    // Horizontal chin bar
    ctx.moveTo(-4, -9); ctx.lineTo(4, -9);
    ctx.stroke();

    // 5. 2D Pixel Arms, Batting Gloves and Bat Physics
    ctx.save();
    let batAngle = 0.15;
    let reachX = 4;
    let reachY = 2;

    if (isSwinging) {
      const swingRatio = Math.sin(swingProgress * Math.PI);

      if (shotStyle === 'cover_drive') {
        reachX = 4 - swingRatio * 9;
        reachY = 2 - swingRatio * 13;
        batAngle = 0.2 - swingRatio * 2.8;
      } else if (shotStyle === 'square_cut') {
        reachX = 4 + swingRatio * 9;
        reachY = 2 - swingRatio * 8;
        batAngle = -0.45 - swingRatio * 1.8;
      } else if (shotStyle === 'pull') {
        reachX = 4 + swingRatio * 5;
        reachY = 2 - swingRatio * 6;
        batAngle = 0.1 + swingRatio * 2.6;
      } else if (shotStyle === 'hook') {
        reachX = 4 + swingRatio * 7;
        reachY = 2 - swingRatio * 11;
        batAngle = 0.15 + swingRatio * 3.0;
      } else if (shotStyle === 'sweep' || shotStyle === 'paddle_sweep') {
        reachX = -2 - swingRatio * 7;
        reachY = 2 - swingRatio * 8;
        batAngle = 0.35 + swingRatio * 2.2;
      } else if (shotStyle === 'defense') {
        reachX = 2 - swingRatio * 2;
        reachY = 2 - swingRatio * 7;
        batAngle = 0.05 - swingRatio * 1.2;
      } else if (shotStyle === 'upper_cut') {
        reachX = 4 + swingRatio * 7;
        reachY = 2 - swingRatio * 10;
        batAngle = 0.1 - swingRatio * 1.8;
      } else if (shotStyle === 'flick') {
        reachX = 4 - swingRatio * 6;
        reachY = 2 - swingRatio * 11;
        batAngle = 0.15 + swingRatio * 2.4;
      } else if (shotStyle === 'reverse_sweep') {
        reachX = -4 + swingRatio * 8;
        reachY = 2 - swingRatio * 6;
        batAngle = -0.4 - swingRatio * 2.5;
      } else if (shotStyle === 'scoop') {
        reachX = 2;
        reachY = 0 - swingRatio * 5;
        batAngle = 0.2 - swingRatio * 1.6;
      } else if (shotStyle === 'late_cut') {
        reachX = 4 + swingRatio * 6;
        reachY = 2 - swingRatio * 4;
        batAngle = -0.35 - swingRatio * 1.5;
      } else if (shotStyle === 'top_edge') {
        reachX = 3 + swingRatio * 4;
        reachY = 2 - swingRatio * 12;
        batAngle = 0.2 + swingRatio * 1.8;
      } else if (shotStyle === 'outside_edge' || shotStyle === 'inside_edge') {
        reachX = 4 + swingRatio * 3;
        reachY = 2 - swingRatio * 7;
        batAngle = 0.05 - swingRatio * 1.6;
      } else if (shotStyle === 'step_out') {
        reachX = 2;
        reachY = 2 - swingRatio * 16;
        batAngle = 0.15 - swingRatio * 3.4;
      } else {
        reachX = 4 - swingRatio * 3;
        reachY = 2 - swingRatio * 14;
        batAngle = 0.15 - swingRatio * 3.3;
      }
    } else {
      reachX = 3;
      reachY = 2 + triggerTap * 0.4;
      batAngle = 0.12 + (triggerTap * 0.08);
    }

    // 2D Pixel Arms in Team Jersey
    ctx.strokeStyle = jerseyColor;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'square'; // Crisp pixel ends
    // Back arm
    ctx.beginPath();
    ctx.moveTo(6, -4);
    ctx.lineTo(reachX + 2, reachY);
    ctx.stroke();
    // Front arm
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.lineTo(reachX - 2, reachY - 2);
    ctx.stroke();

    // 2D Batting Gloves (Chunky pixel white foam blocks with dark borders)
    pxRect(ctx, reachX - 4, reachY - 4, 4.5, 4.5, '#f8fafc', '#0f172a');
    pxRect(ctx, reachX, reachY - 1, 4.5, 4.5, '#f8fafc', '#0f172a');
    // Glove padding ridges
    pxRect(ctx, reachX - 3.5, reachY - 2.5, 3, 1, '#94a3b8');
    pxRect(ctx, reachX + 0.5, reachY + 0.5, 3, 1, '#94a3b8');

    // ========================================================================
    // 2D Pixel Cricket Bat with Willow Grain, Cane Handle & Brand Sticker
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

    // Cylindrical Cane Handle with Red Rubber Pixel Spiral Grip
    pxRect(ctx, -1.5, -11, 3, 11, '#dc2626', '#0f172a');
    // Spiral grip stripes
    pxRect(ctx, -1.5, -9, 3, 1, '#991b1b');
    pxRect(ctx, -1.5, -6, 3, 1, '#991b1b');
    pxRect(ctx, -1.5, -3, 3, 1, '#991b1b');
    // Handle top cap pommel
    pxRect(ctx, -2, -12, 4, 1.5, '#ffffff', '#0f172a');

    // Traditional Wood V-Splice at Top of Blade
    pxRect(ctx, -2, 0, 4, 3, '#78350f');

    // Willow Blade with Contoured Sweet Spot (Chunky 2D Pixel Blade)
    pxRect(ctx, -3.5, 0.5, 7, 20.5, bladeColor, spineColor);
    // Sweet spot swell pixels (wider midsection)
    pxRect(ctx, -4.5, 8, 9, 8, bladeColor);
    pxRect(ctx, -4.5, 8, 1, 8, spineColor);
    pxRect(ctx, 3.5, 8, 1, 8, spineColor);

    // Natural Willow Wood Grain Pixel Stripes
    ctx.strokeStyle = 'rgba(120, 53, 15, 0.40)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-1.5, 3); ctx.lineTo(-1.5, 19);
    ctx.moveTo(1.5, 3); ctx.lineTo(1.5, 19);
    ctx.stroke();

    // Central Profile Spine (3D wood edge contour)
    pxRect(ctx, -0.5, 2, 1, 18, spineColor);

    // Bat Manufacturer Diamond Shield Brand Sticker
    pxRect(ctx, -2, 4, 4, 4, stickerColor, '#ffffff');

    // Rubber Toe Guard (Protects base from turf impact)
    pxRect(ctx, -3.5, 20.5, 7, 2, '#0f172a');

    ctx.restore();
    ctx.restore();
  },

  /**
   * Draw 2D Pixel Art Bowler with red athletic trousers, crisp white side stripes,
   * delivery arm windmill actions and spiky pixel hair / headband
   */
  drawBowler(ctx, x, y, {
    runUpProgress = 0,
    bowlingArmAngle = 0,
    actionType = 'high_arm',
    armSide = 'right',
    skinTone = '#c68656',
    faceStyle = 'headband'
  }) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // 1. Pixel Ground Shadow
    pxRect(ctx, -10, 8, 20, 5, 'rgba(0, 0, 0, 0.40)');
    pxRect(ctx, -8, 7, 16, 1, 'rgba(0, 0, 0, 0.25)');
    pxRect(ctx, -8, 13, 16, 1, 'rgba(0, 0, 0, 0.25)');

    // 2. Athletic Running Stride (Red Pixel Trousers with Crisp White Side Stripe)
    const stride = Math.sin(runUpProgress * Math.PI * 8) * 5.5;

    // Left Leg
    pxRect(ctx, -7, 2 - stride, 5.5, 10, '#dc2626', '#0f172a');
    // White side stripe on left leg
    pxRect(ctx, -7, 2 - stride, 1.4, 10, '#ffffff');

    // Right Leg
    pxRect(ctx, 2, 2 + stride, 5.5, 10, '#dc2626', '#0f172a');
    // White side stripe on right leg
    pxRect(ctx, 6.1, 2 + stride, 1.4, 10, '#ffffff');

    // Black Athletic Shoes with White Soles
    pxRect(ctx, -7, 11.5 - stride, 6, 2.5, '#0f172a');
    pxRect(ctx, -7, 13.5 - stride, 6, 1, '#ffffff');
    pxRect(ctx, 2, 11.5 + stride, 6, 2.5, '#0f172a');
    pxRect(ctx, 2, 13.5 + stride, 6, 1, '#ffffff');

    // 3. Athletic Red Jersey Torso
    pxRect(ctx, -9, -8, 18, 12, '#ef4444', '#0f172a');
    // Side ventilation pixel panels
    pxRect(ctx, -9, -6, 2, 8, '#1e293b');
    pxRect(ctx, 7, -6, 2, 8, '#1e293b');

    // White V-Neck Collar Pixels
    pxRect(ctx, -3, -8, 6, 2, '#ffffff');
    pxRect(ctx, -1, -6, 2, 2, '#ffffff');

    // 4. Head, Hair/Cap & Focused Bowler Facial Features
    pxRect(ctx, -2, -9, 4, 3, skinTone, '#0f172a'); // Neck

    // Head Block
    pxRect(ctx, -6, -16, 12, 8, skinTone, '#0f172a');

    // Hair / Headband / Cap Textures
    if (faceStyle === 'headband') {
      // Dark spiky pixel hair
      pxRect(ctx, -6, -17, 12, 3, '#0f172a');
      pxRect(ctx, -4, -18, 8, 1, '#0f172a');
      // White sports headband
      pxRect(ctx, -6.5, -14.5, 13, 2.2, '#ffffff', '#0f172a');
    } else if (faceStyle === 'beard') {
      // Dark cap
      pxRect(ctx, -6, -17, 12, 4, '#1e293b', '#0f172a');
      // Beard
      pxRect(ctx, -5, -10, 10, 2, '#1e1b18');
    } else {
      // Standard Bowler Cap with visor pointing DOWN towards batsman
      pxRect(ctx, -6, -17, 12, 4, '#1e293b', '#0f172a');
      pxRect(ctx, -5, -6, 10, 2.5, '#0f172a');
    }

    // Bowler Eyes focused intently on pitch bounce target
    pxRect(ctx, -3, -11, 2, 1.2, '#0f172a');
    pxRect(ctx, 1, -11, 2, 1.2, '#0f172a');

    // 5. Distinct 2D Pixel Bowling Actions (High-Arm, Slingshot, Swing, Wrist Spin, Finger Spin)
    ctx.save();
    const armBaseX = armSide === 'left' ? -9 : 9;
    ctx.translate(armBaseX, -4);

    const effectiveArmAngle = bowlingArmAngle;
    const armLength = 15;

    ctx.rotate(effectiveArmAngle);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'square';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -armLength);
    ctx.stroke();

    // Hand holding 2D Pixel Cricket Ball with White Seam
    pxRect(ctx, -2, -armLength - 3, 4.5, 4.5, '#dc2626', '#0f172a');
    pxRect(ctx, -2, -armLength - 1, 4.5, 1, '#ffffff'); // White seam stripe!

    ctx.restore();
    ctx.restore();
  },

  /**
   * Draw 2D Pixel Art Crouched Wicket-Keeper with white protective pads,
   * red keeper jersey, white helmet and blue/gold webbed gloves
   */
  drawWicketKeeper(ctx, x, y, { skinTone = '#d49b70', isStumping = false } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // Ground Shadow
    pxRect(ctx, -11, 8, 22, 5, 'rgba(0, 0, 0, 0.40)');

    // Crouched Bent Knees & White Keeper Pads
    pxRect(ctx, -10, 0, 7, 10, '#f8fafc', '#0f172a');
    pxRect(ctx, -9, 4, 5, 1, '#94a3b8');
    pxRect(ctx, 3, 0, 7, 10, '#f8fafc', '#0f172a');
    pxRect(ctx, 4, 4, 5, 1, '#94a3b8');

    // Torso in Red Keeper Jersey
    const torsoY = isStumping ? -14 : -9;
    pxRect(ctx, -9, torsoY, 18, 11, '#ef4444', '#0f172a');
    pxRect(ctx, -3, torsoY, 6, 2, '#ffffff'); // Collar

    // White Helmet & Face Mesh
    const headY = isStumping ? -18 : -13;
    pxRect(ctx, -6, headY, 12, 8, '#ffffff', '#0f172a');
    pxRect(ctx, -4, headY + 3, 8, 3, skinTone);
    // Mesh bars
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-2, headY + 3); ctx.lineTo(-2, headY + 6);
    ctx.moveTo(2, headY + 3); ctx.lineTo(2, headY + 6);
    ctx.stroke();

    // Wicket-Keeping Gloves with Colored Webbing (Royal Blue & Yellow)
    const gloveY = isStumping ? -22 : -12;
    // Left Glove
    pxRect(ctx, -13, gloveY, 6, 5, '#3b82f6', '#0f172a');
    pxRect(ctx, -14, gloveY + 1, 2, 3, '#f59e0b'); // Webbing

    // Right Glove (Smashing stumps on stumping!)
    const rGloveX = isStumping ? 1 : 7;
    pxRect(ctx, rGloveX, gloveY, 6, 5, '#3b82f6', '#0f172a');
    pxRect(ctx, rGloveX + 5, gloveY + 1, 2, 3, '#f59e0b');

    ctx.restore();
  },

  /**
   * Draw 2D Pixel Art Non-Striker standing at popping crease
   */
  drawNonStriker(ctx, x, y, { skinTone = '#d49b70' } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // Ground Shadow
    pxRect(ctx, -9, 8, 18, 4, 'rgba(0, 0, 0, 0.35)');

    // White Batting Pads
    pxRect(ctx, -6, 2, 5, 9, '#f8fafc', '#0f172a');
    pxRect(ctx, 2, 2, 5, 9, '#f8fafc', '#0f172a');

    // Blue Team Jersey
    pxRect(ctx, -8, -7, 16, 11, '#2563eb', '#0f172a');
    pxRect(ctx, -2.5, -7, 5, 2, '#ffffff');

    // White Helmet
    pxRect(ctx, -5, -14, 10, 7, '#ffffff', '#0f172a');
    pxRect(ctx, -3, -10, 6, 2.5, skinTone);

    // Resting Cricket Bat grounded on crease
    pxRect(ctx, 7, -6, 3, 5, '#dc2626', '#0f172a'); // Handle
    pxRect(ctx, 6.5, -1, 4, 15, '#d97706', '#b45309'); // Blade
    pxRect(ctx, 6.5, 13, 4, 1.5, '#0f172a'); // Toe guard

    ctx.restore();
  },

  /**
   * Draw 2D Pixel Art Runner sprinting between wickets
   * Leaning forward, pumping legs, and forward outstretched pixel bat sliding onto the crease!
   */
  drawRunner(ctx, x, y, {
    isStriker = true,
    runProgress = 0,
    runDirection = 1,
    isSliding = false,
    jerseyColor = '#2563eb',
    skinTone = '#d49b70'
  } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // Sprint forward lean angle
    const leanAngle = runDirection > 0 ? -0.18 : 0.18;
    ctx.rotate(leanAngle);

    // Pixel Ground Shadow
    pxRect(ctx, -10, 10, 20, 5, 'rgba(0, 0, 0, 0.40)');

    // Athletic Running Stride: Alternating pads and cricket spikes
    const stride = Math.sin(runProgress * Math.PI * 10) * 6.5;

    // Left Batting Pad & Shoe
    pxRect(ctx, -7, 2 - stride, 5.5, 11, '#f8fafc', '#0f172a');
    pxRect(ctx, -7, 12 - stride, 5.5, 2.5, '#0f172a');
    pxRect(ctx, -7, 13.5 - stride, 5.5, 1, '#ffffff');

    // Right Batting Pad & Shoe
    pxRect(ctx, 2, 2 + stride, 5.5, 11, '#f8fafc', '#0f172a');
    pxRect(ctx, 2, 12 + stride, 5.5, 2.5, '#0f172a');
    pxRect(ctx, 2, 13.5 + stride, 5.5, 1, '#ffffff');

    // Team Jersey Torso
    pxRect(ctx, -9, -8, 18, 12, jerseyColor, '#0f172a');
    pxRect(ctx, -7, -4, 14, 2.5, 'rgba(255, 255, 255, 0.40)'); // Number stripe

    // White Batting Helmet facing sprint direction
    pxRect(ctx, -6, -15, 12, 8, '#ffffff', '#0f172a');
    const peakY = runDirection > 0 ? -17 : -8;
    pxRect(ctx, -5, peakY, 10, 2.5, '#0f172a');

    // Arms & Outstretched Bat sliding along the turf!
    ctx.save();
    // Left arm pumping
    ctx.strokeStyle = jerseyColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'square';
    ctx.beginPath();
    ctx.moveTo(-7, -4);
    ctx.lineTo(-12, stride > 0 ? 3 : -8);
    ctx.stroke();

    // Right arm holding extended bat
    const batReachY = runDirection > 0 ? (isSliding ? -22 : -16) : (isSliding ? 18 : 12);
    const batAngle = runDirection > 0 ? (isSliding ? -Math.PI / 2 - 0.2 : -Math.PI / 2 + 0.3) : (isSliding ? Math.PI / 2 + 0.2 : Math.PI / 2 - 0.3);

    ctx.beginPath();
    ctx.moveTo(7, -4);
    ctx.lineTo(8, batReachY + (runDirection > 0 ? 8 : -8));
    ctx.stroke();

    // Batting Glove
    pxRect(ctx, 6, batReachY + (runDirection > 0 ? 4 : -7), 4.5, 4.5, '#f8fafc', '#0f172a');

    // Outstretched Cricket Bat grounding into crease
    ctx.translate(8, batReachY);
    ctx.rotate(batAngle);

    pxRect(ctx, -1.5, -6, 3, 6, '#dc2626', '#0f172a'); // Handle
    pxRect(ctx, -3, 0, 6, 17, '#d97706', '#b45309'); // Blade
    pxRect(ctx, -3, 16, 6, 2, '#0f172a'); // Toe guard

    // Slide sparks / turf particles
    if (isSliding && Math.random() < 0.7) {
      pxRect(ctx, (Math.random() - 0.5) * 6, 17 + Math.random() * 4, 2, 2, '#fbbf24');
    }

    ctx.restore();
    ctx.restore();
  },

  /**
   * Draw Official 30-Yard Inner Circle with regulation painted white discs,
   * subtle inner turf highlight tint, high-contrast dashed ring & turf typography
   */
  draw30YardCircle(ctx, cx, cy, rx = 270, ry = 310) {
    ctx.save();

    // 1. Subtle Inner Turf Tint (distinguishes infield restriction area from outfield)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. High-Contrast Dashed White Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 2.2;
    ctx.setLineDash([9, 9]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. 32 Regulation White Marker Discs spaced evenly along the 30-yard ring
    const numDiscs = 32;
    for (let d = 0; d < numDiscs; d++) {
      const angle = (d / numDiscs) * Math.PI * 2;
      const dx = cx + Math.cos(angle) * rx;
      const dy = cy + Math.sin(angle) * ry;

      // Dark shadow pip
      pxDisc(ctx, dx, dy + 1, 3.2, 'rgba(0, 0, 0, 0.45)');
      // Regulation white disc
      pxDisc(ctx, dx, dy, 3.0, '#ffffff', '#0f172a');
    }

    // 4. Stamped Turf Lettering (Cardinal directions)
    ctx.font = 'bold 10px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.textAlign = 'center';
    ctx.fillText('• 30 YARDS INFIELD CIRCLE •', cx, cy - ry + 18);
    ctx.fillText('• 30 YARDS INFIELD CIRCLE •', cx, cy + ry - 12);
    ctx.restore();
  },

  /**
   * Draw 2D Pixel Art Fielder in alert ready stance, diving slide, or leaping catch
   * Uniform: Red athletic trousers with crisp white side stripes, red jersey, dark cap with white visor
   */
  drawFielder(ctx, x, y, role, jerseyColor = '#ef4444', isDiving = false, isCatching = false) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    if (isCatching) {
      // 1. LEAPING CATCH POSTURE (Airborne jump, cupped hands grasping ball)
      // Detached ground shadow below jumping fielder
      pxRect(ctx, -7, 16, 14, 4, 'rgba(0, 0, 0, 0.28)');

      // Body jumped up
      ctx.translate(0, -9);

      // Red Athletic Trousers with Crisp White Side Stripe
      pxRect(ctx, -6, 3, 4.5, 8, '#dc2626', '#0f172a');
      pxRect(ctx, -6, 3, 1.2, 8, '#ffffff');
      pxRect(ctx, 1.5, 2, 4.5, 9, '#dc2626', '#0f172a');
      pxRect(ctx, 4.8, 2, 1.2, 9, '#ffffff');

      // Black Athletic Shoes
      pxRect(ctx, -6, 11, 4.5, 2.5, '#0f172a');
      pxRect(ctx, 1.5, 11, 4.5, 2.5, '#0f172a');
      pxRect(ctx, -6, 13, 4.5, 0.8, '#ffffff');
      pxRect(ctx, 1.5, 13, 4.5, 0.8, '#ffffff');

      // Torso angled up towards ball
      pxRect(ctx, -8, -8, 16, 12, jerseyColor, '#0f172a');
      pxRect(ctx, -3, -8, 6, 2, '#ffffff');

      // Head with dark cricket cap
      pxRect(ctx, -5, -15, 10, 7, '#0f172a');

      // Extended arms with cupped hands clutching the red cricket ball!
      ctx.strokeStyle = '#c68656';
      ctx.lineWidth = 3;
      ctx.lineCap = 'square';
      ctx.beginPath();
      ctx.moveTo(-5, -4); ctx.lineTo(-2, -18);
      ctx.moveTo(5, -4); ctx.lineTo(2, -18);
      ctx.stroke();

      // White Fielding Gloves clutching ball
      pxRect(ctx, -3, -20, 3, 3, '#ffffff', '#0f172a');
      pxRect(ctx, 1, -20, 3, 3, '#ffffff', '#0f172a');

      // Red Cricket Ball securely caught between gloves!
      pxRect(ctx, -2, -21, 4.5, 4.5, '#dc2626', '#0f172a');
      pxRect(ctx, -2, -19.5, 4.5, 1, '#ffffff'); // Seam

      // Catch burst star sparkles
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -27); ctx.lineTo(0, -23);
      ctx.moveTo(-5, -19); ctx.lineTo(-9, -19);
      ctx.moveTo(5, -19); ctx.lineTo(9, -19);
      ctx.stroke();
    } else if (isDiving) {
      // 2. DIVING SLIDE POSTURE (Horizontal grass slide with extended arm stop)
      pxRect(ctx, -12, 3, 24, 5, 'rgba(0, 0, 0, 0.35)');

      // Diving horizontal body slide
      ctx.rotate(0.3);
      // Red athletic trousers with white stripe
      pxRect(ctx, -12, 1, 10, 4, '#dc2626', '#0f172a');
      pxRect(ctx, -12, 1, 10, 1, '#ffffff');

      // Red Jersey Torso
      pxRect(ctx, -6, -4, 16, 9, jerseyColor, '#0f172a');

      // Extended arms cutting off ball
      ctx.strokeStyle = '#c68656';
      ctx.lineWidth = 3;
      ctx.lineCap = 'square';
      ctx.beginPath();
      ctx.moveTo(10, 0); ctx.lineTo(19, -2);
      ctx.stroke();

      // Head with Cap
      pxRect(ctx, -10, -8, 8, 7, '#0f172a');

      // Turf slide dust pixels
      pxRect(ctx, -14, 4, 3, 2, '#4ade80');
      pxRect(ctx, -18, 5, 2, 2, '#86efac');
    } else {
      // 3. UPRIGHT ATHLETIC READY POSTURE (2D Pixel Art Fielder)
      // Ground Shadow
      pxRect(ctx, -9, 13, 18, 4.5, 'rgba(0, 0, 0, 0.35)');

      // Red Athletic Trousers with Crisp White Side Stripes
      pxRect(ctx, -6.5, 3, 5, 10, '#dc2626', '#0f172a');
      pxRect(ctx, 1.5, 3, 5, 10, '#dc2626', '#0f172a');
      pxRect(ctx, -6.5, 3, 1.4, 10, '#ffffff');
      pxRect(ctx, 5.1, 3, 1.4, 10, '#ffffff');

      // Black Athletic Shoes with White Soles
      pxRect(ctx, -6.5, 12, 5, 2.5, '#0f172a');
      pxRect(ctx, 1.5, 12, 5, 2.5, '#0f172a');
      pxRect(ctx, -6.5, 14, 5, 1, '#ffffff');
      pxRect(ctx, 1.5, 14, 5, 1, '#ffffff');

      // Red Athletic Jersey Torso
      pxRect(ctx, -8, -7, 16, 11, jerseyColor, '#0f172a');
      // White collar
      pxRect(ctx, -3, -7, 6, 2, '#ffffff');

      // Alert Arms & Skin Hands
      ctx.strokeStyle = jerseyColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'square';
      ctx.beginPath();
      ctx.moveTo(-6, -4); ctx.lineTo(-9, 1);
      ctx.moveTo(6, -4); ctx.lineTo(9, 1);
      ctx.stroke();

      pxRect(ctx, -10, 1, 2.5, 2.5, '#c68656');
      pxRect(ctx, 8, 1, 2.5, 2.5, '#c68656');

      // Head & Dark Cricket Cap (Facing pitch center)
      pxRect(ctx, -5, -15, 10, 8, '#0f172a');
      // Cap Visor pointing towards batsman
      pxRect(ctx, -4, -7, 8, 2, '#ffffff', '#0f172a');

      // Focused Eyes
      pxRect(ctx, -3, -11, 6, 2, '#c68656');
      pxRect(ctx, -2, -10.5, 1.5, 1, '#0f172a');
      pxRect(ctx, 1, -10.5, 1.5, 1, '#0f172a');
    }

    ctx.restore();
  },

  /**
   * Draw Realistic Stadium Crowd Stands & Tiered Spectators along the 80m boundary
   * With dynamic jumping, waving arms, camera flash cheering animations, floodlight towers, and packed stands!
   */
  drawStadiumCrowdStands(ctx, cx, cy, boundaryRadius, width, height, crowdState = {}) {
    ctx.save();
    const isCheering = crowdState.isCheering || crowdState.isRocketSix;
    const landing = crowdState.sixLanding || null;
    const now = Date.now();

    // 1. Boundary Rope Ring (White with yellow foam wedges)
    ctx.beginPath();
    ctx.arc(cx, cy, boundaryRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Foam Boundary Toblerone Markers (Yellow & Red sponsor blocks)
    const numMarkers = 48;
    for (let i = 0; i < numMarkers; i++) {
      const angle = (i / numMarkers) * Math.PI * 2;
      const mx = cx + Math.cos(angle) * (boundaryRadius + 3.5);
      const my = cy + Math.sin(angle) * (boundaryRadius + 3.5);

      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillStyle = i % 2 === 0 ? '#eab308' : '#ef4444';
      ctx.fillRect(-7, -2.5, 14, 5);
      ctx.restore();
    }

    // 2. Animated Electronic LED Boundary Ribbon Board
    ctx.beginPath();
    ctx.arc(cx, cy, boundaryRadius + 9, 0, Math.PI * 2);
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Glowing LED brand pulses along the boundary ribbon
    const ledCount = 24;
    for (let l = 0; l < ledCount; l++) {
      const lAngle = (l / ledCount) * Math.PI * 2 + (now * 0.0008);
      const lx = cx + Math.cos(lAngle) * (boundaryRadius + 9);
      const ly = cy + Math.sin(lAngle) * (boundaryRadius + 9);
      ctx.fillStyle = l % 3 === 0 ? '#38bdf8' : l % 3 === 1 ? '#facc15' : '#4ade80';
      ctx.beginPath();
      ctx.arc(lx, ly, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Fully Packed Tiered Grandstands (8 Concentric Tier Steps full of People!)
    const stepDistances = [
      boundaryRadius + 18,
      boundaryRadius + 34,
      boundaryRadius + 52,
      boundaryRadius + 72,
      boundaryRadius + 94,
      boundaryRadius + 118,
      boundaryRadius + 144,
      boundaryRadius + 172
    ];
    const jerseyColors = ['#2563eb', '#dc2626', '#eab308', '#10b981', '#9333ea', '#ffffff', '#0284c7', '#ea580c'];

    stepDistances.forEach((dist, stepIdx) => {
      // Concrete tier step bench
      ctx.beginPath();
      ctx.arc(cx, cy, dist, 0, Math.PI * 2);
      ctx.strokeStyle = stepIdx % 2 === 0 ? '#1e293b' : '#0f172a';
      ctx.lineWidth = 14;
      ctx.stroke();

      // Steel Safety Handrail along the tier
      ctx.beginPath();
      ctx.arc(cx, cy, dist + 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Densely packed spectators along this tier
      const specCount = 48 + stepIdx * 8;
      for (let s = 0; s < specCount; s++) {
        const sAngle = (s / specCount) * Math.PI * 2;
        let sx = cx + Math.cos(sAngle) * dist;
        let sy = cy + Math.sin(sAngle) * dist;

        // Ball landing reaction: nearby spectators scramble / cheer
        let isNearLanding = false;
        if (landing && landing.active) {
          const dToLanding = Math.hypot(sx - landing.x, sy - landing.y);
          if (dToLanding < 65) {
            isNearLanding = true;
            const scatterAngle = Math.atan2(sy - landing.y, sx - landing.x);
            sx += Math.cos(scatterAngle) * 7;
            sy += Math.sin(scatterAngle) * 7 - 4;
          }
        }

        // Cheering jump offset
        if (isCheering || isNearLanding) {
          const jumpOffset = Math.abs(Math.sin(now * 0.012 + s * 0.65)) * 5;
          sy -= jumpOffset;
        }

        // Cheering raised arms or placards
        if (isCheering || isNearLanding) {
          ctx.strokeStyle = '#d49b70';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(sx - 2.5, sy); ctx.lineTo(sx - 5.5, sy - 6.5);
          ctx.moveTo(sx + 2.5, sy); ctx.lineTo(sx + 5.5, sy - 6.5);
          ctx.stroke();

          // Boundary Placard Signs ("4" or "6") held by occasional fans!
          if (s % 7 === 0) {
            ctx.fillStyle = s % 2 === 0 ? '#facc15' : '#ffffff';
            ctx.fillRect(sx - 4.5, sy - 12, 9, 6);
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 5px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(s % 2 === 0 ? '6' : '4', sx, sy - 7.5);
          } else if (s % 11 === 0) {
            // Cheering team flag on pole
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(sx + 4, sy); ctx.lineTo(sx + 4, sy - 13); ctx.stroke();
            ctx.fillStyle = s % 3 === 0 ? '#3b82f6' : s % 3 === 1 ? '#ef4444' : '#10b981';
            ctx.beginPath();
            ctx.moveTo(sx + 4, sy - 13);
            ctx.lineTo(sx + 10, sy - 10);
            ctx.lineTo(sx + 4, sy - 7);
            ctx.closePath();
            ctx.fill();
          }
        }

        // Spectator Shirt
        ctx.fillStyle = isNearLanding ? '#fef08a' : jerseyColors[(s * 5 + stepIdx * 3) % jerseyColors.length];
        ctx.beginPath();
        ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Spectator Head
        ctx.fillStyle = '#d49b70';
        ctx.beginPath();
        ctx.arc(sx, sy - 2.8, 2.1, 0, Math.PI * 2);
        ctx.fill();

        // Spectator Cap
        if (s % 2 === 0) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(sx - 2, sy - 5, 4, 1.5);
        }

        // Random camera flashes & mobile LED torches twinkling in the packed crowd
        if (isCheering ? Math.random() < 0.04 : Math.random() < 0.008) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(sx, sy - 1, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // 4. Corner Stadium Floodlight Towers
    const floodlightAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
    floodlightAngles.forEach(fAngle => {
      const flDist = boundaryRadius + 185;
      const flX = cx + Math.cos(fAngle) * flDist;
      const flY = cy + Math.sin(fAngle) * flDist;

      // Heavy steel lattice tower base
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(flX - 10, flY - 10, 20, 20, 4);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Floodlight Lamp Bank (Bright glowing stadium lights)
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 12;
      for (let lx = -6; lx <= 6; lx += 6) {
        for (let ly = -6; ly <= 6; ly += 6) {
          ctx.beginPath();
          ctx.arc(flX + lx, flY + ly, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
    });

    // 5. Ball Landing Impact Shockwave in the Stands
    if (landing && landing.active) {
      ctx.save();
      const lx = landing.x;
      const ly = landing.y;

      // Expanding ripple shockwave in stands
      ctx.beginPath();
      ctx.arc(lx, ly, 22 + Math.sin(now * 0.015) * 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.9)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Camera Flash Burst
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(lx, ly, 30, 0, Math.PI * 2);
      ctx.fill();

      // Floating text badge in stands
      ctx.font = '900 13px "Inter", sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 8;
      ctx.fillText('🚀 CROWD CATCH IN THE STANDS!', lx, ly - 26);
      ctx.restore();
    }

    ctx.restore();
  }
};
