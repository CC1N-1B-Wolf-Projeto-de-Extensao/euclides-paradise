import { gameState } from "../core/state.js";

export function updateEmBtn() {
  const btn = document.getElementById('emergency-btn');
  btn.disabled = gameState.emergencyUsed;
  btn.classList.toggle('active-em', gameState.emergencyMode);
  btn.textContent = gameState.emergencyUsed ? '🔀 usado' : '🔀 emerg.';
}