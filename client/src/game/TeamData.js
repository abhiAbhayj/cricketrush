// TeamData.js - Comprehensive Roster of Latest International & IPL Teams, Authentic Players and Kits

export const ALL_JERSEYS = [
  // ==========================================
  // 1. INTERNATIONAL COUNTRIES (10 TEAMS)
  // ==========================================
  {
    id: 'jersey_ind',
    name: 'India Bleed Blue (T20 WC)',
    category: 'country',
    badge: '🇮🇳',
    code: 'IND',
    color: '#0066b2',
    secondaryColor: '#ff9933',
    pantsColor: '#004c85',
    stripeColor: '#ff9933',
    price: 0,
    desc: 'The iconic deep blue & saffron tricolor kit worn by champions Rohit, Virat & Bumrah.'
  },
  {
    id: 'jersey_aus',
    name: 'Australia Canary Yellow',
    category: 'country',
    badge: '🇦🇺',
    code: 'AUS',
    color: '#ffcd00',
    secondaryColor: '#00573d',
    pantsColor: '#004225',
    stripeColor: '#00573d',
    price: 400,
    desc: 'Electric canary yellow with dark green trim as powered by Travis Head, Cummins & Starc.'
  },
  {
    id: 'jersey_eng',
    name: 'England Three Lions Crimson',
    category: 'country',
    badge: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    code: 'ENG',
    color: '#d0103a',
    secondaryColor: '#00205b',
    pantsColor: '#001a4d',
    stripeColor: '#ffffff',
    price: 400,
    desc: 'Bold crimson red and royal navy match kit of Root, Buttler & Archer.'
  },
  {
    id: 'jersey_pak',
    name: 'Pakistan Shaheen Emerald',
    category: 'country',
    badge: '🇵🇰',
    code: 'PAK',
    color: '#01411c',
    secondaryColor: '#00ff88',
    pantsColor: '#002811',
    stripeColor: '#00ff88',
    price: 350,
    desc: 'Deep emerald green with high-voltage neon mint angles of Babar, Rizwan & Shaheen.'
  },
  {
    id: 'jersey_nz',
    name: 'New Zealand Black Caps Obsidian',
    category: 'country',
    badge: '🇳🇿',
    code: 'NZ',
    color: '#111827',
    secondaryColor: '#06b6d4',
    pantsColor: '#030712',
    stripeColor: '#06b6d4',
    price: 450,
    desc: 'Midnight matte black with glacial cyan accents worn by Williamson, Ravindra & Boult.'
  },
  {
    id: 'jersey_sa',
    name: 'South Africa Proteas Green & Gold',
    category: 'country',
    badge: '🇿🇦',
    code: 'SA',
    color: '#006837',
    secondaryColor: '#ffc72c',
    pantsColor: '#004c27',
    stripeColor: '#ffc72c',
    price: 350,
    desc: 'Lush forest green with radiant gold trim as worn by Markram, Klaasen & Rabada.'
  },
  {
    id: 'jersey_wi',
    name: 'West Indies Caribbean Maroon',
    category: 'country',
    badge: '🌴',
    code: 'WI',
    color: '#7b1113',
    secondaryColor: '#f59e0b',
    pantsColor: '#4a0b0c',
    stripeColor: '#f59e0b',
    price: 450,
    desc: 'Calypso rhythm maroon and sunshine gold worn by boundary demolishers Pooran & Joseph.'
  },
  {
    id: 'jersey_sl',
    name: 'Sri Lanka Ocean Lion Gold',
    category: 'country',
    badge: '🇱🇰',
    code: 'SL',
    color: '#002b7f',
    secondaryColor: '#f59e0b',
    pantsColor: '#001a4d',
    stripeColor: '#f59e0b',
    price: 350,
    desc: 'Royal ocean blue with golden lion flare as featured by Nissanka, Hasaranga & Pathirana.'
  },
  {
    id: 'jersey_ban',
    name: 'Bangladesh Bengal Tigers Emerald & Red',
    category: 'country',
    badge: '🇧🇩',
    code: 'BAN',
    color: '#006a4e',
    secondaryColor: '#f42a41',
    pantsColor: '#004d38',
    stripeColor: '#f42a41',
    price: 350,
    desc: 'Bengal Tigers deep emerald bottle green & crimson red worn by Shanto, Shakib & Mustafizur.'
  },
  {
    id: 'jersey_afg',
    name: 'Afghanistan Atalan Blue',
    category: 'country',
    badge: '🇦🇫',
    code: 'AFG',
    color: '#0055a5',
    secondaryColor: '#d52b1e',
    pantsColor: '#003366',
    stripeColor: '#d52b1e',
    price: 350,
    desc: 'Vibrant cobalt blue with Afghan red & black stripes worn by Rashid Khan & Gurbaz.'
  },

  // ==========================================
  // 2. IPL FRANCHISES (10 TEAMS)
  // ==========================================
  {
    id: 'jersey_csk',
    name: 'CSK Whistle Podu Yellow',
    category: 'ipl',
    badge: '🦁',
    code: 'CSK',
    color: '#f9cd05',
    secondaryColor: '#005fa2',
    pantsColor: '#f9cd05',
    stripeColor: '#090e17',
    price: 500,
    desc: 'The roaring canary yellow & royal blue stripes of Ruturaj, Thala Dhoni & Jadeja.'
  },
  {
    id: 'jersey_dc',
    name: 'Delhi Capitals Roaring Red & Blue',
    category: 'ipl',
    badge: '🐯',
    code: 'DC',
    color: '#004c97',
    secondaryColor: '#d71920',
    pantsColor: '#002855',
    stripeColor: '#d71920',
    price: 450,
    desc: 'Aggressive electric blue & fiery crimson worn by KL Rahul, Starc, Axar & Kuldeep.'
  },
  {
    id: 'jersey_gt',
    name: 'Gujarat Titans Titanium Dark Navy',
    category: 'ipl',
    badge: '⚡',
    code: 'GT',
    color: '#1b2133',
    secondaryColor: '#e5a823',
    pantsColor: '#0d111a',
    stripeColor: '#e5a823',
    price: 450,
    desc: 'Deep titanium navy blue with geometric gold prism accents of Shubman Gill, Rashid & Siraj.'
  },
  {
    id: 'jersey_kkr',
    name: 'KKR Knight Royal Purple & Gold',
    category: 'ipl',
    badge: '⚔️',
    code: 'KKR',
    color: '#3a225d',
    secondaryColor: '#f7d54e',
    pantsColor: '#231538',
    stripeColor: '#f7d54e',
    price: 500,
    desc: 'Imperial royal purple with glittering gold trim of champions Rinku, Narine & Green.'
  },
  {
    id: 'jersey_lsg',
    name: 'LSG Aqua Cyan & Navy Striker',
    category: 'ipl',
    badge: '🛡️',
    code: 'LSG',
    color: '#00b4d8',
    secondaryColor: '#03045e',
    pantsColor: '#03045e',
    stripeColor: '#00b4d8',
    price: 450,
    desc: 'Dynamic aqua cyan & deep navy blue worn by Rishabh Pant, Pooran & Shami.'
  },
  {
    id: 'jersey_mi',
    name: 'Mumbai Indians Electric Blue & Gold',
    category: 'ipl',
    badge: '🌀',
    code: 'MI',
    color: '#004ba0',
    secondaryColor: '#d1ab3e',
    pantsColor: '#003366',
    stripeColor: '#d1ab3e',
    price: 500,
    desc: 'Paltan electric blue with metallic gold stripes of Rohit, Surya, Hardik & Bumrah.'
  },
  {
    id: 'jersey_pbks',
    name: 'Punjab Kings Crimson & Golden Pride',
    category: 'ipl',
    badge: '🦁',
    code: 'PBKS',
    color: '#ed1b24',
    secondaryColor: '#d4af37',
    pantsColor: '#8a0f14',
    stripeColor: '#d4af37',
    price: 450,
    desc: 'Passionate crimson red with regal gold stripes worn by Shreyas Iyer, Warner & Arshdeep.'
  },
  {
    id: 'jersey_rr',
    name: 'Rajasthan Royals Royal Pink',
    category: 'ipl',
    badge: '🏰',
    code: 'RR',
    color: '#eb1a73',
    secondaryColor: '#001d48',
    pantsColor: '#001d48',
    stripeColor: '#eb1a73',
    price: 450,
    desc: 'Jaipur royal pink with navy blue shoulders worn by Jaiswal, Samson & Archer.'
  },
  {
    id: 'jersey_rcb',
    name: 'RCB Royal Red & Obsidian Navy',
    category: 'ipl',
    badge: '👑',
    code: 'RCB',
    color: '#d71920',
    secondaryColor: '#0f172a',
    pantsColor: '#001a4d',
    stripeColor: '#d71920',
    price: 550,
    desc: 'Fiery crimson red & midnight navy royal armor worn by King Kohli, Salt & Hazlewood.'
  },
  {
    id: 'jersey_srh',
    name: 'SRH Orange Army Fiery Sun',
    category: 'ipl',
    badge: '🦅',
    code: 'SRH',
    color: '#f26522',
    secondaryColor: '#18181b',
    pantsColor: '#09090b',
    stripeColor: '#f26522',
    price: 500,
    desc: 'Blazing volcanic orange & coal black worn by powerplay destroyers Head, Abhishek & Cummins.'
  },

  // ==========================================
  // 3. SPECIAL & RETRO KITS
  // ==========================================
  {
    id: 'jersey_retro',
    name: 'Retro 1992 Rainbow World Cup',
    category: 'special',
    badge: '🌈',
    code: 'RETRO',
    color: '#f97316',
    secondaryColor: '#3b82f6',
    pantsColor: '#0284c7',
    stripeColor: '#ffffff',
    price: 800,
    desc: 'Legendary rainbow-shouldered vintage classic kit celebrating cricket heritage.'
  },
  {
    id: 'jersey_stealth',
    name: 'Midnight Stealth Carbon Armor',
    category: 'special',
    badge: '🥷',
    code: 'STEALTH',
    color: '#0f172a',
    secondaryColor: '#eab308',
    pantsColor: '#020617',
    stripeColor: '#eab308',
    price: 900,
    desc: 'Ultra-dark carbon fiber weave with subtle gold neon accents for nocturnal chases.'
  },
  {
    id: 'jersey_cyber',
    name: 'Cyber Neon Electro',
    category: 'special',
    badge: '✨',
    code: 'CYBER',
    color: '#06b6d4',
    secondaryColor: '#a855f7',
    pantsColor: '#3b0764',
    stripeColor: '#06b6d4',
    price: 850,
    desc: 'Electrified high-visibility neon cyan & ultraviolet laser kit for arcade masters.'
  },
  {
    id: 'jersey_classic_white',
    name: 'Lord’s Heritage Whites',
    category: 'special',
    badge: '🏛️',
    code: 'CLASSIC',
    color: '#f8fafc',
    secondaryColor: '#1e3a8a',
    pantsColor: '#f1f5f9',
    stripeColor: '#1e3a8a',
    price: 500,
    desc: 'Pristine traditional cream-white kit honoring the timeless Home of Cricket.'
  }
];

// Helper to look up jersey color with smart fallback across all formats
export function getJerseyColor(identifier) {
  const kit = getJerseyData(identifier);
  return kit ? kit.color : '#0066b2';
}

/**
 * Robust Jersey Kit Resolver
 */
export function getJerseyData(identifier) {
  if (!identifier) return ALL_JERSEYS[0];

  if (typeof identifier === 'object') {
    if (identifier.color) {
      return {
        id: identifier.id || 'custom',
        name: identifier.name || 'Custom Team Kit',
        code: identifier.code || 'CUSTOM',
        color: identifier.color,
        secondaryColor: identifier.secondaryColor || '#ffffff',
        pantsColor: identifier.pantsColor || identifier.color,
        stripeColor: identifier.stripeColor || identifier.secondaryColor || '#ffffff',
        badge: identifier.badge || '🏏'
      };
    }
    const candidate = identifier.id || identifier.code || identifier.teamCode || identifier.teamJersey || identifier.name;
    if (candidate) {
      return getJerseyData(candidate);
    }
    return ALL_JERSEYS[0];
  }

  const raw = String(identifier).trim();
  const key = raw.toLowerCase();

  // 1. Direct ID match
  let found = ALL_JERSEYS.find(j => j.id.toLowerCase() === key);
  if (found) return found;

  // 2. Prefixed ID match
  found = ALL_JERSEYS.find(j => j.id.toLowerCase() === `jersey_${key}`);
  if (found) return found;

  // 3. Team Code match
  found = ALL_JERSEYS.find(j => j.code && j.code.toLowerCase() === key);
  if (found) return found;

  // 4. Team Name match
  found = ALL_JERSEYS.find(j => j.name.toLowerCase().includes(key));
  if (found) return found;

  // 5. Aliases
  if (key === 'blue' || key === 'bleed blue') return ALL_JERSEYS.find(j => j.id === 'jersey_ind') || ALL_JERSEYS[0];
  if (key === 'yellow' || key === 'csk') return ALL_JERSEYS.find(j => j.id === 'jersey_csk') || ALL_JERSEYS[10];
  if (key === 'red' || key === 'rcb') return ALL_JERSEYS.find(j => j.id === 'jersey_rcb') || ALL_JERSEYS[18];
  if (key === 'green' || key === 'sa') return ALL_JERSEYS.find(j => j.id === 'jersey_sa') || ALL_JERSEYS[5];
  if (key === 'ban' || key === 'bangladesh') return ALL_JERSEYS.find(j => j.id === 'jersey_ban') || ALL_JERSEYS[8];
  if (key === 'maroon' || key === 'wi') return ALL_JERSEYS.find(j => j.id === 'jersey_wi') || ALL_JERSEYS[6];
  if (key === 'black' || key === 'nz') return ALL_JERSEYS.find(j => j.id === 'jersey_nz') || ALL_JERSEYS[4];
  if (key === 'orange' || key === 'srh') return ALL_JERSEYS.find(j => j.id === 'jersey_srh') || ALL_JERSEYS[19];
  if (key === 'cyan' || key === 'lsg') return ALL_JERSEYS.find(j => j.id === 'jersey_lsg') || ALL_JERSEYS[14];

  return ALL_JERSEYS[0];
}

// ============================================================================
// COMPREHENSIVE REGISTRY OF WORLD CRICKET LEFT-HANDED BATSMEN (LHB)
// Exactly aligns with User Squad Specifications:
// Yashasvi Jaiswal, Rishabh Pant, Ravindra Jadeja, Axar Patel, Kuldeep Yadav,
// Travis Head, David Warner, Mitchell Starc, Josh Hazlewood, Ben Duckett,
// Ben Stokes, Moeen Ali, Sam Curran, Fakhar Zaman, Shaheen Afridi, Devon Conway,
// Rachin Ravindra, Mitchell Santner, Quinton de Kock, David Miller, Nicholas Pooran,
// Akeal Hosein, Najmul Hossain Shanto, Shakib Al Hasan, Taskin Ahmed, Mustafizur Rahman,
// Shivam Dube, Rahul Tewatia, Rinku Singh, Sunil Narine, Abhishek Sharma,
// Krunal Pandya, Nandre Burger, etc.
// ============================================================================
export const LEFT_HANDED_BATSMEN = new Set([
  // India
  'yashasvi jaiswal', 'y jaiswal', 'jaiswal',
  'rishabh pant', 'r pant', 'pant',
  'ravindra jadeja', 'r jadeja', 'jadeja',
  'axar patel', 'a patel', 'axar',
  'kuldeep yadav', 'k yadav', 'kuldeep',
  'shivam dube', 's dube', 'dube',
  'rinku singh', 'r singh', 'rinku',
  'tilak varma', 't varma',
  'abhishek sharma', 'a sharma', 'abhishek',
  'krunal pandya', 'k pandya', 'krunal',
  'rahul tewatia', 'r tewatia', 'tewatia',
  'arshdeep singh', // User prompt specified Arshdeep as Left-arm Fast, bats left/right; included for safety
  'shikhar dhawan', 'gautam gambhir', 'suresh raina', 'yuvraj singh', 'sourav ganguly',

  // Australia
  'travis head', 't head', 'head',
  'david warner', 'd warner', 'warner',
  'mitchell starc', 'm starc', 'starc',
  'josh hazlewood', 'j hazlewood', 'hazlewood', // User prompt: "Josh Hazlewood: Left-hand bat | Right-arm Fast-medium"
  'matthew wade', 'alex carey', 'matthew hayden', 'adam gilchrist', 'michael hussey',

  // England
  'ben duckett', 'b duckett', 'duckett',
  'ben stokes', 'b stokes', 'stokes',
  'moeen ali', 'm ali', 'moeen',
  'sam curran', 's curran', 'curran',
  'jacob bethell', 'j bethell', 'alastair cook',

  // Pakistan
  'fakhar zaman', 'f zaman', 'fakhar',
  'shaheen afridi', 's afridi', 'shaheen',
  'saim ayub', 'imad wasim',

  // New Zealand
  'devon conway', 'd conway', 'conway',
  'rachin ravindra', 'r ravindra', 'rachin',
  'mitchell santner', 'm santner', 'santner',
  'stephen fleming',

  // South Africa
  'quinton de kock', 'q de kock', 'de kock',
  'david miller', 'd miller', 'miller',
  'ryan rickelton', 'r rickelton',
  'nandre burger', 'n burger', 'burger',

  // West Indies
  'nicholas pooran', 'n pooran', 'pooran',
  'akeal hosein', 'a hosein', 'hosein',
  'shimron hetmyer', 's hetmyer', 'brian lara', 'chris gayle',

  // Sri Lanka
  'charith asalanka', 'kamindu mendis', 'bhanuka rajapaksa', 'kusal perera', 'kumar sangakkara', 'sanath jayasuriya',

  // Bangladesh
  'najmul hossain shanto', 'n h shanto', 'shanto',
  'shakib al hasan', 's al hasan', 'shakib',
  'taskin ahmed', 't ahmed', 'taskin',
  'mustafizur rahman', 'm rahman', 'mustafizur', 'tamim iqbal',

  // Kolkata / Others
  'sunil narine', 's narine', 'narine',
  'venkatesh iyer', 'nitish rana', 'sai sudharsan'
]);

const DISTINCTIVE_LHB_TOKENS = new Set([
  'jaiswal', 'pant', 'jadeja', 'axar', 'kuldeep', 'dube', 'rinku',
  'head', 'warner', 'starc', 'hazlewood',
  'duckett', 'stokes', 'moeen', 'curran',
  'fakhar', 'shaheen',
  'conway', 'rachin', 'santner',
  'pooran', 'hosein',
  'shanto', 'shakib', 'taskin', 'mustafizur',
  'tewatia', 'narine', 'abhishek', 'krunal', 'burger'
]);

/**
 * Accurately determines if any batsman is left-handed based on known international
 * rosters, manual [L] / (L) tags, or profile preferences.
 */
export function isPlayerLeftHanded(name) {
  if (!name) return false;
  const raw = String(name).toLowerCase();
  if (raw.includes('[l]') || raw.includes('(l)')) return true;
  const clean = raw.replace(/\[l\]|\(l\)/g, '').replace(/[^a-z0-9\s]/g, '').trim();
  if (LEFT_HANDED_BATSMEN.has(clean)) return true;

  // Check individual distinctive surname / identifier tokens
  const tokens = clean.split(/\s+/);
  for (const t of tokens) {
    if (DISTINCTIVE_LHB_TOKENS.has(t)) return true;
  }
  return false;
}

// ============================================================================
// COMPREHENSIVE PLAYERS REGISTRY (PART 1 & PART 2)
// Contains complete bio, batting hand, authentic bowling style, engine archetype & role
// ============================================================================
export const PLAYERS_REGISTRY = {
  // ----------------------------------------------------
  // INDIA (IND)
  // ----------------------------------------------------
  'Rohit Sharma': { name: 'Rohit Sharma', battingHand: 'right', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'Batter', skinTone: '#c68656', faceStyle: 'beard' },
  'Virat Kohli': { name: 'Virat Kohli', battingHand: 'right', bowlingStyle: 'Right-arm Medium', bowlingType: 'medium', bowlingArm: 'right', role: 'Batter', skinTone: '#d49b70', faceStyle: 'beard' },
  'Yashasvi Jaiswal': { name: 'Yashasvi Jaiswal', battingHand: 'left', bowlingStyle: 'Leg-break spin', bowlingType: 'legspin', bowlingArm: 'right', role: 'Batter', skinTone: '#d49b70', faceStyle: 'classic' },
  'Shubman Gill': { name: 'Shubman Gill', battingHand: 'right', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'Batter', skinTone: '#d49b70', faceStyle: 'classic' },
  'Suryakumar Yadav': { name: 'Suryakumar Yadav', battingHand: 'right', bowlingStyle: 'Right-arm Medium', bowlingType: 'medium', bowlingArm: 'right', role: 'Batter', skinTone: '#b57948', faceStyle: 'beard' },
  'Rishabh Pant': { name: 'Rishabh Pant', battingHand: 'left', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Wicketkeeper', skinTone: '#d49b70', faceStyle: 'classic' },
  'Hardik Pandya': { name: 'Hardik Pandya', battingHand: 'right', bowlingStyle: 'Right-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'right', role: 'All-rounder', skinTone: '#b57948', faceStyle: 'headband' },
  'Ravindra Jadeja': { name: 'Ravindra Jadeja', battingHand: 'left', bowlingStyle: 'Slow Left-arm Orthodox', bowlingType: 'leftarm_orthodox', bowlingArm: 'left', role: 'All-rounder', skinTone: '#b57948', faceStyle: 'beard' },
  'Axar Patel': { name: 'Axar Patel', battingHand: 'left', bowlingStyle: 'Slow Left-arm Orthodox', bowlingType: 'leftarm_orthodox', bowlingArm: 'left', role: 'All-rounder', skinTone: '#c68656', faceStyle: 'classic' },
  'Jasprit Bumrah': { name: 'Jasprit Bumrah', battingHand: 'right', bowlingStyle: 'Right-arm Fast', bowlingType: 'fast', bowlingArm: 'right', action: 'slingshot', role: 'Fast Bowler', skinTone: '#c68656', faceStyle: 'beard' },
  'Kuldeep Yadav': { name: 'Kuldeep Yadav', battingHand: 'left', bowlingStyle: 'Left-arm Wrist-spin', bowlingType: 'leftarm_chinaman', bowlingArm: 'left', action: 'wrist_spin', role: 'Spinner', skinTone: '#c68656', faceStyle: 'classic' },
  'Mohammed Siraj': { name: 'Mohammed Siraj', battingHand: 'right', bowlingStyle: 'Right-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'right', action: 'high_arm', role: 'Fast Bowler', skinTone: '#c68656', faceStyle: 'classic' },

  // ----------------------------------------------------
  // AUSTRALIA (AUS)
  // ----------------------------------------------------
  'Travis Head': { name: 'Travis Head', battingHand: 'left', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'Batter', skinTone: '#e0a980', faceStyle: 'classic' },
  'David Warner': { name: 'David Warner', battingHand: 'left', bowlingStyle: 'Leg-break spin', bowlingType: 'legspin', bowlingArm: 'right', role: 'Batter', skinTone: '#f5d0b0', faceStyle: 'classic' },
  'Steven Smith': { name: 'Steven Smith', battingHand: 'right', bowlingStyle: 'Leg-break spin', bowlingType: 'legspin', bowlingArm: 'right', role: 'Batter', skinTone: '#f5d0b0', faceStyle: 'classic' },
  'Mitchell Marsh': { name: 'Mitchell Marsh', battingHand: 'right', bowlingStyle: 'Right-arm Medium', bowlingType: 'medium', bowlingArm: 'right', role: 'All-rounder', skinTone: '#e0a980', faceStyle: 'classic' },
  'Glenn Maxwell': { name: 'Glenn Maxwell', battingHand: 'right', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'All-rounder', skinTone: '#e0a980', faceStyle: 'beard' },
  'Cameron Green': { name: 'Cameron Green', battingHand: 'right', bowlingStyle: 'Right-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'right', role: 'All-rounder', skinTone: '#f5d0b0', faceStyle: 'classic' },
  'Pat Cummins': { name: 'Pat Cummins', battingHand: 'right', bowlingStyle: 'Right-arm Fast', bowlingType: 'fast', bowlingArm: 'right', action: 'high_arm', role: 'Fast Bowler', skinTone: '#e0a980', faceStyle: 'headband' },
  'Mitchell Starc': { name: 'Mitchell Starc', battingHand: 'left', bowlingStyle: 'Left-arm Fast', bowlingType: 'fast', bowlingArm: 'left', action: 'fast_swing', role: 'Fast Bowler', skinTone: '#e0a980', faceStyle: 'classic' },
  'Josh Hazlewood': { name: 'Josh Hazlewood', battingHand: 'left', bowlingStyle: 'Right-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'right', action: 'high_arm', role: 'Fast Bowler', skinTone: '#e0a980', faceStyle: 'classic' },
  'Adam Zampa': { name: 'Adam Zampa', battingHand: 'right', bowlingStyle: 'Leg-break spin', bowlingType: 'legspin', bowlingArm: 'right', action: 'wrist_spin', role: 'Spinner', skinTone: '#f5d0b0', faceStyle: 'headband' },

  // ----------------------------------------------------
  // ENGLAND (ENG)
  // ----------------------------------------------------
  'Joe Root': { name: 'Joe Root', battingHand: 'right', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'Batter', skinTone: '#f5d0b0', faceStyle: 'classic' },
  'Ben Duckett': { name: 'Ben Duckett', battingHand: 'left', bowlingStyle: 'Right-arm Medium', bowlingType: 'medium', bowlingArm: 'right', role: 'Batter', skinTone: '#f5d0b0', faceStyle: 'classic' },
  'Harry Brook': { name: 'Harry Brook', battingHand: 'right', bowlingStyle: 'Right-arm Medium', bowlingType: 'medium', bowlingArm: 'right', role: 'Batter', skinTone: '#f5d0b0', faceStyle: 'classic' },
  'Jos Buttler': { name: 'Jos Buttler', battingHand: 'right', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Wicketkeeper', skinTone: '#f5d0b0', faceStyle: 'classic' },
  'Ben Stokes': { name: 'Ben Stokes', battingHand: 'left', bowlingStyle: 'Right-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'right', role: 'All-rounder', skinTone: '#f5d0b0', faceStyle: 'beard' },
  'Moeen Ali': { name: 'Moeen Ali', battingHand: 'left', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'All-rounder', skinTone: '#b57948', faceStyle: 'beard' },
  'Sam Curran': { name: 'Sam Curran', battingHand: 'left', bowlingStyle: 'Left-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'left', role: 'All-rounder', skinTone: '#f5d0b0', faceStyle: 'headband' },
  'Jofra Archer': { name: 'Jofra Archer', battingHand: 'right', bowlingStyle: 'Right-arm Fast', bowlingType: 'fast', bowlingArm: 'right', action: 'high_arm', role: 'Fast Bowler', skinTone: '#5a3d28', faceStyle: 'headband' },
  'Mark Wood': { name: 'Mark Wood', battingHand: 'right', bowlingStyle: 'Right-arm Fast', bowlingType: 'fast', bowlingArm: 'right', action: 'slingshot', role: 'Fast Bowler', skinTone: '#e0a980', faceStyle: 'classic' },
  'Adil Rashid': { name: 'Adil Rashid', battingHand: 'right', bowlingStyle: 'Leg-break spin', bowlingType: 'legspin', bowlingArm: 'right', action: 'wrist_spin', role: 'Spinner', skinTone: '#b57948', faceStyle: 'beard' },

  // ----------------------------------------------------
  // PAKISTAN (PAK)
  // ----------------------------------------------------
  'Babar Azam': { name: 'Babar Azam', battingHand: 'right', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'Batter', skinTone: '#c68656', faceStyle: 'classic' },
  'Fakhar Zaman': { name: 'Fakhar Zaman', battingHand: 'left', bowlingStyle: 'Left-arm Orthodox', bowlingType: 'leftarm_orthodox', bowlingArm: 'left', role: 'Batter', skinTone: '#c68656', faceStyle: 'classic' },
  'Mohammad Rizwan': { name: 'Mohammad Rizwan', battingHand: 'right', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Wicketkeeper', skinTone: '#c68656', faceStyle: 'classic' },
  'Shadab Khan': { name: 'Shadab Khan', battingHand: 'right', bowlingStyle: 'Leg-break spin', bowlingType: 'legspin', bowlingArm: 'right', action: 'wrist_spin', role: 'All-rounder', skinTone: '#c68656', faceStyle: 'beard' },
  'Shaheen Afridi': { name: 'Shaheen Afridi', battingHand: 'left', bowlingStyle: 'Left-arm Fast', bowlingType: 'fast', bowlingArm: 'left', action: 'fast_swing', role: 'Fast Bowler', skinTone: '#d49b70', faceStyle: 'headband' },
  'Naseem Shah': { name: 'Naseem Shah', battingHand: 'right', bowlingStyle: 'Right-arm Fast', bowlingType: 'fast', bowlingArm: 'right', action: 'high_arm', role: 'Fast Bowler', skinTone: '#d49b70', faceStyle: 'classic' },
  'Haris Rauf': { name: 'Haris Rauf', battingHand: 'right', bowlingStyle: 'Right-arm Fast', bowlingType: 'fast', bowlingArm: 'right', action: 'slingshot', role: 'Fast Bowler', skinTone: '#c68656', faceStyle: 'beard' },

  // ----------------------------------------------------
  // NEW ZEALAND (NZ)
  // ----------------------------------------------------
  'Kane Williamson': { name: 'Kane Williamson', battingHand: 'right', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'Batter', skinTone: '#e0a980', faceStyle: 'beard' },
  'Devon Conway': { name: 'Devon Conway', battingHand: 'left', bowlingStyle: 'Right-arm Medium', bowlingType: 'medium', bowlingArm: 'right', role: 'Batter', skinTone: '#e0a980', faceStyle: 'classic' },
  'Daryl Mitchell': { name: 'Daryl Mitchell', battingHand: 'right', bowlingStyle: 'Right-arm Medium', bowlingType: 'medium', bowlingArm: 'right', role: 'All-rounder', skinTone: '#e0a980', faceStyle: 'classic' },
  'Rachin Ravindra': { name: 'Rachin Ravindra', battingHand: 'left', bowlingStyle: 'Slow Left-arm Orthodox', bowlingType: 'leftarm_orthodox', bowlingArm: 'left', role: 'All-rounder', skinTone: '#c68656', faceStyle: 'classic' },
  'Mitchell Santner': { name: 'Mitchell Santner', battingHand: 'left', bowlingStyle: 'Slow Left-arm Orthodox', bowlingType: 'leftarm_orthodox', bowlingArm: 'left', role: 'All-rounder', skinTone: '#e0a980', faceStyle: 'classic' },
  'Trent Boult': { name: 'Trent Boult', battingHand: 'right', bowlingStyle: 'Left-arm Fast', bowlingType: 'fast', bowlingArm: 'left', action: 'fast_swing', role: 'Fast Bowler', skinTone: '#e0a980', faceStyle: 'classic' },
  'Tim Southee': { name: 'Tim Southee', battingHand: 'right', bowlingStyle: 'Right-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'right', action: 'high_arm', role: 'Fast Bowler', skinTone: '#e0a980', faceStyle: 'classic' },
  'Lockie Ferguson': { name: 'Lockie Ferguson', battingHand: 'right', bowlingStyle: 'Right-arm Fast', bowlingType: 'fast', bowlingArm: 'right', action: 'slingshot', role: 'Fast Bowler', skinTone: '#e0a980', faceStyle: 'headband' },

  // ----------------------------------------------------
  // SOUTH AFRICA (SA)
  // ----------------------------------------------------
  'Aiden Markram': { name: 'Aiden Markram', battingHand: 'right', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'All-rounder', skinTone: '#e0a980', faceStyle: 'classic' },
  'Quinton de Kock': { name: 'Quinton de Kock', battingHand: 'left', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Wicketkeeper', skinTone: '#e0a980', faceStyle: 'classic' },
  'Heinrich Klaasen': { name: 'Heinrich Klaasen', battingHand: 'right', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Wicketkeeper', skinTone: '#e0a980', faceStyle: 'classic' },
  'David Miller': { name: 'David Miller', battingHand: 'left', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'Batter', skinTone: '#e0a980', faceStyle: 'classic' },
  'Marco Jansen': { name: 'Marco Jansen', battingHand: 'right', bowlingStyle: 'Left-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'left', role: 'All-rounder', skinTone: '#f5d0b0', faceStyle: 'classic' },
  'Kagiso Rabada': { name: 'Kagiso Rabada', battingHand: 'right', bowlingStyle: 'Right-arm Fast', bowlingType: 'fast', bowlingArm: 'right', action: 'high_arm', role: 'Fast Bowler', skinTone: '#5a3d28', faceStyle: 'classic' },
  'Anrich Nortje': { name: 'Anrich Nortje', battingHand: 'right', bowlingStyle: 'Right-arm Fast', bowlingType: 'fast', bowlingArm: 'right', action: 'high_arm', role: 'Fast Bowler', skinTone: '#e0a980', faceStyle: 'classic' },
  'Keshav Maharaj': { name: 'Keshav Maharaj', battingHand: 'right', bowlingStyle: 'Slow Left-arm Orthodox', bowlingType: 'leftarm_orthodox', bowlingArm: 'left', action: 'finger_spin', role: 'Spinner', skinTone: '#c68656', faceStyle: 'beard' },

  // ----------------------------------------------------
  // WEST INDIES (WI)
  // ----------------------------------------------------
  'Shai Hope': { name: 'Shai Hope', battingHand: 'right', bowlingStyle: 'Right-arm Medium', bowlingType: 'medium', bowlingArm: 'right', role: 'Batter', skinTone: '#5a3d28', faceStyle: 'classic' },
  'Nicholas Pooran': { name: 'Nicholas Pooran', battingHand: 'left', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Wicketkeeper', skinTone: '#5a3d28', faceStyle: 'classic' },
  'Rovman Powell': { name: 'Rovman Powell', battingHand: 'right', bowlingStyle: 'Right-arm Medium-fast', bowlingType: 'mediumfast', bowlingArm: 'right', role: 'Batter', skinTone: '#5a3d28', faceStyle: 'classic' },
  'Jason Holder': { name: 'Jason Holder', battingHand: 'right', bowlingStyle: 'Right-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'right', role: 'All-rounder', skinTone: '#5a3d28', faceStyle: 'classic' },
  'Alzarri Joseph': { name: 'Alzarri Joseph', battingHand: 'right', bowlingStyle: 'Right-arm Fast', bowlingType: 'fast', bowlingArm: 'right', action: 'high_arm', role: 'Fast Bowler', skinTone: '#5a3d28', faceStyle: 'headband' },
  'Akeal Hosein': { name: 'Akeal Hosein', battingHand: 'left', bowlingStyle: 'Slow Left-arm Orthodox', bowlingType: 'leftarm_orthodox', bowlingArm: 'left', action: 'finger_spin', role: 'Spinner', skinTone: '#5a3d28', faceStyle: 'classic' },

  // ----------------------------------------------------
  // SRI LANKA (SL)
  // ----------------------------------------------------
  'Pathum Nissanka': { name: 'Pathum Nissanka', battingHand: 'right', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Batter', skinTone: '#b57948', faceStyle: 'classic' },
  'Kusal Mendis': { name: 'Kusal Mendis', battingHand: 'right', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Wicketkeeper', skinTone: '#b57948', faceStyle: 'classic' },
  'Wanindu Hasaranga': { name: 'Wanindu Hasaranga', battingHand: 'right', bowlingStyle: 'Leg-break spin', bowlingType: 'legspin', bowlingArm: 'right', action: 'wrist_spin', role: 'All-rounder', skinTone: '#b57948', faceStyle: 'beard' },
  'Maheesh Theekshana': { name: 'Maheesh Theekshana', battingHand: 'right', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', action: 'unorthodox', role: 'Spinner', skinTone: '#b57948', faceStyle: 'classic' },
  'Matheesha Pathirana': { name: 'Matheesha Pathirana', battingHand: 'right', bowlingStyle: 'Right-arm Fast', bowlingType: 'fast', bowlingArm: 'right', action: 'slingshot', role: 'Fast Bowler', skinTone: '#b57948', faceStyle: 'headband' },

  // ----------------------------------------------------
  // BANGLADESH (BAN)
  // ----------------------------------------------------
  'Najmul Hossain Shanto': { name: 'Najmul Hossain Shanto', battingHand: 'left', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'Batter', skinTone: '#b57948', faceStyle: 'classic' },
  'Litton Das': { name: 'Litton Das', battingHand: 'right', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Wicketkeeper', skinTone: '#b57948', faceStyle: 'classic' },
  'Shakib Al Hasan': { name: 'Shakib Al Hasan', battingHand: 'left', bowlingStyle: 'Slow Left-arm Orthodox', bowlingType: 'leftarm_orthodox', bowlingArm: 'left', action: 'finger_spin', role: 'All-rounder', skinTone: '#b57948', faceStyle: 'classic' },
  'Mehidy Hasan Miraz': { name: 'Mehidy Hasan Miraz', battingHand: 'right', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'All-rounder', skinTone: '#b57948', faceStyle: 'classic' },
  'Taskin Ahmed': { name: 'Taskin Ahmed', battingHand: 'left', bowlingStyle: 'Right-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'right', action: 'high_arm', role: 'Fast Bowler', skinTone: '#b57948', faceStyle: 'classic' },
  'Mustafizur Rahman': { name: 'Mustafizur Rahman', battingHand: 'left', bowlingStyle: 'Left-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'left', action: 'slingshot', role: 'Fast Bowler', skinTone: '#b57948', faceStyle: 'classic' },

  // ----------------------------------------------------
  // AFGHANISTAN (AFG)
  // ----------------------------------------------------
  'Rahmanullah Gurbaz': { name: 'Rahmanullah Gurbaz', battingHand: 'right', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Wicketkeeper', skinTone: '#c68656', faceStyle: 'classic' },
  'Ibrahim Zadran': { name: 'Ibrahim Zadran', battingHand: 'right', bowlingStyle: 'Right-arm Medium', bowlingType: 'medium', bowlingArm: 'right', role: 'Batter', skinTone: '#c68656', faceStyle: 'classic' },
  'Mohammad Nabi': { name: 'Mohammad Nabi', battingHand: 'right', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'All-rounder', skinTone: '#b57948', faceStyle: 'beard' },
  'Azmatullah Omarzai': { name: 'Azmatullah Omarzai', battingHand: 'right', bowlingStyle: 'Right-arm Medium-fast', bowlingType: 'mediumfast', bowlingArm: 'right', role: 'All-rounder', skinTone: '#c68656', faceStyle: 'classic' },
  'Rashid Khan': { name: 'Rashid Khan', battingHand: 'right', bowlingStyle: 'Leg-break spin', bowlingType: 'legspin', bowlingArm: 'right', action: 'wrist_spin', role: 'Spinner/All-rounder', skinTone: '#c68656', faceStyle: 'beard' },
  'Fazalhaq Farooqi': { name: 'Fazalhaq Farooqi', battingHand: 'right', bowlingStyle: 'Left-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'left', action: 'fast_swing', role: 'Fast Bowler', skinTone: '#d49b70', faceStyle: 'classic' },

  // ----------------------------------------------------
  // IPL STARS
  // ----------------------------------------------------
  'Ruturaj Gaikwad': { name: 'Ruturaj Gaikwad', battingHand: 'right', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Batter', skinTone: '#c68656', faceStyle: 'classic' },
  'MS Dhoni': { name: 'MS Dhoni', battingHand: 'right', bowlingStyle: 'Right-arm Medium', bowlingType: 'medium', bowlingArm: 'right', role: 'Wicketkeeper', skinTone: '#c68656', faceStyle: 'beard' },
  'Shivam Dube': { name: 'Shivam Dube', battingHand: 'left', bowlingStyle: 'Right-arm Medium-fast', bowlingType: 'mediumfast', bowlingArm: 'right', role: 'All-rounder', skinTone: '#d49b70', faceStyle: 'classic' },
  'Noor Ahmad': { name: 'Noor Ahmad', battingHand: 'right', bowlingStyle: 'Left-arm Wrist-spin', bowlingType: 'leftarm_chinaman', bowlingArm: 'left', action: 'wrist_spin', role: 'Spinner', skinTone: '#c68656', faceStyle: 'classic' },
  'KL Rahul': { name: 'KL Rahul', battingHand: 'right', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Wicketkeeper', skinTone: '#c68656', faceStyle: 'beard' },
  'T. Natarajan': { name: 'T. Natarajan', battingHand: 'right', bowlingStyle: 'Left-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'left', action: 'slingshot', role: 'Fast Bowler', skinTone: '#b57948', faceStyle: 'beard' },
  'Rahul Tewatia': { name: 'Rahul Tewatia', battingHand: 'left', bowlingStyle: 'Leg-break spin', bowlingType: 'legspin', bowlingArm: 'right', role: 'All-rounder', skinTone: '#c68656', faceStyle: 'classic' },
  'Rinku Singh': { name: 'Rinku Singh', battingHand: 'left', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'Batter', skinTone: '#d49b70', faceStyle: 'beard' },
  'Sunil Narine': { name: 'Sunil Narine', battingHand: 'left', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', action: 'unorthodox', role: 'All-rounder', skinTone: '#5a3d28', faceStyle: 'spiky' },
  'Varun Chakravarthy': { name: 'Varun Chakravarthy', battingHand: 'right', bowlingStyle: 'Right-arm Mystery Spin', bowlingType: 'offspin', bowlingArm: 'right', action: 'wrist_spin', role: 'Spinner', skinTone: '#b57948', faceStyle: 'beard' },
  'Harshit Rana': { name: 'Harshit Rana', battingHand: 'right', bowlingStyle: 'Right-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'right', action: 'high_arm', role: 'Fast Bowler', skinTone: '#c68656', faceStyle: 'classic' },
  'Mohammad Shami': { name: 'Mohammad Shami', battingHand: 'right', bowlingStyle: 'Right-arm Fast', bowlingType: 'fast', bowlingArm: 'right', action: 'high_arm', role: 'Fast Bowler', skinTone: '#c68656', faceStyle: 'beard' },
  'Ravi Bishnoi': { name: 'Ravi Bishnoi', battingHand: 'right', bowlingStyle: 'Leg-break spin', bowlingType: 'legspin', bowlingArm: 'right', action: 'wrist_spin', role: 'Spinner', skinTone: '#c68656', faceStyle: 'classic' },
  'Shreyas Iyer': { name: 'Shreyas Iyer', battingHand: 'right', bowlingStyle: 'Right-arm Leg-break', bowlingType: 'legspin', bowlingArm: 'right', role: 'Batter', skinTone: '#d49b70', faceStyle: 'classic' },
  'Marcus Stoinis': { name: 'Marcus Stoinis', battingHand: 'right', bowlingStyle: 'Right-arm Medium', bowlingType: 'medium', bowlingArm: 'right', role: 'All-rounder', skinTone: '#e0a980', faceStyle: 'classic' },
  'Arshdeep Singh': { name: 'Arshdeep Singh', battingHand: 'left', bowlingStyle: 'Left-arm Fast', bowlingType: 'fastmedium', bowlingArm: 'left', action: 'fast_swing', role: 'Fast Bowler', skinTone: '#c68656', faceStyle: 'turban' },
  'Yuzvendra Chahal': { name: 'Yuzvendra Chahal', battingHand: 'right', bowlingStyle: 'Leg-break spin', bowlingType: 'legspin', bowlingArm: 'right', action: 'wrist_spin', role: 'Spinner', skinTone: '#c68656', faceStyle: 'classic' },
  'Riyan Parag': { name: 'Riyan Parag', battingHand: 'right', bowlingStyle: 'Leg-break spin', bowlingType: 'legspin', bowlingArm: 'right', role: 'Batter', skinTone: '#d49b70', faceStyle: 'classic' },
  'Sanju Samson': { name: 'Sanju Samson', battingHand: 'right', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Wicketkeeper', skinTone: '#c68656', faceStyle: 'beard' },
  'Nandre Burger': { name: 'Nandre Burger', battingHand: 'left', bowlingStyle: 'Left-arm Fast', bowlingType: 'fast', bowlingArm: 'left', action: 'high_arm', role: 'Fast Bowler', skinTone: '#f5d0b0', faceStyle: 'classic' },
  'Rajat Patidar': { name: 'Rajat Patidar', battingHand: 'right', bowlingStyle: 'Right-arm Off-break', bowlingType: 'offspin', bowlingArm: 'right', role: 'Batter', skinTone: '#d49b70', faceStyle: 'classic' },
  'Phil Salt': { name: 'Phil Salt', battingHand: 'right', bowlingStyle: 'None', bowlingType: null, bowlingArm: 'right', role: 'Wicketkeeper', skinTone: '#f5d0b0', faceStyle: 'classic' },
  'Krunal Pandya': { name: 'Krunal Pandya', battingHand: 'left', bowlingStyle: 'Slow Left-arm Orthodox', bowlingType: 'leftarm_orthodox', bowlingArm: 'left', role: 'All-rounder', skinTone: '#c68656', faceStyle: 'beard' },
  'Bhuvneshwar Kumar': { name: 'Bhuvneshwar Kumar', battingHand: 'right', bowlingStyle: 'Right-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'right', action: 'fast_swing', role: 'Fast Bowler', skinTone: '#c68656', faceStyle: 'classic' },
  'Abhishek Sharma': { name: 'Abhishek Sharma', battingHand: 'left', bowlingStyle: 'Slow Left-arm Orthodox', bowlingType: 'leftarm_orthodox', bowlingArm: 'left', role: 'All-rounder', skinTone: '#d49b70', faceStyle: 'classic' },
  'Harshal Patel': { name: 'Harshal Patel', battingHand: 'right', bowlingStyle: 'Right-arm Fast-medium', bowlingType: 'fastmedium', bowlingArm: 'right', action: 'slingshot', role: 'Fast Bowler', skinTone: '#c68656', faceStyle: 'beard' }
};

export function getPlayerInfo(name) {
  if (!name) return null;
  return PLAYERS_REGISTRY[name] || null;
}

// ============================================================================
// COMPREHENSIVE TEAMS ROSTER (10 COUNTRIES & 10 IPL FRANCHISES)
// ============================================================================
export const TEAMS = {
  // ----------------------------------------------------
  // 1. INDIA (IND)
  // ----------------------------------------------------
  IND: {
    code: 'IND',
    name: 'India',
    fullName: 'India National Cricket Team',
    badge: '🇮🇳',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_ind'),
    batsmen: [
      'Rohit Sharma',
      'Virat Kohli',
      'Yashasvi Jaiswal',
      'Shubman Gill',
      'Suryakumar Yadav',
      'Rishabh Pant',
      'Hardik Pandya',
      'Ravindra Jadeja',
      'Axar Patel',
      'Jasprit Bumrah',
      'Kuldeep Yadav',
      'Mohammed Siraj'
    ],
    bowlers: [
      { name: 'Jasprit Bumrah', shortName: 'J. Bumrah', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#c68656', faceStyle: 'beard', role: 'Fast Bowler' },
      { name: 'Mohammed Siraj', shortName: 'M. Siraj', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Hardik Pandya', shortName: 'H. Pandya', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#b57948', faceStyle: 'headband', role: 'All-rounder' },
      { name: 'Kuldeep Yadav', shortName: 'K. Yadav', type: 'leftarm_chinaman', arm: 'left', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic', role: 'Spinner' },
      { name: 'Ravindra Jadeja', shortName: 'R. Jadeja', type: 'leftarm_orthodox', arm: 'left', angle: 'over', action: 'finger_spin', skinTone: '#b57948', faceStyle: 'beard', role: 'All-rounder' },
      { name: 'Axar Patel', shortName: 'A. Patel', type: 'leftarm_orthodox', arm: 'left', angle: 'over', action: 'finger_spin', skinTone: '#c68656', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Rohit Sharma', shortName: 'R. Sharma', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#c68656', faceStyle: 'beard', role: 'Part-time Off-break' },
      { name: 'Yashasvi Jaiswal', shortName: 'Y. Jaiswal', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#d49b70', faceStyle: 'classic', role: 'Leg-break spin' }
    ]
  },

  // ----------------------------------------------------
  // 2. AUSTRALIA (AUS)
  // ----------------------------------------------------
  AUS: {
    code: 'AUS',
    name: 'Australia',
    fullName: 'Australia National Cricket Team',
    badge: '🇦🇺',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_aus'),
    batsmen: [
      'Travis Head',
      'David Warner',
      'Steven Smith',
      'Mitchell Marsh',
      'Glenn Maxwell',
      'Cameron Green',
      'Pat Cummins',
      'Mitchell Starc',
      'Josh Hazlewood',
      'Adam Zampa'
    ],
    bowlers: [
      { name: 'Pat Cummins', shortName: 'P. Cummins', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'headband', role: 'Fast Bowler' },
      { name: 'Mitchell Starc', shortName: 'M. Starc', type: 'fast', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Josh Hazlewood', shortName: 'J. Hazlewood', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Adam Zampa', shortName: 'A. Zampa', type: 'legspin', arm: 'right', angle: 'around', action: 'wrist_spin', skinTone: '#f5d0b0', faceStyle: 'headband', role: 'Spinner' },
      { name: 'Cameron Green', shortName: 'C. Green', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#f5d0b0', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Mitchell Marsh', shortName: 'M. Marsh', type: 'medium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Glenn Maxwell', shortName: 'G. Maxwell', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#e0a980', faceStyle: 'beard', role: 'All-rounder' },
      { name: 'Travis Head', shortName: 'T. Head', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#e0a980', faceStyle: 'classic', role: 'Part-time Off-break' }
    ]
  },

  // ----------------------------------------------------
  // 3. ENGLAND (ENG)
  // ----------------------------------------------------
  ENG: {
    code: 'ENG',
    name: 'England',
    fullName: 'England Cricket Team',
    badge: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_eng'),
    batsmen: [
      'Joe Root',
      'Ben Duckett',
      'Harry Brook',
      'Jos Buttler',
      'Ben Stokes',
      'Moeen Ali',
      'Sam Curran',
      'Jofra Archer',
      'Mark Wood',
      'Adil Rashid'
    ],
    bowlers: [
      { name: 'Jofra Archer', shortName: 'J. Archer', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'headband', role: 'Fast Bowler' },
      { name: 'Mark Wood', shortName: 'M. Wood', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#e0a980', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Sam Curran', shortName: 'S. Curran', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#f5d0b0', faceStyle: 'headband', role: 'All-rounder' },
      { name: 'Ben Stokes', shortName: 'B. Stokes', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#f5d0b0', faceStyle: 'beard', role: 'All-rounder' },
      { name: 'Adil Rashid', shortName: 'A. Rashid', type: 'legspin', arm: 'right', angle: 'around', action: 'wrist_spin', skinTone: '#b57948', faceStyle: 'beard', role: 'Spinner' },
      { name: 'Moeen Ali', shortName: 'M. Ali', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#b57948', faceStyle: 'beard', role: 'All-rounder' },
      { name: 'Joe Root', shortName: 'J. Root', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#f5d0b0', faceStyle: 'classic', role: 'Part-time Off-break' }
    ]
  },

  // ----------------------------------------------------
  // 4. PAKISTAN (PAK)
  // ----------------------------------------------------
  PAK: {
    code: 'PAK',
    name: 'Pakistan',
    fullName: 'Pakistan Cricket Team',
    badge: '🇵🇰',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_pak'),
    batsmen: [
      'Babar Azam',
      'Fakhar Zaman',
      'Mohammad Rizwan',
      'Shadab Khan',
      'Shaheen Afridi',
      'Naseem Shah',
      'Haris Rauf'
    ],
    bowlers: [
      { name: 'Shaheen Afridi', shortName: 'S. Afridi', type: 'fast', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#d49b70', faceStyle: 'headband', role: 'Fast Bowler' },
      { name: 'Naseem Shah', shortName: 'N. Shah', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#d49b70', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Haris Rauf', shortName: 'H. Rauf', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#c68656', faceStyle: 'beard', role: 'Fast Bowler' },
      { name: 'Shadab Khan', shortName: 'S. Khan', type: 'legspin', arm: 'right', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'beard', role: 'All-rounder' },
      { name: 'Fakhar Zaman', shortName: 'F. Zaman', type: 'leftarm_orthodox', arm: 'left', angle: 'around', action: 'finger_spin', skinTone: '#c68656', faceStyle: 'classic', role: 'Part-time Orthodox' },
      { name: 'Babar Azam', shortName: 'B. Azam', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#c68656', faceStyle: 'classic', role: 'Part-time Off-break' }
    ]
  },

  // ----------------------------------------------------
  // 5. NEW ZEALAND (NZ)
  // ----------------------------------------------------
  NZ: {
    code: 'NZ',
    name: 'New Zealand',
    fullName: 'New Zealand Black Caps',
    badge: '🇳🇿',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_nz'),
    batsmen: [
      'Kane Williamson',
      'Devon Conway',
      'Daryl Mitchell',
      'Rachin Ravindra',
      'Mitchell Santner',
      'Trent Boult',
      'Tim Southee',
      'Lockie Ferguson'
    ],
    bowlers: [
      { name: 'Trent Boult', shortName: 'T. Boult', type: 'fast', arm: 'left', angle: 'around', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Lockie Ferguson', shortName: 'L. Ferguson', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#e0a980', faceStyle: 'headband', role: 'Fast Bowler' },
      { name: 'Tim Southee', shortName: 'T. Southee', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Mitchell Santner', shortName: 'M. Santner', type: 'leftarm_orthodox', arm: 'left', angle: 'around', action: 'finger_spin', skinTone: '#e0a980', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Rachin Ravindra', shortName: 'R. Ravindra', type: 'leftarm_orthodox', arm: 'left', angle: 'around', action: 'finger_spin', skinTone: '#c68656', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Daryl Mitchell', shortName: 'D. Mitchell', type: 'medium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Kane Williamson', shortName: 'K. Williamson', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#e0a980', faceStyle: 'beard', role: 'Part-time Off-break' }
    ]
  },

  // ----------------------------------------------------
  // 6. SOUTH AFRICA (SA)
  // ----------------------------------------------------
  SA: {
    code: 'SA',
    name: 'South Africa',
    fullName: 'South Africa Proteas',
    badge: '🇿🇦',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_sa'),
    batsmen: [
      'Aiden Markram',
      'Quinton de Kock',
      'Heinrich Klaasen',
      'David Miller',
      'Marco Jansen',
      'Kagiso Rabada',
      'Anrich Nortje',
      'Keshav Maharaj'
    ],
    bowlers: [
      { name: 'Kagiso Rabada', shortName: 'K. Rabada', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Anrich Nortje', shortName: 'A. Nortje', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Marco Jansen', shortName: 'M. Jansen', type: 'fastmedium', arm: 'left', angle: 'over', action: 'high_arm', skinTone: '#f5d0b0', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Keshav Maharaj', shortName: 'K. Maharaj', type: 'leftarm_orthodox', arm: 'left', angle: 'over', action: 'finger_spin', skinTone: '#c68656', faceStyle: 'beard', role: 'Spinner' },
      { name: 'Aiden Markram', shortName: 'A. Markram', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#e0a980', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'David Miller', shortName: 'D. Miller', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#e0a980', faceStyle: 'classic', role: 'Part-time Off-break' }
    ]
  },

  // ----------------------------------------------------
  // 7. WEST INDIES (WI)
  // ----------------------------------------------------
  WI: {
    code: 'WI',
    name: 'West Indies',
    fullName: 'West Indies Cricket Team',
    badge: '🌴',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_wi'),
    batsmen: [
      'Shai Hope',
      'Nicholas Pooran',
      'Rovman Powell',
      'Jason Holder',
      'Alzarri Joseph',
      'Akeal Hosein'
    ],
    bowlers: [
      { name: 'Alzarri Joseph', shortName: 'A. Joseph', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'headband', role: 'Fast Bowler' },
      { name: 'Jason Holder', shortName: 'J. Holder', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Akeal Hosein', shortName: 'A. Hosein', type: 'leftarm_orthodox', arm: 'left', angle: 'around', action: 'finger_spin', skinTone: '#5a3d28', faceStyle: 'classic', role: 'Spinner' },
      { name: 'Rovman Powell', shortName: 'R. Powell', type: 'mediumfast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'classic', role: 'Medium-fast' },
      { name: 'Shai Hope', shortName: 'S. Hope', type: 'medium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'classic', role: 'Medium' }
    ]
  },

  // ----------------------------------------------------
  // 8. SRI LANKA (SL)
  // ----------------------------------------------------
  SL: {
    code: 'SL',
    name: 'Sri Lanka',
    fullName: 'Sri Lanka Lions',
    badge: '🇱🇰',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_sl'),
    batsmen: [
      'Pathum Nissanka',
      'Kusal Mendis',
      'Wanindu Hasaranga',
      'Maheesh Theekshana',
      'Matheesha Pathirana'
    ],
    bowlers: [
      { name: 'Matheesha Pathirana', shortName: 'M. Pathirana', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#b57948', faceStyle: 'headband', role: 'Fast Bowler' },
      { name: 'Wanindu Hasaranga', shortName: 'W. Hasaranga', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#b57948', faceStyle: 'beard', role: 'All-rounder' },
      { name: 'Maheesh Theekshana', shortName: 'M. Theekshana', type: 'offspin', arm: 'right', angle: 'over', action: 'unorthodox', skinTone: '#b57948', faceStyle: 'classic', role: 'Spinner' }
    ]
  },

  // ----------------------------------------------------
  // 9. BANGLADESH (BAN)
  // ----------------------------------------------------
  BAN: {
    code: 'BAN',
    name: 'Bangladesh',
    fullName: 'Bangladesh National Cricket Team',
    badge: '🇧🇩',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_ban'),
    batsmen: [
      'Najmul Hossain Shanto',
      'Litton Das',
      'Shakib Al Hasan',
      'Mehidy Hasan Miraz',
      'Taskin Ahmed',
      'Mustafizur Rahman'
    ],
    bowlers: [
      { name: 'Taskin Ahmed', shortName: 'T. Ahmed', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#b57948', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Mustafizur Rahman', shortName: 'M. Rahman', type: 'fastmedium', arm: 'left', angle: 'over', action: 'slingshot', skinTone: '#b57948', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Shakib Al Hasan', shortName: 'S. Al Hasan', type: 'leftarm_orthodox', arm: 'left', angle: 'around', action: 'finger_spin', skinTone: '#b57948', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Mehidy Hasan Miraz', shortName: 'M. Miraz', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#b57948', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Najmul Hossain Shanto', shortName: 'N. Shanto', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#b57948', faceStyle: 'classic', role: 'Part-time Off-break' }
    ]
  },

  // ----------------------------------------------------
  // 10. AFGHANISTAN (AFG)
  // ----------------------------------------------------
  AFG: {
    code: 'AFG',
    name: 'Afghanistan',
    fullName: 'Afghanistan National Cricket Team',
    badge: '🇦🇫',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_afg'),
    batsmen: [
      'Rahmanullah Gurbaz',
      'Ibrahim Zadran',
      'Mohammad Nabi',
      'Azmatullah Omarzai',
      'Rashid Khan',
      'Fazalhaq Farooqi'
    ],
    bowlers: [
      { name: 'Rashid Khan', shortName: 'Rashid Khan', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'beard', role: 'Spinner/All-rounder' },
      { name: 'Fazalhaq Farooqi', shortName: 'F. Farooqi', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#d49b70', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Azmatullah Omarzai', shortName: 'A. Omarzai', type: 'mediumfast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Mohammad Nabi', shortName: 'M. Nabi', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#b57948', faceStyle: 'beard', role: 'All-rounder' },
      { name: 'Ibrahim Zadran', shortName: 'I. Zadran', type: 'medium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic', role: 'Medium' }
    ]
  },

  // ====================================================
  // PART 2: INDIAN PREMIER LEAGUE (IPL) FRANCHISES
  // ====================================================

  // 1. CHENNAI SUPER KINGS (CSK)
  CSK: {
    code: 'CSK',
    name: 'Chennai Super Kings',
    fullName: 'Chennai Super Kings',
    badge: '🦁',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_csk'),
    batsmen: [
      'Ruturaj Gaikwad',
      'MS Dhoni',
      'Shivam Dube',
      'Ravindra Jadeja',
      'Matheesha Pathirana',
      'Noor Ahmad'
    ],
    bowlers: [
      { name: 'Matheesha Pathirana', shortName: 'M. Pathirana', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#b57948', faceStyle: 'headband', role: 'Fast Bowler' },
      { name: 'Noor Ahmad', shortName: 'Noor Ahmad', type: 'leftarm_chinaman', arm: 'left', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic', role: 'Spinner' },
      { name: 'Ravindra Jadeja', shortName: 'R. Jadeja', type: 'leftarm_orthodox', arm: 'left', angle: 'over', action: 'finger_spin', skinTone: '#b57948', faceStyle: 'beard', role: 'All-rounder' },
      { name: 'Shivam Dube', shortName: 'S. Dube', type: 'mediumfast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#d49b70', faceStyle: 'classic', role: 'All-rounder' }
    ]
  },

  // 2. DELHI CAPITALS (DC)
  DC: {
    code: 'DC',
    name: 'Delhi Capitals',
    fullName: 'Delhi Capitals',
    badge: '🐯',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_dc'),
    batsmen: [
      'KL Rahul',
      'Axar Patel',
      'Mitchell Starc',
      'Kuldeep Yadav',
      'T. Natarajan'
    ],
    bowlers: [
      { name: 'Mitchell Starc', shortName: 'M. Starc', type: 'fast', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'T. Natarajan', shortName: 'T. Natarajan', type: 'fastmedium', arm: 'left', angle: 'over', action: 'slingshot', skinTone: '#b57948', faceStyle: 'beard', role: 'Fast Bowler' },
      { name: 'Kuldeep Yadav', shortName: 'K. Yadav', type: 'leftarm_chinaman', arm: 'left', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic', role: 'Spinner' },
      { name: 'Axar Patel', shortName: 'A. Patel', type: 'leftarm_orthodox', arm: 'left', angle: 'over', action: 'finger_spin', skinTone: '#c68656', faceStyle: 'classic', role: 'All-rounder' }
    ]
  },

  // 3. GUJARAT TITANS (GT)
  GT: {
    code: 'GT',
    name: 'Gujarat Titans',
    fullName: 'Gujarat Titans',
    badge: '⚡',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_gt'),
    batsmen: [
      'Shubman Gill',
      'Rashid Khan',
      'Rahul Tewatia',
      'Kagiso Rabada',
      'Mohammed Siraj'
    ],
    bowlers: [
      { name: 'Mohammed Siraj', shortName: 'M. Siraj', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Kagiso Rabada', shortName: 'K. Rabada', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Rashid Khan', shortName: 'Rashid Khan', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'beard', role: 'Spinner' },
      { name: 'Rahul Tewatia', shortName: 'R. Tewatia', type: 'legspin', arm: 'right', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic', role: 'All-rounder' }
    ]
  },

  // 4. KOLKATA KNIGHT RIDERS (KKR)
  KKR: {
    code: 'KKR',
    name: 'Kolkata Knight Riders',
    fullName: 'Kolkata Knight Riders',
    badge: '⚔️',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_kkr'),
    batsmen: [
      'Rinku Singh',
      'Sunil Narine',
      'Cameron Green',
      'Varun Chakravarthy',
      'Harshit Rana'
    ],
    bowlers: [
      { name: 'Harshit Rana', shortName: 'H. Rana', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Cameron Green', shortName: 'C. Green', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#f5d0b0', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Sunil Narine', shortName: 'S. Narine', type: 'offspin', arm: 'right', angle: 'around', action: 'unorthodox', skinTone: '#5a3d28', faceStyle: 'spiky', role: 'All-rounder' },
      { name: 'Varun Chakravarthy', shortName: 'V. Chakravarthy', type: 'offspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#b57948', faceStyle: 'beard', role: 'Spinner' }
    ]
  },

  // 5. LUCKNOW SUPER GIANTS (LSG)
  LSG: {
    code: 'LSG',
    name: 'Lucknow Super Giants',
    fullName: 'Lucknow Super Giants',
    badge: '🛡️',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_lsg'),
    batsmen: [
      'Rishabh Pant',
      'Nicholas Pooran',
      'Mitchell Marsh',
      'Mohammad Shami',
      'Ravi Bishnoi'
    ],
    bowlers: [
      { name: 'Mohammad Shami', shortName: 'M. Shami', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'beard', role: 'Fast Bowler' },
      { name: 'Mitchell Marsh', shortName: 'M. Marsh', type: 'medium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Ravi Bishnoi', shortName: 'R. Bishnoi', type: 'legspin', arm: 'right', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic', role: 'Spinner' }
    ]
  },

  // 6. MUMBAI INDIANS (MI)
  MI: {
    code: 'MI',
    name: 'Mumbai Indians',
    fullName: 'Mumbai Indians',
    badge: '🌀',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_mi'),
    batsmen: [
      'Rohit Sharma',
      'Suryakumar Yadav',
      'Hardik Pandya',
      'Jasprit Bumrah',
      'Trent Boult'
    ],
    bowlers: [
      { name: 'Jasprit Bumrah', shortName: 'J. Bumrah', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#c68656', faceStyle: 'beard', role: 'Fast Bowler' },
      { name: 'Trent Boult', shortName: 'T. Boult', type: 'fast', arm: 'left', angle: 'around', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Hardik Pandya', shortName: 'H. Pandya', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#b57948', faceStyle: 'headband', role: 'All-rounder' }
    ]
  },

  // 7. PUNJAB KINGS (PBKS)
  PBKS: {
    code: 'PBKS',
    name: 'Punjab Kings',
    fullName: 'Punjab Kings',
    badge: '🦁',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_pbks'),
    batsmen: [
      'Shreyas Iyer',
      'David Warner',
      'Marcus Stoinis',
      'Arshdeep Singh',
      'Yuzvendra Chahal'
    ],
    bowlers: [
      { name: 'Arshdeep Singh', shortName: 'Arshdeep Singh', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#c68656', faceStyle: 'turban', role: 'Fast Bowler' },
      { name: 'Marcus Stoinis', shortName: 'M. Stoinis', type: 'medium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Yuzvendra Chahal', shortName: 'Y. Chahal', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic', role: 'Spinner' }
    ]
  },

  // 8. RAJASTHAN ROYALS (RR)
  RR: {
    code: 'RR',
    name: 'Rajasthan Royals',
    fullName: 'Rajasthan Royals',
    badge: '🏰',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_rr'),
    batsmen: [
      'Yashasvi Jaiswal',
      'Riyan Parag',
      'Sanju Samson',
      'Jofra Archer',
      'Trent Boult',
      'Nandre Burger'
    ],
    bowlers: [
      { name: 'Jofra Archer', shortName: 'J. Archer', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'headband', role: 'Fast Bowler' },
      { name: 'Trent Boult', shortName: 'T. Boult', type: 'fast', arm: 'left', angle: 'around', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Nandre Burger', shortName: 'N. Burger', type: 'fast', arm: 'left', angle: 'over', action: 'high_arm', skinTone: '#f5d0b0', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Riyan Parag', shortName: 'R. Parag', type: 'legspin', arm: 'right', angle: 'around', action: 'wrist_spin', skinTone: '#d49b70', faceStyle: 'classic', role: 'Leg-break spin' }
    ]
  },

  // 9. ROYAL CHALLENGERS BENGALURU (RCB)
  RCB: {
    code: 'RCB',
    name: 'Royal Challengers Bengaluru',
    fullName: 'Royal Challengers Bengaluru',
    badge: '👑',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_rcb'),
    batsmen: [
      'Virat Kohli',
      'Rajat Patidar',
      'Phil Salt',
      'Krunal Pandya',
      'Josh Hazlewood',
      'Bhuvneshwar Kumar'
    ],
    bowlers: [
      { name: 'Josh Hazlewood', shortName: 'J. Hazlewood', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Bhuvneshwar Kumar', shortName: 'B. Kumar', type: 'fastmedium', arm: 'right', angle: 'over', action: 'fast_swing', skinTone: '#c68656', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Krunal Pandya', shortName: 'K. Pandya', type: 'leftarm_orthodox', arm: 'left', angle: 'over', action: 'finger_spin', skinTone: '#c68656', faceStyle: 'beard', role: 'All-rounder' }
    ]
  },

  // 10. SUNRISERS HYDERABAD (SRH)
  SRH: {
    code: 'SRH',
    name: 'Sunrisers Hyderabad',
    fullName: 'Sunrisers Hyderabad',
    badge: '🦅',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_srh'),
    batsmen: [
      'Travis Head',
      'Abhishek Sharma',
      'Heinrich Klaasen',
      'Pat Cummins',
      'Bhuvneshwar Kumar',
      'Harshal Patel'
    ],
    bowlers: [
      { name: 'Pat Cummins', shortName: 'P. Cummins', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'headband', role: 'Fast Bowler' },
      { name: 'Bhuvneshwar Kumar', shortName: 'B. Kumar', type: 'fastmedium', arm: 'right', angle: 'over', action: 'fast_swing', skinTone: '#c68656', faceStyle: 'classic', role: 'Fast Bowler' },
      { name: 'Harshal Patel', shortName: 'H. Patel', type: 'fastmedium', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#c68656', faceStyle: 'beard', role: 'Fast Bowler' },
      { name: 'Abhishek Sharma', shortName: 'A. Sharma', type: 'leftarm_orthodox', arm: 'left', angle: 'around', action: 'finger_spin', skinTone: '#d49b70', faceStyle: 'classic', role: 'All-rounder' },
      { name: 'Travis Head', shortName: 'T. Head', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#e0a980', faceStyle: 'classic', role: 'Part-time Off-break' }
    ]
  }
};

// Global consolidated list of bowlers across all countries
export const GLOBAL_WORLD_BOWLERS = [
  { name: 'Jasprit Bumrah', shortName: 'J. Bumrah', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#c68656', faceStyle: 'beard', team: 'IND' },
  { name: 'Rashid Khan', shortName: 'Rashid Khan', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'beard', team: 'AFG' },
  { name: 'Mitchell Starc', shortName: 'M. Starc', type: 'fast', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic', team: 'AUS' },
  { name: 'Pat Cummins', shortName: 'P. Cummins', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'headband', team: 'AUS' },
  { name: 'Kagiso Rabada', shortName: 'K. Rabada', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'classic', team: 'SA' },
  { name: 'Kuldeep Yadav', shortName: 'K. Yadav', type: 'leftarm_chinaman', arm: 'left', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic', team: 'IND' },
  { name: 'Shaheen Afridi', shortName: 'S. Afridi', type: 'fast', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#d49b70', faceStyle: 'headband', team: 'PAK' },
  { name: 'Matheesha Pathirana', shortName: 'M. Pathirana', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#b57948', faceStyle: 'headband', team: 'SL' },
  { name: 'Jofra Archer', shortName: 'J. Archer', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'headband', team: 'ENG' },
  { name: 'Trent Boult', shortName: 'T. Boult', type: 'fast', arm: 'left', angle: 'around', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic', team: 'NZ' },
  { name: 'Mustafizur Rahman', shortName: 'M. Rahman', type: 'fastmedium', arm: 'left', angle: 'over', action: 'slingshot', skinTone: '#b57948', faceStyle: 'classic', team: 'BAN' },
  { name: 'Sunil Narine', shortName: 'S. Narine', type: 'offspin', arm: 'right', angle: 'around', action: 'unorthodox', skinTone: '#5a3d28', faceStyle: 'spiky', team: 'KKR' }
];

// Global consolidated list of batsmen across all countries
export const GLOBAL_BATSMEN_LINEUP = [
  'Rohit Sharma',
  'Virat Kohli',
  'Yashasvi Jaiswal',
  'Travis Head',
  'Suryakumar Yadav',
  'Rishabh Pant',
  'Heinrich Klaasen',
  'Babar Azam',
  'Jos Buttler',
  'Hardik Pandya',
  'Glenn Maxwell',
  'Nicholas Pooran',
  'David Warner',
  'Kane Williamson',
  'David Miller',
  'Shakib Al Hasan',
  'Najmul Hossain Shanto',
  'Pathum Nissanka',
  'Rahmanullah Gurbaz',
  'Ruturaj Gaikwad'
];

export function getTeam(teamCode) {
  if (!teamCode) return TEAMS.IND;
  const upper = teamCode.toUpperCase();
  return TEAMS[upper] || TEAMS.IND;
}
