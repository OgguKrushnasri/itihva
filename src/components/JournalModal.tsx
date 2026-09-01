import React, { useState } from 'react';
import { BookOpen, Award, Compass, X, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { ARTIFACTS, BADGES, MISSIONS } from '../game/gameState';
import { GameProgress } from '../types';
import { audio } from '../game/audio';

interface JournalModalProps {
  progress: GameProgress;
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ progress, onClose }) => {
  const [activeTab, setActiveTab] = useState<'artifacts' | 'badges' | 'missions' | 'history'>('artifacts');
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>(ARTIFACTS[0].id);

  const selectedArtifact = ARTIFACTS.find(a => a.id === selectedArtifactId) || ARTIFACTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-2xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[620px] backdrop-blur-2xl bg-slate-950/80 border border-white/20 rounded-[2.5rem] shadow-2xl shadow-black/90 flex flex-col overflow-hidden text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#fbbf24]/20 rounded-2xl border border-[#fbbf24]/40">
              <BookOpen className="w-6 h-6 text-[#fbbf24]" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heritage text-[#fbbf24]">
                Itihva Heritage Codex & Discoveries
              </h2>
              <p className="text-xs text-white/70 font-sans">
                Chronicle of Indian Civilization, Sacred Architecture, and Ecology
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 border border-white/15 flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-6 bg-black/30">
          {[
            { id: 'artifacts', label: 'Ancient Artifacts', icon: Sparkles },
            { id: 'badges', label: 'Cultural Badges', icon: Award },
            { id: 'missions', label: 'Expedition Quests', icon: Compass },
            { id: 'history', label: 'Civilization Insights', icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  audio.playClick();
                }}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#fbbf24] text-[#fbbf24] bg-white/10'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
          {/* 1. ARTIFACTS TAB */}
          {activeTab === 'artifacts' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              {/* Artifacts List */}
              <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
                {ARTIFACTS.map(art => {
                  const isUnlocked = progress.unlockedArtifacts.includes(art.id) || art.unlocked;
                  const isSelected = selectedArtifactId === art.id;
                  return (
                    <button
                      key={art.id}
                      onClick={() => {
                        setSelectedArtifactId(art.id);
                        audio.playClick();
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#fbbf24] bg-white/15 shadow-md ring-1 ring-[#fbbf24]'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      } ${!isUnlocked ? 'opacity-50' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/15 flex items-center justify-center font-heritage font-bold text-[#fbbf24] shrink-0">
                        {isUnlocked ? '🏛️' : '🔒'}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate">{art.name}</div>
                        <div className="text-[11px] text-[#fbbf24]/80">{art.hindiName}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Artifact Detail Panel */}
              <div className="md:col-span-2 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/15 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#fbbf24] bg-white/10 px-3 py-1 rounded-full border border-white/15">
                        {selectedArtifact.era}
                      </span>
                      <h3 className="text-2xl font-bold font-heritage text-white mt-2">
                        {selectedArtifact.name}
                      </h3>
                      <p className="text-sm font-folk text-[#fbbf24]">{selectedArtifact.hindiName}</p>
                    </div>
                    <span className="text-xs text-white/50">Provenance: {selectedArtifact.location}</span>
                  </div>

                  <div className="space-y-4 text-sm text-white/85 leading-relaxed mt-4">
                    <p className="bg-black/30 p-4 rounded-2xl border border-white/10">
                      {selectedArtifact.description}
                    </p>

                    <div className="p-4 bg-[#fbbf24]/10 rounded-2xl border border-[#fbbf24]/30">
                      <h4 className="text-xs font-bold text-[#fbbf24] uppercase tracking-wide mb-1">
                        Historical & Cultural Significance:
                      </h4>
                      <p className="text-xs text-white/90">{selectedArtifact.significance}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-white/50">
                  <span>Classification: Masterwork Heritage Archetype</span>
                  <span className="text-[#fbbf24] font-medium">Recorded in National Archives of India</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. BADGES TAB */}
          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BADGES.map(b => {
                const isEarned = progress.badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                      isEarned
                        ? 'border-[#fbbf24]/60 bg-white/10 shadow-md ring-1 ring-[#fbbf24]/30'
                        : 'border-white/10 bg-white/5 opacity-50'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/15 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold font-heritage text-white">{b.name}</h4>
                        {isEarned && <CheckCircle2 className="w-4 h-4 text-[#10b981]" />}
                      </div>
                      <p className="text-xs text-[#fbbf24] font-semibold">{b.title}</p>
                      <p className="text-xs text-white/80 mt-1 leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. MISSIONS TAB */}
          {activeTab === 'missions' && (
            <div className="space-y-3">
              {MISSIONS.map((m, idx) => {
                const isDone = progress.completedMissions.includes(m.id);
                const isCurrent = progress.currentMissionIndex === idx;
                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isDone
                        ? 'border-emerald-500/30 bg-emerald-950/20'
                        : isCurrent
                        ? 'border-[#fbbf24] bg-white/10 shadow-md ring-1 ring-[#fbbf24]'
                        : 'border-white/10 bg-white/5 opacity-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isDone
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : isCurrent
                                ? 'bg-[#fbbf24] text-black'
                                : 'bg-white/10 text-white/50'
                            }`}
                          >
                            {isDone ? 'Completed' : isCurrent ? 'Active Objective' : 'Upcoming'}
                          </span>
                          <h4 className="text-sm font-bold text-white">{m.title}</h4>
                        </div>
                        <p className="text-xs text-white/80 mt-1.5">{m.description}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-xs text-white/70">
                      <span>Reward: {m.rewardItem || 'Cultural Badge'}</span>
                      <span className="font-semibold text-[#fbbf24]">Zone: {m.zone.toUpperCase()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. HISTORY INSIGHTS TAB */}
          {activeTab === 'history' && (
            <div className="space-y-4 text-xs md:text-sm text-white/85 leading-relaxed">
              <div className="p-4 backdrop-blur-md bg-white/5 rounded-2xl border border-white/15">
                <h4 className="text-base font-bold font-heritage text-[#fbbf24] mb-1">
                  1. Vedic Eco-Engineering & Water Baolis
                </h4>
                <p>
                  India pioneered subterranean stepwells (Baolis) like Rani ki Vav and Chand Baori, which collected seasonal monsoon water, naturally cooled underground temples by 6°C, and provided community social halls.
                </p>
              </div>

              <div className="p-4 backdrop-blur-md bg-white/5 rounded-2xl border border-white/15">
                <h4 className="text-base font-bold font-heritage text-[#fbbf24] mb-1">
                  2. Sacred Architecture & Seismic Stone Interlocking
                </h4>
                <p>
                  Ancient temples like Brihadeeswara and Konark utilized zero-mortar mortise-and-tenon granite interlocking, allowing massive stone structures to withstand earthquakes for over a millennium.
                </p>
              </div>

              <div className="p-4 backdrop-blur-md bg-white/5 rounded-2xl border border-white/15">
                <h4 className="text-base font-bold font-heritage text-[#fbbf24] mb-1">
                  3. Sacred Groves & Biodiversity Protection
                </h4>
                <p>
                  Traditional communities designated forests as <em>Devarakadus</em> (Sacred Groves), preserving pristine water catchment systems and biodiversity refuges where hunting and tree felling were strictly prohibited.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
