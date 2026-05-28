import { BOMB, PIECES } from "../core/constants.js";
import { setMsg } from "../core/main.js";
import { gameState } from "../core/state.js";
import { findAllMatches, get2x2HL, getEmMoves, getMoves, render } from "./board.js";
import { detonateBomb } from "./bomb.js";
import { updateEmBtn } from "./emergency.js";
import { endGame } from "./gameover.js";
import { processMatches } from "./match.js";

//Dependências: state.js, systems/board.js, systems/match.js,
//systems/gameover.js, systems/emergency.js

export function onCell(r, c) {
  if (gameState.busy || gameState.gameOver) return;

  // ── modo bomba: próximo clique = detonação ──
  if (gameState.bombMode) { detonateBomb(r, c); return; }

  // ── modo emergência: seleção em 2 passos ──
  if (gameState.emergencyMode) {
    if (!gameState.emergencyPiece) {
      // passo 1: selecionar losango
      if (gameState.board[r][c] == null || PIECES[gameState.board[r][c]]?.moveType !== 'diag') { setMsg('selecione um losango para a emergência'); return; }
      gameState.emergencyPiece = [r, c];
      const t = new Set(getEmMoves(r, c).map(([mr,mc]) => `${mr},${mc}`));
      render(new Set(), new Set(), t);
      document.querySelector(`[data-r="${r}"][data-c="${c}"]`)?.classList.add('selected');
      setMsg('agora clique na peça destino');
    } else {
      // passo 2: confirmar destino
      const [er, ec] = gameState.emergencyPiece;
      if (getEmMoves(er, ec).some(([mr,mc]) => mr === r && mc === c)) {
        gameState.emergencyMode = false; gameState.emergencyUsed = true; gameState.emergencyPiece = null; updateEmBtn(); doSwap(er, ec, r, c);
      } else { gameState.emergencyPiece = null; render(); setMsg('selecione um losango para a emergência'); }
    }
    return;
  }

  if (gameState.board[r][c] == null) return;

  // clicar direto em bomba no tabuleiro a detona
  if (gameState.board[r][c] === BOMB) { detonateBomb(r, c); return; }

  // ── fluxo normal: seleção → troca ──
  if (!gameState.selected) {
    gameState.selected = [r, c];
    const hl = new Set(getMoves(r, c).map(([mr,mc]) => `${mr},${mc}`));
    render(hl, get2x2HL(r, c, gameState.board[r][c]));
    return;
  }
  const [sr, sc] = gameState.selected;
  if (sr === r && sc === c) { gameState.selected = null; render(); return; }
  if (getMoves(sr, sc).some(([mr,mc]) => mr === r && mc === c)) {
    gameState.selected = null; doSwap(sr, sc, r, c);
  } else {
    // clicou em outra peça — muda seleção
    gameState.selected = [r, c];
    const hl = new Set(getMoves(r, c).map(([mr,mc]) => `${mr},${mc}`));
    render(hl, get2x2HL(r, c, gameState.board[r][c]));
  }
}

export function doSwap(r1, c1, r2, c2) {
  gameState.busy = true;
  [gameState.board[r1][c1], gameState.board[r2][c2]] = [gameState.board[r2][c2], gameState.board[r1][c1]];
  render();
  if (findAllMatches().size === 0) {
    // NO-COMBO RULE: desfaz visualmente e declara game over
    setTimeout(() => {
      [gameState.board[r1][c1], gameState.board[r2][c2]] = [gameState.board[r2][c2], gameState.board[r1][c1]];
      render();
      setTimeout(() => endGame(false, 'nocombo'), 400);
    }, 300);
    return;
  }
  gameState.chainReaction = false;
  setTimeout(() => processMatches(), 200);
}