import * as THREE from '../lib/three.module.js';
import {WhiteMaterial, BlackMaterial, RedMaterial, GreenMaterial, BlueMaterial}  from "./Materials.js"


function AddAxes(scene, geometry){
  //Setup our axes
  let origin = new THREE.Mesh(geometry, WhiteMaterial);
  let xAxis = new THREE.Mesh(geometry, RedMaterial);
  let yAxis = new THREE.Mesh(geometry, GreenMaterial);
  let zAxis = new THREE.Mesh(geometry, BlueMaterial);
  origin.position.set(0, 0, 0);
  xAxis.position.set(1, 0, 0);
  yAxis.position.set(0, 1, 0);
  zAxis.position.set(0, 0, 1);
  scene.add(origin);

  scene.add(xAxis);
  scene.add(yAxis);
  scene.add(zAxis);
}

export default AddAxes;