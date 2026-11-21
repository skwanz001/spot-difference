// Lantern Cove game logic: state, clicks, markers, hints, timer and levels.
// Both panels show the same scene; the right one carries the level's
// differences. A click on either panel tests the difference hit circles.

import { drawScene } from './scene.js';
import { DIFFERENCES, LEVELS } from './levels.js';
import { playFound, playHint, playMiss, playWin } from './sound.js';

const leftCtx = document.getElementById('panel-left').getContext('2d');
const rightCtx = document.getElementById('panel-right').getContext('2d');
const counterEl = document.getElementById('counter');
const clockEl = document.getElementById('clock');
const missesEl = document.getElementById('misses');
const levelNameEl = document.getElementById('level-name');
const toastEl = document.getElementById('toast');
const winBanner = document.getElementById('win-banner');
const winStats = document.getElementById('win-stats');

const params = new URLSearchParams(location.search);
const state = {
  level: 0,
  found: new Set(),
  misses: 0,
  seconds: 0,
  over: false,
  hintId: null,
  hintUntil: 0,
  missMark: null,
};

function levelDiffs() {
  return LEVELS[state.level].diffs;
}

function render(now = 0) {
  const active = new Set(levelDiffs());
  drawScene(leftCtx, new Set());
  drawScene(rightCtx, active);
  for (const ctx of [leftCtx, rightCtx]) {
    for (const id of state.found) {
      const d = DIFFERENCES[id];
      ctx.strokeStyle = '#06d6a0';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r + 8, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (state.missMark && now - state.missMark.at < 450) {
      const { x, y } = state.missMark;
      ctx.strokeStyle = '#e4572e';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(x - 9, y - 9);
      ctx.lineTo(x + 9, y + 9);
      ctx.moveTo(x + 9, y - 9);
      ctx.lineTo(x - 9, y + 9);
      ctx.stroke();
    }
  }
  if (state.hintId && now < state.hintUntil) {
    const d = DIFFERENCES[state.hintId];
    const pulse = 6 + 4 * Math.sin(now / 130);
    rightCtx.strokeStyle = '#ffd166';
    rightCtx.lineWidth = 4;
    rightCtx.beginPath();
    rightCtx.arc(d.x, d.y, d.r + 10 + pulse, 0, Math.PI * 2);
    rightCtx.stroke();
  }
  const total = levelDiffs().length;
  counterEl.textContent = `Found ${state.found.size} of ${total} · ${total - state.found.size} to go`;
  missesEl.textContent = `Misses: ${state.misses}`;
  levelNameEl.textContent = `${LEVELS[state.level].name} — ${LEVELS[state.level].blurb}`;
}

function fmt(sec) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

function tickClock() {
  clockEl.textContent = fmt(state.seconds);
}

function toast(msg) {
  toastEl.textContent = msg;
}

function panelPos(evt, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((evt.clientX - rect.left) / rect.width) * canvas.width,
    y: ((evt.clientY - rect.top) / rect.height) * canvas.height,
  };
}

function onClick(evt) {
  if (state.over) return;
  const { x, y } = panelPos(evt, evt.currentTarget);
  for (const id of levelDiffs()) {
    if (state.found.has(id)) continue;
    const d = DIFFERENCES[id];
    if (Math.hypot(x - d.x, y - d.y) <= d.r + 7) {
      state.found.add(id);
      playFound();
      toast(`Found: ${d.name}.`);
      render(performance.now());
      if (state.found.size === levelDiffs().length) win();
      return;
    }
  }
  state.misses += 1;
  state.missMark = { x, y, at: performance.now() };
  playMiss();
  toast('Not there — the cove keeps its secret.');
  render(performance.now());
}

function hint() {
  if (state.over) return;
  const next = levelDiffs().find((id) => !state.found.has(id));
  if (!next) return;
  state.hintId = next;
  state.hintUntil = performance.now() + 1400;
  state.seconds += 10;
  playHint();
  toast('A hint glimmers on the right panel (+10 seconds).');
  tickClock();
}

function win() {
  state.over = true;
  playWin();
  winStats.textContent = `${LEVELS[state.level].name} cleared in ${fmt(state.seconds)} with ${state.misses} misses.`;
  winBanner.hidden = false;
  toast('Every difference found. The cove is itself again.');
}

function startLevel(idx) {
  state.level = idx;
  state.found = new Set();
  state.misses = 0;
  state.seconds = 0;
  state.over = false;
  state.hintId = null;
  state.missMark = null;
  winBanner.hidden = true;
  document.querySelectorAll('.level-btn').forEach((b) => {
    b.classList.toggle('active', Number(b.dataset.level) === idx);
  });
  toast(LEVELS[idx].blurb);
  tickClock();
  render(performance.now());
}

for (const id of ['panel-left', 'panel-right']) {
  document.getElementById(id).addEventListener('click', onClick);
}
document.getElementById('hint-btn').addEventListener('click', hint);
document.getElementById('restart-btn').addEventListener('click', () => startLevel(state.level));
document.getElementById('next-btn').addEventListener('click', () => {
  startLevel(Math.min(state.level + 1, LEVELS.length - 1));
});
document.querySelectorAll('.level-btn').forEach((b) => {
  b.addEventListener('click', () => startLevel(Number(b.dataset.level)));
});
window.addEventListener('keydown', (evt) => {
  if (evt.key === 'h' || evt.key === 'H') hint();
  if (evt.key === 'r' || evt.key === 'R') startLevel(state.level);
  if (['1', '2', '3'].includes(evt.key)) startLevel(Number(evt.key) - 1);
});

setInterval(() => {
  if (!state.over) {
    state.seconds += 1;
    tickClock();
  }
}, 1000);
(function animate(now) {
  if (state.hintId || state.missMark) render(now);
  requestAnimationFrame(animate);
})(performance.now());

// Screenshot staging: ?level=1&found=3&t=75 pre-finds differences and sets
// the clock, ?hint=1 shows a hint ring, ?win=1 opens the win banner.
startLevel(Math.min(2, Math.max(0, Number(params.get('level') || 0))));
const preFound = Number(params.get('found') || 0);
levelDiffs().slice(0, preFound).forEach((id) => state.found.add(id));
if (params.get('t')) {
  state.seconds = Number(params.get('t'));
  tickClock();
}
if (params.get('hint')) {
  state.hintId = levelDiffs().find((id) => !state.found.has(id)) || null;
  state.hintUntil = performance.now() + 60000;
}
render(performance.now());
if (params.get('win')) win();
