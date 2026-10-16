// Local Storage Service with offline support and profile tracking

const STORAGE_KEYS = {
  PROFILE: 'cricketrush_profile',
  CUSTOM_CHALLENGES: 'cricketrush_local_challenges',
  SCORES: 'cricketrush_local_scores',
  QUEST_PROGRESS: 'cricketrush_quest_progress',
  SETTINGS: 'cricketrush_settings'
};

const DEFAULT_PROFILE = {
  playerName: 'Cricket Fan',
  coins: 500,
  xp: 0,
  level: 1,
  campaignLevelUnlocked: 1, // Progressive campaign lock: Level 1 -> 2 -> 3 -> 4 -> 5
  dailyStreak: 2,
  lastPlayedDate: new Date().toDateString(),
  matchesPlayed: 0,
  matchesWon: 0,
  totalSixes: 0,
  totalFours: 0,
  highestScore: 0,
  equippedBat: 'willow',
  equippedJersey: 'blue',
  unlockedBats: ['willow'],
  unlockedJerseys: ['blue'],
  unlockedStadiums: ['colosseum']
};

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  controlMode: 'tap', // 'tap' or 'swipe'
  difficultyModifier: 1.0
};

export const storageService = {
  getProfile: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  updateProfile: (updates) => {
    try {
      const current = storageService.getProfile();
      const updated = { ...current, ...updates };
      // Check level up from XP (100 XP per level)
      const calculatedLevel = Math.floor(updated.xp / 100) + 1;
      if (calculatedLevel > updated.level) {
        updated.level = calculatedLevel;
        updated.coins += 150; // Level up bonus!
      }
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to update profile:', e);
      return DEFAULT_PROFILE;
    }
  },

  unlockCampaignLevel: (wonLevelId) => {
    const profile = storageService.getProfile();
    const currentUnlocked = profile.campaignLevelUnlocked || 1;
    if (wonLevelId >= currentUnlocked && currentUnlocked < 5) {
      const nextLevel = wonLevelId + 1;
      const updated = storageService.updateProfile({
        campaignLevelUnlocked: nextLevel,
        coins: profile.coins + 200 // Campaign completion bonus!
      });
      return { unlockedNext: true, nextLevel, profile: updated };
    }
    return { unlockedNext: false, nextLevel: currentUnlocked, profile };
  },

  addMatchReward: ({ runs, won, sixes, fours }) => {
    const profile = storageService.getProfile();
    const coinsEarned = (runs * 10) + (sixes * 25) + (won ? 150 : 30);
    const xpEarned = (runs * 15) + (won ? 100 : 25);

    // Calculate streak
    const today = new Date().toDateString();
    let streak = profile.dailyStreak || 1;
    if (profile.lastPlayedDate !== today) {
      streak += 1;
    }

    const updated = storageService.updateProfile({
      coins: profile.coins + coinsEarned,
      xp: profile.xp + xpEarned,
      matchesPlayed: profile.matchesPlayed + 1,
      matchesWon: profile.matchesWon + (won ? 1 : 0),
      totalSixes: profile.totalSixes + sixes,
      totalFours: profile.totalFours + fours,
      highestScore: Math.max(profile.highestScore, runs),
      dailyStreak: streak,
      lastPlayedDate: today
    });

    // Update quest progress
    storageService.recordQuestActions({ sixes, won, runs });

    return { coinsEarned, xpEarned, profile: updated };
  },

  getSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  getLocalScores: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCORES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveLocalScore: (entry) => {
    try {
      const scores = storageService.getLocalScores();
      scores.unshift({ ...entry, id: Date.now().toString(), date: new Date().toLocaleDateString() });
      if (scores.length > 30) scores.pop();
      localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
    } catch (e) {
      console.error('Failed to save local score:', e);
    }
  },

  getLocalChallenges: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_CHALLENGES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveLocalChallenge: (challenge) => {
    try {
      const list = storageService.getLocalChallenges();
      list.unshift(challenge);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CHALLENGES, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save local challenge:', e);
    }
  },

  getQuestProgress: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUEST_PROGRESS);
      return data ? JSON.parse(data) : {
        sixes: 0,
        chases: 0,
        no_wickets: 0,
        play_challenge: 0,
        claimed: []
      };
    } catch {
      return { sixes: 0, chases: 0, no_wickets: 0, play_challenge: 0, claimed: [] };
    }
  },

  recordQuestActions: ({ sixes = 0, won = false, lostWickets = 0, playedChallenge = false }) => {
    try {
      const progress = storageService.getQuestProgress();
      if (sixes > 0) progress.sixes = (progress.sixes || 0) + sixes;
      if (won) progress.chases = (progress.chases || 0) + 1;
      if (won && lostWickets === 0) progress.no_wickets = (progress.no_wickets || 0) + 1;
      if (playedChallenge) progress.play_challenge = (progress.play_challenge || 0) + 1;

      localStorage.setItem(STORAGE_KEYS.QUEST_PROGRESS, JSON.stringify(progress));
      return progress;
    } catch (e) {
      console.error('Failed to update quest progress:', e);
    }
  },

  claimQuest: (questId, rewardCoins, rewardXP) => {
    const progress = storageService.getQuestProgress();
    if (!progress.claimed) progress.claimed = [];
    if (!progress.claimed.includes(questId)) {
      progress.claimed.push(questId);
      localStorage.setItem(STORAGE_KEYS.QUEST_PROGRESS, JSON.stringify(progress));
      storageService.updateProfile({
        coins: storageService.getProfile().coins + rewardCoins,
        xp: storageService.getProfile().xp + rewardXP
      });
      return true;
    }
    return false;
  }
};
