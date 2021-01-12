
import BackAndForth from "./../behavior/BackAndForth.js";
import None from "./../behavior/None.js"
import Agent from "./Agent.js"
import AMedician from "../support/AMedician.js";

import attending from "../data/attending.js"
import ct from "../data/ct.js"
import greeterNurse from "../data/greeterNurse.js"
import janitorial from "../data/janitorial.js"
import nurse from "../data/nurse.js"
import patient from "../data/patient.js"
import radiology from "../data/radiology.js"
import resident from "../data/resident.js"
import tech from "../data/tech.js"
import triageNurse from "../data/triageNurse.js" 


class MedicalAgent extends AMedician {
  startX;
  startY;
  startZ;
  destX;
  destY;
  destZ;
  startMSec;
  inSimulation = false;
  hasEntered = false;
  behavior;

  static index = 0;
  idx; //Corresponds to the internal idx number used by recast

  constructor(agent, locations, location, UUID, medicianType, medicianSubclass, doctorYear, arrivalCount) {
    super(location, UUID, medicianType, medicianSubclass, doctorYear, arrivalCount);
    
    this.name = agent.name;
    this.locations = locations;
    agent.locations = locations;
    this.startMSec = agent.arrivalTick * 25; // We simulate 25 fps
    this.arrivalLocation = agent.arrivalLocation;
    this.age = agent.age;
    this.severity = agent.severity;
    this.patientName = agent.patientName;
    this.gender = agent.gender;
    this.id = agent.id;
    this.patientTempState = undefined;

    let startLocation = locations.find(i => i.name == agent.arrivalLocation);
    if (!startLocation) console.error("Bad starting location " + agent.arrivalLocation);


    this.startX = startLocation.position.x
    this.startY = startLocation.position.y;
    this.startZ = startLocation.position.z;

    this.destX = 0;
    this.destY = 0;
    this.destZ = 0;

    
    

    if (agent.name == "Tech") {
      this.behavior = new BackAndForth(agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
      
      if (agent.type == "Tech")
        this.behavior = new BackAndForth(agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
        //this.behavior = new tech(agent, agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
      else if (agent.type == "CT")
        this.behavior = new BackAndForth(agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
        //this.behavior = new ct(agent, agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
      else if (agent.type == "Janitorial")
        this.behavior = new janitorial(agent, agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
      else if (agent.type == "Radiology")
        this.behavior = new BackAndForth(agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
        //this.behavior = new radiology(agent, agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
      else
        throw new "That tech type does not exist " + agent.type;
    }
    else if (agent.name == "Nurse") {
      this.behavior = new BackAndForth(agent, agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
      
      if (agent.type == "Triage Nurse")
        this.behavior = new BackAndForth(agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
        //this.behavior = new triageNurse(agent, agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
      else if (agent.type == "Nurse")
        this.behavior = new BackAndForth(agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
        //this.behavior = new nurse(agent, agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
      else if (agent.type == "Greeter Nurse")
        this.behavior = new BackAndForth(agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
        //this.behavior = new greeterNurse(agent, agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
      else
        throw new "That nurse type does not exist " + agent.type;
    }
    else if (agent.name == "Attending") {
      this.behavior = new BackAndForth(agent, agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
      
      if (agent.type == "Attending")
        this.behavior = new attending(agent, agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
      else
        throw new "That attending type does not exist " + agent.type;
    }
    else if (agent.name == "Resident") {
      this.behavior = new BackAndForth(agent, agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
      
      if (agent.type == "Resident")
        this.behavior = new BackAndForth(agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
        //this.behavior = new resident(agent, agent.id, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ])
      else
        throw new "That resident type does not exist " + agent.type;
    }
    else {
      throw new "The agent name of " + agent.name + " is not a valid agent name."
    }   
  }


  getStart() { return [this.startX, this.startY, this.startZ]; }

  getEnd() { return [this.destX, this.destY, this.destZ]; }

  setId(i) { this.id = i; }

  getId() { return this.id; }

  getStartMSec() { return this.startMSec; }
  /**
   * If current agent is active, update its newDestination to App() class's update method
   */
  isActive() { return active; }
  setActive(active) { this.active = active; }
  getPatientTempState(){return this.patientTempState;}
}

export default MedicalAgent;