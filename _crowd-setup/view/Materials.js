import * as THREE from '../lib/three.module.js';

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

export {WhiteMaterial, BlackMaterial, RedMaterial, GreenMaterial, BlueMaterial};