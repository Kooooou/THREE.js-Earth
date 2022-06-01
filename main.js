import './style.css'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import earth from './textures/Earth.png'
import perticleTexture from './textures/plane.png'
const init = function(){
  
  const canvas = document.querySelector("#webGL");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000);

let rot = 0; // rotationの初期化
const directional = new THREE.DirectionalLight(0xffffff);
directional.position.set(500,500,100)
scene.add(directional)
const point = new THREE.PointLight(0xffffff,2,1000);
scene.add(point);
// ヘルパー光源
const helper = new THREE.PointLightHelper(point,10);
scene.add(helper);
const texture = new THREE.TextureLoader();
const earthTexture = texture.load(earth);
const perticleImgae = texture.load(perticleTexture)
// パーティクル作成
let count = 1000;
const vercties = new Float32Array(count * 3);
for(let i = 0; i < count * 3; i++){
vercties[i] = 2000 * (Math.random() - 0.5);
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position',new THREE.BufferAttribute(vercties,3));
const pointsMaterial = new THREE.PointsMaterial({
  color:0xffffff,
  size:5,
  map:perticleImgae,
  depthWrite:false,
})
const perticle = new THREE.Points(geometry,pointsMaterial);
scene.add(perticle);
console.log(vercties)
const material = new THREE.MeshStandardMaterial({
  map:earthTexture,
})
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(300,64,64),
  material,
)
scene.add(sphere);

const clock = new THREE.Clock();
const frameAnime = function () {
  const elapsdTime = clock.getElapsedTime()
  rot += 0.2
  // ラジアン変換
  const radian = (rot * Math.PI) / 180;
  // カメラ制御(周回)
  camera.position.x = 1000 * Math.sin(radian);
  camera.position.z = 1000 * Math.cos(radian);
  camera.lookAt(0,0,-400);
  renderer.render(scene, camera);
  // 光源をオブジェクトの周りを回す
  point.position.set(
    500 * Math.sin(elapsdTime),
    500 * Math.sin(elapsdTime),
    500 * Math.cos(elapsdTime),
  );
  requestAnimationFrame(frameAnime);
};
frameAnime();
const onResize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};
window.addEventListener("resize", onResize);
const control = new OrbitControls(camera,canvas)
}

window.addEventListener('load',init);
