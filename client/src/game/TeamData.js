// TeamData.js - Comprehensive Roster of Latest T20 International & IPL Teams, Players and Authentic Kits

export const ALL_JERSEYS = [
  // ==========================================
  // 1. INTERNATIONAL T20 COUNTRIES
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
    desc: 'The iconic deep blue & saffron tricolor kit worn by champions Rohit, Virat & Abhishek.'
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
    desc: 'Lush forest green with radiant gold trim as worn by Markram, Rickelton & Klaasen.'
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
    desc: 'Electric canary yellow with dark green trim as powered by Travis Head & Maxwell.'
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
    desc: 'Bold crimson red and royal navy match kit of Buttler, Salt & Brook.'
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
    desc: 'Deep emerald green with high-voltage neon mint angles of Babar & Shaheen.'
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
    desc: 'Calypso rhythm maroon and sunshine gold worn by boundary demolishers Pooran & Russell.'
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
    desc: 'Midnight matte black with glacial cyan accents worn by Finn Allen & Boult.'
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
    desc: 'Vibrant cobalt blue with Afghan red & black stripes worn by Rashid & Gurbaz.'
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
    desc: 'Royal ocean blue with golden lion flare as featured by Nissanka & Pathirana.'
  },

  // ==========================================
  // 2. IPL FRANCHISES (INDIAN PREMIER LEAGUE)
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
    desc: 'The iconic roaring canary yellow & royal blue stripes of Thala Dhoni & Ruturaj.'
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
    desc: 'Paltan electric blue with shimmering metallic gold stripes of Rohit, Surya & Bumrah.'
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
    desc: 'Fiery crimson red and midnight navy royal armor worn by King Kohli.'
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
    desc: 'Imperial royal purple with glittering gold trim of champions Russell, Salt & Narine.'
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
    desc: 'Blazing volcanic orange & coal black worn by powerplay destroyers Abhishek Sharma & Head.'
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
    desc: 'Vibrant Jaipur royal pink with navy blue shoulders worn by Samson & Jaiswal.'
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
    desc: 'Dynamic aqua cyan & deep navy blue worn by Nicholas Pooran & Mayank Yadav.'
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
    desc: 'Aggressive electric blue and fiery crimson red worn by Rishabh Pant & Stubbs.'
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
    desc: 'Deep titanium navy blue with geometric gold prism accents of Shubman Gill & Rashid.'
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
    desc: 'Passionate crimson red with regal gold stripes worn by Shashank & Arshdeep.'
  },

  // ==========================================
  // 3. SPECIAL & RETRO T20 LEAGUE KITS
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
 * Robust Jersey Kit Resolver: Accepts jersey ID, team code ('IND', 'SA', 'CSK', 'MI'),
 * legacy alias ('blue', 'gold', etc.), or full kit object.
 */
export function getJerseyData(identifier) {
  if (!identifier) return ALL_JERSEYS[0];

  // If already a kit object with color
  if (typeof identifier === 'object' && identifier.color) {
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

  const raw = String(identifier).trim();
  const key = raw.toLowerCase();

  // 1. Direct ID match (e.g. 'jersey_csk')
  let found = ALL_JERSEYS.find(j => j.id.toLowerCase() === key);
  if (found) return found;

  // 2. Prefixed ID match (e.g. key is 'csk' -> matches 'jersey_csk')
  found = ALL_JERSEYS.find(j => j.id.toLowerCase() === `jersey_${key}`);
  if (found) return found;

  // 3. Team Code match (e.g. key is 'csk' or 'sa' -> matches code 'CSK' or 'SA')
  found = ALL_JERSEYS.find(j => j.code && j.code.toLowerCase() === key);
  if (found) return found;

  // 4. Team Name match
  found = ALL_JERSEYS.find(j => j.name.toLowerCase().includes(key));
  if (found) return found;

  // 5. Legacy aliases
  if (key === 'blue' || key === 'bleed blue') return ALL_JERSEYS.find(j => j.id === 'jersey_ind') || ALL_JERSEYS[0];
  if (key === 'gold' || key === 'yellow') return ALL_JERSEYS.find(j => j.id === 'jersey_csk') || ALL_JERSEYS[2];
  if (key === 'crimson' || key === 'red') return ALL_JERSEYS.find(j => j.id === 'jersey_rcb') || ALL_JERSEYS[3];
  if (key === 'emerald' || key === 'green') return ALL_JERSEYS.find(j => j.id === 'jersey_sa') || ALL_JERSEYS[1];
  if (key === 'maroon') return ALL_JERSEYS.find(j => j.id === 'jersey_wi') || ALL_JERSEYS[5];
  if (key === 'stealth' || key === 'black') return ALL_JERSEYS.find(j => j.id === 'jersey_nz') || ALL_JERSEYS[6];
  if (key === 'retro' || key === 'orange') return ALL_JERSEYS.find(j => j.id === 'jersey_srh') || ALL_JERSEYS[14];
  if (key === 'cyber' || key === 'cyan') return ALL_JERSEYS.find(j => j.id === 'jersey_lsg') || ALL_JERSEYS[16];

  return ALL_JERSEYS[0];
}

// ============================================================================
// COMPREHENSIVE REGISTRY OF WORLD CRICKET LEFT-HANDED BATSMEN (LHB)
// Ryan Rickelton, Abhishek Sharma, Travis Head, Quinton de Kock, Pooran, Pant, etc.
// ============================================================================
export const LEFT_HANDED_BATSMEN = new Set([
  'ryan rickelton',
  'abhishek sharma',
  'travis head',
  'quinton de kock',
  'david miller',
  'nicholas pooran',
  'shimron hetmyer',
  'yashasvi jaiswal',
  'rishabh pant',
  'shivam dube',
  'rinku singh',
  'tilak varma',
  'axar patel',
  'ravindra jadeja',
  'saim ayub',
  'fakhar zaman',
  'devon conway',
  'rachin ravindra',
  'mitchell santner',
  'sunil narine',
  'venkatesh iyer',
  'nitish rana',
  'sai sudharsan',
  'rahul tewatia',
  'sam curran',
  'ben duckett',
  'ben stokes',
  'charith asalanka',
  'kamindu mendis',
  'bhanuka rajapaksa',
  'kusal perera',
  'shakib al hasan',
  'tamim iqbal',
  'shikhar dhawan',
  'suresh raina',
  'gautam gambhir',
  'yuvraj singh',
  'sourav ganguly',
  'brian lara',
  'chris gayle',
  'matthew hayden',
  'adam gilchrist',
  'michael hussey',
  'kumar sangakkara',
  'sanath jayasuriya',
  'stephen fleming',
  'alastair cook',
  'david warner',
  'ishan kishan',
  'devdutt padikkal',
  'krunal pandya',
  'abishek porel',
  'rilee rossouw',
  'matthew wade',
  'alex carey',
  's. kinvara',
  's. kadam',
  'p. sanzgiri',
  'j. bethell',
  'jacob bethell'
]);

/**
 * Accurately determines if any batsman is left-handed based on known international
 * rosters, manual [L] / (L) tags, or profile preferences.
 */
export function isPlayerLeftHanded(name) {
  if (!name) return false;
  const raw = String(name).toLowerCase();
  if (raw.includes('[l]') || raw.includes('(l)')) return true;
  const clean = raw.replace(/\[l\]|\(l\)/g, '').replace(/[^a-z\s]/g, '').trim();
  for (const lhb of LEFT_HANDED_BATSMEN) {
    if (clean === lhb || clean.includes(lhb) || lhb.includes(clean)) {
      return true;
    }
  }
  return false;
}

// ============================================================================
// COMPREHENSIVE LATEST T20 TEAMS ROSTER (Countries & IPL)
// ============================================================================
export const TEAMS = {
  IND: {
    code: 'IND',
    name: 'India',
    fullName: 'India National Cricket Team',
    badge: '🇮🇳',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_ind'),
    batsmen: [
      'Abhishek Sharma',
      'Rohit Sharma',
      'Virat Kohli',
      'Suryakumar Yadav',
      'Hardik Pandya',
      'Sanju Samson',
      'Rinku Singh',
      'Rishabh Pant',
      'Yashasvi Jaiswal',
      'Tilak Varma',
      'Axar Patel',
      'Shivam Dube'
    ],
    bowlers: [
      { name: 'J. Bumrah', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#c68656', faceStyle: 'beard' },
      { name: 'Arshdeep Singh', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#c68656', faceStyle: 'turban' },
      { name: 'V. Chakaravarthy', type: 'offspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#b57948', faceStyle: 'beard' },
      { name: 'K. Yadav', type: 'leftarm_chinaman', arm: 'left', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'M. Siraj', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'H. Pandya', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#b57948', faceStyle: 'headband' }
    ]
  },

  SA: {
    code: 'SA',
    name: 'South Africa',
    fullName: 'South Africa Proteas',
    badge: '🇿🇦',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_sa'),
    batsmen: [
      'Ryan Rickelton',
      'Aiden Markram',
      'Heinrich Klaasen',
      'David Miller',
      'Tristan Stubbs',
      'Quinton de Kock',
      'Reeza Hendricks',
      'Marco Jansen',
      'Dewald Brevis',
      'Matthew Breetzke',
      'Donovan Ferreira',
      'Corbin Bosch'
    ],
    bowlers: [
      { name: 'K. Rabada', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'classic' },
      { name: 'A. Nortje', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic' },
      { name: 'M. Jansen', type: 'fastmedium', arm: 'left', angle: 'over', action: 'high_arm', skinTone: '#f5d0b0', faceStyle: 'classic' },
      { name: 'K. Maharaj', type: 'leftarm_orthodox', arm: 'left', angle: 'over', action: 'finger_spin', skinTone: '#c68656', faceStyle: 'beard' },
      { name: 'T. Shamsi', type: 'leftarm_chinaman', arm: 'left', angle: 'around', action: 'wrist_spin', skinTone: '#b57948', faceStyle: 'classic' },
      { name: 'G. Coetzee', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#f5d0b0', faceStyle: 'headband' }
    ]
  },

  AUS: {
    code: 'AUS',
    name: 'Australia',
    fullName: 'Australia Cricket Team',
    badge: '🇦🇺',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_aus'),
    batsmen: [
      'Travis Head',
      'Mitchell Marsh',
      'Glenn Maxwell',
      'Marcus Stoinis',
      'Tim David',
      'Josh Inglis',
      'Matthew Short',
      'Jake Fraser-McGurk',
      'Pat Cummins',
      'Alex Carey',
      'Cameron Green',
      'Cooper Connolly'
    ],
    bowlers: [
      { name: 'P. Cummins', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'headband' },
      { name: 'M. Starc', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic' },
      { name: 'A. Zampa', type: 'legspin', arm: 'right', angle: 'around', action: 'wrist_spin', skinTone: '#f5d0b0', faceStyle: 'headband' },
      { name: 'J. Hazlewood', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic' },
      { name: 'N. Ellis', type: 'fastmedium', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#e0a980', faceStyle: 'beard' },
      { name: 'X. Bartlett', type: 'fastmedium', arm: 'right', angle: 'over', action: 'fast_swing', skinTone: '#f5d0b0', faceStyle: 'classic' }
    ]
  },

  ENG: {
    code: 'ENG',
    name: 'England',
    fullName: 'England Cricket Team',
    badge: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_eng'),
    batsmen: [
      'Jos Buttler',
      'Phil Salt',
      'Harry Brook',
      'Liam Livingstone',
      'Sam Curran',
      'Will Jacks',
      'Jacob Bethell',
      'Ben Duckett',
      'Dan Lawrence',
      'Jamie Overton',
      'Jordan Cox',
      'Brydon Carse'
    ],
    bowlers: [
      { name: 'J. Archer', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'headband' },
      { name: 'A. Rashid', type: 'legspin', arm: 'right', angle: 'around', action: 'wrist_spin', skinTone: '#b57948', faceStyle: 'beard' },
      { name: 'M. Wood', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#e0a980', faceStyle: 'classic' },
      { name: 'R. Topley', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#f5d0b0', faceStyle: 'classic' },
      { name: 'S. Curran', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#f5d0b0', faceStyle: 'headband' },
      { name: 'Saqib Mahmood', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#b57948', faceStyle: 'classic' }
    ]
  },

  PAK: {
    code: 'PAK',
    name: 'Pakistan',
    fullName: 'Pakistan Cricket Team',
    badge: '🇵🇰',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_pak'),
    batsmen: [
      'Babar Azam',
      'Mohammad Rizwan',
      'Fakhar Zaman',
      'Saim Ayub',
      'Iftikhar Ahmed',
      'Shadab Khan',
      'Usman Khan',
      'Azam Khan',
      'Imad Wasim',
      'Agha Salman',
      'Irfan Khan Niazi',
      'Kamran Ghulam'
    ],
    bowlers: [
      { name: 'S. Afridi', type: 'fast', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#d49b70', faceStyle: 'headband' },
      { name: 'Haris Rauf', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#c68656', faceStyle: 'beard' },
      { name: 'Naseem Shah', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#d49b70', faceStyle: 'classic' },
      { name: 'Abrar Ahmed', type: 'legspin', arm: 'right', angle: 'around', action: 'finger_spin', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'M. Amir', type: 'fastmedium', arm: 'left', angle: 'around', action: 'fast_swing', skinTone: '#c68656', faceStyle: 'beard' },
      { name: 'Abbas Afridi', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#d49b70', faceStyle: 'classic' }
    ]
  },

  WI: {
    code: 'WI',
    name: 'West Indies',
    fullName: 'West Indies Cricket Team',
    badge: '🌴',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_wi'),
    batsmen: [
      'Nicholas Pooran',
      'Andre Russell',
      'Shimron Hetmyer',
      'Rovman Powell',
      'Shai Hope',
      'Brandon King',
      'Romario Shepherd',
      'Sherfane Rutherford',
      'Johnson Charles',
      'Kyle Mayers',
      'Fabian Allen',
      'Roston Chase'
    ],
    bowlers: [
      { name: 'Akeal Hosein', type: 'leftarm_orthodox', arm: 'left', angle: 'around', action: 'finger_spin', skinTone: '#5a3d28', faceStyle: 'classic' },
      { name: 'Alzarri Joseph', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'headband' },
      { name: 'G. Motie', type: 'leftarm_orthodox', arm: 'left', angle: 'over', action: 'finger_spin', skinTone: '#5a3d28', faceStyle: 'beard' },
      { name: 'A. Russell', type: 'fastmedium', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#5a3d28', faceStyle: 'spiky' },
      { name: 'R. Shepherd', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'classic' },
      { name: 'Shamar Joseph', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#5a3d28', faceStyle: 'classic' }
    ]
  },

  NZ: {
    code: 'NZ',
    name: 'New Zealand',
    fullName: 'New Zealand Black Caps',
    badge: '🇳🇿',
    type: 'international',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_nz'),
    batsmen: [
      'Finn Allen',
      'Devon Conway',
      'Glenn Phillips',
      'Rachin Ravindra',
      'Daryl Mitchell',
      'Mark Chapman',
      'Kane Williamson',
      'Mitchell Santner',
      'Tim Seifert',
      'Michael Bracewell',
      'Josh Clarkson',
      'Will Young'
    ],
    bowlers: [
      { name: 'T. Boult', type: 'fastmedium', arm: 'left', angle: 'around', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic' },
      { name: 'L. Ferguson', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#e0a980', faceStyle: 'headband' },
      { name: 'M. Santner', type: 'leftarm_orthodox', arm: 'left', angle: 'around', action: 'finger_spin', skinTone: '#e0a980', faceStyle: 'classic' },
      { name: 'M. Henry', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic' },
      { name: 'I. Sodhi', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#b57948', faceStyle: 'beard' },
      { name: 'Ben Sears', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic' }
    ]
  },

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
      'Azmatullah Omarzai',
      'Mohammad Nabi',
      'Najibullah Zadran',
      'Gulbadin Naib',
      'Rashid Khan',
      'Karim Janat',
      'Sediqullah Atal',
      'Hazratullah Zazai',
      'Darwish Rasooli'
    ],
    bowlers: [
      { name: 'Rashid Khan', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'beard' },
      { name: 'F. Farooqi', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#d49b70', faceStyle: 'classic' },
      { name: 'Naveen-ul-Haq', type: 'fastmedium', arm: 'right', angle: 'around', action: 'slingshot', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Noor Ahmad', type: 'leftarm_chinaman', arm: 'left', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'M. Nabi', type: 'offspin', arm: 'right', angle: 'over', action: 'finger_spin', skinTone: '#b57948', faceStyle: 'beard' },
      { name: 'Fareed Ahmad', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#c68656', faceStyle: 'beard' }
    ]
  },

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
      'Charith Asalanka',
      'Kamindu Mendis',
      'Wanindu Hasaranga',
      'Dasun Shanaka',
      'Bhanuka Rajapaksa',
      'Kusal Perera',
      'Dinesh Chandimal',
      'Dunith Wellalage',
      'Avishka Fernando'
    ],
    bowlers: [
      { name: 'M. Pathirana', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#b57948', faceStyle: 'headband' },
      { name: 'W. Hasaranga', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#b57948', faceStyle: 'beard' },
      { name: 'M. Theekshana', type: 'offspin', arm: 'right', angle: 'over', action: 'unorthodox', skinTone: '#b57948', faceStyle: 'classic' },
      { name: 'N. Thushara', type: 'fastmedium', arm: 'right', angle: 'around', action: 'slingshot', skinTone: '#b57948', faceStyle: 'spiky' },
      { name: 'D. Madushanka', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#b57948', faceStyle: 'classic' },
      { name: 'Binura Fernando', type: 'fastmedium', arm: 'left', angle: 'over', action: 'high_arm', skinTone: '#b57948', faceStyle: 'classic' }
    ]
  },

  // ==========================================
  // IPL FRANCHISES
  // ==========================================
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
      'Devon Conway',
      'Daryl Mitchell',
      'Sameer Rizvi',
      'Moeen Ali',
      'Ajinkya Rahane',
      'Rachin Ravindra'
    ],
    bowlers: [
      { name: 'M. Pathirana', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#b57948', faceStyle: 'headband' },
      { name: 'R. Jadeja', type: 'leftarm_orthodox', arm: 'left', angle: 'over', action: 'finger_spin', skinTone: '#b57948', faceStyle: 'beard' },
      { name: 'Tushar Deshpande', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Deepak Chahar', type: 'fastmedium', arm: 'right', angle: 'over', action: 'fast_swing', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'M. Theekshana', type: 'offspin', arm: 'right', angle: 'over', action: 'unorthodox', skinTone: '#b57948', faceStyle: 'classic' }
    ]
  },

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
      'Tilak Varma',
      'Ryan Rickelton',
      'Tim David',
      'Ishan Kishan',
      'Nehal Wadhera',
      'Naman Dhir',
      'Dewald Brevis'
    ],
    bowlers: [
      { name: 'J. Bumrah', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#c68656', faceStyle: 'beard' },
      { name: 'G. Coetzee', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#f5d0b0', faceStyle: 'headband' },
      { name: 'H. Pandya', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#b57948', faceStyle: 'headband' },
      { name: 'Nuwan Thushara', type: 'fastmedium', arm: 'right', angle: 'around', action: 'slingshot', skinTone: '#b57948', faceStyle: 'spiky' },
      { name: 'Piyush Chawla', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'beard' }
    ]
  },

  RCB: {
    code: 'RCB',
    name: 'Royal Challengers Bengaluru',
    fullName: 'Royal Challengers Bengaluru',
    badge: '👑',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_rcb'),
    batsmen: [
      'Virat Kohli',
      'Faf du Plessis',
      'Glenn Maxwell',
      'Rajat Patidar',
      'Dinesh Karthik',
      'Will Jacks',
      'Cameron Green',
      'Anuj Rawat',
      'Mahipal Lomror',
      'Suyash Prabhudessai'
    ],
    bowlers: [
      { name: 'M. Siraj', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'L. Ferguson', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#e0a980', faceStyle: 'headband' },
      { name: 'Yash Dayal', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Swapnil Singh', type: 'leftarm_orthodox', arm: 'left', angle: 'over', action: 'finger_spin', skinTone: '#c68656', faceStyle: 'beard' },
      { name: 'Karn Sharma', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic' }
    ]
  },

  KKR: {
    code: 'KKR',
    name: 'Kolkata Knight Riders',
    fullName: 'Kolkata Knight Riders',
    badge: '⚔️',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_kkr'),
    batsmen: [
      'Phil Salt',
      'Sunil Narine',
      'Shreyas Iyer',
      'Rinku Singh',
      'Andre Russell',
      'Venkatesh Iyer',
      'Ramandeep Singh',
      'Angkrish Raghuvanshi',
      'Nitish Rana',
      'Rahmanullah Gurbaz'
    ],
    bowlers: [
      { name: 'Sunil Narine', type: 'offspin', arm: 'right', angle: 'around', action: 'unorthodox', skinTone: '#5a3d28', faceStyle: 'spiky' },
      { name: 'V. Chakaravarthy', type: 'offspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#b57948', faceStyle: 'beard' },
      { name: 'M. Starc', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic' },
      { name: 'Harshit Rana', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'A. Russell', type: 'fastmedium', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#5a3d28', faceStyle: 'spiky' }
    ]
  },

  SRH: {
    code: 'SRH',
    name: 'Sunrisers Hyderabad',
    fullName: 'Sunrisers Hyderabad',
    badge: '🦅',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_srh'),
    batsmen: [
      'Abhishek Sharma',
      'Travis Head',
      'Heinrich Klaasen',
      'Aiden Markram',
      'Nitish Reddy',
      'Abdul Samad',
      'Shahbaz Ahmed',
      'Rahul Tripathi',
      'Anmolpreet Singh',
      'Sanvir Singh'
    ],
    bowlers: [
      { name: 'P. Cummins', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'headband' },
      { name: 'T. Natarajan', type: 'fastmedium', arm: 'left', angle: 'over', action: 'slingshot', skinTone: '#b57948', faceStyle: 'beard' },
      { name: 'B. Kumar', type: 'fastmedium', arm: 'right', angle: 'over', action: 'fast_swing', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Jaydev Unadkat', type: 'fastmedium', arm: 'left', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Mayank Markande', type: 'legspin', arm: 'right', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic' }
    ]
  },

  RR: {
    code: 'RR',
    name: 'Rajasthan Royals',
    fullName: 'Rajasthan Royals',
    badge: '🏰',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_rr'),
    batsmen: [
      'Yashasvi Jaiswal',
      'Sanju Samson',
      'Jos Buttler',
      'Riyan Parag',
      'Shimron Hetmyer',
      'Dhruv Jurel',
      'Rovman Powell',
      'Tom Kohler-Cadmore',
      'Donovan Ferreira',
      'Shubham Dubey'
    ],
    bowlers: [
      { name: 'T. Boult', type: 'fastmedium', arm: 'left', angle: 'around', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic' },
      { name: 'Y. Chahal', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Sandeep Sharma', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Avesh Khan', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'R. Ashwin', type: 'offspin', arm: 'right', angle: 'around', action: 'finger_spin', skinTone: '#b57948', faceStyle: 'classic' }
    ]
  },

  LSG: {
    code: 'LSG',
    name: 'Lucknow Super Giants',
    fullName: 'Lucknow Super Giants',
    badge: '🛡️',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_lsg'),
    batsmen: [
      'KL Rahul',
      'Nicholas Pooran',
      'Marcus Stoinis',
      'Ayush Badoni',
      'Deepak Hooda',
      'Quinton de Kock',
      'Krunal Pandya',
      'Devdutt Padikkal',
      'Arshin Kulkarni'
    ],
    bowlers: [
      { name: 'Mayank Yadav', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Ravi Bishnoi', type: 'legspin', arm: 'right', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Naveen-ul-Haq', type: 'fastmedium', arm: 'right', angle: 'around', action: 'slingshot', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Mohsin Khan', type: 'fastmedium', arm: 'left', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Yash Thakur', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic' }
    ]
  },

  DC: {
    code: 'DC',
    name: 'Delhi Capitals',
    fullName: 'Delhi Capitals',
    badge: '🐯',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_dc'),
    batsmen: [
      'Rishabh Pant',
      'Jake Fraser-McGurk',
      'Tristan Stubbs',
      'Axar Patel',
      'Abishek Porel',
      'David Warner',
      'Shai Hope',
      'Prithvi Shaw',
      'Kumar Kushagra'
    ],
    bowlers: [
      { name: 'K. Yadav', type: 'leftarm_chinaman', arm: 'left', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Khaleel Ahmed', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'A. Nortje', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic' },
      { name: 'Mukesh Kumar', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Ishant Sharma', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'beard' }
    ]
  },

  GT: {
    code: 'GT',
    name: 'Gujarat Titans',
    fullName: 'Gujarat Titans',
    badge: '⚡',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_gt'),
    batsmen: [
      'Shubman Gill',
      'Sai Sudharsan',
      'David Miller',
      'Rahul Tewatia',
      'Shahrukh Khan',
      'Rashid Khan',
      'Wriddhiman Saha',
      'Vijay Shankar',
      'Kane Williamson'
    ],
    bowlers: [
      { name: 'Rashid Khan', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'beard' },
      { name: 'Mohit Sharma', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Noor Ahmad', type: 'leftarm_chinaman', arm: 'left', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Spencer Johnson', type: 'fast', arm: 'left', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic' },
      { name: 'Umesh Yadav', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'beard' }
    ]
  },

  PBKS: {
    code: 'PBKS',
    name: 'Punjab Kings',
    fullName: 'Punjab Kings',
    badge: '🦁',
    type: 'ipl',
    jersey: ALL_JERSEYS.find(j => j.id === 'jersey_pbks'),
    batsmen: [
      'Shashank Singh',
      'Ashutosh Sharma',
      'Sam Curran',
      'Jonny Bairstow',
      'Jitesh Sharma',
      'Prabhsimran Singh',
      'Rilee Rossouw',
      'Harpreet Brar',
      'Liam Livingstone'
    ],
    bowlers: [
      { name: 'Arshdeep Singh', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#c68656', faceStyle: 'turban' },
      { name: 'K. Rabada', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'classic' },
      { name: 'Harshal Patel', type: 'fastmedium', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#c68656', faceStyle: 'beard' },
      { name: 'Rahul Chahar', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic' },
      { name: 'Harpreet Brar', type: 'leftarm_orthodox', arm: 'left', angle: 'around', action: 'finger_spin', skinTone: '#c68656', faceStyle: 'turban' }
    ]
  }
};

// Global consolidated list of bowlers across all countries
export const GLOBAL_WORLD_BOWLERS = [
  { name: 'J. Bumrah', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#c68656', faceStyle: 'beard', team: 'IND' },
  { name: 'K. Rabada', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'classic', team: 'SA' },
  { name: 'M. Starc', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic', team: 'AUS' },
  { name: 'P. Cummins', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'headband', team: 'AUS' },
  { name: 'S. Afridi', type: 'fast', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#d49b70', faceStyle: 'headband', team: 'PAK' },
  { name: 'Rashid Khan', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'beard', team: 'AFG' },
  { name: 'A. Nortje', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#e0a980', faceStyle: 'classic', team: 'SA' },
  { name: 'Arshdeep Singh', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing', skinTone: '#c68656', faceStyle: 'turban', team: 'IND' },
  { name: 'J. Archer', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#5a3d28', faceStyle: 'headband', team: 'ENG' },
  { name: 'T. Boult', type: 'fastmedium', arm: 'left', angle: 'around', action: 'fast_swing', skinTone: '#e0a980', faceStyle: 'classic', team: 'NZ' },
  { name: 'M. Pathirana', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#b57948', faceStyle: 'headband', team: 'SL' },
  { name: 'V. Chakaravarthy', type: 'offspin', arm: 'right', angle: 'over', action: 'wrist_spin', skinTone: '#b57948', faceStyle: 'beard', team: 'IND' },
  { name: 'A. Zampa', type: 'legspin', arm: 'right', angle: 'around', action: 'wrist_spin', skinTone: '#f5d0b0', faceStyle: 'headband', team: 'AUS' },
  { name: 'Haris Rauf', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot', skinTone: '#c68656', faceStyle: 'beard', team: 'PAK' },
  { name: 'K. Yadav', type: 'leftarm_chinaman', arm: 'left', angle: 'around', action: 'wrist_spin', skinTone: '#c68656', faceStyle: 'classic', team: 'IND' },
  { name: 'M. Jansen', type: 'fastmedium', arm: 'left', angle: 'over', action: 'high_arm', skinTone: '#f5d0b0', faceStyle: 'classic', team: 'SA' },
  { name: 'Sunil Narine', type: 'offspin', arm: 'right', angle: 'around', action: 'unorthodox', skinTone: '#5a3d28', faceStyle: 'spiky', team: 'WI' },
  { name: 'N. Sarpotdar', type: 'fastmedium', arm: 'right', angle: 'over', action: 'high_arm', skinTone: '#c68656', faceStyle: 'afro', team: 'IND' }
];

// Global consolidated list of batsmen across all countries
export const GLOBAL_BATSMEN_LINEUP = [
  'Abhishek Sharma',
  'Rohit Sharma',
  'Virat Kohli',
  'Suryakumar Yadav',
  'Ryan Rickelton',
  'Aiden Markram',
  'Heinrich Klaasen',
  'Travis Head',
  'Jos Buttler',
  'Phil Salt',
  'Hardik Pandya',
  'Glenn Maxwell',
  'Nicholas Pooran',
  'Babar Azam',
  'Mohammad Rizwan',
  'Tristan Stubbs',
  'David Miller',
  'Rinku Singh',
  'Sanju Samson',
  'Andre Russell',
  'Finn Allen',
  'Rahmanullah Gurbaz',
  'Pathum Nissanka'
];

export function getTeam(teamCode) {
  if (!teamCode) return TEAMS.IND;
  const upper = teamCode.toUpperCase();
  return TEAMS[upper] || TEAMS.IND;
}
