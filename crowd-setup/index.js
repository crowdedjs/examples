import * as viewer from "./viewer.js"
// import ControlCreator from "https://cdn.jsdelivr.net/npm/@crowdedjs/controller/controller.js"
import ControlCreator from "./control-creator.js"
import replacer from "./replacer.js"
function VectorEquals(one, two) {
  if (!one || !two) return false;
  return one.x == two.x && one.y == two.y && one.z == two.z;
}

class CrowdSetup {
  static allSimulations = []; //Static reference to all the simulations we are running
  static firstTicks = [];     //Static reference that tracks if each simulation is in its first frame
  static three = {}           //Static reference to THREE.js

  constructor(floorObj, agentConstants, secondsOfSimulation, millisecondsBetweenFrames, locationValue, window, elementParent, colorFunction, simulations, assetURL) {
    let locations = locationValue;  //The named locations in the environment
    this.first = true;              //Is this the first tick?
    let self = this;                //Reference to this for use in lambdas
    this.controls = {};
    let done = false;
    let nurseSim = false;
    let sentinelAgent;

    //Add the html elements if the user passes in a reference for us to attach to.
    if (elementParent != null) {
      //Create the "control" on top that has the play button, etc.
      this.controls = new ControlCreator(secondsOfSimulation, millisecondsBetweenFrames, simulations, elementParent);
      //Create all the THREE.js view

      viewer.boot(CrowdSetup.three, floorObj, locations, assetURL);
    }
    else {
      this.first = false;
    }

    this.agentPositions = [];  //List of agent positions at a given frame. This becomes an array of arrays
    let agentPositionsRef = this.agentPositions;

    CrowdSetup.allSimulations.push(this.agentPositions);       //Initialize the agent position tracking
    CrowdSetup.firstTicks.push(-1);                       //Set the time this simulation started to -1 (flag meaning no data has been calculated)
    this.myIndex = CrowdSetup.allSimulations.length - 1;  //The index of this simulation (useful when we run multiple simulations)

    main(); //Start simulation process

    //When we get our first frame, remove the loading div

    //What we do every time the thread has more information for us
    async function tickCallback(event, nextTick) {
      if (CrowdSetup.firstTicks[self.myIndex] == -1) {    //If the time for this simulation is invalid (-1), then set the current time.
        CrowdSetup.firstTicks[self.myIndex] = new Date(); //Set the time to the current Time
      }

      //Parse the new frameAgentDetails
      let frameAgentDetails = JSON.parse(event.data.agents);

      frameAgentDetails.forEach(frameAgentDetail => {
        agentConstants.find(a => a.id == frameAgentDetail.id).idx = frameAgentDetail.idx; //Assign idx numbers to each agent
      });

      agentPositionsRef.push(frameAgentDetails); //Add this list of frameAgentDetails to our array of position information

      let i = event.data.frame;//Track the frame number

      let newAgents = [];       //The list of agents that get added
      let newDestinations = []; //The list of agents that have updated their destination (the nav mesh should calculate new routes)
      let leavingAgents = [];   //The list of agent that have left the simulation (RecastDetour should remove them)

      //Loop through all the agents and update them
      agentConstants.forEach(agent => {
        //See if we need to add the agent to the simulation
        if (!agent.hasEntered && agent.startMSec <= i * millisecondsBetweenFrames) {
          //if (agent.id < 8) {
            newAgents.push(agent);
            agent.hasEntered = true;
            agent.inSimulation = true;
          //}
        }
      })

      //Now update any agents that are in the scene
      for (let j = 0; j < agentConstants.length; j++) {
        let agent = agentConstants[j]
        if(!agent.inSimulation) continue;
        if (newAgents.includes(agent)) { } //Ignore new agents
        else if (agent.hasEntered) {
          let oldDestination = agent.destination; //Get the new destination based on the agent's behavior

          //Wait for the behavior update callback
          let instance = undefined;
          for (let i = 0; i < frameAgentDetails.length; i++) {
            if (frameAgentDetails[i].idx == agent.idx)
              instance = frameAgentDetails[i];
          }
          //let ins = frameAgentDetails.filter(q=>q.idx == agent.idx)
          agent.location = {};
          [agent.location.x, agent.location.y, agent.location.z] = [instance.x, instance.y, instance.z];
          
          if (self.sentinelAgent === undefined && agent.medicalStaffSubclass == "Nurse") {
            self.sentinelAgent = agent;
          }
          await agent.behavior.update(agentConstants, frameAgentDetails, i * millisecondsBetweenFrames); //HERE

          //If the new destination is not null, send the updated destination to the
          //path finding engine
          if (agent.destination != null && !VectorEquals(agent.destination, oldDestination)) {
            [agent.destX, agent.destY, agent.destZ] = [agent.destination.x, agent.destination.y, agent.destination.z];
            newDestinations.push(agent);
          }
          //If the agent has left the simulation,
          //Update the simulation
          else if (agent.inSimulation == false) {
            leavingAgents.push(agent);
          }
        }
      }

      if (self.sentinelAgent !== undefined && self.sentinelAgent.behavior.checkEndOfSimulation()) {
        done = true;
      }

      //Check to see if we need to end the simulation
      if (nurseSim && done && !self.sentinelAgent.behavior.checkEndOfSimulation()) {
        console.log("Done with tick callback.")
      } else if (!nurseSim && i > secondsOfSimulation * 1_000 / millisecondsBetweenFrames) { 
        console.log("Done with tick callback.")
      } else {
        //If the simulation needs to continue, send on the information
        //about new agentConstants, agentConstants with new destinations, and agentConstants that have left the simulation
        nextTick([JSON.stringify(newAgents, replacer), JSON.stringify(newDestinations, replacer), JSON.stringify(leavingAgents, replacer)])
      }
    }


    function main() {
      viewer.Resize(window, CrowdSetup.three.renderer, CrowdSetup.three.camera); //Boot the viewer

      if (self.first) //Start the viewer clock
        setTimeout(tick, 33);

      //Start the threaded simulator
      bootWorker(floorObj, secondsOfSimulation, millisecondsBetweenFrames, locationValue, self.bootCallback, tickCallback, null);
    }

    async function tick() {
      self.controls.update(CrowdSetup.allSimulations, CrowdSetup.firstTicks);  //Update the controls
      draw(); //Draw the view
    }

    function draw() {
      CrowdSetup.allSimulations.forEach(simulationAgents => {
        if (simulationAgents.length == 0) return; //If there is nothing to draw, don't do anything
        if (!viewer.hasBooted()) return;

        let index = self.controls.getCurrentTick(); //Get the number of the frame we want to see

        //TODO: Override and always show the last tick.
        //Force look at the current frame
        //Use this line to use the controls
        //index = simulationAgents.length - 1;

        //Use this line to respond to the actual controls
        index = Math.min(index, simulationAgents.length - 1);

        let frame = simulationAgents[index]; //Get the positional data for that frame

        //Add new agents to the viewer
        frame.forEach(agent => {
          if (!CrowdSetup.three.agentGroup.children.some(c => c._id == agent.id)) {
            let agentDescription = agentConstants.find(a => a.id == agent.id);
            viewer.addAgent(CrowdSetup.three, agent, colorFunction(agentDescription))
          }
        });

        //Remove old agents
        let toRemove = [];
        CrowdSetup.three.agentGroup.children.forEach(child => {
          if (!frame.some(f => f.id == child._id)) {
            toRemove.push(child);
            CrowdSetup.three.agentGroup.remove(child);
          }
        });

        //Update remaining agentConstants
        for (let j = 0; j < CrowdSetup.three.agentGroup.children.length; j++) {
          let child = CrowdSetup.three.agentGroup.children[j];
          let agent = frame.find(f => f.id == child._id);
          if(!agent) continue;
          child.position.set(agent.x, agent.y, agent.z);
          viewer.updateAgent(CrowdSetup.three, agent)
        }
      });

      viewer.render(CrowdSetup.three); //Render the current frame

      setTimeout(tick, 33);//Reset the timer
    }
    window.addEventListener("resize", () => viewer.Resize(window, CrowdSetup.three.renderer, CrowdSetup.three.camera));
  }
  bootCallback() {
    document.getElementById("loading").style.visibility = "hidden";   //Hide the loading div
    document.getElementById("divRange").style.visibility = "visible"; //Show the rest of the simulation
  }

}

export default CrowdSetup;