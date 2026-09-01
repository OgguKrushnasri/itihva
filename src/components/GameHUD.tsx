import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  User,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  ChevronRight,
  HelpCircle,
  MapPin,
  Flame,
  CheckCircle2,
  Navigation,
  Calendar,
  Layers,
  Map as MapIcon
} from 'lucide-react';
import { Mission, GameProgress, PlayerCustomization, DailyQuestState } from '../types';
import { audio } from '../game/audio';
import { CharacterPortrait } from './CharacterPortrait';

interface GameHUDProps {
  currentMission: Mission | null;
  progress: GameProgress;
  player: PlayerCustomization;
  currentZone: string;
  playerPos: { x: number; y: number; z: number };
  playerRotationY: number;
  dailyQuestState: DailyQuestState;
  interactionPrompt: { text: string; action: () => void } | null;
  onOpenJournal: () => void;
  onOpenCustomizer: () => void;
  onOpenRangoli: () => void;
  onOpenPottery: () => void;
  onOpenDailyQuest: () => void;
  onOpenMap: () => void;
  onToggleAudio: () => void;
  isAudioMuted: boolean;
  onMobileMove?: (direction: { x: number; y: number }) => void;
  onMobileJump?: () => void;
  onMobileInteract?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentMission,
  progress,
  player,
  currentZone,
  playerPos,
  playerRotationY,
  dailyQuestState,
  interactionPrompt,
  onOpenJournal,
  onOpenCustomizer,
  onOpenRangoli,
  onOpenPottery,
  onOpenDailyQuest,
  onOpenMap,
  onToggleAudio,
  isAudioMuted
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState<'mission' | 'daily'>('mission');

  const zoneNames: Record<string, { name: string; tag: string }> = {
    village: { name: 'Bharatpur Village', tag: 'Ancient Agro-Craft Hub' },
    temple: { name: 'Mahamandapa Sun Temple', tag: 'Vastu Shastra Sanctum' },
    forest: { name: 'Sacred Narmada Grove', tag: 'Biodiversity & Waterfalls' },
    stepwell: { name: 'Subterranean Baoli', tag: 'Hydraulic Architecture' }
  };

  const currentZoneInfo = zoneNames[currentZone] || { name: 'Bharatpur Heritage', tag: 'Vedic Realm' };
  const todayQuest = dailyQuestState.todayQuest;
  const dailyCompletedCount = todayQuest.objectives.filter(o => o.completed).length;
  const isDailyCompleted = dailyCompletedCount === todayQuest.objectives.length;

  return (
    <div className="pointer-events-none absolute inset-0 select-none flex flex-col justify-between p-3 md:p-5 z-30 font-sans text-white">
      {/* Top Bar: Character Avatar & Glass Location Card */}
      <div className="flex items-start justify-between gap-4">
        {/* Top Left: Frosted Player Profile & ITIHVA Logo */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          <div className="relative group cursor-pointer" onClick={onOpenCustomizer} title="Click to customize your adventurer">
            <CharacterPortrait
              player={player}
              size="md"
              showBorder={true}
              className="transition-transform group-hover:scale-105"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#10b981] px-1.5 py-0.5 rounded-full border border-white text-[9px] font-bold text-white shadow-md">
              LV.{progress.completedMissions.length + 1}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heritage font-bold text-lg md:text-xl text-[#fbbf24] tracking-tight drop-shadow truncate max-w-[130px] md:max-w-[200px]">
                {player.name}
              </span>
              <span className="backdrop-blur-md bg-white/10 border border-white/20 text-[#fbbf24] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                {player.hairStyle === 'turban' ? 'ROYAL' : player.outfit === 'traditional_saree' ? 'ARTISAN' : 'EXPLORER'}
              </span>
            </div>

            <div className="flex items-center space-x-2 mt-0.5">
              <div className="h-2 w-28 md:w-36 bg-black/60 rounded-full overflow-hidden border border-white/15 backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-[#fbbf24] transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(20, (progress.badges.length / 6) * 100))}%`
                  }}
                />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">
                Wisdom
              </span>
            </div>
          </div>
        </div>

        {/* Top Right: Frosted Glass Location Radar & Control Strip */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Frosted Glass Location Card */}
          <div className="backdrop-blur-xl bg-black/40 border border-white/20 p-2 md:p-3 rounded-2xl md:rounded-3xl shadow-2xl shadow-black/50 flex items-center space-x-3 transition-all hover:bg-black/50">
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-widest text-white/60 font-semibold">
                Current Location
              </div>
              <div className="text-sm md:text-base font-serif italic text-white font-medium">
                {currentZoneInfo.name}
              </div>
              <div className="text-[10px] text-[#fbbf24]/80 font-mono hidden md:block">
                {currentZoneInfo.tag}
              </div>
            </div>

            {/* Aesthetic Zone Pill */}
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-black/50 border border-white/15 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse z-10 shadow-[0_0_8px_#10b981]" />
              <div className="text-[8px] absolute top-1 left-1 text-white/50 font-mono font-bold">
                {currentZone.slice(0, 2).toUpperCase()}
              </div>
              <Navigation className="w-3 h-3 text-[#fbbf24] absolute bottom-1 right-1 opacity-70" />
            </div>
          </div>

          {/* Frosted Action Buttons Toolbar */}
          <div className="flex items-center space-x-1.5 md:space-x-2">
            {/* Daily Rotating Quest Button */}
            <button
              onClick={() => {
                audio.playClick();
                onOpenDailyQuest();
              }}
              className="backdrop-blur-md bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 px-3 py-1.5 rounded-full text-xs font-bold text-purple-200 shadow-lg cursor-pointer flex items-center gap-1.5 transition-all hover:scale-105"
              title="Today's Rotating Daily Quest"
            >
              <Calendar className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline">Daily Task</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-500/40 border border-purple-400/40 text-purple-100">
                {isDailyCompleted ? '✓' : `${dailyCompletedCount}/${todayQuest.objectives.length}`}
              </span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onOpenMap();
              }}
              className="backdrop-blur-md bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-200 shadow-lg cursor-pointer flex items-center gap-1.5 transition-all hover:scale-105"
              title="ITIHVA World Realm Map (M)"
            >
              <MapIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Map</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onOpenRangoli();
              }}
              className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg cursor-pointer flex items-center gap-1.5 transition-all hover:scale-105"
              title="Sacred Rangoli Studio"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span className="hidden sm:inline">Rangoli</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onOpenPottery();
              }}
              className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg cursor-pointer flex items-center gap-1.5 transition-all hover:scale-105"
              title="Terracotta Potter's Wheel"
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Pottery</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onOpenJournal();
              }}
              className="backdrop-blur-md bg-[#fbbf24]/20 hover:bg-[#fbbf24]/30 border border-[#fbbf24]/50 px-3 py-1.5 rounded-full text-xs font-bold text-[#fbbf24] shadow-lg cursor-pointer flex items-center gap-1.5 transition-all hover:scale-105 relative"
              title="Heritage Codex & Artifacts"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span className="hidden sm:inline">Codex</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-ping" />
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onOpenCustomizer();
              }}
              className="backdrop-blur-md bg-black/40 hover:bg-black/60 border border-white/15 p-2 rounded-full text-white cursor-pointer shadow-lg transition-all"
              title="Character Customizer"
            >
              <User className="w-3.5 h-3.5 text-white/80" />
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onToggleAudio();
              }}
              className="backdrop-blur-md bg-black/40 hover:bg-black/60 border border-white/15 p-2 rounded-full text-white cursor-pointer shadow-lg transition-all"
              title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isAudioMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-white/50" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#fbbf24]" />
              )}
            </button>

            <button
              onClick={() => setShowHelp(!showHelp)}
              className="backdrop-blur-md bg-black/40 hover:bg-black/60 border border-white/15 p-2 rounded-full text-white cursor-pointer shadow-lg transition-all"
              title="Controls & Guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Center: Frosted Proximity Interaction Prompt Banner */}
      {interactionPrompt && (
        <div className="self-center pointer-events-auto animate-in zoom-in-95 duration-200">
          <button
            onClick={() => {
              audio.playClick();
              interactionPrompt.action();
            }}
            className="group backdrop-blur-xl bg-black/75 hover:bg-black/85 border border-[#fbbf24]/70 px-6 py-3 rounded-full shadow-[0_0_35px_rgba(251,191,36,0.35)] flex items-center space-x-3 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <span className="w-7 h-7 flex items-center justify-center bg-white text-black rounded-full text-[11px] font-bold italic shadow-inner">
              E
            </span>
            <span className="text-sm md:text-base font-bold tracking-wide text-white drop-shadow">
              {interactionPrompt.text}
            </span>
            <ChevronRight className="w-4 h-4 text-[#fbbf24] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Bottom Area: Mission / Daily Quest Card, Controls Ribbon, and REAL-TIME MINI-MAP in Bottom-Right Corner */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-3">
          {/* Left: Mission / Daily Quest Toggleable Glass Card */}
          <div className="pointer-events-auto backdrop-blur-xl bg-black/55 border border-white/15 p-4 rounded-2xl md:rounded-3xl max-w-sm md:max-w-md w-full shadow-2xl shadow-black/60 text-white">
            {/* Tab switch between Main Mission & Today's Daily Quest */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('mission')}
                  className={`text-[10px] uppercase tracking-[0.15em] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'mission'
                      ? 'bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/40'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                  Main Quest
                </button>
                <button
                  onClick={() => setActiveTab('daily')}
                  className={`text-[10px] uppercase tracking-[0.15em] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'daily'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Daily Task
                  <span className="text-[9px] text-purple-200">
                    ({dailyCompletedCount}/{todayQuest.objectives.length})
                  </span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-white/50">
                {activeTab === 'mission'
                  ? `${progress.currentMissionIndex + 1}/6`
                  : `${dailyQuestState.currentStreak}d Streak 🔥`}
              </span>
            </div>

            {/* Content for Main Mission */}
            {activeTab === 'mission' && currentMission && (
              <div className="mt-2.5 space-y-2">
                <div>
                  <h3 className="text-sm font-bold text-white/90">{currentMission.title}</h3>
                  <p className="text-xs text-white/70 mt-0.5 leading-relaxed">{currentMission.brief}</p>
                </div>

                {/* Progress Bar */}
                {currentMission.targetCount > 1 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-white/60">
                      <span>Objective Progress</span>
                      <span className="font-bold text-[#fbbf24]">
                        {currentMission.currentCount} / {currentMission.targetCount}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-[#fbbf24] rounded-full transition-all duration-300"
                        style={{
                          width: `${(currentMission.currentCount / currentMission.targetCount) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-[#fbbf24]/90 italic flex items-center gap-1">
                  <span>💡 {currentMission.hint}</span>
                </div>
              </div>
            )}

            {/* Content for Daily Rotating Quest */}
            {activeTab === 'daily' && (
              <div className="mt-2.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-purple-200 flex items-center gap-1.5">
                      <span>{todayQuest.icon}</span>
                      <span>{todayQuest.title}</span>
                    </h3>
                    <p className="text-xs text-white/70 mt-0.5 leading-relaxed">{todayQuest.subtitle}</p>
                  </div>
                  <button
                    onClick={onOpenDailyQuest}
                    className="text-[9px] uppercase tracking-wider font-bold text-purple-300 hover:text-purple-100 bg-purple-500/20 px-2 py-1 rounded-lg border border-purple-500/30 shrink-0 cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                {/* Checklist Preview */}
                <div className="space-y-1.5">
                  {todayQuest.objectives.slice(0, 2).map((obj) => (
                    <div key={obj.id} className="flex items-center gap-2 text-[11px] text-white/80">
                      <span className={obj.completed ? 'text-emerald-400 font-bold' : 'text-white/30'}>
                        {obj.completed ? '✓' : '○'}
                      </span>
                      <span className={`truncate ${obj.completed ? 'line-through opacity-70' : ''}`}>
                        {obj.text}
                      </span>
                    </div>
                  ))}
                  {todayQuest.objectives.length > 2 && (
                    <div className="text-[10px] text-purple-300/80 italic">
                      + {todayQuest.objectives.length - 2} more exploration objective(s)
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right / Bottom-Right Corner: Inventory Seals Drawer */}
          <div className="flex items-end gap-3 self-end">
            {/* Inventory Seals Drawer (Compact) */}
            <div className="pointer-events-auto backdrop-blur-xl bg-black/50 border border-white/15 p-2.5 rounded-2xl shadow-2xl shadow-black/60 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-white/60 font-bold border-b border-white/10 pb-1">
                <span>Seals</span>
                <span className="text-[#fbbf24]">{progress.badges.length}/6</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {progress.inventory.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 backdrop-blur-md bg-white/10 rounded-lg border border-white/15 flex items-center justify-center text-sm"
                    title={item}
                  >
                    {item.includes('Clay') ? '🏺' : item.includes('Key') ? '🗝️' : '🪔'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Frosted Glass Controls Ribbon */}
        <div className="flex items-center justify-center space-x-3 md:space-x-8 pointer-events-auto">
          <div className="flex items-center space-x-1.5 backdrop-blur-xl bg-black/40 px-3.5 py-1.5 rounded-full border border-white/15 shadow-xl">
            <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-white text-black rounded text-[10px] font-bold italic shadow-inner">
              W
            </span>
            <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-white text-black rounded text-[10px] font-bold italic shadow-inner">
              A
            </span>
            <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-white text-black rounded text-[10px] font-bold italic shadow-inner">
              S
            </span>
            <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-white text-black rounded text-[10px] font-bold italic shadow-inner">
              D
            </span>
            <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-white/50 ml-1">
              Move
            </span>
          </div>

          <div className="flex items-center space-x-1.5 backdrop-blur-xl bg-black/40 px-3.5 py-1.5 rounded-full border border-white/15 shadow-xl">
            <span className="px-2 h-5 md:h-6 flex items-center justify-center bg-[#fbbf24] text-black rounded text-[10px] font-bold italic shadow-inner">
              SPACE
            </span>
            <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-white/50 ml-1">
              Jump
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 backdrop-blur-xl bg-black/40 px-3.5 py-1.5 rounded-full border border-white/15 shadow-xl">
            <span className="px-2 h-5 md:h-6 flex items-center justify-center bg-white text-black rounded text-[10px] font-bold italic shadow-inner">
              SHIFT
            </span>
            <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-white/50 ml-1">
              Sprint
            </span>
          </div>

          <div className="flex items-center space-x-2 backdrop-blur-xl bg-white/10 px-4 py-1.5 rounded-full border border-[#fbbf24]/50 animate-pulse shadow-xl">
            <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-white text-black rounded-full text-[10px] font-bold italic shadow-inner">
              E
            </span>
            <span className="text-xs font-bold tracking-widest text-[#fbbf24]">
              INTERACT
            </span>
          </div>
        </div>
      </div>

      {/* Help Modal Guide */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-2xl p-4 pointer-events-auto animate-in fade-in">
          <div className="backdrop-blur-2xl bg-slate-950/80 border border-white/20 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl shadow-black/80">
            <div className="flex justify-between items-center pb-3 border-b border-white/15">
              <h3 className="text-lg font-bold font-heritage text-[#fbbf24]">
                🎮 ITIHVA Adventure Controls
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs md:text-sm">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <span className="font-bold text-[#fbbf24] block mb-1">WASD / Arrow Keys</span>
                  <span className="text-white/70">Move Player Adventurer</span>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <span className="font-bold text-[#fbbf24] block mb-1">Spacebar</span>
                  <span className="text-white/70">Jump / Hop</span>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <span className="font-bold text-[#fbbf24] block mb-1">Shift Key</span>
                  <span className="text-white/70">Sprint / Run Fast</span>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <span className="font-bold text-[#fbbf24] block mb-1">E / Click Prompt</span>
                  <span className="text-white/70">Interact with NPCs & Objects</span>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 col-span-2">
                  <span className="font-bold text-[#fbbf24] block mb-1">M Key / Map Button (Top Bar)</span>
                  <span className="text-white/70">Open the full ITIHVA Realm Cartography map with zones, landmarks & lore</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full py-2.5 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold rounded-2xl text-xs cursor-pointer shadow-lg shadow-amber-950/50 transition-transform active:scale-95"
            >
              Close Guide & Resume Adventure
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
