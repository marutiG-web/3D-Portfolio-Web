// Web Audio API Sound Synthesizer & Ambient Soundtrack Engine

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Ambient Soundtrack State
  private isSoundtrackPlaying: boolean = false;
  private bgAudio: HTMLAudioElement | null = null;
  private currentTrackUrl: string = '/song.webm';

  private getAudioElement(): HTMLAudioElement {
    if (!this.bgAudio) {
      this.bgAudio = new Audio(this.currentTrackUrl);
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.5;
    }
    return this.bgAudio;
  }

  public setTrackUrl(url: string, autoPlay: boolean = false): void {
    if (!url) return;
    const isCurrentlyPlaying = this.isSoundtrackPlaying;
    
    if (this.currentTrackUrl !== url || !this.bgAudio) {
      this.currentTrackUrl = url;
      if (this.bgAudio) {
        this.bgAudio.pause();
        this.bgAudio.src = url;
        this.bgAudio.load();
      } else {
        this.getAudioElement();
      }
    }

    if (autoPlay || isCurrentlyPlaying) {
      this.startSoundtrack();
    }
  }

  public getCurrentTrackUrl(): string {
    return this.currentTrackUrl;
  }


  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgAudio) {
      this.bgAudio.muted = this.isMuted;
    }
    if (this.isMuted && this.isSoundtrackPlaying) {
      this.stopSoundtrack();
    }
    return this.isMuted;
  }

  public getMutedStatus(): boolean {
    return this.isMuted;
  }

  // --- AMBIENT SOUNDTRACK ("ODNOGO" AUDIO SONG) WITH SCROLL-SPEED PITCH MODULATION ---
  public toggleSoundtrack(): boolean {
    if (this.isSoundtrackPlaying) {
      this.stopSoundtrack();
      return false;
    } else {
      this.startSoundtrack();
      return true;
    }
  }

  public isSoundtrackActive(): boolean {
    return this.isSoundtrackPlaying;
  }

  public startSoundtrack() {
    if (this.isMuted) return;

    try {
      const audio = this.getAudioElement();
      audio.muted = this.isMuted;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isSoundtrackPlaying = true;
          })
          .catch((err) => {
            console.warn('Audio playback restricted:', err);
            this.isSoundtrackPlaying = false;
          });
      }
      this.isSoundtrackPlaying = true;
    } catch {
      this.isSoundtrackPlaying = false;
    }
  }

  public stopSoundtrack() {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    this.isSoundtrackPlaying = false;
  }

  // Update soundtrack playback rate dynamically based on scroll velocity
  public updateScrollPitch(scrollSpeedPx: number) {
    if (!this.isSoundtrackPlaying || !this.bgAudio) {
      return;
    }

    try {
      // Map scrollSpeedPx (0 to 100px/frame) to playback rate (1.0 to 1.15)
      const clampedSpeed = Math.min(Math.max(scrollSpeedPx, 0), 100);
      this.bgAudio.playbackRate = 1.0 + (clampedSpeed / 100) * 0.15;
    } catch {
      // Ignore
    }
  }

  public playHover() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore audio errors
    }
  }

  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore audio errors
    }
  }

  public play3DShift() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(150, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);

      osc2.frequency.setValueAtTime(300, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.2);
    } catch {
      // Ignore audio errors
    }
  }

  public playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      gain.connect(ctx.destination);

      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        osc.connect(gain);
        osc.start(now + idx * 0.07);
        osc.stop(now + 0.4);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundFx = new SoundManager();
