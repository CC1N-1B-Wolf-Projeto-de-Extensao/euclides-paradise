import { countAll, findAllMatches, render } from "../systems/board.js";
import { updateBombs } from "../systems/bomb.js";
import { updateComboUI } from "../systems/combo.js";
import { updateEmBtn } from "../systems/emergency.js";
import { startHPDrain, updateHPBar } from "../systems/hp.js";
import { makeQueueRow, renderQueue, weightedRnd } from "../systems/queue.js";
import { COLS, PLAY_ROWS } from "./constants.js";
import { gameState } from "./state.js";
//Dependências: todos os outros módulos.
export function clearTimers() {
    clearInterval(gameState.hpIv);
    clearTimeout(gameState.comboTimer);
    clearInterval(gameState.comboBarIv);
}

export function init() {
    clearTimers();
    // reset de estado (systems/state.js no futuro)
    gameState.score = 0; 
    gameState.hp = 100; 
    gameState.comboLevel = 1; 
    gameState.selected = null; 
    gameState.busy = false; 
    gameState.gameOver = false;
    gameState.bombs = 0; 
    gameState.bombMode = false; 
    gameState.emergencyUsed = false; 
    gameState.emergencyMode = false;
    gameState.emergencyPiece = null; 
    gameState.chainReaction = false;
    gameState.board = [];

    // monta tabuleiro: 4 linhas no fundo, 4 linhas vazias no topo
    for (let r = 0; r < PLAY_ROWS; r++)
        gameState.board.push(r < 4 ? Array(COLS).fill(null) : makeQueueRow());

    gameState.queue = makeQueueRow();

    let tries = 0;
    while (findAllMatches().size > 0 && tries++ < 300)
        for (let r = 4; r < PLAY_ROWS; r++) for (let c = 0; c < COLS; c++) gameState.board[r][c] = weightedRnd();

    gameState.totalPieces = countAll();
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('score').textContent = 0;

    updateComboUI();
    updateHPBar();
    updateBombs();
    updateEmBtn();
    renderQueue();
    render();

    document.getElementById('piecesleft').textContent = gameState.totalPieces;
    setMsg('Sobreviva o máximo que conseguir! Cuidado com movimentos invalidos ou é fim de jogo');
    startHPDrain();
}

export function setMsg(t) { document.getElementById('msg').textContent = t; }

// ── Event listeners de UI ──────────────────────────────────
// Futuro: mover para core/main.js no DOMContentLoaded

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('emergency-btn').addEventListener('click', () => {
        if (gameState.emergencyUsed || gameState.gameOver || gameState.busy) return;
        gameState.emergencyMode = !gameState.emergencyMode;
        gameState.bombMode = false; gameState.emergencyPiece = null; gameState.selected = null;
        updateEmBtn(); updateBombs();
        if (gameState.emergencyMode) setMsg('modo emergência: selecione um losango');
        else { render(); setMsg('selecione uma peça'); }
    });

    document.getElementById('restart').addEventListener('click', init);
    document.getElementById('overlay-btn').addEventListener('click', init);

    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.diff = btn.dataset.diff;
            init();
        });
    });

    init();
})

