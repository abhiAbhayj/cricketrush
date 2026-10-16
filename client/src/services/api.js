import { storageService } from './storage';

// Base API URL: In development with local server or Capacitor Android
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = {
  // Fetch challenges (server + local fallback)
  getChallenges: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/challenges`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        // Merge with locally created challenges so player always sees their creations
        const localList = storageService.getLocalChallenges();
        const serverList = data.challenges || [];
        const map = new Map();
        serverList.forEach(c => map.set(c.code, c));
        localList.forEach(c => map.set(c.code, c));
        return Array.from(map.values());
      }
    } catch {
      console.warn('Backend server offline or unreachable. Falling back to local offline challenges.');
    }
    // Fallback: local + defaults
    const local = storageService.getLocalChallenges();
    const defaults = [
      {
        code: "CHASE6",
        title: "Super Over Miracle",
        author: "Coach Ravi",
        targetRuns: 22,
        ballsAllowed: 6,
        wicketsAllowed: 2,
        bowlerType: "fast",
        difficulty: "Hard",
        description: "22 runs needed in the final 1-over thriller against 150 km/h toe-crushing yorkers!",
        plays: 2410,
        clears: 490
      },
      {
        code: "SPIN6",
        title: "Super Over Mystery Spin",
        author: "CricketKing",
        targetRuns: 20,
        ballsAllowed: 6,
        wicketsAllowed: 1,
        bowlerType: "legspin",
        difficulty: "Hard",
        description: "Sharp turning googlies, flippers and drift. 20 runs needed in 6 deliveries!",
        plays: 1890,
        clears: 410
      },
      {
        code: "CHASE12",
        title: "12-Ball Death Over Blast",
        author: "CaptainCool",
        targetRuns: 34,
        ballsAllowed: 12,
        wicketsAllowed: 2,
        bowlerType: "fastmedium",
        difficulty: "Hard",
        description: "Score 34 in 2 death overs against reverse-swinging cutters and dippers!",
        plays: 1920,
        clears: 510
      },
      {
        code: "BLITZ16",
        title: "16-Ball Hundred Blitz",
        author: "StarStriker",
        targetRuns: 38,
        ballsAllowed: 16,
        wicketsAllowed: 3,
        bowlerType: "offspin",
        difficulty: "Medium",
        description: "38 runs off 16 deliveries! Attack the off-breaks, doosras and flighted drifters.",
        plays: 1540,
        clears: 440
      },
      {
        code: "DEATH18",
        title: "18-Ball Death Overs Final",
        author: "JAJ Skipper",
        targetRuns: 43,
        ballsAllowed: 18,
        wicketsAllowed: 3,
        bowlerType: "fast",
        difficulty: "Extreme",
        description: "Need 43 off 18 balls! The ultimate death overs chase with roaring stadium crowd.",
        plays: 3240,
        clears: 580
      },
      {
        code: "POWER20",
        title: "20-Ball Powerplay Surge",
        author: "PowerHitter99",
        targetRuns: 46,
        ballsAllowed: 20,
        wicketsAllowed: 3,
        bowlerType: "mediumfast",
        difficulty: "Hard",
        description: "Infield ring is up! Clear extra cover and square leg for 46 runs off 20 balls.",
        plays: 1650,
        clears: 420
      },
      {
        code: "SPIN22",
        title: "22-Ball Spin Web Siege",
        author: "SpinDoctor",
        targetRuns: 52,
        ballsAllowed: 22,
        wicketsAllowed: 3,
        bowlerType: "legspin",
        difficulty: "Extreme",
        description: "52 runs off 22 deliveries against sharp turning wrist-spin, flippers and top-spin!",
        plays: 1480,
        clears: 320
      },
      {
        code: "CHASE24",
        title: "24-Ball Middle Overs Squeeze",
        author: "MasterBlaster",
        targetRuns: 54,
        ballsAllowed: 24,
        wicketsAllowed: 4,
        bowlerType: "offspin",
        difficulty: "Hard",
        description: "4 overs, 54 runs to win! Find the gaps against tight finger-spin and carrom balls.",
        plays: 1870,
        clears: 395
      },
      {
        code: "CHASE30",
        title: "30-Ball T5 Championship",
        author: "LegendWillows",
        targetRuns: 70,
        ballsAllowed: 30,
        wicketsAllowed: 5,
        bowlerType: "fast",
        difficulty: "Extreme",
        description: "The full 5-over championship chase! 70 runs required to lift the trophy.",
        plays: 2820,
        clears: 410
      }
    ];
    return [...local, ...defaults.filter(d => !local.some(l => l.code === d.code))];
  },

  // Get specific challenge by code
  getChallengeByCode: async (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    
    // Check local first
    const localList = storageService.getLocalChallenges();
    const localMatch = localList.find(c => c.code.toUpperCase() === cleanCode);
    if (localMatch) return localMatch;

    try {
      const res = await fetch(`${API_BASE_URL}/challenges/${cleanCode}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return data.challenge;
      }
    } catch {
      console.warn(`Backend unreachable for challenge code ${cleanCode}`);
    }

    // Check defaults
    const defaults = await api.getChallenges();
    return defaults.find(c => c.code.toUpperCase() === cleanCode) || null;
  },

  // Create custom challenge
  createChallenge: async (challengeData) => {
    // Generate clean unique code locally as guarantee
    const generatedCode = challengeData.customCode 
      ? challengeData.customCode.trim().toUpperCase() 
      : Math.random().toString(36).substring(2, 8).toUpperCase();

    const newChallenge = {
      ...challengeData,
      code: generatedCode,
      createdAt: new Date().toISOString(),
      plays: 0,
      clears: 0
    };

    // Save to local storage right away for offline reliability
    storageService.saveLocalChallenge(newChallenge);

    // Try saving to backend
    try {
      const res = await fetch(`${API_BASE_URL}/challenges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChallenge),
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const data = await res.json();
        return data.challenge;
      }
    } catch (e) {
      console.warn('Saved challenge locally (server offline):', e.message);
    }

    return newChallenge;
  },

  // Submit match score
  submitScore: async (scoreData) => {
    // Always save locally
    storageService.saveLocalScore(scoreData);

    try {
      const res = await fetch(`${API_BASE_URL}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Score saved locally, server offline:', e.message);
    }

    return { success: true, localOnly: true };
  },

  // Fetch leaderboard
  getLeaderboard: async (mode = 'All') => {
    try {
      const url = mode === 'All' ? `${API_BASE_URL}/leaderboard` : `${API_BASE_URL}/leaderboard?mode=${encodeURIComponent(mode)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return data.leaderboard || [];
      }
    } catch {
      console.warn('Leaderboard server offline, showing local scores');
    }

    // Fallback: local scores
    return storageService.getLocalScores();
  },

  // Fetch quests
  getQuests: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/quests`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return data.quests || [];
      }
    } catch {
      // Fallback
    }

    return [
      { id: "q1", title: "Boundary Maestro", description: "Hit 3 sixes across any match", target: 3, rewardCoins: 150, rewardXP: 100, type: "sixes" },
      { id: "q2", title: "Clutch Chaser", description: "Win 2 Quick Play chases", target: 2, rewardCoins: 200, rewardXP: 150, type: "chases" },
      { id: "q3", title: "Flawless Innings", description: "Win a match without losing a wicket", target: 1, rewardCoins: 250, rewardXP: 200, type: "no_wickets" },
      { id: "q4", title: "Challenge Connoisseur", description: "Play 1 community or custom challenge", target: 1, rewardCoins: 100, rewardXP: 80, type: "play_challenge" }
    ];
  }
};
