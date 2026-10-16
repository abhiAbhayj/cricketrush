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
        clears: 312
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
        clears: 380
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
        clears: 210
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
        clears: 340
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
        clears: 195
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
        clears: 290
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
        clears: 285
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
        clears: 410
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
        clears: 42
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
