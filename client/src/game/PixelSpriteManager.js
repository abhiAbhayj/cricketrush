// ============================================================================
// CRICKET RUSH - Authentic 16-Bit Pixel Art Sprite Manager
// Loads, caches, dynamically tints, and renders authentic 2D pixel-art sprites
// matching the exact sprite sheet design:
// Batsman Stances, Backlift, Drive, Bowled, High-Arm Bowler, Spinner,
// Wicket-Keeper, Non-Striker, Runners, Diving Fielders & Wicket Celebrations!
// ============================================================================

const SPRITE_DEFS = {
  // Batsman
  batsman_idle: '/sprites/batsman_idle.png',
  batsman_front: '/sprites/batsman_front.png',
  batsman_stance: '/sprites/batsman_stance.png',
  batsman_backlift: '/sprites/batsman_backlift.png',
  batsman_step: '/sprites/batsman_step.png',
  batsman_drive: '/sprites/batsman_drive.png',
  batsman_bowled: '/sprites/batsman_bowled.png',

  // Bowler
  bowler_runup1: '/sprites/bowler_runup1.png',
  bowler_runup2: '/sprites/bowler_runup2.png',
  bowler_gather: '/sprites/bowler_gather.png',
  bowler_higharm: '/sprites/bowler_higharm.png',
  bowler_followthrough: '/sprites/bowler_followthrough.png',
  spinner_twirl: '/sprites/spinner_twirl.png',
  spinner_release: '/sprites/spinner_release.png',

  // Wicket Keeper & Non-Striker
  keeper_front: '/sprites/keeper_front.png',
  keeper_crouch: '/sprites/keeper_crouch.png',
  keeper_catch: '/sprites/keeper_catch.png',
  nonstriker_stance: '/sprites/nonstriker_stance.png',

  // Runners
  runner_stride1: '/sprites/runner_stride1.png',
  runner_stride2: '/sprites/runner_stride2.png',
  runner_slide: '/sprites/runner_slide.png',

  // Fielders & Celebrations
  fielder_crouch: '/sprites/fielder_crouch.png',
  fielder_sprint: '/sprites/fielder_sprint.png',
  fielder_dive: '/sprites/fielder_dive.png',
  fielder_throw: '/sprites/fielder_throw.png',
  celebration_arms_high: '/sprites/celebration_arms_high.png',

  // Equipment
  cricket_ball: '/sprites/cricket_ball.png',
  stumps_set: '/sprites/stumps_set.png',
  stumps_broken: '/sprites/stumps_broken.png',
  ball_trajectory_arc: '/sprites/ball_trajectory_arc.png'
};

class PixelSpriteManagerClass {
  constructor() {
    this.images = {};
    this.loaded = {};
    this.tintCache = new Map();
    this.initPreload();
  }

  initPreload() {
    if (typeof window === 'undefined') return;

    // Determine base URL path (works in both dev and GitHub Pages base subdir)
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;

    Object.entries(SPRITE_DEFS).forEach(([key, relPath]) => {
      const fullPath = `${cleanBase}${relPath}`;
      const img = new Image();
      img.src = fullPath;
      img.onload = () => {
        this.loaded[key] = true;
      };
      this.images[key] = img;
    });
  }

  isLoaded(key) {
    return Boolean(this.loaded[key] && this.images[key]?.complete && this.images[key]?.naturalWidth > 0);
  }

  getImage(key) {
    return this.images[key] || null;
  }

  /**
   * Helper to parse CSS hex or named color to RGB
   */
  parseColor(colorStr) {
    if (!colorStr || colorStr === 'default') return { r: 66, g: 165, b: 245 }; // Default Sky Blue
    if (colorStr.startsWith('#')) {
      const hex = colorStr.replace('#', '');
      if (hex.length === 3) {
        return {
          r: parseInt(hex[0] + hex[0], 16),
          g: parseInt(hex[1] + hex[1], 16),
          b: parseInt(hex[2] + hex[2], 16)
        };
      } else if (hex.length >= 6) {
        return {
          r: parseInt(hex.substring(0, 2), 16),
          g: parseInt(hex.substring(2, 4), 16),
          b: parseInt(hex.substring(4, 6), 16)
        };
      }
    }
    return { r: 66, g: 165, b: 245 };
  }

  /**
   * Generates or fetches a cached recolored sprite where the sky-blue jersey
   * is shifted to the target team's jersey color while preserving shadows and outlines
   */
  getTintedSprite(key, jerseyColor) {
    if (!this.isLoaded(key)) return null;
    const baseImg = this.images[key];
    const cacheKey = `${key}_${jerseyColor}`;

    if (this.tintCache.has(cacheKey)) {
      return this.tintCache.get(cacheKey);
    }

    // Default India / Sky Blue jersey needs no recoloring
    const targetRGB = this.parseColor(jerseyColor);
    const isDefaultBlue = Math.abs(targetRGB.r - 66) < 15 && Math.abs(targetRGB.g - 165) < 15 && Math.abs(targetRGB.b - 245) < 15;
    if (isDefaultBlue) {
      this.tintCache.set(cacheKey, baseImg);
      return baseImg;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = baseImg.naturalWidth;
      canvas.height = baseImg.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(baseImg, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Color tint algorithm:
      // Replace sky-blue jersey pixels (R < 130, B > 165, and B > R + 45) with target team color
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a > 30) {
          // Identify jersey pixels: saturated blue pixels
          const isJerseyBlue = b > 150 && r < 140 && (b - r) > 40;
          if (isJerseyBlue) {
            // Calculate lightness ratio relative to standard sky blue (~190)
            const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 160;
            data[i] = Math.min(255, Math.max(0, Math.round(targetRGB.r * lum)));
            data[i + 1] = Math.min(255, Math.max(0, Math.round(targetRGB.g * lum)));
            data[i + 2] = Math.min(255, Math.max(0, Math.round(targetRGB.b * lum)));
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      this.tintCache.set(cacheKey, canvas);
      return canvas;
    } catch {
      // Fallback to base image if cross-origin or canvas read error occurs
      this.tintCache.set(cacheKey, baseImg);
      return baseImg;
    }
  }

  /**
   * Cleanly draw sprite on canvas with anchor centering and optional horizontal flip
   */
  drawSprite(ctx, key, x, y, {
    scale = 1.0,
    flipX = false,
    anchorX = 0.5,
    anchorY = 0.85,
    rotation = 0,
    jerseyColor = null,
    alpha = 1.0
  } = {}) {
    const sprite = jerseyColor ? this.getTintedSprite(key, jerseyColor) : (this.isLoaded(key) ? this.images[key] : null);
    if (!sprite) return false;

    ctx.save();
    ctx.imageSmoothingEnabled = false; // Authentic crisp 16-bit pixel art rendering!
    ctx.globalAlpha = alpha;
    ctx.translate(Math.round(x), Math.round(y));

    if (rotation !== 0) {
      ctx.rotate(rotation);
    }

    if (flipX) {
      ctx.scale(-1, 1);
    }

    const drawW = Math.round(sprite.width * scale);
    const drawH = Math.round(sprite.height * scale);
    const drawX = Math.round(-drawW * anchorX);
    const drawY = Math.round(-drawH * anchorY);

    ctx.drawImage(sprite, drawX, drawY, drawW, drawH);
    ctx.restore();
    return true;
  }
}

export const PixelSpriteManager = new PixelSpriteManagerClass();
