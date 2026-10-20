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
import ErrorBoundary from './components/ErrorBoundary';
import { storageService } from './services/storage';
import { api } from './services/api';
import { sound } from './game/SoundEffects';

import { TEAMS, ALL_JERSEYS, GLOBAL_WORLD_BOWLERS, GLOBAL_BATSMEN_LINEUP } from './game/TeamData';

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

  // Quick Play Match Launcher with authentic team rosters (Abhishek, Rohit, Virat, Rickelton, Markram, Klaasen, etc.)
  const startQuickPlay = (selectedBalls = null, battingTeamKey = 'IND', bowlingTeamKey = 'SA') => {
    // Resolve batting & bowling teams from comprehensive TEAMS registry
    const battingTeam = TEAMS[battingTeamKey] || TEAMS.IND;
    const bowlingTeam = TEAMS[bowlingTeamKey] || (battingTeamKey === 'SA' ? TEAMS.IND : TEAMS.SA);

    const BOWLER_ROSTER = (bowlingTeam.bowlers && bowlingTeam.bowlers.length > 0)
      ? bowlingTeam.bowlers
      : GLOBAL_WORLD_BOWLERS;

    const BATSMEN_LINEUP = (battingTeam.batsmen && battingTeam.batsmen.length > 0)
      ? battingTeam.batsmen
      : GLOBAL_BATSMEN_LINEUP;

    const chosenBowler = BOWLER_ROSTER[Math.floor(Math.random() * BOWLER_ROSTER.length)];

    const ballOptions = [6, 12, 16, 18, 20, 24, 30];
    const ballsAllowed = selectedBalls || ballOptions[Math.floor(Math.random() * ballOptions.length)];

    let targetRuns = 22;
    let wicketsAllowed = 2;
    let matchPhase = 'DEATH OVERS';
    let roundTitle = `${battingTeam.code} vs ${bowlingTeam.code}`;
    let teamScoreBase = 124;
    let teamWicketsBase = 1;
    let initialBalls = 102;

    if (ballsAllowed === 6) {
      targetRuns = 19 + Math.floor(Math.random() * 6); // 19 - 24 runs in 1 over
      wicketsAllowed = 2;
      matchPhase = 'SUPER OVER';
      roundTitle = `${battingTeam.code} vs ${bowlingTeam.code} • SUPER OVER`;
      teamScoreBase = 0;
      teamWicketsBase = 0;
      initialBalls = 0;
    } else if (ballsAllowed === 12) {
      targetRuns = 4; // Authentic situational chase matching reference (e.g. 167/7 needing 4 to win)
      wicketsAllowed = 3;
      matchPhase = 'DEATH OVERS';
      roundTitle = `${battingTeam.code} vs ${bowlingTeam.code} • THRILLER`;
      teamScoreBase = 167;
      teamWicketsBase = 7;
      initialBalls = 108;
    } else if (ballsAllowed === 16) {
      targetRuns = 38 + Math.floor(Math.random() * 8); // 38 - 45 runs in 16 balls
      wicketsAllowed = 3;
      matchPhase = 'DEATH OVERS';
      roundTitle = `${battingTeam.code} vs ${bowlingTeam.code} • CHASE`;
      teamScoreBase = 120;
      teamWicketsBase = 2;
      initialBalls = 104;
    } else if (ballsAllowed === 18) {
      targetRuns = 43; // Exact match to Image 1 & 2 ("Need 43 off 18 balls")
      wicketsAllowed = 3;
      matchPhase = 'DEATH OVERS';
      roundTitle = `${battingTeam.code} vs ${bowlingTeam.code} • MATCH PLAY`;
      teamScoreBase = 124;
      teamWicketsBase = 1;
      initialBalls = 102;
    } else if (ballsAllowed === 20) {
      targetRuns = 46 + Math.floor(Math.random() * 10);
      wicketsAllowed = 3;
      matchPhase = 'POWERPLAY';
      roundTitle = `${battingTeam.code} vs ${bowlingTeam.code} • POWERPLAY`;
      teamScoreBase = 105;
      teamWicketsBase = 2;
      initialBalls = 100;
    } else if (ballsAllowed === 24) {
      targetRuns = 52 + Math.floor(Math.random() * 10);
      wicketsAllowed = 4;
      matchPhase = 'MIDDLE OVERS';
      roundTitle = `${battingTeam.code} vs ${bowlingTeam.code} • CHASE MASTER`;
      teamScoreBase = 95;
      teamWicketsBase = 2;
      initialBalls = 96;
    } else if (ballsAllowed === 30) {
      targetRuns = 68 + Math.floor(Math.random() * 12);
      wicketsAllowed = 5;
      matchPhase = 'CHASE MASTER';
      roundTitle = `${battingTeam.code} vs ${bowlingTeam.code} • T5 CUP`;
      teamScoreBase = 80;
      teamWicketsBase = 2;
      initialBalls = 90;
    }

    // Striker and non-striker: strictly authentic international and IPL cricketers from team roster
    const primaryStriker = BATSMEN_LINEUP[0] || 'Rohit Sharma';
    const secondaryStriker = BATSMEN_LINEUP[1] || 'Virat Kohli';

    const safeWickets = Math.min(teamWicketsBase, Math.max(0, BATSMEN_LINEUP.length - 2));
    const strikerName = BATSMEN_LINEUP[safeWickets] || primaryStriker;
    const nonStrikerName = BATSMEN_LINEUP[(safeWickets + 1) % BATSMEN_LINEUP.length] || secondaryStriker;

    startMatch({
      title: `${battingTeam.name} vs ${bowlingTeam.name} (${ballsAllowed}B)`,
      targetRuns,
      ballsAllowed,
      wicketsAllowed,
      bowlerName: chosenBowler.name,
      bowlerType: chosenBowler.type,
      bowlingArm: chosenBowler.arm || 'right',
      bowlingAngle: chosenBowler.angle || 'over',
      bowlerAction: chosenBowler.action || 'high_arm',
      strikerName,
      nonStrikerName,
      battingLineup: BATSMEN_LINEUP,
      bowlerList: BOWLER_ROSTER,
      stadiumKey: 'colosseum',
      matchPhase,
      roundTitle,
      teamCode: battingTeam.code,
      teamJersey: battingTeam.jersey?.id || 'jersey_ind',
      bowlingTeamCode: bowlingTeam.code,
      bowlingJersey: bowlingTeam.jersey?.id || 'jersey_sa',
      teamScoreBase,
      teamWicketsBase,
      initialBalls
    });
  };

  const startMatch = (config) => {
    const fullConfig = {
      strikerName: 'Rohit Sharma',
      nonStrikerName: 'Virat Kohli',
      battingLineup: GLOBAL_BATSMEN_LINEUP,
      bowlerList: GLOBAL_WORLD_BOWLERS,
      teamCode: 'IND',
      teamJersey: 'jersey_ind',
      bowlingTeamCode: 'SA',
      bowlingJersey: 'jersey_sa',
      teamScoreBase: 0,
      teamWicketsBase: 0,
      initialBalls: 0,
      stadiumKey: 'colosseum',
      ...config
    };
    setActiveMatchConfig(fullConfig);
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
        <ErrorBoundary
          onRetry={() => setActiveMatchConfig(prev => ({ ...prev }))}
          onHome={() => setCurrentScreen('MENU')}
        >
          <CricketGame
            matchConfig={activeMatchConfig}
            onGameOver={handleGameOver}
            onBackToMenu={() => setCurrentScreen('MENU')}
            profile={profile}
            settings={settings}
          />
        </ErrorBoundary>
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
