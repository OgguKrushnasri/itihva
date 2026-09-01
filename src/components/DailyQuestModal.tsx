import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  Navigation,
  Compass,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { DailyQuest, DailyQuestState } from '../types';
import { getTimeUntilMidnight } from '../game/dailyQuests';
import { audio } from '../game/audio';

interface DailyQuestModalProps {
  dailyQuestState: DailyQuestState;
  onClose: () => void;
  onClaimReward?: () => void;
}

export const DailyQuestModal: React.FC<DailyQuestModalProps> = ({
  dailyQuestState,
  onClose,
  onClaimReward
}) => {
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());
  const { todayQuest, currentStreak, completedDates } = dailyQuestState;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const completedCount = todayQuest.objectives.filter(o => o.completed).length;
  const totalCount = todayQuest.objectives.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isAllCompleted = completedCount === totalCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-2xl p-4 md:p-6 pointer-events-auto animate-in fade-in select-none">
      <div className="relative w-full max-w-xl backdrop-blur-2xl bg-slate-950/85 border border-[#fbbf24]/40 rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-black/90 text-white flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header Ribbon */}
        <div className="flex items-start justify-between pb-4 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-[#fbbf24] to-yellow-300 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-2xl">
                {todayQuest.icon}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="backdrop-blur-md bg-[#fbbf24]/20 border border-[#fbbf24]/40 text-[#fbbf24] text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full">
                  Daily Rotating Task
                </span>
                <span className="text-[10px] text-white/60 font-mono">
                  {todayQuest.dateKey}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-heritage font-bold text-white mt-1">
                {todayQuest.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Streak & Reset Countdown Banner */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5 fill-current animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-white/60">
                Daily Streak
              </div>
              <div className="text-base font-bold text-orange-400 font-mono">
                {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} 🔥
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-white/60">
                Next Quest Reset
              </div>
              <div className="text-base font-bold text-purple-300 font-mono">
                {countdown}
              </div>
            </div>
          </div>
        </div>

        {/* Quest Lore & Subtitle */}
        <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs font-serif italic text-amber-200 leading-relaxed">
            "{todayQuest.lore}"
          </p>
          <div className="mt-2 text-[11px] text-white/70">
            {todayQuest.subtitle}
          </div>
        </div>

        {/* Objectives Checklist */}
        <div className="mt-5 space-y-2.5 flex-1">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/80">
            <span>Exploration Tasks ({completedCount}/{totalCount})</span>
            <span className="text-[#fbbf24]">{Math.round(progressPercent)}% Complete</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-[#fbbf24] to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="space-y-2 mt-3">
            {todayQuest.objectives.map((obj, idx) => (
              <div
                key={obj.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  obj.completed
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                    : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 shrink-0 ${obj.completed ? 'text-emerald-400' : 'text-white/30'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-xs font-medium ${obj.completed ? 'line-through opacity-80' : ''}`}>
                      {obj.text}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-white/50">
                      <span className="uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                        {obj.targetZone}
                      </span>
                      {obj.targetPosition && (
                        <span>
                          Target: X:{obj.targetPosition[0]} Z:{obj.targetPosition[2]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className={`text-[10px] font-bold font-mono px-2 py-1 rounded-full ${
                    obj.completed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/10 text-white/60'
                  }`}>
                    {obj.completed ? 'DONE' : 'PENDING'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reward Section */}
        <div className="mt-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#fbbf24]/20 border border-[#fbbf24]/40 flex items-center justify-center text-[#fbbf24]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-white/50">
                Daily Completion Reward
              </div>
              <div className="text-xs font-bold text-[#fbbf24]">
                +{todayQuest.rewardXp} Heritage XP • {todayQuest.rewardTitle}
              </div>
            </div>
          </div>

          {isAllCompleted && !todayQuest.completed && (
            <button
              onClick={() => {
                if (onClaimReward) onClaimReward();
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-emerald-950/50 animate-pulse hover:scale-105 active:scale-95 transition-all"
            >
              Claim Reward!
            </button>
          )}

          {todayQuest.completed && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Claimed
            </span>
          )}
        </div>

        {/* Action button */}
        <button
          onClick={() => {
            audio.playClick();
            onClose();
          }}
          className="mt-4 w-full py-3 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold font-heritage tracking-wider rounded-2xl text-xs cursor-pointer shadow-lg shadow-amber-950/50 transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          <span>Resume Daily Exploration</span>
        </button>
      </div>
    </div>
  );
};
