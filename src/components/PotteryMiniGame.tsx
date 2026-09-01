import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, X, Info, Award, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { audio } from '../game/audio';
import confetti from 'canvas-confetti';

interface PotteryMiniGameProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

export const PotteryMiniGame: React.FC<PotteryMiniGameProps> = ({ onComplete, onClose }) => {
  const [clayRadius, setClayRadius] = useState<number[]>([40, 55, 60, 50, 35, 20]); // 6 vertical segments
  const [activeSegment, setActiveSegment] = useState(2);
  const [wheelSpeed, setWheelSpeed] = useState(1);
  const [isFired, setIsFired] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [decorations, setDecorations] = useState<string[]>(['None', 'Vedic Spirals', 'Peepal Leaf', 'Fish Motif']);
  const [selectedDecor, setSelectedDecor] = useState('Vedic Spirals');

  const handleShape = (delta: number) => {
    setClayRadius(prev => {
      const copy = [...prev];
      copy[activeSegment] = Math.max(15, Math.min(75, copy[activeSegment] + delta));
      return copy;
    });
    audio.playClick();
  };

  const handleFirePot = () => {
    setIsFired(true);
    audio.playTempleBell();
    setTimeout(() => {
      setIsDone(true);
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {
        // ignore
      }
      setTimeout(() => {
        onComplete(95);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-2xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl backdrop-blur-2xl bg-slate-950/80 border border-white/20 rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-black/90 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#fbbf24]/20 rounded-2xl border border-[#fbbf24]/40">
              <Sparkles className="w-5 h-5 text-[#fbbf24]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heritage text-[#fbbf24]">
                Master Terracotta Potter’s Wheel
              </h2>
              <p className="text-xs text-white/70">
                Spin natural river clay, shape the contours, and fire authentic Vedic earthenware
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 border border-white/15 flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pottery Wheel Canvas Simulation */}
        <div className="mt-4 flex flex-col items-center">
          <div className="relative w-72 h-64 bg-black/50 rounded-2xl border border-white/15 flex flex-col items-center justify-end pb-6 overflow-hidden shadow-inner">
            {/* Spinning Wheel Base */}
            <div
              className={`w-48 h-8 rounded-full border-2 border-amber-600/60 bg-stone-900 shadow-md ${
                wheelSpeed > 0 ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3s' }}
            />

            {/* Render Clay Contours */}
            <div className="absolute bottom-10 flex flex-col-reverse items-center gap-1">
              {clayRadius.map((rad, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveSegment(idx)}
                  className={`h-7 rounded-full cursor-pointer transition-all duration-150 relative ${
                    isFired
                      ? 'bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 shadow-inner'
                      : 'bg-gradient-to-r from-stone-700 via-amber-900 to-stone-800'
                  } ${activeSegment === idx ? 'ring-2 ring-[#fbbf24] scale-105' : 'hover:opacity-90'}`}
                  style={{ width: `${rad * 2.8}px` }}
                >
                  {/* Etched Motif */}
                  {selectedDecor !== 'None' && isFired && (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-amber-200/70 font-mono select-none">
                      ~•~
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Kiln Fire effect */}
            {isFired && !isDone && (
              <div className="absolute inset-0 bg-orange-600/30 backdrop-blur-[1px] flex flex-col items-center justify-center animate-pulse">
                <Flame className="w-12 h-12 text-orange-400 animate-bounce" />
                <span className="text-xs font-bold text-amber-200 mt-1">Firing in Traditional Kiln (Bhata)...</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 w-full flex flex-col gap-3">
            <div className="flex items-center justify-between backdrop-blur-md bg-white/5 p-3 rounded-2xl border border-white/10">
              <div className="text-xs text-[#fbbf24]">
                Active Zone: <strong className="text-white">Layer {activeSegment + 1} of 6</strong>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShape(-5)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold border border-white/15 cursor-pointer text-white"
                >
                  <ArrowDown className="w-3.5 h-3.5" /> Pull Inwards
                </button>
                <button
                  onClick={() => handleShape(5)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold border border-white/15 cursor-pointer text-white"
                >
                  <ArrowUp className="w-3.5 h-3.5" /> Flare Outwards
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/80 px-1">
              <span>Carved Relief Motif:</span>
              <div className="flex gap-1.5">
                {decorations.map(dec => (
                  <button
                    key={dec}
                    onClick={() => setSelectedDecor(dec)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border cursor-pointer ${
                      selectedDecor === dec
                        ? 'bg-[#fbbf24] text-black border-[#fbbf24] font-bold'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {dec}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFirePot}
              disabled={isFired}
              className="mt-1 w-full py-3 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
            >
              <Flame className="w-4 h-4" />
              {isFired ? 'Vessel Fired & Completed' : 'Bake Terracotta in Kiln'}
            </button>
          </div>
        </div>

        {/* Educational Note */}
        <div className="mt-4 p-3.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 flex items-start gap-2 text-xs text-white/80">
          <Info className="w-4 h-4 text-[#fbbf24] shrink-0 mt-0.5" />
          <span>
            Harappan pottery kilns operated at over 800°C without metal, using rice husk combustion to produce impermeable, bacteria-resistant vessels that endured for 4,500 years.
          </span>
        </div>

        {isDone && (
          <div className="absolute inset-0 backdrop-blur-2xl bg-slate-950/90 rounded-[2.5rem] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
            <Award className="w-12 h-12 text-[#fbbf24] mb-2 animate-bounce" />
            <h3 className="text-xl font-bold font-heritage text-[#fbbf24]">
              Earthen Terracotta Vessel Crafted!
            </h3>
            <p className="text-xs text-white/90 max-w-xs mt-1">
              Potter Madhav approves of your craftsmanship! Earthen vessels preserve natural minerals and cool water sustainably.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
