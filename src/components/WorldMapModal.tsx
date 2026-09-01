import React, { useState } from 'react';
import {
  Map as MapIcon,
  X,
  MapPin,
  Compass,
  Navigation,
  Sparkles,
  Layers,
  Flame,
  BookOpen,
  Info,
  Calendar,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { NPCS, MISSIONS } from '../game/gameState';
import { DailyQuest } from '../types';
import { audio } from '../game/audio';

interface WorldMapModalProps {
  playerPos: { x: number; y: number; z: number };
  playerRotationY: number;
  currentZone: string;
  activeMissionIndex: number;
  dailyQuest?: DailyQuest | null;
  onClose: () => void;
}

interface Landmark {
  id: string;
  name: string;
  zone: string;
  x: number;
  z: number;
  icon: string;
  color: string;
  category: 'village' | 'temple' | 'forest' | 'water';
  lore: string;
  architecturalStyle: string;
}

const LANDMARKS: Landmark[] = [
  {
    id: 'banyan_tree',
    name: 'Sacred Banyan Tree (Vatavriksha)',
    zone: 'village',
    x: -4,
    z: 8,
    icon: '🌳',
    color: '#10b981',
    category: 'village',
    lore: 'The venerable Banyan tree has anchored Bharatpur for over 400 years. Its wide aerial prop roots symbolize eternal cosmic life. Here, the Village Elder presides over Panchayat gatherings and democratic councils.',
    architecturalStyle: 'Sacred Living Grove & Raised Stone Chabutra'
  },
  {
    id: 'rangoli_courtyard',
    name: 'Vedic Rangoli Courtyard',
    zone: 'village',
    x: -12,
    z: 14,
    icon: '✨',
    color: '#fbbf24',
    category: 'village',
    lore: 'A paved stone courtyard dedicated to the ancient ephemeral art of geometric Kolam and Rangoli, drawn with rice flour to welcome cosmic harmony and auspicious energy.',
    architecturalStyle: 'Traditional Domestic Terracotta Courtyard'
  },
  {
    id: 'pottery_workshop',
    name: "Master Potter's Kiln & Wheel",
    zone: 'village',
    x: 8,
    z: 18,
    icon: '🏺',
    color: '#f97316',
    category: 'village',
    lore: 'Local artisans spin fine alluvial silt from the riverbed into porous terracotta vessels, cooling water naturally through evaporative physics known since the Indus Valley Civilization.',
    architecturalStyle: 'Traditional Alluvial Ceramic Hearth'
  },
  {
    id: 'weaver_cottage',
    name: 'Lakshmi Handloom Weavery',
    zone: 'village',
    x: -18,
    z: 6,
    icon: '🧵',
    color: '#06b6d4',
    category: 'village',
    lore: 'Home of traditional wooden pit-looms where silk and cotton are woven with organic dyes extracted from turmeric, indigo, and madder roots.',
    architecturalStyle: 'Thatch & Teak Handloom Atelier'
  },
  {
    id: 'temple_mahamandapa',
    name: 'Mahamandapa Sun Temple Sanctum',
    zone: 'temple',
    x: 28,
    z: 12,
    icon: '🛕',
    color: '#f59e0b',
    category: 'temple',
    lore: 'Carved from monolithic red sandstone following ancient Vastu Shastra principles. The central Shikhara tower aligns with the equinox sunrise, channeling natural celestial light onto the sacred altar.',
    architecturalStyle: 'Nagara Sandstone Architecture with Interlocking Dry Masonry'
  },
  {
    id: 'temple_altar',
    name: 'Solar Meridian Wheel & Altar',
    zone: 'temple',
    x: 28,
    z: 12,
    icon: '☀️',
    color: '#fbbf24',
    category: 'temple',
    lore: 'An astronomical sundial dial inspired by Konark Sun Temple, calculating solar azimuth and time using the shadow cast by its cardinal spokes.',
    architecturalStyle: 'Astronomical Vastu Horologe'
  },
  {
    id: 'narmada_bridge',
    name: 'Narmada River Timber Bridge',
    zone: 'forest',
    x: 22,
    z: -14,
    icon: '🪵',
    color: '#8b5cf6',
    category: 'water',
    lore: 'A sturdy bridge crafted from seasoned sal wood, bridging the human settlements of Bharatpur with the wild bio-reserves of the Sacred Forest.',
    architecturalStyle: 'Cantilevered Teak & Sal Bridge'
  },
  {
    id: 'sacred_waterfall',
    name: 'Narmada Cascading Falls',
    zone: 'forest',
    x: -30,
    z: -38,
    icon: '🌊',
    color: '#38bdf8',
    category: 'water',
    lore: 'A pristine mountain spring feeding the Narmada River basin. Ancient hermitages along its misty banks were retreats for Vedic scholars and Ayurvedic botanists.',
    architecturalStyle: 'Natural Riparian Cascade'
  },
  {
    id: 'stepwell_baoli',
    name: 'Subterranean Baoli Stepwell',
    zone: 'stepwell',
    x: 35,
    z: -42,
    icon: '🏛️',
    color: '#ec4899',
    category: 'water',
    lore: 'An inverted underground palace engineered to harvest monsoon rainwater, regulate ambient temperature, and provide a communal oasis during arid summer seasons.',
    architecturalStyle: 'Maru-Gurjara Subterranean Stepped Architecture'
  }
];

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  playerPos,
  playerRotationY,
  currentZone,
  activeMissionIndex,
  dailyQuest,
  onClose
}) => {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(LANDMARKS[0]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'village' | 'temple' | 'forest' | 'water'>('all');

  // World bounds in 3D scene
  // X spans from -55 (West) to +55 (East)
  // Z spans from -65 (North) to +45 (South)
  const minX = -55;
  const maxX = 55;
  const minZ = -65;
  const maxZ = 45;
  const worldWidth = maxX - minX;
  const worldHeight = maxZ - minZ;

  // Convert 3D world (X, Z) to SVG percentages (0 to 100)
  const toMapCoords = (x: number, z: number) => {
    const mapX = ((x - minX) / worldWidth) * 100;
    const mapY = ((z - minZ) / worldHeight) * 100;
    return {
      x: Math.max(3, Math.min(97, mapX)),
      y: Math.max(3, Math.min(97, mapY))
    };
  };

  const playerMapPos = toMapCoords(playerPos.x, playerPos.z);
  const playerDeg = (playerRotationY * 180) / Math.PI;

  const currentMission = MISSIONS[activeMissionIndex];

  // Calculate distance from player to a landmark in meters
  const getDistanceToLandmark = (landmark: Landmark) => {
    const dx = playerPos.x - landmark.x;
    const dz = playerPos.z - landmark.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    return Math.round(dist);
  };

  const filteredLandmarks = LANDMARKS.filter(
    lm => activeFilter === 'all' || lm.category === activeFilter
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-3 md:p-6 animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] backdrop-blur-2xl bg-slate-950/90 border border-white/20 rounded-[2.5rem] p-5 md:p-7 shadow-2xl shadow-black/95 text-white flex flex-col overflow-hidden ring-1 ring-[#fbbf24]/30">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500/30 to-[#fbbf24]/20 rounded-2xl border border-[#fbbf24]/40 shadow-inner">
              <MapIcon className="w-6 h-6 text-[#fbbf24]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold font-heritage text-[#fbbf24] tracking-tight">
                  ITIHVA Realm Cartography
                </h2>
                <span className="backdrop-blur-md bg-white/10 border border-white/20 text-[#fbbf24] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  GPS Active
                </span>
              </div>
              <p className="text-xs text-white/70">
                Interactive topographical survey of Vedic Bharatpur, sacred mandapas, forests, and subterranean stepwells
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70">
              <Compass className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span className="font-mono text-[11px]">
                X: {Math.round(playerPos.x)}, Z: {Math.round(playerPos.z)}
              </span>
            </div>
            <button
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 border border-white/15 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
              title="Close Map (M / Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content: Map Grid & Landmark Detail Drawer */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 my-4 min-h-0 overflow-hidden">
          {/* Left Column: Tactical SVG Map Canvas (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col h-full rounded-3xl border border-white/15 bg-[#12151c] overflow-hidden relative shadow-inner">
            {/* Filter Pills Bar */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/65 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
              <button
                onClick={() => setActiveFilter('all')}
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#fbbf24] text-black shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                All Zones
              </button>
              <button
                onClick={() => setActiveFilter('village')}
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  activeFilter === 'village'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Village
              </button>
              <button
                onClick={() => setActiveFilter('temple')}
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  activeFilter === 'temple'
                    ? 'bg-yellow-400 text-black shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Temple
              </button>
              <button
                onClick={() => setActiveFilter('water')}
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  activeFilter === 'water'
                    ? 'bg-sky-400 text-black shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Waterways
              </button>
            </div>

            {/* Compass Rose in Corner */}
            <div className="absolute top-3 right-3 z-20 bg-black/65 backdrop-blur-md p-2 rounded-2xl border border-white/15 flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#fbbf24] font-mono">N</span>
              <Compass className="w-4 h-4 text-[#fbbf24] animate-spin-slow" />
              <span className="text-[8px] text-white/50 font-mono">S</span>
            </div>

            {/* Tactical SVG Map */}
            <div className="relative flex-1 w-full h-full p-2">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full rounded-2xl"
                preserveAspectRatio="none"
              >
                <defs>
                  <radialGradient id="mapVillageGrad" cx="30%" cy="75%" r="45%">
                    <stop offset="0%" stopColor="#78350f" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#451a03" stopOpacity="0.05" />
                  </radialGradient>
                  <radialGradient id="mapTempleGrad" cx="75%" cy="70%" r="40%">
                    <stop offset="0%" stopColor="#b45309" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#78350f" stopOpacity="0.05" />
                  </radialGradient>
                  <radialGradient id="mapForestGrad" cx="30%" cy="30%" r="45%">
                    <stop offset="0%" stopColor="#064e3b" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#022c22" stopOpacity="0.05" />
                  </radialGradient>
                  <radialGradient id="mapBaoliGrad" cx="80%" cy="25%" r="35%">
                    <stop offset="0%" stopColor="#0e7490" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#083344" stopOpacity="0.05" />
                  </radialGradient>
                </defs>

                {/* Base Background Grid */}
                <rect width="100" height="100" fill="#0f172a" />

                {/* Grid Overlay Lines */}
                <g stroke="#ffffff" strokeWidth="0.12" opacity="0.15">
                  <line x1="20" y1="0" x2="20" y2="100" />
                  <line x1="40" y1="0" x2="40" y2="100" />
                  <line x1="60" y1="0" x2="60" y2="100" />
                  <line x1="80" y1="0" x2="80" y2="100" />
                  <line x1="0" y1="20" x2="100" y2="20" />
                  <line x1="0" y1="40" x2="100" y2="40" />
                  <line x1="0" y1="60" x2="100" y2="60" />
                  <line x1="0" y1="80" x2="100" y2="80" />
                </g>

                {/* Realm Zone Blobs */}
                <circle cx="30" cy="75" r="28" fill="url(#mapVillageGrad)" />
                <circle cx="75" cy="70" r="24" fill="url(#mapTempleGrad)" />
                <circle cx="28" cy="30" r="26" fill="url(#mapForestGrad)" />
                <circle cx="80" cy="25" r="22" fill="url(#mapBaoliGrad)" />

                {/* River Narmada Water Ribbon */}
                <path
                  d="M 5 28 Q 28 35 48 46 T 95 50"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <path
                  d="M 5 28 Q 28 35 48 46 T 95 50"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />

                {/* Narmada Timber Bridge */}
                <line
                  x1="68"
                  y1="45"
                  x2="72"
                  y2="52"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Village Central Stone Chabutra */}
                <circle
                  cx={toMapCoords(-4, 8).x}
                  cy={toMapCoords(-4, 8).y}
                  r="6"
                  fill="#78350f"
                  opacity="0.6"
                  stroke="#f59e0b"
                  strokeWidth="0.4"
                />

                {/* Temple Jagati Base Plinth Rect */}
                <rect
                  x={toMapCoords(16, 2).x}
                  y={toMapCoords(16, 2).y}
                  width="22"
                  height="18"
                  fill="#92400e"
                  opacity="0.65"
                  stroke="#fbbf24"
                  strokeWidth="0.5"
                  rx="1.5"
                />

                {/* Subterranean Stepwell Outer Basin */}
                <rect
                  x={toMapCoords(28, -48).x}
                  y={toMapCoords(28, -48).y}
                  width="18"
                  height="14"
                  fill="#0369a1"
                  opacity="0.6"
                  stroke="#38bdf8"
                  strokeWidth="0.5"
                  rx="1"
                />

                {/* Zone Labels */}
                <text
                  x="26"
                  y="86"
                  fill="#fbbf24"
                  fontSize="3"
                  fontWeight="700"
                  fontFamily="serif"
                  opacity="0.85"
                  textAnchor="middle"
                  style={{ textShadow: '0 1px 3px #000' }}
                >
                  BHARATPUR VILLAGE
                </text>
                <text
                  x="76"
                  y="85"
                  fill="#fde68a"
                  fontSize="3"
                  fontWeight="700"
                  fontFamily="serif"
                  opacity="0.85"
                  textAnchor="middle"
                  style={{ textShadow: '0 1px 3px #000' }}
                >
                  SUN TEMPLE SANCTUM
                </text>
                <text
                  x="25"
                  y="18"
                  fill="#6ee7b7"
                  fontSize="3"
                  fontWeight="700"
                  fontFamily="serif"
                  opacity="0.85"
                  textAnchor="middle"
                  style={{ textShadow: '0 1px 3px #000' }}
                >
                  NARMADA SACRED GROVE
                </text>
                <text
                  x="78"
                  y="16"
                  fill="#7dd3fc"
                  fontSize="3"
                  fontWeight="700"
                  fontFamily="serif"
                  opacity="0.85"
                  textAnchor="middle"
                  style={{ textShadow: '0 1px 3px #000' }}
                >
                  STEPWELL BAOLI
                </text>

                {/* NPC Locations */}
                {NPCS.map(npc => {
                  const pos = toMapCoords(npc.position[0], npc.position[2]);
                  return (
                    <g key={npc.id} transform={`translate(${pos.x}, ${pos.y})`}>
                      <circle r="1.8" fill="#10b981" stroke="#ffffff" strokeWidth="0.5" />
                      <text
                        x="2.4"
                        y="1"
                        fill="#ffffff"
                        fontSize="2.2"
                        fontWeight="600"
                        style={{ textShadow: '0 1px 2px #000' }}
                      >
                        {npc.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}

                {/* Interactive Landmarks */}
                {filteredLandmarks.map(lm => {
                  const pos = toMapCoords(lm.x, lm.z);
                  const isSelected = selectedLandmark?.id === lm.id;
                  return (
                    <g
                      key={lm.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      className="cursor-pointer group"
                      onClick={() => {
                        audio.playClick();
                        setSelectedLandmark(lm);
                      }}
                    >
                      {/* Selection Ring */}
                      {isSelected && (
                        <circle
                          r="5.5"
                          fill="none"
                          stroke={lm.color}
                          strokeWidth="0.8"
                          strokeDasharray="1.5 1"
                          className="animate-spin-slow"
                        />
                      )}
                      <circle
                        r={isSelected ? 3.8 : 3}
                        fill={lm.color}
                        stroke="#ffffff"
                        strokeWidth="0.6"
                        className="transition-transform group-hover:scale-125"
                      />
                      <text
                        x="0"
                        y="1.1"
                        textAnchor="middle"
                        fontSize="2.4"
                        fill="#000000"
                        fontWeight="bold"
                      >
                        {lm.icon}
                      </text>
                    </g>
                  );
                })}

                {/* Real-time Player Locator GPS Pin */}
                <g transform={`translate(${playerMapPos.x}, ${playerMapPos.y})`}>
                  {/* Outer Radar Pulse */}
                  <circle
                    r="6.5"
                    fill="#3b82f6"
                    opacity="0.3"
                    className="animate-ping"
                  />
                  <circle
                    r="4"
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth="0.8"
                    className="shadow-lg"
                  />
                  {/* Player Orientation Pointer */}
                  <path
                    d="M 0,-5.5 L 2.5,-1.5 L -2.5,-1.5 Z"
                    fill="#fbbf24"
                    stroke="#000000"
                    strokeWidth="0.3"
                    transform={`rotate(${playerDeg})`}
                  />
                  <circle r="1.3" fill="#ffffff" />
                </g>
              </svg>
            </div>

            {/* Map Footer Toolbar */}
            <div className="bg-black/60 backdrop-blur-md p-2.5 px-4 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white" />
                  <span>You (Explorer)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                  <span>NPC Scholars</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
                  <span>Landmarks</span>
                </span>
              </div>

              <div className="text-[11px] font-mono text-[#fbbf24]">
                Active Zone: <span className="font-bold uppercase text-white">{currentZone}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Selected Landmark Details & Lore Dossier (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col h-full rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md p-4 overflow-y-auto space-y-4">
            {selectedLandmark ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-2xl shadow-inner">
                      {selectedLandmark.icon}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#fbbf24] font-bold">
                        {selectedLandmark.zone} Realm
                      </span>
                      <h3 className="text-base font-bold font-heritage text-white leading-tight">
                        {selectedLandmark.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Distance telemetry */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <Navigation className="w-4 h-4 text-[#fbbf24]" />
                    <span>Distance from Player:</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#fbbf24] bg-[#fbbf24]/10 px-2 py-0.5 rounded-lg border border-[#fbbf24]/30">
                    {getDistanceToLandmark(selectedLandmark)} meters
                  </span>
                </div>

                {/* Architectural Fact Box */}
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Architectural Typology</span>
                  </div>
                  <p className="text-xs font-serif italic text-white/90">
                    {selectedLandmark.architecturalStyle}
                  </p>
                </div>

                {/* Historical Lore & Context */}
                <div className="space-y-1.5 flex-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-white/60">
                    Historical Heritage & Significance
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">
                    {selectedLandmark.lore}
                  </p>
                </div>

                {/* Quick Landmark Fast-Travel / Navigation Guide */}
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-white/70 flex items-center justify-between">
                  <span>Coordinates:</span>
                  <span className="font-mono text-white/90 font-bold">
                    X: {selectedLandmark.x}, Z: {selectedLandmark.z}
                  </span>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/50">
                <MapPin className="w-10 h-10 mb-2 opacity-40 text-[#fbbf24]" />
                <p className="text-xs">Click on any landmark pin on the map to inspect its ancient architecture and lore.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 shrink-0 text-xs">
          <div className="text-white/60 text-[11px] hidden sm:block">
            💡 Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono font-bold">M</kbd> or click anywhere outside to resume 3D adventure.
          </div>
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="px-6 py-2.5 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold font-heritage rounded-2xl cursor-pointer shadow-lg shadow-amber-950/50 transition-transform active:scale-95 ml-auto"
          >
            Resume Adventure
          </button>
        </div>
      </div>
    </div>
  );
};
