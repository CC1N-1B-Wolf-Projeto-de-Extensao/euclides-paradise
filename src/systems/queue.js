import { svgOf } from "../components/piece.js";
import { DIFF, COLS, PLAY_ROWS } from "../core/constants.js";
import { gameState } from "../core/state.js";
import { gravity } from "./board.js";
//  Dependências: state.js, constants.js, piece.js
export function weightedRnd() {
  if (Math.random() < DIFF[gameState.diff].strongRatio) return 0; // triângulo
  const pool = [1, 2, 3, 3, 4, 4, 4]; // pentagono e hexagono mais frequentes
  return pool[Math.floor(Math.random() * pool.length)];
}

// Gera 1 linha completa para a fila
export function makeQueueRow() {
  return Array.from({ length: COLS }, () => weightedRnd());
}

// Após gravity(), para cada coluna com topo vazio,
// desce a peça correspondente da fila e gera nova peça na fila.
// Chama gravity() novamente para posicionar a peça recém-inserida.
export function drainQueue() {
  let anyDropped = false;
  for (let c = 0; c < COLS; c++) {
    if (gameState.board[0][c] == null && gameState.queue[c] != null) {
      gameState.board[0][c] = gameState.queue[c];
      gameState.queue[c] = weightedRnd(); // repõe fila para essa coluna
      anyDropped = true;
    }
  }
  if (anyDropped) gravity(); // posiciona peça inserida no fundo
  return anyDropped;
}

// Renderiza a linha de fila acima do tabuleiro.
// .will-drop = colunas que vão receber peça imediatamente
export function renderQueue() {
  const el = document.getElementById('queue-area');
  el.innerHTML = '';
  for (let c = 0; c < COLS; c++) {
    const div = document.createElement('div');
    div.className = 'qcell';
    if (gameState.board[0] && gameState.board[0][c] == null) div.classList.add('will-drop');
    if (gameState.queue[c] != null) div.innerHTML = svgOf(gameState.queue[c]);
    el.appendChild(div);
  }
}