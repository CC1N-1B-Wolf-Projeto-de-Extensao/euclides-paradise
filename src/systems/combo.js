import { DIFF } from "../core/constants.js";
import { gameState } from "../core/state.js";
import { shakeBoard } from "./specialEffects.js";

export function bumpCombo() {
  gameState.comboLevel++;
  updateComboUI();
  clearTimeout(gameState.comboTimer); clearInterval(gameState.comboBarIv);
  const win = DIFF[gameState.diff].comboWindow;
  gameState.comboBarEnd = Date.now() + win;
  // atualiza barra visual de tempo do combo
  gameState.comboBarIv = setInterval(() => {
    const rem = Math.max(0, gameState.comboBarEnd - Date.now());
    document.getElementById('combotimer-bar').style.width = (rem / win * 100) + '%';
    if (rem === 0) clearInterval(gameState.comboBarIv);
  }, 50);
  gameState.comboTimer = setTimeout(() => { gameState.comboLevel = 1; updateComboUI(); document.getElementById('combotimer-bar').style.width = '100%'; }, win);
}

export function updateComboUI() {
  document.getElementById('combometer').textContent = 'x' + gameState.comboLevel;
  const b = (gameState.comboLevel - 1) * 0.5;
  document.getElementById('multibadge').textContent = b > 0 ? `+${b.toFixed(1)}×` : 'base';
  document.getElementById('combometer').style.color = gameState.comboLevel >= 3 ? '#E24B4A' : gameState.comboLevel >= 2 ? '#BA7517' : 'var(--color-text-primary)';

  if (gameState.comboLevel > 1) { showCombo(gameState.comboLevel) }

  if(gameState.comboLevel >= 5){
    shakeBoard("small");
  }
  if(gameState.comboLevel >= 10){
    shakeBoard("medium");
  }
  if(gameState.comboLevel >= 15){
    shakeBoard("big")
  }
}

function showCombo(multiplier) {

  const layer = document.querySelector("#fx-layer");

  const div = document.createElement("div");

  div.className = "combo-popup";
  div.style.fontSize =
    `${60 + gameState.comboLevel * 10}px`;

  div.textContent = `x${multiplier}`;

  layer.appendChild(div);

  div.addEventListener(
    "animationend",
    () => div.remove()
  );
}