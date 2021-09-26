var origBoard;
const human = '0';
const ai = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]
const cells = document.querySelectorAll('.cell');

startGame();
function startGame() { 
    document.querySelector('.endgame').style.display = 'none';
    origBoard = Array.from(Array(9).keys());
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.removeProperty('background-color');
        cell.addEventListener('click', turnClick, false);
    });
}
function turnClick(cell) {
    if(typeof origBoard[cell.target.id] == 'number') {
        let didHumanWon = turn(cell.target.id, human);
        if(!didHumanWon && !checkTie())
         turn(bestSpot(), ai);
    }
}
function turn(cellId, player){
    origBoard[cellId] = player;
    document.getElementById(cellId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon)  {
        gameOver(gameWon);
        return true;
    }  
    return false;
}
function checkWin(board, player) { 
    let plays = board.reduce((a, e, i) => 
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if(win.every( ele => plays.indexOf(ele) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}
function gameOver(gameWon) {
        for( let index of winCombos[gameWon.index]){
            document.getElementById(index).style.backgroundColor = gameWon.player == human ? "#89f19a" : "#ff6060";
        }
        cells.forEach(cell => {
            cell.removeEventListener('click', turnClick, false);
        });
    declareWinner(gameWon.player == human ? 'You win' : 'You lose');
}
function bestSpot() { 
    return minimax(origBoard, ai).index;
 }
function emptySquares() { 
    return origBoard.filter(cell => typeof cell == 'number');
 }
function checkTie() { 
    if(emptySquares().length == 0){
        cells.forEach(cell => {
            cell.style.backgroundColor = '#b9e4dc';
            cell.removeEventListener('click', turnClick, false);
        });
        declareWinner('Tie Game!');
        return true;
    }
    return false;
 }
function declareWinner(who) { 
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').innerText = who;
 }
function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);

    if(checkWin(newBoard, human)) {
        return {score: -10};
    }
    else if(checkWin(newBoard, ai)){
        return {score: 10};
    }
    else if (availSpots.length == 0){
        return {score: 0};
    }
    var moves = [];
    availSpots.forEach(m => {
        var move = {};
        move.index = newBoard[m];
        newBoard[m] = player;

        if(player == ai){
            var result = minimax(newBoard, human);
            move.score = result.score;
        }
        else {
            var result = minimax(newBoard, ai);
            move.score = result.score;
        }

        newBoard[m] = move.index;
        moves.push(move);
    });
    var bestMove;
    if(player == ai) {
        var bestScore = -1000;
        moves.forEach((move, i) => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = i;
            }
        })
    }else {
        var bestScore = 1000;
        moves.forEach((move, i) => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = i;
            }
        })
    }
    return moves[bestMove];
}


