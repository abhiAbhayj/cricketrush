import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import CricketGame from './components/CricketGame';
import NetPractice from './components/NetPractice';
import ChallengeList from './components/ChallengeList';
import ChallengeCreator from './components/ChallengeCreator';
import CampaignModal from './components/CampaignModal';
import QuestsModal from './components/QuestsModal';
import ShopModal from './components/ShopModal';
import LeaderboardModal from './components/LeaderboardModal';
import SettingsModal from './components/SettingsModal';
import GameOverModal from './components/GameOverModal';
import { storageService } from './services/storage';
import { api } from './services/api';
import { sound } from './game/SoundEffects';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('MENU');
  const [profile, setProfile] = useState(storageService.getProfile());
  const [settings, setSettings] = useState(storageService.getSettings());
  const [activeMatchConfig, setActiveMatchConfig] = useState(null);
  const [lastMatchResult, setLastMatchResult] = useState(null);

  // Check URL hash for shared challenge links (e.g. #challenge=CHASE6)
  useEffect(() => {
    const handleUrlHash = async () => {
      const hash = window.location.hash;
      if (hash.includes('challenge=')) {
        const code = hash.split('challenge=')[1]?.split('&')[0];
        if (code) {
          const found = await api.getChallengeByCode(code);
          if (found) {
            startMatch({
              title: found.title,
              targetRuns: found.targetRuns,
              ballsAllowed: found.ballsAllowed,
              wicketsAllowed: found.wicketsAllowed,
              bowlerType: found.bowlerType,
              stadiumKey: found.stadiumKey || 'colosseum',
              code: found.code
            });
          }
        }
      }
    };

    handleUrlHash();
    window.addEventListener('hashchange', handleUrlHash);
    return () => window.removeEventListener('hashchange', handleUrlHash);
  }, []);

  // Quick Play Match Launcher with authentic 1, 2, 3 over, 16, 20, 24, 30 ball chase scenarios
  const startQuickPlay = (selectedBalls = null) => {
    // Comprehensive roster of authentic world-class bowlers with matching styles, arm sides and actions
    const BOWLER_ROSTER = [
      { name: 'J. Bumrah', type: 'fast', arm: 'right', angle: 'over', action: 'slingshot' },
      { name: 'M. Starc', type: 'fastmedium', arm: 'left', angle: 'over', action: 'fast_swing' },
      { name: 'R. Jadeja', type: 'leftarm_orthodox', arm: 'left', angle: 'over', action: 'finger_spin' },
      { name: 'Rashid Khan', type: 'legspin', arm: 'right', angle: 'over', action: 'wrist_spin' },
      { name: 'R. Ashwin', type: 'offspin', arm: 'right', angle: 'around', action: 'finger_spin' },
      { name: 'S. Afridi', type: 'fast', arm: 'left', angle: 'over', action: 'fast_swing' },
      { name: 'K. Yadav', type: 'leftarm_chinaman', arm: 'left', angle: 'around', action: 'wrist_spin' },
      { name: 'P. Cummins', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm' },
      { name: 'J. Archer', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm' },
      { name: 'T. Boult', type: 'fastmedium', arm: 'left', angle: 'around', action: 'fast_swing' },
      { name: 'Sunil Narine', type: 'offspin', arm: 'right', angle: 'around', action: 'unorthodox' },
      { name: 'A. Nortje', type: 'fast', arm: 'right', angle: 'over', action: 'high_arm' }
    ];

    const BATSMEN_LINEUP = [
      profile?.playerName || 'V. Kohli',
      'R. Sharma',
      'S. Gill',
      'S. Yadav',
      'KL Rahul',
      'H. Pandya',
      'R. Pant',
      'A. Patel',
      'T. Head',
      'H. Klaasen',
      'G. Maxwell'
    ];

    const chosenBowler = BOWLER_ROSTER[Math.floor(Math.random() * BOWLER_ROSTER.length)];

    const ballOptions = [6, 12, 16, 18, 20, 24, 30];
    const ballsAllowed = selectedBalls || ballOptions[Math.floor(Math.random() * ballOptions.length)];

    let targetRuns = 22;
    let wicketsAllowed = 2;
    let matchPhase = 'DEATH OVERS';
    let roundTitle = 'ROUND 1';

    if (ballsAllowed === 6) {
      targetRuns = 19 + Math.floor(Math.random() * 6); // 19 - 24 runs in 1 over
      wicketsAllowed = 2;
      matchPhase = 'SUPER OVER';
      roundTitle = 'SUPER OVER FINAL';
    } else if (ballsAllowed === 12) {
      targetRuns = 34 + Math.floor(Math.random() * 8); // 34 - 41 runs in 2 overs
      wicketsAllowed = 2;
      matchPhase = 'DEATH OVERS';
      roundTitle = 'ROUND 1';
    } else if (ballsAllowed === 16) {
      targetRuns = 38 + Math.floor(Math.random() * 8); // 38 - 45 runs in 16 balls
      wicketsAllowed = 3;
      matchPhase = 'DEATH OVERS';
      roundTitle = 'ROUND 2';
    } else if (ballsAllowed === 18) {
      targetRuns = 43; // Exact match to Image 1 & 2 ("Need 43 off 24" or 18 balls)
      wicketsAllowed = 3;
      matchPhase = 'DEATH OVERS';
      roundTitle = 'ROUND 1';
    } else if (ballsAllowed === 20) {
      targetRuns = 46 + Math.floor(Math.random() * 10);
      wicketsAllowed = 3;
      matchPhase = 'POWERPLAY';
      roundTitle = 'POWERPLAY SURGE';
    } else if (ballsAllowed === 24) {
      targetRuns = 52 + Math.floor(Math.random() * 10);
      wicketsAllowed = 4;
      matchPhase = 'MIDDLE OVERS';
      roundTitle = 'CHASE MASTER';
    } else if (ballsAllowed === 30) {
      targetRuns = 68 + Math.floor(Math.random() * 12);
      wicketsAllowed = 5;
      matchPhase = 'CHASE MASTER';
      roundTitle = 'T5 CHAMPIONSHIP';
    }

    startMatch({
      title: `${ballsAllowed}-Ball ${matchPhase}`,
      targetRuns,
      ballsAllowed,
      wicketsAllowed,
      bowlerName: chosenBowler.name,
      bowlerType: chosenBowler.type,
      bowlingArm: chosenBowler.arm,
      bowlingAngle: chosenBowler.angle,
      bowlerAction: chosenBowler.action,
      strikerName: BATSMEN_LINEUP[0],
      nonStrikerName: BATSMEN_LINEUP[1],
      battingLineup: BATSMEN_LINEUP,
      stadiumKey: 'colosseum',
      matchPhase,
      roundTitle,
      teamCode: 'JAJ',
      teamScoreBase: 124,
      teamWicketsBase: 1
    });
  };

  const startMatch = (config) => {
    setActiveMatchConfig(config);
    setLastMatchResult(null);
    setCurrentScreen('GAME');
  };

  const handleGameOver = (result) => {
    setLastMatchResult(result);
  };

  const handlePlayAgain = () => {
    if (activeMatchConfig) {
      setLastMatchResult(null);
      setCurrentScreen('MENU');
      setTimeout(() => {
        setCurrentScreen('GAME');
      }, 50);
    }
  };

  return (
    <main className="w-full h-full relative overflow-hidden bg-cricket-dark text-slate-100 flex flex-col font-sans select-none">
      {/* Screen Router */}
      {currentScreen === 'MENU' && (
        <MainMenu
          profile={profile}
          onStartQuickPlay={startQuickPlay}
          onOpenPractice={() => setCurrentScreen('PRACTICE')}
          onOpenChallenges={() => setCurrentScreen('CHALLENGES')}
          onOpenCreator={() => setCurrentScreen('CREATOR')}
          onOpenCampaign={() => setCurrentScreen('CAMPAIGN')}
          onOpenQuests={() => setCurrentScreen('QUESTS')}
          onOpenShop={() => setCurrentScreen('SHOP')}
          onOpenLeaderboard={() => setCurrentScreen('LEADERBOARD')}
          onOpenSettings={() => setCurrentScreen('SETTINGS')}
        />
      )}

      {currentScreen === 'PRACTICE' && (
        <NetPractice
          onBack={() => setCurrentScreen('MENU')}
          profile={profile}
          settings={settings}
        />
      )}

      {currentScreen === 'CHALLENGES' && (
        <ChallengeList
          onBack={() => setCurrentScreen('MENU')}
          onPlayChallenge={(c) => startMatch({
            title: c.title,
            targetRuns: c.targetRuns,
            ballsAllowed: c.ballsAllowed,
            wicketsAllowed: c.wicketsAllowed,
            bowlerType: c.bowlerType,
            bowlingArm: c.bowlingArm || (c.bowlerType?.includes('leftarm') ? 'left' : 'right'),
            bowlingAngle: c.bowlingAngle || 'over',
            stadiumKey: c.stadiumKey || 'colosseum',
            code: c.code
          })}
          onCreateNew={() => setCurrentScreen('CREATOR')}
        />
      )}

      {currentScreen === 'CREATOR' && (
        <ChallengeCreator
          profile={profile}
          onBack={() => setCurrentScreen('MENU')}
          onPlayChallenge={(c) => startMatch({
            title: c.title,
            targetRuns: c.targetRuns,
            ballsAllowed: c.ballsAllowed,
            wicketsAllowed: c.wicketsAllowed,
            bowlerType: c.bowlerType,
            bowlingArm: c.bowlingArm || (c.bowlerType?.includes('leftarm') ? 'left' : 'right'),
            bowlingAngle: c.bowlingAngle || 'over',
            stadiumKey: c.stadiumKey || 'colosseum',
            code: c.code
          })}
        />
      )}

      {currentScreen === 'CAMPAIGN' && (
        <CampaignModal
          profile={profile}
          onBack={() => setCurrentScreen('MENU')}
          onStartLevel={(lvl) => startMatch({
            title: lvl.title,
            targetRuns: lvl.targetRuns,
            ballsAllowed: lvl.ballsAllowed,
            wicketsAllowed: lvl.wicketsAllowed,
            bowlerType: lvl.bowlerType,
            bowlingArm: lvl.bowlingArm || (lvl.bowlerType?.includes('leftarm') ? 'left' : 'right'),
            bowlingAngle: lvl.bowlingAngle || 'over',
            stadiumKey: lvl.stadiumKey,
            campaignLevelId: lvl.campaignLevelId
          })}
        />
      )}

      {currentScreen === 'QUESTS' && (
        <QuestsModal
          onBack={() => setCurrentScreen('MENU')}
          onProfileUpdate={(updated) => setProfile(updated)}
        />
      )}

      {currentScreen === 'SHOP' && (
        <ShopModal
          profile={profile}
          onProfileUpdate={(updated) => setProfile(updated)}
          onBack={() => setCurrentScreen('MENU')}
        />
      )}

      {currentScreen === 'LEADERBOARD' && (
        <LeaderboardModal
          onBack={() => setCurrentScreen('MENU')}
        />
      )}

      {currentScreen === 'SETTINGS' && (
        <SettingsModal
          profile={profile}
          onProfileUpdate={(updated) => setProfile(updated)}
          settings={settings}
          onSettingsUpdate={(updated) => setSettings(updated)}
          onBack={() => setCurrentScreen('MENU')}
        />
      )}

      {currentScreen === 'GAME' && (
        <CricketGame
          matchConfig={activeMatchConfig}
          onGameOver={handleGameOver}
          onBackToMenu={() => setCurrentScreen('MENU')}
          profile={profile}
          settings={settings}
        />
      )}

      {/* Game Over Modal Overlay */}
      {lastMatchResult && (
        <GameOverModal
          matchResult={lastMatchResult}
          matchConfig={activeMatchConfig}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={() => {
            setLastMatchResult(null);
            setCurrentScreen('MENU');
          }}
          onOpenPractice={() => {
            setLastMatchResult(null);
            setCurrentScreen('PRACTICE');
          }}
          profile={profile}
          onProfileUpdate={(updated) => setProfile(updated)}
        />
      )}
    </main>
  );
}
