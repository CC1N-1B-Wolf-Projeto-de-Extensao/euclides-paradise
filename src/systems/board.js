import { svgOf } from "../components/piece.js";
import { DIFF, COLS, PLAY_ROWS, PIECES, BOMB } from "../core/constants.js";
import { gameState } from "../core/state.js";
import { onCell } from "./input.js";

//  Dependências: state.js, constants.js, piece.js, cell.js (futuro)

export function gravity() {
  for (let c = 0; c < COLS; c++) {
    let empty = PLAY_ROWS - 1;
    for (let r = PLAY_ROWS - 1; r >= 0; r--) {
      if (gameState.board[r][c] != null) { gameState.board[empty][c] = gameState.board[r][c]; if (empty !== r) gameState.board[r][c] = null; empty--; }
    }
    while (empty >= 0) { gameState.board[empty][c] = null; empty--; }
  }
}

// Renderiza o tabuleiro inteiro no DOM.
// highlights = Set de "r,c" com destinos válidos de movimento
// hl2x2      = Set de "r,c" com hexágonos em posição 2×2
// emT        = Set de "r,c" com destinos de emergência
export function render(highlights = new Set(), hl2x2 = new Set(), emT = new Set()) {
  const el = document.getElementById('board');
  el.style.gridTemplateRows = `repeat(${PLAY_ROWS},44px)`;
  el.innerHTML = '';
  for (let r = 0; r < PLAY_ROWS; r++) for (let c = 0; c < COLS; c++) {
    const div = document.createElement('div');
    div.className = 'cell'; div.dataset.r = r; div.dataset.c = c;
    const idx = gameState.board[r][c];
    if (idx == null) {
      div.classList.add('empty');
      if (gameState.bombMode) div.classList.add('bomb-target');
    } else {
      div.innerHTML = svgOf(idx);
      if (gameState.selected && gameState.selected[0] === r && gameState.selected[1] === c) div.classList.add('selected');
      if (highlights.has(`${r},${c}`)) div.classList.add('highlight');
      if (hl2x2.has(`${r},${c}`)) div.classList.add('hl2x2');
      if (gameState.bombMode) div.classList.add('bomb-target');
      if (emT.has(`${r},${c}`)) div.classList.add('em-target');
    }
    // Futuro: extrair para components/cell.js
    // cell.addEventListener('click', ...) poderia usar event delegation
    // no #board em vez de listener em cada célula
    div.addEventListener('click', () => onCell(r, c));
    el.appendChild(div);
  }
}

// Retorna movimentos válidos de uma peça em [r,c].
// Respeita moveType do component da peça:
//   'ortho' → 4 direções cardinais
//   'diag'  → 4 direções diagonais
//   'all8'  → todas as 8 direções
// Só retorna células ocupadas (não permite mover para vazio).
export function getMoves(r, c) {
  const idx = gameState.board[r][c]; if (idx == null || idx === BOMB) return [];
  const p = PIECES[idx];
  const ortho = [[-1,0],[1,0],[0,-1],[0,1]], diag = [[-1,-1],[-1,1],[1,-1],[1,1]];
  let dirs = p.moveType === 'ortho' ? ortho : p.moveType === 'diag' ? diag : [...ortho, ...diag];
  return dirs.map(([dr,dc]) => [r+dr, c+dc])
    .filter(([nr,nc]) => nr >= 0 && nr < PLAY_ROWS && nc >= 0 && nc < COLS && gameState.board[nr][nc] != null);
}

// Movimentos ortogonais para o sistema de emergência. DEPRECATED
// Usado por systems/emergency.js — losango usa isso no movimento especial.
export function getEmMoves(r, c) {
  return [[-1,0],[1,0],[0,-1],[0,1]].map(([dr,dc]) => [r+dr, c+dc])
    .filter(([nr,nc]) => nr >= 0 && nr < PLAY_ROWS && nc >= 0 && nc < COLS && gameState.board[nr][nc] != null);
}

// Retorna Set de posições de hexágonos que já formam um bloco 2×2.
// Usado para highlight visual antes do movimento.
export function get2x2HL(r, c, idx) {
  const res = new Set();
  if (idx < 0 || !PIECES[idx].has2x2) return res;
  for (const [or,oc] of [[0,0],[0,-1],[-1,0],[-1,-1]]) {
    const tr = r+or, tc = c+oc;
    if (tr >= 0 && tr+1 < PLAY_ROWS && tc >= 0 && tc+1 < COLS) {
      const cells = [[tr,tc],[tr,tc+1],[tr+1,tc],[tr+1,tc+1]];
      if (cells.every(([rr,cc]) => gameState.board[rr][cc] === idx)) cells.forEach(([rr,cc]) => res.add(`${rr},${cc}`));
    }
  }
  return res;
}

// Detecta todos os matches válidos no tabuleiro atual.
// Retorna Set de strings "r,c" de todas as peças a destruir.
// 
// Regras por tipo de peça (via component minLine e has2x2):
//   - linhas horizontais e verticais com run >= minLine
//   - bloco 2×2 para hexágonos (has2x2 = true)
export function findAllMatches() {
  const found = new Set();
  for (let i = 0; i < PIECES.length; i++) {
    const p = PIECES[i], mn = p.minLine;
    // horizontais
    for (let r = 0; r < PLAY_ROWS; r++) { let c = 0; while (c < COLS) { if (gameState.board[r][c] === i) { let run = 1; while (c+run < COLS && gameState.board[r][c+run] === i) run++; if (run >= mn) for (let k = 0; k < run; k++) found.add(`${r},${c+k}`); c += run; } else c++; } }
    // verticais
    for (let c = 0; c < COLS; c++) { let r = 0; while (r < PLAY_ROWS) { if (gameState.board[r][c] === i) { let run = 1; while (r+run < PLAY_ROWS && gameState.board[r+run][c] === i) run++; if (run >= mn) for (let k = 0; k < run; k++) found.add(`${r+k},${c}`); r += run; } else r++; } }
    // bloco 2×2
    if (p.has2x2) { for (let r = 0; r < PLAY_ROWS-1; r++) for (let c = 0; c < COLS-1; c++) { if (gameState.board[r][c]===i && gameState.board[r][c+1]===i && gameState.board[r+1][c]===i && gameState.board[r+1][c+1]===i) [`${r},${c}`,`${r},${c+1}`,`${r+1},${c}`,`${r+1},${c+1}`].forEach(k => found.add(k)); } }
  }
  return found;
}

// Conta todas as peças restantes (tabuleiro + fila).
// Win condition: countAll() === 0 → endGame('win')
export function countAll() {
  let n = 0;
  for (let r = 0; r < PLAY_ROWS; r++) for (let c = 0; c < COLS; c++) if (gameState.board[r][c] != null) n++;
  gameState.queue.forEach(v => { if (v != null) n++; });
  return n;
}

export function updatePiecesUI() {
  document.getElementById('piecesleft').textContent = countAll();
}