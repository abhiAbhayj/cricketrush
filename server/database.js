import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data.json');

const INITIAL_DATA = {
  challenges: [
    {
      code: "CHASE10",
      title: "10-Ball Power Play",
      author: "Coach Ravi",
      targetRuns: 28,
      ballsAllowed: 10,
      wicketsAllowed: 2,
      bowlerType: "fast",
      difficulty: "Hard",
      description: "28 runs required off 10 balls against fiery 145 km/h pace bowling!",
      plays: 1450,
      clears: 312,
      createdAt: new Date().toISOString()
    },
    {
      code: "CHASE12",
      title: "12-Ball Death Over Thriller",
      author: "CaptainCool",
      targetRuns: 34,
      ballsAllowed: 12,
      wicketsAllowed: 2,
      bowlerType: "fastmedium",
      difficulty: "Hard",
      description: "Can you score 34 in 2 overs against yorkers and slower ball cutters?",
      plays: 1120,
      clears: 380,
      createdAt: new Date().toISOString()
    },
    {
      code: "SPIN22",
      title: "22-Ball Spin Siege",
      author: "SpinDoctor",
      targetRuns: 55,
      ballsAllowed: 22,
      wicketsAllowed: 3,
      bowlerType: "legspin",
      difficulty: "Extreme",
      description: "55 runs off 22 deliveries against sharp turning googlies, flippers and top-spinners!",
      plays: 980,
      clears: 210,
      createdAt: new Date().toISOString()
    },
    {
      code: "CHASE30",
      title: "30-Ball Power Surge",
      author: "StarStriker",
      targetRuns: 70,
      ballsAllowed: 30,
      wicketsAllowed: 4,
      bowlerType: "offspin",
      difficulty: "Extreme",
      description: "Chase 70 runs in 5 overs! Use charge-down loft and delicate gap cuts.",
      plays: 1840,
      clears: 340,
      createdAt: new Date().toISOString()
    },
    {
      code: "CHASE40",
      title: "40-Ball Stadium Climax",
      author: "MasterBlaster",
      targetRuns: 92,
      ballsAllowed: 40,
      wicketsAllowed: 5,
      bowlerType: "mediumfast",
      difficulty: "Extreme",
      description: "High pressure 40-ball chase! Keep wickets intact while punishing the loose deliveries.",
      plays: 870,
      clears: 195,
      createdAt: new Date().toISOString()
    },
    {
      code: "CHASE60",
      title: "60-Ball T10 Chase Epic",
      author: "LegendWillows",
      targetRuns: 138,
      ballsAllowed: 60,
      wicketsAllowed: 7,
      bowlerType: "fast",
      difficulty: "Extreme",
      description: "The full 10-over mini-innings epic! 138 runs to glory in front of a roaring crowd.",
      plays: 2420,
      clears: 290,
      createdAt: new Date().toISOString()
    },
    {
      code: "CHASE6",
      title: "Super Over Miracle",
      author: "Coach Ravi",
      targetRuns: 24,
      ballsAllowed: 6,
      wicketsAllowed: 2,
      bowlerType: "fast",
      difficulty: "Hard",
      description: "24 runs needed in the final over against 150 km/h reverse swing!",
      plays: 1240,
      clears: 285,
      createdAt: new Date().toISOString()
    },
    {
      code: "SPIN36",
      title: "Mystery Spinner Web",
      author: "CricketKing",
      targetRuns: 20,
      ballsAllowed: 6,
      wicketsAllowed: 1,
      bowlerType: "spin",
      difficulty: "Medium",
      description: "Sharp turning googlies and sliders. Can you hit 3 boundaries?",
      plays: 890,
      clears: 410,
      createdAt: new Date().toISOString()
    },
    {
      code: "BLITZ30",
      title: "Max Sixes Blitz",
      author: "PowerHitter99",
      targetRuns: 36,
      ballsAllowed: 6,
      wicketsAllowed: 1,
      bowlerType: "fast",
      difficulty: "Extreme",
      description: "Can you pull off the mythical 6 sixes in 6 balls? Only for legends!",
      plays: 3410,
      clears: 42,
      createdAt: new Date().toISOString()
    }
  ],
  leaderboard: [
    { id: "1", playerName: "MasterBlaster", score: 42, ballsFaced: 6, strikeRate: 700.0, sixes: 6, mode: "Quick Play", won: true, date: "2026-10-15" },
    { id: "2", playerName: "CaptainCool", score: 34, ballsFaced: 6, strikeRate: 566.6, sixes: 4, mode: "Super Over Miracle", won: true, date: "2026-10-14" },
    { id: "3", playerName: "BoomBoom", score: 32, ballsFaced: 5, strikeRate: 640.0, sixes: 5, mode: "Quick Play", won: true, date: "2026-10-15" },
    { id: "4", playerName: "SkyRocker", score: 28, ballsFaced: 6, strikeRate: 466.6, sixes: 3, mode: "Mystery Spinner Web", won: true, date: "2026-10-13" },
    { id: "5", playerName: "YorkerHunter", score: 26, ballsFaced: 6, strikeRate: 433.3, sixes: 3, mode: "Quick Play", won: true, date: "2026-10-12" },
    { id: "6", playerName: "HelicopterShot", score: 24, ballsFaced: 4, strikeRate: 600.0, sixes: 4, mode: "Quick Play", won: true, date: "2026-10-11" }
  ],
  quests: [
    { id: "q1", title: "Boundary Maestro", description: "Hit 3 sixes across any match", target: 3, rewardCoins: 150, rewardXP: 100, type: "sixes" },
    { id: "q2", title: "Clutch Chaser", description: "Win 2 Quick Play chases", target: 2, rewardCoins: 200, rewardXP: 150, type: "chases" },
    { id: "q3", title: "Flawless Innings", description: "Win a match without losing a wicket", target: 1, rewardCoins: 250, rewardXP: 200, type: "no_wickets" },
    { id: "q4", title: "Challenge Connoisseur", description: "Play 1 community or custom challenge", target: 1, rewardCoins: 100, rewardXP: 80, type: "play_challenge" }
  ]
};

// Ensure database file exists
function loadDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading database file, using fallback initial data:", err);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

function saveDb(data) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

export const db = {
  getChallenges: () => {
    const data = loadDb();
    return data.challenges || [];
  },

  getChallengeByCode: (code) => {
    const data = loadDb();
    const upperCode = (code || '').trim().toUpperCase();
    return (data.challenges || []).find(c => c.code.toUpperCase() === upperCode) || null;
  },

  createChallenge: (challengeData) => {
    const data = loadDb();
    // Generate clean alphanumeric 6-character code
    const baseCode = challengeData.customCode 
      ? challengeData.customCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) 
      : Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Check if code exists; if so, append random digit
    let finalCode = baseCode;
    let attempts = 0;
    while (data.challenges.some(c => c.code === finalCode) && attempts < 10) {
      finalCode = `${baseCode}${Math.floor(Math.random() * 9)}`;
      attempts++;
    }

    const newChallenge = {
      code: finalCode,
      title: challengeData.title || "Custom Chase",
      author: challengeData.author || "Guest Player",
      targetRuns: Number(challengeData.targetRuns) || 20,
      ballsAllowed: Number(challengeData.ballsAllowed) || 6,
      wicketsAllowed: Number(challengeData.wicketsAllowed) || 2,
      bowlerType: challengeData.bowlerType || "fast", // 'fast' | 'spin' | 'swing'
      difficulty: challengeData.difficulty || "Medium",
      description: challengeData.description || `Chase ${challengeData.targetRuns} runs in ${challengeData.ballsAllowed} balls!`,
      stadium: challengeData.stadium || "The Colosseum",
      plays: 0,
      clears: 0,
      createdAt: new Date().toISOString()
    };

    data.challenges.unshift(newChallenge);
    saveDb(data);
    return newChallenge;
  },

  incrementChallengeStats: (code, won) => {
    const data = loadDb();
    const challenge = (data.challenges || []).find(c => c.code.toUpperCase() === (code || '').toUpperCase());
    if (challenge) {
      challenge.plays = (challenge.plays || 0) + 1;
      if (won) challenge.clears = (challenge.clears || 0) + 1;
      saveDb(data);
    }
  },

  getLeaderboard: (mode = null) => {
    const data = loadDb();
    let board = [...(data.leaderboard || [])];
    if (mode && mode !== 'All') {
      board = board.filter(item => item.mode === mode);
    }
    // Sort primarily by score desc, then strikeRate desc
    return board.sort((a, b) => b.score - a.score || b.strikeRate - a.strikeRate).slice(0, 50);
  },

  addScore: (scoreEntry) => {
    const data = loadDb();
    const entry = {
      id: Date.now().toString(),
      playerName: scoreEntry.playerName || "Anonymous Hitter",
      score: Number(scoreEntry.score) || 0,
      ballsFaced: Number(scoreEntry.ballsFaced) || 1,
      strikeRate: Number(scoreEntry.strikeRate) || Number(((scoreEntry.score / (scoreEntry.ballsFaced || 1)) * 100).toFixed(1)),
      sixes: Number(scoreEntry.sixes) || 0,
      fours: Number(scoreEntry.fours) || 0,
      mode: scoreEntry.mode || "Quick Play",
      challengeCode: scoreEntry.challengeCode || null,
      won: Boolean(scoreEntry.won),
      date: new Date().toISOString().split('T')[0]
    };

    data.leaderboard.push(entry);
    // Keep top 100
    data.leaderboard.sort((a, b) => b.score - a.score || b.strikeRate - a.strikeRate);
    if (data.leaderboard.length > 100) {
      data.leaderboard = data.leaderboard.slice(0, 100);
    }
    saveDb(data);

    if (scoreEntry.challengeCode) {
      const challenge = (data.challenges || []).find(c => c.code.toUpperCase() === scoreEntry.challengeCode.toUpperCase());
      if (challenge) {
        challenge.plays = (challenge.plays || 0) + 1;
        if (scoreEntry.won) challenge.clears = (challenge.clears || 0) + 1;
        saveDb(data);
      }
    }

    return entry;
  },

  getQuests: () => {
    const data = loadDb();
    return data.quests || [];
  }
};
