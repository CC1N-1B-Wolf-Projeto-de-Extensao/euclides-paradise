
import { DIFF, MAX_BOMBS } from "../core/constants.js";
import { setMsg } from "../core/main.js";
import { gameState } from "../core/state.js";
import { countAll, findAllMatches, gravity, render, updatePiecesUI } from "./board.js";
import { updateBombs } from "./bomb.js";
import { bumpCombo, updateComboUI } from "./combo.js";
import { endGame } from "./gameover.js";
import { gainHP } from "./hp.js";
import { drainQueue, renderQueue } from "./queue.js";
import { play } from "./sound.js";

export function tryGiveBomb(matchSize, isChain) {
  // Ganha bomba se: combo de 4+ peças OU reação em cadeia
  if ((matchSize >= 5) && gameState.bombs < MAX_BOMBS) {
    gameState.bombs++;
    updateBombs();
    setMsg('💣 +1 bomba!');
  }
}

export function processMatches() {
  const found = findAllMatches();
  if (found.size === 0) {
    // nenhum match: estabilizou
    gameState.busy = false; 
    gravity(); drainQueue(); render(); renderQueue(); updatePiecesUI();
    if (countAll() === 0) endGame(true, 'win'); // WIN CONDITION
    else setMsg('selecione uma peça');
    return;
  }
  const isChain = gameState.chainReaction;
  gameState.chainReaction = true; // marca que próxima rodada é cadeia
  bumpCombo();
  const combo_multi = 1 + (gameState.comboLevel - 1) * 0.5;
  const diff_multi  = DIFF[gameState.diff].scoreMultiplier
  const pts = Math.round(found.size * 10 * combo_multi * diff_multi);
  gameState.score += pts;
  document.getElementById('score').textContent = gameState.score;
  gainHP(found.size);
  tryGiveBomb(found.size, isChain);
  setMsg(`💥 ${found.size} peças! +${pts}pts${gameState.comboLevel > 1 ? ' (x'+gameState.comboLevel+' combo)' : ''}`);
  // remove peças matched
  found.forEach(k => { const [r,c] = k.split(',').map(Number); gameState.board[r][c] = null; });
  render();
  play("match")
  // aguarda animação e recomeça loop
  setTimeout(() => { gravity(); drainQueue(); render(); renderQueue(); updatePiecesUI(); setTimeout(() => processMatches(), 280); }, 350);
}