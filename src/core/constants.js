export const COLS = 7;
export const PLAY_ROWS = 8;
export const MAX_BOMBS = 3;
export const BOMB = -1; //  célula com bomba no tabuleiro

export const DIFF = {
    facil: {
        hpRate: 0.5,
        strongRatio: 0.05,
        comboWindow: 6000,
        hpScaleFactor: 0.3,
        scoreMultiplier: 0.3
    },
    medio: {
        hpRate: 1.6,
        strongRatio: 0.15,
        comboWindow: 4000,
        hpScaleFactor: 1,
        scoreMultiplier: 1
    },
    hard: {
        hpRate: 2.8,
        strongRatio: 0.30,
        comboWindow: 2800,
        hpScaleFactor: 1.5,
        scoreMultiplier: 1.5
    },
};

// Cada peça é uma entidade simples com components:
//   shape     component visual (renderizado por piece.js)
//   minLine   component de regra de combo em linha
//   moveType  component de regra de movimento
//   has2x2    component de regra de combo em bloco
export const PIECES = [
    { name: 'triangulo', color: '#E24B4A', stroke: '#A32D2D', shape: 'triangle', minLine: 3, moveType: 'all8', has2x2: false },
    { name: 'quadrado', color: '#BA7517', stroke: '#633806', shape: 'square', minLine: 4, moveType: 'ortho', has2x2: false },
    { name: 'losango', color: '#1D9E75', stroke: '#085041', shape: 'diamond', minLine: 3, moveType: 'diag', has2x2: false },
    { name: 'pentagono', color: '#185FA5', stroke: '#042C53', shape: 'pentagon', minLine: 3, moveType: 'ortho', has2x2: false },
    { name: 'hexagono', color: '#7F77DD', stroke: '#3C3489', shape: 'hexagon', minLine: 3, moveType: 'ortho', has2x2: true },
]