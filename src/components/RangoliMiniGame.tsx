import React, { useState, useRef, useEffect } from 'react';
import { Palette, Sparkles, RotateCcw, CheckCircle, Award, X, Info } from 'lucide-react';
import { audio } from '../game/audio';
import confetti from 'canvas-confetti';

interface RangoliMiniGameProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

const PIGMENTS = [
  { name: 'Kumkum (Vermillion)', color: '#dc2626', desc: 'Natural saffron & lime derivative' },
  { name: 'Haldi (Turmeric)', color: '#eab308', desc: 'Auspicious purifying turmeric' },
  { name: 'Indigo (Neel)', color: '#2563eb', desc: 'Ancient natural plant dye' },
  { name: 'Mehendi (Henna)', color: '#16a34a', desc: 'Crushed herbal leaves' },
  { name: 'Chuna (Rice Powder)', color: '#ffffff', desc: 'Eco-friendly rice flour base' },
  { name: 'Gulal (Festival Rose)', color: '#ec4899', desc: 'Spring festival floral pigment' },
  { name: 'Ochre (Geru)', color: '#ea580c', desc: 'Earth mineral terracotta clay' }
];

export const RangoliMiniGame: React.FC<RangoliMiniGameProps> = ({ onComplete, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState(PIGMENTS[0].color);
  const [brushSize, setBrushSize] = useState(8);
  const [symmetrySlices, setSymmetrySlices] = useState<number>(8);
  const [strokesCount, setStrokesCount] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw traditional terracotta courtyard base
    ctx.fillStyle = '#291812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw faint auspicious dot grid (Pulli Kolam dots)
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 180;

    // Faint guiding circles
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)';
    ctx.lineWidth = 1;
    [40, 90, 140, 180].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Radial symmetry guideline lines
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.stroke();
    }

    // Central lotus seed dot
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const handleStopDraw = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    const baseAngle = Math.atan2(dy, dx);

    // Apply radial symmetry
    ctx.fillStyle = selectedColor;
    ctx.shadowColor = selectedColor;
    ctx.shadowBlur = 4;

    for (let i = 0; i < symmetrySlices; i++) {
      const angle = baseAngle + (i * 2 * Math.PI) / symmetrySlices;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.arc(px, py, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    setStrokesCount(prev => prev + 1);
    if (strokesCount % 8 === 0) {
      audio.playClick();
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#291812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)';
    ctx.lineWidth = 1;
    [40, 90, 140, 180].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    setStrokesCount(0);
    audio.playClick();
  };

  const handleFinish = () => {
    const score = Math.min(100, Math.max(70, Math.round(strokesCount * 1.5)));
    setShowCelebration(true);
    audio.playMissionComplete();

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onComplete(score);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-2xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl backdrop-blur-2xl bg-slate-950/80 border border-white/20 rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-black/90 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#fbbf24]/20 rounded-2xl border border-[#fbbf24]/40">
              <Sparkles className="w-6 h-6 text-[#fbbf24]" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heritage text-[#fbbf24]">
                Sacred Rangoli & Kolam Studio
              </h2>
              <p className="text-xs text-white/70">
                Create harmonious 8-fold symmetrical sacred geometric art with natural organic pigments
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

        {/* Main Content Area */}
        <div className="mt-4 flex flex-col md:flex-row gap-5 items-center">
          {/* Symmetrical Drawing Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={380}
              height={380}
              onMouseDown={handleStartDraw}
              onMouseMove={draw}
              onMouseUp={handleStopDraw}
              onMouseLeave={handleStopDraw}
              onTouchStart={handleStartDraw}
              onTouchMove={draw}
              onTouchEnd={handleStopDraw}
              className="rounded-2xl border border-white/20 shadow-inner cursor-crosshair touch-none bg-stone-950"
            />
            <div className="absolute bottom-2 left-2 text-[10px] backdrop-blur-md bg-black/60 px-2.5 py-1 rounded-full border border-white/10 text-white/80">
              Drag cursor to create 8-way symmetry
            </div>
          </div>

          {/* Tools & Palette */}
          <div className="flex-1 flex flex-col gap-4 w-full">
            {/* Color Palette */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#fbbf24] mb-2">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#fbbf24]" /> Natural Pigments (Vedic Colors)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PIGMENTS.map(p => (
                  <button
                    key={p.name}
                    onClick={() => {
                      setSelectedColor(p.color);
                      audio.playClick();
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedColor === p.color
                        ? 'border-[#fbbf24] bg-white/15 shadow-md ring-1 ring-[#fbbf24]'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/40 shadow-sm shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-medium text-white truncate">{p.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Brush Controls */}
            <div className="backdrop-blur-md bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/80">Powder Density (Size):</span>
                <span className="font-bold text-[#fbbf24]">{brushSize}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                value={brushSize}
                onChange={e => setBrushSize(Number(e.target.value))}
                className="w-full accent-[#fbbf24] cursor-pointer h-1.5 bg-black/40 rounded-lg"
              />

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-white/80">Mandala Symmetry:</span>
                <div className="flex gap-1.5">
                  {[4, 6, 8, 12].map(sym => (
                    <button
                      key={sym}
                      onClick={() => setSymmetrySlices(sym)}
                      className={`px-2.5 py-0.5 text-[11px] rounded-lg cursor-pointer font-bold ${
                        symmetrySlices === sym
                          ? 'bg-[#fbbf24] text-black'
                          : 'bg-black/40 text-white/70 border border-white/10'
                      }`}
                    >
                      {sym}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white/80 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </button>

              <button
                onClick={handleFinish}
                disabled={strokesCount < 10}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-bold text-xs shadow-lg transition-all ${
                  strokesCount >= 10
                    ? 'bg-[#fbbf24] hover:bg-[#f59e0b] text-black cursor-pointer shadow-amber-950/40'
                    : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {strokesCount < 10 ? `Draw Pattern (${10 - strokesCount} more)` : 'Consecrate Rangoli'}
              </button>
            </div>
          </div>
        </div>

        {/* Educational Fact Footer */}
        <div className="mt-4 p-3.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 flex items-start gap-2.5 text-xs text-white/80">
          <Info className="w-4 h-4 text-[#fbbf24] shrink-0 mt-0.5" />
          <p>
            <strong>Cultural Heritage:</strong> Rangoli (from Sanskrit <em>Rangavalli</em>) and Kolam are sacred threshold arts created daily to invite cosmic harmony, feed birds/ants with rice flour, and harmonize sacred geometry in Indian homes.
          </p>
        </div>

        {/* Completion Modal Overlay */}
        {showCelebration && (
          <div className="absolute inset-0 backdrop-blur-2xl bg-slate-950/90 rounded-[2.5rem] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-[#fbbf24]/20 border-2 border-[#fbbf24] flex items-center justify-center mb-3">
              <Award className="w-10 h-10 text-[#fbbf24] animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold font-heritage text-[#fbbf24] mb-1">
              Rangoli Masterpiece Consecrated!
            </h3>
            <p className="text-sm text-white/90 max-w-sm mb-4">
              Your intricate sacred geometry has blessed Bharatpur village with harmony and unlocked the <strong>Kala Ratna (Gem of Arts)</strong> Cultural Badge!
            </p>
            <div className="flex items-center gap-2 px-5 py-2 bg-[#fbbf24]/20 rounded-full border border-[#fbbf24]/50 text-[#fbbf24] font-bold text-sm">
              <Sparkles className="w-4 h-4" /> Cultural Score: +100 Points
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
