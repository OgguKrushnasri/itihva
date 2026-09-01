import React, { useEffect } from 'react';
import { Award, Sparkles, BookOpen, Compass, CheckCircle2, RotateCcw } from 'lucide-react';
import { GameProgress, PlayerCustomization } from '../types';
import { BADGES, ARTIFACTS } from '../game/gameState';
import { audio } from '../game/audio';
import confetti from 'canvas-confetti';
import { CharacterPortrait } from './CharacterPortrait';

interface VictoryScreenProps {
  progress: GameProgress;
  player: PlayerCustomization;
  onExploreMore: () => void;
  onRestart: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  progress,
  player,
  onExploreMore,
  onRestart
}) => {
  useEffect(() => {
    audio.playMissionComplete();
    // Confetti fireworks
    const duration = 3000;
    const end = Date.now() + duration;

    const interval: any = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      try {
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
      } catch {
        // ignore
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-2xl p-4 animate-in zoom-in-95 duration-500 overflow-y-auto">
      <div className="relative w-full max-w-3xl backdrop-blur-2xl bg-slate-950/80 border border-white/20 rounded-[2.5rem] shadow-2xl shadow-black/90 p-8 md:p-10 text-center text-white my-auto">
        {/* Player Champion Character Portrait with Sun Halo */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-[#fbbf24] to-yellow-300 animate-spin-slow opacity-80 blur-sm" />
          <CharacterPortrait
            player={player}
            size="xl"
            showBorder={true}
            className="ring-4 ring-[#fbbf24] shadow-2xl relative z-10"
          />
          <div className="absolute -bottom-2 bg-[#fbbf24] text-black text-[10px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full border border-white shadow-lg z-20">
            CHAMPION
          </div>
        </div>

        {/* Cinematic Title Banner */}
        <div className="mt-5 space-y-1">
          <span className="backdrop-blur-md bg-white/10 border border-white/20 text-[#fbbf24] text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-full inline-block mb-1">
            Student Innovation Challenge • Expedition Complete
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-heritage tracking-tighter text-[#fbbf24] drop-shadow-md italic">
            ITIHVA
          </h1>
          <div className="text-sm md:text-base font-serif italic text-white/90 tracking-widest pt-1">
            “YOU EXPLORED. YOU LEARNED. YOU DISCOVERED.”
          </div>
        </div>

        {/* Player Honorific */}
        <p className="mt-4 text-xs md:text-sm text-white/80 max-w-xl mx-auto leading-relaxed font-sans">
          Salutations, <strong className="text-[#fbbf24]">{player.name}</strong>! You have unraveled the timeless wisdom of Bharat’s ancient civilizations, decoded temple astronomy, guarded sacred groves, and revived traditional craft heritage.
        </p>

        {/* Discovery Summary Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
            <Compass className="w-5 h-5 text-[#fbbf24] mb-1" />
            <span className="text-xl font-bold text-white">6 / 6</span>
            <span className="text-[11px] text-white/70">Missions Completed</span>
          </div>

          <div className="p-3.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
            <Award className="w-5 h-5 text-[#fbbf24] mb-1" />
            <span className="text-xl font-bold text-white">6 Badges</span>
            <span className="text-[11px] text-white/70">Cultural Honors</span>
          </div>

          <div className="p-3.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
            <Sparkles className="w-5 h-5 text-[#fbbf24] mb-1" />
            <span className="text-xl font-bold text-white">100%</span>
            <span className="text-[11px] text-white/70">Heritage Knowledge</span>
          </div>

          <div className="p-3.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
            <BookOpen className="w-5 h-5 text-[#fbbf24] mb-1" />
            <span className="text-xl font-bold text-white">4 Masterworks</span>
            <span className="text-[11px] text-white/70">Artifacts Catalogued</span>
          </div>
        </div>

        {/* Badges Carousel Highlight */}
        <div className="mt-6 p-4 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider mb-2.5">
            Acquired Cultural Badges & Seals
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {BADGES.map(b => (
              <div
                key={b.id}
                className="flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-sm bg-white/10 border border-white/15 rounded-xl text-xs"
              >
                <span>{b.icon}</span>
                <span className="font-bold text-white">{b.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onExploreMore}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold rounded-2xl shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <Compass className="w-5 h-5" /> Continue Free Exploration
          </button>
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 font-semibold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Replay Adventure
          </button>
        </div>
      </div>
    </div>
  );
};
