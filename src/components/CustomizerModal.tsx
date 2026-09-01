import React, { useState } from 'react';
import { User, Sparkles, X, Check, Wand2 } from 'lucide-react';
import { PlayerCustomization } from '../types';
import { audio } from '../game/audio';
import { CharacterPortrait } from './CharacterPortrait';

interface CustomizerModalProps {
  customization: PlayerCustomization;
  onSave: (customization: PlayerCustomization) => void;
  onClose: () => void;
}

const PRESETS: Array<{ name: string; label: string; customization: Partial<PlayerCustomization> }> = [
  {
    name: 'Aryan',
    label: 'Vedic Explorer',
    customization: {
      name: 'Aryan',
      outfit: 'adventurer_kurta',
      outfitColor: '#e06d10',
      accentColor: '#1e3a8a',
      hairStyle: 'tied_topknot',
      skinTone: '#9a6b49'
    }
  },
  {
    name: 'Meera',
    label: 'Master Artisan',
    customization: {
      name: 'Meera',
      outfit: 'traditional_saree',
      outfitColor: '#991b1b',
      accentColor: '#fbbf24',
      hairStyle: 'long_braid',
      skinTone: '#b58463'
    }
  },
  {
    name: 'Vikram',
    label: 'Royal Scholar',
    customization: {
      name: 'Vikram',
      outfit: 'royal_angavastram',
      outfitColor: '#1e3a8a',
      accentColor: '#fbbf24',
      hairStyle: 'turban',
      skinTone: '#7c4d28'
    }
  },
  {
    name: 'Ananya',
    label: 'Sacred Botanist',
    customization: {
      name: 'Ananya',
      outfit: 'explorer_vest',
      outfitColor: '#15803d',
      accentColor: '#e06d10',
      hairStyle: 'short_parted',
      skinTone: '#c68a4c'
    }
  }
];

const OUTFITS = [
  { id: 'adventurer_kurta', name: 'Adventurer Kurta & Dhoti', desc: 'Comfortable cotton tunic with royal sash' },
  { id: 'royal_angavastram', name: 'Silk Angavastram Robes', desc: 'Traditional formal ceremonial attire' },
  { id: 'traditional_saree', name: 'Handloom Saree Drape', desc: 'Artisanal handwoven cotton saree' },
  { id: 'explorer_vest', name: 'Field Explorer Kurta', desc: 'Durable trekking attire with pouches' }
];

const OUTFIT_COLORS = [
  { name: 'Saffron (Kesariya)', value: '#e06d10' },
  { name: 'Peacock Blue (Mayura)', value: '#1e3a8a' },
  { name: 'Forest Emerald (Panna)', value: '#15803d' },
  { name: 'Maroon Crimson (Raktam)', value: '#991b1b' },
  { name: 'Pure Khadi White (Shveta)', value: '#f8fafc' }
];

const SKIN_TONES = [
  { name: 'Wheatish Gold', value: '#c68a4c' },
  { name: 'Warm Bronze', value: '#9a6b49' },
  { name: 'Deep Ochre', value: '#7c4d28' },
  { name: 'Fair Terracotta', value: '#d4a373' }
];

const HAIR_STYLES = [
  { id: 'tied_topknot', name: 'Adventurer Topknot (Shikha)' },
  { id: 'turban', name: 'Royal Pagri (Turban)' },
  { id: 'long_braid', name: 'Traditional Braid with Clasp' },
  { id: 'short_parted', name: 'Classic Groomed Part' }
];

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  customization,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<PlayerCustomization>(customization);

  const handleSave = () => {
    audio.playMissionComplete();
    onSave(formData);
    onClose();
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setFormData(prev => ({
      ...prev,
      ...preset.customization
    }));
    audio.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-2xl p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl backdrop-blur-2xl bg-slate-950/85 border border-white/20 rounded-[2.5rem] shadow-2xl shadow-black/90 p-6 md:p-8 text-white my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#fbbf24]/20 rounded-2xl border border-[#fbbf24]/40">
              <User className="w-6 h-6 text-[#fbbf24]" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heritage text-[#fbbf24]">
                Adventurer Persona & Attire
              </h2>
              <p className="text-xs text-white/70">
                Customize your Indian heritage traveler appearance & identity
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

        {/* Live Character Portrait & Persona Banner */}
        <div className="mt-5 p-4 backdrop-blur-xl bg-white/5 border border-white/15 rounded-3xl flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <CharacterPortrait
              player={formData}
              size="lg"
              showBorder={true}
              className="ring-4 ring-[#fbbf24]/40 shadow-2xl shadow-amber-950/60"
            />
            <span className="absolute -bottom-2 -right-1 bg-[#10b981] px-2 py-0.5 rounded-full border border-white text-[10px] font-bold text-white shadow-md">
              ACTIVE
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold font-heritage text-white">
                {formData.name || 'Adventurer'}
              </h3>
              <span className="backdrop-blur-md bg-[#fbbf24]/20 border border-[#fbbf24]/40 text-[#fbbf24] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                {formData.hairStyle === 'turban' ? 'Royal Scholar' : formData.outfit === 'traditional_saree' ? 'Cultural Artisan' : 'Heritage Explorer'}
              </span>
            </div>
            <p className="text-xs text-white/70 mt-1">
              Live avatar reflecting your chosen Indian traditional vastra, hairstyles, and skin tones.
            </p>

            {/* Quick Archetype Buttons */}
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <span className="text-[10px] font-bold text-[#fbbf24] uppercase tracking-wider flex items-center gap-1 mr-1">
                <Wand2 className="w-3 h-3" /> Quick Personas:
              </span>
              {PRESETS.map(p => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                    formData.name === p.name
                      ? 'bg-[#fbbf24] text-black border-[#fbbf24]'
                      : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/15'
                  }`}
                >
                  {p.name} ({p.label})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Options */}
        <div className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-[#fbbf24] uppercase tracking-wider mb-1.5">
              Adventurer Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#fbbf24]"
            />
          </div>

          {/* Skin Tone */}
          <div>
            <label className="block text-xs font-bold text-[#fbbf24] uppercase tracking-wider mb-1.5">
              Complexion Tone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SKIN_TONES.map(s => (
                <button
                  key={s.value}
                  onClick={() => {
                    setFormData({ ...formData, skinTone: s.value });
                    audio.playClick();
                  }}
                  className={`flex items-center gap-2 p-2 rounded-2xl border text-xs transition-all cursor-pointer ${
                    formData.skinTone === s.value
                      ? 'border-[#fbbf24] bg-white/15 ring-1 ring-[#fbbf24] text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/30 shrink-0"
                    style={{ backgroundColor: s.value }}
                  />
                  <span className="truncate text-[11px] font-medium">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Outfit Type */}
          <div>
            <label className="block text-xs font-bold text-[#fbbf24] uppercase tracking-wider mb-1.5">
              Traditional Attire (Vastra)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OUTFITS.map(o => (
                <button
                  key={o.id}
                  onClick={() => {
                    setFormData({ ...formData, outfit: o.id as any });
                    audio.playClick();
                  }}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                    formData.outfit === o.id
                      ? 'border-[#fbbf24] bg-white/15 ring-1 ring-[#fbbf24] text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold text-white">{o.name}</div>
                  <div className="text-[11px] text-white/60 mt-0.5">{o.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <label className="block text-xs font-bold text-[#fbbf24] uppercase tracking-wider mb-1.5">
              Tunic & Robe Hue
            </label>
            <div className="flex gap-2">
              {OUTFIT_COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => {
                    setFormData({ ...formData, outfitColor: c.value });
                    audio.playClick();
                  }}
                  className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-2xl border text-[11px] transition-all cursor-pointer ${
                    formData.outfitColor === c.value
                      ? 'border-[#fbbf24] bg-white/15 ring-1 ring-[#fbbf24]'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                    style={{ backgroundColor: c.value }}
                  />
                  <span className="truncate max-w-[65px] text-[10px] text-white/80">{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hairstyle */}
          <div>
            <label className="block text-xs font-bold text-[#fbbf24] uppercase tracking-wider mb-1.5">
              Hairstyle & Headgear
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HAIR_STYLES.map(h => (
                <button
                  key={h.id}
                  onClick={() => {
                    setFormData({ ...formData, hairStyle: h.id as any });
                    audio.playClick();
                  }}
                  className={`p-2.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                    formData.hairStyle === h.id
                      ? 'border-[#fbbf24] bg-white/15 ring-1 ring-[#fbbf24] text-white font-bold'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {h.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white/80 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl bg-[#fbbf24] hover:bg-[#f59e0b] text-black text-xs font-bold shadow-lg shadow-amber-950/40 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
          >
            <Check className="w-4 h-4" /> Save Appearance
          </button>
        </div>
      </div>
    </div>
  );
};

