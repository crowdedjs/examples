import * as THREE from "three"
import task from "./task-thesis.js";

class Hospital{

  static agentConstants;
  static locations;
  static computer;
  static comments = [];
  static CTQueue = [];
  static XRayQueue = [];

  //static CTOccupied = false;
  static CT1Occupied = false;
  static CT2Occupied = false;

  static XRay1Occupied = false;
  static XRay2Occupied = false;

  // doctor = 0, resident = 1, nurse = 2, tech = 3, phlebotomist = 4, imaging = 5
  // IS THE RESIDENT OR ATTENDING THE DOCTOR?
  static aTeam = [];
  static emergencyQueue = [];

  // USING THIS FOR SHIFT CHANGES
  static activeAttending = [];
  static activeCT = [];
  static activeGreeter = [];
  static activeJanitor = [];
  static activeNurse = [];
  static activePharm = [];
  static activePhleb = [];
  static activeRadio = [];
  static activeResident = [];
  static activeTech = [];
  static activeTriage = [];
  static activeXRay = [];
  // USING THIS TO ASSIGN CT ROOMS TO CT AGENTS
  static CT1Agents = 0;
  static CT2Agents = 0;

  // USING THIS FOR AGENT BEHAVIORS
  static greeterTaskList = [];
  static triageTaskList = [];
  static janitorTaskList = [];
  static nurseTaskList = [];
  static techTaskList = [];
  static residentTaskList = [];
  static ctTaskList = [];
  static xrayTaskList = [];
  static radiologyTaskList = [];
  static phlebotomistTaskList = [];
  static pharmacistTaskList = [];
  static attendingTaskList = [];

  static patientData = [];
  static attendingData = [];
  static ctData = [];
  static greeterData = [];
  static janitorData = [];
  static nurseData = [];
  static phlebData = [];
  static radioData = [];
  static residentData = [];
  static techData = [];
  static triageData = [];
  static xrayData = [];

  // returned 60 before? Dr. Ricks said it is locked at 25 fps.
  static getFPS(){return 60;}

  static getCTQueue() {
    return Hospital.CTQueue;
  }
  static setCTQueue(queue) {
    Hospital.CTQueue = queue;
  }

  static getXRayQueue() {
    return Hospital.XRayQueue;
  }
  static setXRayQueue(queue) {
    Hospital.XRayQueue = queue;
  }

  // static isCTOccupied(){
  //   return Hospital.CTOccupied;
  // }
  // static setCTOccupied(occupied){
  //   Hospital.CTOccupied = occupied;
  // }
  static isCT1Occupied() {
    return Hospital.CT1Occupied;
  }
  static isCT2Occupied() {
    return Hospital.CT2Occupied;
  }
  static setCT1Occupied(occupied){
    Hospital.CT1Occupied = occupied;
  }
  static setCT2Occupied(occupied){
    Hospital.CT2Occupied = occupied;
  }

  static isXRay1Occupied() {
    return Hospital.XRay1Occupied;
  }
  static isXRay2Occupied() {
    return Hospital.XRay2Occupied;
  }
  static setXRay1Occupied(occupied) {
    Hospital.XRay1Occupied = occupied;
  }
  static setXRay2Occupied(occupied) {
    Hospital.XRay2Occupied = occupied;
  }

  static getLocationByName(name){
    return this.locations.find(i=>i.getName() == name);

  }

  //From https://threejsfundamentals.org/threejs/lessons/threejs-billboards.html
  makeLabelCanvas(baseWidth, size, name) {
    const borderSize = 2;
    const ctx = document.createElement('canvas').getContext('2d');
    const font =  `${size}px bold sans-serif`;
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

    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, width, height);

    // scale to fit but don't stretch
    const scaleFactor = Math.min(1, baseWidth / textWidth);
    ctx.translate(width / 2, height / 2);
    ctx.scale(scaleFactor, 1);
    ctx.fillStyle = 'white';
    ctx.fillText(name, 0, 0);

    return ctx.canvas;
  }

  // makeLabel(labelWidth, size, name) {
  //   //const ctx = document.createElement('canvas').getContext('2d');
  //   //document.body.appendChild(ctx.canvas);
  //   //ctx.canvas.width = 256;
  //   //ctx.canvas.height = 256;
  //   //ctx.fillStyle = '#FFF';
  //   //ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
  //   const canvas = makeLabelCanvas(labelWidth, size, name);
  //   const texture = new THREE.CanvasTexture(canvas);
  //   texture.minFilter = THREE.LinearFilter;
  //   texture.wrapS = THREE.ClampToEdgeWrapping;
  //   texture.wrapT = THREE.ClampToEdgeWrapping;
  //   const labelMaterial = new THREE.SpriteMaterial({
  //     map: texture,
  //     transparent: true,
  //   });
    
  //   const label = new THREE.Sprite(labelMaterial);
  //   //root.add(label);
  //   label.position.x = 0;
  //   label.position.y = 0;
  //   label.position.z = 0;

  //   // if units are meters then 0.01 here makes size
  //   // of the label into centimeters.
  //   const labelBaseScale = 0.01;
  //   label.scale.x = canvas.width  * labelBaseScale;
  //   label.scale.y = canvas.height * labelBaseScale;

  //   //scene.add(root);
  //   scene.add(label);
  //   return label;
  // }
}

export default Hospital;
