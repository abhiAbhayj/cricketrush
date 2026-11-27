// ============================================================================
// CRICKET RUSH - Authentic 3D Pixel Art Character & Dynamic Stadium Engine
// True Voxel/Pixel-Art Aesthetic with Isometric 3D Shading, Dynamic Lighting,
// Multi-Tier Architecture, Diverse Pitch Profiles, and Weather / Time-of-Day Atmosphere
// ============================================================================

/**
 * Universal color shading helper for 3D pixel voxel faces (lighten top face, darken side face)
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
 * Helper to resolve kit safely from either a kit object or a color string
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
 * Core 3D Pixel Voxel Block Renderer
 * Renders an isometric/pseudo-3D voxel block with 3 distinct lighting faces:
 * - Front face: base color with crisp pixel texture
 * - Top face: lightened face (+22% brightness) for overhead stadium/sunlight
 * - Side face: darkened face (-26% brightness) for authentic 3D blocky volume
 * - Pixel outline: crisp dark border (#070b12) for that iconic retro-modern arcade aesthetic
 */
export function drawVoxel(ctx, x, y, w, h, depth = 2.5, color = '#ffffff', options = {}) {
  if (!ctx || w <= 0 || h <= 0) return;
  const {
    topColor = null,
    sideColor = null,
    outlineColor = '#070b12',
    side = 'right', // 'right' or 'left' side extrusion
    showGrid = false
  } = options;

  const rx = Math.round(x);
  const ry = Math.round(y);
  const rw = Math.round(w);
  const rh = Math.round(h);
  const d = Math.max(1, Math.round(depth));

  const baseCol = color || '#ffffff';
  const topCol = topColor || shadeColor(baseCol, 24);
  const sideCol = sideColor || shadeColor(baseCol, -28);

  ctx.save();

  // 1. Top Isometric Voxel Face (Lightened highlight face)
  ctx.fillStyle = topCol;
  ctx.beginPath();
  if (side === 'right') {
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx + d, ry - d);
    ctx.lineTo(rx + rw + d, ry - d);
    ctx.lineTo(rx + rw, ry);
  } else {
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - d, ry - d);
    ctx.lineTo(rx + rw - d, ry - d);
    ctx.lineTo(rx + rw, ry);
  }
  ctx.closePath();
  ctx.fill();
  if (outlineColor) {
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // 2. Side Isometric Voxel Face (Darkened shadow face for 3D depth)
  ctx.fillStyle = sideCol;
  ctx.beginPath();
  if (side === 'right') {
    ctx.moveTo(rx + rw, ry);
    ctx.lineTo(rx + rw + d, ry - d);
    ctx.lineTo(rx + rw + d, ry + rh - d);
    ctx.lineTo(rx + rw, ry + rh);
  } else {
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - d, ry - d);
    ctx.lineTo(rx - d, ry + rh - d);
    ctx.lineTo(rx, ry + rh);
  }
  ctx.closePath();
  ctx.fill();
  if (outlineColor) {
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // 3. Front Voxel Face (Base color with pixel border)
  ctx.fillStyle = baseCol;
  ctx.fillRect(rx, ry, rw, rh);

  // Crisp retro pixel border
  if (outlineColor) {
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 1.0;
    ctx.strokeRect(rx, ry, rw, rh);
  }

  // Subtle interior pixel-grid highlight texture
  if (showGrid && rw >= 4 && rh >= 4) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.fillRect(rx + 1, ry + 1, rw - 2, 1);
  }

  ctx.restore();
}

/**
 * Draw a crisp pixel-art rectangle with optional pixel bevel
 */
function drawPixelRect(ctx, x, y, w, h, fill, stroke = null, lineWidth = 1) {
  if (!ctx || w <= 0 || h <= 0) return;
  const rx = Math.round(x);
  const ry = Math.round(y);
  const rw = Math.round(w);
  const rh = Math.round(h);
  ctx.save();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(rx, ry, rw, rh);
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(rx, ry, rw, rh);
  }
  ctx.restore();
}

/**
 * 3D Pixel Art Dynamic Ground Shadow
 * Automatically responds to Time-of-Day / Weather:
 * - Night: 4 distinct pixelated quad-shadows radiating outward under stadium floodlights
 * - Sunset: elongated warm amber-shaded pixel shadow
 * - Afternoon: angled soft shadow
 * - Day: crisp directional pixel shadow
 */
export function drawPixelShadow(ctx, x, y, rx, ry, alpha = 0.35, timeOfDay = 'day') {
  if (!ctx) return;
  const cx = Math.round(x);
  const cy = Math.round(y);
  const w = Math.round(rx);
  const h = Math.round(ry);

  ctx.save();

  if (timeOfDay === 'night') {
    // 4-point floodlight shadows cast outward from 4 stadium corners
    const floodlightOffsets = [
      { dx: -w * 0.45, dy: -h * 0.35 },
      { dx: w * 0.45, dy: -h * 0.35 },
      { dx: -w * 0.45, dy: h * 0.45 },
      { dx: w * 0.45, dy: h * 0.45 }
    ];
    ctx.fillStyle = `rgba(3, 7, 18, ${alpha * 0.45})`;
    floodlightOffsets.forEach(({ dx, dy }) => {
      ctx.fillRect(cx + dx - w * 0.5, cy + dy - h * 0.3, w, h * 0.7);
    });
    // Core center shadow
    ctx.fillStyle = `rgba(3, 7, 18, ${alpha * 0.75})`;
    ctx.fillRect(cx - w * 0.55, cy - h * 0.4, w * 1.1, h * 0.8);
  } else if (timeOfDay === 'sunset') {
    // Elongated golden-hour shadow stretched towards east
    ctx.fillStyle = `rgba(26, 12, 4, ${alpha * 0.85})`;
    ctx.fillRect(cx - w * 0.4, cy - h * 0.3, w * 1.8, h * 0.7);
    ctx.fillRect(cx + w * 0.6, cy - h * 0.2, w * 0.8, h * 0.5);
  } else if (timeOfDay === 'afternoon') {
    // Angled afternoon sun shadow
    ctx.fillStyle = `rgba(5, 12, 22, ${alpha})`;
    ctx.fillRect(cx - w * 0.4 + 3, cy - h * 0.3 + 4, w * 1.2, h * 0.8);
  } else {
    // Crisp clean daytime pixel shadow
    ctx.fillStyle = `rgba(5, 12, 22, ${alpha})`;
    // Stepped pixelated oval
    ctx.fillRect(cx - w * 0.6, cy - h * 0.35, w * 1.2, h * 0.7);
    ctx.fillRect(cx - w * 0.45, cy - h * 0.55, w * 0.9, h * 1.1);
  }

  ctx.restore();
}

/**
 * 3D Pixel Art Batting Pad (Leg Guard) with 3D knee-roll voxel, cane shin blocks, and spiked shoes
 */
function drawPixelBattingPad(ctx, x, y, isFrontFoot = false, strapColor = '#0a0e17') {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));

  // 1. Upper Knee Roll (3D Voxel with embossed horizontal pixel ridge)
  drawVoxel(ctx, -1, 0, 7, 3, 2, '#ffffff', '#ffffff', '#cbd5e1', '#070b12');
  drawPixelRect(ctx, 0, 1, 5, 1, '#f1f5f9');

  // 2. Shin Guard Section (White vertical 3D pixel cane blocks)
  drawVoxel(ctx, 0, 3, 6, 8, 2, '#ffffff', '#ffffff', '#cbd5e1', '#070b12');
  // Vertical cane spine pixel line
  drawPixelRect(ctx, 2.5, 3.5, 1, 7, '#94a3b8');

  // 3. Colored Team Accent Pad Straps (Horizontal pixel bands)
  drawPixelRect(ctx, 0.5, 5, 5, 1, strapColor);
  drawPixelRect(ctx, 0.5, 8, 5, 1, strapColor);

  // 4. 3D Spiked Cricket Shoe Block with Team Color Trim & White Studded Sole
  drawVoxel(ctx, -0.5, 11, 7, 3, 2, '#0f2942', '#1e40af', '#0a192f', '#070b12');
  drawPixelRect(ctx, -0.5, 13, 7, 1.2, '#ffffff');

  ctx.restore();
}

export const CharacterRenderer = {
  // Helper exposure for external modules
  drawVoxel,
  shadeColor,
  drawPixelShadow,

  /**
   * 3D PIXEL ART STRIKER BATSMAN
   * Authentic 3D Voxel Batsman matching classic arcade voxel soul:
   * - 3D pixel helmet with visor brim, metallic grille bars, and expressive pixel eyes
   * - 3D voxel jersey torso with team collar and side flank panels
   * - 3D pixel batting leg pads with knee rolls, cane spines, and spiked shoes
   * - 3D wooden willow cricket bat with rubber wrapped grip handle & sponsor sticker
   * - Perfectly mirrored for Left-Handed Batsmen (LHB points down-left at ~43°) vs RHB (points down-right at ~43°)
   * - Smoothly rotates through dynamic 3D swing arcs for Cover Drive, Pull, Loft, Flick, Scoop, etc.
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

    // Left-handed batsman mirrors the 3D voxel stance naturally
    // RHB points down-right (~43°); LHB points down-left (~43°)!
    if (isLeftHanded) {
      ctx.scale(-1, 1);
    }

    // 1. 3D Pixel Ground Shadow
    drawPixelShadow(ctx, 0, 11, 13, 5, 0.40, timeOfDay);

    // 2. Batting Leg Pads & Spikes (3D Pixel Voxel Stance)
    let backPadX = -3.2;
    let frontPadX = 1.2;
    let backPadY = 1.0;
    let frontPadY = 2.8;

    if (isSteppingOut) {
      frontPadY = -4.5;
      backPadY = 5.0;
      frontPadX = 2.0;
      backPadX = -2.5;
    } else if (shotStyle === 'pull') {
      frontPadX = 0.5;
      backPadX = -3.8;
    } else if (!isSwinging) {
      frontPadY += triggerTap * 0.25;
    }

    // Back 3D Pixel Pad
    drawPixelBattingPad(ctx, backPadX, backPadY, false, stripeCol);
    // Front 3D Pixel Pad (stepped forward slightly)
    drawPixelBattingPad(ctx, frontPadX, frontPadY, true, stripeCol);

    // 3. 3D Pixel Torso in Team Jersey (Sculpted Voxel Chest & Shoulders)
    ctx.save();
    let bodyRotation = isSwinging ? 0 : -0.15;
    if (isSwinging) {
      if (shotStyle === 'pull') bodyRotation = 0.45;
      else if (shotStyle === 'cover_drive') bodyRotation = -0.35;
      else if (shotStyle === 'square_cut') bodyRotation = -0.40;
      else if (shotStyle === 'sweep') bodyRotation = 0.50;
    }
    ctx.rotate(bodyRotation);

    // Main Torso Voxel Block (Width 11, Height 11, Depth 2.5)
    drawVoxel(ctx, -5.5, -6.5, 11, 11, 2.5, topColor, shadeColor(topColor, 22), shadeColor(topColor, -26), '#070b12', { showGrid: true });

    // Team Contrast Trim (Side Flank Voxels & V-neck Collar)
    drawPixelRect(ctx, 3.5, -5.5, 1.8, 9, secColor);
    drawPixelRect(ctx, -5.0, -5.5, 1.8, 9, secColor);
    drawPixelRect(ctx, -1.5, -6.5, 3, 2, secColor); // V-neck collar pixel

    // Team Chest Emblem / Badge Voxel (e.g. golden/white crest)
    drawPixelRect(ctx, 0.5, -3.5, 2.5, 2.5, '#facc15', '#070b12', 0.8);
    ctx.restore();

    // 4. 3D Pixel Helmet & Player Face
    ctx.save();
    const headY = -13.5;
    // 3D Neck Voxel Block
    drawVoxel(ctx, -1.8, headY + 6.0, 3.6, 2.5, 1.5, skinTone, shadeColor(skinTone, 15), shadeColor(skinTone, -20), '#070b12');

    // 3D Helmet Cubic Dome Voxel (Width 8.5, Height 7.5, Depth 3)
    drawVoxel(ctx, -4.2, headY - 1.5, 8.5, 7.5, 3.0, '#ffffff', '#ffffff', '#cbd5e1', '#070b12');

    // Helmet Gloss Top Specular Line
    drawPixelRect(ctx, -2.5, headY - 3.5, 5, 1, 'rgba(255, 255, 255, 0.9)');

    // Dark Visor Brim Peak Block
    drawPixelRect(ctx, -4.2, headY + 3.8, 8.5, 2.0, '#0f172a', '#070b12', 0.8);

    // Face Opening Slit (Skin tone with 3D pixel eyes)
    drawPixelRect(ctx, -2.2, headY + 3.2, 4.4, 2.0, skinTone);
    // Expressive 3D Pixel Eyes
    drawPixelRect(ctx, -1.2, headY + 3.6, 1.2, 1.2, '#070b12');
    drawPixelRect(ctx, 0.6, headY + 3.6, 1.2, 1.2, '#070b12');

    // Metallic Silver Visor Grille Bars
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(-2.5, headY + 4.8); ctx.lineTo(2.5, headY + 4.8);
    ctx.moveTo(-1.0, headY + 4.0); ctx.lineTo(-1.0, headY + 5.5);
    ctx.moveTo(1.0, headY + 4.0); ctx.lineTo(1.0, headY + 5.5);
    ctx.stroke();
    ctx.restore();

    // 5. 3D Pixel Arms, White Batting Gloves & Wooden Willow Cricket Bat
    ctx.save();
    let batAngle = 0.75; // ~43° default side-on stance backlift
    let batGripX = 4.2;
    let batGripY = -2.5;

    if (isSwinging) {
      if (shotStyle === 'cover_drive') {
        batAngle = -0.65 + swingProgress * 1.55;
        batGripX = 2.0 + swingProgress * 3.0;
        batGripY = -1.0 + swingProgress * 3.5;
      } else if (shotStyle === 'pull') {
        batAngle = -2.35 + swingProgress * 2.85;
        batGripX = -1.0 + swingProgress * 4.0;
        batGripY = -3.0 + swingProgress * 2.0;
      } else if (shotStyle === 'straight_drive') {
        batAngle = -0.30 + swingProgress * 1.70;
        batGripX = 1.0 + swingProgress * 3.0;
        batGripY = -1.5 + swingProgress * 4.0;
      } else if (shotStyle === 'upper_cut') {
        batAngle = -1.55 + swingProgress * 2.05;
        batGripX = 3.0 + swingProgress * 2.0;
        batGripY = -4.0 + swingProgress * 3.0;
      } else if (shotStyle === 'flick') {
        batAngle = 0.15 + swingProgress * 1.65;
        batGripX = 2.0 + swingProgress * 2.5;
        batGripY = -1.0 + swingProgress * 3.0;
      } else if (shotStyle === 'reverse_sweep') {
        batAngle = -2.60 + swingProgress * 2.50;
        batGripX = -2.0 + swingProgress * 3.0;
        batGripY = -2.0 + swingProgress * 3.0;
      } else if (shotStyle === 'scoop') {
        batAngle = -2.85 + swingProgress * 2.15;
        batGripX = 1.0;
        batGripY = -3.0 - swingProgress * 4.0;
      } else {
        batAngle = -0.50 + swingProgress * 1.80;
        batGripX = 2.0 + swingProgress * 3.0;
        batGripY = -1.5 + swingProgress * 3.5;
      }
    } else {
      // Dynamic idle backlift breathing
      batAngle += Math.sin(Date.now() * 0.005) * 0.04;
    }

    ctx.translate(batGripX, batGripY);
    ctx.rotate(batAngle);

    // 3D Pixel Arms & White Batting Gloves (holding the bat handle)
    // Left glove (top hand)
    drawVoxel(ctx, -2.5, -2.0, 3.8, 3.2, 1.5, '#ffffff', '#ffffff', '#cbd5e1', '#070b12');
    drawPixelRect(ctx, -1.8, -1.5, 2.4, 1.2, topColor); // Glove finger-ridge color accent

    // Right glove (bottom hand)
    drawVoxel(ctx, -2.5, 2.0, 3.8, 3.2, 1.5, '#ffffff', '#ffffff', '#cbd5e1', '#070b12');
    drawPixelRect(ctx, -1.8, 2.5, 2.4, 1.2, topColor);

    // 3D Pixel Wooden Cricket Bat:
    // A. Rubber Wrapped Grip Handle (Pixel striped bands)
    drawPixelRect(ctx, -1.2, -5.5, 2.4, 6.0, '#ffffff', '#070b12', 0.8);
    drawPixelRect(ctx, -1.2, -4.5, 2.4, 1.2, '#ef4444');
    drawPixelRect(ctx, -1.2, -2.5, 2.4, 1.2, '#ef4444');

    // B. Cane Shoulders Voxel Taper
    drawVoxel(ctx, -2.2, 0.5, 4.4, 2.5, 2.0, '#cca052', '#fef3c7', '#92400e', '#070b12');

    // C. 3D Wooden Willow Blade (Width 5.5, Height 17.5, Depth 2.5)
    // Wood Face: light honey grain (#fef3c7) | Wood Side: deep golden grain (#92400e)
    const batWoodFront = batSkin === 'carbon' ? '#1e293b' : batSkin === 'gold' ? '#facc15' : '#fef3c7';
    const batWoodTop = batSkin === 'carbon' ? '#334155' : batSkin === 'gold' ? '#fef08a' : '#ffffff';
    const batWoodSide = batSkin === 'carbon' ? '#0f172a' : batSkin === 'gold' ? '#ca8a04' : '#92400e';

    drawVoxel(ctx, -2.7, 3.0, 5.5, 17.5, 2.5, batWoodFront, batWoodTop, batWoodSide, '#070b12', { showGrid: true });

    // D. Authentic Maker's Pixel Sticker Badge (e.g. Kookaburra / MRF / SS style sticker)
    drawPixelRect(ctx, -2.0, 4.5, 4.0, 4.5, '#dc2626', '#070b12', 0.6);
    drawPixelRect(ctx, -1.2, 5.5, 2.4, 2.0, '#facc15');

    // E. Bat Willow Grain Center Spine Line
    drawPixelRect(ctx, -0.4, 9.5, 0.8, 9.0, '#d97706');

    ctx.restore();
    ctx.restore();
  },

  /**
   * 3D PIXEL ART BOWLER
   * Authentic 3D Voxel Bowler with High-Arm Windmill Action:
   * - 3D pixel athletic legs with team-colored trousers, side racing stripe voxels, and running shoes
   * - High-knee 3D running stride animation during run-up
   * - 3D pixel jersey torso with V-neck collar & side accent panels
   * - 3D pixel head with afro hairstyle & signature red temple bead (or turban / beard / headband)
   * - 3D pixel windmill bowling arm carrying a red 3D pixel cricket ball with white seam pixels
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
  }) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_sa');
    const topColor = resolvedKit.color;
    const secColor = resolvedKit.secondaryColor || '#ffffff';
    const pantsCol = resolvedKit.pantsColor || topColor;
    const stripeCol = resolvedKit.stripeColor || secColor || '#ffffff';

    // 1. Dynamic 3D Pixel Ground Shadow
    drawPixelShadow(ctx, 0, 12, 14, 5.5, 0.40, timeOfDay);

    // 2. Athletic Stride & Team Trousers with 3D Side Racing Stripes
    const isRunning = runUpProgress > 0 && runUpProgress < 1.0;
    const stride = isRunning ? Math.sin(runUpProgress * Math.PI * 8) * 5.0 : (isFielding ? Math.sin(Date.now() * 0.015) * 5.0 : 0);
    const isFollowingThrough = followThroughProgress > 0;
    const leanY = isFollowingThrough ? followThroughProgress * 3 : (isFielding ? 2 : 0);

    // Left 3D Voxel Leg
    ctx.save();
    const leftLegY = 2 - stride + leanY;
    drawVoxel(ctx, -6.5, leftLegY, 5.5, 11, 2, pantsCol, shadeColor(pantsCol, 22), shadeColor(pantsCol, -26), '#070b12');
    // Outer racing stripe down leg seam
    drawPixelRect(ctx, -5.8, leftLegY + 1, 1.4, 9, stripeCol);
    // 3D Athletic shoe with white studded sole
    drawVoxel(ctx, -7.0, leftLegY + 10, 6.5, 3.2, 1.5, '#0f172a', '#1e293b', '#020617', '#070b12');
    drawPixelRect(ctx, -7.0, leftLegY + 12, 6.5, 1.2, '#ffffff');
    ctx.restore();

    // Right 3D Voxel Leg
    ctx.save();
    const rightLegY = 2 + stride + leanY * 0.5;
    drawVoxel(ctx, 1.2, rightLegY, 5.5, 11, 2, pantsCol, shadeColor(pantsCol, 22), shadeColor(pantsCol, -26), '#070b12');
    // Outer racing stripe down leg seam
    drawPixelRect(ctx, 6.0, rightLegY + 1, 1.4, 9, stripeCol);
    // 3D Athletic shoe with white studded sole
    drawVoxel(ctx, 0.8, rightLegY + 10, 6.5, 3.2, 1.5, '#0f172a', '#1e293b', '#020617', '#070b12');
    drawPixelRect(ctx, 0.8, rightLegY + 12, 6.5, 1.2, '#ffffff');
    ctx.restore();

    // 3. 3D Voxel Team Jersey Torso
    ctx.save();
    const torsoY = -8 + leanY;
    drawVoxel(ctx, -7.5, torsoY, 15, 12, 3, topColor, shadeColor(topColor, 22), shadeColor(topColor, -26), '#070b12', { showGrid: true });

    // Team secondary contrast accents on flanks
    drawPixelRect(ctx, 5.2, torsoY + 1, 1.8, 10, secColor);
    drawPixelRect(ctx, -7.0, torsoY + 1, 1.8, 10, secColor);

    // Team V-neck collar pixel trim
    drawPixelRect(ctx, -2.5, torsoY, 5, 2.5, secColor);
    ctx.restore();

    // 4. Head, Focused Face & 3D Pixel Hairstyle
    ctx.save();
    const headY = -16 + leanY;
    // 3D Neck Voxel
    drawVoxel(ctx, -2.2, headY + 6.5, 4.4, 3.2, 1.5, skinTone, shadeColor(skinTone, 15), shadeColor(skinTone, -20), '#070b12');

    // 3D Pixel Head Voxel
    drawVoxel(ctx, -4.5, headY, 9, 8, 2.5, skinTone, shadeColor(skinTone, 15), shadeColor(skinTone, -20), '#070b12');

    // Focused 3D Pixel Eyes
    drawPixelRect(ctx, -2.5, headY + 3.0, 1.5, 1.5, '#070b12');
    drawPixelRect(ctx, 1.0, headY + 3.0, 1.5, 1.5, '#070b12');

    // Authentic Hairstyle Options in 3D Pixel Art:
    if (faceStyle === 'afro') {
      // 3D Afro Puff Voxels
      drawVoxel(ctx, -5.5, headY - 4.5, 11, 5.5, 3.0, '#1c1917', '#292524', '#0c0a09', '#070b12');
      drawVoxel(ctx, -6.5, headY - 1.5, 2.5, 4.5, 2.0, '#1c1917', '#292524', '#0c0a09', '#070b12');
      drawVoxel(ctx, 4.0, headY - 1.5, 2.5, 4.5, 2.0, '#1c1917', '#292524', '#0c0a09', '#070b12');
      // Signature Red Temple Bead
      drawPixelRect(ctx, 5.5, headY + 0.5, 2.2, 2.2, '#ef4444', '#7f1d1d', 0.8);
    } else if (faceStyle === 'turban') {
      // 3D Patka / Turban Voxel
      drawVoxel(ctx, -5.0, headY - 5.0, 10, 6.0, 3.0, '#f97316', '#fb923c', '#c2410c', '#070b12');
      drawPixelRect(ctx, -1.5, headY - 6.5, 3.0, 2.0, '#f97316'); // Top knot
    } else if (faceStyle === 'headband') {
      // 3D Headband
      drawVoxel(ctx, -4.5, headY - 3.5, 9, 4.5, 2.5, '#451a03', '#78350f', '#292524', '#070b12');
      drawPixelRect(ctx, -4.5, headY + 0.5, 9, 1.8, '#ffffff'); // White headband
    } else if (faceStyle === 'beard') {
      // 3D Hair & Jawline Beard
      drawVoxel(ctx, -4.5, headY - 3.5, 9, 4.5, 2.5, '#1e293b', '#334155', '#0f172a', '#070b12');
      drawPixelRect(ctx, -3.5, headY + 5.5, 7, 2.5, '#1e293b'); // Beard
    } else {
      // Classic 3D Pixel Hair
      drawVoxel(ctx, -4.5, headY - 3.5, 9, 4.5, 2.5, '#3b2512', '#58361b', '#24160a', '#070b12');
    }
    ctx.restore();

    // 5. 3D Pixel Windmill Bowling Arm & Cricket Ball
    ctx.save();
    const shoulderX = armSide === 'left' ? -6.5 : 6.5;
    const shoulderY = -5 + leanY;

    // Non-bowling arm (counter-balance pump)
    const nonBowlShoulderX = -shoulderX;
    drawVoxel(ctx, nonBowlShoulderX - 2, shoulderY - 2, 4, 9, 2, topColor, shadeColor(topColor, 20), shadeColor(topColor, -25), '#070b12');
    drawVoxel(ctx, nonBowlShoulderX - 1.5, shoulderY + 7, 3, 3, 1.5, skinTone, shadeColor(skinTone, 15), shadeColor(skinTone, -20), '#070b12');

    // Bowling Arm with 360° Windmill Rotation
    ctx.translate(shoulderX, shoulderY);

    let effectiveArmAngle = bowlingArmAngle || 0;
    if (isRunning) {
      effectiveArmAngle = Math.sin(runUpProgress * Math.PI * 6) * 0.45;
    }
    ctx.rotate(effectiveArmAngle);

    // Upper arm in team jersey sleeve
    drawVoxel(ctx, -2, 0, 4.5, 7, 2, topColor, shadeColor(topColor, 22), shadeColor(topColor, -26), '#070b12');
    // Forearm in skin tone
    drawVoxel(ctx, -1.8, 7, 4.0, 7, 2, skinTone, shadeColor(skinTone, 15), shadeColor(skinTone, -20), '#070b12');

    // 3D Crimson Leather Cricket Ball with stitched white seam pixels (held in hand before release)
    if (hasBall || isRunning || (runUpProgress < 0.98 && !isFollowingThrough)) {
      drawVoxel(ctx, -2.5, 14, 5.2, 5.2, 2.5, '#dc2626', '#ef4444', '#991b1b', '#450a0a');
      drawPixelRect(ctx, -0.5, 14, 1.2, 5.2, '#ffffff'); // White stitched seam
    }

    ctx.restore();
    ctx.restore();
  },

  /**
   * 3D PIXEL ART WICKET-KEEPER
   * Crouching 3D voxel stance behind the stumps with giant webbed keeping gloves!
   */
  drawWicketKeeper(ctx, x, y, {
    skinTone = '#f5d0b0',
    isStumping = false,
    jerseyColor = '#ef4444',
    kit = null,
    timeOfDay = 'day'
  }) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_ind');
    const topColor = resolvedKit.color;
    const pantsCol = resolvedKit.pantsColor || topColor;

    // Ground shadow
    drawPixelShadow(ctx, 0, 10, 12, 4.5, 0.38, timeOfDay);

    // Crouching 3D Voxel Legs & Pads
    drawVoxel(ctx, -5.5, 2, 5, 8, 2, '#ffffff', '#ffffff', '#cbd5e1', '#070b12');
    drawVoxel(ctx, 0.5, 2, 5, 8, 2, '#ffffff', '#ffffff', '#cbd5e1', '#070b12');

    // Crouching 3D Voxel Torso
    drawVoxel(ctx, -6.0, -6, 12, 9, 2.5, topColor, shadeColor(topColor, 20), shadeColor(topColor, -25), '#070b12');

    // 3D Head & Cap
    drawVoxel(ctx, -3.5, -12, 7, 6, 2.5, skinTone, shadeColor(skinTone, 15), shadeColor(skinTone, -20), '#070b12');
    drawVoxel(ctx, -4.0, -14, 8, 3, 2.5, topColor, shadeColor(topColor, 20), shadeColor(topColor, -25), '#070b12'); // Cap

    // 3D Wicket-Keeping Gloves with Webbing Triangles
    const gloveY = isStumping ? -2 : 0;
    // Left keeper glove
    drawVoxel(ctx, -8.5, gloveY, 4.5, 4.5, 2, '#facc15', '#fef08a', '#ca8a04', '#070b12');
    drawPixelRect(ctx, -5.5, gloveY + 1, 2.0, 2.5, '#ef4444'); // Webbing
    // Right keeper glove
    drawVoxel(ctx, 4.0, gloveY, 4.5, 4.5, 2, '#facc15', '#fef08a', '#ca8a04', '#070b12');
    drawPixelRect(ctx, 3.5, gloveY + 1, 2.0, 2.5, '#ef4444');

    ctx.restore();
  },

  /**
   * 3D PIXEL ART NON-STRIKER
   * 3D Voxel Non-Striker standing at the bowling crease with grounded 1-handed bat in backing-up posture!
   */
  drawNonStriker(ctx, x, y, {
    jerseyColor = '#0066b2',
    kit = null,
    pitchCenterX = null,
    isLeftHanded = false,
    skinTone = '#f5d0b0',
    timeOfDay = 'day'
  }) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_ind');
    const topColor = resolvedKit.color;
    const secColor = resolvedKit.secondaryColor || '#ffffff';
    const pantsCol = resolvedKit.pantsColor || topColor;

    // Ground shadow
    drawPixelShadow(ctx, 0, 10, 11, 4.5, 0.38, timeOfDay);

    // 3D Voxel Legs & Shoes
    drawVoxel(ctx, -4.5, 1, 4.5, 10, 2, pantsCol, shadeColor(pantsCol, 20), shadeColor(pantsCol, -25), '#070b12');
    drawVoxel(ctx, 0.5, 1, 4.5, 10, 2, pantsCol, shadeColor(pantsCol, 20), shadeColor(pantsCol, -25), '#070b12');
    drawPixelRect(ctx, -5.0, 11, 5, 1.5, '#ffffff');
    drawPixelRect(ctx, 0.0, 11, 5, 1.5, '#ffffff');

    // 3D Voxel Torso in Team Jersey
    drawVoxel(ctx, -5.5, -7, 11, 9, 2.5, topColor, shadeColor(topColor, 22), shadeColor(topColor, -26), '#070b12', { showGrid: true });
    drawPixelRect(ctx, 3.5, -6, 1.5, 7, secColor);
    drawPixelRect(ctx, -5.0, -6, 1.5, 7, secColor);

    // 3D Helmet Dome
    drawVoxel(ctx, -3.8, -13, 7.6, 6.5, 2.5, '#ffffff', '#ffffff', '#cbd5e1', '#070b12');
    drawPixelRect(ctx, -3.8, -8.5, 7.6, 1.8, '#0f172a');

    // 1-Handed Grounded 3D Pixel Bat resting across crease
    const batSide = pitchCenterX && x < pitchCenterX ? 1 : -1;
    ctx.save();
    ctx.translate(batSide * 5, -2);
    // Glove
    drawVoxel(ctx, -1.5, 0, 3.2, 3.2, 1.5, '#ffffff', '#ffffff', '#cbd5e1', '#070b12');
    // Bat handle & blade
    drawPixelRect(ctx, -1.0, -4, 2.0, 4.5, '#ffffff', '#070b12', 0.8);
    drawVoxel(ctx, -2.0, 2, 4.5, 13, 2, '#fef3c7', '#ffffff', '#92400e', '#070b12');
    ctx.restore();

    ctx.restore();
  },

  /**
   * 3D PIXEL ART SPRINTING RUNNER
   * Dynamic sprinting voxel cycle between wickets with churning legs, leaning torso, and grounded bat!
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
  }) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_ind');
    const topColor = resolvedKit.color;
    const pantsCol = resolvedKit.pantsColor || topColor;

    // Ground shadow
    drawPixelShadow(ctx, 0, 11, 13, 5, 0.40, timeOfDay);

    // Sprinting cycle: alternating legs
    const legPhase = (runProgress * Math.PI * 10) % (Math.PI * 2);
    const leg1Offset = Math.sin(legPhase) * 5.0;
    const leg2Offset = -leg1Offset;

    // Back leg
    drawVoxel(ctx, -4.5, 1 + leg2Offset, 4.5, 9, 2, pantsCol, shadeColor(pantsCol, 20), shadeColor(pantsCol, -25), '#070b12');
    // Front leg
    drawVoxel(ctx, 0.5, 1 + leg1Offset, 4.5, 9, 2, pantsCol, shadeColor(pantsCol, 20), shadeColor(pantsCol, -25), '#070b12');

    // Leaning forward Torso
    const leanAngle = isSliding ? 0.45 * runDirection : 0.20 * runDirection;
    ctx.rotate(leanAngle);

    drawVoxel(ctx, -5.5, -7, 11, 9, 2.5, topColor, shadeColor(topColor, 22), shadeColor(topColor, -26), '#070b12', { showGrid: true });

    // 3D Helmet Dome
    drawVoxel(ctx, -3.8, -13, 7.6, 6.5, 2.5, '#ffffff', '#ffffff', '#cbd5e1', '#070b12');
    drawPixelRect(ctx, -3.8, -8.5, 7.6, 1.8, '#0f172a');

    // Grounded sliding bat in sprint
    ctx.save();
    ctx.translate(4 * runDirection, -1);
    ctx.rotate(isSliding ? 1.4 * runDirection : 0.7 * runDirection);
    drawVoxel(ctx, -2.0, 0, 4.5, 14, 2, '#fef3c7', '#ffffff', '#92400e', '#070b12');
    ctx.restore();

    ctx.restore();
  },

  /**
   * 3D PIXEL ART FIELDER
   * Authentic 3D Voxel Fielder with Ready Stance, Sprinting Chases, Horizontal Diving Slides, and Catch Celebrations!
   */
  drawFielder(ctx, x, y, role, jerseyColor = '#ef4444', isDiving = false, isCatching = false, vx = 0, vy = 0, isFielding = false, kit = null, timeOfDay = 'day') {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const resolvedKit = resolveKit(kit || jerseyColor, 'jersey_aus');
    const topColor = resolvedKit.color;
    const secColor = resolvedKit.secondaryColor || '#ffffff';
    const pantsCol = resolvedKit.pantsColor || topColor;
    const skinTone = '#f5d0b0';

    // 1. Dynamic Ground Shadow
    drawPixelShadow(ctx, 0, 10, isDiving ? 18 : 11, 4.5, 0.38, timeOfDay);

    if (isDiving) {
      // Spectacular Horizontal 3D Pixel Diving Slide!
      const diveAngle = Math.atan2(vy, vx) || 0;
      ctx.rotate(diveAngle);

      // Grass skid dust particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillRect(-14, 3, 5, 2);
      ctx.fillRect(-9, 5, 4, 2);

      // Trailing 3D pixel legs
      drawVoxel(ctx, -14, -2, 7, 4, 2, pantsCol, shadeColor(pantsCol, 20), shadeColor(pantsCol, -25), '#070b12');
      // Horizontal Torso
      drawVoxel(ctx, -7, -3.5, 10, 7, 2.5, topColor, shadeColor(topColor, 22), shadeColor(topColor, -26), '#070b12');
      // Head & Cap
      drawVoxel(ctx, 3, -3, 5, 5, 2, skinTone, shadeColor(skinTone, 15), shadeColor(skinTone, -20), '#070b12');
      drawPixelRect(ctx, 4, -4, 4, 2, topColor);
      // Outstretched Reaching Arms
      drawVoxel(ctx, 8, -2, 7, 3, 1.5, skinTone, shadeColor(skinTone, 15), shadeColor(skinTone, -20), '#070b12');
    } else if (isCatching) {
      // 3D Pixel Catching Celebration: Two raised arms aloft!
      drawVoxel(ctx, -4.5, 1, 4.5, 10, 2, pantsCol, shadeColor(pantsCol, 20), shadeColor(pantsCol, -25), '#070b12');
      drawVoxel(ctx, 0.5, 1, 4.5, 10, 2, pantsCol, shadeColor(pantsCol, 20), shadeColor(pantsCol, -25), '#070b12');

      drawVoxel(ctx, -5.5, -7, 11, 9, 2.5, topColor, shadeColor(topColor, 22), shadeColor(topColor, -26), '#070b12');
      drawVoxel(ctx, -3.8, -13, 7.6, 6.5, 2.5, skinTone, shadeColor(skinTone, 15), shadeColor(skinTone, -20), '#070b12');
      drawPixelRect(ctx, -4.2, -14.5, 8.4, 2.5, topColor); // Team Cap

      // Two arms raised high in victory!
      drawVoxel(ctx, -8.5, -16, 3.5, 8, 1.5, skinTone, shadeColor(skinTone, 15), shadeColor(skinTone, -20), '#070b12');
      drawVoxel(ctx, 5.0, -16, 3.5, 8, 1.5, skinTone, shadeColor(skinTone, 15), shadeColor(skinTone, -20), '#070b12');
    } else {
      // Athletic Ready Stance / Sprinting Chaser
      const isMoving = Math.hypot(vx, vy) > 0.5;
      const step = isMoving ? Math.sin(Date.now() * 0.018) * 3.5 : 0;

      // 3D Voxel Legs in Team Pants
      drawVoxel(ctx, -4.5, 1 - step, 4.5, 9, 2, pantsCol, shadeColor(pantsCol, 20), shadeColor(pantsCol, -25), '#070b12');
      drawVoxel(ctx, 0.5, 1 + step, 4.5, 9, 2, pantsCol, shadeColor(pantsCol, 20), shadeColor(pantsCol, -25), '#070b12');
      drawPixelRect(ctx, -5.0, 10 - step, 5, 1.2, '#ffffff');
      drawPixelRect(ctx, 0.0, 10 + step, 5, 1.2, '#ffffff');

      // 3D Voxel Torso
      drawVoxel(ctx, -5.5, -7, 11, 9, 2.5, topColor, shadeColor(topColor, 22), shadeColor(topColor, -26), '#070b12', { showGrid: true });
      drawPixelRect(ctx, 3.5, -6, 1.5, 7, secColor);
      drawPixelRect(ctx, -5.0, -6, 1.5, 7, secColor);

      // 3D Head & Team Cap
      drawVoxel(ctx, -3.8, -13, 7.6, 6.5, 2.5, skinTone, shadeColor(skinTone, 15), shadeColor(skinTone, -20), '#070b12');
      drawVoxel(ctx, -4.2, -14.5, 8.4, 2.8, 2, topColor, shadeColor(topColor, 20), shadeColor(topColor, -25), '#070b12');
      // Cap Visor
      drawPixelRect(ctx, -4.5, -12, 9, 1.4, '#070b12');
    }

    ctx.restore();
  },

  /**
   * Regulation 30-Yard Inner Circle with painted white marker discs on outfield grass
   */
  draw30YardCircle(ctx, cx, cy, rx = 270, ry = 310) {
    if (!ctx) return;
    ctx.save();
    // Soft outer shadow of the ring line
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.lineWidth = 3.0;
    ctx.stroke();

    // Regulation Painted White 30-Yard Line
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([8, 8]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 16 White Circular Painted Discs positioned along the 30-yard ring perimeter
    const numDiscs = 16;
    for (let i = 0; i < numDiscs; i++) {
      const angle = (i / numDiscs) * Math.PI * 2;
      const dx = cx + Math.cos(angle) * rx;
      const dy = cy + Math.sin(angle) * ry;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    ctx.restore();
  },

  /**
   * DYNAMIC STADIUM ARCHITECTURE & SPECTATOR PRESENTATION
   * Dynamically renders grandstands, canopies, pavilions, LED ribbon boards,
   * floodlights, and crowd matching the selected Stadium, Architecture, and Weather!
   */
  drawStadiumCrowdStands(ctx, cx, cy, boundaryRadius, width, height, crowdState = {}, stadium = null, timeOfDay = 'day', weather = 'sunny') {
    if (!ctx) return;
    try {
      ctx.save();
      const br = Math.max(100, Number.isFinite(boundaryRadius) ? boundaryRadius : 850);
      const safeCx = Number.isFinite(cx) ? cx : (width ? width / 2 : 200);
      const safeCy = Number.isFinite(cy) ? cy : (height ? height * 0.52 : 300);
      const isCheering = !!(crowdState.isCheering || crowdState.isRocketSix);
      const landing = crowdState.sixLanding || null;
      const now = Date.now();

      const arch = stadium?.architecture || 'colosseum';
      const seatColor1 = stadium?.seatColor1 || '#162235';
      const seatColor2 = stadium?.seatColor2 || '#111b2b';
      const canopyColor = stadium?.canopyColor || '#0f172a';
      const ledColor = stadium?.ledColor || '#38bdf8';
      const isNightOrDusk = timeOfDay === 'night' || timeOfDay === 'sunset';

      // 1. Boundary Rope (Thick braided white rope with drop shadow)
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, br, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.lineWidth = 4.0;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(safeCx, safeCy, br, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.6;
      ctx.stroke();

      // 2. Green Turf Run-Off Margin behind boundary rope
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, br + 7, 0, Math.PI * 2);
      ctx.strokeStyle = stadium?.grassColor ? shadeColor(stadium.grassColor, -15) : '#1e4822';
      ctx.lineWidth = 14;
      ctx.stroke();

      // 3. Electronic LED Advertising Ribbon Board (360° Digital Perimeter Ads)
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, br + 18, 0, Math.PI * 2);
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(safeCx, safeCy, br + 15, 0, Math.PI * 2);
      ctx.strokeStyle = ledColor;
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // Sponsor Logo Banners rotating on the ribbon board
      const numSponsorBanners = 32;
      for (let b = 0; b < numSponsorBanners; b++) {
        const bAngle = (b / numSponsorBanners) * Math.PI * 2 + (now * 0.00025);
        const bx = safeCx + Math.cos(bAngle) * (br + 18);
        const by = safeCy + Math.sin(bAngle) * (br + 18);

        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(bAngle + Math.PI / 2);
        if (b % 3 === 0) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-10, -2.5, 20, 5);
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(-8, -1.5, 16, 3);
        } else if (b % 3 === 1) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(-10, -2.5, 20, 5);
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(-8, -1.5, 16, 3);
        } else {
          ctx.fillStyle = '#10b981';
          ctx.fillRect(-10, -2.5, 20, 5);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-8, -1.5, 16, 3);
        }
        ctx.restore();
      }

      // Players Walkout Tunnel Gate cutout
      const gateAngle = Math.PI * 0.98;
      const gx = safeCx + Math.cos(gateAngle) * (br + 17);
      const gy = safeCy + Math.sin(gateAngle) * (br + 17);
      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(gateAngle + Math.PI / 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-14, -4.5, 28, 9);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-11, -3.5, 22, 7);
      ctx.restore();

      // 4. Grandstand Tiers based on Architecture
      const r1_in = br + 24;
      const r1_out = br + 124;
      const r_conc1_in = br + 124;
      const r_conc1_out = br + 154;
      const r2_in = br + 154;
      const r2_out = br + 268;
      const r_conc2_in = br + 268;
      const r_conc2_out = br + 304;
      const r3_in = br + 304;
      const r3_out = br + 424;

      // TIER 1 Lower Bowl
      ctx.beginPath();
      ctx.arc(safeCx, safeCy, (r1_in + r1_out) / 2, 0, Math.PI * 2);
      ctx.strokeStyle = seatColor1;
      ctx.lineWidth = r1_out - r1_in;
      ctx.stroke();

      // CONCOURSE 1 (Mid Promenade)
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
        drawVoxel(ctx, flX - 18, flY - 14, 36, 28, 4, '#0f172a', '#1e293b', '#020617', '#64748b');

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
