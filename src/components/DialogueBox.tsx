import React, { useState, useEffect } from 'react';
import { NPCData } from '../types';
import { audio } from '../game/audio';
import { ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { CharacterPortrait } from './CharacterPortrait';

interface DialogueBoxProps {
  npc: NPCData;
  missionContext?: string;
  onNext: () => void;
  onClose: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  npc,
  missionContext = 'default',
  onNext,
  onClose
}) => {
  const dialogueLines = npc.dialogueState[missionContext] || npc.dialogueState.default || [];
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    setLineIndex(0);
    audio.playDialoguePop();
  }, [npc, missionContext]);

  const handleAdvance = () => {
    if (lineIndex < dialogueLines.length - 1) {
      setLineIndex(prev => prev + 1);
      audio.playDialoguePop();
    } else {
      audio.playClick();
      onNext();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative backdrop-blur-2xl bg-slate-950/80 border border-white/20 rounded-[2rem] p-6 md:p-7 shadow-2xl shadow-black/80 text-white">
        {/* Floating Role Badge */}
        <div className="absolute -top-3.5 left-8 px-4 py-1 bg-[#fbbf24] text-black text-xs font-bold rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{npc.role}</span>
        </div>

        <div className="flex gap-4 md:gap-5 items-start pt-1">
          {/* NPC Avatar representation */}
          <div className="shrink-0 flex flex-col items-center">
            <CharacterPortrait
              npc={npc}
              size="md"
              showBorder={true}
              className="shadow-xl"
            />
            <span className="text-xs font-bold text-[#fbbf24] mt-1.5 max-w-[80px] text-center truncate">
              {npc.name}
            </span>
          </div>

          {/* Dialogue Text Content */}
          <div className="flex-1 flex flex-col justify-between min-h-[90px]">
            <div>
              <p className="text-sm md:text-base leading-relaxed text-white/95 font-medium font-sans">
                {dialogueLines[lineIndex] || "Namaste!"}
              </p>
            </div>

            {/* Educational Fact Snippet */}
            {npc.educationalFact && (
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-start gap-2.5 text-xs text-white/80 backdrop-blur-md bg-white/5 p-3 rounded-2xl border border-white/10">
                <BookOpen className="w-4 h-4 text-[#fbbf24] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#fbbf24]">
                    {npc.educationalFact.title}:{' '}
                  </span>
                  <span>{npc.educationalFact.description}</span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="mt-3.5 flex justify-between items-center text-xs">
              <span className="text-white/50 font-mono font-bold">
                {lineIndex + 1} / {dialogueLines.length}
              </span>
              <button
                onClick={handleAdvance}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <span>{lineIndex < dialogueLines.length - 1 ? 'Continue' : 'Complete Conversation'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
