import { BOMB, COLS, DIFF, MAX_BOMBS, PLAY_ROWS } from "../core/constants.js";
import { setMsg } from "../core/main.js";
import { gameState } from "../core/state.js";
import { gravity, render, updatePiecesUI } from "./board.js";
import { updateEmBtn } from "./emergency.js";
import { gainHP } from "./hp.js";
import { processMatches } from "./match.js";
import { drainQueue, renderQueue } from "./queue.js";
import { play } from "./sound.js";
import { shakeBoard } from "./specialEffects.js";

export function toggleBomb() {
  if (gameState.gameOver || gameState.busy || gameState.bombs === 0) return;
  gameState.bombMode = !gameState.bombMode;
  if (gameState.bombMode) { gameState.emergencyMode = false; gameState.emergencyPiece = null; gameState.selected = null; updateEmBtn(); setMsg('💣 clique em qualquer célula para explodir 3×3'); }
  else { render(); setMsg('selecione uma peça'); }
  updateBombs();
  render();
}

export function detonateBomb(cr, cc) {
  if (gameState.bombs <= 0 && gameState.board[cr][cc] !== BOMB) return;
  gameState.bombMode = false;
  if (gameState.board[cr][cc] !== BOMB) gameState.bombs = Math.max(0, gameState.bombs - 1); // bomba do estoque
  let destroyed = 0;
  // destrói área 3×3 ao redor do clique
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    const nr = cr + dr, nc = cc + dc;
    if (nr >= 0 && nr < PLAY_ROWS && nc >= 0 && nc < COLS && gameState.board[nr][nc] != null) { gameState.board[nr][nc] = null; destroyed++; }
  }
  gainHP(destroyed);
  const combo_multi = 1 + (gameState.comboLevel - 1) * 0.5;
  const diff_multi = DIFF[gameState.diff].scoreMultiplier
  const pts = Math.round( destroyed * 15 * combo_multi * diff_multi);
  gameState.score += pts;
  document.getElementById('score').textContent = gameState.score;
  updateBombs();
  bombFlash();
  play("explosion")
  shakeBoard("big");


  setMsg(`💥 bomba! ${destroyed} peças destruídas`);
  gameState.busy = true;
  setTimeout(() => { gravity(); drainQueue(); render(); renderQueue(); updatePiecesUI(); setTimeout(() => processMatches(), 280); }, 350);
}

export function bombFlash() {

  const flash = document.querySelector("#bomb-flash");

  flash.classList.remove("active");

  void flash.offsetWidth;

  flash.classList.add("active");

  flash.addEventListener(
    "animationend",
    () => flash.classList.remove("active"),
    { once: true }
  );
}

// Renderiza os slots de bomba no HUD.
// Slots ocupados = .bomb-icon clicável
// Slots vazios   = .bomb-empty decorativo
export function updateBombs() {
  const bar = document.getElementById('bombbar');
  bar.innerHTML = '';
  for (let i = 0; i < MAX_BOMBS; i++) {
    if (i < gameState.bombs) {
      const d = document.createElement('div');
      d.className = 'bomb-icon' + (gameState.bombMode ? ' active-bomb' : '');
      d.textContent = '💣'; d.title = 'ativar bomba 3×3';
      d.addEventListener('click', toggleBomb);
      bar.appendChild(d);
    } else {
      const d = document.createElement('div'); d.className = 'bomb-empty'; bar.appendChild(d);
    }
  }
}