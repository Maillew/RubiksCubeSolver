import * as THREE from 'three'
import Solver from './app'; 
import "./style.css"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import gsap from 'gsap'
import TWEEN from '@tweenjs/tween.js'

const scene = new THREE.Scene()
const solver = new Solver();

//z is towards viewer
//y is up
//x is to the right

//shape
const material = new THREE.MeshStandardMaterial({
  vertexColors: true
})

/*
  Red: CB0009
  Orange: FF7400  
  White: FFFFFF
  Yellow: FFDD00
  Green: 00D53A
  Blue: 1159FF
*/
const faceColors =[];
const white = new THREE.Color();
white.setHex(0xffffff);
const yellow = new THREE.Color();
yellow.setHex(0xffdd00);
const red = new THREE.Color();
red.setHex(0xcb0009);
const orange = new THREE.Color();
orange.setHex(0xff7400);
const blue = new THREE.Color();
blue.setHex(0x1159ff);
const green = new THREE.Color();
green.setHex(0x00d53a);
const black = new THREE.Color();
black.setHex(0x000000);


faceColors.push(red);
faceColors.push(orange);
faceColors.push(white);
faceColors.push(yellow);
faceColors.push(green);
faceColors.push(blue);
faceColors.push(black);

const fullCube = [];
function generateCube(x,y,z){
  var cubeGeometry = new THREE.BoxGeometry(0.98,0.98,0.98).toNonIndexed();

  const positionAttribute = cubeGeometry.getAttribute('position');
  const colors = [];
  for(let i =0; i<6; i++){
    let index = 6;
    if(i ===0 && x === 1) index = 0;
    if(i ===1 && x ===-1) index = 1;
    if(i ===2 && y === 1) index = 2;
    if(i ===3 && y ===-1) index = 3;
    if(i ===4 && z === 1) index = 4;
    if(i ===5 && z ===-1) index = 5;
    
    for(let j =0; j<6; j++){
      colors.push(faceColors[index].r,faceColors[index].g,faceColors[index].b);
    }
  }  
  // define the new attribute
  cubeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  var cube = new THREE.Mesh(cubeGeometry,material)
  cube.position.z = z;
  cube.position.y = y;
  cube.position.x = x;

  fullCube.push(cube)
}
/*
  default cube orientation:
  green facing up, orange left, white away
  x is right left
  y is up down
  z is towards away from viewer
*/
//function to rotate object, certain degrees

for(let z =-1; z<=1; z++){
  for(let y = -1; y<=1; y++){
    for(let x = -1; x<=1; x++){
      generateCube(x,y,z)
    }
  }
}

for(let i =0; i < fullCube.length; i++){
  scene.add(fullCube[i]);
}


//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//light
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(10,10,10)//x,y,z
light.intensity = 1.25
const light2 = new THREE.PointLight(0xffffff, 1, 100)
light2.position.set(-10,-10,-10)//x,y,z
light2.intensity = 1.25
scene.add(light, light2)//so the whole cube is illuminated

//add camera
const camera = new THREE.PerspectiveCamera(45,sizes.width/sizes.height, 0.1, 100)
camera.position.z = 20;
scene.add(camera);

//renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)


window.addEventListener("resize", () =>{
  //update sizes as window size changes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //update camera
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height)
})

//Controls
const controls = new OrbitControls(camera,canvas)
controls.enableDamping = true
controls.enablePan = false//cant move object around, always centered
controls.enableZoom = false//no zooming in
// controls.autoRotate = true
// controls.autoRotateSpeed = 5 

const loop = () =>{//rerender it, so that the cube is in right position
  controls.update()
  renderer.render(scene, camera)
  TWEEN.update();
  window.requestAnimationFrame(loop)
}
loop()

//timeline magic, synchronize multiple animations tgt
const tl = gsap.timeline({defaults: {duration: 1}})//default time duration is 1 second

//need to make a rubiks cube object, so it all scales in nicely

// tl.fromTo(fullCube.scale, {z:0,x:0,y:0}, {z:1,x:1,y:1})//animation to start; scales all the axis
// tl.fromTo('nav', {y: "-100%"}, {y:"0%"})//animates the nav bar in
// tl.fromTo('.title', {opacity:0},{opacity:1})//fades in the title
// tl.fromTo('.moveBtns', {opacity:0},{opacity:1})

//mouse animation color
// let mouseDown = false
// let rgb = [12,23,]

// window.addEventListener("mousedown", () => (mouseDown = true))
// window.addEventListener("mouseup", () => (mouseDown = false))//makes it so that changes only happens when we are clicking down
// window.addEventListener("mousemove", (e) => {
//   if(mouseDown){
//     rgb = [
//       Math.round((e.pageX / sizes.width) * 255),
//       Math.round((e.pageX / sizes.width) * 255),
//       150,
//     ]
//     //animate
//     let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
//     gsap.to(cube.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
//   }
// })

//buttons for rotations
// const axesHelper = new THREE.AxesHelper(10);
// scene.add(axesHelper);

const xAxis = new THREE.Vector3(1,0,0);//red
const yAxis = new THREE.Vector3(0,1,0);//green
const zAxis = new THREE.Vector3(0,0,1);//blue

const epsilon = 0.5;
function checkCoordSame(c1, val, axis){
  if(axis =='x') return c1.position.x > val - epsilon && c1.position.x < val + epsilon;
  if(axis =='y') return c1.position.y > val - epsilon && c1.position.y < val + epsilon;
  if(axis =='z') return c1.position.z > val - epsilon && c1.position.z < val + epsilon;  
}

document.getElementById("moveF") .addEventListener("click", rotateF,  false);
document.getElementById("moveFi").addEventListener("click", rotateFi, false);
document.getElementById("moveB") .addEventListener("click", rotateB,  false);
document.getElementById("moveBi").addEventListener("click", rotateBi, false);
document.getElementById("moveL") .addEventListener("click", rotateL,  false);
document.getElementById("moveLi").addEventListener("click", rotateLi, false);
document.getElementById("moveR").addEventListener("click",  rotateR,  false);
document.getElementById("moveRi") .addEventListener("click", rotateRi, false);
document.getElementById("moveU") .addEventListener("click", rotateU,  false);
document.getElementById("moveUi").addEventListener("click", rotateUi, false);
document.getElementById("moveD") .addEventListener("click", rotateD,  false);
document.getElementById("moveDi").addEventListener("click", rotateDi, false);

/*
  rn all the moves are execing at once, so thats why it gets fucked up
    like we are execing, in the middle of rotation
*/
/*
  just get last move time?
  //last time + 500
    doesnt work, cuz what if there is a large delay in move times
    only works if we spam click

  ALTERNATIVELY
    when a button is pressed, make it so that not other button can be pressed?
    then, for the shuffle and solve methods we use the moveCount method
  sleep?
*/
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, ms);
  });
}
var speed = 150;


function tweenMove(cube, axis, angle){
  const start = { rotation: 0 };
  const prev = { rotation: 0 };
  const end = { rotation: angle};
  const tween = new TWEEN.Tween(start)
    .to(end, speed)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(({ rotation }) => {
      cube.position.applyAxisAngle(axis, rotation - prev.rotation);
      cube.rotateOnWorldAxis(axis, rotation - prev.rotation);
      prev.rotation = rotation;
    });
    tween.start();
}


function executeRotate(axis, angle, coord){
  for(let i =0; i<fullCube.length; i++){
    if(checkCoordSame(fullCube[i],coord,axis)){
      if(axis == 'x'){
        tweenMove(fullCube[i],xAxis,angle);
      }
      if(axis == 'y'){
        tweenMove(fullCube[i],yAxis,angle);
      }
      if(axis == 'z'){
        tweenMove(fullCube[i],zAxis,angle);
      }
    }
  }
}
//cant create another function just for the purpose of stalling, cuz itll exec the other one
/*
  here is the issue:
    i think what we need to do, is create a queue of all the moves that need to get processed
    then animate through the queue?
    cuz rn if a lot of queries are processed at once, they timeout tgt, instead of one after the other

    what if we have a moveCounter * 500?
      we just need times between any adjancent move swaps to be > 
    
      sleep dont work either
        its because we are processing all the moves at once no?
        so theyre sleeping at the same time
    
    shuffle and solve, we use the move counter idea

    i think the problem is that all the functions are called synchronously
    cuz i think for the 'shuffle' 'solve', i can have a move counter for settimeout n itll work
    so itll be like
    i click a button
    disables the rest
    setTimeout, n then reenable all?


*/
function enableAllButtons(){
  document.getElementById("moveF").disabled = false;
  document.getElementById("moveFi").disabled = false;
  document.getElementById("moveB").disabled = false;
  document.getElementById("moveBi").disabled = false;
  document.getElementById("moveL").disabled = false;
  document.getElementById("moveLi").disabled = false;
  document.getElementById("moveR").disabled = false;
  document.getElementById("moveRi").disabled = false;
  document.getElementById("moveU").disabled = false;
  document.getElementById("moveUi").disabled = false;
  document.getElementById("moveD").disabled = false;
  document.getElementById("moveDi").disabled = false;
  document.getElementById("shuffle").disabled = false;
  document.getElementById("solve").disabled = false;
}
function disableAllButtons(time){
  document.getElementById("moveF").disabled = true;
  document.getElementById("moveFi").disabled = true;
  document.getElementById("moveB").disabled = true;
  document.getElementById("moveBi").disabled = true;
  document.getElementById("moveL").disabled = true;
  document.getElementById("moveLi").disabled = true;
  document.getElementById("moveR").disabled = true;
  document.getElementById("moveRi").disabled = true;
  document.getElementById("moveU").disabled = true;
  document.getElementById("moveUi").disabled = true;
  document.getElementById("moveD").disabled = true;
  document.getElementById("moveDi").disabled = true;
  document.getElementById("shuffle").disabled = true;
  document.getElementById("solve").disabled = true;
  setTimeout(enableAllButtons,time);
}

var isBig = 0;
var moveCount = 0;
function rotateF(){
  solver.moveFront(0);
  console.log("F");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'z',-Math.PI/2,1);
  else{
    setTimeout(executeRotate,speed*1.1,'z',-Math.PI/2,1);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateFi(){
  solver.moveFront(1);
  console.log("Fi");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'z',Math.PI/2,1);
  else{
    setTimeout(executeRotate,speed*1.1,'z',Math.PI/2,1);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateB(){
  solver.moveBack(0);
  console.log("B");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'z',Math.PI/2,-1);
  else{
    setTimeout(executeRotate,speed*1.1,'z',Math.PI/2,-1);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateBi(){
  solver.moveBack(1);
  console.log("Bi");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'z',-Math.PI/2,-1);
  else{
    setTimeout(executeRotate,speed*1.1,'z',-Math.PI/2,-1);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateL(){
  solver.moveLeft(0);
  console.log("L");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'x',Math.PI/2,-1);
  else{
    setTimeout(executeRotate,speed*1.1,'x',Math.PI/2,-1);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateLi(){
  solver.moveLeft(1);
  console.log("Li");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'x',-Math.PI/2,-1);
  else{
    setTimeout(executeRotate,speed*1.1,'x',-Math.PI/2,-1);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateR(){
  solver.moveRight(0);
  console.log("R");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'x',-Math.PI/2,1);
  else{
    setTimeout(executeRotate,speed*1.1,'x',-Math.PI/2,1);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateRi(){
  solver.moveRight(1);
  console.log("Ri");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'x',Math.PI/2,1);
  else{
    setTimeout(executeRotate,speed*1.1,'x',Math.PI/2,1);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateU(){
  solver.moveUp(0);
  console.log("U");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'y',-Math.PI/2,1);
  else{
    setTimeout(executeRotate,speed*1.1,'y',-Math.PI/2,1);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateUi(){
  solver.moveUp(1);
  console.log("Ui");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'y',Math.PI/2,1);
  else{
    setTimeout(executeRotate,speed*1.1,'y',Math.PI/2,1);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateD(){
  solver.moveDown(0);
  console.log("D");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'y',Math.PI/2,-1);
  else{
    setTimeout(executeRotate,speed*1.1,'y',Math.PI/2,-1);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateDi(){
  solver.moveDown(1);
  console.log("Di");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'y',-Math.PI/2,-1);
  else{
    setTimeout(executeRotate,speed*1.1,'y',-Math.PI/2,-1);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
// M follows L direction,  E follows D direction, S follows F direction
function rotateM(){
  solver.moveM(0);
  console.log("M");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'x',Math.PI/2,0);
  else{
    setTimeout(executeRotate,speed*1.1,'x',Math.PI/2,0);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateMi(){
  solver.moveM(1);
  console.log("Mi");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'x',-Math.PI/2,0);
  else{
    setTimeout(executeRotate,speed*1.1,'x',-Math.PI/2,0);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateE(){
  solver.moveE(0);
  console.log("E");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'y',Math.PI/2,0);
  else{
    setTimeout(executeRotate,speed*1.1,'y',Math.PI/2,0);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}
function rotateEi(){
  solver.moveE(1);
  console.log("Ei");
  if(isBig) setTimeout(executeRotate,moveCount*speed*1.1,'y',-Math.PI/2,0);
  else{
    setTimeout(executeRotate,speed*1.1,'y',-Math.PI/2,0);
    disableAllButtons(speed*1.1);
  }
  moveCount++;
}

//shuffle and solver
document.getElementById("shuffle").addEventListener("click", randomShuffle, false);
document.getElementById("solve").addEventListener("click", solve, false);
function randomShuffle(){
  var moves = solver.randomScramble();
  moveCount = 1;
  isBig = 1;
  for(let i =0; i<moves.length; i++){
    var [type,f] = moves[i];//frequency
    if(f==0){
      switch(type){
        case 'U': {
          rotateU();
          break;
        }
        case 'D':{
          rotateD();
          break;
        }
        case 'L':{
          rotateL();
          break;
        }
        case 'R':{
          rotateR();
          break;
        }
        case 'F':{
          rotateF();
          break;
        }
        case 'B':{
          rotateB();
          break;
        }
      }
    }
    else if (f==2){
      switch(type){
        case 'U': {
          rotateU();
          rotateU();
          break;
        }
        case 'D':{
          rotateD();
          rotateD();
          break;
        }
        case 'L':{
          rotateL();
          rotateL();
          break;
        }
        case 'R':{
          rotateR();
          rotateR();
          break;
        }
        case 'F':{
          rotateF();
          rotateF();
          break;
        }
        case 'B':{
          rotateB();
          rotateB();
          break;
        }
      }
    }
    else{
      switch(type){
        case 'U': {
          rotateUi();
          break;
        }
        case 'D':{
          rotateDi();
          break;
        }
        case 'L':{
          rotateLi();
          break;
        }
        case 'R':{
          rotateRi();
          break;
        }
        case 'F':{
          rotateFi();
          break;
        }
        case 'B':{
          rotateBi();
          break;
        }
      }
    }
  }
  disableAllButtons(moveCount*speed*1.1);
  isBig = 0;
}
function cornerSwap(){
  rotateR();
  rotateUi();
  rotateRi();
  rotateUi();
  
  rotateR();
  rotateU();
  rotateRi();
  rotateFi();
  
  rotateR();
  rotateU();
  rotateRi();
  rotateUi();

  rotateRi();
  rotateF();
  rotateR();
}
function jPerm(){
  rotateR();
  rotateU();
  rotateRi();
  rotateFi();

  rotateR();
  rotateU();
  rotateRi();
  rotateUi();

  rotateRi();
  rotateF();
  rotateR();
  rotateR();

  rotateUi();
  rotateRi();
  rotateUi();
}
function tPerm(){
  rotateR();
  rotateU();
  rotateRi();
  rotateUi();

  rotateRi();
  rotateF();
  rotateR();
  rotateR();

  rotateUi();
  rotateRi();
  rotateUi();
  rotateR();

  rotateU();
  rotateRi();
  rotateFi();
}

function orientCorner(letter){
  switch(letter){
      case 'b':
          rotateR();
          rotateR();
          break;
      case 'c':
          rotateR();
          rotateR();
          rotateDi();
          break;
      case 'd':
          rotateF();
          rotateF();
          break;
      case 'f':
          rotateFi(); 
          rotateD();
          break;
      case 'g':
          rotateFi();
          break;
      case 'h':
          rotateDi();
          rotateR();
          break;
      case 'i':
          rotateF();
          rotateRi();
          break;
      case 'j':
          rotateRi();
          break;
      case 'k':
          rotateRi();
          rotateDi();
          break;
      case 'l':
          rotateD();
          rotateD();
          rotateR();
          break;
      case 'm':
          rotateF();
          break;
      case 'n':
          rotateRi();
          rotateF();
          break;
      case 'o':
          rotateD();
          rotateD();
          rotateFi();
          break;
      case 'p':
          rotateR();
          rotateF();
          break;
      case 'q':
          rotateR();
          rotateDi();
          break;
      case 's':
          rotateD();
          rotateFi();
          break;
      case 't':
          rotateR();
          break;
      case 'u':
          rotateD();
          break;
      case 'v':
          break;
      case 'w':
          rotateDi();
          break;
      case 'x':
          rotateD();
          rotateD();
          break;
  }
  cornerSwap();
  switch(letter){
      case 'b':
          rotateRi();
          rotateRi();
          break;
      case 'c':
          rotateD();
          rotateRi();
          rotateRi();
          break;
      case 'd':
          rotateFi();
          rotateFi();
          break;
      case 'f':
          rotateDi();
          rotateF();
          break;
      case 'g':
          rotateF();
          break;
      case 'h':
          rotateRi();
          rotateD();
          break;
      case 'i':
          rotateR();
          rotateFi();
          break;
      case 'j':
          rotateR();
          break;
      case 'k':
          rotateD();
          rotateR();
          break;
      case 'l':
          rotateRi();
          rotateDi();
          rotateDi();
          break;
      case 'm':
          rotateFi();
          break;
      case 'n':
          rotateFi();
          rotateR();
          break;
      case 'o':
          rotateF();
          rotateDi();
          rotateDi();
          break;
      case 'p':
          rotateFi();
          rotateRi();
          break;
      case 'q':
          rotateD();
          rotateRi();
          break;
      case 's':
          rotateF();
          rotateDi();
          break;
      case 't':
          rotateRi();
          break;
      case 'u':
          rotateDi();
          break;
      case 'v':
          break;
      case 'w':
          rotateD();
          break;
      case 'x':
          rotateDi();
          rotateDi();
          break;
  }
}
// M follows L direction, E follows D direction, S follows F direction
function orientEdge(letter){
  switch(letter){
      case 'a':
          rotateM();
          rotateM();
          rotateD();
          rotateD();
          rotateM();
          rotateM();
          jPerm();
          rotateMi();
          rotateMi();
          rotateDi();
          rotateDi();
          rotateMi();
          rotateMi();
          break;
      case 'c':
          jPerm();
          break;
      case 'd':
          tPerm();
          break;
      case 'e':
          rotateLi();
          rotateE();
          rotateLi();
          tPerm();
          rotateL();
          rotateEi();
          rotateL();
          break;
      case 'f':
          rotateEi();
          rotateL();
          tPerm();
          rotateLi();
          rotateE();
          break;
      case 'g':
          rotateD();
          rotateMi();
          jPerm();
          rotateM();
          rotateDi();
          break;
      case 'h':
          rotateE();
          rotateLi();
          tPerm();
          rotateL();
          rotateEi();
          break;
      case 'i':
          rotateM();
          rotateM();
          rotateD();
          rotateD();
          rotateMi();
          jPerm();
          rotateM();
          rotateDi();
          rotateDi();
          rotateMi();
          rotateMi();
          break;
      case 'j':
          rotateE();
          rotateE();
          rotateL();
          tPerm();
          rotateLi();
          rotateEi();
          rotateEi();
          break;
      case 'k':
          rotateMi();
          jPerm();
          rotateM();
          break;
      case 'l':
          rotateLi();
          tPerm();
          rotateL();
          break;
      case 'n':
          rotateE();
          rotateL();
          tPerm();
          rotateLi();
          rotateEi();
          break;
      case 'o':
          rotateDi();
          rotateMi();
          jPerm();
          rotateM();
          rotateD();
          break;
      case 'p':
          rotateEi();
          rotateLi();
          tPerm();
          rotateL();
          rotateE();
          break;
      case 'q':
          rotateM();
          jPerm();
          rotateMi();
          break;
      case 'r':
          rotateL();
          tPerm();
          rotateLi();
          break;
      case 's':
          rotateD();
          rotateD();
          rotateMi();
          jPerm();
          rotateM();
          rotateDi();
          rotateDi();
          break;
      case 't':
          rotateE();
          rotateE();
          rotateLi();
          tPerm();
          rotateL();
          rotateEi();
          rotateEi();
          break;
      case 'u':
          rotateDi();
          rotateL();
          rotateL();
          tPerm();
          rotateLi();
          rotateLi();
          rotateD();
          break;
      case 'v':
          rotateD();
          rotateD();
          rotateL();
          rotateL();
          tPerm();
          rotateLi();
          rotateLi();
          rotateDi();
          rotateDi();
          break;
      case 'w':
          rotateD();
          rotateL();
          rotateL();
          tPerm();
          rotateLi();
          rotateLi();
          rotateDi();
          break;
      case 'x':
          rotateL();
          rotateL();
          tPerm();
          rotateLi();
          rotateLi();
          break;
  }
}
function solve(){
  solver.cornersVisited.fill(0);
  solver.edgesVisited.fill(0);
  var cornerMoves = solver.solveCorners();
  moveCount = 1;
  isBig = 1;
  for(let i =0; i<cornerMoves.length; i++){
    var letter = cornerMoves[i];
    orientCorner(letter);
  }
  var edgeMoves = solver.solveEdges();
  for(let i =0; i<edgeMoves.length; i++){
    var letter = edgeMoves[i];
    orientEdge(letter);
  }
  disableAllButtons(moveCount*speed*1.1);
  isBig = 0;
}

/*
  rn moves are kinda ugly
    if two adjacent moves cancel each other out, get rid of them
  
*/
document.getElementById("godSolve").addEventListener("click", apiTest, false);

const url = 'http://localhost:5173/api';
const data = {
  cornerLettering: solver.cornerLettering,
  edgeLettering: solver.edgeLettering
};
function apiTest(){
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(responseData => {
      // Process the response data
      console.log(responseData);
    })
    .catch(error => {
      // Handle any errors
      console.error('Error:', error.message);
    });
}

