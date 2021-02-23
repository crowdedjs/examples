import CrowdSetup from "@crowdedjs/crowd-setup"
import MedicalAgent from "./people/medical-agent.js"
import PatientAgent from "./people/patient-agent.js"
//import CrowdSetup from "./crowd-setup/index.js"
import urlParser from "./url-parser.js"
import colorFunction from "./color-function.js"
import simulations from "./simulations.js"
import HospitalClass from "./support/hospital.js"
import Computer from "./support/computer.js"
import Room from "./support/room.js"
import Vector3 from "@crowdedjs/math"
import axios from "axios"

function boot() {

  //import index from "./crowd-setup/index.js"

  let params = {};

  //Change to the cdn in production
  let assetBase = "./";
  //let assetBase = "https://cdn.jsdelivr.net/npm/@crowdedjs/assets/";

  //Flat hospital removes the walls to speed up debugging
  //params.objPath = assetBase + "objs/hospital-flat.obj";
  params.objPath = assetBase + "objs/hospital.obj";

  //
  params.arrivalPath = assetBase + "arrivals/arrivalHospital.json";
  //params.arrivalPath = "./" + "arrivals/arrivalHospital.json";

  params.locationsPath = "./" + "locations/locationsHospital.json";

  //This does not represent seconds any more
  params.secondsOfSimulation = 300;
  params.millisecondsBetweenFrames = 40;


  params = urlParser(window, params, assetBase);

  //Set these up as global variables
  window.Hospital = HospitalClass;
  window.Vector3 = Vector3;

  //Grab the information about our simulaiton
  let promises = [axios.get(params.objPath), axios.get(params.locationsPath), axios.get(params.arrivalPath)];
  Promise.all(promises)
    .then(results => {
      let objValue = results[0].data;       //Grab the value of the environment 
      let locationValue = results[1].data;  //Grab the value of all the locations
      let arrivalValue = results[2].data;   //Grab the value of all the arrivals

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


      // display a table of computer entries
      var table = document.getElementById("ComputerEntryTable");
      // title row
      var titleRow = table.insertRow(0);
      var titleCell = titleRow.insertCell(0);
      var chiefComplaintCell = titleRow.insertCell(1);
      var takenVitalsCell = titleRow.insertCell(2);
      titleCell.innerHTML = "Computer Entry";
      chiefComplaintCell.innerHTML = "Chief Complaint";
      takenVitalsCell.innerHTML = "Vitals Taken";

      let computerEntries = 0;

      function fillComputerTable() {
        for (let i = 0; i < Hospital.computer.entries.length; i++) {
          // add missing entries to table
          if (Hospital.computer.entries.length > computerEntries) {
            var tempRow = table.insertRow(computerEntries + 1)
            var cell1 = tempRow.insertCell(0);
            var cell2 = tempRow.insertCell(1);
            var cell3 = tempRow.insertCell(2);
            cell1.innerHTML = computerEntries + 1;
            cell2.innerHTML = Hospital.computer.entries[computerEntries].getChiefComplaint();
            cell3.innerHTML = Hospital.computer.entries[computerEntries].getVitals();

            computerEntries++;

            // var tempRow1 = table.insertRow(2)
            // var cell1 = tempRow1.insertCell(0);
            // var cell2 = tempRow1.insertCell(1);
            // var cell3 = tempRow1.insertCell(2);
            // cell1.innerHTML = "temp";
            // cell2.innerHTML = "sample text";
            // cell3.innerHTML = "more sample text";


            // var tempRow2 = table.insertRow(3)
            // var cell1 = tempRow2.insertCell(0);
            // var cell2 = tempRow2.insertCell(1);
            // var cell3 = tempRow2.insertCell(2);
            // cell1.innerHTML = "temp";
            // cell2.innerHTML = "sample text";
            // cell3.innerHTML = "more sample text";

            // var tempRow3 = table.insertRow(4)
            // var cell1 = tempRow3.insertCell(0);
            // var cell2 = tempRow3.insertCell(1);
            // var cell3 = tempRow3.insertCell(2);
            // cell1.innerHTML = "temp";
            // cell2.innerHTML = "sample text";
            // cell3.innerHTML = "more sample text";
          }

          //update existing entries in table
          document.getElementById("ComputerEntryTable").rows[i + 1].cells[1].innerHTML = Hospital.computer.entries[i].getChiefComplaint();
          document.getElementById("ComputerEntryTable").rows[i + 1].cells[2].innerHTML = Hospital.computer.entries[i].getVitals();
        }
        requestAnimationFrame(fillComputerTable);
      }

      fillComputerTable();

      //Show FPS Counter
      //Comment this line if you don't want to show the FPS counter
      // SCORING FUNCTION GRAPH
      //javascript: (function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })()
      var stats = new Stats();
      //AGENTS IN SIMULATION PER FRAME
      var xPanel = stats.addPanel(new Stats.Panel('AGENTS', '#ff8', '#221'));
      //var yPanel = stats.addPanel( new Stats.Panel( 'y', '#f8f', '#212' ) );
      stats.showPanel(2);
      stats.dom.style.position = 'fixed';
      stats.dom.style.float = 'left';
      document.body.appendChild(stats.dom);
      let i = 0;

      // animates a graph that displays the agents in the simulation each frame
      function animate() {
        if (typeof crowdSetup.agentPositions[i] === 'undefined') {
          //console.log("undefined");
        }
        else {
          let agentsIn = 0;
          for (let j = 0; j < crowdSetup.agentPositions[i].length; j++) {
            if (crowdSetup.agentPositions[i][j].inSimulation) {
              agentsIn++;
            }
          }
          //xPanel.update(crowdSetup.agentPositions[i].length);
          xPanel.update(agentsIn);
          i++;
        }

        stats.update();

        requestAnimationFrame(animate);

      }

      animate();

    })
  //This can be commented out for debugging purposes. In production, this should not be commented.
  // .catch(error => {
  //   console.log("Error in the app " + error)
  // })

}

export default boot;