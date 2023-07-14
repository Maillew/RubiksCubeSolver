export default class Solver{
    constructor(){
        this.cornerLettering = [['a','b','c','d'], ['e','f','g','h'], ['i','j','k','l'],['m','n','o','p'],['q','r','s','t'],['u','v','w','x']];
        this.lettersToCorner = new Map();
        this.edgeLettering = [['a','b','c','d'], ['e','f','g','h'], ['i','j','k','l'],['m','n','o','p'],['q','r','s','t'],['u','v','w','x']];
        this.lettersToEdge = new Map();

        for(let i =0; i<6; i++){
            for(let j =0; j<4; j++){
                this.lettersToCorner.set(String.fromCharCode(97+4*i+j),[i,j]);
                this.lettersToEdge.set(String.fromCharCode(97+4*i+j),[i,j]);
            }
        }
        
        this.seeMoves = 0;
        this.corners = [['a','e','r'], ['b','n','q'], ['c','j','m'], ['d','f','i'], ['u','g','l'], ['v','k','p'], ['w','o','t'],['x','h','s']];
        this.cornerNumbering = new Map();
        for(let i = 0; i<this.corners.length; i++){
            this.cornerNumbering.set(this.corners[i][0],i);
            this.cornerNumbering.set(this.corners[i][1],i);
            this.cornerNumbering.set(this.corners[i][2],i);
        }
        this.cornersVisited= new Array(8).fill(0);

        this.edges = [['a','q'], ['b','m'], ['c','i'],['d','e'],['f','l'],['j','p'],['n','t'],['h','r'],['k','u'],['o','v'],['s','w'],['g','x']];
        this.edgeNumbering = new Map();
        for(let i = 0; i<this.edges.length; i++){
            this.edgeNumbering.set(this.edges[i][0],i);
            this.edgeNumbering.set(this.edges[i][1],i);
        }
        this.edgesVisited= new Array(12).fill(0);
    }    
    //dir = 0: CW, 1: CCW, 2: double
    /*
        we can probably shorten this more?
        only depends on sides, pp1,2,3 etc, and then the current face
            we can do this later tho, rn just keep the functions compressed lol
    */
    moveFace(dir, face, sides, pp1, pp2, pp3){//for all the moves, to clean it up
        let times = 0;
        if(dir == 0) times = 1;
        else if(dir==1) times  = 3;
        else if(dir == 2) times = 2;

        for(let t =0; t<times; t++){
            const prev = structuredClone(this.cornerLettering);//issue is here maybe??
            const prevEdge = structuredClone(this.edgeLettering);
            
            for(let i =0; i<4; i++){
                this.cornerLettering[face][i] = prev[face][(i+3)%4];
                this.edgeLettering[face][i] = prevEdge[face][(i+3)%4];
            }
            for(let i = 0; i<4; i++){
                this.cornerLettering[sides[i]][pp1[i]] = prev[sides[(i+3)%4]][pp1[(i+3)%4]];
                this.cornerLettering[sides[i]][pp2[i]] = prev[sides[(i+3)%4]][pp2[(i+3)%4]];   

                this.edgeLettering[sides[i]][pp3[i]] = prevEdge[sides[(i+3)%4]][pp3[(i+3)%4]];
            }
        }
    }
    moveUp (dir){
        let times = 0;
        if(dir == 0) times = 1;
        else if(dir==1) times  = 3;
        else if(dir == 2) times =2;
        
        for(let t =0; t<times; t++){
            const prev = structuredClone(this.cornerLettering);
            const prevEdge = structuredClone(this.edgeLettering);
            
            for(let i =0; i<4; i++){
                this.cornerLettering[0][i] = prev[0][(i+3)%4];
                this.edgeLettering[0][i] = prevEdge[0][(i+3)%4];
            }
            let sides = [1,2,3,4];
            for(let i = 0; i<4; i++){
                this.cornerLettering[sides[i]][0] = prev[sides[(i+1)%4]][0];
                this.cornerLettering[sides[i]][1] = prev[sides[(i+1)%4]][1];
                
                this.edgeLettering[sides[i]][0] = prevEdge[sides[(i+1)%4]][0];
            }
        }
    }
    moveDown(dir){
        /*
            face = 5
            sides = [1,2,3,4]
            pp1 = [2,2,2,2];
            pp2 = [3,3,3,3];
            pp3 = [2,2,2,2];
        */
        let times = 0;    
        if(dir == 0) times = 1;
        else if(dir==1) times  = 3;
        else if(dir == 2) times =2;
        
        for(let t =0; t<times; t++){
            const prev = structuredClone(this.cornerLettering);
            const prevEdge = structuredClone(this.edgeLettering);

            for(let i =0; i<4; i++){
                this.cornerLettering[5][i] = prev[5][(i+3)%4];
                this.edgeLettering[5][i] = prevEdge[5][(i+3)%4];

            }
            let sides = [1,2,3,4];
            for(let i = 0; i<4; i++){
                this.cornerLettering[sides[i]][2] = prev[sides[(i+3)%4]][2];
                this.cornerLettering[sides[i]][3] = prev[sides[(i+3)%4]][3];

                this.edgeLettering[sides[i]][2] = prevEdge[sides[(i+3)%4]][2];
            }
        }
    }
    moveLeft(dir){
        /*
            face = 1
            sides = [0,2,5,4];
            pp1 = [0,0,0,2];
            pp2 = [3,3,3,1];

            pp3 = [3,3,3,1];
        */
        this.moveFace(dir,1,[0,2,5,4],[0,0,0,2],[3,3,3,1],[3,3,3,1]);
    }
    moveRight(dir){
        /*
            face = 3
            sides = [0,4,5,2];
            pp1 = [1,3,1,1];
            pp2 = [2,0,2,2];

            pp3 = [1,3,1,1];
        */
        this.moveFace(dir,3,[0,4,5,2],[1,3,1,1],[2,0,2,2],[1,3,1,1]);
    }
    moveFront(dir){
        /*
            face = 2
            sides = [0,3,5,1];
            pp1 = [3,0,1,2];
            pp2 = [2,3,0,1];

            pp3 = [2,3,0,1];
        */
        this.moveFace(dir,2,[0,3,5,1],[3,0,1,2],[2,3,0,1],[2,3,0,1]);
    }
    moveBack(dir){
        /*
            face = 4
            sides = [0,1,5,3];
            pp1 = [1,0,3,2];
            pp2 = [0,3,2,1];

            pp3 = [0,3,2,1];
        */
        this.moveFace(dir,4,[0,1,5,3],[1,0,3,2],[0,3,2,1],[0,3,2,1]);
    }
    // M follows L direction, E follows D direction, S follows F direction
    moveM(dir){
        let times =0;
        if(dir == 0) times = 1;
        else if(dir==1) times  = 3;
        else if(dir == 2) times =2;
        
        for(let t =0; t<times; t++){
            const prevEdge = structuredClone(this.edgeLettering);

            let sides = [0,2,5,4];
            let pp1 = [0,0,0,2];
            let pp2 = [2,2,2,0];

            for(let i = 0; i<4; i++){
                this.edgeLettering[sides[i]][pp1[i]] = prevEdge[sides[(i+3)%4]][pp1[(i+3)%4]];            
                this.edgeLettering[sides[i]][pp2[i]] = prevEdge[sides[(i+3)%4]][pp2[(i+3)%4]];            
            }
        }
    }
    moveE(dir){
        let times = 0;
        if(dir == 0) times = 1;
        else if(dir==1) times  = 3;
        else if(dir == 2) times =2;
        
        for(let t =0; t<times; t++){
            const prevEdge = structuredClone(this.edgeLettering);

            let sides = [1,2,3,4];
            let pp1 = [1,1,1,1];
            let pp2 = [3,3,3,3];

            for(let i = 0; i<4; i++){
                this.edgeLettering[sides[i]][pp1[i]] = prevEdge[sides[(i+3)%4]][pp1[(i+3)%4]];            
                this.edgeLettering[sides[i]][pp2[i]] = prevEdge[sides[(i+3)%4]][pp2[(i+3)%4]];            
            }
        }
    }
    moveS(dir){
        let times = 0;
        if(dir == 0) times = 1;
        else if(dir==1) times  = 3;
        else if(dir == 2) times =2;
        
        for(let t =0; t<times; t++){
            const prevEdge = structuredClone(this.edgeLettering);

            let sides = [0,3,5,1];
            let pp1 = [3,0,1,2];
            let pp2 = [1,2,3,0];

            for(let i = 0; i<4; i++){
                this.edgeLettering[sides[i]][pp1[i]] = prevEdge[sides[(i+3)%4]][pp1[(i+3)%4]];            
                this.edgeLettering[sides[i]][pp2[i]] = prevEdge[sides[(i+3)%4]][pp2[(i+3)%4]];            
            }
        }
    }


    cornerSwap(){
        this.moveRight(0);
        this. moveUp(1);
        this.moveRight(1);
        this.moveUp(1);
        
        this.moveRight(0);
        this.moveUp(0);
        this.moveRight(1);
        this.moveFront(1);
        
        this.moveRight(0);
        this.moveUp(0);
        this.moveRight(1);
        this.moveUp(1);

        this.moveRight(1);
        this.moveFront(0);
        this.moveRight(0);
    }
    jPerm(){
        this.moveRight(0);
        this.moveUp(0);
        this.moveRight(1);
        this.moveFront(1);

        this.moveRight(0);
        this.moveUp(0);
        this.moveRight(1);
        this.moveUp(1);

        this.moveRight(1);
        this.moveFront(0);
        this.moveRight(2);

        this.moveUp(1);
        this.moveRight(1);
        this.moveUp(1);
    }
    tPerm(){
        this.moveRight(0);
        this.moveUp(0);
        this.moveRight(1);
        this.moveUp(1);

        this.moveRight(1);
        this.moveFront(0);
        this.moveRight(2);

        this.moveUp(1);
        this.moveRight(1);
        this.moveUp(1);
        this.moveRight(0);

        this.moveUp(0);
        this.moveRight(1);
        this.moveFront(1);
    }

    orientCorner(letter){
        switch(letter){
            case 'b':
                this.moveRight(2);
                break;
            case 'c':
                this.moveRight(2);
                this.moveDown(1);
                break;
            case 'd':
                this.moveFront(2);
                break;
            case 'f':
                this.moveFront(1); 
                this.moveDown(0);
                break;
            case 'g':
                this.moveFront(1);
                break;
            case 'h':
                this.moveDown(1);
                this.moveRight(0);
                break;
            case 'i':
                this.moveFront(0);
                this.moveRight(1);
                break;
            case 'j':
                this.moveRight(1);
                break;
            case 'k':
                this.moveRight(1);
                this.moveDown(1);
                break;
            case 'l':
                this.moveDown(2);
                this.moveRight(0);
                break;
            case 'm':
                this.moveFront(0);
                break;
            case 'n':
                this.moveRight(1);
                this.moveFront(0);
                break;
            case 'o':
                this.moveDown(2);
                this.moveFront(1);
                break;
            case 'p':
                this.moveRight(0);
                this.moveFront(0);
                break;
            case 'q':
                this.moveRight(0);
                this.moveDown(1);
                break;
            case 's':
                this.moveDown(0);
                this.moveFront(1);
                break;
            case 't':
                this.moveRight(0);
                break;
            case 'u':
                this.moveDown(0);
                break;
            case 'v':
                break;
            case 'w':
                this.moveDown(1);
                break;
            case 'x':
                this.moveDown(2);
                break;
        }
        this.cornerSwap();
        switch(letter){
            case 'b':
                this.moveRight(2);
                break;
            case 'c':
                this.moveDown(0);
                this.moveRight(2);
                break;
            case 'd':
                this.moveFront(2);
                break;
            case 'f':
                this.moveDown(1);
                this.moveFront(0);
                break;
            case 'g':
                this.moveFront(0);
                break;
            case 'h':
                this.moveRight(1);
                this.moveDown(0);
                break;
            case 'i':
                this.moveRight(0);
                this.moveFront(1);
                break;
            case 'j':
                this.moveRight(0);
                break;
            case 'k':
                this.moveDown(0);
                this.moveRight(0);
                break;
            case 'l':
                this.moveRight(1);
                this.moveDown(2);
                break;
            case 'm':
                this.moveFront(1);
                break;
            case 'n':
                this.moveFront(1);
                this.moveRight(0);
                break;
            case 'o':
                this.moveFront(0);
                this.moveDown(2);
                break;
            case 'p':
                this.moveFront(1);
                this.moveRight(1);
                break;
            case 'q':
                this.moveDown(0);
                this.moveRight(1);
                break;
            case 's':
                this.moveFront(0);
                this.moveDown(1);
                break;
            case 't':
                this.moveRight(1);
                break;
            case 'u':
                this.moveDown(1);
                break;
            case 'v':
                break;
            case 'w':
                this.moveDown(0);
                break;
            case 'x':
                this.moveDown(2);
                break;
        }
    }
    // M follows L direction, E follows D direction, S follows F direction
    orientEdge(letter){
        switch(letter){
            case 'a':
                this.moveM(2);
                this.moveDown(2);
                this.moveM(2);
                this.jPerm();
                this.moveM(2);
                this.moveDown(2);
                this.moveM(2);
                break;
            case 'c':
                this.jPerm();
                break;
            case 'd':
                this.tPerm();
                break;
            case 'e':
                this.moveLeft(1);
                this.moveE(0);
                this.moveLeft(1);
                this.tPerm();
                this.moveLeft(0);
                this.moveE(1);
                this.moveLeft(0);
                break;
            case 'f':
                this.moveE(1);
                this.moveLeft(0);
                this.tPerm();
                this.moveLeft(1);
                this.moveE(0);
                break;
            case 'g':
                this.moveDown(0);
                this.moveM(1);
                this.jPerm();
                this.moveM(0);
                this.moveDown(1);
                break;
            case 'h':
                this.moveE(0);
                this.moveLeft(1);
                this.tPerm();
                this.moveLeft(0);
                this.moveE(1);
                break;
            case 'i':
                this.moveM(2);
                this.moveDown(2);
                this.moveM(1);
                this.jPerm();
                this.moveM(0);
                this.moveDown(2);
                this.moveM(2);
                break;
            case 'j':
                this.moveE(2);
                this.moveLeft(0);
                this.tPerm();
                this.moveLeft(1);
                this.moveE(2);
                break;
            case 'k':
                this.moveM(1);
                this.jPerm();
                this.moveM(0);
                break;
            case 'l':
                this.moveLeft(1);
                this.tPerm();
                this.moveLeft(0);
                break;
            case 'n':
                this.moveE(0);
                this.moveLeft(0);
                this.tPerm();
                this.moveLeft(1);
                this.moveE(1);
                break;
            case 'o':
                this.moveDown(1);
                this.moveM(1);
                this.jPerm();
                this.moveM(0);
                this.moveDown(0);
                break;
            case 'p':
                this.moveE(1);
                this.moveLeft(1);
                this.tPerm();
                this.moveLeft(0);
                this.moveE(0);
                break;
            case 'q':
                this.moveM(0);
                this.jPerm();
                this.moveM(1);
                break;
            case 'r':
                this.moveLeft(0);
                this.tPerm();
                this.moveLeft(1);
                break;
            case 's':
                this.moveDown(2);
                this.moveM(1);
                this.jPerm();
                this.moveM(0);
                this.moveDown(2);
                break;
            case 't':
                this.moveE(2);
                this.moveLeft(1);
                this.tPerm();
                this.moveLeft(0);
                this.moveE(2);
                break;
            case 'u':
                this.moveDown(1);
                this.moveLeft(2);
                this.tPerm();
                this.moveLeft(2);
                this.moveDown(0);
                break;
            case 'v':
                this.moveDown(2);
                this.moveLeft(2);
                this.tPerm();
                this.moveLeft(2);
                this.moveDown(2);
                break;
            case 'w':
                this.moveDown(0);
                this.moveLeft(2);
                this.tPerm();
                this.moveLeft(2);
                this.moveDown(1);
                break;
            case 'x':
                this.moveLeft(2);
                this.tPerm();
                this.moveLeft(2);
                break;
        }
    }
    
    checkCornerVis(cur){
        return this.cornersVisited[this.cornerNumbering.get(this.cornerLettering[cur[0]][cur[1]])];
    }
    isBufferPieceCorner(cur){
        return (this.cornerNumbering.get(this.cornerLettering[cur[0]][cur[1]]) == 0);
    }
    markCornerVisited(cur){
        this.cornersVisited[this.cornerNumbering.get(this.cornerLettering[cur[0]][cur[1]])] = 1;
    }
    cornerTrace(){ //.push() to add elements to end of array
        //need to mark already solved pieces as visited
        var prevEdgeLettering = structuredClone(this.edgeLettering);
        var prevCornerLettering = structuredClone(this.cornerLettering);
        for(let i = 0; i < 6; i++){
            for(let j = 0; j < 4; j++){
                if(this.lettersToCorner.get(this.cornerLettering[i][j]).toString() === [i,j].toString()){//cant compare arrays like this directly
                    // console.log([i,j]);
                    this.markCornerVisited([i,j]);
                }
            }
        }
        var moveSequence = new Array();
        let cur = [1,0];
        for(let t = 0; t < 20; t++){
            // console.log(cornerLettering);
            if(this.checkCornerVis(cur) || this.isBufferPieceCorner(cur)){
                let done = 0;
                // console.log("swap out " + cornerLettering[cur[0]][cur[1]]);
                for(let i =0; i<6 && !done; i++){
                    for(let j =0; j<4 && !done; j++){
                        if(!this.checkCornerVis([i,j]) && !this.isBufferPieceCorner([i,j])){
                            this.orientCorner(String.fromCharCode(97+4*i+j));
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
            moveSequence.push(this.cornerLettering[cur[0]][cur[1]]);
            this.markCornerVisited(cur);
            this.orientCorner(this.cornerLettering[cur[0]][cur[1]]);//where its supposed to go
        }
        console.log("finished corners");
        for(let i = 0; i < 6; i++){
            for(let j = 0; j < 4; j++){
                this.edgeLettering[i][j] = prevEdgeLettering[i][j];
                this.cornerLettering[i][j] = prevCornerLettering[i][j];
            }
        }
        return moveSequence;    
    }
    checkEdgeVis(cur){
        return this.edgesVisited[this.edgeNumbering.get(this.edgeLettering[cur[0]][cur[1]])];
    }
    isBufferPieceEdge(cur){
        return (this.edgeNumbering.get(this.edgeLettering[cur[0]][cur[1]]) == 1);
    }
    markEdgeVisited(cur){
        this.edgesVisited[this.edgeNumbering.get(this.edgeLettering[cur[0]][cur[1]])] = 1;
    }
    edgeTrace(){ //.push() to add elements to end of array
        //need to mark already solved pieces as visited
        
        var prevEdgeLettering = structuredClone(this.edgeLettering);
        var prevCornerLettering = structuredClone(this.cornerLettering);

        for(let i = 0; i < 6; i++){
            for(let j = 0; j < 4; j++){
                if(this.lettersToEdge.get(this.edgeLettering[i][j]).toString() === [i,j].toString()){//cant compare arrays like this directly
                    // console.log([i,j]);
                    this.markEdgeVisited([i,j]);
                }
            }
        }
        var moveSequence = new Array();
        let cur = [0,1];
        for(let t = 0; t < 30; t++){
            // console.log(edgeLettering);
            if(this.checkEdgeVis(cur) || this.isBufferPieceEdge(cur)){
                let done = 0;
                // console.log("swap out " + edgeLettering[cur[0]][cur[1]]);
                for(let i =0; i<6 && !done; i++){
                    for(let j =0; j<4 && !done; j++){
                        if(!this.checkEdgeVis([i,j]) && !this.isBufferPieceEdge([i,j])){
                            this.orientEdge(String.fromCharCode(97+4*i+j));
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
            moveSequence.push(this.edgeLettering[cur[0]][cur[1]]);
            this.markEdgeVisited(cur);
            this.orientEdge(this.edgeLettering[cur[0]][cur[1]]);//where its supposed to go
        }
        console.log("finished edges");
        for(let i = 0; i < 6; i++){
            for(let j = 0; j < 4; j++){
                this.edgeLettering[i][j] = prevEdgeLettering[i][j];
                this.cornerLettering[i][j] = prevCornerLettering[i][j];
            }
        }
        return moveSequence;    
    }
    solveCorners(){
        var moveSequence = this.cornerTrace();
        // console.log(moveSequence);
        return moveSequence;
    }
    solveEdges(){
        var moveSequence = this.edgeTrace();
        // console.log(moveSequence);
        return moveSequence;
    }
    testDebugger(){
        var problem =0;
        if(1){
            for(let t =0; t<10000 && !problem; t++){    
                let moves = this.randomScramble();
                //need to reset everything LOL
                this.edgesVisited.fill(0);
                this.cornersVisited.fill(0);
    
                this.solveCorners();
                this.solveEdges();
                for(let i =0; i<6 && !problem; i++){
                    for(let j =0; j<4 && !problem; j++){
                        if(this.cornerLettering[i][j]!=String.fromCharCode(97+4*i+j)){
                            console.log("problem!!");
                            console.log(moves);
                            problem = 1;
                            break;
                        }
                        if(this.edgeLettering[i][j]!=String.fromCharCode(97+4*i+j)){
                            console.log("problem!!");
                            console.log(moves);
                            problem = 1;
                            break;
                        }
                    }
                }
                if(problem){
                    console.log(this.cornerLettering);
                    console.log(this.edgeLettering);
                }
            }
        }
    }
    randomScramble(){//generates the scramble, but doesnt exec it
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
                    moves.push(['U',f]);
                    break;
                }
                case 1: {
                    moves.push(['D',f]);
                    break;
                }
                case 2: {
                    moves.push(['L',f]);
                    break;
                }
                case 3: {
                    moves.push(['R',f]);
                    break;
                }
                case 4: {
                    moves.push(['F',f]);
                    break;
                }
                case 5: {
                    moves.push(['B',f]);
                    break;
                }
            }
            lastMove = curMove;
        }
        return moves;
    }
}
const solver = new Solver();

solver.testDebugger();

export {Solver};
