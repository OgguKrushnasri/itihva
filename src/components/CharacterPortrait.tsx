import React from 'react';
import { PlayerCustomization, NPCData } from '../types';

interface CharacterPortraitProps {
  player?: PlayerCustomization;
  npc?: NPCData;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
  className?: string;
  isAnimated?: boolean;
}

export const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  player,
  npc,
  size = 'md',
  showBorder = true,
  className = '',
  isAnimated = false
}) => {
  // Extract styling properties with fallbacks
  const skinTone = player?.skinTone || npc?.skinTone || '#9a6b49';
  const outfitColor = player?.outfitColor || npc?.clothingColor || '#e06d10';
  const accentColor = player?.accentColor || npc?.clothingSecondary || '#1e3a8a';
  const hairColor = player?.turbanColor || npc?.hairColor || '#262626';
  const hairStyle = player?.hairStyle || npc?.hairStyle || 'tied_topknot';
  const outfit = player?.outfit || npc?.outfit || 'adventurer_kurta';

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 md:w-16 md:h-16',
    lg: 'w-20 h-20 md:w-24 md:h-24',
    xl: 'w-28 h-28 md:w-32 md:h-32'
  };

  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center shrink-0 select-none ${
        sizeClasses[size]
      } ${showBorder ? 'border-2 md:border-3 border-[#fbbf24] shadow-xl shadow-black/60 bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-950' : 'bg-transparent'} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${isAnimated ? 'animate-pulse' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle lighting gradients */}
          <radialGradient id="bgGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
          </radialGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={skinTone} />
            <stop offset="100%" stopColor={adjustColor(skinTone, -25)} />
          </linearGradient>
          <linearGradient id="outfitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={outfitColor} />
            <stop offset="100%" stopColor={adjustColor(outfitColor, -30)} />
          </linearGradient>
          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor={adjustColor(accentColor, -30)} />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        {/* Circular background */}
        <circle cx="50" cy="50" r="48" fill="url(#bgGlow)" />

        {/* --- BODY / SHOULDERS --- */}
        {/* Chest and Shoulders */}
        <path
          d="M 18 100 Q 18 72 32 68 L 68 68 Q 82 72 82 100 Z"
          fill="url(#outfitGrad)"
        />

        {/* Neck */}
        <path
          d="M 43 56 L 57 56 L 55 68 L 45 68 Z"
          fill="url(#skinGrad)"
        />

        {/* Collar / Vastra / Sash Details based on Outfit */}
        {outfit === 'adventurer_kurta' || outfit === 'farmer' ? (
          <>
            {/* Kurta Collar Cut */}
            <path d="M 45 67 L 50 78 L 55 67 Z" fill="url(#skinGrad)" />
            {/* Diagonal Angavastram Sash */}
            <path
              d="M 24 95 Q 45 74 66 68 L 74 72 Q 52 82 32 100 Z"
              fill="url(#accentGrad)"
            />
            {/* Gold trim on sash */}
            <path
              d="M 25 94 Q 46 74 66 68"
              stroke="url(#goldGrad)"
              strokeWidth="2"
            />
          </>
        ) : outfit === 'royal_angavastram' || outfit === 'priest' ? (
          <>
            {/* Royal Dual Shoulder Stole (Uttariya) */}
            <path
              d="M 28 68 L 36 68 L 34 100 L 25 100 Z"
              fill="url(#accentGrad)"
            />
            <path
              d="M 72 68 L 64 68 L 66 100 L 75 100 Z"
              fill="url(#accentGrad)"
            />
            {/* Gold Border Trims */}
            <line x1="36" y1="68" x2="34" y2="100" stroke="url(#goldGrad)" strokeWidth="2" />
            <line x1="64" y1="68" x2="66" y2="100" stroke="url(#goldGrad)" strokeWidth="2" />
            {/* Central Pendant / Mala */}
            <path
              d="M 42 68 Q 50 82 58 68"
              stroke="url(#goldGrad)"
              strokeWidth="2.5"
              fill="none"
            />
            <circle cx="50" cy="82" r="3.5" fill="#ef4444" stroke="#fde047" strokeWidth="1" />
          </>
        ) : outfit === 'traditional_saree' || outfit === 'saree' ? (
          <>
            {/* Saree Pallu Pleats Draped Diagonally Across Torso */}
            <path
              d="M 22 100 L 40 68 L 62 68 L 38 100 Z"
              fill="url(#accentGrad)"
            />
            <line x1="40" y1="68" x2="22" y2="100" stroke="url(#goldGrad)" strokeWidth="2" />
            <line x1="46" y1="68" x2="28" y2="100" stroke="url(#goldGrad)" strokeWidth="1" />
          </>
        ) : (
          <>
            {/* Explorer Vest */}
            <path d="M 28 68 L 42 68 L 40 100 L 22 100 Z" fill="#78350f" />
            <path d="M 72 68 L 58 68 L 60 100 L 78 100 Z" fill="#78350f" />
            <line x1="42" y1="78" x2="58" y2="78" stroke="#ca8a04" strokeWidth="2" />
          </>
        )}

        {/* --- HEAD & FACE --- */}
        {/* Head Base */}
        <ellipse cx="50" cy="45" rx="19" ry="21" fill="url(#skinGrad)" />

        {/* Ears */}
        <ellipse cx="30" cy="46" rx="3.5" ry="5.5" fill="url(#skinGrad)" />
        <ellipse cx="70" cy="46" rx="3.5" ry="5.5" fill="url(#skinGrad)" />

        {/* Gold Ear Studs / Kundal */}
        <circle cx="30" cy="49" r="1.8" fill="url(#goldGrad)" />
        <circle cx="70" cy="49" r="1.8" fill="url(#goldGrad)" />

        {/* Expressive Eyes */}
        {/* Left Eye */}
        <ellipse cx="42" cy="45" rx="4.5" ry="3.2" fill="#ffffff" />
        <circle cx="42.5" cy="45" r="2.2" fill="#18181b" />
        <circle cx="43.5" cy="44" r="0.9" fill="#ffffff" />

        {/* Right Eye */}
        <ellipse cx="58" cy="45" rx="4.5" ry="3.2" fill="#ffffff" />
        <circle cx="57.5" cy="45" r="2.2" fill="#18181b" />
        <circle cx="56.5" cy="44" r="0.9" fill="#ffffff" />

        {/* Eyebrows */}
        <path
          d="M 37 39 Q 42 36 47 39"
          stroke={hairColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 63 39 Q 58 36 53 39"
          stroke={hairColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Nose */}
        <path
          d="M 50 42 L 48.5 49 L 51.5 49"
          stroke={adjustColor(skinTone, -40)}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Gentle Cheerful Smile */}
        <path
          d="M 45 54 Q 50 58 55 54"
          stroke={adjustColor(skinTone, -60)}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Red Chandan / Bindi / Tilak on Forehead */}
        <ellipse cx="50" cy="38" rx="1.8" ry="3.5" fill="#dc2626" />
        <circle cx="50" cy="34" r="1.2" fill="#fbbf24" />

        {/* --- HAIRSTYLE / HEADGEAR --- */}
        {hairStyle === 'turban' ? (
          <>
            {/* Traditional Royal Rajasthani / Sikh Pagri */}
            <path
              d="M 28 40 Q 26 22 50 17 Q 74 22 72 40 Q 64 30 50 31 Q 36 30 28 40 Z"
              fill="url(#accentGrad)"
            />
            {/* Turban Folds and Swirls */}
            <path
              d="M 28 34 Q 50 20 72 34"
              stroke="url(#goldGrad)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 32 26 Q 50 14 68 26"
              stroke={adjustColor(accentColor, 30)}
              strokeWidth="2"
              fill="none"
            />
            {/* Royal Kalgi / Jewel Crest on Turban */}
            <circle cx="50" cy="22" r="3.2" fill="url(#goldGrad)" />
            <circle cx="50" cy="22" r="1.8" fill="#dc2626" />
            <path d="M 50 19 L 50 11" stroke="url(#goldGrad)" strokeWidth="2" />
          </>
        ) : hairStyle === 'tied_topknot' ? (
          <>
            {/* Sleek Hairline */}
            <path
              d="M 30 42 Q 33 26 50 26 Q 67 26 70 42 Q 62 33 50 33 Q 38 33 30 42 Z"
              fill={hairColor}
            />
            {/* Shikha / Topknot Bun */}
            <circle cx="50" cy="22" r="7" fill={hairColor} />
            {/* Golden Ribbon Band holding Topknot */}
            <rect x="44" y="25" width="12" height="3" rx="1.5" fill="url(#goldGrad)" />
          </>
        ) : hairStyle === 'long_braid' ? (
          <>
            {/* Parted sleek hair with central Maang Tikka */}
            <path
              d="M 30 42 Q 34 26 50 27 Q 66 26 70 42 Q 62 34 50 34 Q 38 34 30 42 Z"
              fill={hairColor}
            />
            {/* Braid strands visible beside shoulders */}
            <path
              d="M 30 46 Q 25 60 27 75 Q 31 66 33 50 Z"
              fill={hairColor}
            />
            {/* Gold Maang Tikka Jewelry */}
            <line x1="50" y1="27" x2="50" y2="34" stroke="url(#goldGrad)" strokeWidth="1.5" />
            <circle cx="50" cy="34" r="2" fill="url(#goldGrad)" />
            <circle cx="50" cy="34" r="1" fill="#dc2626" />
          </>
        ) : (
          <>
            {/* Classic Short Parted Groomed Hair */}
            <path
              d="M 28 42 Q 30 25 50 25 Q 70 25 72 42 Q 62 31 50 31 Q 36 31 28 42 Z"
              fill={hairColor}
            />
            <path
              d="M 30 38 Q 42 27 54 31"
              stroke={adjustColor(hairColor, 40)}
              strokeWidth="2"
              fill="none"
            />
          </>
        )}
      </svg>
    </div>
  );
};

/**
 * Utility function to darken or lighten a hex color
 */
function adjustColor(hex: string, amount: number): string {
  if (!hex || !hex.startsWith('#')) return '#000000';
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const num = parseInt(color, 16);
  if (isNaN(num)) return hex;

  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
