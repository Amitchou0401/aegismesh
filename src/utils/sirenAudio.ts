/**
 * Browser-native Web Audio API synthesizer for emergency sirens and alerts.
 * Implements standard FEMA / CAP alert frequencies (dual-tone 853Hz + 960Hz)
 * and cyclic disaster warbles.
 */

let audioCtx: AudioContext | null = null;
let activeOscillators: { osc1: OscillatorNode; osc2?: OscillatorNode; gain: GainNode; lfo?: OscillatorNode } | null = null;

export function isSirenPlaying(): boolean {
  return activeOscillators !== null;
}

export function playEmergencyAlertSiren(type: 'dual_tone' | 'wail' = 'wail', volume: number = 0.15): boolean {
  try {
    if (activeOscillators) {
      stopEmergencySiren();
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return false;

    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(Math.min(volume, 0.3), audioCtx.currentTime + 0.3);
    masterGain.connect(audioCtx.destination);

    if (type === 'dual_tone') {
      // Standard EAS dual-tone attention signal (853 Hz and 960 Hz)
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(853, audioCtx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(960, audioCtx.currentTime);

      osc1.connect(masterGain);
      osc2.connect(masterGain);

      osc1.start();
      osc2.start();

      activeOscillators = { osc1, osc2, gain: masterGain };
    } else {
      // European/US Emergency Siren wail: 700 Hz to 1100 Hz sweep with LFO
      const osc1 = audioCtx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(800, audioCtx.currentTime);

      // Low frequency oscillator for the wail effect
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.35, audioCtx.currentTime); // ~3 seconds per cycle
      lfoGain.gain.setValueAtTime(260, audioCtx.currentTime); // frequency variation +/- 260Hz

      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);

      // Low pass filter to soften the harshness of the sawtooth
      const filter = audioCtx.createBiquadFilter ? audioCtx.createBiquadFilter() : null;
      if (filter) {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, audioCtx.currentTime);
        osc1.connect(filter);
        filter.connect(masterGain);
      } else {
        osc1.connect(masterGain);
      }

      lfo.start();
      osc1.start();

      activeOscillators = { osc1, lfo, gain: masterGain };
    }

    return true;
  } catch (err) {
    console.warn('Web Audio siren could not be initialized:', err);
    return false;
  }
}

export function stopEmergencySiren(): void {
  if (!activeOscillators || !audioCtx) return;

  try {
    const { osc1, osc2, lfo, gain } = activeOscillators;
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    setTimeout(() => {
      try {
        osc1.stop();
        osc2?.stop();
        lfo?.stop();
        osc1.disconnect();
        osc2?.disconnect();
        lfo?.disconnect();
        gain.disconnect();
      } catch {
        // ignore already stopped
      }
    }, 260);
  } catch (err) {
    console.warn('Error stopping audio siren:', err);
  } finally {
    activeOscillators = null;
  }
}

export function playChimePing(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  } catch {
    // ignore
  }
}
