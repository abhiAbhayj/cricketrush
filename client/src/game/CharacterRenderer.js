// ============================================================================
// CRICKET RUSH - Clean Vector-Arcade Character & Stadium Presentation Engine
// Authentic Chibi/Vector Characters matching Reference: Striker Batsman,
// Bowler with High-Arm Action & Afro Hair, Wicket-Keeper, Non-Striker,
// Runners, Fielders, 80-Meter Stadium Crowd Stands & Regulation 30-Yard Circle
// ============================================================================

/**
 * Helper to draw clean rounded rectangles with stroke
 */
function drawRoundRect(ctx, x, y, w, h, radius, fill, stroke = null, lineWidth = 1.5) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
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
 * Helper to draw clean ellipses with stroke
 */
function drawEllipse(ctx, cx, cy, rx, ry, fill, stroke = null, lineWidth = 1.5) {
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
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
 * Helper to draw an authentic cricket batting pad with knee roll & straps
 */
function drawBattingPad(ctx, x, y) {
  // Pad Body: Clean white rounded shin guard with subtle 3D shading
  drawRoundRect(ctx, x, y, 7.5, 14, 3, '#f8fafc', '#0f172a', 1.4);
  // Edge shadow for curved 3D shin roll
  drawRoundRect(ctx, x + 5.2, y + 1, 1.4, 12, 1, '#cbd5e1');
  // Horizontal Knee Roll: rounded pill bulge across knee
  drawRoundRect(ctx, x - 0.5, y + 3.5, 8.5, 3.2, 1.6, '#f1f5f9', '#94a3b8', 1.0);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 1, y + 4.2, 5.5, 1);
  // Blue Pad Straps (team color accents)
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x, y + 8.5); ctx.lineTo(x + 7.5, y + 8.5);
  ctx.moveTo(x, y + 11.5); ctx.lineTo(x + 7.5, y + 11.5);
  ctx.stroke();
  // Cricket Shoe / Spikes underneath
  drawRoundRect(ctx, x - 0.5, y + 13.5, 8.5, 3.5, 1.5, '#0f172a');
  drawRoundRect(ctx, x - 0.5, y + 15.5, 8.5, 1.5, 1, '#ffffff');
}

export const CharacterRenderer = {
  /**
   * Draw Striker Batsman in Vector-Arcade style (matching Reference Screenshot):
   * White rounded batting helmet with black visor rim & grille, royal blue jersey,
   * white batting gloves, red rubber grip on bat, white batting pads with knee rolls.
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
    skinTone = '#f5d0b0'
  }) {
    ctx.save();

    const visualX = Math.round(x + (isSwinging ? 0 : weightShiftX));
    const visualY = Math.round(y - (isSteppingOut ? stepOutOffset : 0));
    ctx.translate(visualX, visualY);

    if (isLeftHanded) {
      ctx.scale(-1, 1);
    }

    // 1. Soft Ground Shadow
    drawEllipse(ctx, 0, 13, 14, 5.5, 'rgba(0, 0, 0, 0.38)');

    // 2. Batting Leg Pads & Spikes (Rounded white pads with knee rolls & blue straps)
    let leftPadX = -7.5;
    let rightPadX = 2.5;
    let leftPadY = 1;
    let rightPadY = 3;

    if (isSteppingOut) {
      leftPadY = -7;
      rightPadY = 7;
    } else if (shotStyle === 'pull') {
      leftPadX = -11;
      rightPadX = 3.5;
    } else if (!isSwinging) {
      leftPadY += triggerTap * 0.4;
    }

    // Left Batting Pad (Front foot)
    drawBattingPad(ctx, leftPadX, leftPadY);

    // Right Batting Pad (Back foot)
    drawBattingPad(ctx, rightPadX, rightPadY);

    // 3. Torso in Royal Blue Team Jersey
    ctx.save();
    let bodyRotation = 0;
    if (shotStyle === 'pull') bodyRotation = 0.42;
    else if (shotStyle === 'cover_drive') bodyRotation = -0.35;
    else if (shotStyle === 'square_cut') bodyRotation = -0.45;
    else if (shotStyle === 'sweep') bodyRotation = 0.50;
    ctx.rotate(bodyRotation);

    // Jersey shape
    drawRoundRect(ctx, -8.5, -9, 17, 13, 4, jerseyColor, '#0f172a', 1.5);
    // Darker royal blue side shading
    drawRoundRect(ctx, 6, -8, 2, 11, 1, '#1e40af');
    drawRoundRect(ctx, -8, -8, 2, 11, 1, '#1e40af');
    // White V-collar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-3.5, -9);
    ctx.lineTo(0, -5);
    ctx.lineTo(3.5, -9);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 4. White Batting Helmet (EXACT rounded dome with black visor from screenshot!)
    ctx.save();
    const headY = -17;
    // Neck
    drawRoundRect(ctx, -2.5, headY + 8, 5, 3.5, 1.5, skinTone, '#0f172a', 1.2);

    // Rounded White Helmet Dome
    drawEllipse(ctx, 0, headY + 3, 7.5, 7.0, '#ffffff', '#0f172a', 1.6);
    // Subtle lower bevel contour
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, headY + 3, 6.2, 0, Math.PI);
    ctx.stroke();

    // Curved Black Helmet Visor / Peak extending forward towards bowler!
    drawRoundRect(ctx, -5.5, headY - 1, 11, 3.5, 1.5, '#0f172a', null);
    // Steel grille / ear guard bars
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-3.5, headY + 3.5); ctx.lineTo(-3.5, headY + 8.5);
    ctx.moveTo(-1.2, headY + 4.0); ctx.lineTo(-1.2, headY + 8.5);
    ctx.moveTo(1.2, headY + 4.0); ctx.lineTo(1.2, headY + 8.5);
    ctx.moveTo(3.5, headY + 3.5); ctx.lineTo(3.5, headY + 8.5);
    ctx.moveTo(-4, headY + 8.5); ctx.lineTo(4, headY + 8.5);
    ctx.stroke();

    // Face Window underneath visor
    ctx.fillStyle = skinTone;
    ctx.fillRect(-3.5, headY + 3, 7, 3);
    // Dark focused eyes looking at bowler
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-2.5, headY + 3.5, 1.6, 1.6);
    ctx.fillRect(1.0, headY + 3.5, 1.6, 1.6);
    ctx.restore();

    // 5. Arms, White Batting Gloves & Cricket Bat
    ctx.save();
    let reachX = 3.5;
    let reachY = 2;
    let batAngle = 0.15;

    if (isSwinging) {
      const swingRatio = Math.sin(swingProgress * Math.PI);
      if (shotStyle === 'cover_drive') {
        reachX = 3.5 - swingRatio * 9;
        reachY = 2 - swingRatio * 13;
        batAngle = 0.2 - swingRatio * 2.8;
      } else if (shotStyle === 'square_cut') {
        reachX = 3.5 + swingRatio * 9;
        reachY = 2 - swingRatio * 8;
        batAngle = -0.45 - swingRatio * 1.8;
      } else if (shotStyle === 'pull' || shotStyle === 'hook') {
        reachX = 3.5 + swingRatio * 6;
        reachY = 2 - swingRatio * 8;
        batAngle = 0.1 + swingRatio * 2.8;
      } else if (shotStyle === 'sweep' || shotStyle === 'paddle_sweep') {
        reachX = -3 - swingRatio * 7;
        reachY = 2 - swingRatio * 8;
        batAngle = 0.35 + swingRatio * 2.2;
      } else if (shotStyle === 'late_cut') {
        reachX = 3.5 + swingRatio * 6;
        reachY = 2 - swingRatio * 4;
        batAngle = -0.35 - swingRatio * 1.5;
      } else if (shotStyle === 'scoop') {
        reachX = 2;
        reachY = 0 - swingRatio * 6;
        batAngle = 0.2 - swingRatio * 1.6;
      } else if (shotStyle === 'step_out') {
        reachX = 2;
        reachY = 2 - swingRatio * 16;
        batAngle = 0.15 - swingRatio * 3.4;
      } else {
        reachX = 3.5 - swingRatio * 3;
        reachY = 2 - swingRatio * 14;
        batAngle = 0.15 - swingRatio * 3.3;
      }
    } else {
      reachX = 3;
      reachY = 2 + triggerTap * 0.4;
      batAngle = 0.12 + triggerTap * 0.08;
    }

    // Arms in blue jersey sleeves & skin forearms
    ctx.strokeStyle = jerseyColor;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
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

    // White Batting Gloves with dark padded grip
    drawRoundRect(ctx, reachX - 4.5, reachY - 4.5, 5, 5, 2, '#f8fafc', '#0f172a', 1.2);
    drawRoundRect(ctx, reachX - 0.5, reachY - 1.5, 5, 5, 2, '#f8fafc', '#0f172a', 1.2);

    // Cricket Bat with Red Handle Grip & Willow Blade
    ctx.translate(reachX, reachY);
    ctx.rotate(batAngle);

    // Red Rubber Handle Grip (bright red matching screenshot!)
    drawRoundRect(ctx, -1.8, -12, 3.6, 12, 1.5, '#dc2626', '#0f172a', 1.2);
    // White wrap highlights on grip
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-1.5, -9); ctx.lineTo(1.5, -9);
    ctx.moveTo(-1.5, -6); ctx.lineTo(1.5, -6);
    ctx.moveTo(-1.5, -3); ctx.lineTo(1.5, -3);
    ctx.stroke();
    // White pommel top cap
    drawRoundRect(ctx, -2.2, -13, 4.4, 1.8, 1, '#ffffff', '#0f172a', 1.0);

    // Willow Blade with Sweet Spot Contour
    drawRoundRect(ctx, -4.0, 0, 8.0, 22, 2.5, '#e5b072', '#92400e', 1.4);
    // Sweet spot wider contour
    drawRoundRect(ctx, -4.8, 7, 9.6, 9, 2.5, '#deb887', '#92400e', 1.2);
    // Center spine contour line
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, 2); ctx.lineTo(0, 20);
    ctx.stroke();
    // Manufacturer sticker
    drawRoundRect(ctx, -2.5, 4, 5, 4, 1, '#2563eb', '#ffffff', 0.8);
    // Rubber toe guard
    drawRoundRect(ctx, -4.0, 21.5, 8.0, 2.0, 1, '#0f172a');

    ctx.restore();
    ctx.restore();
  },

  /**
   * Draw Bowler with High-Arm Action & Stylized Afro Hair (matching Reference Screenshot):
   * Dark curly afro / pompadour hair, royal blue jersey, royal blue trousers with
   * crisp white outer racing stripes, dark athletic shoes, high-arm overhead delivery & follow-through!
   */
  drawBowler(ctx, x, y, {
    runUpProgress = 0,
    bowlingArmAngle = 0,
    followThroughProgress = 0,
    actionType = 'high_arm',
    armSide = 'right',
    skinTone = '#c68656',
    faceStyle = 'afro',
    jerseyColor = '#2563eb'
  }) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // 1. Soft Ground Shadow
    drawEllipse(ctx, 0, 12, 13, 5, 'rgba(0, 0, 0, 0.38)');

    // 2. Athletic Stride & Trousers
    // In screenshot: Royal blue trousers with crisp white vertical stripes down both outer leg seams!
    const isRunning = runUpProgress > 0 && runUpProgress < 1.0;
    const stride = isRunning ? Math.sin(runUpProgress * Math.PI * 8) * 5.5 : 0;
    const isFollowingThrough = followThroughProgress > 0;
    const leanY = isFollowingThrough ? followThroughProgress * 3 : 0;

    // Left Leg
    ctx.save();
    const leftLegY = 2 - stride + leanY;
    drawRoundRect(ctx, -7, leftLegY, 6, 12, 3, '#1d4ed8', '#0f172a', 1.4);
    // White racing stripe on outer seam of left leg
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-6.2, leftLegY + 1);
    ctx.lineTo(-6.2, leftLegY + 11);
    ctx.stroke();
    // Dark athletic shoe with white sole
    drawRoundRect(ctx, -7.5, leftLegY + 10.5, 7, 3.5, 1.5, '#0f172a');
    drawRoundRect(ctx, -7.5, leftLegY + 12.5, 7, 1.5, 1, '#ffffff');
    ctx.restore();

    // Right Leg
    ctx.save();
    const rightLegY = 2 + stride + leanY * 0.5;
    drawRoundRect(ctx, 1.5, rightLegY, 6, 12, 3, '#1d4ed8', '#0f172a', 1.4);
    // White racing stripe on outer seam of right leg
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(6.8, rightLegY + 1);
    ctx.lineTo(6.8, rightLegY + 11);
    ctx.stroke();
    // Dark athletic shoe with white sole
    drawRoundRect(ctx, 1, rightLegY + 10.5, 7, 3.5, 1.5, '#0f172a');
    drawRoundRect(ctx, 1, rightLegY + 12.5, 7, 1.5, 1, '#ffffff');
    ctx.restore();

    // 3. Royal Blue Jersey Torso
    ctx.save();
    const torsoY = -8 + leanY;
    // Torso block with rounded shoulders
    drawRoundRect(ctx, -8.5, torsoY, 17, 13, 4, jerseyColor, '#0f172a', 1.5);
    // Darker shading on flanks for roundness
    drawRoundRect(ctx, 6, torsoY + 1, 2, 11, 1, '#1e40af');
    drawRoundRect(ctx, -8, torsoY + 1, 2, 11, 1, '#1e40af');
    // Crisp white V-neck collar & shoulder trim
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-3.5, torsoY);
    ctx.lineTo(0, torsoY + 4);
    ctx.lineTo(3.5, torsoY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 4. Head, Face & Stylized Afro/Pompadour Hair (EXACTLY matching screenshot!)
    ctx.save();
    const headY = -16 + leanY;
    // Neck
    drawRoundRect(ctx, -2.5, headY + 7, 5, 3.5, 1.5, skinTone, '#0f172a', 1.2);

    // Rounded Head/Face
    drawEllipse(ctx, 0, headY + 3.5, 6.2, 5.5, skinTone, '#0f172a', 1.5);

    // Focused Eyes & Brows looking down towards batsman
    ctx.fillStyle = '#0f172a';
    // Left eye & eyebrow
    ctx.fillRect(-3.2, headY + 2.8, 2, 1.6);
    ctx.fillRect(-3.4, headY + 1.8, 2.4, 0.8);
    // Right eye & eyebrow
    ctx.fillRect(1.2, headY + 2.8, 2, 1.6);
    ctx.fillRect(1.0, headY + 1.8, 2.4, 0.8);

    // Afro / Curly Pompadour Hair (Puffy overlapping lobes matching Image!)
    ctx.fillStyle = '#1e1b18';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    // Overlapping cloud curls
    const hairLobes = [
      { x: -5.5, y: headY - 1, r: 4.2 },
      { x: -3.0, y: headY - 4.5, r: 4.8 },
      { x: 1.0, y: headY - 5.0, r: 5.0 },
      { x: 4.5, y: headY - 3.5, r: 4.6 },
      { x: 6.0, y: headY - 0.5, r: 4.0 },
      { x: 0, y: headY - 1.5, r: 5.5 }
    ];
    hairLobes.forEach(l => {
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    // Subtle curl highlights for 3D depth
    ctx.fillStyle = '#3a322d';
    hairLobes.forEach(l => {
      ctx.beginPath();
      ctx.arc(l.x - 1, l.y - 1, l.r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // 5. High-Arm Bowling Action & Non-Bowling Arm
    // Non-Bowling Arm (Left Arm):
    ctx.save();
    ctx.strokeStyle = jerseyColor;
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (isRunning && runUpProgress > 0.65) {
      // Reaching high to guide delivery, then tucking down to chest
      const guideProgress = (runUpProgress - 0.65) / 0.35;
      const guideArmY = -4 - Math.sin(guideProgress * Math.PI) * 10;
      ctx.moveTo(-7, -4 + leanY);
      ctx.lineTo(-11, guideArmY + leanY);
    } else {
      // Arm tucked into chest / follow-through
      ctx.moveTo(-7, -4 + leanY);
      ctx.lineTo(-4, 2 + leanY);
    }
    ctx.stroke();
    ctx.restore();

    // Bowling Arm (Right Arm) with High-Arm Windmill & Follow-Through:
    ctx.save();
    const shoulderX = 7.5;
    const shoulderY = -5 + leanY;
    ctx.translate(shoulderX, shoulderY);

    let effectiveAngle = 0;
    if (isFollowingThrough) {
      // Follow-through: arm sweeps down across the body towards left hip!
      effectiveAngle = Math.PI * 0.35 + followThroughProgress * Math.PI * 0.45;
    } else if (isRunning) {
      if (runUpProgress < 0.65) {
        effectiveAngle = Math.sin(runUpProgress * Math.PI * 8) * 0.4;
      } else {
        // Overhead high-arm windmill wind-up arc!
        const windRatio = (runUpProgress - 0.65) / 0.35;
        // Sweeps backwards and up to -PI (vertical 12 o'clock overhead!)
        effectiveAngle = -Math.PI * (0.2 + windRatio * 0.8);
      }
    } else {
      effectiveAngle = bowlingArmAngle || 0;
    }

    ctx.rotate(effectiveAngle);

    // Upper arm in royal blue sleeve
    ctx.strokeStyle = jerseyColor;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -7);
    ctx.stroke();

    // Forearm in skin tone
    ctx.strokeStyle = skinTone;
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(0, -15);
    ctx.stroke();

    // Bowling hand holding cricket ball with white seam during run-up!
    if (isRunning && runUpProgress < 1.0) {
      drawEllipse(ctx, 0, -17.5, 3.2, 3.2, '#dc2626', '#0f172a', 1.0);
      // White stitched seam
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(-2.5, -17.5);
      ctx.lineTo(2.5, -17.5);
      ctx.stroke();
    } else {
      // Open hand in follow-through
      drawEllipse(ctx, 0, -16, 2.2, 2.2, skinTone);
    }

    ctx.restore();
    ctx.restore();
  },

  /**
   * Draw Wicket-Keeper in crouching stance directly behind stumps (matching Reference Screenshot)
   */
  drawWicketKeeper(ctx, x, y, { skinTone = '#f5d0b0', isStumping = false } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // Ground Shadow
    drawEllipse(ctx, 0, 12, 14, 5.5, 'rgba(0, 0, 0, 0.38)');

    // Crouched Bent Legs & White Keeper Pads
    drawBattingPad(ctx, -9.0, 0);
    drawBattingPad(ctx, 2.0, 0);

    // Torso in Royal Blue Keeper Jersey
    const torsoY = isStumping ? -14 : -9;
    drawRoundRect(ctx, -8.5, torsoY, 17, 12, 3.5, '#2563eb', '#0f172a', 1.5);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-3, torsoY); ctx.lineTo(0, torsoY + 3); ctx.lineTo(3, torsoY);
    ctx.closePath();
    ctx.fill();

    // White Helmet & Visor
    const headY = isStumping ? -19 : -14;
    drawEllipse(ctx, 0, headY + 3, 7.2, 6.8, '#ffffff', '#0f172a', 1.5);
    drawRoundRect(ctx, -5.5, headY - 1, 11, 3.2, 1.5, '#0f172a');
    ctx.fillStyle = skinTone;
    ctx.fillRect(-3.5, headY + 3, 7, 2.5);

    // Wicket-Keeping Gloves with Royal Blue & Yellow Webbing
    const gloveY = isStumping ? -22 : -11;
    // Left Glove
    drawRoundRect(ctx, -13, gloveY, 6.5, 6, 2, '#1d4ed8', '#0f172a', 1.2);
    drawRoundRect(ctx, -14, gloveY + 1.5, 2.5, 3.5, 1, '#f59e0b');
    // Right Glove (reaching forward on stumping)
    const rGloveX = isStumping ? 1 : 7;
    drawRoundRect(ctx, rGloveX, gloveY, 6.5, 6, 2, '#1d4ed8', '#0f172a', 1.2);
    drawRoundRect(ctx, rGloveX + 4.5, gloveY + 1.5, 2.5, 3.5, 1, '#f59e0b');

    ctx.restore();
  },

  /**
   * Draw Non-Striker Batsman standing on left side of bowler's end stumps (matching Reference Screenshot)
   */
  drawNonStriker(ctx, x, y, { skinTone = '#f5d0b0' } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // Ground Shadow
    drawEllipse(ctx, 0, 12, 12, 5, 'rgba(0, 0, 0, 0.35)');

    // White Batting Pads
    drawBattingPad(ctx, -6.5, 1);
    drawBattingPad(ctx, 1.5, 2);

    // Royal Blue Jersey Torso
    drawRoundRect(ctx, -8.0, -9, 16, 12, 3.5, '#2563eb', '#0f172a', 1.5);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-3, -9); ctx.lineTo(0, -6); ctx.lineTo(3, -9);
    ctx.closePath();
    ctx.fill();

    // White Batting Helmet
    const headY = -17;
    drawEllipse(ctx, 0, headY + 3, 7.0, 6.5, '#ffffff', '#0f172a', 1.5);
    drawRoundRect(ctx, -5.0, headY - 0.5, 10, 3.2, 1.5, '#0f172a');
    ctx.fillStyle = skinTone;
    ctx.fillRect(-3, headY + 3, 6, 2.5);

    // Grounded Cricket Bat resting on pitch crease
    ctx.save();
    ctx.translate(7.5, -4);
    // Red rubber handle
    drawRoundRect(ctx, -1.2, -6, 2.5, 6, 1, '#dc2626', '#0f172a', 1.0);
    // Willow blade grounded
    drawRoundRect(ctx, -2.5, 0, 5.0, 16, 2, '#e5b072', '#92400e', 1.2);
    ctx.restore();

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
    jerseyColor = '#2563eb',
    skinTone = '#f5d0b0'
  } = {}) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // Sprint lean angle
    const leanAngle = runDirection > 0 ? -0.22 : 0.22;
    ctx.rotate(leanAngle);

    // Ground Shadow
    drawEllipse(ctx, 0, 12, 13, 5, 'rgba(0, 0, 0, 0.38)');

    // Alternating Running Legs with White Batting Pads
    const stride = Math.sin(runProgress * Math.PI * 10) * 6.5;
    drawBattingPad(ctx, -7, 1 - stride);
    drawBattingPad(ctx, 1.5, 1 + stride);

    // Royal Blue Jersey Torso
    drawRoundRect(ctx, -8.5, -9, 17, 12, 3.5, jerseyColor, '#0f172a', 1.5);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-3, -9); ctx.lineTo(0, -6); ctx.lineTo(3, -9);
    ctx.closePath();
    ctx.fill();

    // White Helmet facing sprint direction
    const headY = -16;
    drawEllipse(ctx, 0, headY + 3, 7.2, 6.8, '#ffffff', '#0f172a', 1.5);
    const visorY = runDirection > 0 ? headY - 1 : headY + 4;
    drawRoundRect(ctx, -5.2, visorY, 10.4, 3.2, 1.5, '#0f172a');

    // Arms & Outstretched Bat sliding along the turf!
    ctx.save();
    const batReachY = runDirection > 0 ? (isSliding ? -22 : -16) : (isSliding ? 18 : 12);
    const batAngle = runDirection > 0 ? (isSliding ? -Math.PI / 2 - 0.2 : -Math.PI / 2 + 0.3) : (isSliding ? Math.PI / 2 + 0.2 : Math.PI / 2 - 0.3);

    // Pumping arm
    ctx.strokeStyle = jerseyColor;
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-7, -4);
    ctx.lineTo(-12, stride > 0 ? 4 : -8);
    ctx.stroke();

    // Arm holding bat
    ctx.beginPath();
    ctx.moveTo(7, -4);
    ctx.lineTo(8, batReachY + (runDirection > 0 ? 8 : -8));
    ctx.stroke();

    // Batting Glove
    drawRoundRect(ctx, 6, batReachY + (runDirection > 0 ? 4 : -7), 5, 5, 2, '#f8fafc', '#0f172a', 1.2);

    // Grounded Cricket Bat
    ctx.translate(8, batReachY);
    ctx.rotate(batAngle);
    drawRoundRect(ctx, -1.5, -6, 3, 6, 1, '#dc2626', '#0f172a', 1.0);
    drawRoundRect(ctx, -3.5, 0, 7, 18, 2, '#e5b072', '#92400e', 1.2);
    drawRoundRect(ctx, -3.5, 17, 7, 2, 1, '#0f172a');

    ctx.restore();
    ctx.restore();
  },

  /**
   * Draw Fielder in Vector-Arcade style (alert posture, diving slide, or leaping catch)
   */
  drawFielder(ctx, x, y, role, jerseyColor = '#ef4444', isDiving = false, isCatching = false) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    if (isCatching) {
      // Leaping Catch
      drawEllipse(ctx, 0, 16, 12, 4, 'rgba(0, 0, 0, 0.28)');
      ctx.translate(0, -9);
      // Legs
      drawRoundRect(ctx, -6, 2, 5, 9, 2, '#dc2626', '#0f172a', 1.2);
      drawRoundRect(ctx, 1.5, 2, 5, 9, 2, '#dc2626', '#0f172a', 1.2);
      // Torso
      drawRoundRect(ctx, -8, -8, 16, 12, jerseyColor, '#0f172a', 1.4);
      // Cap & Head
      drawEllipse(ctx, 0, -14, 6, 5.5, '#c68656', '#0f172a', 1.2);
      drawRoundRect(ctx, -5, -17, 10, 3.5, 1.5, '#0f172a');
      // Raised arms catching ball
      ctx.strokeStyle = '#c68656';
      ctx.lineWidth = 3.0;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-5, -4); ctx.lineTo(-2, -18);
      ctx.moveTo(5, -4); ctx.lineTo(2, -18);
      ctx.stroke();
      // White fielding gloves clutching ball
      drawRoundRect(ctx, -3, -20, 3.5, 3.5, 1, '#ffffff', '#0f172a', 1.0);
      drawRoundRect(ctx, 1, -20, 3.5, 3.5, 1, '#ffffff', '#0f172a', 1.0);
      // Cricket ball
      drawEllipse(ctx, 0, -20, 3, 3, '#dc2626', '#0f172a', 1.0);
    } else if (isDiving) {
      // Diving slide
      drawEllipse(ctx, 0, 4, 18, 5, 'rgba(0, 0, 0, 0.35)');
      ctx.rotate(0.32);
      drawRoundRect(ctx, -12, 1, 10, 5, 2, '#dc2626', '#0f172a', 1.2);
      drawRoundRect(ctx, -6, -4, 16, 9, 3, jerseyColor, '#0f172a', 1.4);
      ctx.strokeStyle = '#c68656';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(10, 0); ctx.lineTo(19, -2);
      ctx.stroke();
      drawEllipse(ctx, -10, -7, 5, 5, '#0f172a');
    } else {
      // Upright athletic ready stance
      drawEllipse(ctx, 0, 13, 13, 5, 'rgba(0, 0, 0, 0.35)');
      // Trousers
      drawRoundRect(ctx, -6.5, 2, 5.5, 11, 2.5, '#dc2626', '#0f172a', 1.3);
      drawRoundRect(ctx, 1.5, 2, 5.5, 11, 2.5, '#dc2626', '#0f172a', 1.3);
      // White side stripes
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-5.8, 3); ctx.lineTo(-5.8, 12);
      ctx.moveTo(6.2, 3); ctx.lineTo(6.2, 12);
      ctx.stroke();
      // Shoes
      drawRoundRect(ctx, -6.5, 12, 5.5, 3, 1, '#0f172a');
      drawRoundRect(ctx, 1.5, 12, 5.5, 3, 1, '#0f172a');
      // Jersey
      drawRoundRect(ctx, -8, -8, 16, 12, 3.5, jerseyColor, '#0f172a', 1.4);
      // White collar
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-3, -8); ctx.lineTo(0, -5); ctx.lineTo(3, -8);
      ctx.closePath();
      ctx.fill();
      // Arms
      ctx.strokeStyle = jerseyColor;
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-6, -4); ctx.lineTo(-9, 1);
      ctx.moveTo(6, -4); ctx.lineTo(9, 1);
      ctx.stroke();
      // Head & Dark Cap
      drawEllipse(ctx, 0, -14, 6.2, 5.8, '#c68656', '#0f172a', 1.2);
      drawRoundRect(ctx, -5.5, -18, 11, 4.5, 2, '#0f172a');
      drawRoundRect(ctx, -4.5, -9, 9, 2.5, 1, '#ffffff', '#0f172a', 1.0);
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
