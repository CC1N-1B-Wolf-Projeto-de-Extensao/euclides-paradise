//  Dependências: state.js, constants.js, systems/gameover.js
import { DIFF } from "../core/constants.js";
import { gameState } from "../core/state.js";
import { endGame } from "./gameover.js";

export function startHPDrain() {
  const rate = DIFF[gameState.diff].hpRate;
  gameState.hpIv = setInterval(() => {
    if (gameState.gameOver) return;
    let safe_score = Math.max(0, gameState.score - 1000);
    let progress = Math.log10(safe_score + 1) * 0.7
    gameState.hp = Math.max(0, gameState.hp - rate * 0.1 * (1 + progress * DIFF[gameState.diff].hpScaleFactor));
    updateHPBar();
    if (gameState.hp <= 0) endGame(false, 'vida');
  }, 100);
}

export function gainHP(matchedCount) {
  // recuperação: 1.5× o número de peças × nível de combo, cap em 28
  gameState.hp = Math.min(100, gameState.hp + Math.min(matchedCount * 1.5 * gameState.comboLevel * DIFF[gameState.diff].hpScaleFactor, 28));
  updateHPBar();
}

export function updateHPBar() {
  const bar = document.getElementById('hpbar'), pct = Math.round(gameState.hp);
  bar.style.width = pct + '%';
  document.getElementById('hppct').textContent = pct + '%';
  bar.style.background = gameState.hp > 50 ? '#1D9E75' : gameState.hp > 25 ? '#BA7517' : '#E24B4A';
}