import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameCanvas } from './game/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { DialogueBox } from './components/DialogueBox';
import { RangoliMiniGame } from './components/RangoliMiniGame';
import { PotteryMiniGame } from './components/PotteryMiniGame';
import { JournalModal } from './components/JournalModal';
import { CustomizerModal } from './components/CustomizerModal';
import { VictoryScreen } from './components/VictoryScreen';
import { CharacterPortrait } from './components/CharacterPortrait';
import { DailyQuestModal } from './components/DailyQuestModal';
import { WorldMapModal } from './components/WorldMapModal';
import { audio } from './game/audio';
import {
  INITIAL_GAME_PROGRESS,
  INITIAL_PLAYER_CUSTOMIZATION,
  MISSIONS,
  NPCS,
  BADGES
} from './game/gameState';
import {
  loadDailyQuestState,
  updateDailyQuestProgress,
  saveDailyQuestState,
  claimDailyQuestReward
} from './game/dailyQuests';
import { GameProgress, PlayerCustomization, NPCData, DailyQuestState } from './types';
import { Compass, Sparkles, Play, Volume2, ShieldCheck, Award, BookOpen, User, Settings, Calendar, Flame } from 'lucide-react';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [progress, setProgress] = useState<GameProgress>(INITIAL_GAME_PROGRESS);
  const [playerCustomization, setPlayerCustomization] = useState<PlayerCustomization>(
    INITIAL_PLAYER_CUSTOMIZATION
  );

  // Real-time Player Coordinates & Orientation for Radar Mini-Map
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number; z: number }>({
    x: -3,
    y: 0,
    z: 14
  });
  const [playerRotationY, setPlayerRotationY] = useState<number>(0);

  // Daily Rotating Quest State
  const [dailyQuestState, setDailyQuestState] = useState<DailyQuestState>(() =>
    loadDailyQuestState()
  );
  const [showDailyQuestModal, setShowDailyQuestModal] = useState(false);

  // Active zone tracking
  const [currentZone, setCurrentZone] = useState<string>('village');

  // Modals & Panels state
  const [activeNPC, setActiveNPC] = useState<NPCData | null>(null);
  const [showRangoli, setShowRangoli] = useState(false);
  const [showPottery, setShowPottery] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Keyboard shortcut listener (M key to toggle World Map)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyM' || e.key === 'm' || e.key === 'M') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          setShowMap(prev => !prev);
          audio.playClick();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Proximity interaction prompt
  const [interactionPrompt, setInteractionPrompt] = useState<{
    text: string;
    action: () => void;
  } | null>(null);

  const currentMission = MISSIONS[progress.currentMissionIndex] || null;

  const handleStartGame = () => {
    setGameStarted(true);
    audio.startAtmosphere('village');
  };

  const handleToggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    audio.setMuted(nextMuted);
  };

  const handlePlayerPositionChange = useCallback(
    (pos: { x: number; y: number; z: number }, rotY: number) => {
      setPlayerPos(pos);
      setPlayerRotationY(rotY);
    },
    []
  );

  // Handle updates to daily quest objectives
  const handleDailyObjectiveProgress = useCallback(
    (type: string, targetId?: string, targetPos?: [number, number, number]) => {
      setDailyQuestState(prevState => {
        const { updatedState, newlyCompletedObjective, newlyCompletedQuest } =
          updateDailyQuestProgress(prevState, type, targetId, targetPos);

        if (newlyCompletedObjective) {
          audio.playCollectSound();
        }
        if (newlyCompletedQuest) {
          audio.playMissionComplete();
        }

        return updatedState;
      });
    },
    []
  );

  const handleClaimDailyReward = () => {
    audio.playMissionComplete();
    const updated = claimDailyQuestReward(dailyQuestState);
    setDailyQuestState(updated);
    // Add reward badge or notification
    setProgress(prev => ({
      ...prev,
      badges: Array.from(new Set([...prev.badges, 'badge_daily_explorer']))
    }));
  };

  const handleUpdateProgress = useCallback((newProgress: Partial<GameProgress>) => {
    setProgress(prev => ({
      ...prev,
      ...newProgress
    }));
  }, []);

  const handleRangoliComplete = (score: number) => {
    setShowRangoli(false);
    setProgress(prev => ({
      ...prev,
      rangoliScore: score,
      completedMissions: Array.from(new Set([...prev.completedMissions, 'mission_cultural_rangoli'])),
      currentMissionIndex: Math.max(prev.currentMissionIndex, 5),
      badges: Array.from(new Set([...prev.badges, 'badge_rangoli_artist'])),
      inventory: Array.from(new Set([...prev.inventory, 'Master Artisan Garland']))
    }));
    handleDailyObjectiveProgress('reach_location', 'rangoli_station');
  };

  const handlePotteryComplete = (score: number) => {
    setShowPottery(false);
    setProgress(prev => ({
      ...prev,
      potteryScore: score,
      badges: Array.from(new Set([...prev.badges, 'badge_potter_apprentice'])),
      inventory: Array.from(new Set([...prev.inventory, 'Vedic Terracotta Vessel']))
    }));
    handleDailyObjectiveProgress('reach_location', 'pottery_wheel');
  };

  const handleRestart = () => {
    setProgress(INITIAL_GAME_PROGRESS);
    setShowVictory(false);
    audio.startAtmosphere('village');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 select-none">
      {/* 1. INTRO / TITLE OVERLAY SCREEN */}
      {!gameStarted ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-2xl p-4 md:p-6 text-white overflow-y-auto">
          {/* Frosted Glass Card Container */}
          <div className="relative w-full max-w-2xl backdrop-blur-2xl bg-slate-950/75 border border-white/20 rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-black/90 text-center my-auto">
            {/* Sacred Sun Emblem */}
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 via-[#fbbf24] to-yellow-300 p-1 shadow-2xl flex items-center justify-center animate-pulse">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-heritage text-2xl md:text-3xl text-[#fbbf24]">
                ☀️
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="backdrop-blur-md bg-white/10 border border-white/20 text-[#fbbf24] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full inline-block">
                  Student Innovation Challenge Edition
                </span>
                <span className="backdrop-blur-md bg-purple-500/20 border border-purple-400/30 text-purple-200 text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-400 fill-current" />
                  {dailyQuestState.currentStreak}d Streak
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-heritage tracking-tighter text-[#fbbf24] drop-shadow-md italic">
                ITIHVA
              </h1>
              <p className="text-sm md:text-base font-serif italic text-white/90 tracking-widest pt-0.5">
                “Explore. Learn. Discover.”
              </p>
            </div>

            <p className="mt-3 text-xs md:text-sm text-white/80 max-w-lg mx-auto leading-relaxed font-sans">
              Step into a living 3D educational adventure through Indian civilization, traditional village life, ancient temple astronomy, sacred grove conservation, and subterranean water architecture.
            </p>

            {/* Today's Daily Rotating Task Banner on Start Screen */}
            <div className="mt-4 p-3.5 rounded-2xl backdrop-blur-md bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-left gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xl shrink-0">
                  {dailyQuestState.todayQuest.icon}
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold tracking-wider text-purple-300">
                    Today's Randomized Exploration Quest
                  </div>
                  <div className="text-xs font-bold text-white">
                    {dailyQuestState.todayQuest.title}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-purple-300 font-bold px-2 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 shrink-0">
                +{dailyQuestState.todayQuest.rewardXp} XP
              </span>
            </div>

            {/* Frosted Feature Pillars */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-left">
              <div className="p-3 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 text-xs">
                <span className="font-bold text-[#fbbf24] block mb-1">🏘️ Village & Crafts</span>
                <span className="text-[11px] text-white/70">
                  Organic farming, terracotta ceramics & Panchayat democracy.
                </span>
              </div>
              <div className="p-3 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 text-xs">
                <span className="font-bold text-[#fbbf24] block mb-1">🛕 Temple Mandapas</span>
                <span className="text-[11px] text-white/70">
                  Vastu Shastra astronomy & interlocking stone architecture.
                </span>
              </div>
              <div className="p-3 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 text-xs">
                <span className="font-bold text-[#fbbf24] block mb-1">🌿 Mini-Map GPS</span>
                <span className="text-[11px] text-white/70">
                  Real-time orientation radar tracking Village, Temple & Forest.
                </span>
              </div>
            </div>

            {/* Current Playing Character Preview on Start Screen */}
            <div className="mt-4 p-3 backdrop-blur-xl bg-white/5 border border-white/15 rounded-3xl flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <CharacterPortrait
                  player={playerCustomization}
                  size="md"
                  showBorder={true}
                  className="ring-2 ring-[#fbbf24]/50"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-heritage text-sm md:text-base">
                      {playerCustomization.name}
                    </span>
                    <span className="backdrop-blur-md bg-[#fbbf24]/20 border border-[#fbbf24]/40 text-[#fbbf24] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {playerCustomization.hairStyle === 'turban' ? 'ROYAL SCHOLAR' : playerCustomization.outfit === 'traditional_saree' ? 'ARTISAN' : 'EXPLORER'}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/70">
                    Traditional Indian Traveler • Ready to Explore
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCustomizer(true)}
                className="px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-[#fbbf24] flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartGame}
              className="mt-5 px-8 py-3.5 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-black font-heritage tracking-wider text-base rounded-2xl shadow-xl shadow-amber-950/50 flex items-center justify-center gap-3 mx-auto cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START 3D ADVENTURE</span>
            </button>

            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-white/60">
              <span>🎮 WASD / Arrows to Move</span>
              <span>•</span>
              <span>Space to Jump</span>
              <span>•</span>
              <span>[E] to Interact</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 2. 3D WEBGL ADVENTURE CANVAS */}
          <GameCanvas
            progress={progress}
            playerCustomization={playerCustomization}
            onUpdateProgress={handleUpdateProgress}
            onInteractNPC={npc => setActiveNPC(npc)}
            onOpenRangoli={() => setShowRangoli(true)}
            onOpenPottery={() => setShowPottery(true)}
            onCompleteGame={() => setShowVictory(true)}
            onSetInteractionPrompt={setInteractionPrompt}
            onZoneChange={zone => setCurrentZone(zone)}
            onPlayerPositionChange={handlePlayerPositionChange}
            onDailyObjectiveProgress={handleDailyObjectiveProgress}
          />

          {/* 3. GAME HUD & ACTIVE MISSION TRACKER */}
          <GameHUD
            currentMission={currentMission}
            progress={progress}
            player={playerCustomization}
            currentZone={currentZone}
            playerPos={playerPos}
            playerRotationY={playerRotationY}
            dailyQuestState={dailyQuestState}
            interactionPrompt={interactionPrompt}
            onOpenJournal={() => setShowJournal(true)}
            onOpenCustomizer={() => setShowCustomizer(true)}
            onOpenRangoli={() => setShowRangoli(true)}
            onOpenPottery={() => setShowPottery(true)}
            onOpenDailyQuest={() => setShowDailyQuestModal(true)}
            onOpenMap={() => setShowMap(true)}
            onToggleAudio={handleToggleAudio}
            isAudioMuted={isAudioMuted}
          />

          {/* 4. DIALOGUE SYSTEM */}
          {activeNPC && (
            <DialogueBox
              npc={activeNPC}
              onNext={() => setActiveNPC(null)}
              onClose={() => setActiveNPC(null)}
            />
          )}

          {/* 5. CULTURAL ACTIVITY: RANGOLI STUDIO */}
          {showRangoli && (
            <RangoliMiniGame
              onComplete={handleRangoliComplete}
              onClose={() => setShowRangoli(false)}
            />
          )}

          {/* 6. CULTURAL ACTIVITY: POTTERY WHEEL */}
          {showPottery && (
            <PotteryMiniGame
              onComplete={handlePotteryComplete}
              onClose={() => setShowPottery(false)}
            />
          )}

          {/* 7. REALM CARTOGRAPHY & WORLD MAP */}
          {showMap && (
            <WorldMapModal
              playerPos={playerPos}
              playerRotationY={playerRotationY}
              currentZone={currentZone}
              activeMissionIndex={progress.currentMissionIndex}
              dailyQuest={dailyQuestState.todayQuest}
              onClose={() => setShowMap(false)}
            />
          )}

          {/* 8. HERITAGE JOURNAL & ARTIFACT CODEX */}
          {showJournal && (
            <JournalModal
              progress={progress}
              onClose={() => setShowJournal(false)}
            />
          )}

          {/* 9. DAILY ROTATING QUEST MODAL */}
          {showDailyQuestModal && (
            <DailyQuestModal
              dailyQuestState={dailyQuestState}
              onClose={() => setShowDailyQuestModal(false)}
              onClaimReward={handleClaimDailyReward}
            />
          )}

          {/* 10. GRAND CINEMATIC VICTORY SCREEN */}
          {showVictory && (
            <VictoryScreen
              progress={progress}
              player={playerCustomization}
              onExploreMore={() => setShowVictory(false)}
              onRestart={handleRestart}
            />
          )}
        </>
      )}

      {/* CHARACTER PERSONA & OUTFIT CUSTOMIZER (Available from start screen and in-game) */}
      {showCustomizer && (
        <CustomizerModal
          customization={playerCustomization}
          onSave={c => setPlayerCustomization(c)}
          onClose={() => setShowCustomizer(false)}
        />
      )}
    </div>
  );
}

