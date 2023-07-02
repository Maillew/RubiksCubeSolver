const prompt = require('prompt-sync')();
let cornerLettering = [['a','b','c','d'], ['e','f','g','h'], ['i','j','k','l'],['m','n','o','p'],['q','r','s','t'],['u','v','w','x']];
const lettersToCorner = new Map();
for(let i =0; i<6; i++){
    for(let j =0; j<4; j++){
        lettersToCorner.set(String.fromCharCode(97+4*i+j),[i,j]);
    }
}

let edgeLettering = [['a','b','c','d'], ['e','f','g','h'], ['i','j','k','l'],['m','n','o','p'],['q','r','s','t'],['u','v','w','x']];
const lettersToEdge = new Map();

for(let i =0; i<6; i++){
    for(let j =0; j<4; j++){
        lettersToEdge.set(String.fromCharCode(97+4*i+j),[i,j]);
    }
}
//dir = 0: CW, 1: CCW, 2: double
/*
    we can probably shorten this more?
    only depends on sides, pp1,2,3 etc, and then the current face
        we can do this later tho, rn just keep the functions compressed lol
*/
var seeMoves = 0;
function moveUp(dir){
    let times = 0;
    if(dir == 0) times = 1;
    else if(dir==1) times  = 3;
    else if(dir == 2) times =2;
    
    for(let t =0; t<times; t++){
        const prev = structuredClone(cornerLettering);
        const prevEdge = structuredClone(edgeLettering);
        
        for(let i =0; i<4; i++){
            cornerLettering[0][i] = prev[0][(i+3)%4];
            edgeLettering[0][i] = prevEdge[0][(i+3)%4];
        }
        let sides = [1,2,3,4];
        for(let i = 0; i<4; i++){
            cornerLettering[sides[i]][0] = prev[sides[(i+1)%4]][0];
            cornerLettering[sides[i]][1] = prev[sides[(i+1)%4]][1];
            
            edgeLettering[sides[i]][0] = prevEdge[sides[(i+1)%4]][0];
        }
    }
    if(seeMoves) console.log("Up " + times);
}
function moveDown(dir){
    let times = 0;    
    if(dir == 0) times = 1;
    else if(dir==1) times  = 3;
    else if(dir == 2) times =2;
    
    for(let t =0; t<times; t++){
        const prev = structuredClone(cornerLettering);
        const prevEdge = structuredClone(edgeLettering);

        for(let i =0; i<4; i++){
            cornerLettering[5][i] = prev[5][(i+3)%4];
            edgeLettering[5][i] = prevEdge[5][(i+3)%4];

        }
        let sides = [1,2,3,4];
        for(let i = 0; i<4; i++){
            cornerLettering[sides[i]][2] = prev[sides[(i+3)%4]][2];
            cornerLettering[sides[i]][3] = prev[sides[(i+3)%4]][3];

            edgeLettering[sides[i]][2] = prevEdge[sides[(i+3)%4]][2];
        }
    }
    if(seeMoves) console.log("Down " + times);

}
function moveLeft(dir){
    let times = 0;    
    if(dir == 0) times = 1;
    else if(dir==1) times  = 3;
    else if(dir == 2) times =2;
    
    for(let t =0; t<times; t++){
        const prev = structuredClone(cornerLettering);
        const prevEdge = structuredClone(edgeLettering);

        for(let i =0; i<4; i++){
            cornerLettering[1][i] = prev[1][(i+3)%4];
            edgeLettering[1][i] = prevEdge[1][(i+3)%4];
        }
        let sides = [0,2,5,4];
        let pp1 = [0,0,0,2];
        let pp2 = [3,3,3,1];

        let pp3 = [3,3,3,1];
        for(let i = 0; i<4; i++){
            cornerLettering[sides[i]][pp1[i]] = prev[sides[(i+3)%4]][pp1[(i+3)%4]];
            cornerLettering[sides[i]][pp2[i]] = prev[sides[(i+3)%4]][pp2[(i+3)%4]];   

            edgeLettering[sides[i]][pp3[i]] = prevEdge[sides[(i+3)%4]][pp3[(i+3)%4]];
        }
    }
    if(seeMoves)  console.log("Left " + times);

}
function moveRight(dir){
    let times = 0;    
    if(dir == 0) times = 1;
    else if(dir==1) times  = 3;
    else if(dir == 2) times =2;
    
    for(let t =0; t<times; t++){
        const prev = structuredClone(cornerLettering);
        const prevEdge = structuredClone(edgeLettering);

        for(let i =0; i<4; i++){
            cornerLettering[3][i] = prev[3][(i+3)%4];
            edgeLettering[3][i] = prevEdge[3][(i+3)%4];
        }
        let sides = [0,4,5,2];
        let pp1 = [1,3,1,1];
        let pp2 = [2,0,2,2];

        let pp3 = [1,3,1,1];
        for(let i = 0; i<4; i++){
            cornerLettering[sides[i]][pp1[i]] = prev[sides[(i+3)%4]][pp1[(i+3)%4]];
            cornerLettering[sides[i]][pp2[i]] = prev[sides[(i+3)%4]][pp2[(i+3)%4]];   

            edgeLettering[sides[i]][pp3[i]] = prevEdge[sides[(i+3)%4]][pp3[(i+3)%4]];
        }
    }
    if(seeMoves) console.log("Right " + times);

}
function moveFront(dir){
    let times = 0;    
    if(dir == 0) times = 1;
    else if(dir==1) times  = 3;
    else if(dir == 2) times =2;
    
    for(let t =0; t<times; t++){
        const prev = structuredClone(cornerLettering);
        const prevEdge = structuredClone(edgeLettering);

        for(let i =0; i<4; i++){
            cornerLettering[2][i] = prev[2][(i+3)%4];
            edgeLettering[2][i] = prevEdge[2][(i+3)%4];

        }
        let sides = [0,3,5,1];
        let pp1 = [3,0,1,2];
        let pp2 = [2,3,0,1];

        let pp3 = [2,3,0,1];
        for(let i = 0; i<4; i++){
            cornerLettering[sides[i]][pp1[i]] = prev[sides[(i+3)%4]][pp1[(i+3)%4]];
            cornerLettering[sides[i]][pp2[i]] = prev[sides[(i+3)%4]][pp2[(i+3)%4]];  
            
            edgeLettering[sides[i]][pp3[i]] = prevEdge[sides[(i+3)%4]][pp3[(i+3)%4]];  
        }
    }
    if(seeMoves)  console.log("Front " + times);

}
function moveBack(dir){
    let times = 0;    
    if(dir == 0) times = 1;
    else if(dir==1) times  = 3;
    else if(dir == 2) times =2;
    
    for(let t =0; t<times; t++){
        const prev = structuredClone(cornerLettering);
        const prevEdge = structuredClone(edgeLettering);

        for(let i =0; i<4; i++){
            cornerLettering[4][i] = prev[4][(i+3)%4];
            edgeLettering[4][i] = prevEdge[4][(i+3)%4];

        }
        let sides = [0,1,5,3];
        let pp1 = [1,0,3,2];
        let pp2 = [0,3,2,1];

        let pp3 = [0,3,2,1];
        for(let i = 0; i<4; i++){
            cornerLettering[sides[i]][pp1[i]] = prev[sides[(i+3)%4]][pp1[(i+3)%4]];
            cornerLettering[sides[i]][pp2[i]] = prev[sides[(i+3)%4]][pp2[(i+3)%4]];   

            edgeLettering[sides[i]][pp3[i]] = prevEdge[sides[(i+3)%4]][pp3[(i+3)%4]];            
        }
    }
    if(seeMoves)  console.log("Back " + times);

}
// M follows L direction, E follows D direction, S follows F direction
function moveM(dir){
    let times =0;
    if(dir == 0) times = 1;
    else if(dir==1) times  = 3;
    else if(dir == 2) times =2;
    
    for(let t =0; t<times; t++){
        const prevEdge = structuredClone(edgeLettering);

        let sides = [0,2,5,4];
        let pp1 = [0,0,0,2];
        let pp2 = [2,2,2,0];

        for(let i = 0; i<4; i++){
            edgeLettering[sides[i]][pp1[i]] = prevEdge[sides[(i+3)%4]][pp1[(i+3)%4]];            
            edgeLettering[sides[i]][pp2[i]] = prevEdge[sides[(i+3)%4]][pp2[(i+3)%4]];            
        }
    }
    if(seeMoves)  console.log("M " + times);
}
function moveE(dir){
    let times = 0;
    if(dir == 0) times = 1;
    else if(dir==1) times  = 3;
    else if(dir == 2) times =2;
    
    for(let t =0; t<times; t++){
        const prevEdge = structuredClone(edgeLettering);

        let sides = [1,2,3,4];
        let pp1 = [1,1,1,1];
        let pp2 = [3,3,3,3];

        for(let i = 0; i<4; i++){
            edgeLettering[sides[i]][pp1[i]] = prevEdge[sides[(i+3)%4]][pp1[(i+3)%4]];            
            edgeLettering[sides[i]][pp2[i]] = prevEdge[sides[(i+3)%4]][pp2[(i+3)%4]];            
        }
    }
    if(seeMoves) console.log("E " + times);
}
function moveS(dir){
    let times = 0;
    if(dir == 0) times = 1;
    else if(dir==1) times  = 3;
    else if(dir == 2) times =2;
    
    for(let t =0; t<times; t++){
        const prevEdge = structuredClone(edgeLettering);

        let sides = [0,3,5,1];
        let pp1 = [3,0,1,2];
        let pp2 = [1,2,3,0];

        for(let i = 0; i<4; i++){
            edgeLettering[sides[i]][pp1[i]] = prevEdge[sides[(i+3)%4]][pp1[(i+3)%4]];            
            edgeLettering[sides[i]][pp2[i]] = prevEdge[sides[(i+3)%4]][pp2[(i+3)%4]];            
        }
    }
    if(seeMoves) console.log("S " + times);
}


function cornerSwap(){
    moveRight(0);
    moveUp(1);
    moveRight(1);
    moveUp(1);
    
    moveRight(0);
    moveUp(0);
    moveRight(1);
    moveFront(1);
    
    moveRight(0);
    moveUp(0);
    moveRight(1);
    moveUp(1);

    moveRight(1);
    moveFront(0);
    moveRight(0);
}
function jPerm(){
    moveRight(0);
    moveUp(0);
    moveRight(1);
    moveFront(1);

    moveRight(0);
    moveUp(0);
    moveRight(1);
    moveUp(1);

    moveRight(1);
    moveFront(0);
    moveRight(2);

    moveUp(1);
    moveRight(1);
    moveUp(1);
}
function tPerm(){
    moveRight(0);
    moveUp(0);
    moveRight(1);
    moveUp(1);

    moveRight(1);
    moveFront(0);
    moveRight(2);

    moveUp(1);
    moveRight(1);
    moveUp(1);
    moveRight(0);

    moveUp(0);
    moveRight(1);
    moveFront(1);
}

function orientCorner(letter){
    switch(letter){
        case 'b':
            moveRight(2);
            break;
        case 'c':
            moveRight(2);
            moveDown(1);
            break;
        case 'd':
            moveFront(2);
            break;
        case 'f':
            moveFront(1); 
            moveDown(0);
            break;
        case 'g':
            moveFront(1);
            break;
        case 'h':
            moveDown(1);
            moveRight(0);
            break;
        case 'i':
            moveFront(0);
            moveRight(1);
            break;
        case 'j':
            moveRight(1);
            break;
        case 'k':
            moveRight(1);
            moveDown(1);
            break;
        case 'l':
            moveDown(2);
            moveRight(0);
            break;
        case 'm':
            moveFront(0);
            break;
        case 'n':
            moveRight(1);
            moveFront(0);
            break;
        case 'o':
            moveDown(2);
            moveFront(1);
            break;
        case 'p':
            moveRight(0);
            moveFront(0);
            break;
        case 'q':
            moveRight(0);
            moveDown(1);
            break;
        case 's':
            moveDown(0);
            moveFront(1);
            break;
        case 't':
            moveRight(0);
            break;
        case 'u':
            moveDown(0);
            break;
        case 'v':
            break;
        case 'w':
            moveDown(1);
            break;
        case 'x':
            moveDown(2);
            break;
    }
    cornerSwap();
    switch(letter){
        case 'b':
            moveRight(2);
            break;
        case 'c':
            moveDown(0);
            moveRight(2);
            break;
        case 'd':
            moveFront(2);
            break;
        case 'f':
            moveDown(1);
            moveFront(0);
            break;
        case 'g':
            moveFront(0);
            break;
        case 'h':
            moveRight(1);
            moveDown(0);
            break;
        case 'i':
            moveRight(0);
            moveFront(1);
            break;
        case 'j':
            moveRight(0);
            break;
        case 'k':
            moveDown(0);
            moveRight(0);
            break;
        case 'l':
            moveRight(1);
            moveDown(2);
            break;
        case 'm':
            moveFront(1);
            break;
        case 'n':
            moveFront(1);
            moveRight(0);
            break;
        case 'o':
            moveFront(0);
            moveDown(2);
            break;
        case 'p':
            moveFront(1);
            moveRight(1);
            break;
        case 'q':
            moveDown(0);
            moveRight(1);
            break;
        case 's':
            moveFront(0);
            moveDown(1);
            break;
        case 't':
            moveRight(1);
            break;
        case 'u':
            moveDown(1);
            break;
        case 'v':
            break;
        case 'w':
            moveDown(0);
            break;
        case 'x':
            moveDown(2);
            break;
    }
}
// M follows L direction, E follows D direction, S follows F direction
function orientEdge(letter){
    switch(letter){
        case 'a':
            moveM(2);
            moveDown(2);
            moveM(2);
            jPerm();
            moveM(2);
            moveDown(2);
            moveM(2);
            break;
        case 'c':
            jPerm();
            break;
        case 'd':
            tPerm();
            break;
        case 'e':
            moveLeft(1);
            moveE(0);
            moveLeft(1);
            tPerm();
            moveLeft(0);
            moveE(1);
            moveLeft(0);
            break;
        case 'f':
            moveE(1);
            moveLeft(0);
            tPerm();
            moveLeft(1);
            moveE(0);
            break;
        case 'g':
            moveDown(0);
            moveM(1);
            jPerm();
            moveM(0);
            moveDown(1);
            break;
        case 'h':
            moveE(0);
            moveLeft(1);
            tPerm();
            moveLeft(0);
            moveE(1);
            break;
        case 'i':
            moveM(2);
            moveDown(2);
            moveM(1);
            jPerm();
            moveM(0);
            moveDown(2);
            moveM(2);
            break;
        case 'j':
            moveE(2);
            moveLeft(0);
            tPerm();
            moveLeft(1);
            moveE(2);
            break;
        case 'k':
            moveM(1);
            jPerm();
            moveM(0);
            break;
        case 'l':
            moveLeft(1);
            tPerm();
            moveLeft(0);
            break;
        case 'n':
            moveE(0);
            moveLeft(0);
            tPerm();
            moveLeft(1);
            moveE(1);
            break;
        case 'o':
            moveDown(1);
            moveM(1);
            jPerm();
            moveM(0);
            moveDown(0);
            break;
        case 'p':
            moveE(1);
            moveLeft(1);
            tPerm();
            moveLeft(0);
            moveE(0);
            break;
        case 'q':
            moveM(0);
            jPerm();
            moveM(1);
            break;
        case 'r':
            moveLeft(0);
            tPerm();
            moveLeft(1);
            break;
        case 's':
            moveDown(2);
            moveM(1);
            jPerm();
            moveM(0);
            moveDown(2);
            break;
        case 't':
            moveE(2);
            moveLeft(1);
            tPerm();
            moveLeft(0);
            moveE(2);
            break;
        case 'u':
            moveDown(1);
            moveLeft(2);
            tPerm();
            moveLeft(2);
            moveDown(0);
            break;
        case 'v':
            moveDown(2);
            moveLeft(2);
            tPerm();
            moveLeft(2);
            moveDown(2);
            break;
        case 'w':
            moveDown(0);
            moveLeft(2);
            tPerm();
            moveLeft(2);
            moveDown(1);
            break;
        case 'x':
            moveLeft(2);
            tPerm();
            moveLeft(2);
            break;
    }
}


let corners = [['a','e','r'], ['b','n','q'], ['c','j','m'], ['d','f','i'], ['u','g','l'], ['v','k','p'], ['w','o','t'],['x','h','s']];
const cornerNumbering = new Map();
for(let i = 0; i<corners.length; i++){
    cornerNumbering.set(corners[i][0],i);
    cornerNumbering.set(corners[i][1],i);
    cornerNumbering.set(corners[i][2],i);
}
const cornersVisited= new Array(8).fill(0);

function checkCornerVis(cur){
    return cornersVisited[cornerNumbering.get(cornerLettering[cur[0]][cur[1]])];
}
function isBufferPieceCorner(cur){
    return (cornerNumbering.get(cornerLettering[cur[0]][cur[1]]) == 0);
}
function markCornerVisited(cur){
    cornersVisited[cornerNumbering.get(cornerLettering[cur[0]][cur[1]])] = 1;
}
function cornerTrace(){ //.push() to add elements to end of array
    //need to mark already solved pieces as visited
    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 4; j++){
            if(lettersToCorner.get(cornerLettering[i][j]).toString() === [i,j].toString()){//cant compare arrays like this directly
                // console.log([i,j]);
                markCornerVisited([i,j]);
            }
        }
    }
    var moveSequence = new Array();
    let cur = [1,0];
    for(let t = 0; t < 20; t++){
        // console.log(cornerLettering);
        if(checkCornerVis(cur) || isBufferPieceCorner(cur)){
            let done = 0;
            // console.log("swap out " + cornerLettering[cur[0]][cur[1]]);
            for(let i =0; i<6 && !done; i++){
                for(let j =0; j<4 && !done; j++){
                    if(!checkCornerVis([i,j]) && !isBufferPieceCorner([i,j])){
                        orientCorner(String.fromCharCode(97+4*i+j));
                        // console.log("with " + String.fromCharCode(97+4*i+j));
                        moveSequence.push(String.fromCharCode(97+4*i+j));
                        done = 1;
                        break;
                    }
                }
            }
            // console.log(cornerLettering);
            if(!done){
                break;//we solved all pieces
            }
        }
        moveSequence.push(cornerLettering[cur[0]][cur[1]]);
        markCornerVisited(cur);
        orientCorner(cornerLettering[cur[0]][cur[1]]);//where its supposed to go
    }
    // console.log("finished corners");
    return moveSequence;    
}

let edges = [['a','q'], ['b','m'], ['c','i'],['d','e'],['f','l'],['j','p'],['n','t'],['h','r'],['k','u'],['o','v'],['s','w'],['g','x']];
const edgeNumbering = new Map();
for(let i = 0; i<edges.length; i++){
    edgeNumbering.set(edges[i][0],i);
    edgeNumbering.set(edges[i][1],i);
}

const edgesVisited= new Array(12).fill(0);

function checkEdgeVis(cur){
    return edgesVisited[edgeNumbering.get(edgeLettering[cur[0]][cur[1]])];
}
function isBufferPieceEdge(cur){
    return (edgeNumbering.get(edgeLettering[cur[0]][cur[1]]) == 1);
}
function markEdgeVisited(cur){
    edgesVisited[edgeNumbering.get(edgeLettering[cur[0]][cur[1]])] = 1;
}
function edgeTrace(){ //.push() to add elements to end of array
    //need to mark already solved pieces as visited
    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 4; j++){
            if(lettersToEdge.get(edgeLettering[i][j]).toString() === [i,j].toString()){//cant compare arrays like this directly
                // console.log([i,j]);
                markEdgeVisited([i,j]);
            }
        }
    }
    var moveSequence = new Array();
    let cur = [0,1];
    for(let t = 0; t < 30; t++){
        // console.log(edgeLettering);
        if(checkEdgeVis(cur) || isBufferPieceEdge(cur)){
            let done = 0;
            // console.log("swap out " + edgeLettering[cur[0]][cur[1]]);
            for(let i =0; i<6 && !done; i++){
                for(let j =0; j<4 && !done; j++){
                    if(!checkEdgeVis([i,j]) && !isBufferPieceEdge([i,j])){
                        orientEdge(String.fromCharCode(97+4*i+j));
                        // console.log("with " + String.fromCharCode(97+4*i+j));
                        moveSequence.push(String.fromCharCode(97+4*i+j));
                        done = 1;
                        break;
                    }
                }
            }
            // console.log(edgeLettering);
            if(!done){
                break;//we solved all pieces
            }
        }
        moveSequence.push(edgeLettering[cur[0]][cur[1]]);
        markEdgeVisited(cur);
        orientEdge(edgeLettering[cur[0]][cur[1]]);//where its supposed to go
    }
    // console.log("finished edges");
    return moveSequence;    
}
function solveCorners(){
    moveSequence = cornerTrace();
    // console.log(moveSequence);
}
function solveEdges(){
    moveSequence = edgeTrace();
    // console.log(moveSequence);
}
var problem =0;
if(1){
    for(let t =0; t<100000 && !problem; t++){    
        let moves = randomScramble();
        //need to reset everything LOL
        edgesVisited.fill(0);
        cornersVisited.fill(0);

        solveCorners();
        solveEdges();
        for(let i =0; i<6 && !problem; i++){
            for(let j =0; j<4 && !problem; j++){
                if(cornerLettering[i][j]!=String.fromCharCode(97+4*i+j)){
                    console.log("problem!!");
                    console.log(moves);
                    problem = 1;
                    break;
                }
                if(edgeLettering[i][j]!=String.fromCharCode(97+4*i+j)){
                    console.log("problem!!");
                    console.log(moves);
                    problem = 1;
                    break;
                }
            }
        }
        if(problem){
            console.log(cornerLettering);
            console.log(edgeLettering);
        }
    }
}
// setScramble();
// console.log(cornerLettering);
// console.log(edgeLettering);
// solveCorners();
// solveEdges();
// console.log(cornerLettering);
// console.log(edgeLettering);


function setScramble(){
    while(1){
        var move = prompt();
        if(move[0] == 'x') break;
        var array = move.split(" ");
        var f = array[array.length-1];
        switch(array[0]){
            case 'U': moveUp(f); break;
            case 'D': moveDown(f); break;
            case 'L': moveLeft(f); break;
            case 'R': moveRight(f); break;
            case 'F': moveFront(f); break;
            case 'B': moveBack(f); break;
        }
    }
}

function randomScramble(){
    let len = 15 + Math.floor(Math.random()*5);
    let lastMove = 6;
    var moves = new Array();
    while(len-->0){
        let curMove = Math.floor(Math.random()*5);
        do{
            curMove = Math.floor(Math.random()*5);
        }while(curMove==lastMove || curMove == (lastMove^1));

        let f = Math.floor(Math.random()*3);
        switch(curMove){
            case 0: {
                moveUp(f);
                moves.push(['U',f]);
                break;
            }
            case 1: {
                moveDown(f); 
                moves.push(['D',f]);
                break;
            }
            case 2: {
                moveLeft(f);
                moves.push(['L',f]);
                break;
            }
            case 3: {
                moveRight(f); 
                moves.push(['R',f]);
                break;
            }
            case 4: {
                moveFront(f);
                moves.push(['F',f]);
                break;
            }
            case 5: {
                moveBack(f);
                moves.push(['B',f]);
                break;
            }
        }
        lastMove = curMove;
    }
    // console.log("scramble over");
    return moves;
}