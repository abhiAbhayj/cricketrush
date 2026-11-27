// ============================================================================
// CRICKET RUSH - Clean Vector-Arcade Character & Stadium Presentation Engine
// Authentic High-Definition Cricketers: Striker Batsman, Bowler with High-Arm Action
// & Afro Hair, Wicket-Keeper, Non-Striker, Sprinting Runners, Diving Fielders,
// Dynamic Multi-Tier Stadium Crowd Stands & Regulation 30-Yard Circle
// ============================================================================

/**
 * Universal color shading helper for stadium seats and lighting
 */
export function shadeColor(color, percent) {
  if (!color || typeof color !== 'string' || !color.startsWith('#')) return color || '#888888';
  let num = parseInt(color.slice(1), 16);
  if (color.length === 4) {
    const r = (num >> 8) & 0xf;
    const g = (num >> 4) & 0xf;
    const b = num & 0xf;
    num = (r * 17) << 16 | (g * 17) << 8 | (b * 17);
  }
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

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
 * Dynamic Atmospheric Ground Shadow:
 * - Night: 4-Corner Halogen Floodlight multi-directional soft shadows
 * - Sunset: Elongated warm dusk shadow extending down-right
 * - Afternoon: Angled crisp directional shadow
 * - Day: Centered overhead sun ground shadow
 */
function drawLightingShadow(ctx, timeOfDay = 'day', rx = 11, ry = 4.5, cyOffset = 11) {
  ctx.save();
  if (timeOfDay === 'night') {
    // 4-corner multi-directional floodlight shadows from stadium towers
    const quadOffsets = [
      { dx: -6.5, dy: 3.5, rx: rx * 0.9, ry: ry * 0.85, a: 0.18 },
      { dx: 6.5, dy: 3.5, rx: rx * 0.9, ry: ry * 0.85, a: 0.18 },
      { dx: -4.5, dy: -3.0, rx: rx * 0.8, ry: ry * 0.8, a: 0.14 },
      { dx: 4.5, dy: -3.0, rx: rx * 0.8, ry: ry * 0.8, a: 0.14 }
    ];
    quadOffsets.forEach(({ dx, dy, rx: srx, ry: sry, a }) => {
      drawEllipse(ctx, dx, cyOffset + dy, srx, sry, `rgba(0, 0, 0, ${a})`);
    });
  } else if (timeOfDay === 'sunset') {
    // Warm elongated golden-hour dusk shadow stretching to bottom-right
    drawEllipse(ctx, 6.0, cyOffset + 4.0, rx * 1.35, ry * 1.15, 'rgba(40, 15, 5, 0.38)');
  } else if (timeOfDay === 'afternoon') {
    // Angled crisp shadow
    drawEllipse(ctx, 3.5, cyOffset + 2.0, rx * 1.1, ry, 'rgba(0, 0, 0, 0.35)');
  } else {
    // Standard midday sunlight shadow
    drawEllipse(ctx, 0, cyOffset, rx, ry, 'rgba(0, 0, 0, 0.36)');
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
   * Draw Striker Batsman in Clean Vector-Arcade Style (matching User Reference Screenshot):
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
    skinTone = '#f5d0b0',
    timeOfDay = 'day'
  } = {}) {
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

    // 1. Dynamic Ground Shadow (adapts to stadium lighting: night floodlights, sunset, day)
    drawLightingShadow(ctx, timeOfDay, 11, 4.5, 11);

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
        // Straight Drive / Loft
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
    hasBall = false,
    timeOfDay = 'day'
  } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_sa');
    const topColor = resolvedKit.color;
    const secColor = resolvedKit.secondaryColor || '#ffffff';
    const pantsCol = resolvedKit.pantsColor || topColor;
    const stripeCol = resolvedKit.stripeColor || secColor || '#ffffff';

    // 1. Dynamic Ground Shadow
    drawLightingShadow(ctx, timeOfDay, 12, 5, 12);

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
  drawWicketKeeper(ctx, x, y, { skinTone = '#f5d0b0', isStumping = false, jerseyColor = '#0066b2', kit = null, timeOfDay = 'day' } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_sa');
    const topColor = resolvedKit.color;
    const secColor = resolvedKit.secondaryColor || '#ffffff';
    const stripeCol = resolvedKit.stripeColor || secColor || '#ffffff';

    // Ground Shadow
    drawLightingShadow(ctx, timeOfDay, 13, 5, 12);

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
    isLeftHanded = false,
    timeOfDay = 'day'
  } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_ind');
    const topColor = resolvedKit.color;
    const secColor = resolvedKit.secondaryColor || '#ffffff';
    const stripeCol = resolvedKit.stripeColor || secColor || '#ffffff';

    // Mirror stance according to handedness and pitch side (so LHB holds bat with left hand)
    const isLeftSide = pitchCenterX !== null ? (x < pitchCenterX) : false;
    const shouldMirror = isLeftHanded ? !isLeftSide : isLeftSide;
    if (shouldMirror) {
      ctx.scale(-1, 1);
    }

    // 1. Ground Shadow (Clean soft shadow under feet)
    drawLightingShadow(ctx, timeOfDay, 12, 4.5, 13);

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
    skinTone = '#f5d0b0',
    timeOfDay = 'day'
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
    drawLightingShadow(ctx, timeOfDay, 12, 5, 12);

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
   * Draw Fielder in Clean Vector-Arcade style (alert posture, diving slide, or leaping catch)
   * Full support for team-specific jersey color, pants color, and outer racing stripes.
   */
  drawFielder(ctx, x, y, role, jerseyColor = '#ef4444', isDiving = false, isCatching = false, vx = 0, vy = 0, isFielding = false, kit = null, timeOfDay = 'day') {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_sa');
    const topColor = resolvedKit.color;
    const secColor = resolvedKit.secondaryColor || '#ffffff';
    const pantsCol = resolvedKit.pantsColor || topColor;
    const stripeCol = resolvedKit.stripeColor || secColor || '#ffffff';

    if (isCatching) {
      // Leaping Catch in Air
      drawLightingShadow(ctx, timeOfDay, 12, 4, 16);
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
      drawRoundRect(ctx, -3, -19, 3.2, 3.2, 1, '#ffffff', '#090e17', 1.0);
      drawRoundRect(ctx, 1, -19, 3.2, 3.2, 1, '#ffffff', '#090e17', 1.0);
      // Ball in palms!
      drawEllipse(ctx, 0, -19, 2.8, 2.8, '#dc2626', '#090e17', 1.0);
    } else if (isDiving) {
      // Full Horizontal Diving Slide on Turf (matching live cricket diving stops!)
      const diveAngle = Math.atan2(vy || 0, vx || 1);
      ctx.rotate(diveAngle);
      // Elongated turf shadow
      drawLightingShadow(ctx, timeOfDay, 18, 5, 4);

      // Trailing legs in pants color
      drawRoundRect(ctx, -11, 1, 9, 4.8, 1.8, pantsCol, '#090e17', 1.2);
      // Horizontal torso in team jersey
      drawRoundRect(ctx, -5.5, -4, 15, 8.5, 2.8, topColor, '#090e17', 1.4);
      // Outstretched arms scooping the ball
      ctx.strokeStyle = '#c68656';
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(7, -1); ctx.lineTo(16, -2);
      ctx.moveTo(7, 2); ctx.lineTo(16, 1);
      ctx.stroke();
      // White fielding hands
      drawRoundRect(ctx, 16, -4, 4, 3.5, 1, '#ffffff', '#090e17', 1.0);
      // Head looking forward along turf
      drawEllipse(ctx, -9, -6.5, 4.8, 4.5, '#090e17');
    } else {
      // Alert Ready Stance or Athletic Chase Sprint
      const isRunning = Math.hypot(vx, vy) > 0.4 || isFielding;
      const stride = isRunning ? Math.sin(Date.now() * 0.016) * 4.5 : 0;
      const armSwing = isRunning ? Math.sin(Date.now() * 0.016) * 5.0 : 0;

      // Ground Shadow
      drawLightingShadow(ctx, timeOfDay, isRunning ? 14 : 12, 4.8, 12);

      // Legs in team pants with outer racing stripes
      drawRoundRect(ctx, -6.0, 2 - stride, 5.0, 10.5, 2.2, pantsCol, '#090e17', 1.3);
      drawRoundRect(ctx, 1.2, 2 + stride, 5.0, 10.5, 2.2, pantsCol, '#090e17', 1.3);
      // Outer stripe down leg
      ctx.strokeStyle = stripeCol;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-5.5, 3 - stride); ctx.lineTo(-5.5, 11 - stride);
      ctx.moveTo(5.5, 3 + stride); ctx.lineTo(5.5, 11 + stride);
      ctx.stroke();
      // Shoes
      drawRoundRect(ctx, -6.0, 11.5 - stride, 5.0, 2.8, 1, '#090e17');
      drawRoundRect(ctx, 1.2, 11.5 + stride, 5.0, 2.8, 1, '#090e17');

      // Team Jersey Torso
      drawRoundRect(ctx, -7.5, -8, 15, 11, 3.2, topColor, '#090e17', 1.4);
      // Contrast side panels
      drawRoundRect(ctx, 5.2, -7, 1.6, 9, 0.6, secColor);
      drawRoundRect(ctx, -6.8, -7, 1.6, 9, 0.6, secColor);

      // Arms in athletic stance or pumping
      ctx.strokeStyle = topColor;
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-6, -4); ctx.lineTo(-9, isRunning ? (1 + armSwing) : 1);
      ctx.moveTo(6, -4); ctx.lineTo(9, isRunning ? (1 - armSwing) : 1);
      ctx.stroke();
      // Hands
      drawRoundRect(ctx, -10.5, isRunning ? (1 + armSwing - 1.5) : -0.5, 3.2, 3.2, 1, '#ffffff', '#090e17', 0.8);
      drawRoundRect(ctx, 7.5, isRunning ? (1 - armSwing - 1.5) : -0.5, 3.2, 3.2, 1, '#ffffff', '#090e17', 0.8);

      // Head & Team Cap / Hair
      drawEllipse(ctx, 0, -14, 5.2, 4.8, '#c68656', '#090e17', 1.3);
      drawEllipse(ctx, 0, -16, 5.8, 4.0, '#111827', '#090e17', 1.2);
    }

    ctx.restore();
  },

  /**
   * Regulation 30-Yard Inner Circle with Painted Marker Discs on Outfield Turf
   */
  draw30YardCircle(ctx, cx, cy, rx = 270, ry = 310) {
    if (!ctx) return;
    const safeRx = Math.max(100, Math.min(600, rx));
    const safeRy = Math.max(120, Math.min(650, ry));

    ctx.save();
    // 1. Subtle grass tint differential inside inner circle
    drawEllipse(ctx, cx, cy, safeRx, safeRy, 'rgba(255, 255, 255, 0.035)');

    // 2. Regulation white field marker discs spaced every 18 degrees around the ellipse
    const numDiscs = 20;
    for (let i = 0; i < numDiscs; i++) {
      const theta = (i / numDiscs) * Math.PI * 2;
      const dx = cx + Math.cos(theta) * safeRx;
      const dy = cy + Math.sin(theta) * safeRy;

      // Soft disc drop shadow on grass turf
      drawEllipse(ctx, dx, dy + 1, 3.2, 2.2, 'rgba(0, 0, 0, 0.45)');
      // Regulation white disc with crisp boundary edge
      drawEllipse(ctx, dx, dy, 3.0, 2.2, '#ffffff', '#0f172a', 1.0);
    }
    ctx.restore();
  },

  /**
   * Draw Realistic Multi-Tier Stadium Crowd Stands, Advertising Boundary,
   * Cheering Spectators & Halogen Floodlights tailored to each of the 12 Iconic Venues
   */
  drawStadiumCrowdStands(ctx, cx, cy, boundaryRadius, width, height, crowdState = {}) {
    if (!ctx) return;
    const br = boundaryRadius || 850;
    const safeCx = Number.isFinite(cx) ? cx : (width || 400) / 2;
    const safeCy = Number.isFinite(cy) ? cy : (height || 600) * 0.52;
    const isCheering = !!crowdState.isCheering;
    const landing = crowdState.sixLanding;
    const stadium = crowdState.stadium;
    const timeOfDay = crowdState.timeOfDay || 'day';
    const weather = crowdState.weather || 'sunny';
    const isNightOrDusk = timeOfDay === 'night' || timeOfDay === 'sunset' || weather === 'floodlights';
    const now = Date.now();

    ctx.save();
    try {
      // Stadium architectural custom styling
      const seatColor1 = stadium?.seatColor || '#1e3a8a';
      const seatColor2 = stadium?.seatColorDark || '#0f2452';
      const canopyColor = stadium?.canopyColor || '#334155';
      const ledColor = stadium?.ledColor || '#00ffcc';

      // 1. Outfield Boundary Rope & Sponge Toblerone Cushions
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, br, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4.2;
      ctx.stroke();

      // Rope twisted texture markings
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, br, 0, Math.PI * 2);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. High-Density Dynamic LED Boundary Advertising Ribbon Board
      const ledInner = br + 4;
      const ledOuter = br + 18;
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, (ledInner + ledOuter) / 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#050b14';
      ctx.lineWidth = ledOuter - ledInner;
      ctx.stroke();

      // Animated LED Sponsor Segments
      const numSegments = 36;
      const dAngle = (Math.PI * 2) / numSegments;
      const sponsorBrands = ['EMIRATES', 'PEPSI', 'TATA', 'MRF TYRES', 'DREAM11', 'ARAMCO', 'HYUNDAI', 'BOOKING.COM', 'MASTERCARD', 'OAKLEY'];

      for (let i = 0; i < numSegments; i++) {
        const segAngle = i * dAngle + (now * 0.0003);
        const midR = (ledInner + ledOuter) / 2;
        const brand = sponsorBrands[i % sponsorBrands.length];

        ctx.save();
        ctx.translate(safeCx + Math.cos(segAngle) * midR, safeCy + Math.sin(segAngle) * midR);
        ctx.rotate(segAngle + Math.PI / 2);

        ctx.fillStyle = i % 2 === 0 ? ledColor : '#ff0055';
        ctx.fillRect(-22, -4.5, 44, 9);

        ctx.fillStyle = '#050b14';
        ctx.font = '900 6.5px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(brand, 0, 0);
        ctx.restore();
      }

      // Outer boundary fence
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, br + 22, 0, Math.PI * 2);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // 3. Multi-Tier Grandstand Architecture (Tiers 1, 2, 3 with Aisles & Overhangs)
      const r1_in = br + 26;
      const r1_out = br + 130;
      const r_conc1_in = br + 130;
      const r_conc1_out = br + 154;

      const r2_in = br + 154;
      const r2_out = br + 295;
      const r_conc2_in = br + 295;
      const r_conc2_out = br + 325;

      const r3_in = br + 325;
      const r3_out = br + 460;

      // TIER 1 (Lower Bowl)
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, (r1_in + r1_out) / 2, 0, Math.PI * 2);
      ctx.strokeStyle = seatColor1;
      ctx.lineWidth = r1_out - r1_in;
      ctx.stroke();

      // Concourse 1
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, (r_conc1_in + r_conc1_out) / 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = r_conc1_out - r_conc1_in;
      ctx.stroke();

      // TIER 2 Club Tier
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, (r2_in + r2_out) / 2, 0, Math.PI * 2);
      ctx.strokeStyle = seatColor2;
      ctx.lineWidth = r2_out - r2_in;
      ctx.stroke();

      // Illuminated VIP Suite Windows
      const numSuites = 20;
      for (let s = 0; s < numSuites; s++) {
        const sAngle = (s / numSuites) * Math.PI * 2;
        const suiteDist = (r2_in + r2_out) / 2 + 10;
        const sx = safeCx + Math.cos(sAngle) * suiteDist;
        const sy = safeCy + Math.sin(sAngle) * suiteDist;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(sAngle + Math.PI / 2);
        ctx.fillStyle = isNightOrDusk ? '#fef08a' : '#94a3b8';
        ctx.globalAlpha = isNightOrDusk ? 0.75 : 0.45;
        ctx.fillRect(-16, -5, 32, 10);
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = ledColor;
        ctx.lineWidth = 1.0;
        ctx.strokeRect(-16, -5, 32, 10);
        ctx.restore();
      }

      // Jumbotrons at North & South ends
      [-Math.PI / 2, Math.PI / 2].forEach(screenAngle => {
        const scrDist = (r_conc2_in + r_conc2_out) / 2;
        const scrX = safeCx + Math.cos(screenAngle) * scrDist;
        const scrY = safeCy + Math.sin(screenAngle) * scrDist;

        ctx.save();
        ctx.translate(scrX, scrY);
        ctx.rotate(screenAngle + Math.PI / 2);
        ctx.fillStyle = '#020617';
        ctx.fillRect(-28, -8, 56, 16);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(-28, -8, 56, 16);
        ctx.font = 'bold 8px "Inter", sans-serif';
        ctx.fillStyle = isCheering ? '#ef4444' : '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText(isCheering ? '⚡ SIX! ⚡' : (stadium?.shortName || 'CRICKET RUSH').toUpperCase(), 0, 3);
        ctx.restore();
      });

      // TIER 3 (Upper Grandstand / Sky Deck)
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, (r3_in + r3_out) / 2, 0, Math.PI * 2);
      ctx.strokeStyle = canopyColor;
      ctx.lineWidth = r3_out - r3_in;
      ctx.stroke();

      // Yellow Aisle Staircases
      const numAisles = 20;
      const dTheta = 0.026;
      for (let a = 0; a < numAisles; a++) {
        const aisleAngle = (a / numAisles) * Math.PI * 2;
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.3;

        ctx.beginPath();
        ctx.moveTo(safeCx + Math.cos(aisleAngle - dTheta / 2) * r1_in, safeCy + Math.sin(aisleAngle - dTheta / 2) * r1_in);
        ctx.lineTo(safeCx + Math.cos(aisleAngle - dTheta / 2) * (r1_out - 2), safeCy + Math.sin(aisleAngle - dTheta / 2) * (r1_out - 2));
        ctx.moveTo(safeCx + Math.cos(aisleAngle + dTheta / 2) * r1_in, safeCy + Math.sin(aisleAngle + dTheta / 2) * r1_in);
        ctx.lineTo(safeCx + Math.cos(aisleAngle + dTheta / 2) * (r1_out - 2), safeCy + Math.sin(aisleAngle + dTheta / 2) * (r1_out - 2));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(safeCx + Math.cos(aisleAngle - dTheta / 2) * (r2_in + 2), safeCy + Math.sin(aisleAngle - dTheta / 2) * (r2_in + 2));
        ctx.lineTo(safeCx + Math.cos(aisleAngle - dTheta / 2) * (r2_out - 2), safeCy + Math.sin(aisleAngle - dTheta / 2) * (r2_out - 2));
        ctx.moveTo(safeCx + Math.cos(aisleAngle + dTheta / 2) * (r2_in + 2), safeCy + Math.sin(aisleAngle + dTheta / 2) * (r2_in + 2));
        ctx.lineTo(safeCx + Math.cos(aisleAngle + dTheta / 2) * (r2_out - 2), safeCy + Math.sin(aisleAngle + dTheta / 2) * (r2_out - 2));
        ctx.stroke();
      }

      // Spectators in the stands
      const fanJerseys = ['#1d4ed8', '#facc15', '#dc2626', '#16a34a', '#ea580c', '#38bdf8', '#ffffff', '#9333ea', '#059669', '#f97316'];
      const skinTones = ['#fcd34d', '#d97706', '#b45309', '#fbcfe8', '#fef08a'];
      const tier1Rows = [br + 46, br + 74, br + 102];
      const tier2Rows = [br + 186, br + 232];

      const drawCrowd = (rows, benchColor) => {
        rows.forEach((rowDist, rIdx) => {
          ctx.beginPath();
          ctx.arc(safeCx, safeCy, rowDist, 0, Math.PI * 2);
          ctx.strokeStyle = benchColor;
          ctx.lineWidth = 15;
          ctx.stroke();

          const circumference = Math.PI * 2 * rowDist;
          const spectatorCount = Math.floor(circumference / 46);
          const angleStep = (Math.PI * 2) / spectatorCount;

          for (let i = 0; i < spectatorCount; i++) {
            const angle = i * angleStep;
            const aisleCheck = ((angle + Math.PI * 2) % ((Math.PI * 2) / numAisles));
            if (aisleCheck < 0.05 || aisleCheck > ((Math.PI * 2) / numAisles) - 0.05) continue;

            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            const sx = safeCx + cosA * rowDist;
            const sy = safeCy + sinA * rowDist;

            const hash = (i * 41 + rIdx * 113) % 1000;
            const jerseyCol = fanJerseys[hash % fanJerseys.length];
            const skin = skinTones[(hash >> 2) % skinTones.length];
            const cheerBob = isCheering ? Math.sin(now * 0.012 + i * 0.45) * 2.8 : 0;

            ctx.fillStyle = jerseyCol;
            ctx.beginPath();
            ctx.arc(sx, sy + cheerBob, 4.0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = skin;
            ctx.beginPath();
            ctx.arc(sx - cosA * 2.4, sy - sinA * 2.4 + cheerBob, 2.3, 0, Math.PI * 2);
            ctx.fill();

            // Flashbulbs in night games
            if (isNightOrDusk && (hash + Math.floor(now / 150)) % 25 === 0) {
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(sx, sy - 2.5, 2.8, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
      };

      drawCrowd(tier1Rows, shadeColor(seatColor1, -15));
      drawCrowd(tier2Rows, shadeColor(seatColor2, -15));

      // Modern Cantilever Stadium Canopy Roof (Tier 3 Overhang)
      const r_roof_in = br + 372;
      const r_roof_out = br + 452;

      ctx.beginPath();
      ctx.arc(safeCx, safeCy, (r_roof_in + r_roof_out) / 2, 0, Math.PI * 2);
      ctx.strokeStyle = canopyColor;
      ctx.lineWidth = r_roof_out - r_roof_in;
      ctx.stroke();

      // Canopy Inner Fascia Ring with Neon Edge
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, r_roof_in, 0, Math.PI * 2);
      ctx.strokeStyle = ledColor;
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // Cantilever Structural Steel Trusses radiating outwards
      const numTrusses = 24;
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.2;
      for (let t = 0; t < numTrusses; t++) {
        const tAngle = (t / numTrusses) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(safeCx + Math.cos(tAngle) * r_roof_in, safeCy + Math.sin(tAngle) * r_roof_in);
        ctx.lineTo(safeCx + Math.cos(tAngle) * (r_roof_out + 6), safeCy + Math.sin(tAngle) * (r_roof_out + 6));
        ctx.stroke();
      }

      // Outer Stadium Perimeter Ring
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, r_roof_out + 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // 6 Giant World-Class Stadium Floodlight Towers
      const floodlightAngles = [
        Math.PI * 0.16,
        Math.PI * 0.50,
        Math.PI * 0.84,
        Math.PI * 1.16,
        Math.PI * 1.50,
        Math.PI * 1.84
      ];

      floodlightAngles.forEach(fAngle => {
        const flDist = br + 474;
        const flX = safeCx + Math.cos(fAngle) * flDist;
        const flY = safeCy + Math.sin(fAngle) * flDist;

        // Floodlight Gantry Housing
        drawRoundRect(ctx, flX - 18, flY - 14, 36, 28, 5, '#0f172a', '#64748b', 2.0);

        // Halogen Matrix (4x3 Bright Halogen Lights)
        const isLit = isNightOrDusk || weather === 'floodlights';
        ctx.fillStyle = isLit ? '#fef08a' : '#64748b';
        for (let lx = -12; lx <= 12; lx += 8) {
          for (let ly = -8; ly <= 8; ly += 8) {
            ctx.beginPath();
            ctx.arc(flX + lx, flY + ly, 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Halogen Beam Ambient Glow when turned on
        if (isLit) {
          const flGlow = ctx.createRadialGradient(flX, flY, 12, flX, flY, 80);
          flGlow.addColorStop(0, 'rgba(254, 240, 138, 0.40)');
          flGlow.addColorStop(0.5, 'rgba(254, 240, 138, 0.12)');
          flGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
          ctx.fillStyle = flGlow;
          ctx.beginPath();
          ctx.arc(flX, flY, 80, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Ball Landing Impact Shockwave in the Stands
      if (landing && landing.active && Number.isFinite(landing.x) && Number.isFinite(landing.y)) {
        const lx = landing.x;
        const ly = landing.y;
        ctx.beginPath();
        ctx.arc(lx, ly, 28 + Math.sin(now * 0.015) * 10, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.95)';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.font = '900 13px "Inter", sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.textAlign = 'center';
        ctx.fillText('🚀 CROWD CATCH IN THE STANDS!', lx, ly - 28);
      }

      ctx.restore();
    } catch {
      ctx.restore();
    }
  }
};
