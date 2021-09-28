import CrowdSetup from "@crowdedjs/crowd-setup"
import MedicalAgent from "./people/medical-agent.js"
import PatientAgent from "./people/patient-agent.js"
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
  //Setup simulation parameters
  let params = {};
  params.secondsOfSimulation = 86400;
  params.millisecondsBetweenFrames = 1000;


  //Add static references

  window.Hospital = HospitalClass;
  window.Vector3 = Vector3;

  let objValue = assets.objs.hospital;       //Grab the value of the environment 
  let locationValue = assets.locations.locationsHospital;  //Grab the value of all the locations
  //let arrivalValue = assets.arrivals.arrivalHospitalTesting;   //Grab the value of all the arrivals
  //let arrivalValue = assets.arrivals.arrivalHospital;
  let arrivalValue = assets.arrivals.arrivalHospitalThesis;

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

  //Add an agent with a behavior and an id
  arrivalValue.forEach((agent, index) => {
    if (agent.name == "patient")
      agentConstants.push(new PatientAgent(agent, locationValue));
    else
      agentConstants.push(new MedicalAgent(agent, locationValue));
    //Is this line necessary?
    agentConstants[agentConstants.length - 1].setId(index);
  })



  //Start the simulation.
  let crowdSetup = new CrowdSetup(objValue, agentConstants, params.secondsOfSimulation, params.millisecondsBetweenFrames, locationValue, window, document.body, colorFunction, simulations, "./crowd-setup/");


  setupTable(crowdSetup);

  //  })
  //This can be commented out for debugging purposes. In production, this should not be commented.
  // .catch(error => {
  //   console.log("Error in the app " + error)
  // })

}

export default boot;