/**
 * ITIHVA Web Audio Synthesizer
 * Generates authentic Indian musical drones, sitar-like plucks, bansuri flutes,
 * temple bells, water ambiance, footsteps, and victory fanfares procedurally.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private ambientNoiseNode: AudioNode | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private currentZone: string = 'village';
  private stepThrottle: number = 0;

  constructor() {
    // Lazy initialize on first user gesture
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.4;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.7;
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn('AudioContext not supported:', e);
    }
  }

  public resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.8, this.ctx.currentTime);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public startAtmosphere(zone: 'village' | 'temple' | 'forest' | 'stepwell' = 'village') {
    this.resume();
    if (!this.ctx || !this.musicGain || this.isMuted) return;
    this.currentZone = zone;

    this.stopDrone();
    this.createIndianTanpuraDrone(zone);
    this.isMusicPlaying = true;
  }

  public updateZoneAtmosphere(zone: 'village' | 'temple' | 'forest' | 'stepwell') {
    if (zone === this.currentZone && this.isMusicPlaying) return;
    this.currentZone = zone;
    if (this.isMusicPlaying) {
      this.stopDrone();
      this.createIndianTanpuraDrone(zone);
    }
  }

  private createIndianTanpuraDrone(zone: string) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    // Base pitch for Tanpura: Sa = C# (138.59 Hz) or D (146.83 Hz)
    const baseFreq = zone === 'temple' ? 146.83 : zone === 'forest' ? 164.81 : 138.59;
    // Raga frequencies (Sa, Pa, High Sa, Komal Re / Shuddha Ga)
    const freqs = [
      baseFreq * 0.5, // Low Sa
      baseFreq,       // Sa
      baseFreq * 1.5, // Pa (Fifth)
      baseFreq * 2.0, // High Sa
      zone === 'temple' ? baseFreq * 1.25 : baseFreq * 1.334 // Ga / Ma
    ];

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Sawtooth/triangle with warm lowpass for rich tanpura buzz
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle detune for natural acoustic shimmer
      osc.detune.setValueAtTime((idx - 2) * 4, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(zone === 'temple' ? 450 : 350, now);

      // Slow breathing LFO pulse
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.15 + idx * 0.08, now);
      lfoGain.gain.setValueAtTime(0.04, now);
      lfo.connect(lfoGain.gain);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.06 / (idx + 1), now + 2);

      osc.connect(filter);
      filter.connect(gain);
      if (this.musicGain) gain.connect(this.musicGain);

      osc.start(now);
      this.droneOscs.push(osc);
    });

    // Occasional procedural melodic sitar/flute notes
    this.scheduleProceduralFluteMelody();
  }

  private melodyTimer: number | null = null;
  private scheduleProceduralFluteMelody() {
    if (this.melodyTimer) window.clearTimeout(this.melodyTimer);
    const nextNoteDelay = 2500 + Math.random() * 4000;

    this.melodyTimer = window.setTimeout(() => {
      if (this.isMusicPlaying && !this.isMuted) {
        this.playBansuriFluteNote();
        this.scheduleProceduralFluteMelody();
      }
    }, nextNoteDelay);
  }

  private playBansuriFluteNote() {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    
    // Raga Bhupali / Yaman scale notes: Sa Re Ga Pa Dha Sa'
    const scale = [277.18, 311.13, 349.23, 415.30, 466.16, 554.37, 622.25];
    const freq = scale[Math.floor(Math.random() * scale.length)];

    const osc = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm breathy flute filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);

    // Subtle gentle vibrato
    vibrato.frequency.setValueAtTime(5.2, now);
    vibratoGain.gain.setValueAtTime(3.5, now);
    vibrato.connect(osc.frequency);
    vibrato.start(now);

    const duration = 1.8 + Math.random() * 1.5;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
    vibrato.stop(now + duration + 0.1);
  }

  public stopDrone() {
    if (this.melodyTimer) {
      window.clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
    this.droneOscs.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.droneOscs = [];
    if (this.ambientNoiseNode) {
      try {
        this.ambientNoiseNode.disconnect();
      } catch {
        // ignore
      }
      this.ambientNoiseNode = null;
    }
  }

  // SFX: Footstep sound (procedural soft thud/rustle)
  public playFootstep(surface: 'grass' | 'stone' | 'wood' = 'grass') {
    const now = Date.now();
    if (now - this.stepThrottle < 280) return;
    this.stepThrottle = now;

    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const ctxNow = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = surface === 'stone' ? 'sine' : 'triangle';
    const pitch = surface === 'stone' ? 120 : surface === 'wood' ? 95 : 75;
    osc.frequency.setValueAtTime(pitch, ctxNow);
    osc.frequency.exponentialRampToValueAtTime(30, ctxNow + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(surface === 'stone' ? 500 : 250, ctxNow);

    gain.gain.setValueAtTime(0.05, ctxNow);
    gain.gain.exponentialRampToValueAtTime(0.001, ctxNow + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(ctxNow);
    osc.stop(ctxNow + 0.09);
  }

  // SFX: Sacred Temple Brass Bell (Ghanti)
  public playTempleBell() {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Harmonic bell partials
    const partials = [880, 1760, 2640, 3520, 5280];
    const decay = 3.5;

    partials.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * (1 + (i === 1 ? 0.02 : 0)), now);

      gain.gain.setValueAtTime(0.18 / (i + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay / (i * 0.5 + 1));

      osc.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + decay);
    });
  }

  // SFX: Item Collect / Discovery Chime
  public playCollectSound() {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.001, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.4);

      osc.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.45);
    });
  }

  // SFX: Mission Complete Fanfare (Sitar flourish)
  public playMissionComplete() {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Raga ascend flourish: Sa Re Ga Ma Pa Dha Ni Sa'
    const notes = [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37, 587.33];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.001, now + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.09 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.6);

      osc.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.7);
    });

    // Ring bell with fanfare
    setTimeout(() => {
      this.playTempleBell();
    }, 400);
  }

  // SFX: UI button click
  public playClick() {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // SFX: Dialogue pop
  public playDialoguePop() {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // SFX: Jump swoosh
  public playJump() {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // SFX: Traditional Wooden Door Creak / Open
  public playDoor(isOpen: boolean = true) {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(isOpen ? 120 : 180, now);
    osc.frequency.linearRampToValueAtTime(isOpen ? 220 : 90, now + 0.35);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // SFX: Water Splash (Entering water / Swimming)
  public playWaterSplash() {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  // SFX: Swimming Stroke / Water Paddle
  private swimThrottle = 0;
  public playWaterStroke() {
    const now = performance.now();
    if (now - this.swimThrottle < 450) return;
    this.swimThrottle = now;

    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.2);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  // SFX: Draw Water from Well (Pulley & Bucket slosh)
  public playWellDraw() {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Pulley creak
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(450, now + 0.4);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.42);

    // Water slosh
    setTimeout(() => {
      this.playWaterSplash();
    }, 300);
  }

  // SFX: Sacred Temple Prayer & Murti Blessing (Harmonic Om chord)
  public playTempleBlessing() {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const chord = [146.83, 220.0, 293.66, 440.0, 587.33]; // D major drone chord
    chord.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08 / (i + 1), now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 3.2);
    });

    setTimeout(() => {
      this.playTempleBell();
    }, 200);
  }
}

export const audio = new SoundEngine();
