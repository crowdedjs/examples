import * as viewer from "./viewer.js"
import simulations from "./simulations.js"
import ControlCreator from "https://cdn.jsdelivr.net/npm/@crowdedjs/controller/controller.js"
import * as THREE from "./lib/three.module.js"
import replacer from "./replacer.js"

//let simulations = [];
let controls;



class CrowdSetup {
  static allSimulations = []; //Static reference to all the simulations we are running
  static firstTicks = [];     //Static reference that tracks if each simulation is in its first frame
  static three = {}           //Static reference to THREE.js

  constructor(floorObj, agentConstants, secondsOfSimulation, millisecondsBetweenFrames, locationValue, window, elementParent) {
    let locations = locationValue; //The named locations in the environment
    this.first = true; //Is this the first tick?
    let self = this;  //Reference to this for use in lambdas

    //Add the html elements if the user passes in a reference for us to attach to.
    if (elementParent != null) {
      //Create the "control" on top that has the play button, etc.
      controls = new ControlCreator(secondsOfSimulation, millisecondsBetweenFrames, simulations, elementParent);
      //Create all the THREE.js view
      viewer.boot(CrowdSetup.three, floorObj, locations);
    }
    else {
      this.first = false;
    }
    let agentPositions = [];

    CrowdSetup.allSimulations.push(agentPositions);
    CrowdSetup.firstTicks.push(-1);
    this.myIndex = CrowdSetup.allSimulations.length - 1;

    main();

    //When we get our first frame, remove the loading div
    function bootCallback() {
      document.getElementById("loading").style.visibility = "hidden";   //Hide the loading div
      document.getElementById("divRange").style.visibility = "visible"; //Show the rest of the simulation
    }

    //What we do every time the thread has more information for us
    async function tickCallback(event, nextTick) {
      if (CrowdSetup.firstTicks[self.myIndex] == -1) { //If the time for this simulation is invalid (-1), then set the current time.
        CrowdSetup.firstTicks[self.myIndex] = new Date();
      }

      //Parse the new frameAgentDetails
      let frameAgentDetails = JSON.parse(event.data.agents);

      //Assign idx numbers to each agent
      for (let frameAgentDetail of frameAgentDetails) {
        agentConstants.find(a => a.id == frameAgentDetail.id).idx = frameAgentDetail.idx;
      }
      //Add this list of frameAgentDetails to our array of position information
      agentPositions.push(frameAgentDetails);

      //Track the frame number
      let i = event.data.frame;

      //Three arrays for data we will send to the next simulation frame
      let newAgents = [];
      let newDestinations = [];
      let leavingAgents = [];

      //Loop through all the agents and update them
      for (let j = 0; j < agentConstants.length; j++) {
        let agent = agentConstants[j]; //Grab each agent in the list

        //See if we need to add the agent to the simulation
        if (!agent.hasEntered && agent.startMSec <= i * millisecondsBetweenFrames) {
          newAgents.push(agent);
          agent.hasEntered = true;
          agent.inSimulation = true;
        }
      }

      //Now update any agents that are in the scene
      for(let j = 0; j < agentConstants.length; j++){
        let agent = agentConstants[j]
        if(newAgents.includes(agent)){
          //Ignore new agents
        }
        else if (agent.hasEntered) {
          //Get the new destination based on the agent's behavior
          let oldDestination = agent.destination;
          //Wait for the behavior update callback
          await agent.behavior.update(agentConstants, frameAgentDetails, i * millisecondsBetweenFrames);
          //If the new destination is not null, send the updated destination to the
          //path finding engine
          if (agent.destination != null && agent.destination != oldDestination) {
            agent.destX = agent.destination.x;
            agent.destY = agent.destination.y;
            agent.destZ = agent.destination.z;
            newDestinations.push(agent);
          }
          //If the agent has left the simulation,
          //Update the simulation
          else if (agent.inSimulation == false) {
            leavingAgents.push(agent);
          }
        }
      }
      //Check to see if we need to end the simulation
      if (i < secondsOfSimulation * 1_000 / millisecondsBetweenFrames) {
        //If the simulation needs to continue, send on the information
        //about new agentConstants, agentConstants with new destinations, and agentConstants that have left the simulation
        nextTick([JSON.stringify(newAgents, replacer), JSON.stringify(newDestinations, replacer), JSON.stringify(leavingAgents, replacer)])
      }
      else {
        console.log("Done with tick callback.")
      }
    }

    function main() {
      //Boot the viewer
      //Adapt the viewer to the window size
      viewer.Resize(window, CrowdSetup.three.renderer, CrowdSetup.three.camera);
      //Start the viewer clock
      if (self.first)
        setTimeout(tick, 33);

      //bootWorker needs to be included in the calling html file
      //Start the threaded simulator
      bootWorker(floorObj, secondsOfSimulation, millisecondsBetweenFrames, locationValue, bootCallback, tickCallback, null);
    }

    //Respond to the viewer timer
    async function tick() {
      //Update the controls
      controls.update(CrowdSetup.allSimulations, CrowdSetup.firstTicks);
      //Draw the view
      draw();
    }

    //Color agents based on their description
    function colorFunction(agentDescription) {
      let color = new THREE.Color(200, 0, 200);
      if (agentDescription.name == "patient") {
        color = new THREE.Color(0, .75, 0);
      }
      else if (agentDescription.name == "Nurse") {
        color = new THREE.Color(.75, .75, .75);
      }
      else if (agentDescription.name == "Attending") {
        color = new THREE.Color(.75, 0, 0);
      }
      else if (agentDescription.name == "Resident") {
        color = new THREE.Color(.75, .75, 0);
      }
      else if (agentDescription.name == "Tech") {
        color = new THREE.Color(0, 0, .75);
      }
      else {
        color = new THREE.Color(0, 0, 0);
      }
      return color;
    }

    function draw() {
      for (let x = 0; x < CrowdSetup.allSimulations.length; x++) {
        let simulationAgents = CrowdSetup.allSimulations[x];
        //If there is nothing to draw, don't do anything
        if (simulationAgents.length == 0) continue;

        //Get the number of the frame we want to see
        let index = controls.getCurrentTick();

        index = simulationAgents.length -1;
        //TODO: Override and always show the last tick.
        //Force look at the current frame
        //Take this line out to use the controls
        index = Math.min(index, simulationAgents.length - 1);


        //Get the positional data for that frame
        let frame = simulationAgents[index];

        //Add new agentConstants
        for (let j = 0; j < frame.length; j++) {
          let agent = frame[j]; //Grab each agent in the list
          if (!CrowdSetup.three.agentGroup.children.some(c => c._id == agent.id)) {
            let agentDescription = agentConstants.find(a => a.id == agent.id);
            viewer.addAgent(CrowdSetup.three, agent, colorFunction(agentDescription))
          }
        }
        //Remove old agentConstants
        let toRemove = [];
        for (let j = 0; j < CrowdSetup.three.agentGroup.children.length; j++) {
          let child = CrowdSetup.three.agentGroup.children[j];
          if (!frame.some(f => f.id == child._id)) {
            toRemove.push(child);
          }
        }
        for (let j = 0; j < toRemove.length; j++) {
          CrowdSetup.three.agentGroup.remove(toRemove[j]);
        }
        //Update remaining agentConstants
        for (let j = 0; j < CrowdSetup.three.agentGroup.children.length; j++) {
          let child = CrowdSetup.three.agentGroup.children[j];
          let agent = frame.find(f => f.id == child._id);
          child.position.set(agent.x, agent.y, agent.z);
          viewer.updateAgent(CrowdSetup.three, agent)
        }
      }
      //Render the current frame
      viewer.render(CrowdSetup.three);
      //Reset the timer
      setTimeout(tick, 33);
    }
    //From https://stackoverflow.com/a/29522050/10047920
    window.addEventListener("resize", () => viewer.Resize(window, CrowdSetup.three.renderer, CrowdSetup.three.camera));
  }
}

export default CrowdSetup;