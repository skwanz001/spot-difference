// Tiny WebAudio chimes, generated in code: no audio files, no network.
let ctx = null;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function tone(freq, at, dur, type = 'sine', gain = 0.12) {
  const a = ac();
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(gain, a.currentTime + at);
  g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + at + dur);
  o.connect(g).connect(a.destination);
  o.start(a.currentTime + at);
  o.stop(a.currentTime + at + dur);
}

export function playFound() {
  tone(880, 0, 0.12);
  tone(1318, 0.09, 0.2);
}

export function playMiss() {
  tone(160, 0, 0.15, 'square', 0.06);
}

export function playHint() {
  tone(660, 0, 0.1, 'triangle');
  tone(660, 0.16, 0.1, 'triangle');
}

export function playWin() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.13, 0.25));
}
