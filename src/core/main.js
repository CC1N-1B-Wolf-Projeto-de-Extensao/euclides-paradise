import { countAll, findAllMatches, render } from "../systems/board.js";
import { updateBombs } from "../systems/bomb.js";
import { updateComboUI } from "../systems/combo.js";
import { startHPDrain, updateHPBar } from "../systems/hp.js";
import { initMenu, toggle_start } from "../systems/menu.js";
import { makeQueueRow, renderQueue, weightedRnd } from "../systems/queue.js";
import { COLS, PLAY_ROWS } from "./constants.js";
import { gameState } from "./state.js";

initMenu()

export function clearTimers() {
    clearInterval(gameState.hpIv);
    clearTimeout(gameState.comboTimer);
    clearInterval(gameState.comboBarIv);
}

export function init() {
    clearTimers();
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
    renderQueue();
    render();

    document.getElementById('piecesleft').textContent = gameState.totalPieces;
    setMsg('Sobreviva o máximo que conseguir! Cuidado com movimentos invalidos ou é fim de jogo');
    startHPDrain();
}

export function setMsg(t) { document.getElementById('msg').textContent = t; }

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('restart').addEventListener('click', init);
    document.getElementById('overlay-btn').addEventListener('click', toggle_start);
    document.getElementById('play-btn').addEventListener('click', init)

    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.diff = btn.dataset.diff;
            init();
        });
    });
})

