import { clearTimers } from "../core/main.js";
import { gameState } from "../core/state.js";
//Dependências: state.js, components/overlay.js

export function endGame(win, reason) {
  if (gameState.gameOver) return;
gameState.gameOver = true;
gameState.busy = true; 
clearTimers();
  const titles   = { win: '🏆 vitória!',   vida: '💀 game over', nocombo: '💀 game over' };
  const subs     = {
    win:     'você destruiu todas as peças, apenas 1 a cada 999999 pessoas conseguem esse feito!',
    vida:    'a barra de vida chegou a zero.',
    nocombo: 'movimento sem combo — Preste mais atenção nos arredores da proxima vez!'
  };
  document.getElementById('overlay-title').textContent = titles[reason] || 'game over';
  document.getElementById('overlay-sub').textContent   = subs[reason]   || '';
  document.getElementById('overlay-score').textContent = gameState.score + ' pts';
  document.getElementById('overlay').classList.add('show');
}
