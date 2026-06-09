import { clearTimers } from "../core/main.js";
import { gameState } from "../core/state.js";

export function initMenu() {
  const startScreen = document.querySelector("#start-screen");
  const tutorialScreen = document.querySelector("#tutorial-screen");
  const playBtn = document.querySelector("#play-btn");
  const tutorialBtn = document.querySelector("#tutorial-btn");
  const backBtn = document.querySelector("#back-btn");
gameState.busy = true;
clearTimers();
  playBtn.onclick = () => {

    startScreen.classList.remove("show");

  };


  tutorialBtn.onclick = () => {

    startScreen.classList.remove("show");

    tutorialScreen.classList.add("show");

  };


  backBtn.onclick = () => {

    tutorialScreen.classList.remove("show");

    startScreen.classList.add("show");

  };
}

export function toggle_start(){
  const startScreen = document.querySelector("#start-screen");
  startScreen.classList.add("show")
}