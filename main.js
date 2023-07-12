import * as THREE from 'three'
import "./style.css"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import gsap from 'gsap'

const scene = new THREE.Scene()
//z is towards viewer
//y is up
//x is to the right

//shape
const material = new THREE.MeshStandardMaterial({
  color: '#00ffffff',
  vertexColors: THREE.FaceColors
})

for(let z =-1; z<=1; z++){
  for(let y = -1; y<=1; y++){
    for(let x = -1; x<=1; x++){
      var cubeGeometry = new THREE.BoxGeometry(0.97,0.97,0.97)
      var cube = new THREE.Mesh(cubeGeometry,material)
      cube.position.z = z;
      cube.position.y = y;
      cube.position.x = x;

      scene.add(cube)
    }
  }
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
controls.autoRotate = true
controls.autoRotateSpeed = 5 

const loop = () =>{//rerender it, so that the cube is in right position
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

//timeline magic, synchronize multiple animations tgt
const tl = gsap.timeline({defaults: {duration: 1}})//default time duration is 1 second
tl.fromTo(cube.scale, {z:0,x:0,y:0}, {z:1,x:1,y:1})//animation to start; scales all the axis
tl.fromTo('nav', {y: "-100%"}, {y:"0%"})//animates the nav bar in
tl.fromTo('.title', {opacity:0},{opacity:1})//fades in the title

//mouse animation color
let mouseDown = false
let rgb = [12,23,]

window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))//makes it so that changes only happens when we are clicking down
window.addEventListener("mousemove", (e) => {
  if(mouseDown){
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageX / sizes.width) * 255),
      150,
    ]
    //animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(cube.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
  }
})


