import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { OBJLoader } from './lib/OBJLoader.js';
//import tex from "./tex.png"
//import * as Stats from "./lib/stats.min.js"

//var stats = new Stats();
//stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
//document.body.appendChild( stats.dom );

const CylinderGeometry = function () { return new THREE.CylinderGeometry(.2, .2, 1, 8) };
const WhiteMaterial = new THREE.MeshStandardMaterial({
  roughness: 0,
  metalness: 0,
  color: 0xffffff,
});
const BlackMaterial = new THREE.MeshStandardMaterial({
  roughness: 0,
  metalness: 0,
  color: 0x000000,
});
const RedMaterial = new THREE.MeshStandardMaterial({
  roughness: 0,
  metalness: 0,
  color: 0xff0000,
});
const GreenMaterial = new THREE.MeshStandardMaterial({
  roughness: 0,
  metalness: 0,
  color: 0x00ff00,
})
const BlueMaterial = new THREE.MeshStandardMaterial({
  roughness: 0,
  metalness: 0,
  color: 0x0000ff,
})


//From https://threejsfundamentals.org/threejs/lessons/threejs-billboards.html
function MakeLabelCanvas(baseWidth, size, name) {
  const borderSize = 2;
  const ctx = document.createElement('canvas').getContext('2d');
  const font = `${size}px bold sans-serif`;
  ctx.font = font;
  // measure how long the name will be
  const textWidth = ctx.measureText(name).width;

  const doubleBorderSize = borderSize * 2;
  const width = baseWidth + doubleBorderSize;
  const height = size + doubleBorderSize;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  // need to set font again after resizing canvas
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  // scale to fit but don't stretch
  const scaleFactor = Math.min(1, baseWidth / textWidth);
  ctx.translate(width / 2, height / 2);
  ctx.scale(scaleFactor, 1);
  ctx.fillStyle = 'white';
  ctx.fillText(name, 0, 0);

  return ctx.canvas;
}

function Resize(window, renderer, camera) {
  let canvas = document.getElementById("canv");
  canvas.style.width = window.innerWidth + "px"
  canvas.style.height = window.innerHeight + "px"
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  renderer.setSize(canvas.width, canvas.height);
  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();
};

function ShowStats() {
  // (function () {
  //   var script = document.createElement('script');
  //   script.onload = function () {
  //     var stats = new Stats();
  //     document.body.appendChild(stats.dom);
  //     requestAnimationFrame(
  //       function loop() {
  //         stats.update();
  //         requestAnimationFrame(loop)
  //       });
  //   };
  //   console.log(stats[0].path)
  //   script.src = stats[0].path;
  //   document.head.appendChild(script);
  // })()
}

function boot(three) {
  three.renderer = {};
  three.raycaster = {};
  three.mouse = {};
  three.camera = {};
  three.scene = {};
  three.group = {};
  three.light = {};
  three.controls = {};
  three.agentGroup = {};
  three.canvas = {};
  three.geometry = {};
  three.object1 = {};
  three.light = {};
  three.skydomegeo = {};
  three.skydone = {};


  three.geometry = CylinderGeometry();
  //geometryShoulder = new THREE.SphereGeometry(.2, 8, 8);
  //geometryHead = new THREE.SphereGeometry(.2, 8, 8);
  three.canvas = document.getElementById("canv");
  three.renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: three.canvas
  })
  three.renderer.setPixelRatio(window.devicePixelRatio);
  three.renderer.shadowMap.enabled = true;
  three.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  three.raycaster = new THREE.Raycaster();
  three.mouse = new THREE.Vector2();
  three.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
  three.camera.position.set(70, 70, 70);
  three.camera.lookAt(0, 0, 0)
  // camera.lookAt
  three.scene = new THREE.Scene();
  //scene.background = new THREE.Color(0x007fff);

  three.light = new THREE.PointLight(0xffffff);
  three.light.position.set(0, 250, 0);
  three.scene.add(three.light);
  var ambientLight = new THREE.AmbientLight(0x111111);
  // scene.add(ambientLight);

  let agent = new THREE.Mesh(three.geometry, WhiteMaterial);
  let agent2 = new THREE.Mesh(three.geometry, RedMaterial);
  let agent3 = new THREE.Mesh(three.geometry, GreenMaterial);
  let agent4 = new THREE.Mesh(three.geometry, BlueMaterial);
  agent.position.set(0, 0, 0);
  agent2.position.set(1, 0, 0);
  agent3.position.set(0, 1, 0);
  agent4.position.set(0, 0, 1);
  three.scene.add(agent);
  three.scene.add(agent2);
  three.scene.add(agent3);
  three.scene.add(agent4);
  three.scene.add(three.camera);

  // let texture = new THREE.TextureLoader().load(tex);
  let texture = new THREE.TextureLoader().load(`./tex.png`);

  // immediately use the texture for material creation
  let material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture
  });
  three.skydomegeo = new THREE.SphereGeometry(500, 32, 32);

  three.skydome = new THREE.Mesh(three.skydomegeo, material);
  three.scene.add(three.skydome);


  three.agentGroup = new THREE.Group();


  three.controls = new OrbitControls(
    three.camera, three.renderer.domElement
  );
  three.controls.update();
}

function loadOBJ(three, path) {
  // OBJ Loading-----------------------------------------
  //TODO: This might be obscelete
  function loadModel() {
    three.scene.add(three.object1);
  }

  var manager = new THREE.LoadingManager(loadModel);

  three.object1 = new OBJLoader(manager).parse(path);
  three.scene.add(three.object1);
}

function addLocations(three, locations) {
  for (let location of locations) {
    //Put a cylinder where the room markers are
    // console.log(location.position);
    let x = location.position.x;
    let y = location.position.y;
    let z = location.position.z;
    let tag = new THREE.Mesh(three.geometry, WhiteMaterial);
    tag.position.set(x, y, z);
    three.scene.add(tag);

    //Add a billboard texture above the markers
    const canvas = MakeLabelCanvas(150, 32, location.name);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    const labelMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    });
    const label = new THREE.Sprite(labelMaterial);
    const labelBaseScale = 0.01;
    label.position.y = 1.2;
    label.position.x = location.position.x;
    label.position.z = location.position.z;
    label.scale.x = canvas.width * labelBaseScale;
    label.scale.y = canvas.height * labelBaseScale;
    three.scene.add(label);
  }
}

function clearAgents(three) {
  three.scene.remove(three.agentGroup);
  three.agentGroup = new THREE.Group();
  three.scene.add(three.agentGroup);
}

function addAgent(three, agent, agentDefintion, materialCallback) {
  let materialString = materialCallback(agent);
  let material;
  if (materialString == "white")
    material = this.WhiteMaterial;
  else
    material = this.BlackMaterial;
  if (agent.hasEntered && !agent.inSimulation) return;
  if (!agent.hasEntered) return;

  let geometry = CylinderGeometry();

  let agentMesh = new THREE.Mesh(geometry, material);
  let x = agent.x;
  let y = agent.y;
  let z = agent.z;
  agentMesh.position.set(x, y, z);
  three.agentGroup.add(agentMesh);
}

function render(three) {
  if (three.renderer)
    three.renderer.render(three.scene, three.camera)
}

export {
  CylinderGeometry,
  WhiteMaterial,
  BlackMaterial,
  RedMaterial,
  GreenMaterial,
  BlueMaterial,
  MakeLabelCanvas,
  Resize,
  ShowStats,
  boot,
  loadOBJ,
  addLocations,
  clearAgents,
  addAgent,
  render
};