import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { OrbitControls } from './lib/OrbitControls.js';
import { OBJLoader } from './lib/OBJLoader.js';
import { GLTFLoader } from './lib/GLTFLoader.js';
import { FBXLoader } from 'https://unpkg.com/three/examples/jsm/loaders/FBXLoader.js';



const CylinderGeometry = function () { return new THREE.CylinderGeometry(.2, .2, 1, 8) };
const CylinderGeometryThin = function () { return new THREE.CylinderGeometry(.1, .1, .5, 8) };
const GLTFloader = new GLTFLoader();
//const loader = new FBXLoader();
const clock = new THREE.Clock();

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

const loading = [];
for (let i = 0; i < 20; i++) {
  loading[i] = false;
}

const mixers = [];


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


function boot(three, objValue, locations) {
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


  three.geometry = CylinderGeometryThin();
  //geometryShoulder = new THREE.SphereGeometry(.2, 8, 8);
  //geometryHead = new THREE.SphereGeometry(.2, 8, 8);
  three.canvas = document.getElementById("canv");
  three.renderer = new THREE.WebGLRenderer({
    antialias: false,
    canvas: three.canvas
  })
  three.renderer.setPixelRatio(window.devicePixelRatio);
  three.renderer.shadowMap.enabled = true;
  //three.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  three.raycaster = new THREE.Raycaster();
  three.mouse = new THREE.Vector2();
  three.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
  three.camera.position.set(100, 200, 300);
  three.camera.lookAt(0, 0, 0)
  // camera.lookAt
  three.scene = new THREE.Scene();
  //scene.background = new THREE.Color(0x007fff);

  three.light = new THREE.PointLight(0xffffff);
  three.light.position.set(250, 150, 0);
  three.scene.add(three.light);
  three.scene.add(three.light);
  three.scene.add(three.light);
  var ambientLight = new THREE.AmbientLight(0x555555);
  three.scene.add(ambientLight);

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

  let texture = new THREE.TextureLoader().load("https://cdn.jsdelivr.net/npm/@crowdedjs/assets/images/tex.png");

  // immediately use the texture for material creation
  let material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture
  });
  three.skydomegeo = new THREE.SphereGeometry(500, 32, 32);

  three.skydome = new THREE.Mesh(three.skydomegeo, material);
  three.scene.add(three.skydome);


  three.agentGroup = new THREE.Group();
  three.scene.add(three.agentGroup);

  three.controls = new OrbitControls(
    three.camera, three.renderer.domElement
  );
  three.controls.update();
  loadOBJ(three, objValue);
  addLocations(three, locations);

  three.agentGroup.mixers = [];
  three.agentGroup.animations = [];
  three.agentGroup.positions = [];
  console.log(three.agentGroup)


  const loader = new FBXLoader();

  for (let i = 0; i < 10; i++) {
    loader.load('models/Walking3.fbx', function (object) {

      let mixer = new THREE.AnimationMixer(object);
      mixers.push(mixer);

      const action = mixer.clipAction(object.animations[0]);
      action.play();

      object.traverse(function (child) {

        if (child.isMesh) {

          child.castShadow = true;
          child.receiveShadow = true;

        }

      });
      object.visible = true
      three.scene.add(object);
      object.position.set(1 * i, 0, 0);
      object.scale.set(.01, .01, .01);

    });
  }


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
  //three.scene.remove(three.agentGroup);
  //three.agentGroup = new THREE.Group();
  //three.scene.add(three.agentGroup);
}

function addAgent(three, agent) {
  // if (agent.hasEntered && agent.inSimulation) return;
  // if (!agent.hasEntered) return;

  let url;
  if (agent.gender == "female")
    url = './models/nurseTone' + Math.ceil(Math.random() * 4) + '.glb';
  else if (agent.gender == "male")
    url = './models/doctorTone' + Math.ceil(Math.random() * 4) + '.glb';
  else {
    //update with a gender neutral model?
    if (Math.random() > 0.5)
      url = './models/nurseTone' + Math.ceil(Math.random() * 4) + '.glb';
    else
      url = './models/doctorTone' + Math.ceil(Math.random() * 4) + '.glb';
  }

  //loader.load("./models/Walking2.fbx", function (object) {
  // let mixer = new THREE.AnimationMixer(object);
  // mixers.push(mixer);

  // const action = mixer.clipAction(object.animations[0]);
  // action.play();

  // object.traverse(function (child) {

  //   if (child.isMesh) {

  //     child.castShadow = true;
  //     child.receiveShadow = true;

  //   }

  // });
  // object.visible = true;
  // three.scene.add(object);
  // object.position.set(10, 10, 10);
  // gltf.position.set(agent.x, agent.y, agent.z);
  // //gltf.scale.set(1.0, 0.8 + Math.random() * 0.3, 1.0);
  // three.agentGroup.positions.push([new THREE.Vector3(agent.x, agent.y, agent.z), 0.0]);

  // let mixer = new THREE.AnimationMixer(gltf);
  // mixer.timeScale = 2;
  // three.agentGroup.mixers.push(mixer);
  // // let idleAction = three.agentGroup.mixers[three.agentGroup.mixers.length - 1].clipAction(gltf.animations[0]).play();
  // // let walkAction = three.agentGroup.mixers[three.agentGroup.mixers.length - 1].clipAction(gltf.animations[1]).play();
  // // three.agentGroup.animations.push([idleAction, walkAction]);

  // const action = mixer.clipAction(gltf.animations[0]);
  // action.play();

  // gltf.visible = true;
  // gltf._id = agent.id;

  // three.object1 = gltf;
  // three.agentGroup.children.push(gltf);
  // three.scene.add(gltf);
  // }, undefined, function (error) {
  //   console.error(error)
  // });
}

function updateAgent(three, agent) {
  let loc = three.agentGroup.children.findIndex((child) => child._id == agent.id);

  // Calculate and apply a rotation for the agent based on the direction it is moving in
  let nextPosition = new THREE.Vector3(agent.x, agent.y, agent.z);
  // let previousPosition = three.agentGroup.positions[loc][0];
  // let positionChange = new THREE.Vector3(nextPosition.x - previousPosition.x, nextPosition.y - previousPosition.y, nextPosition.z - previousPosition.z);
  // let nextAngle = (Math.atan2(positionChange.z, positionChange.x));
  // three.agentGroup.children[loc].rotation.y = Math.PI / 2 - nextAngle;
  // three.agentGroup.positions[loc] = [nextPosition, nextAngle];

  // //Weight the idle and walking animations based on the speed of the agent
  // three.agentGroup.animations[loc][0].weight = 1 ;
  //three.agentGroup.animations[loc][1].weight = positionChange.length() * 10;
}

function animate(three) {
  const delta = clock.getDelta();

  if (mixers.length > 0) {
    for (let i = 0; i < mixers.length; i++) {
      let mixer = mixers[i];
      mixer.update(delta);
    }
  }
}

function render(three) {
  if (three.renderer)
    three.renderer.render(three.scene, three.camera)
  animate(three)
  //requestAnimationFrame(render);
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
  boot,
  loadOBJ,
  addLocations,
  clearAgents,
  addAgent,
  updateAgent,
  render
};