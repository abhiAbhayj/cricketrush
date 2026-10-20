// ============================================================================
// CRICKET RUSH - Clean Vector-Arcade Character & Stadium Presentation Engine
// Authentic Chibi/Vector Characters matching Reference: Striker Batsman,
// Bowler with High-Arm Action & Afro Hair, Wicket-Keeper, Non-Striker,
// Runners, Fielders, 80-Meter Stadium Crowd Stands & Regulation 30-Yard Circle
// ============================================================================

/**
 * Helper to resolve kit safely from either a kit object or a color string without external dependencies
 */
function resolveKit(kitOrColor, fallbackColor = '#0066b2') {
  if (kitOrColor && typeof kitOrColor === 'object') {
    const col = kitOrColor.color || (typeof fallbackColor === 'string' && fallbackColor.startsWith('#') ? fallbackColor : '#0066b2');
    return {
      color: col,
      secondaryColor: kitOrColor.secondaryColor || '#ffffff',
      pantsColor: kitOrColor.pantsColor || col,
      stripeColor: kitOrColor.stripeColor || kitOrColor.secondaryColor || '#ffffff'
    };
  }
  let col = '#0066b2';
  if (typeof kitOrColor === 'string' && kitOrColor.startsWith('#')) {
    col = kitOrColor;
  } else if (typeof fallbackColor === 'string' && fallbackColor.startsWith('#')) {
    col = fallbackColor;
  } else if (fallbackColor === 'jersey_sa') {
    col = '#006837';
  }
  return {
    color: col,
    secondaryColor: '#ffffff',
    pantsColor: col,
    stripeColor: '#ffffff'
  };
}

/**
 * Universal fallback for canvas rounded rectangle
 */
function drawRoundRectFallback(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Helper to draw clean rounded rectangles with stroke and 100% crash protection
 */
function drawRoundRect(ctx, x, y, w, h, radius, fill, stroke = null, lineWidth = 1.5) {
  if (!ctx || w <= 0 || h <= 0) return;
  const r = Math.max(0, Math.min(Math.min(w / 2, h / 2), typeof radius === 'number' ? radius : 0));
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    try {
      ctx.roundRect(x, y, w, h, r);
    } catch {
      drawRoundRectFallback(ctx, x, y, w, h, r);
    }
  } else {
    drawRoundRectFallback(ctx, x, y, w, h, r);
  }
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Helper to draw clean ellipses with stroke and 100% crash protection
 */
function drawEllipse(ctx, cx, cy, rx, ry, fill, stroke = null, lineWidth = 1.5) {
  if (!ctx || !Number.isFinite(cx) || !Number.isFinite(cy)) return;
  const safeRx = Math.max(0.1, Math.abs(typeof rx === 'number' && Number.isFinite(rx) ? rx : 1));
  const safeRy = Math.max(0.1, Math.abs(typeof ry === 'number' && Number.isFinite(ry) ? ry : 1));
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.ellipse === 'function') {
    try {
      ctx.ellipse(cx, cy, safeRx, safeRy, 0, 0, Math.PI * 2);
    } catch {
      ctx.arc(cx, cy, (safeRx + safeRy) / 2, 0, Math.PI * 2);
    }
  } else {
    ctx.arc(cx, cy, (safeRx + safeRy) / 2, 0, Math.PI * 2);
  }
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Helper to draw an authentic cricket batting pad with knee roll & spikes
 */
function drawBattingPad(ctx, x, y, isFrontFoot = false, strapColor = '#0a0e17') {
  ctx.save();
  ctx.translate(x, y);
  // Pad Body: Clean white rounded shin guard matching reference screenshot
  drawRoundRect(ctx, 0, 0, 5.4, 11.0, 2.0, '#ffffff', '#0a0e17', 1.3);
  // Vertical cane spine shadow for 3D depth
  drawRoundRect(ctx, 3.4, 1.0, 1.0, 8.5, 0.5, '#cbd5e1');
  // Horizontal Knee Roll: rounded pill contour across knee
  drawRoundRect(ctx, -0.4, 2.8, 6.2, 2.4, 1.0, '#f1f5f9', '#94a3b8', 0.8);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0.6, 3.2, 4.2, 0.8);
  // Team Accent Pad Straps
  ctx.strokeStyle = strapColor || '#0a0e17';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(0.4, 6.5); ctx.lineTo(5.0, 6.5);
  ctx.moveTo(0.4, 9.0); ctx.lineTo(5.0, 9.0);
  ctx.stroke();
  // Cricket Shoe with Team Dark Blue Trim (matching reference screenshot)
  drawRoundRect(ctx, -0.4, 10.8, 6.2, 2.8, 1.0, '#0f3460', '#0a0e17', 1.0);
  drawRoundRect(ctx, -0.4, 12.4, 6.2, 1.2, 0.5, '#ffffff');
  ctx.restore();
}

export const CharacterRenderer = {
  /**
   * Draw Striker Batsman in Exact 2D Arcade Style (matching User Reference Screenshot):
   * Clean egg-shaped white helmet dome with bold dark outline, blue team jersey,
   * white batting pads with dark blue shoes, and thick wooden bat with bold dark outline:
   * - Points DOWN-RIGHT at ~43° for Right-Handed batsmen (RHB)
   * - Points DOWN-LEFT at ~43° for Left-Handed batsmen (LHB, exact match to screenshot)
   * - 100% symmetric mirroring!
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
    jerseyColor = '#0066b2',
    kit = null,
    skinTone = '#f5d0b0'
  }) {
    ctx.save();

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_ind');
    const topColor = resolvedKit.color;
    const secColor = resolvedKit.secondaryColor || '#ffffff';
    const pantsCol = resolvedKit.pantsColor || topColor;
    const stripeCol = resolvedKit.stripeColor || '#0a0e17';

    const visualX = Math.round(x + (isSwinging ? 0 : weightShiftX));
    const visualY = Math.round(y - (isSteppingOut ? stepOutOffset : 0));
    ctx.translate(visualX, visualY);

    // Left-handed batsman mirrors the stance naturally across the pitch
    // RHB points down-right; LHB points down-left!
    if (isLeftHanded) {
      ctx.scale(-1, 1);
    }

    // 1. Soft Ground Shadow
    drawEllipse(ctx, 0, 11, 11, 4.5, 'rgba(0, 0, 0, 0.35)');

    // 2. Batting Leg Pads & Spikes (Clean side-on stance matching reference screenshot)
    let backPadX = -2.6;
    let frontPadX = 0.8;
    let backPadY = 1.0;
    let frontPadY = 2.5;

    if (isSteppingOut) {
      frontPadY = -4.5;
      backPadY = 4.5;
      frontPadX = 1.5;
      backPadX = -2.0;
    } else if (shotStyle === 'pull') {
      frontPadX = 0.2;
      backPadX = -3.2;
    } else if (!isSwinging) {
      frontPadY += triggerTap * 0.25;
    }

    // Back leg pad
    drawBattingPad(ctx, backPadX, backPadY, false, stripeCol);
    // Front leg pad (stepped forward slightly)
    drawBattingPad(ctx, frontPadX, frontPadY, true, stripeCol);

    // 3. Torso in Team Jersey (Compact side-on posture)
    ctx.save();
    let bodyRotation = isSwinging ? 0 : -0.15;
    if (isSwinging) {
      if (shotStyle === 'pull') bodyRotation = 0.45;
      else if (shotStyle === 'cover_drive') bodyRotation = -0.35;
      else if (shotStyle === 'square_cut') bodyRotation = -0.40;
      else if (shotStyle === 'sweep') bodyRotation = 0.50;
    }
    ctx.rotate(bodyRotation);

    // Clean Jersey Body with Bold Dark Outline (matching screenshot)
    drawRoundRect(ctx, -4.5, -6.5, 9.0, 9.5, 2.5, topColor, '#0a0e17', 1.4);
    // White contrast accents on collar/trim
    drawRoundRect(ctx, 2.5, -5.5, 1.2, 8.0, 0.5, secColor);
    drawRoundRect(ctx, -3.8, -5.5, 1.2, 8.0, 0.5, secColor);
    ctx.restore();

    // 4. White Batting Helmet (Clean egg-shaped dome with bold dark outline, matching screenshot)
    ctx.save();
    const headY = -13.0;
    // Neck
    drawRoundRect(ctx, -1.4, headY + 5.5, 2.8, 2.2, 0.8, skinTone, '#0a0e17', 0.9);

    // Egg-shaped White Helmet Dome
    drawEllipse(ctx, 0, headY, 4.8, 6.2, '#ffffff', '#0a0e17', 1.5);

    // Glossy specular highlight curve on top of helmet
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(-0.6, headY - 1.2, 3.4, Math.PI * 0.85, Math.PI * 1.8);
    ctx.stroke();

    // Dark Visor Peak Rim around bottom curve
    drawRoundRect(ctx, -3.4, headY + 3.8, 6.8, 2.2, 1.0, '#0a0e17');
    // Skin Tone face slit
    ctx.fillStyle = skinTone;
    ctx.fillRect(-1.8, headY + 3.4, 3.6, 1.4);
    ctx.restore();

    // 5. Arms, White Batting Gloves & Cricket Bat (Exact Match to Screenshot!)
    ctx.save();
    let reachX = 1.0;
    let reachY = 1.0;
    // In unmirrored space (RHB), batAngle = -0.75 points DOWN and to the RIGHT (+9.5px X, +10.2px Y).
    // In mirrored space (LHB: ctx.scale(-1, 1)), it points DOWN and to the LEFT (-9.5px X, +10.2px Y),
    // matching the user's uploaded reference screenshot with left-hander M. Sarkhel L!
    let batAngle = -0.75;

    if (isSwinging) {
      const p = swingProgress;
      if (shotStyle === 'cover_drive') {
        reachX = 1.0 - p * 8.5;
        reachY = 1.0 - p * 11.0;
        batAngle = -0.75 - p * 3.4;
      } else if (shotStyle === 'square_cut' || shotStyle === 'late_cut') {
        reachX = 1.0 + p * 8.0;
        reachY = 1.0 - p * 6.0;
        batAngle = -0.35 - p * 1.8;
      } else if (shotStyle === 'pull' || shotStyle === 'hook') {
        reachX = 1.0 + Math.sin(p * Math.PI) * 7.0;
        reachY = 1.0 - p * 7.5;
        batAngle = -0.75 + p * 2.8;
      } else if (shotStyle === 'sweep' || shotStyle === 'paddle_sweep') {
        reachX = -2.0 - p * 7.0;
        reachY = 2.0 - p * 6.0;
        batAngle = -0.40 + p * 2.2;
      } else if (shotStyle === 'step_out') {
        reachX = 1.0;
        reachY = 1.0 - p * 15.0;
        batAngle = -0.65 - p * 3.6;
      } else {
        // Straight Drive
        reachX = 1.0 - p * 3.0;
        reachY = 1.0 - p * 13.0;
        batAngle = -0.75 - p * 3.5;
      }
    } else {
      // READY STANCE: Angled down-right at ~43° for RHB, down-left at ~43° for LHB
      reachX = 1.0;
      reachY = 1.0 + (triggerTap * 0.35);
      batAngle = -0.75 - (triggerTap * 0.06);
    }

    // Dynamic hand attachment positions based on bat handle angle
    const sinA = Math.sin(batAngle);
    const cosA = Math.cos(batAngle);
    const upperHandX = reachX + 3.6 * sinA;
    const upperHandY = reachY - 3.6 * cosA;
    const lowerHandX = reachX + 1.6 * sinA;
    const lowerHandY = reachY - 1.6 * cosA;

    // Arms in jersey sleeves extending from shoulders to hands
    ctx.strokeStyle = topColor;
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    // Back arm
    ctx.beginPath();
    ctx.moveTo(3.5, -3.5);
    ctx.lineTo(upperHandX, upperHandY);
    ctx.stroke();
    // Front arm
    ctx.beginPath();
    ctx.moveTo(-3.5, -3.5);
    ctx.lineTo(lowerHandX, lowerHandY);
    ctx.stroke();

    // Move to bat center
    ctx.translate(reachX, reachY);
    ctx.rotate(batAngle);

    // Rubber Grip Handle (held inside gloves)
    drawRoundRect(ctx, -1.2, -5.0, 2.4, 5.5, 0.8, '#ef4444', '#0a0e17', 0.9);
    // Spiral grip texture lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(-1.0, -3.5); ctx.lineTo(1.0, -3.5);
    ctx.moveTo(-1.0, -1.8); ctx.lineTo(1.0, -1.8);
    ctx.stroke();
    // Top pommel
    drawRoundRect(ctx, -1.6, -6.0, 3.2, 1.2, 0.6, '#ffffff', '#0a0e17', 0.8);

    // White Batting Gloves securely gripping the handle
    drawRoundRect(ctx, -1.8, -4.5, 3.6, 2.8, 1.0, '#ffffff', '#0a0e17', 1.0);
    drawRoundRect(ctx, -1.8, -2.4, 3.6, 2.8, 1.0, '#ffffff', '#0a0e17', 1.0);

    // Willow Blade: Thick rounded wooden paddle pointing DOWN-RIGHT for RHB, DOWN-LEFT for LHB!
    // Dimensions: 6.8px wide by 14.0px long with bold dark outline #0a0e17 (matching screenshot!)
    drawRoundRect(ctx, -3.4, 0.5, 6.8, 14.0, 2.2, '#deb887', '#0a0e17', 1.5);
    // Honey willow sweet spot face
    drawRoundRect(ctx, -2.8, 3.5, 5.6, 8.0, 1.4, '#d49b55', '#b45309', 0.6);
    // Subtle center spine line
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(0, 1.5); ctx.lineTo(0, 13.0);
    ctx.stroke();
    // Dark toe guard at tip
    drawRoundRect(ctx, -3.4, 13.5, 6.8, 1.4, 0.6, '#0a0e17');

    ctx.restore();
    ctx.restore();
  },

  /**
   * Draw Bowler with High-Arm Action, Authentic Afro Hairstyle with signature Red Temple Bead,
   * Team-specific Jersey & Trousers with outer racing stripes (matching Reference Screenshot left player):
   * Supports team-to-team kit colors (CSK yellow/black, SA green/gold, IND blue/orange, etc.).
   */
  drawBowler(ctx, x, y, {
    runUpProgress = 0,
    bowlingArmAngle = 0,
    followThroughProgress = 0,
    actionType = 'high_arm',
    armSide = 'right',
    skinTone = '#c68656',
    faceStyle = 'afro',
    jerseyColor = '#006837',
    kit = null,
    isFielding = false,
    hasBall = false
  }) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_sa');
    const topColor = resolvedKit.color;
    const secColor = resolvedKit.secondaryColor || '#ffffff';
    const pantsCol = resolvedKit.pantsColor || topColor;
    const stripeCol = resolvedKit.stripeColor || secColor || '#ffffff';

    // 1. Soft Ground Shadow
    drawEllipse(ctx, 0, 12, 12, 5, 'rgba(0, 0, 0, 0.35)');

    // 2. Athletic Stride & Team Trousers with Outer Racing Stripes
    const isRunning = runUpProgress > 0 && runUpProgress < 1.0;
    const stride = isRunning ? Math.sin(runUpProgress * Math.PI * 8) * 5.0 : (isFielding ? Math.sin(Date.now() * 0.015) * 5.0 : 0);
    const isFollowingThrough = followThroughProgress > 0;
    const leanY = isFollowingThrough ? followThroughProgress * 3 : (isFielding ? 2 : 0);

    // Left Leg in Team Pants Color
    ctx.save();
    const leftLegY = 2 - stride + leanY;
    drawRoundRect(ctx, -6.5, leftLegY, 5.5, 11, 2.5, pantsCol, '#090e17', 1.4);
    // Outer racing stripe down leg seam (matching reference screenshot)
    ctx.strokeStyle = stripeCol;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-5.8, leftLegY + 1); ctx.lineTo(-5.8, leftLegY + 10);
    ctx.stroke();
    // Athletic shoe with white sole
    drawRoundRect(ctx, -7.0, leftLegY + 10, 6.5, 3.2, 1.3, '#090e17');
    drawRoundRect(ctx, -7.0, leftLegY + 12, 6.5, 1.2, 0.8, '#ffffff');
    ctx.restore();

    // Right Leg in Team Pants Color
    ctx.save();
    const rightLegY = 2 + stride + leanY * 0.5;
    drawRoundRect(ctx, 1.2, rightLegY, 5.5, 11, 2.5, pantsCol, '#090e17', 1.4);
    // Outer racing stripe down leg seam (matching reference screenshot)
    ctx.strokeStyle = stripeCol;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(6.0, rightLegY + 1); ctx.lineTo(6.0, rightLegY + 10);
    ctx.stroke();
    // Athletic shoe with white sole
    drawRoundRect(ctx, 0.8, rightLegY + 10, 6.5, 3.2, 1.3, '#090e17');
    drawRoundRect(ctx, 0.8, rightLegY + 12, 6.5, 1.2, 0.8, '#ffffff');
    ctx.restore();

    // 3. Team Jersey Torso
    ctx.save();
    const torsoY = -8 + leanY;
    drawRoundRect(ctx, -7.5, torsoY, 15, 12, 3.5, topColor, '#090e17', 1.5);
    // Team secondary contrast accents on flanks
    drawRoundRect(ctx, 5.2, torsoY + 1, 1.8, 10, 0.8, secColor);
    drawRoundRect(ctx, -7.0, torsoY + 1, 1.8, 10, 0.8, secColor);
    // Team V-neck collar & button placket
    ctx.fillStyle = secColor;
    ctx.beginPath();
    ctx.moveTo(-3, torsoY); ctx.lineTo(0, torsoY + 3.8); ctx.lineTo(3, torsoY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 4. Head, Focused Face & Afro Hairstyle with Signature Red Temple Bead
    ctx.save();
    const headY = -16 + leanY;
    // Neck
    drawRoundRect(ctx, -2.2, headY + 6.5, 4.4, 3.2, 1.2, skinTone, '#090e17', 1.1);

    // Rounded Face
    drawEllipse(ctx, 0, headY + 3.0, 5.8, 5.2, skinTone, '#090e17', 1.4);

    // Focused Eyes looking down the pitch
    ctx.fillStyle = '#090e17';
    ctx.fillRect(-2.8, headY + 2.5, 1.8, 1.5);
    ctx.fillRect(1.0, headY + 2.5, 1.8, 1.5);

    // Textured Curly Afro Dome on top (matching reference screenshot left player)
    drawEllipse(ctx, 0, headY - 0.5, 6.8, 5.4, '#111827', '#090e17', 1.5);
    // Textured curl nubs on crown for 3D depth
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(-3.5, headY - 1.2, 2.2, 0, Math.PI * 2);
    ctx.arc(3.5, headY - 1.2, 2.2, 0, Math.PI * 2);
    ctx.arc(0, headY - 3.2, 2.4, 0, Math.PI * 2);
    ctx.arc(-2.0, headY - 2.8, 2.0, 0, Math.PI * 2);
    ctx.arc(2.0, headY - 2.8, 2.0, 0, Math.PI * 2);
    ctx.fill();

    // Signature Red Accessory Bead on temple (prominent in reference screenshot)
    drawEllipse(ctx, -5.2, headY + 1.0, 1.6, 1.6, '#ef4444', '#090e17', 0.9);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5.6, headY + 0.6, 0.8, 0.8);
    ctx.restore();

    // 5. Arms with High-Arm Bowling Action or Fielding Reach
    if (isFielding) {
      // Reaching forward to scoop or catch the ball!
      ctx.strokeStyle = skinTone;
      ctx.lineWidth = 3.0;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-6, -4); ctx.lineTo(-2, 8);
      ctx.moveTo(6, -4); ctx.lineTo(2, 8);
      ctx.stroke();
    } else {
      // Non-Bowling Arm (Left Arm):
      ctx.save();
      ctx.strokeStyle = topColor;
      ctx.lineWidth = 3.0;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (isRunning && runUpProgress > 0.65) {
        const guideProgress = (runUpProgress - 0.65) / 0.35;
        const guideArmY = -4 - Math.sin(guideProgress * Math.PI) * 9;
        ctx.moveTo(-6, -4 + leanY);
        ctx.lineTo(-10, guideArmY + leanY);
      } else {
        ctx.moveTo(-6, -4 + leanY);
        ctx.lineTo(-3, 2 + leanY);
      }
      ctx.stroke();
      ctx.restore();

      // Bowling Arm (Right Arm) with High-Arm Windmill & Overhead Delivery:
      ctx.save();
      const shoulderX = 6.8;
      const shoulderY = -5 + leanY;
      ctx.translate(shoulderX, shoulderY);

      let effectiveAngle = 0;
      if (isFollowingThrough) {
        effectiveAngle = Math.PI * 0.35 + followThroughProgress * Math.PI * 0.45;
      } else if (isRunning) {
        if (runUpProgress < 0.65) {
          effectiveAngle = Math.sin(runUpProgress * Math.PI * 8) * 0.35;
        } else {
          const windRatio = (runUpProgress - 0.65) / 0.35;
          effectiveAngle = -Math.PI * (0.2 + windRatio * 0.8);
        }
      } else {
        effectiveAngle = bowlingArmAngle || 0;
      }

      ctx.rotate(effectiveAngle);

      // Upper arm in team jersey color
      ctx.strokeStyle = topColor;
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(0, -6.5);
      ctx.stroke();

      // Forearm in skin tone
      ctx.strokeStyle = skinTone;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(0, -6.5); ctx.lineTo(0, -14);
      ctx.stroke();

      // Red Cricket ball with white seam during run-up!
      if (isRunning && runUpProgress < 1.0) {
        drawEllipse(ctx, 0, -16.5, 3.0, 3.0, '#dc2626', '#090e17', 1.0);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-2.2, -16.5); ctx.lineTo(2.2, -16.5);
        ctx.stroke();
      } else {
        drawEllipse(ctx, 0, -15, 2.0, 2.0, skinTone);
      }

      ctx.restore();
    }

    ctx.restore();
  },

  /**
   * Draw Wicket-Keeper in crouching stance directly behind stumps (matching Reference Screenshot)
   */
  drawWicketKeeper(ctx, x, y, { skinTone = '#f5d0b0', isStumping = false, jerseyColor = '#0066b2', kit = null } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_sa');
    const topColor = resolvedKit.color;
    const secColor = resolvedKit.secondaryColor || '#ffffff';
    const stripeCol = resolvedKit.stripeColor || secColor || '#ffffff';

    // Ground Shadow
    drawEllipse(ctx, 0, 12, 13, 5, 'rgba(0, 0, 0, 0.35)');

    // Crouched Bent Legs & White Keeper Pads with team-colored straps
    drawBattingPad(ctx, -8.0, 0, false, stripeCol);
    drawBattingPad(ctx, 1.5, 0, false, stripeCol);

    // Torso in Fielding Team Jersey
    const torsoY = isStumping ? -13 : -9;
    drawRoundRect(ctx, -7.5, torsoY, 15, 11, 3.2, topColor, '#090e17', 1.4);
    ctx.fillStyle = secColor;
    ctx.beginPath();
    ctx.moveTo(-2.5, torsoY); ctx.lineTo(0, torsoY + 3); ctx.lineTo(2.5, torsoY);
    ctx.closePath();
    ctx.fill();

    // White Helmet & Visor Peak (Visor peak angled forward towards bowler)
    const headY = isStumping ? -18 : -14;
    drawEllipse(ctx, 0, headY + 2.5, 6.5, 6.0, '#ffffff', '#090e17', 1.5);
    drawRoundRect(ctx, -4.8, headY - 0.5, 8.0, 2.5, 1.2, '#090e17');
    ctx.fillStyle = skinTone;
    ctx.fillRect(-2.5, headY + 1.2, 5.0, 1.8);

    // Wicket-Keeping Gloves with Team Trim Webbing
    const gloveY = isStumping ? -21 : -11;
    // Left Glove
    drawRoundRect(ctx, -12, gloveY, 6.0, 5.5, 1.8, '#1d4ed8', '#090e17', 1.2);
    drawRoundRect(ctx, -13, gloveY + 1.2, 2.2, 3.0, 0.8, secColor);
    // Right Glove (reaching forward on stumping)
    const rGloveX = isStumping ? 1 : 6;
    drawRoundRect(ctx, rGloveX, gloveY, 6.0, 5.5, 1.8, '#1d4ed8', '#090e17', 1.2);
    drawRoundRect(ctx, rGloveX + 4.0, gloveY + 1.2, 2.2, 3.0, 0.8, secColor);

    ctx.restore();
  },

  /**
   * Draw Non-Striker Batsman in upright alert stance with bat grounded vertically down by side
   * (matching Reference Screenshot top-right batsman at bowling crease)
   */
  drawNonStriker(ctx, x, y, {
    skinTone = '#f5d0b0',
    jerseyColor = '#0066b2',
    kit = null,
    pitchCenterX = null,
    isLeftHanded = false
  } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_ind');
    const topColor = resolvedKit.color;
    const secColor = resolvedKit.secondaryColor || '#ffffff';
    const stripeCol = resolvedKit.stripeColor || secColor || '#ffffff';

    // If on left side of pitch (x < pitchCenterX), mirror so bat is grounded on the inside towards pitch
    const isLeftSide = pitchCenterX !== null ? (x < pitchCenterX) : false;
    if (isLeftSide) {
      ctx.scale(-1, 1);
    }

    // 1. Ground Shadow (Clean soft shadow under feet)
    drawEllipse(ctx, 0, 13, 12, 4.5, 'rgba(0, 0, 0, 0.35)');

    // 2. Leg Pads & Spikes (Both pads planted upright facing down-pitch towards striker)
    drawBattingPad(ctx, -5.0, 0.5, true, stripeCol);
    drawBattingPad(ctx, 1.8, 1.2, false, stripeCol);

    // 3. Torso in Team Jersey (Upright stance facing down-pitch towards striker)
    drawRoundRect(ctx, -6.5, -9, 13, 11, 3.0, topColor, '#090e17', 1.4);
    // Contrast accents on flanks
    drawRoundRect(ctx, 4.2, -8, 1.6, 9, 0.6, secColor);
    drawRoundRect(ctx, -5.8, -8, 1.6, 9, 0.6, secColor);
    // V-neck collar
    ctx.fillStyle = secColor;
    ctx.beginPath();
    ctx.moveTo(-2.0, -9);
    ctx.lineTo(0, -6.0);
    ctx.lineTo(2.0, -9);
    ctx.closePath();
    ctx.fill();

    // 4. White Helmet: Visor pointing DOWN THE PITCH towards striker
    const headY = -16.5;
    drawEllipse(ctx, 0, headY + 2.5, 6.2, 5.8, '#ffffff', '#090e17', 1.5);
    drawRoundRect(ctx, -2.5, headY - 0.5, 5.0, 2.0, 0.8, topColor);
    // Visor turned down the track
    drawRoundRect(ctx, -4.2, headY + 4.5, 8.4, 2.5, 1.1, '#090e17');
    ctx.fillStyle = skinTone;
    ctx.fillRect(-2.5, headY + 3.8, 5.0, 1.6);

    // 5. Arms & Bat (Holding bat vertically down along side, matching Reference Screenshot):
    // Left arm: resting relaxed along side
    ctx.strokeStyle = topColor;
    ctx.lineWidth = 3.0;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-5.0, -4.0);
    ctx.lineTo(-6.0, 2.0);
    ctx.stroke();

    // Right arm: holding bat straight down along side
    ctx.beginPath();
    ctx.moveTo(5.0, -4.0);
    ctx.lineTo(5.8, 2.0);
    ctx.stroke();

    // White batting glove gripping the bat handle
    drawRoundRect(ctx, 4.0, 1.0, 4.2, 4.2, 1.2, '#ffffff', '#090e17', 1.0);

    // Bat held vertically down:
    // Handle extends UP from hand:
    drawRoundRect(ctx, 4.8, -6.5, 2.2, 7.5, 0.8, '#ef4444', '#090e17', 0.9);
    drawRoundRect(ctx, 4.4, -7.5, 3.0, 1.2, 0.6, '#ffffff', '#090e17', 0.8);

    // Willow Blade extends DOWN onto crease turf:
    drawRoundRect(ctx, 3.2, 3.5, 5.6, 17.0, 1.6, '#eab308', '#090e17', 1.2);
    // Sweet spot face block
    drawRoundRect(ctx, 3.6, 7.5, 4.8, 7.0, 1.0, '#deb887', '#92400e', 0.8);
    // Center spine crease
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(6.0, 4.5);
    ctx.lineTo(6.0, 19.5);
    ctx.stroke();
    // Dark rubber toe guard on turf
    drawRoundRect(ctx, 3.2, 19.5, 5.6, 1.4, 0.6, '#090e17');

    ctx.restore();
  },

  /**
   * Draw Runner sprinting between wickets with pumping legs and bat slide
   */
  drawRunner(ctx, x, y, {
    isStriker = true,
    runProgress = 0,
    runDirection = 1,
    isSliding = false,
    jerseyColor = '#0066b2',
    kit = null,
    skinTone = '#f5d0b0'
  } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_ind');
    const topColor = resolvedKit.color;
    const stripeCol = resolvedKit.stripeColor || '#ffffff';

    // Sprint lean angle
    const leanAngle = runDirection > 0 ? -0.20 : 0.20;
    ctx.rotate(leanAngle);

    // Ground Shadow
    drawEllipse(ctx, 0, 12, 12, 5, 'rgba(0, 0, 0, 0.38)');

    // Alternating Running Legs with White Batting Pads
    const stride = Math.sin(runProgress * Math.PI * 10) * 6.0;
    drawBattingPad(ctx, -6.5, 1 - stride, false, stripeCol);
    drawBattingPad(ctx, 1.2, 1 + stride, false, stripeCol);

    // Jersey Torso
    drawRoundRect(ctx, -7.5, -9, 15, 11, 3.2, topColor, '#090e17', 1.5);

    // White Helmet
    const headY = -16;
    drawEllipse(ctx, 0, headY + 2.5, 6.5, 6.0, '#ffffff', '#090e17', 1.5);
    const visorY = runDirection > 0 ? headY + 1 : headY + 4;
    drawRoundRect(ctx, -4.5, visorY, 8.0, 2.5, 1.2, '#090e17');

    // Arms & Outstretched Bat sliding along the turf!
    ctx.save();
    const batReachY = runDirection > 0 ? (isSliding ? -20 : -14) : (isSliding ? 16 : 10);
    const batAngle = runDirection > 0 ? (isSliding ? -Math.PI / 2 - 0.2 : -Math.PI / 2 + 0.3) : (isSliding ? Math.PI / 2 + 0.2 : Math.PI / 2 - 0.3);

    // Pumping arm
    ctx.strokeStyle = topColor;
    ctx.lineWidth = 3.0;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.lineTo(-10, stride > 0 ? 4 : -7);
    ctx.stroke();

    // Arm holding bat
    ctx.beginPath();
    ctx.moveTo(6, -4);
    ctx.lineTo(7, batReachY + (runDirection > 0 ? 7 : -7));
    ctx.stroke();

    // Batting Glove
    drawRoundRect(ctx, 5.5, batReachY + (runDirection > 0 ? 4 : -6), 4.5, 4.5, 1.8, '#ffffff', '#090e17', 1.2);

    // Grounded Cricket Bat
    ctx.translate(7, batReachY);
    ctx.rotate(batAngle);
    drawRoundRect(ctx, -1.4, -6, 2.8, 6, 1, '#ef4444', '#090e17', 1.0);
    drawRoundRect(ctx, -3.0, 0, 6.0, 17, 1.8, '#eab308', '#090e17', 1.2);

    ctx.restore();
    ctx.restore();
  },

  /**
   * Draw Fielder in Vector-Arcade style (alert posture, diving slide, or leaping catch)
   * Full support for team-specific jersey color, pants color, and outer racing stripes.
   */
  drawFielder(ctx, x, y, role, jerseyColor = '#ef4444', isDiving = false, isCatching = false, vx = 0, vy = 0, isFielding = false, kit = null) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_sa');
    const topColor = resolvedKit.color;
    const secColor = resolvedKit.secondaryColor || '#ffffff';
    const pantsCol = resolvedKit.pantsColor || topColor;
    const stripeCol = resolvedKit.stripeColor || secColor || '#ffffff';

    if (isCatching) {
      // Leaping Catch
      drawEllipse(ctx, 0, 16, 12, 4, 'rgba(0, 0, 0, 0.28)');
      ctx.translate(0, -9);
      // Legs in pants color
      drawRoundRect(ctx, -5.5, 2, 4.8, 9, 2, pantsCol, '#090e17', 1.2);
      drawRoundRect(ctx, 1.2, 2, 4.8, 9, 2, pantsCol, '#090e17', 1.2);
      // Torso in team jersey
      drawRoundRect(ctx, -7.5, -8, 15, 11, 3, topColor, '#090e17', 1.4);
      // Head
      drawEllipse(ctx, 0, -14, 5.5, 5.0, '#c68656', '#090e17', 1.2);
      drawRoundRect(ctx, -4.5, -16.5, 9, 3.0, 1.2, '#090e17');
      // Raised arms catching ball
      ctx.strokeStyle = '#c68656';
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-5, -4); ctx.lineTo(-2, -17);
      ctx.moveTo(5, -4); ctx.lineTo(2, -17);
      ctx.stroke();
      // White fielding gloves clutching ball
      drawRoundRect(ctx, -3, -19, 3.2, 3.2, 1, '#ffffff', '#090e17', 1.0);
      drawRoundRect(ctx, 1, -19, 3.2, 3.2, 1, '#ffffff', '#090e17', 1.0);
      // Cricket ball
      drawEllipse(ctx, 0, -19, 2.8, 2.8, '#dc2626', '#090e17', 1.0);
    } else if (isDiving) {
      // Diving slide along grass with turf spray
      drawEllipse(ctx, 0, 4, 18, 5, 'rgba(0, 0, 0, 0.35)');
      ctx.rotate(0.30);
      drawRoundRect(ctx, -11, 1, 9, 4.8, 1.8, pantsCol, '#090e17', 1.2);
      drawRoundRect(ctx, -5.5, -4, 15, 8.5, 2.8, topColor, '#090e17', 1.4);
      ctx.strokeStyle = '#c68656';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(9, 0); ctx.lineTo(17, -2);
      ctx.stroke();
      // White fielding gloves sliding forward
      drawRoundRect(ctx, 16, -4, 4, 3.5, 1, '#ffffff', '#090e17', 1.0);
      drawEllipse(ctx, -9, -6.5, 4.8, 4.5, '#090e17');
    } else {
      const moveSpeed = Math.hypot(vx, vy);
      const isRunning = moveSpeed > 0.45;
      const stride = isRunning ? Math.sin(Date.now() * 0.022) * 5.0 : 0;
      const armSwing = isRunning ? Math.sin(Date.now() * 0.022) * 6.0 : 0;

      // Soft ground shadow (stretches dynamically when sprinting)
      drawEllipse(ctx, 0, 12, isRunning ? 14 : 12, 4.8, 'rgba(0, 0, 0, 0.35)');

      // Slight athletic sprint lean in direction of movement
      if (isRunning && Math.abs(vx) > 0.2) {
        ctx.rotate(Math.max(-0.25, Math.min(0.25, (vx / (moveSpeed || 1)) * 0.22)));
      }

      // Athletic legs & trousers with outer racing stripes
      drawRoundRect(ctx, -6.0, 2 - stride, 5.0, 10.5, 2.2, pantsCol, '#090e17', 1.3);
      drawRoundRect(ctx, 1.2, 2 + stride, 5.0, 10.5, 2.2, pantsCol, '#090e17', 1.3);

      ctx.strokeStyle = stripeCol;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-5.4, 3 - stride); ctx.lineTo(-5.4, 11 - stride);
      ctx.moveTo(5.6, 3 + stride); ctx.lineTo(5.6, 11 + stride);
      ctx.stroke();

      // Shoes / athletic spikes
      drawRoundRect(ctx, -6.0, 11.5 - stride, 5.0, 2.8, 1, '#090e17');
      drawRoundRect(ctx, 1.2, 11.5 + stride, 5.0, 2.8, 1, '#090e17');

      // Torso / Team Jersey
      drawRoundRect(ctx, -7.5, -8, 15, 11, 3.2, topColor, '#090e17', 1.4);

      // Team secondary color collar
      ctx.fillStyle = secColor;
      ctx.beginPath();
      ctx.moveTo(-2.5, -8); ctx.lineTo(0, -5); ctx.lineTo(2.5, -8);
      ctx.closePath();
      ctx.fill();

      // Dynamic arms (swinging athletically when sprinting or bent ready crouch)
      ctx.strokeStyle = topColor;
      ctx.lineWidth = 3.0;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (isRunning) {
        ctx.moveTo(-6, -4); ctx.lineTo(-9, 1 + armSwing);
        ctx.moveTo(6, -4); ctx.lineTo(9, 1 - armSwing);
      } else {
        ctx.moveTo(-6, -4); ctx.lineTo(-9, 1);
        ctx.moveTo(6, -4); ctx.lineTo(9, 1);
      }
      ctx.stroke();

      // White fielding wristbands / gloves
      drawRoundRect(ctx, -10.5, isRunning ? (1 + armSwing - 1.5) : -0.5, 3.2, 3.2, 1, '#ffffff', '#090e17', 0.8);
      drawRoundRect(ctx, 7.5, isRunning ? (1 - armSwing - 1.5) : -0.5, 3.2, 3.2, 1, '#ffffff', '#090e17', 0.8);

      // Head with dark hair / athletic cap
      drawEllipse(ctx, 0, -14, 5.2, 4.8, '#c68656', '#090e17', 1.3);
      drawEllipse(ctx, 0, -16, 5.8, 4.0, '#111827', '#090e17', 1.2);
    }

    ctx.restore();
  },

  /**
   * Draw Official 30-Yard Inner Circle with regulation painted white discs,
   * subtle inner turf highlight tint, high-contrast dashed ring & turf typography
   */
  draw30YardCircle(ctx, cx, cy, rx = 270, ry = 310) {
    if (!ctx) return;
    try {
      const safeRx = Math.max(10, Math.abs(typeof rx === 'number' && Number.isFinite(rx) ? rx : 270));
      const safeRy = Math.max(10, Math.abs(typeof ry === 'number' && Number.isFinite(ry) ? ry : 310));
      ctx.save();

      // 1. Subtle Inner Turf Tint
      drawEllipse(ctx, cx, cy, safeRx, safeRy, 'rgba(255, 255, 255, 0.035)');

      // 2. High-Contrast Dashed White Line
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 2.2;
      ctx.setLineDash([9, 9]);
      ctx.beginPath();
      if (typeof ctx.ellipse === 'function') {
        try {
          ctx.ellipse(cx, cy, safeRx, safeRy, 0, 0, Math.PI * 2);
        } catch {
          ctx.arc(cx, cy, (safeRx + safeRy) / 2, 0, Math.PI * 2);
        }
      } else {
        ctx.arc(cx, cy, (safeRx + safeRy) / 2, 0, Math.PI * 2);
      }
      ctx.stroke();
      ctx.restore();

      // 3. Regulation White Marker Discs spaced evenly along the 30-yard ring
      const numDiscs = 24;
      for (let d = 0; d < numDiscs; d++) {
        const angle = (d / numDiscs) * Math.PI * 2;
        const dx = cx + Math.cos(angle) * safeRx;
        const dy = cy + Math.sin(angle) * safeRy;

        drawEllipse(ctx, dx, dy + 1, 3.2, 2.2, 'rgba(0, 0, 0, 0.45)');
        drawEllipse(ctx, dx, dy, 3.0, 2.2, '#ffffff', '#0f172a', 1.0);
      }

      // 4. Stamped Turf Lettering
      ctx.font = 'bold 10px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.textAlign = 'center';
      ctx.fillText('• 30 YARDS INFIELD CIRCLE •', cx, cy - safeRy + 18);
      ctx.fillText('• 30 YARDS INFIELD CIRCLE •', cx, cy + safeRy - 12);
      ctx.restore();
    } catch {
      ctx.restore();
    }
  },

  /**
   * Draw Realistic Stadium Crowd Stands & Tiered Spectators along the boundary (matching Reference Screenshot):
   * White boundary rope, green grass run-off apron, cyan glowing LED advertising ribbon with white sponsor logos & tunnel gate,
   * Tier 1 lower seating bowl divided by bright yellow aisle staircases with horizontal ladder rungs,
   * concourse promenade deck with double safety railings, Tier 2 upper grandstand, and packed colorful spectators!
   */
  drawStadiumCrowdStands(ctx, cx, cy, boundaryRadius, width, height, crowdState = {}) {
    if (!ctx) return;
    try {
      ctx.save();
      const br = Math.max(100, Number.isFinite(boundaryRadius) ? boundaryRadius : 780);
      const safeCx = Number.isFinite(cx) ? cx : (width ? width / 2 : 200);
      const safeCy = Number.isFinite(cy) ? cy : (height ? height * 0.52 : 300);
      const isCheering = !!(crowdState.isCheering || crowdState.isRocketSix);
      const landing = crowdState.sixLanding || null;
      const now = Date.now();

      // 1. Boundary Rope
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, br, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // 2. Green Turf Run-Off Margin behind boundary rope
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, br + 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#225325';
      ctx.lineWidth = 10;
      ctx.stroke();

      // 3. Electronic LED Advertising Ribbon Board (Cyan / Blue rim)
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, br + 14, 0, Math.PI * 2);
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(safeCx, safeCy, br + 11.5, 0, Math.PI * 2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Sponsor Logo Banners
      const numSponsorBanners = 24;
      for (let b = 0; b < numSponsorBanners; b++) {
        const bAngle = (b / numSponsorBanners) * Math.PI * 2 + (now * 0.0003);
        const bx = safeCx + Math.cos(bAngle) * (br + 14);
        const by = safeCy + Math.sin(bAngle) * (br + 14);

        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(bAngle + Math.PI / 2);
        if (b % 2 === 0) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-8, -2, 16, 4);
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(-6, -1.2, 12, 2.4);
        } else {
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(-9, -2, 18, 4);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-7, -1, 14, 2);
        }
        ctx.restore();
      }

      // White Tunnel Entrance Gate cutout
      const gateAngle = Math.PI * 0.98;
      const gx = safeCx + Math.cos(gateAngle) * (br + 13);
      const gy = safeCy + Math.sin(gateAngle) * (br + 13);
      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(gateAngle + Math.PI / 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-10, -3.5, 20, 7);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-8, -2.5, 16, 5);
      ctx.restore();

      // 4. Stadium Grandstand Dimensions
      const r1_in = br + 18;
      const r1_out = br + 96;
      const r_conc_in = br + 96;
      const r_conc_out = br + 118;
      const r2_in = br + 118;
      const r2_out = br + 230;

      // TIER 1 (Lower Grandstand) Base Concrete Bowl
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, (r1_in + r1_out) / 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#141e2e';
      ctx.lineWidth = r1_out - r1_in;
      ctx.stroke();

      // CONCOURSE PROMENADE
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, (r_conc_in + r_conc_out) / 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = r_conc_out - r_conc_in;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(safeCx, safeCy, r_conc_in + 1, 0, Math.PI * 2);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(safeCx, safeCy, r_conc_out - 1, 0, Math.PI * 2);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // TIER 2 (Upper Grandstand) Base Concrete Bowl
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, (r2_in + r2_out) / 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#0d1522';
      ctx.lineWidth = r2_out - r2_in;
      ctx.stroke();

      // 5. Bright Yellow Aisle Staircases
      const numAisles = 16;
      const dTheta = 0.034;

      for (let a = 0; a < numAisles; a++) {
        const aisleAngle = (a / numAisles) * Math.PI * 2;
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.3;

        // Side rails Tier 1
        ctx.beginPath();
        ctx.moveTo(safeCx + Math.cos(aisleAngle - dTheta / 2) * r1_in, safeCy + Math.sin(aisleAngle - dTheta / 2) * r1_in);
        ctx.lineTo(safeCx + Math.cos(aisleAngle - dTheta / 2) * (r1_out - 2), safeCy + Math.sin(aisleAngle - dTheta / 2) * (r1_out - 2));
        ctx.moveTo(safeCx + Math.cos(aisleAngle + dTheta / 2) * r1_in, safeCy + Math.sin(aisleAngle + dTheta / 2) * r1_in);
        ctx.lineTo(safeCx + Math.cos(aisleAngle + dTheta / 2) * (r1_out - 2), safeCy + Math.sin(aisleAngle + dTheta / 2) * (r1_out - 2));
        ctx.stroke();

        // Rungs
        for (let r = r1_in + 6; r < r1_out - 4; r += 12) {
          ctx.beginPath();
          ctx.moveTo(safeCx + Math.cos(aisleAngle - dTheta / 2) * r, safeCy + Math.sin(aisleAngle - dTheta / 2) * r);
          ctx.lineTo(safeCx + Math.cos(aisleAngle + dTheta / 2) * r, safeCy + Math.sin(aisleAngle + dTheta / 2) * r);
          ctx.stroke();
        }

        // Side rails Tier 2
        ctx.beginPath();
        ctx.moveTo(safeCx + Math.cos(aisleAngle - dTheta / 2) * (r2_in + 2), safeCy + Math.sin(aisleAngle - dTheta / 2) * (r2_in + 2));
        ctx.lineTo(safeCx + Math.cos(aisleAngle - dTheta / 2) * r2_out, safeCy + Math.sin(aisleAngle - dTheta / 2) * r2_out);
        ctx.moveTo(safeCx + Math.cos(aisleAngle + dTheta / 2) * (r2_in + 2), safeCy + Math.sin(aisleAngle + dTheta / 2) * (r2_in + 2));
        ctx.lineTo(safeCx + Math.cos(aisleAngle + dTheta / 2) * r2_out, safeCy + Math.sin(aisleAngle + dTheta / 2) * r2_out);
        ctx.stroke();

        for (let r = r2_in + 8; r < r2_out - 6; r += 14) {
          ctx.beginPath();
          ctx.moveTo(safeCx + Math.cos(aisleAngle - dTheta / 2) * r, safeCy + Math.sin(aisleAngle - dTheta / 2) * r);
          ctx.lineTo(safeCx + Math.cos(aisleAngle + dTheta / 2) * r, safeCy + Math.sin(aisleAngle + dTheta / 2) * r);
          ctx.stroke();
        }
      }

      // 6. Realistic Stadium Audience Spectators (Tiered Seating with Animated Individual Fans)
      const fanJerseys = ['#1d4ed8', '#facc15', '#dc2626', '#16a34a', '#ea580c', '#38bdf8', '#ffffff', '#9333ea'];
      const skinTones = ['#fcd34d', '#d97706', '#b45309', '#fbcfe8', '#fef08a'];
      const tier1Rows = [br + 32, br + 60];
      const tier2Rows = [br + 136, br + 168];

      const drawCrowdTier = (rows, isUpper) => {
        rows.forEach((rowDist, rIdx) => {
          // Concrete stepped bench
          ctx.beginPath();
          ctx.arc(safeCx, safeCy, rowDist, 0, Math.PI * 2);
          ctx.strokeStyle = isUpper ? '#111b2b' : '#182438';
          ctx.lineWidth = 14;
          ctx.stroke();

          // Seat backrest rail
          ctx.beginPath();
          ctx.arc(safeCx, safeCy, rowDist - 4, 0, Math.PI * 2);
          ctx.strokeStyle = '#0b1320';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Individual Spectators spaced evenly around the circumference
          const circumference = Math.PI * 2 * rowDist;
          const spectatorCount = Math.floor(circumference / 52); // ~60-70 fans per row (ultra fast & clean)
          const angleStep = (Math.PI * 2) / spectatorCount;

          for (let i = 0; i < spectatorCount; i++) {
            const angle = i * angleStep;
            // Skip spectators in aisle gaps
            const aisleCheck = ((angle + Math.PI * 2) % ((Math.PI * 2) / 16));
            if (aisleCheck < 0.06 || aisleCheck > ((Math.PI * 2) / 16) - 0.06) continue;

            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            const perpX = -sinA;
            const perpY = cosA;

            const sx = safeCx + cosA * rowDist;
            const sy = safeCy + sinA * rowDist;

            // Seeded hash for consistent properties
            const hash = (i * 37 + rIdx * 101) % 1000;
            const jerseyColor = fanJerseys[hash % fanJerseys.length];
            const skinTone = skinTones[(hash >> 2) % skinTones.length];

            const cheerBob = isCheering ? Math.sin(now * 0.012 + i * 0.5) * 2.5 : 0;

            // Torso (facing pitch center)
            ctx.fillStyle = jerseyColor;
            ctx.beginPath();
            ctx.arc(sx, sy + cheerBob, 3.8, 0, Math.PI * 2);
            ctx.fill();

            // Head (facing center of the pitch)
            ctx.fillStyle = skinTone;
            ctx.beginPath();
            ctx.arc(sx - cosA * 2.2, sy - sinA * 2.2 + cheerBob, 2.2, 0, Math.PI * 2);
            ctx.fill();

            // Cheering raised arms
            if (isCheering) {
              ctx.strokeStyle = skinTone;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(sx - perpX * 3, sy - perpY * 3);
              ctx.lineTo(sx - perpX * 4 - cosA * 3.5, sy - perpY * 4 - sinA * 3.5);
              ctx.moveTo(sx + perpX * 3, sy + perpY * 3);
              ctx.lineTo(sx + perpX * 4 - cosA * 3.5, sy + perpY * 4 - sinA * 3.5);
              ctx.stroke();
            }

            // Every 10th fan waves a team flag
            if (hash % 10 === 0) {
              const flagWave = Math.sin(now * 0.008 + i) * 3;
              const flagColor = (hash % 3 === 0) ? '#ff9933' : (hash % 3 === 1) ? '#facc15' : '#38bdf8';
              ctx.strokeStyle = '#e2e8f0';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(sx - cosA * 7 + flagWave, sy - sinA * 7);
              ctx.stroke();

              ctx.fillStyle = flagColor;
              ctx.fillRect(sx - cosA * 7 + flagWave, sy - sinA * 7 - 3, 5, 3.5);
            }

            // Twinkling mobile phone camera flashes in the crowd
            if ((hash + Math.floor(now / 160)) % 37 === 0) {
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(sx, sy - 2, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
      };

      drawCrowdTier(tier1Rows, false);
      drawCrowdTier(tier2Rows, true);

      // 7. Corner Stadium Floodlight Towers
      const floodlightAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
      floodlightAngles.forEach(fAngle => {
        const flDist = br + 245;
        const flX = safeCx + Math.cos(fAngle) * flDist;
        const flY = safeCy + Math.sin(fAngle) * flDist;

        drawRoundRect(ctx, flX - 12, flY - 12, 24, 24, 4, '#1e293b', '#475569', 1.5);

        ctx.fillStyle = '#fef08a';
        for (let lx = -7; lx <= 7; lx += 7) {
          for (let ly = -7; ly <= 7; ly += 7) {
            ctx.beginPath();
            ctx.arc(flX + lx, flY + ly, 2.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // 8. Ball Landing Impact Shockwave in the Stands
      if (landing && landing.active && Number.isFinite(landing.x) && Number.isFinite(landing.y)) {
        const lx = landing.x;
        const ly = landing.y;

        ctx.beginPath();
        ctx.arc(lx, ly, 22 + Math.sin(now * 0.015) * 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.9)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = '900 12px "Inter", sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.textAlign = 'center';
        ctx.fillText('🚀 CROWD CATCH IN THE STANDS!', lx, ly - 24);
      }

      ctx.restore();
    } catch {
      ctx.restore();
    }
  }
};
