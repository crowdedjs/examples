import CrowdSetup from "@crowdedjs/crowd-setup"
import MedicalAgent from "./people/old_trees/medical-agent-old.js"
import MedicalAgentThesis from "./people/medical-agent-thesis.js"
import PatientAgent from "./people/old_trees/patient-agent-old.js"
import PatientAgentThesis from "./people/patient-agent-thesis.js"
import urlParser from "./url-parser.js"
import colorFunction from "./color-function.js"
import simulations from "./simulations.js"
import HospitalClass from "./support/hospital.js"
import Computer from "./support/computer.js"
import Room from "./support/room.js"
import Vector3 from "@crowdedjs/math"
import setupTable from "./setup-table.js"
//import assets from "@crowdedjs/assets"
import assets from "./assets/index.js"

function boot() {
  // SIMULATION PARAMETERS - THESE ARE CORRECT!
  let params = {};
  params.secondsOfSimulation = 86400;
  params.millisecondsBetweenFrames = 1000;

  // ADDING STATIC REFERENCES
  window.Hospital = HospitalClass;
  window.Vector3 = Vector3;

  // MUST SET UP OBJ/LOCATIONS/ARRIVALS IN THESE FILES FIRST:
    // examples\src\assets\index.js
    // examples\src\simulations.js 

  // IMPORTS OBJ FILE FOR THE SIMULATED ENVIRONMENT (examples\src\objs)
  let objValue = assets.objs.hospital;
  //let objValue = assets.objs.locationsMinimalObs;
  //let objValue = assets.objs.layoutDifferent;
  //let objValue = assets.objs.flat;


  // IMPORTS THE LOCATION VALUES OF THE FLAG MARKERS DESIGNATING ROOMS AND AREAS (examples\src\assets\locations)
  let locationValue = assets.locations.locationsHospital;
  //let locationValue = assets.locations.locationsMinimal;
  //let locationValue = assets.locations.locationsDifferent;
  //let locationValue = assets.locations.locationsFlat;


  // IMPORTS THE LISTS OF AGENT ARRIVALS; PATIENTS + MEDICAL AGENTS (examples\src\assets\arrivals)
  //let arrivalValue = assets.arrivals.arrivalHospitalTesting;
  //let arrivalValue = assets.arrivals.arrivalHospital;
  let arrivalValue = assets.arrivals.arrivalHospitalFull;


  let agentConstants = [];  //An array with all the high-level agent information (not the simulation data)
  let locations = []; //A list of all the adjusted locations

  //Remove spaces in annotation names
  locationValue.forEach(l => {
    locations.push(new Room(l.position, l.annotationName.toUpperCase().replace(" ", "_"), l.name))
  })

  //Assign the data to the global hospital object
  Hospital.agents = agentConstants;
  Hospital.locations = locations;
  Hospital.computer = new Computer();

  // ADDS BEHAVIOR TREES TO LIST OF AGENTS; BRANCHES BASED ON PATIENT VS MEDICAL AGENT (WHICH BRANCHES FURTHER FROM THERE) 
  arrivalValue.forEach((agent, index) => {
    if (agent.name == "patient")
      agentConstants.push(new PatientAgent(agent, locationValue));
      //agentConstants.push(new PatientAgentThesis(agent, locationValue));
    else
      agentConstants.push(new MedicalAgent(agent, locationValue));
      //agentConstants.push(new MedicalAgentThesis(agent, locationValue));
    //Is this line necessary?
    agentConstants[agentConstants.length - 1].setId(index);
  })



  // STARTS THE SIMULATION
  let crowdSetup = new CrowdSetup(objValue, agentConstants, params.secondsOfSimulation, params.millisecondsBetweenFrames, locationValue, window, document.body, colorFunction, simulations, "./crowd-setup/");

  // THIS SETS UP THE TABLE FIGURE ON THE BOTTOM LEFT OF THE SCREEN
  //setupTable(crowdSetup);

  //  })
  //This can be commented out for debugging purposes. In production, this should not be commented.
  // .catch(error => {
  //   console.log("Error in the app " + error)
  // })

}

export default boot;
