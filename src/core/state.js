
export const gameState = {
    diff : 'medio',
    board        :[],   // board[r][c] : índice da peça (0-4) | BOMB(-1) | null
    queue        :[],   // queue[c]    : próxima peça da coluna c
    selected     : null, // [r, c] da peça selecionada, ou null
    score        : 0,
    busy         : false, // trava input durante animações/processamento
    hp           : 100,   // 0–100
    comboLevel   : 1,     // multiplicador atual (x1, x2, x3...)
    comboTimer   : null,  // setTimeout handle
    comboBarIv   : null,  // setInterval handle da barra de combo
    comboBarEnd  : 0,     // timestamp de expiração do combo
    hpIv         : null,  // setInterval handle do drain de HP
    gameOver     : false,
    bombs        : 1,     // bombas no estoque (0–MAX_BOMBS)
    bombMode     : false, // true : próximo clique detona bomba
    emergencyUsed   : false, // 1 uso por partida
    emergencyMode   : false,
    emergencyPiece  : null,  // [r,c] do losango selecionado para emergência
    chainReaction   : false, // true : está em cascata (para tryGiveBomb)
    totalPieces     : 0,
}