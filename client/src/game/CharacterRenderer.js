// ============================================================================
// CRICKET RUSH - Authentic 3D Pixel Art / Voxel Character Engine
// True 3D volume, perspective, highlights, shadows, and authentic cricket poses:
// - Striker Batsman: Rear-isometric 3D facing UP-pitch towards bowler, 3D white pads with blue rungs,
//   3D helmet, 3D willow bat with red handle, dynamic 3D swing arcs, left-handed mirroring.
// - Bowler: Front 3D facing DOWN-pitch towards camera, 3D afro head, athletic jersey/trousers,
//   alternating run strides, gather, signature VERTICAL HIGH-ARM RELEASE pointing straight to sky!
// - Wicket-Keeper: 3D squat behind stumps facing up-pitch, 3D pads, helmet, webbed gloves.
// - Non-Striker: 3D stance at bowler's crease facing down-pitch, grounded bat.
// - Runners: Striker sprinting UP, Non-striker sprinting DOWN, 3D sliding dive.
// - Fielders: 360° dynamic orientation facing ball, 3D sprint, dive, catch, celebration!
// ============================================================================

/**
 * Adjust hex color brightness for 3D highlights and shadows
 */
function adjustBrightness(hex, factor) {
  try {
    let c = String(hex || '#ffffff').replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;
    const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
    const nr = factor > 0 ? clamp(r + (255 - r) * factor) : clamp(r * (1 + factor));
    const ng = factor > 0 ? clamp(g + (255 - g) * factor) : clamp(g * (1 + factor));
    const nb = factor > 0 ? clamp(b + (255 - b) * factor) : clamp(b * (1 + factor));
    return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`;
  } catch (e) {
    return hex;
  }
}

/**
 * Draw a clean rounded rectangle with fill & stroke
 */
function drawRoundRect(ctx, x, y, w, h, radius, fill, stroke = null, lineWidth = 1.2) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h), radius);
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
 * Draw a clean ellipse with fill & stroke
 */
function drawEllipse(ctx, cx, cy, rx, ry, fill, stroke = null, lineWidth = 1.2) {
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(Math.round(cx), Math.round(cy), Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
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
 * Core 3D Pixel Voxel Builder:
 * Renders a crisp 3D voxel cuboid with top highlight face, front base face,
 * and side shadow flank face for undeniable 3D depth and pixel art aesthetic.
 */
function draw3DVoxel(ctx, x, y, z, w, d, h, baseColor, {
  outline = '#090e17',
  topHighlight = 0.32,
  sideShadow = -0.32,
  side = 'auto',
  showTop = true,
  showSide = true,
  pixelBevel = true
} = {}) {
  const rx = Math.round(x);
  const ry = Math.round(y);
  const rz = Math.round(z);
  const rw = Math.max(1, Math.round(w));
  const rh = Math.max(1, Math.round(h));
  const depthY = Math.max(1, Math.round(d * 0.42));

  const x0 = Math.round(rx - rw / 2);
  const x1 = x0 + rw;
  const y0 = Math.round(ry - rz - rh);
  const y1 = Math.round(ry - rz);

  const topColor = adjustBrightness(baseColor, topHighlight);
  const shadowColor = adjustBrightness(baseColor, sideShadow);

  const drawSideRight = side === 'right' || (side === 'auto' && rx >= 0);
  const drawSideLeft = side === 'left' || (side === 'auto' && rx < 0);

  ctx.save();

  // 1. Side Shadow Face (Right Flank)
  if (showSide && drawSideRight) {
    ctx.beginPath();
    ctx.moveTo(x1, y0);
    ctx.lineTo(x1, y0 - depthY);
    ctx.lineTo(x1, y1 - depthY);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.fillStyle = shadowColor;
    ctx.fill();
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1.0;
    ctx.stroke();
  } else if (showSide && drawSideLeft) {
    // Side Shadow Face (Left Flank)
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, y0 - depthY);
    ctx.lineTo(x0, y1 - depthY);
    ctx.lineTo(x0, y1);
    ctx.closePath();
    ctx.fillStyle = shadowColor;
    ctx.fill();
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1.0;
    ctx.stroke();
  }

  // 2. Front / Main Face (Base Color)
  ctx.fillStyle = baseColor;
  ctx.fillRect(x0, y0, rw, rh);
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.1;
  ctx.strokeRect(x0, y0, rw, rh);

  // 3. Top Face (Sunlit Highlight)
  if (showTop) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, y0 - depthY);
    ctx.lineTo(x1, y0 - depthY);
    ctx.lineTo(x1, y0);
    ctx.closePath();
    ctx.fillStyle = topColor;
    ctx.fill();
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1.0;
    ctx.stroke();

    // Pixel highlight line along front edge of top face
    if (pixelBevel && rw >= 4) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillRect(x0 + 1, y0 - 1.5, rw - 2, 1.2);
    }
  }

  ctx.restore();
}

/**
 * 3D Batting Pad: Authentic white shin guard with 3 blue accent straps and knee roll
 * (Exact match of "BATSMAN IDLE" in user reference sprite sheet)
 */
function draw3DBattingPad(ctx, x, y, z = 0, { isLeft = false, padColor = '#ffffff', strapColor = '#2563eb' } = {}) {
  // Shoe / Spike underneath
  draw3DVoxel(ctx, x, y, z, 6.5, 6, 3, '#090e17', { topHighlight: 0.2, sideShadow: -0.4 });
  drawRoundRect(ctx, x - 3, y - z - 1, 6, 1.5, 0.5, '#ffffff');

  // White 3D Pad Shin Guard
  draw3DVoxel(ctx, x, y, z + 3, 6.5, 5, 12, padColor, { topHighlight: 0.15, sideShadow: -0.22 });

  // 3 Horizontal Blue Rungs / Straps (Identical to reference sprite sheet!)
  ctx.fillStyle = strapColor;
  const padScreenTop = Math.round(y - (z + 3) - 12);
  ctx.fillRect(Math.round(x - 3), padScreenTop + 3, 6, 1.2);
  ctx.fillRect(Math.round(x - 3), padScreenTop + 6.5, 6, 1.2);
  ctx.fillRect(Math.round(x - 3), padScreenTop + 10, 6, 1.2);

  // Pad Knee Roll at top
  draw3DVoxel(ctx, x, y, z + 15, 7.5, 5.5, 3.5, '#f8fafc', { topHighlight: 0.25, sideShadow: -0.18 });
}

/**
 * 3D Cricket Willow Bat:
 * Layered wooden blade with willow grain, rubber grip handle, manufacturer badge, and dark toe guard
 */
function draw3DWillowBat(ctx, x, y, z = 0, angle = 0, { batSkin = 'willow', gripColor = '#ef4444' } = {}) {
  ctx.save();
  const screenX = Math.round(x);
  const screenY = Math.round(y - z);
  ctx.translate(screenX, screenY);
  ctx.rotate(angle);

  // Rubber Grip Cane Handle
  draw3DVoxel(ctx, 0, 0, 16, 2.6, 2.6, 8, gripColor, { outline: '#090e17' });

  // English Willow Blade
  const willowColor = batSkin === 'carbon' ? '#1e293b' : batSkin === 'gold' ? '#f59e0b' : '#d97706';
  draw3DVoxel(ctx, 0, 0, 0, 5.2, 3.2, 16, willowColor, {
    topHighlight: 0.35,
    sideShadow: -0.25,
    outline: '#090e17'
  });

  // Willow grain lines
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-1.2, -15); ctx.lineTo(-1.2, -2);
  ctx.moveTo(1.2, -15); ctx.lineTo(1.2, -2);
  ctx.stroke();

  // Manufacturer sticker / brand badge (MRF / Kookaburra)
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-2, -14, 4, 3.5);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-1.5, -13, 3, 1.2);

  // Dark rubber toe guard at tip of bat
  ctx.fillStyle = '#090e17';
  ctx.fillRect(-2.5, -1.5, 5, 1.8);

  ctx.restore();
}

export const CharacterRenderer = {
  /**
   * Draw Striker Batsman in Clean 2D Pixel-Arcade / Chibi Style (matching Reference Screenshot):
   * Crisp white batting helmet with bold dark visor rim, team jersey with crisp dark outline,
   * white batting gloves, red rubber grip on willow bat, and distinct white batting pads.
   * Dynamically supports Left-Handed and Right-Handed stances!
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
    skinTone = '#f5d0b0'
  }) {
    const visualX = Math.round(x + (isSwinging ? 0 : weightShiftX));
    const visualY = Math.round(y - (isSteppingOut ? stepOutOffset : 0));

    ctx.save();
    ctx.translate(visualX, visualY);

    // Left-handed batsman mirrors across pitch centerline
    if (isLeftHanded) {
      ctx.scale(-1, 1);
    }

    // 1. Soft Oval Ground Shadow on Turf
    drawEllipse(ctx, 0, 2, 14, 5.5, 'rgba(0, 0, 0, 0.38)');

    // 2. Footwork & Stride offsets
    let leftPadY = 0;
    let rightPadY = 1;
    let leftPadZ = 0;
    let rightPadZ = 0;
    let torsoZ = 16;
    let batAngle = 0.25;
    let batX = 7;
    let batY = 1;
    let batZ = 6;

    if (footworkState === 'bowled' || footworkState === 'out') {
      // Dismay / Bowled animation
      torsoZ = 13;
      leftPadY = 2;
      rightPadY = 3;
      batAngle = Math.PI * 0.45;
      batX = 11;
      batY = 4;
      batZ = 1;
    } else if (isSwinging) {
      if (swingProgress < 0.22) {
        // Backlift: bat raised back and high behind right shoulder in 3D
        batAngle = -Math.PI * 0.65;
        batX = 8;
        batY = -2;
        batZ = 16;
        rightPadY = 1;
      } else if (swingProgress < 0.68) {
        // Impact & Follow-through arc based on shotStyle
        const swingT = (swingProgress - 0.22) / 0.46;
        if (shotStyle === 'pull' || shotStyle === 'hook') {
          // Horizontal cross-batted pull swatting across chest
          batAngle = -Math.PI * 0.65 + swingT * Math.PI * 1.35;
          batX = 7 - swingT * 15;
          batY = 0;
          batZ = 12;
          leftPadY = -2;
        } else if (shotStyle === 'square_cut' || shotStyle === 'late_cut') {
          // Slicing cut stroke downward backward of point
          batAngle = -Math.PI * 0.5 + swingT * Math.PI * 0.95;
          batX = 9 + swingT * 6;
          batY = 2;
          batZ = 14 - swingT * 8;
        } else {
          // Classic Straight / Cover Drive: front foot strides forward, full vertical arc down the pitch!
          leftPadY = -4; // Front foot lunges forward
          batAngle = -Math.PI * 0.65 + swingT * Math.PI * 1.45;
          batX = 5 - swingT * 3;
          batY = -3 + swingT * 2;
          batZ = 16 - swingT * 8;
        }
      } else {
        // High follow-through
        batAngle = Math.PI * 0.85;
        batX = -5;
        batY = -2;
        batZ = 18;
      }
    } else {
      // Idle / Stance: light tap on pitch with triggerTap
      batAngle = 0.20 + triggerTap * 0.08;
      batX = 7.5;
      batY = 1 - triggerTap * 0.5;
      batZ = 2 + triggerTap * 1.5;
    }

    // 3. Batting Pads on both legs (3D White Pads with blue rungs)
    draw3DBattingPad(ctx, -5.5, leftPadY, leftPadZ, { isLeft: true });
    draw3DBattingPad(ctx, 4.5, rightPadY, rightPadZ, { isLeft: false });

    // 4. Athletic Trousers / Pelvis
    draw3DVoxel(ctx, -0.5, 0, torsoZ - 4, 13, 6.5, 4.5, jerseyColor, {
      topHighlight: 0.2,
      sideShadow: -0.3
    });

    // 5. 3D Jersey Torso (Viewed from Behind facing UP-pitch)
    draw3DVoxel(ctx, -0.5, 0, torsoZ, 14, 7.5, 13, jerseyColor, {
      topHighlight: 0.32,
      sideShadow: -0.28
    });

    // Player Number / Name Panel on Back of Jersey
    ctx.fillStyle = '#ffffff';
    const jerseyTopScreen = Math.round(- (torsoZ + 13));
    ctx.fillRect(-3, jerseyTopScreen + 3, 6, 5);
    ctx.fillStyle = '#090e17';
    ctx.font = 'bold 5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('18', 0, jerseyTopScreen + 7);

    // White collar trim
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2.5, jerseyTopScreen + 0.5, 5, 1.2);

    // 6. 3D Batting Helmet (Viewed from Behind with top dome highlight & earflaps)
    const headZ = torsoZ + 13;
    draw3DVoxel(ctx, -0.5, -0.5, headZ, 11, 10, 9.5, '#ffffff', {
      topHighlight: 0.20,
      sideShadow: -0.25
    });

    // Dark helmet neck rim band
    ctx.fillStyle = '#334155';
    const helmetTopScreen = Math.round(- (headZ + 9.5));
    ctx.fillRect(-4.5, helmetTopScreen + 7.5, 9, 1.6);

    // Dark hair peeking out below helmet base
    ctx.fillStyle = '#111827';
    ctx.fillRect(-3.5, helmetTopScreen + 9, 7, 1.8);

    // 7. 3D Willow Bat & Batting Gloves
    draw3DWillowBat(ctx, batX, batY, batZ, batAngle, { batSkin });

    // 3D White Batting Gloves gripping the bat handle
    draw3DVoxel(ctx, batX - 1.5, batY, batZ + 12, 3.8, 3.8, 3.8, '#ffffff', {
      outline: '#090e17'
    });
    draw3DVoxel(ctx, batX + 1.2, batY, batZ + 15, 3.8, 3.8, 3.8, '#ffffff', {
      outline: '#090e17'
    });

    // If bowled/out dismay: hands clutching helmet in disbelief
    if (footworkState === 'bowled' || footworkState === 'out') {
      draw3DVoxel(ctx, -6.5, -0.5, headZ + 4, 3.5, 3.5, 3.5, '#ffffff', { outline: '#090e17' });
      draw3DVoxel(ctx, 5.5, -0.5, headZ + 4, 3.5, 3.5, 3.5, '#ffffff', { outline: '#090e17' });
    }

    ctx.restore();
  },

  /**
   * Draw Bowler in 3D Pixel Art Style (Matching Reference Screenshot BOWLING ACTION):
   * Facing DOWN the pitch towards batsman & camera, 3D afro head dome, athletic jersey,
   * trousers with white side racing stripes, alternating run strides, gather, and signature
   * OVERHEAD HIGH-ARM VERTICAL RELEASE pointing straight up into the sky!
   */
  drawBowler(ctx, x, y, {
    runUpProgress = 0,
    bowlingArmAngle = 0,
    followThroughProgress = 0,
    actionType = 'high_arm',
    armSide = 'right',
    skinTone = '#c68656',
    faceStyle = 'afro',
    jerseyColor = '#0066b2',
    isFielding = false,
    hasBall = false
  }) {
    const isRunning = runUpProgress > 0 && runUpProgress < 1.0;
    const isFollowingThrough = followThroughProgress > 0;

    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    if (armSide === 'left') {
      ctx.scale(-1, 1);
    }

    // 1. Soft Oval Ground Shadow
    drawEllipse(ctx, 0, 2, 13, 5.2, 'rgba(0, 0, 0, 0.38)');

    // 2. Athletic Stride & Dynamic Action
    const stride = isRunning ? Math.sin(runUpProgress * Math.PI * 8) * 5.5 : (isFielding ? Math.sin(Date.now() * 0.015) * 5.0 : 0);
    const leanY = isFollowingThrough ? followThroughProgress * 3.5 : (isFielding ? 2 : 0);

    // Left Leg (3D Trouser with white racing stripe)
    const leftLegY = 1 - stride + leanY;
    draw3DVoxel(ctx, -4.5, leftLegY, 0, 5, 5, 12, jerseyColor, { topHighlight: 0.25, sideShadow: -0.3 });
    // White outer racing stripe
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.round(-7), Math.round(leftLegY - 10), 1.2, 8);
    // Athletic Spike
    draw3DVoxel(ctx, -4.5, leftLegY, -2, 5.5, 6, 2.5, '#090e17');

    // Right Leg (3D Trouser with white racing stripe)
    const rightLegY = 1 + stride + leanY * 0.5;
    draw3DVoxel(ctx, 4.5, rightLegY, 0, 5, 5, 12, jerseyColor, { topHighlight: 0.25, sideShadow: -0.3 });
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.round(6), Math.round(rightLegY - 10), 1.2, 8);
    // Athletic Spike
    draw3DVoxel(ctx, 4.5, rightLegY, -2, 5.5, 6, 2.5, '#090e17');

    // 3. 3D Torso (Viewed from Front facing DOWN-pitch towards camera)
    const torsoZ = 12;
    draw3DVoxel(ctx, 0, leanY, torsoZ, 14, 7.5, 12.5, jerseyColor, {
      topHighlight: 0.32,
      sideShadow: -0.28
    });

    // White V-Neck Collar & Chest Trim
    ctx.fillStyle = '#ffffff';
    const torsoTopScreen = Math.round(leanY - (torsoZ + 12.5));
    ctx.beginPath();
    ctx.moveTo(-3, torsoTopScreen);
    ctx.lineTo(0, torsoTopScreen + 3.5);
    ctx.lineTo(3, torsoTopScreen);
    ctx.closePath();
    ctx.fill();

    // 4. 3D Head & Face (Front View looking down-pitch)
    const headZ = torsoZ + 12.5;
    draw3DVoxel(ctx, 0, leanY, headZ, 9.5, 8.5, 9, skinTone, {
      topHighlight: 0.25,
      sideShadow: -0.25
    });

    // Focused Eyes looking down the pitch
    ctx.fillStyle = '#090e17';
    const headTopScreen = Math.round(leanY - (headZ + 9));
    ctx.fillRect(-2.8, headTopScreen + 4.5, 1.8, 1.8);
    ctx.fillRect(1.0, headTopScreen + 4.5, 1.8, 1.8);

    // 3D Curly Afro / Hair Dome on top
    draw3DVoxel(ctx, 0, leanY - 0.5, headZ + 7, 11.5, 10, 5.5, '#111827', {
      topHighlight: 0.20,
      sideShadow: -0.40
    });

    // 5. BOWLING ARM ACTION & SIGNATURE HIGH-ARM VERTICAL RELEASE:
    // When runUpProgress is near release (0.82 to 1.0) or bowler is bowling:
    const isHighArmRelease = (isRunning && runUpProgress >= 0.82) || (bowlingArmAngle === 0 && !isFollowingThrough && !isRunning && !isFielding);

    if (isHighArmRelease) {
      // SIGNATURE HIGH-ARM RELEASE:
      // The bowling arm reaches STRAIGHT UP INTO THE SKY (vertical apex above head)!
      const armApexZ = headZ + 10;
      // High-Arm vertical arm voxel pointing directly up!
      draw3DVoxel(ctx, 5.5, leanY, armApexZ, 3.6, 3.6, 12, skinTone, { outline: '#090e17' });
      // Hand holding cricket ball at top apex
      draw3DVoxel(ctx, 5.5, leanY, armApexZ + 12, 3.8, 3.8, 3.8, skinTone, { outline: '#090e17' });
      // Red Leather Cricket Ball in hand!
      drawEllipse(ctx, 5.5, leanY - (armApexZ + 14), 3.5, 3.5, '#dc2626', '#450a0a', 1.0);
    } else if (isFollowingThrough) {
      // Follow-through: arm swept down across torso
      draw3DVoxel(ctx, -3, leanY + 2, torsoZ + 2, 4, 4, 9, skinTone, { outline: '#090e17' });
    } else if (isRunning) {
      // Running arm pump
      const armPump = Math.sin(runUpProgress * Math.PI * 8) * 4;
      draw3DVoxel(ctx, 7, leanY + armPump, torsoZ + 4, 3.5, 3.5, 8, skinTone, { outline: '#090e17' });
      draw3DVoxel(ctx, -7, leanY - armPump, torsoZ + 4, 3.5, 3.5, 8, skinTone, { outline: '#090e17' });
    } else {
      // Ready stance
      draw3DVoxel(ctx, 7, leanY, torsoZ + 3, 3.5, 3.5, 8, skinTone, { outline: '#090e17' });
      draw3DVoxel(ctx, -7, leanY, torsoZ + 3, 3.5, 3.5, 8, skinTone, { outline: '#090e17' });
    }

    ctx.restore();
  },

  /**
   * Draw Wicket-Keeper in 3D Pixel Art Style (Matching Reference Screenshot):
   * Crouched squatting stance directly behind stumps facing UP the pitch,
   * 3D white pads, 3D team jersey, white helmet, large webbed keeping gloves
   */
  drawWicketKeeper(ctx, x, y, { skinTone = '#f5d0b0', isStumping = false, jerseyColor = '#0066b2' } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // Ground Shadow
    drawEllipse(ctx, 0, 2, 14, 5.5, 'rgba(0, 0, 0, 0.38)');

    // 3D Crouched Squatting Legs with White Keeper Pads
    const squatY = isStumping ? -2 : 0;
    const squatZ = isStumping ? 6 : 2;
    draw3DBattingPad(ctx, -7.5, squatY, squatZ, { isLeft: true });
    draw3DBattingPad(ctx, 6.5, squatY, squatZ, { isLeft: false });

    // 3D Fielding Team Jersey Torso (Facing UP towards batsman/bowler)
    const torsoZ = squatZ + 12;
    draw3DVoxel(ctx, -0.5, squatY, torsoZ, 14, 7.5, 11, jerseyColor, {
      topHighlight: 0.32,
      sideShadow: -0.28
    });

    // White Helmet facing up
    const headZ = torsoZ + 11;
    draw3DVoxel(ctx, -0.5, squatY, headZ, 11, 10, 9, '#ffffff', {
      topHighlight: 0.20,
      sideShadow: -0.25
    });

    // 3D Large Wicket-Keeping Gloves (Royal blue with yellow webbing)
    const gloveZ = isStumping ? headZ + 6 : torsoZ + 4;
    const gloveY = isStumping ? -4 : -2;
    // Left glove
    draw3DVoxel(ctx, -5.5, gloveY, gloveZ, 5.5, 4.5, 5.5, '#1d4ed8', { outline: '#090e17' });
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(Math.round(-7.5), Math.round(gloveY - (gloveZ + 4)), 2, 3);

    // Right glove
    draw3DVoxel(ctx, 4.5, gloveY, gloveZ, 5.5, 4.5, 5.5, '#1d4ed8', { outline: '#090e17' });
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(Math.round(6), Math.round(gloveY - (gloveZ + 4)), 2, 3);

    ctx.restore();
  },

  /**
   * Draw Non-Striker Batsman in 3D Pixel Art Style (Standing at bowler's crease facing striker down-pitch)
   */
  drawNonStriker(ctx, x, y, { skinTone = '#f5d0b0', jerseyColor = '#0066b2' } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // Ground Shadow
    drawEllipse(ctx, 0, 2, 13, 5.2, 'rgba(0, 0, 0, 0.38)');

    // 3D Batting Pads (Standing at bowler's crease facing striker down-pitch)
    draw3DBattingPad(ctx, -5.0, 0, 0, { isLeft: true });
    draw3DBattingPad(ctx, 4.0, 1, 0, { isLeft: false });

    // 3D Jersey Torso
    draw3DVoxel(ctx, -0.5, 0, 14, 13.5, 7, 12, jerseyColor, {
      topHighlight: 0.30,
      sideShadow: -0.28
    });

    // 3D Batting Helmet
    draw3DVoxel(ctx, -0.5, 0, 26, 11, 9.5, 9, '#ffffff', {
      topHighlight: 0.20,
      sideShadow: -0.25
    });

    // Grounded Cricket Bat resting on pitch crease
    draw3DWillowBat(ctx, 6.5, 2, 0, 0.15);

    ctx.restore();
  },

  /**
   * Draw Runner in 3D Pixel Art Style (Sprinting along vertical pitch tracks with diving slide)
   */
  drawRunner(ctx, x, y, {
    isStriker = true,
    runProgress = 0,
    runDirection = 1,
    isSliding = false,
    jerseyColor = '#0066b2',
    skinTone = '#f5d0b0'
  } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // If Striker, running UP the pitch (facing away, rear view); if Non-striker, running DOWN (front view)
    const isFacingUp = isStriker ? (runDirection > 0) : (runDirection < 0);

    // Ground Shadow
    drawEllipse(ctx, 0, 2, isSliding ? 18 : 13, 5.2, 'rgba(0, 0, 0, 0.38)');

    if (isSliding) {
      // 3D SLIDING DIVE INTO CREASE (Bat outstretched flat into crease!)
      const slideDir = isFacingUp ? -1 : 1;
      ctx.rotate(slideDir * 0.45);

      // Horizontal diving body
      draw3DVoxel(ctx, 0, 0, 4, 15, 7.5, 9, jerseyColor, { topHighlight: 0.32, sideShadow: -0.28 });
      draw3DVoxel(ctx, slideDir * 8, 0, 4, 9, 8.5, 8, '#ffffff', { topHighlight: 0.20 });

      // Outstretched bat sliding flat along the grass!
      draw3DWillowBat(ctx, slideDir * 16, 0, 1, slideDir * Math.PI * 0.5);
    } else {
      // Alternating 3D running leg cycle with white batting pads
      const stride = Math.sin(runProgress * Math.PI * 10) * 6;
      draw3DBattingPad(ctx, -5.0, -stride, 0, { isLeft: true });
      draw3DBattingPad(ctx, 4.0, stride, 0, { isLeft: false });

      // 3D Jersey Torso
      draw3DVoxel(ctx, -0.5, 0, 14, 13.5, 7, 12, jerseyColor, {
        topHighlight: 0.30,
        sideShadow: -0.28
      });

      // 3D Batting Helmet
      draw3DVoxel(ctx, -0.5, 0, 26, 11, 9.5, 9, '#ffffff', {
        topHighlight: 0.20,
        sideShadow: -0.25
      });

      // Bat tucked in hand running
      draw3DWillowBat(ctx, 7, 0, 6, isFacingUp ? -0.4 : 0.4);
    }

    ctx.restore();
  },

  /**
   * Draw Fielder in 3D Pixel Art Style (Matching Reference Screenshot):
   * Full dynamic 3D posture, alert ready stance, diving slide on grass,
   * leaping catch, and celebration with both arms raised high in V-shape!
   */
  drawFielder(ctx, x, y, role, jerseyColor = '#ef4444', isDiving = false, isCatching = false, options = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    if (isCatching) {
      // LEAPING / CELEBRATING CATCH (Matching bottom row of reference sprite sheet: both arms high in the air!)
      drawEllipse(ctx, 0, 4, 12, 4.5, 'rgba(0, 0, 0, 0.30)');
      const jumpZ = 8;

      // Legs
      draw3DVoxel(ctx, -4.5, 0, jumpZ, 4.8, 5, 11, jerseyColor, { topHighlight: 0.25, sideShadow: -0.3 });
      draw3DVoxel(ctx, 4.5, 0, jumpZ, 4.8, 5, 11, jerseyColor, { topHighlight: 0.25, sideShadow: -0.3 });

      // Torso
      draw3DVoxel(ctx, 0, 0, jumpZ + 11, 13.5, 7, 11, jerseyColor, { topHighlight: 0.30, sideShadow: -0.28 });

      // Head
      draw3DVoxel(ctx, 0, 0, jumpZ + 22, 9, 8, 8, '#c68656');
      draw3DVoxel(ctx, 0, -0.5, jumpZ + 28, 10.5, 9, 4.5, '#111827');

      // Both Arms Raised High in V-Shape (Iconic celebration!)
      draw3DVoxel(ctx, -7.5, 0, jumpZ + 24, 3.5, 3.5, 10, jerseyColor);
      draw3DVoxel(ctx, 7.5, 0, jumpZ + 24, 3.5, 3.5, 10, jerseyColor);
      // White fielding gloves
      draw3DVoxel(ctx, -8.5, 0, jumpZ + 34, 3.5, 3.5, 3.5, '#ffffff');
      draw3DVoxel(ctx, 8.5, 0, jumpZ + 34, 3.5, 3.5, 3.5, '#ffffff');
    } else if (isDiving) {
      // 3D TURF DIVING SLIDE
      drawEllipse(ctx, 0, 2, 18, 5.5, 'rgba(0, 0, 0, 0.38)');
      ctx.rotate(0.28);

      // Horizontal sliding body
      draw3DVoxel(ctx, 0, 0, 3, 16, 7.5, 8, jerseyColor, { topHighlight: 0.32, sideShadow: -0.28 });
      draw3DVoxel(ctx, 9, 0, 3, 8, 7, 7, '#c68656');
      // Outstretched arms stopping ball
      draw3DVoxel(ctx, 16, 0, 2, 6, 3.5, 3.5, '#ffffff');
    } else {
      // UPRIGHT 3D ATHLETIC READY STANCE
      drawEllipse(ctx, 0, 2, 12, 5, 'rgba(0, 0, 0, 0.35)');

      // Trousers with white racing stripes
      draw3DVoxel(ctx, -4.5, 0, 0, 5, 5, 11, jerseyColor, { topHighlight: 0.25, sideShadow: -0.3 });
      draw3DVoxel(ctx, 4.5, 0, 0, 5, 5, 11, jerseyColor, { topHighlight: 0.25, sideShadow: -0.3 });
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.round(-7), Math.round(-9), 1.2, 8);
      ctx.fillRect(Math.round(6), Math.round(-9), 1.2, 8);

      // 3D Jersey Torso
      draw3DVoxel(ctx, 0, 0, 11, 13.5, 7, 11, jerseyColor, { topHighlight: 0.30, sideShadow: -0.28 });
      // White collar
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2, Math.round(-22), 4, 1.5);

      // Head with dark cap
      draw3DVoxel(ctx, 0, 0, 22, 9, 8, 8, '#c68656');
      draw3DVoxel(ctx, 0, -0.5, 28, 10.5, 9, 4.5, '#111827');

      // Ready arms
      draw3DVoxel(ctx, -7, 0, 13, 3.2, 3.2, 7, jerseyColor);
      draw3DVoxel(ctx, 7, 0, 13, 3.2, 3.2, 7, jerseyColor);
    }

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
      drawEllipse(ctx, dx, dy + 1, 3.2, 2.2, 'rgba(0, 0, 0, 0.45)');
      // Regulation white disc
      drawEllipse(ctx, dx, dy, 3.0, 2.2, '#ffffff', '#0f172a', 1.0);
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
   * Draw Realistic Stadium Crowd Stands & Tiered Spectators along the 80m boundary (matching Reference Screenshot):
   * White boundary rope, green grass run-off apron, cyan glowing LED advertising ribbon with white sponsor logos & tunnel gate,
   * Tier 1 lower seating bowl divided by bright yellow aisle staircases with horizontal ladder rungs,
   * concourse promenade deck with double safety railings, Tier 2 upper grandstand, and packed colorful spectators!
   */
  drawStadiumCrowdStands(ctx, cx, cy, boundaryRadius, width, height, crowdState = {}) {
    ctx.save();
    const isCheering = crowdState.isCheering || crowdState.isRocketSix;
    const landing = crowdState.sixLanding || null;
    const now = Date.now();

    // 1. Boundary Rope (Crisp white curved boundary line matching screenshot)
    ctx.beginPath();
    ctx.arc(cx, cy, boundaryRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // 2. Green Turf Run-Off Margin behind boundary rope
    ctx.beginPath();
    ctx.arc(cx, cy, boundaryRadius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = '#225325';
    ctx.lineWidth = 10;
    ctx.stroke();

    // 3. Electronic LED Advertising Ribbon Board (Curved Cyan/Blue glow with Sponsor Logos)
    // Board Base Ribbon
    ctx.beginPath();
    ctx.arc(cx, cy, boundaryRadius + 14, 0, Math.PI * 2);
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Glowing Cyan Top Edge (Signature illuminated board rim seen in screenshot)
    ctx.beginPath();
    ctx.arc(cx, cy, boundaryRadius + 11.5, 0, Math.PI * 2);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // White Illuminated Electronic Sponsor Logos & Brand Boxes spaced along the LED ribbon
    const numSponsorBanners = 36;
    for (let b = 0; b < numSponsorBanners; b++) {
      const bAngle = (b / numSponsorBanners) * Math.PI * 2 + (now * 0.0003);
      const bx = cx + Math.cos(bAngle) * (boundaryRadius + 14);
      const by = cy + Math.sin(bAngle) * (boundaryRadius + 14);

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(bAngle + Math.PI / 2);
      if (b % 4 === 0) {
        // White logo block
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-8, -2, 16, 4);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-6, -1.2, 12, 2.4);
      } else if (b % 4 === 2) {
        // Glowing cyan pill banner
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-9, -2, 18, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-7, -1, 14, 2);
      }
      ctx.restore();
    }

    // White Tunnel Entrance Gate cutout on the boundary (seen in screenshot!)
    const gateAngle = Math.PI * 0.98;
    const gx = cx + Math.cos(gateAngle) * (boundaryRadius + 13);
    const gy = cy + Math.sin(gateAngle) * (boundaryRadius + 13);
    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate(gateAngle + Math.PI / 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-10, -3.5, 20, 7);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-8, -2.5, 16, 5);
    ctx.restore();

    // 4. Stadium Grandstand Dimensions
    const r1_in = boundaryRadius + 18;
    const r1_out = boundaryRadius + 96;
    const r_conc_in = boundaryRadius + 96;
    const r_conc_out = boundaryRadius + 118;
    const r2_in = boundaryRadius + 118;
    const r2_out = boundaryRadius + 230;

    // TIER 1 (Lower Grandstand) Base Concrete Bowl
    ctx.beginPath();
    ctx.arc(cx, cy, (r1_in + r1_out) / 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#141e2e';
    ctx.lineWidth = r1_out - r1_in;
    ctx.stroke();

    // CONCOURSE PROMENADE (Between Tier 1 & Tier 2)
    ctx.beginPath();
    ctx.arc(cx, cy, (r_conc_in + r_conc_out) / 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = r_conc_out - r_conc_in;
    ctx.stroke();

    // Inner Safety Steel Handrail on Concourse
    ctx.beginPath();
    ctx.arc(cx, cy, r_conc_in + 1, 0, Math.PI * 2);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Outer Safety Steel Handrail on Concourse
    ctx.beginPath();
    ctx.arc(cx, cy, r_conc_out - 1, 0, Math.PI * 2);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // TIER 2 (Upper Grandstand) Base Concrete Bowl
    ctx.beginPath();
    ctx.arc(cx, cy, (r2_in + r2_out) / 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#0d1522';
    ctx.lineWidth = r2_out - r2_in;
    ctx.stroke();

    // 5. BRIGHT YELLOW AISLE STAIRCASES (The defining signature visual in screenshot!)
    // 20 Gangways / Staircases dividing Tier 1 & Tier 2 into neat bays
    const numAisles = 20;
    const dTheta = 0.034; // ~1.95 degrees wide aisle

    for (let a = 0; a < numAisles; a++) {
      const aisleAngle = (a / numAisles) * Math.PI * 2;

      // Draw Tier 1 Yellow Staircase (r1_in to r1_out)
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.3;

      // Side rail 1
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(aisleAngle - dTheta / 2) * r1_in, cy + Math.sin(aisleAngle - dTheta / 2) * r1_in);
      ctx.lineTo(cx + Math.cos(aisleAngle - dTheta / 2) * (r1_out - 2), cy + Math.sin(aisleAngle - dTheta / 2) * (r1_out - 2));
      ctx.stroke();

      // Side rail 2
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(aisleAngle + dTheta / 2) * r1_in, cy + Math.sin(aisleAngle + dTheta / 2) * r1_in);
      ctx.lineTo(cx + Math.cos(aisleAngle + dTheta / 2) * (r1_out - 2), cy + Math.sin(aisleAngle + dTheta / 2) * (r1_out - 2));
      ctx.stroke();

      // Horizontal yellow ladder step rungs spaced every 6.5px radially!
      for (let r = r1_in + 4; r < r1_out - 2; r += 6.5) {
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(aisleAngle - dTheta / 2) * r, cy + Math.sin(aisleAngle - dTheta / 2) * r);
        ctx.lineTo(cx + Math.cos(aisleAngle + dTheta / 2) * r, cy + Math.sin(aisleAngle + dTheta / 2) * r);
        ctx.stroke();
      }

      // Draw Tier 2 Yellow Staircase (r2_in to r2_out)
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(aisleAngle - dTheta / 2) * (r2_in + 2), cy + Math.sin(aisleAngle - dTheta / 2) * (r2_in + 2));
      ctx.lineTo(cx + Math.cos(aisleAngle - dTheta / 2) * r2_out, cy + Math.sin(aisleAngle - dTheta / 2) * r2_out);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(aisleAngle + dTheta / 2) * (r2_in + 2), cy + Math.sin(aisleAngle + dTheta / 2) * (r2_in + 2));
      ctx.lineTo(cx + Math.cos(aisleAngle + dTheta / 2) * r2_out, cy + Math.sin(aisleAngle + dTheta / 2) * r2_out);
      ctx.stroke();

      for (let r = r2_in + 5; r < r2_out - 4; r += 7.0) {
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(aisleAngle - dTheta / 2) * r, cy + Math.sin(aisleAngle - dTheta / 2) * r);
        ctx.lineTo(cx + Math.cos(aisleAngle + dTheta / 2) * r, cy + Math.sin(aisleAngle + dTheta / 2) * r);
        ctx.stroke();
      }
    }

    // 6. PACKED COLORFUL SPECTATORS IN SEATING BAYS
    // Vibrant shirt palette matching Reference Screenshot: Royal Blue, Red, Yellow, White, Green, Orange
    const jerseyColors = ['#2563eb', '#dc2626', '#f59e0b', '#ffffff', '#16a34a', '#ea580c', '#38bdf8', '#ef4444'];
    const skinTones = ['#f5d0b0', '#e0a980', '#c68656', '#b57948'];

    // Rows for Tier 1
    const tier1Rows = [
      boundaryRadius + 24,
      boundaryRadius + 32,
      boundaryRadius + 40,
      boundaryRadius + 48,
      boundaryRadius + 56,
      boundaryRadius + 64,
      boundaryRadius + 72,
      boundaryRadius + 80,
      boundaryRadius + 88
    ];

    // Rows for Tier 2
    const tier2Rows = [
      boundaryRadius + 125,
      boundaryRadius + 134,
      boundaryRadius + 143,
      boundaryRadius + 152,
      boundaryRadius + 162,
      boundaryRadius + 172,
      boundaryRadius + 182,
      boundaryRadius + 193,
      boundaryRadius + 204,
      boundaryRadius + 215
    ];

    const drawSpectatorRows = (rows, isUpper = false) => {
      const bayAngleSpan = (Math.PI * 2 / numAisles) - dTheta - 0.024;

      rows.forEach((rowDist, rowIdx) => {
        // Draw concrete seating bench line
        ctx.beginPath();
        ctx.arc(cx, cy, rowDist, 0, Math.PI * 2);
        ctx.strokeStyle = isUpper ? '#162235' : '#1c283c';
        ctx.lineWidth = 6.8;
        ctx.stroke();

        // Render spectators in each bay along this row
        for (let a = 0; a < numAisles; a++) {
          const aisleCenter = (a / numAisles) * Math.PI * 2;
          const bayStart = aisleCenter + dTheta / 2 + 0.012;
          const numSeats = Math.floor((rowDist * bayAngleSpan) / 6.2);

          for (let s = 0; s < numSeats; s++) {
            const seatAngle = bayStart + (s + 0.5) * (bayAngleSpan / numSeats);
            let sx = cx + Math.cos(seatAngle) * rowDist;
            let sy = cy + Math.sin(seatAngle) * rowDist;

            // Ball landing in this bay reaction:
            let isNearLanding = false;
            if (landing && landing.active) {
              const dToLanding = Math.hypot(sx - landing.x, sy - landing.y);
              if (dToLanding < 75) {
                isNearLanding = true;
                const scatter = Math.atan2(sy - landing.y, sx - landing.x);
                sx += Math.cos(scatter) * 6;
                sy += Math.sin(scatter) * 6 - 3;
              }
            }

            // Cheering jump offset
            if (isCheering || isNearLanding) {
              const jumpOffset = Math.abs(Math.sin(now * 0.014 + a * 1.5 + s * 0.6)) * 4.5;
              sy -= jumpOffset;
            }

            // Spectator Shirt (Circular colorful dots as seen in screenshot)
            const colorIdx = (a * 17 + rowIdx * 5 + s * 3) % jerseyColors.length;
            ctx.fillStyle = isNearLanding ? '#fef08a' : jerseyColors[colorIdx];
            ctx.beginPath();
            ctx.arc(sx, sy, 2.7, 0, Math.PI * 2);
            ctx.fill();

            // Spectator Head
            const skinIdx = (a * 7 + s * 2) % skinTones.length;
            ctx.fillStyle = skinTones[skinIdx];
            ctx.beginPath();
            ctx.arc(sx, sy - 2.1, 1.6, 0, Math.PI * 2);
            ctx.fill();

            // Cheering raised arms or "6" placards
            if (isCheering || isNearLanding) {
              if (s % 5 === 0) {
                // Cheering arms raised up
                ctx.strokeStyle = skinTones[skinIdx];
                ctx.lineWidth = 1.1;
                ctx.beginPath();
                ctx.moveTo(sx - 2.2, sy); ctx.lineTo(sx - 4.5, sy - 5.5);
                ctx.moveTo(sx + 2.2, sy); ctx.lineTo(sx + 4.5, sy - 5.5);
                ctx.stroke();
              } else if (s % 9 === 0) {
                // Golden "6" placard held high
                ctx.fillStyle = '#facc15';
                ctx.fillRect(sx - 4, sy - 10, 8, 5.5);
                ctx.fillStyle = '#0f172a';
                ctx.font = 'bold 5px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('6', sx, sy - 6);
              }
            }

            // Random camera flashes in packed crowd during a boundary six
            if (isCheering ? Math.random() < 0.035 : Math.random() < 0.005) {
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(sx, sy - 1, 3.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      });
    };

    drawSpectatorRows(tier1Rows, false);
    drawSpectatorRows(tier2Rows, true);

    // 7. Corner Stadium Floodlight Towers
    const floodlightAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
    floodlightAngles.forEach(fAngle => {
      const flDist = boundaryRadius + 245;
      const flX = cx + Math.cos(fAngle) * flDist;
      const flY = cy + Math.sin(fAngle) * flDist;

      // Steel lattice base
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(flX - 12, flY - 12, 24, 24, 4);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glowing Lamp Bank
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 10;
      for (let lx = -7; lx <= 7; lx += 7) {
        for (let ly = -7; ly <= 7; ly += 7) {
          ctx.beginPath();
          ctx.arc(flX + lx, flY + ly, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
    });

    // 8. Ball Landing Impact Shockwave in the Stands
    if (landing && landing.active) {
      const lx = landing.x;
      const ly = landing.y;

      ctx.beginPath();
      ctx.arc(lx, ly, 22 + Math.sin(now * 0.015) * 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.9)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(lx, ly, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '900 12px "Inter", sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 8;
      ctx.fillText('🚀 CROWD CATCH IN THE STANDS!', lx, ly - 24);
    }

    ctx.restore();
  }
};
