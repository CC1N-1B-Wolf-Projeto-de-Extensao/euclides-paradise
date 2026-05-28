import { BOMB, PIECES } from "../core/constants.js";

export function svgOf(idx, size = 24) {
  if (idx === BOMB)
    return `<svg width="${size}" height="${size}" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="11" fill="#ED93B1" stroke="#D4537E" stroke-width="1.5"/>
      <text x="14" y="19" text-anchor="middle" font-size="12">💣</text>
    </svg>`;

  const p = PIECES[idx], h = 14;
  let inner = '';
  if (p.shape === 'triangle')
    inner = `<polygon points="14,2 26,26 2,26" fill="${p.color}" stroke="${p.stroke}" stroke-width="1.5"/>`;
  else if (p.shape === 'square')
    inner = `<rect x="4" y="4" width="20" height="20" rx="2" fill="${p.color}" stroke="${p.stroke}" stroke-width="1.5"/>`;
  else if (p.shape === 'diamond')
    inner = `<polygon points="14,2 26,14 14,26 2,14" fill="${p.color}" stroke="${p.stroke}" stroke-width="1.5"/>`;
  else if (p.shape === 'pentagon') {
    const pts = [];
    for (let i = 0; i < 5; i++) { const a = (i * 72 - 90) * Math.PI / 180; pts.push(`${h + h * .85 * Math.cos(a)},${h + h * .85 * Math.sin(a)}`); }
    inner = `<polygon points="${pts.join(' ')}" fill="${p.color}" stroke="${p.stroke}" stroke-width="1.5"/>`;
  } else if (p.shape === 'hexagon') {
    const pts = [];
    for (let i = 0; i < 6; i++) { const a = (i * 60 - 30) * Math.PI / 180; pts.push(`${h + h * .85 * Math.cos(a)},${h + h * .85 * Math.sin(a)}`); }
    inner = `<polygon points="${pts.join(' ')}" fill="${p.color}" stroke="${p.stroke}" stroke-width="1.5"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 28 28">${inner}</svg>`;
}
