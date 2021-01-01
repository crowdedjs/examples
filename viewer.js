import * as THREE from './lib/three.module.js';

import { OrbitControls } from './lib/OrbitControls.js';
import { OBJLoader } from './lib/OBJLoader.js';
import { FBXLoader } from './lib/FBXLoader.js';
import { SkeletonUtils } from './lib/SkeletonUtils.js';
import Vector3 from './behavior/Vector3.js';

import { WhiteMaterial, BlackMaterial, RedMaterial, GreenMaterial, BlueMaterial } from "./view/Materials.js"
import MakeLabelCanvas from "./view/MakeLabelCanvas.js"
import Resize from "./view/Resize.js"
import AddAxes from "./view/AddAxes.js"

const CylinderGeometry = function () { return new THREE.CylinderGeometry(.2, .2, 1, 8) };
const CylinderGeometryThin = function () { return new THREE.CylinderGeometry(.1, .1, .5, 8) };
const clock = new THREE.Clock();


const mixers = [];
const loader = new FBXLoader();
let base;
let allAnimations = [];


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
  three.canvas = document.getElementById("canv");
  three.renderer = new THREE.WebGLRenderer({
    antialias: false,
    canvas: three.canvas
  })
  three.scene = new THREE.Scene();
  three.renderer.setPixelRatio(window.devicePixelRatio);
  three.renderer.shadowMap.enabled = true;
  three.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  three.raycaster = new THREE.Raycaster();
  three.mouse = new THREE.Vector2();
  three.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
  three.camera.position.set(75, 10, 10);

  //Irrelevant since we cann OrbitCamera.target.set later
  //three.camera.lookAt(50, 0, 10)
  three.scene.background = new THREE.Color(0x007fff);
  three.scene.add(three.camera);

  three.light = new THREE.PointLight(0xffffff);
  three.light.position.set(250, 150, 0);
  three.scene.add(three.light);
  var ambientLight = new THREE.AmbientLight(0x333333);
  three.scene.add(ambientLight);



  let texture = new THREE.TextureLoader().load("https://cdn.jsdelivr.net/npm/@crowdedjs/assets/images/tex.png");

  // immediately use the texture for material creation
  let material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture
  });
  three.skydomegeo = new THREE.SphereGeometry(500, 32, 32);

  three.skydome = new THREE.Mesh(three.skydomegeo, material);
  three.scene.add(three.skydome);

  AddAxes(three.scene, three.geometry);


  three.agentGroup = new THREE.Group();

  three.controls = new OrbitControls(
    three.camera, three.renderer.domElement
  );
  three.controls.target.set(50, 0, 10)
  three.controls.update();
  loadOBJ(three, objValue);
  addLocations(three, locations);

  three.agentGroup.mixers = [];
  three.agentGroup.animations = [];
  three.agentGroup.positions = [];
  console.log(three.agentGroup)

  function loadPromise(url) {

    let promise = new Promise((resolve, reject) => {
      loader.load(url, function (result) {
        if (result) {
          resolve(result);
        }
        else
          reject(result);
      })

    })
    return promise;
  }

  let allPromises = [];
  allPromises.push(loadPromise("models/sitting.fbx"));
  allPromises.push(loadPromise("models/Sit To Stand.fbx"));
  allPromises.push(loadPromise("models/Sitting Idle.fbx"));
  allPromises.push(loadPromise("models/Sitting.fbx"));
  allPromises.push(loadPromise("models/Stand To Sit.fbx"));
  allPromises.push(loadPromise("models/Type To Sit.fbx"));
  allPromises.push(loadPromise("models/Typing.fbx"));

  Promise.all(allPromises)
    .then(results => {
      for (let result of results) {
        let mixer = new THREE.AnimationMixer(result);
        mixers.push(mixer);
        const action = mixer.clipAction(result.animations[0]);
        allAnimations.push(result.animations[0]);

        action.play();
      }
      return loadPromise("models/Walking.fbx");
    })
    .then(first => {
      base = first;
      let mixer = new THREE.AnimationMixer(first);
      mixers.push(mixer);

      const action = mixer.clipAction(first.animations[0]);
      allAnimations.push(first.animations[0])
      action.play();

      first.traverse(function (child) {

        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }

      });
      first.visible = false
      first.name = "first"
      three.scene.add(first);
      first.position.set(0, 0, 0);
      first.scale.set(.01, .01, .01);
    })
    .catch(err => {
      console.error("There was an error in the load promise " + err);
    })


  

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

function addAgent(three, agent, agentDescription, color) {

  let object = SkeletonUtils.clone(base);
  let mixer = new THREE.AnimationMixer(object);
  mixers.push(mixer);

  object.traverse(child => {
    if (child.material) {
      child.material = child.material.clone();
    }
  })


  for (let a = 0; a < allAnimations.length; a++) {
    //object.animations.push(base.animations[a].clone())
    object.animations.push(allAnimations[a].clone())
    const action = mixer.clipAction(object.animations[a]);
    action.play();
  }

  //Recolor

  object.children[1].material.color = color;

  let toPushPosition = [new THREE.Vector3(agent.x, agent.y, agent.z), 0.0];
  three.agentGroup.children.push(object)
  three.agentGroup.positions.push(toPushPosition);
  object._id = agent.id;


  object.visible = true
  object.name = "object"
  three.scene.add(object);
  object.position.set(agent.x, agent.y, agent.z);
  object.scale.set(.01, .01, .01);
}

function updateAgent(three, agent) {
  if (!three.agentGroup) return;
  let index = three.agentGroup.children.findIndex((child) => child._id == agent.id);

  // Calculate and apply a rotation for the agent based on the direction it is moving in
  let nextPosition = new THREE.Vector3(agent.x, agent.y, agent.z);
  let previousPosition = three.agentGroup.positions[index][0];
  let positionChange = new THREE.Vector3(nextPosition.x - previousPosition.x, nextPosition.y - previousPosition.y, nextPosition.z - previousPosition.z);
  let nextAngle = (Math.atan2(positionChange.z, positionChange.x));
  three.agentGroup.children[index].rotation.y = Math.PI / 2 - nextAngle;
  three.agentGroup.positions[index] = [nextPosition, nextAngle];

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
  addAgent,
  updateAgent,
  render
};