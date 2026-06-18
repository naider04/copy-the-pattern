/**
 * A highly responsive, pure Web Audio API synthesizer for child-friendly, interactive sounds.
 * Avoids any assets loading requirements and works completely offline with zero latency.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a friendly cute pop sound (like a bubble popping).
 */
export function playPop() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Cute bubble pop settings: quick frequency sweep down, short duration
    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {
    console.warn("Audio Context init/fail:", e);
  }
}

/**
 * Plays an ascending pentatonic chord note based on the correct step index.
 * @param stepIndex 0 to 4 (for the 5 stages of the pattern)
 */
export function playCorrectStep(stepIndex: number) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Pentatonic scale (C major pentatonic: C4, D4, E4, G4, A4)
    const pitches = [261.63, 293.66, 329.63, 392.00, 440.00];
    const pitch = pitches[Math.min(stepIndex, pitches.length - 1)] || 329.63;

    osc.type = 'triangle'; // triangle is warm and soft, perfect for babies
    const now = ctx.currentTime;
    
    // Play main tone
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.setValueAtTime(pitch, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(pitch * 2, now + 0.2); // sweet octave ring

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Plays a gentle, cute wobble "uh-oh" failing sound that is not scary.
 */
export function playIncorrect() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = 'sine';
    const now = ctx.currentTime;

    // Gentle sliding/wobbling downward frequency
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);

    // Simple pitch LFO simulation (gently oscillates)
    osc.frequency.linearRampToValueAtTime(140, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.3);

    gainNode.gain.setValueAtTime(0.25, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Plays a beautiful magical sweep fanfare when the entire sequence is matched correctly.
 */
export function playWinFanfare() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Arpeggio notes: C4, E4, G4, C5, E5, G5, C6
    const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    
    arpeggio.forEach((pitch, index) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = 'sine';
      const noteTime = now + index * 0.08;

      osc.frequency.setValueAtTime(pitch, noteTime);
      
      // Add vibrato
      osc.frequency.setValueAtTime(pitch, noteTime);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.setValueAtTime(0, noteTime);
      gainNode.gain.linearRampToValueAtTime(0.2, noteTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.5);

      osc.start(noteTime);
      osc.stop(noteTime + 0.6);
    });

    // Add a sparkling base pad chime
    const baseOsc = ctx.createOscillator();
    const baseGain = ctx.createGain();
    baseOsc.connect(baseGain);
    baseGain.connect(ctx.destination);
    baseOsc.type = 'triangle';
    baseOsc.frequency.setValueAtTime(523.25, now);
    baseOsc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.8);
    baseGain.gain.setValueAtTime(0.15, now);
    baseGain.gain.exponentialRampToValueAtTime(0.005, now + 1.0);
    baseOsc.start(now);
    baseOsc.stop(now + 1.0);

  } catch (e) {
    console.warn(e);
  }
}

/**
 * Uses browser Web Speech API to speak the English name of the figures.
 */
export function speakWord(text: string) {
  try {
    if (!('speechSynthesis' in window)) {
      console.warn("Speech Synthesis is not supported in this browser.");
      return;
    }
    // Cancel absolute previous speaking (prevents stacking queues when clicking rapidly)
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; 
    utterance.rate = 0.78; // Gentle/cute slowed rate for baby audibility
    utterance.pitch = 1.35; // Cute babyish higher pitch
    
    // Find an English voice if possible
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en-'));
    if (enVoice) {
      utterance.voice = enVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Speech synthesis error:", e);
  }
}
