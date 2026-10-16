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

  // Quick Play Match Launcher with authentic 10, 12, 22, 30, 40, 60 ball chase scenarios
  const startQuickPlay = (selectedBalls = null) => {
    const bowlers = ['fast', 'fastmedium', 'mediumfast', 'legspin', 'offspin'];
    const chosenBowler = bowlers[Math.floor(Math.random() * bowlers.length)];
    const ballOptions = [10, 12, 22, 30, 40, 60];
    const ballsAllowed = selectedBalls || ballOptions[Math.floor(Math.random() * ballOptions.length)];

    let targetRuns = 25;
    let wicketsAllowed = 2;
    if (ballsAllowed === 10) {
      targetRuns = 26 + Math.floor(Math.random() * 6);
      wicketsAllowed = 2;
    } else if (ballsAllowed === 12) {
      targetRuns = 32 + Math.floor(Math.random() * 8);
      wicketsAllowed = 2;
    } else if (ballsAllowed === 22) {
      targetRuns = 52 + Math.floor(Math.random() * 10);
      wicketsAllowed = 3;
    } else if (ballsAllowed === 30) {
      targetRuns = 68 + Math.floor(Math.random() * 12);
      wicketsAllowed = 4;
    } else if (ballsAllowed === 40) {
      targetRuns = 90 + Math.floor(Math.random() * 14);
      wicketsAllowed = 5;
    } else if (ballsAllowed === 60) {
      targetRuns = 135 + Math.floor(Math.random() * 20);
      wicketsAllowed = 7;
    }

    startMatch({
      title: `${ballsAllowed}-Ball Chase Thriller`,
      targetRuns,
      ballsAllowed,
      wicketsAllowed,
      bowlerType: chosenBowler,
      stadiumKey: 'colosseum'
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
