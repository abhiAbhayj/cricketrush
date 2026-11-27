// ============================================================================
// STADIUMS.JS - 12 World-Class Cricket Stadiums, Authentic Pitch Profiles,
// Dynamic Grass Mowing Patterns, Diverse Architecture & Weather/Time-of-Day Engines
// ============================================================================

export const TIME_OF_DAY_CONFIGS = {
  day: {
    id: 'day',
    label: 'Day / Sunny',
    icon: '☀️',
    badge: 'DAY',
    skyColor: '#38bdf8',
    horizonColor: '#bae6fd',
    ambientOverlay: null,
    shadowAlpha: 0.35,
    shadowDx: 3,
    shadowDy: 6,
    floodlightsActive: false,
    description: 'Crisp bright sunshine with crystal clear outfield visibility and sharp sun shadows.'
  },
  afternoon: {
    id: 'afternoon',
    label: 'Afternoon / Warm Sun',
    icon: '🌤️',
    badge: 'AFTERNOON',
    skyColor: '#fbbf24',
    horizonColor: '#fef3c7',
    ambientOverlay: 'rgba(254, 240, 138, 0.08)',
    shadowAlpha: 0.38,
    shadowDx: 6,
    shadowDy: 8,
    floodlightsActive: false,
    description: 'Warm golden afternoon angle casting elongated shadows and gentle sunlight glow.'
  },
  sunset: {
    id: 'sunset',
    label: 'Sunset / Golden Hour',
    icon: '🌅',
    badge: 'DUSK',
    skyColor: '#ea580c',
    horizonColor: '#fb923c',
    ambientOverlay: 'rgba(245, 158, 11, 0.16)',
    shadowAlpha: 0.44,
    shadowDx: 9,
    shadowDy: 5,
    floodlightsActive: true,
    description: 'Dramatic amber-violet dusk sky as floodlights begin to glow across the outfield.'
  },
  night: {
    id: 'night',
    label: 'Night / Floodlights',
    icon: '🌙',
    badge: 'NIGHT',
    skyColor: '#070b14',
    horizonColor: '#0f172a',
    ambientOverlay: 'rgba(15, 23, 42, 0.22)',
    shadowAlpha: 0.30,
    shadowDx: 0,
    shadowDy: 0,
    floodlightsActive: true,
    quadShadows: true,
    description: 'Electric night atmosphere under 6 towering high-power stadium halogen floodlight towers.'
  }
};

export const WEATHER_CONFIGS = {
  sunny: { id: 'sunny', label: 'Clear & Sunny', icon: '☀️', swingBonus: 0.0, spinBonus: 0.0 },
  overcast: { id: 'overcast', label: 'Overcast & Seaming', icon: '☁️', swingBonus: 0.25, spinBonus: -0.1 },
  golden_hour: { id: 'golden_hour', label: 'Golden Hour Dust', icon: '🌇', swingBonus: 0.05, spinBonus: 0.1 },
  floodlights: { id: 'floodlights', label: 'Under Floodlights', icon: '💡', swingBonus: 0.15, spinBonus: 0.15 }
};

export const STADIUMS = {
  // --------------------------------------------------------------------------
  // 1. THE COLOSSEUM (MELBOURNE MCG) - VAST MEGA STADIUM
  // --------------------------------------------------------------------------
  colosseum: {
    id: 'colosseum',
    name: 'The Colosseum',
    shortName: 'MCG Colosseum',
    location: 'Melbourne',
    country: 'Australia',
    flag: '🇦🇺',
    architecture: 'colosseum',
    grassColor: '#254e20',
    grassStripe: '#2f6029',
    grassPattern: 'stripes', // 'stripes', 'checker', 'concentric'
    pitchColor: '#dfcaa4', // sandy golden Australian drop-in clay
    pitchColorDark: '#cbaf84',
    pitchType: 'bouncy_clay',
    pitchCrease: '#ffffff',
    boundaryRadiusRatio: 1.0, // Vast 85-meter ground
    swingModifier: 1.0,
    spinModifier: 1.0,
    bounceModifier: 1.25,
    paceModifier: 1.2,
    boundaryDistanceDesc: 'Vast Boundaries (85m) - Mega Stadium',
    description: 'Massive iconic bowl with 3-tier grandstands, yellow aisle staircases, and cavernous outfield.',
    defaultTimeOfDay: 'day',
    defaultWeather: 'sunny',
    seatColor1: '#162235',
    seatColor2: '#111b2b',
    canopyColor: '#0f172a',
    ledColor: '#38bdf8'
  },

  // --------------------------------------------------------------------------
  // 2. EDEN GARDENS BLITZ (KOLKATA) - ELECTRIC NIGHT COLOSSEUM
  // --------------------------------------------------------------------------
  eden: {
    id: 'eden',
    name: 'Eden Gardens Blitz',
    shortName: 'Eden Gardens',
    location: 'Kolkata',
    country: 'India',
    flag: '🇮🇳',
    architecture: 'colosseum',
    grassColor: '#144122',
    grassStripe: '#0e3119',
    grassPattern: 'concentric', // Concentric circular mower rings
    pitchColor: '#b45309', // dry spinning clay turner
    pitchColorDark: '#92400e',
    pitchType: 'dusty_turner',
    pitchCrease: '#ffffff',
    boundaryRadiusRatio: 0.96,
    swingModifier: 0.9,
    spinModifier: 1.35, // Lethal sharp spin
    bounceModifier: 0.9,
    paceModifier: 0.95,
    boundaryDistanceDesc: 'Grand Coliseum (80m)',
    description: 'Electric roar of 90,000 fans in packed multi-tier grandstands. A dry subcontinent turner with lethal sharp spin!',
    defaultTimeOfDay: 'night',
    defaultWeather: 'floodlights',
    seatColor1: '#064e3b',
    seatColor2: '#042f2e',
    canopyColor: '#022c22',
    ledColor: '#10b981'
  },

  // --------------------------------------------------------------------------
  // 3. LORD'S PAVILION (LONDON) - HISTORIC RED BRICK & GREEN SEAMER
  // --------------------------------------------------------------------------
  lords: {
    id: 'lords',
    name: "Lord's Pavilion",
    shortName: "Lord's",
    location: 'London',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    architecture: 'historic_pavilion',
    grassColor: '#1c4a25',
    grassStripe: '#15381c',
    grassPattern: 'checker', // Heritage cross-hatch lawn mower diamond pattern
    pitchColor: '#78712a', // lush green-top seaming pitch with grass clippings
    pitchColorDark: '#5a541d',
    pitchType: 'green_seamer',
    pitchCrease: '#ffffff',
    boundaryRadiusRatio: 0.94,
    swingModifier: 1.45, // Heavy English late swing
    spinModifier: 0.85,
    bounceModifier: 1.1,
    paceModifier: 1.15,
    boundaryDistanceDesc: 'Swinging Arena (78m)',
    description: 'The historic home of cricket. Victorian red-brick clocktower pavilion, lush green-top pitch, and deadly late swing.',
    defaultTimeOfDay: 'afternoon',
    defaultWeather: 'overcast',
    seatColor1: '#7f1d1d', // Heritage burgundy red & forest green
    seatColor2: '#14532d',
    canopyColor: '#1e3a1e',
    ledColor: '#fbbf24'
  },

  // --------------------------------------------------------------------------
  // 4. SHARJAH DESERT ARENA (SHARJAH) - DUSK POWER HITTER
  // --------------------------------------------------------------------------
  sharjah: {
    id: 'sharjah',
    name: 'Sharjah Desert Arena',
    shortName: 'Sharjah Arena',
    location: 'Sharjah',
    country: 'UAE',
    flag: '🇦🇪',
    architecture: 'desert_arena',
    grassColor: '#2d4a22',
    grassStripe: '#233d1a',
    grassPattern: 'stripes',
    pitchColor: '#d97706', // sun-baked hard desert clay
    pitchColorDark: '#b45309',
    pitchType: 'desert_hard',
    pitchCrease: '#ffffff',
    boundaryRadiusRatio: 0.88, // Short boundaries (72m)
    swingModifier: 0.8,
    spinModifier: 1.15,
    bounceModifier: 1.0,
    paceModifier: 1.1,
    boundaryDistanceDesc: 'Power-Hitter Arena (72m)',
    description: 'Sun-drenched sandstone colosseum under glowing golden sunset skies. Lightning-fast outfield for massive maximum sixes!',
    defaultTimeOfDay: 'sunset',
    defaultWeather: 'golden_hour',
    seatColor1: '#78350f',
    seatColor2: '#451a03',
    canopyColor: '#7c2d12',
    ledColor: '#f59e0b'
  },

  // --------------------------------------------------------------------------
  // 5. WANKHEDE OCEAN FORTRESS (MUMBAI) - RED SOIL NIGHT SPECTACLE
  // --------------------------------------------------------------------------
  wankhede: {
    id: 'wankhede',
    name: 'Wankhede Ocean Fortress',
    shortName: 'Wankhede Stadium',
    location: 'Mumbai',
    country: 'India',
    flag: '🇮🇳',
    architecture: 'colosseum',
    grassColor: '#1b4332',
    grassStripe: '#2d6a4f',
    grassPattern: 'checker',
    pitchColor: '#9a3412', // authentic Mumbai rich red soil
    pitchColorDark: '#7c2d12',
    pitchType: 'red_soil',
    pitchCrease: '#ffffff',
    boundaryRadiusRatio: 0.90, // 75-meter boundary
    swingModifier: 1.1,
    spinModifier: 1.25,
    bounceModifier: 1.2, // Red soil gives extra steep bounce
    paceModifier: 1.15,
    boundaryDistanceDesc: 'Coastal Arena (75m)',
    description: 'Iconic marine fortress overlooking Arabian Sea. Authentic Mumbai red soil pitch with explosive bounce and roaring crowd!',
    defaultTimeOfDay: 'night',
    defaultWeather: 'floodlights',
    seatColor1: '#1e3a8a', // Blue and gold Marine Drive tiers
    seatColor2: '#1e40af',
    canopyColor: '#172554',
    ledColor: '#60a5fa'
  },

  // --------------------------------------------------------------------------
  // 6. DHARAMSALA MOUNTAIN VISTA (HP) - SNOW-PEAK HIMALAYAN VISTA
  // --------------------------------------------------------------------------
  dharamsala: {
    id: 'dharamsala',
    name: 'Dharamsala Mountain Vista',
    shortName: 'Dharamsala HPCA',
    location: 'Dharamsala',
    country: 'India',
    flag: '🇮🇳',
    architecture: 'mountain_bowl',
    grassColor: '#15803d',
    grassStripe: '#16a34a',
    grassPattern: 'stripes',
    pitchColor: '#854d0e', // cool-climate hard seaming pitch
    pitchColorDark: '#713f12',
    pitchType: 'green_seamer',
    pitchCrease: '#ffffff',
    boundaryRadiusRatio: 0.92,
    swingModifier: 1.35, // High altitude mountain air swing
    spinModifier: 0.95,
    bounceModifier: 1.3,
    paceModifier: 1.25,
    boundaryDistanceDesc: 'Alpine Fortress (76m)',
    description: 'World-renowned stadium nestled beneath towering snow-capped Himalayan peaks. Cool alpine breeze and fiery lively bounce!',
    defaultTimeOfDay: 'day',
    defaultWeather: 'sunny',
    seatColor1: '#b91c1c', // Tibetan red and yellow pavilion colors
    seatColor2: '#b45309',
    canopyColor: '#991b1b',
    ledColor: '#38bdf8'
  },

  // --------------------------------------------------------------------------
  // 7. DUBAI RING OF FIRE (DUBAI) - 360° ILLUMINATED NIGHT DOME
  // --------------------------------------------------------------------------
  dubai: {
    id: 'dubai',
    name: 'Dubai Ring of Fire',
    shortName: 'Dubai Stadium',
    location: 'Dubai',
    country: 'UAE',
    flag: '🇦🇪',
    architecture: 'modern_ring',
    grassColor: '#143c1e',
    grassStripe: '#1b4d27',
    grassPattern: 'concentric',
    pitchColor: '#ca8a04', // compacted true-bounce golden clay
    pitchColorDark: '#a16207',
    pitchType: 'compacted_turf',
    pitchCrease: '#ffffff',
    boundaryRadiusRatio: 0.94,
    swingModifier: 1.05,
    spinModifier: 1.1,
    bounceModifier: 1.15,
    paceModifier: 1.2,
    boundaryDistanceDesc: 'Night Showpiece (78m)',
    description: 'Futuristic architectural spectacle featuring the famous 350-floodlight 360° Ring of Fire roof. Pure batting paradise!',
    defaultTimeOfDay: 'night',
    defaultWeather: 'floodlights',
    seatColor1: '#0f172a',
    seatColor2: '#1e293b',
    canopyColor: '#090d16',
    ledColor: '#facc15'
  },

  // --------------------------------------------------------------------------
  // 8. SYDNEY SCG EMERALD (SYDNEY) - HERITAGE GREEN CLOCKTOWER
  // --------------------------------------------------------------------------
  sydney: {
    id: 'sydney',
    name: 'Sydney SCG Emerald',
    shortName: 'Sydney SCG',
    location: 'Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    architecture: 'historic_pavilion',
    grassColor: '#1e4620',
    grassStripe: '#27592a',
    grassPattern: 'stripes',
    pitchColor: '#b47214', // classic abrasive turning Australian pitch
    pitchColorDark: '#92580a',
    pitchType: 'dusty_turner',
    pitchCrease: '#ffffff',
    boundaryRadiusRatio: 0.95,
    swingModifier: 0.95,
    spinModifier: 1.3,
    bounceModifier: 1.15,
    paceModifier: 1.05,
    boundaryDistanceDesc: 'Historic SCG (79m)',
    description: 'Famous green-roofed Members Pavilion, traditional heritage clocktower, and legendary abrasive Australian spin wicket.',
    defaultTimeOfDay: 'afternoon',
    defaultWeather: 'sunny',
    seatColor1: '#14532d',
    seatColor2: '#064e3b',
    canopyColor: '#166534',
    ledColor: '#4ade80'
  },

  // --------------------------------------------------------------------------
  // 9. KENSINGTON OVAL CARIBBEAN (BARBADOS) - TROPICAL BOUNCE & PALMS
  // --------------------------------------------------------------------------
  barbados: {
    id: 'barbados',
    name: 'Kensington Oval Caribbean',
    shortName: 'Kensington Oval',
    location: 'Bridgetown',
    country: 'West Indies',
    flag: '🌴',
    architecture: 'coastal_fortress',
    grassColor: '#235c2b',
    grassStripe: '#2e7436',
    grassPattern: 'checker',
    pitchColor: '#c28422', // fiery coral limestone bouncy pitch
    pitchColorDark: '#9c6614',
    pitchType: 'bouncy_clay',
    pitchCrease: '#ffffff',
    boundaryRadiusRatio: 0.92,
    swingModifier: 1.1,
    spinModifier: 0.9,
    bounceModifier: 1.35, // High West Indies fiery bounce
    paceModifier: 1.3,
    boundaryDistanceDesc: 'Calypso Ground (76m)',
    description: 'Caribbean sunshine, waving perimeter palms, turquoise stadium seats, and fierce fast-bowler coral bounce!',
    defaultTimeOfDay: 'afternoon',
    defaultWeather: 'sunny',
    seatColor1: '#0e7490', // Turquoise & sunshine gold
    seatColor2: '#eab308',
    canopyColor: '#155e75',
    ledColor: '#38bdf8'
  },

  // --------------------------------------------------------------------------
  // 10. THE OVAL LONDON (SURREY) - METROPOLITAN DUSK CLASSIC
  // --------------------------------------------------------------------------
  the_oval: {
    id: 'the_oval',
    name: 'The Oval London',
    shortName: 'The Oval',
    location: 'London',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    architecture: 'historic_pavilion',
    grassColor: '#1a4321',
    grassStripe: '#22572c',
    grassPattern: 'checker',
    pitchColor: '#cca052', // hard golden compacted loam
    pitchColorDark: '#ad823a',
    pitchType: 'compacted_turf',
    pitchCrease: '#ffffff',
    boundaryRadiusRatio: 0.95,
    swingModifier: 1.15,
    spinModifier: 1.1,
    bounceModifier: 1.1,
    paceModifier: 1.15,
    boundaryDistanceDesc: 'Metropolitan Oval (79m)',
    description: 'Historic British colosseum with the famous gasworks silhouette. Fast true bounce and golden evening sunset atmosphere.',
    defaultTimeOfDay: 'sunset',
    defaultWeather: 'golden_hour',
    seatColor1: '#1e3a8a',
    seatColor2: '#1e293b',
    canopyColor: '#0f172a',
    ledColor: '#f97316'
  },

  // --------------------------------------------------------------------------
  // 11. CENTURION SUPERSPORT PARK (PRETORIA) - HIGHVELD THUNDER
  // --------------------------------------------------------------------------
  centurion: {
    id: 'centurion',
    name: 'Centurion SuperSport Park',
    shortName: 'Centurion Park',
    location: 'Pretoria',
    country: 'South Africa',
    flag: '🇿🇦',
    architecture: 'highveld_park',
    grassColor: '#1f4d22',
    grassStripe: '#28632c',
    grassPattern: 'stripes',
    pitchColor: '#6b6e28', // high-altitude green-tinged fiery seamer
    pitchColorDark: '#52541a',
    pitchType: 'green_seamer',
    pitchCrease: '#ffffff',
    boundaryRadiusRatio: 0.93,
    swingModifier: 1.3,
    spinModifier: 0.8,
    bounceModifier: 1.4, // Extreme Highveld bounce
    paceModifier: 1.35, // Fastest pitch
    boundaryDistanceDesc: 'Highveld Fortress (77m)',
    description: 'Famous open grassy spectator embankments. High altitude thin air delivers blistering pace and steep ferocious bounce!',
    defaultTimeOfDay: 'afternoon',
    defaultWeather: 'overcast',
    seatColor1: '#14532d',
    seatColor2: '#166534',
    canopyColor: '#052e16',
    ledColor: '#22c55e'
  },

  // --------------------------------------------------------------------------
  // 12. GALLE INTERNATIONAL STADIUM (GALLE) - 16TH-CENTURY DUTCH FORT
  // --------------------------------------------------------------------------
  galle: {
    id: 'galle',
    name: 'Galle International Stadium',
    shortName: 'Galle Fort',
    location: 'Galle',
    country: 'Sri Lanka',
    flag: '🇱🇰',
    architecture: 'coastal_fortress',
    grassColor: '#204e28',
    grassStripe: '#2a6534',
    grassPattern: 'concentric',
    pitchColor: '#9c4915', // coastal crumbling dry clay turner
    pitchColorDark: '#7a360d',
    pitchType: 'dusty_turner',
    pitchCrease: '#ffffff',
    boundaryRadiusRatio: 0.90,
    swingModifier: 1.2, // Coastal Indian Ocean sea breeze
    spinModifier: 1.45, // World-renowned spinner minefield
    bounceModifier: 0.85,
    paceModifier: 0.9,
    boundaryDistanceDesc: 'Fortress Turn (74m)',
    description: 'Spectacular UNESCO World Heritage Dutch Fort ramparts backdrop. Coastal sea breeze and ferocious crumbling spin turns!',
    defaultTimeOfDay: 'day',
    defaultWeather: 'sunny',
    seatColor1: '#1e3a8a',
    seatColor2: '#b45309',
    canopyColor: '#172554',
    ledColor: '#38bdf8'
  }
};

/**
 * Helper to get stadium by ID with safe fallback
 */
export function getStadium(stadiumId) {
  if (!stadiumId) return STADIUMS.colosseum;
  const key = String(stadiumId).toLowerCase().trim();
  return STADIUMS[key] || STADIUMS.colosseum;
}

/**
 * List of all stadiums as array for menus & selectors
 */
export const ALL_STADIUMS = Object.values(STADIUMS);
