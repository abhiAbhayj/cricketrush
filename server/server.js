import express from 'express';
import cors from 'cors';
import { db } from './database.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', game: 'Cricket Rush', timestamp: new Date().toISOString() });
});

// List all challenges
app.get('/api/challenges', (req, res) => {
  try {
    const challenges = db.getChallenges();
    res.json({ success: true, count: challenges.length, challenges });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve challenges' });
  }
});

// Fetch challenge by unique code
app.get('/api/challenges/:code', (req, res) => {
  try {
    const { code } = req.params;
    const challenge = db.getChallengeByCode(code);
    if (!challenge) {
      return res.status(404).json({ success: false, message: `Challenge code '${code}' not found.` });
    }
    res.json({ success: true, challenge });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch challenge' });
  }
});

// Create and store a custom user challenge
app.post('/api/challenges', (req, res) => {
  try {
    const { title, author, targetRuns, ballsAllowed, wicketsAllowed, bowlerType, difficulty, description, stadium, customCode } = req.body;
    
    if (!targetRuns || !ballsAllowed) {
      return res.status(400).json({ 
        success: false, 
        message: 'targetRuns and ballsAllowed are required fields.' 
      });
    }

    const newChallenge = db.createChallenge({
      title: title || 'Custom Chase',
      author: author || 'Guest Striker',
      targetRuns: parseInt(targetRuns, 10),
      ballsAllowed: parseInt(ballsAllowed, 10),
      wicketsAllowed: wicketsAllowed ? parseInt(wicketsAllowed, 10) : 2,
      bowlerType: bowlerType || 'fast',
      difficulty: difficulty || 'Medium',
      description: description || `Chase ${targetRuns} off ${ballsAllowed} balls!`,
      stadium: stadium || 'The Colosseum',
      customCode
    });

    res.status(201).json({
      success: true,
      message: 'Challenge created successfully!',
      challenge: newChallenge
    });
  } catch (err) {
    console.error('Error creating challenge:', err);
    res.status(500).json({ success: false, message: 'Internal server error while creating challenge' });
  }
});

// Get global leaderboards
app.get('/api/leaderboard', (req, res) => {
  try {
    const { mode } = req.query;
    const leaderboard = db.getLeaderboard(mode);
    res.json({ success: true, count: leaderboard.length, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve leaderboard' });
  }
});

// Submit match results and update stats
app.post('/api/scores', (req, res) => {
  try {
    const { playerName, score, ballsFaced, strikeRate, sixes, fours, mode, challengeCode, won } = req.body;

    if (score === undefined || score === null) {
      return res.status(400).json({ success: false, message: 'Score is required.' });
    }

    const savedEntry = db.addScore({
      playerName: playerName || 'Anonymous Hitter',
      score: parseInt(score, 10),
      ballsFaced: parseInt(ballsFaced, 10) || 1,
      strikeRate: strikeRate ? parseFloat(strikeRate) : undefined,
      sixes: parseInt(sixes, 10) || 0,
      fours: parseInt(fours, 10) || 0,
      mode: mode || 'Quick Play',
      challengeCode: challengeCode || null,
      won: Boolean(won)
    });

    res.status(201).json({
      success: true,
      message: 'Score recorded successfully!',
      entry: savedEntry
    });
  } catch (err) {
    console.error('Error recording score:', err);
    res.status(500).json({ success: false, message: 'Internal server error recording score' });
  }
});

// Get quests list
app.get('/api/quests', (req, res) => {
  try {
    const quests = db.getQuests();
    res.json({ success: true, quests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch quests' });
  }
});

app.listen(PORT, () => {
  console.log(`🏏 Cricket Rush Server running on http://localhost:${PORT}`);
});
