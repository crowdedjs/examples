import AMedicalStaff from "./amedical-staff.js";
import EscapePerson from "./escape-person.js";

import greeterNurseThesis from "./greeter-nurse-thesis.js";
import nurseThesis from "./nurse-thesis.js";
import triageNurseThesis from "./triage-nurse-thesis.js";
import janitorialThesis from "./janitorial-thesis.js";
import techThesis from "./tech-thesis.js";
import residentThesis from "./resident-thesis.js";
import ctThesis from "./ct-thesis.js";
import xrayThesis from "./xray-thesis.js";
import radiologyThesis from "./radiology-thesis.js";
import phlebotomistThesis from "./phlebotomist-thesis.js";
import pharmacistThesis from "./pharmacist-thesis.js";
import attendingThesis from "./attending-thesis.js";

class MedicalAgentThesis extends AMedicalStaff {
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
  // SHIFT CHANGE
  replacement = false;
  onTheClock = false;
  idleTime = 0;

  static index = 0;
  idx; //Corresponds to the internal idx number used by recast

  constructor(agent) {
    super(agent.location, agent.id, agent.name, agent.type, agent.doctorYear);
    
    this.name = agent.name;
    this.startMSec = agent.arrivalTick * 25; // We simulate 25 fps
    this.arrivalLocation = agent.arrivalLocation;
    this.age = agent.age;
    this.severity = agent.severity;
    this.patientName = agent.patientName;
    this.gender = agent.gender;
    this.id = agent.id;
    this.patientTempState = undefined;

    let startLocation = Hospital.locations.find(i => i.name == agent.arrivalLocation);
    if (!startLocation) console.error("Bad starting location " + agent.arrivalLocation);


    this.startX = startLocation.location.x
    this.startY = startLocation.location.y;
    this.startZ = startLocation.location.z;

    this.destX = 0;
    this.destY = 0;
    this.destZ = 0;

    
    

    if (agent.name == "Tech") {
      if (agent.type == "Tech")
        this.behavior = new techThesis(agent.id)
      else if (agent.type == "CT")
        this.behavior = new ctThesis(agent.id)
      else if (agent.type == "Janitorial")
        this.behavior = new janitorialThesis(agent.id)
      else if (agent.type == "Phlebotomist")
        this.behavior = new phlebotomistThesis(agent.id)
      else if (agent.type == "Radiology")
        this.behavior = new radiologyThesis(agent.id)
      else if (agent.type == "XRay")
        this.behavior = new xrayThesis(agent.id)
      else
        throw new Exception("That tech type does not exist " + agent.type);
    }
    else if (agent.name == "Nurse") {
      
      if (agent.type == "Triage Nurse")
        this.behavior = new triageNurseThesis(agent.id)
      else if (agent.type == "Nurse")
        this.behavior = new nurseThesis(agent.id)
      else if (agent.type == "Greeter Nurse")
        this.behavior = new greeterNurseThesis(agent.id)
      else
        throw new Exception("That nurse type does not exist " + agent.type);
    }
    else if (agent.name == "Attending") {
      if (agent.type == "Attending")
        this.behavior = new attendingThesis(agent.id)
      else
        throw new "That attending type does not exist " + agent.type;
    }
    else if (agent.name == "Resident") {
      if (agent.type == "Resident")
        this.behavior = new residentThesis(agent.id)
      else
        throw new Exception("That resident type does not exist " + agent.type);
    }
    else if (agent.name == "Pharmacist") {
      if (agent.type == "Pharmacist")
        this.behavior = new pharmacistThesis(agent.id)
      else
        throw new Exception("That pharmacist type does not exist " + agent.type);
    }
    else if (agent.name == "EscapePerson") {
      this.behavior = new EscapePerson(agent.id)
    }
    else {
      throw new Exception("The agent name of " + agent.name + " is not a valid agent name.");
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

export default MedicalAgentThesis;