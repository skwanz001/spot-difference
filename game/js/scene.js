// Draws the Lantern Cove scene on a 480x360 canvas. The left panel is drawn
// with no differences active; the right panel activates a set of difference
// ids, and each one swaps a small part of the scene for its variant.

export const W = 480;
export const H = 360;

function cloud(ctx, x, y, s) {
  ctx.beginPath();
  ctx.arc(x, y, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 18 * s, y + 3 * s, 12 * s, 0, Math.PI * 2);
  ctx.arc(x - 18 * s, y + 4 * s, 11 * s, 0, Math.PI * 2);
  ctx.fill();
}

function bird(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(x - 9, y);
  ctx.quadraticCurveTo(x - 3, y - 7, x, y);
  ctx.quadraticCurveTo(x + 3, y - 7, x + 9, y);
  ctx.stroke();
}

function lantern(ctx, x, y, color) {
  ctx.strokeStyle = '#3a2e2a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 12);
  ctx.lineTo(x, y - 5);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y + 4, 7, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(58,46,42,0.7)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

export function drawScene(ctx, diffs) {
  const has = (id) => diffs.has(id);

  // Sky and sea.
  const sky = ctx.createLinearGradient(0, 0, 0, 230);
  sky.addColorStop(0, '#f7b267');
  sky.addColorStop(0.7, '#f4845f');
  sky.addColorStop(1, '#e4572e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 235);
  const sea = ctx.createLinearGradient(0, 235, 0, H);
  sea.addColorStop(0, '#2a9d8f');
  sea.addColorStop(1, '#1d6f77');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 235, W, H - 235);

  // Celestial body: a low sun, or a crescent moon in the changed panel.
  if (has('sun')) {
    ctx.fillStyle = '#f4f1de';
    ctx.beginPath();
    ctx.arc(70, 60, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f7b267';
    ctx.beginPath();
    ctx.arc(82, 52, 20, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(70, 60, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e09f3e';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Clouds; the small high cloud vanishes in the changed panel.
  ctx.fillStyle = 'rgba(255, 244, 224, 0.92)';
  cloud(ctx, 160, 48, 1);
  cloud(ctx, 265, 84, 0.8);
  if (!has('cloud')) cloud(ctx, 352, 50, 0.62);

  // Birds; the third bird is missing in the changed panel.
  ctx.strokeStyle = '#3a2e2a';
  ctx.lineWidth = 2;
  bird(ctx, 205, 105);
  bird(ctx, 232, 92);
  if (!has('bird')) bird(ctx, 300, 70);

  // Lantern string strung between cottage and lighthouse.
  ctx.strokeStyle = '#3a2e2a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(96, 150);
  ctx.quadraticCurveTo(240, 108, 356, 132);
  ctx.stroke();
  const lanternColors = ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#ef476f'];
  [130, 185, 240, 295, 338].forEach((x, i) => {
    const y = 128 - Math.sin((i / 4) * Math.PI) * 10 + i * 3;
    const color = has('lantern') && i === 2 ? '#9b5de5' : lanternColors[i];
    lantern(ctx, x, y, color);
  });

  // Rocky point and the lighthouse on the right.
  ctx.fillStyle = '#6c5849';
  ctx.beginPath();
  ctx.moveTo(322, 235);
  ctx.lineTo(348, 190);
  ctx.lineTo(420, 190);
  ctx.lineTo(448, 235);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f4f1de';
  ctx.fillRect(360, 128, 36, 66);
  ctx.fillStyle = has('stripe') ? '#2a9d8f' : '#e4572e';
  ctx.fillRect(360, 152, 36, 14);
  ctx.fillStyle = '#3a2e2a';
  ctx.fillRect(356, 116, 44, 12);
  if (has('lamp')) {
    ctx.fillStyle = '#5b4a42';
    ctx.fillRect(368, 96, 20, 20);
  } else {
    const glow = ctx.createRadialGradient(378, 106, 2, 378, 106, 30);
    glow.addColorStop(0, 'rgba(255, 209, 102, 0.95)');
    glow.addColorStop(1, 'rgba(255, 209, 102, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(344, 72, 68, 68);
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(368, 96, 20, 20);
  }
  ctx.fillStyle = '#3a2e2a';
  ctx.beginPath();
  ctx.moveTo(362, 96);
  ctx.lineTo(378, 84);
  ctx.lineTo(394, 96);
  ctx.closePath();
  ctx.fill();

  // The cottage on the left shore.
  ctx.fillStyle = '#8a5a44';
  ctx.fillRect(38, 196, 84, 52);
  ctx.fillStyle = '#5b3a29';
  ctx.beginPath();
  ctx.moveTo(30, 198);
  ctx.lineTo(80, 168);
  ctx.lineTo(130, 198);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3a2e2a';
  ctx.fillRect(88, 216, 18, 32);
  // Cottage window: lamplit, or dark in the changed panel.
  ctx.fillStyle = has('window') ? '#4a3b31' : '#ffd166';
  ctx.fillRect(52, 210, 20, 18);
  ctx.strokeStyle = '#3a2e2a';
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 210, 20, 18);
  // Cottage flag: flies to the right, or to the left in the changed panel.
  ctx.strokeStyle = '#3a2e2a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 168);
  ctx.lineTo(80, 146);
  ctx.stroke();
  ctx.fillStyle = '#ef476f';
  ctx.beginPath();
  if (has('flag')) {
    ctx.moveTo(80, 146);
    ctx.lineTo(62, 151);
    ctx.lineTo(80, 157);
  } else {
    ctx.moveTo(80, 146);
    ctx.lineTo(98, 151);
    ctx.lineTo(80, 157);
  }
  ctx.closePath();
  ctx.fill();
  // Sand the cottage stands on.
  ctx.fillStyle = '#e9c46a';
  ctx.beginPath();
  ctx.ellipse(85, 250, 95, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // The fruit tree beside the cottage.
  ctx.fillStyle = '#5b3a29';
  ctx.fillRect(117, 214, 9, 30);
  ctx.fillStyle = '#2d6a4f';
  [[122, 200, 26], [104, 210, 18], [140, 210, 18]].forEach(([x, y, r]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
  if (!has('fruit')) {
    ctx.fillStyle = '#e4572e';
    [[112, 196], [128, 190], [138, 206], [118, 212], [104, 204]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // The sailboat in the middle of the cove.
  ctx.fillStyle = '#5b3a29';
  ctx.beginPath();
  ctx.moveTo(200, 244);
  ctx.lineTo(268, 244);
  ctx.lineTo(256, 260);
  ctx.lineTo(210, 260);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3a2e2a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(234, 244);
  ctx.lineTo(234, 188);
  ctx.stroke();
  if (has('sail')) {
    ctx.fillStyle = '#f4845f';
    ctx.beginPath();
    ctx.moveTo(238, 192);
    ctx.lineTo(238, 240);
    ctx.lineTo(264, 240);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f4f1de';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(239, 208);
    ctx.lineTo(256, 208);
    ctx.moveTo(239, 224);
    ctx.lineTo(261, 224);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#f4f1de';
    ctx.beginPath();
    ctx.moveTo(238, 192);
    ctx.lineTo(238, 240);
    ctx.lineTo(264, 240);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.moveTo(230, 196);
  ctx.lineTo(230, 240);
  ctx.lineTo(208, 240);
  ctx.closePath();
  ctx.fill();

  // Waves.
  ctx.strokeStyle = 'rgba(244, 241, 222, 0.55)';
  ctx.lineWidth = 2;
  [268, 292, 318, 340].forEach((y, row) => {
    ctx.beginPath();
    for (let x = 8 + row * 22; x < W - 20; x += 46) {
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 10, y - 5, x + 22, y);
    }
    ctx.stroke();
  });

  // A fish jumps in the left panel only.
  if (!has('fish')) {
    ctx.fillStyle = '#118ab2';
    ctx.beginPath();
    ctx.ellipse(150, 258, 12, 6, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(160, 252);
    ctx.lineTo(168, 246);
    ctx.lineTo(167, 256);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(244,241,222,0.8)';
    ctx.beginPath();
    ctx.arc(150, 270, 9, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  // The buoy: red, or green in the changed panel.
  ctx.fillStyle = has('buoy') ? '#06d6a0' : '#e4572e';
  ctx.beginPath();
  ctx.moveTo(390, 240);
  ctx.lineTo(406, 240);
  ctx.lineTo(402, 258);
  ctx.lineTo(394, 258);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3a2e2a';
  ctx.fillRect(396, 232, 4, 8);
}
