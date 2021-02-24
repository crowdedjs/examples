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
import axios from "axios"
import setupTable from "./setup-table.js"
import assets from "@crowdedjs/assets"

function boot() {

  let params = {};

  //Change to the cdn in production
  //let assetBase = "./";
  //let assetBase = "https://cdn.jsdelivr.net/npm/@crowdedjs/assets/";

  //Flat hospital removes the walls to speed up debugging
  //params.objPath = assetBase + "objs/hospital-flat.obj";
  //params.objPath = assetBase + "objs/hospital.obj";

 // params.arrivalPath = assetBase + "arrivals/arrivalHospital.json";
  //params.arrivalPath = "./" + "arrivals/arrivalHospital.json";

  //params.locationsPath = "./" + "locations/locationsHospital.json";

  //This does not represent seconds any more
  params.secondsOfSimulation = 300;
  params.millisecondsBetweenFrames = 40;


  params = urlParser(window, params, assetBase);

  //Set these up as global variables
  window.Hospital = HospitalClass;
  window.Vector3 = Vector3;

  //Grab the information about our simulaiton
 // let promises = [axios.get(params.objPath), axios.get(params.locationsPath), axios.get(params.arrivalPath)];
 // Promise.all(promises)
  //  .then(results => {
      let objValue = assets.objs.hospital;       //Grab the value of the environment 
      let locationValue = assets.locations.locationsHospital;  //Grab the value of all the locations
      let arrivalValue = assets.arrivals.arrivalHospital;   //Grab the value of all the arrivals

      let agentConstants = [];  //An array with all the high-level agent information (not the simulation data)
      let locations = [];

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


      setupTable();

  //  })
  //This can be commented out for debugging purposes. In production, this should not be commented.
  // .catch(error => {
  //   console.log("Error in the app " + error)
  // })

}

export default boot;