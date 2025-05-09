const BOARD_SIZE = 20;
let board;
let player;
let ghosts = [];
let ghostSpeed = 1000;
let isGameRunning = false;
let score = 0
let ghostAmount = 5;

const cellSize = calculateCellSize();

document.getElementById('new-game-btn').addEventListener('click', startGame);

document.addEventListener('keydown',(event)=>{
    if(isGameRunning===false){
        return;
    }

    switch(event.key){
        case 'w':
            player.move(0,-1);
        break;
        case 's':
            player.move(0,1);
        break;
        case 'a':
        player.move(-1,0);
        break;
        case 'd':
            player.move(1,0);
        break;

        case 'ArrowUp':
            shootAt(player.x,player.y-1)
        break;
        case 'ArrowDown':
            shootAt(player.x,player.y+1)
        break;
        case 'ArrowLeft':
            shootAt(player.x-1,player.y)
        break;
        case 'ArrowRight':
            shootAt(player.x+1,player.y)
        break;

    }

    event.preventDefault();
});

function startGame(){
    document.getElementById('intro-screen').style.display='none';
    document.getElementById('game-screen').style.display='block';

    player = new Player(0,0);

    board = generateRandomBoard();
    drawBoard(board)
    setTimeout(()=>{
        ghostInterval = setInterval(moveGhosts,ghostSpeed);
    },1000)
    score = 0;
    updateScoreBoard(score);
    isGameRunning = true;
}

function generateRandomBoard(){
    
    
    const newBoard = Array.from({length:BOARD_SIZE},()=>Array(BOARD_SIZE).fill(''));
    for(let y = 0; y < BOARD_SIZE; y++){
        for(let x = 0; x < BOARD_SIZE; x++){
            if(y===0 || x===0 || y==BOARD_SIZE-1 || x==BOARD_SIZE-1){
                newBoard[y][x] = 'W';
            }
        }
    }

    generateObstacles(newBoard)
    

    const [playerX, playerY] = randomEmptyPosition(newBoard);
    setCell(newBoard,playerX,playerY, 'P');

    player.x = playerX;
    player.y = playerY;

    ghosts = []

    for(let i = 0; i<ghostAmount; i++){
        const[ghostX,ghostY] = randomEmptyPosition(newBoard);
        setCell(newBoard,ghostX,ghostY,'G');
        ghosts.push(new Ghost(ghostX,ghostY))

    }




    console.log(newBoard);
    return newBoard;
}

function drawBoard(board){
    const gameBoard = document.getElementById('game-board');
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE},1fr)`;

    gameBoard.innerHTML="";

    for(let y = 0; y < BOARD_SIZE; y++){
        for(let x = 0; x < BOARD_SIZE; x++){
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = cellSize +'px';
            cell.style.height = cellSize + 'px';
            if(board[y][x]==='W'){
                cell.classList.add('wall');
            }else if(getCell(board,x,y)==='P'){
                cell.classList.add('player')
            }else if(getCell(board,x,y)==='G'){
                cell.classList.add('ghost')
            }else if(getCell(board,x,y)==='B'){
                cell.classList.add('bullet')
                setTimeout(()=>{
                    setCell(board,x,y,"");
                    drawBoard(board);
                }, 400);
            }
            gameBoard.appendChild(cell);
        }
    }
}

function getCell(board, x, y){
    return board[y][x]
}

function calculateCellSize(){
    const screenSize = Math.min(window.innerWidth,window.innerHeight)
    const gameBoardSize = 0.95 * screenSize;
    return gameBoardSize / BOARD_SIZE;

}

function generateObstacles(board){
    const obstacles = [
        [[0,0],[0,1],[1,0],[1,1]], //Neliö
        [[0,0],[0,1],[0,2],[0,3]], //I
        [[0,0],[1,0],[2,0],[1,1]], //T
        [[1,0],[2,0],[1,1],[0,2],[1,2]], //Z
        [[1,0],[2,0],[0,1],[1,1]],//S
    ]

    const positions = [
        /*{startX: 2, startY: 2},
        {startX: 8, startY: 2},
        {startX: 4, startY: 8},
        {startX: 3, startY: 16},
        {startX: 10, startY: 10},
        {startX: 6, startY: 6},
        {startX: 15, startY: 10},
        {startX: 12, startY: 10},
        {startX: 13, startY: 9},
        {startX: 5, startY: 11},
        {startX: 3, startY: 15},
        {startX: 5, startY: 4},
        {startX: 10, startY: 4},
        {startX: 6, startY: 3},
        {startX: 7, startY: 14},
        {startX: 13, startY: 12},
        {startX: 9, startY: 4},
        {startX: 13, startY: 12},
        {startX: 11, startY: 11},
        {startX: 16, startY: 8},
        {startX: 2, startY: 10},
        {startX: 1, startY: 16},*/
    ]
    for(let i = 0; i < BOARD_SIZE;i++){
        positions.push({startX:randomInt(1,BOARD_SIZE-2),startY:randomInt(1,BOARD_SIZE-2)})
    }
    
    positions.forEach(pos=>{
        const randomObstacle = obstacles[Math.floor(Math.random()*obstacles.length)]
        while(true){
            try{
                placeObstacle(board,randomObstacle,pos.startX,pos.startY)
                break
            }
            catch(error){
                continue
            }

            }
    })
}

function placeObstacle(board,obstacle,startX,startY){
    rot = randomInt(1,4)
    mirror=randomInt(0,1)
    if(rot<=2){
        for(coordinatePair of obstacle){
            [x,y] = coordinatePair
            if(rot==2){[x,y]=[-x,-y]}
            if(mirror)[x=-x]
            board[startY+y][startX+x] = 'W'
        }
    }else{
        for(coordinatePair of obstacle){
            [y,x] = coordinatePair
            if(rot==4){[x,y]=[-x,-y]}
            if(mirror)[x=-x]
            board[startY+y][startX+x] = 'W'
        }
    }
    
}

function randomInt(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomEmptyPosition(board){

   
    x = randomInt(1, BOARD_SIZE-2);
    y = randomInt(1, BOARD_SIZE-2);
    if(getCell(board,x,y)===''){
        return [x,y];
    }else{
        return randomEmptyPosition(board)
    }
}

function setCell(board, x, y, value){
    board[y][x] = value;
}

function shootAt(x,y){
    if(getCell(board,x,y)==="W" || getCell(board,x,y)==="P"){
        return
    }
    const ghostIndex = ghosts.findIndex(ghost => ghost.x===x && ghost.y===y);
    if(ghostIndex!==-1){
        ghosts.splice(ghostIndex,1)
        updateScoreBoard(score+1);
    }
    setCell(board,x,y,'B');
    drawBoard(board)

    if(ghosts.length===0){
        startNextLevel();
    }
}

function moveGhosts(){
    const oldGhosts = ghosts.map(ghost =>({x:ghost.x, y:ghost.y}))

    ghosts.forEach(ghost => {
        const newPosition = ghost.moveGhostTowardsPlayer(player,board, oldGhosts);
        ghost.x = newPosition.x
        ghost.y=newPosition.y

        setCell(board,ghost.x,ghost.y,'G');

        oldGhosts.forEach(ghost =>{
            setCell(board,ghost.x,ghost.y,'')
        })

        ghosts.forEach(ghost => {
            setCell(board,ghost.x,ghost.y,'G');
        }
        )

        drawBoard(board);

        if (ghost.x === player.x && ghost.y === player.y){
            endGame();
            return;
        }
    });
}

function endGame(){
    alert('Game Over! Kummitus sai sut kiinni!')
    document.getElementById('intro-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
    clearInterval(ghostInterval);
    isGameRunning = false;
}

function updateScoreBoard(points){
    const scoreBoard = document.getElementById('score-board')
    score = points
    scoreBoard.textContent = `Pisteet: ${score}`;
}

function startNextLevel(){
    alert('Taso läpästy! Kummitukset riehaantuvat entisestään!')
    board = generateRandomBoard();
    ghostSpeed *= .75

    ghostAmount+=1
    clearInterval(ghostInterval);
    setTimeout(()=>{
        ghostInterval = setInterval(moveGhosts,ghostSpeed)
    },1000)


}

class Player{
    constructor(x=0,y=0){
        this.x=x
        this.y=y
    }

    move(deltaX, deltaY){
        const currentX = player.x;
        const currentY = player.y;

        //uusi sijainti
        const newX = currentX + deltaX;
        const newY = currentY + deltaY;

        if(getCell(board,newX,newY)===""){
            player.x=newX;
            player.y=newY;
            setCell(board,newX,newY,'P')
            setCell(board,currentX,currentY,"")

  
            drawBoard(board);
        }

    }
}


class Ghost{
    constructor(x=0,y=0){
        this.x=x
        this.y=y
    }


    moveGhostTowardsPlayer(player,board,oldGhosts){
        let dx = player.x - this.x
        let dy = player.y - this.y

        let moves = [];

        if(Math.abs(dx) > Math.abs(dy)){
            if(dx>0) moves.push({x:this.x+1, y:this.y})
                else moves.push({x:this.x-1, y:this.y})
            if(dy>0) moves.push({x:this.x, y:this.y+1})
                else moves.push({x:this.x, y:this.y-1})
        }else{
            if(dy>0) moves.push({x:this.x, y:this.y+1})
                else moves.push({x:this.x, y:this.y-1})
            if(dx>0) moves.push({x:this.x+1, y:this.y})
                else moves.push({x:this.x-1, y:this.y})
            
        }

        for(let move of moves){
            if(getCell(board,move.x,move.y) ==='' || getCell(board,move.x,move.y)==='P' &&
        !oldGhosts.some(h=>h.x===move.x && h.y === move.y)){
                return move;
            }

        }

        return{x:this.x,y:this.y};
    }
}