import * as viewer from "./viewer.js"
import simulations from "./simulations.js"
import ControlCreator from "./ControlCreator.js"

//let simulations = [];
let controls;

//Strip behavior definitions out of agents when we serialize them with JSON
//to prevent circular loops.
function replacer(key, value) {
  if (key === 'behavior')
    return undefined;
  return value;
}

let allSimulations = [];
let three = {}
let first = true;



function crowdSetup(objValue, agents, secondsOfSimulation, millisecondsBetweenFrames, locationValue, window, elementParent, drawCallback) {
  let locations;
  let nonce = Math.random();
  console.log(nonce);
  locations = locationValue;
  if (elementParent != null) {
    controls = new ControlCreator(secondsOfSimulation, millisecondsBetweenFrames, simulations, elementParent);
    viewer.boot(three, objValue, locations);

  }
  else {
    first = false;
  }
  let agentPositions = [];

  allSimulations.push(agentPositions);


  main();

  //When we get our first frame, remove the loading div
  function bootCallback() {
    console.log("Boot callback " + nonce);
    document.getElementById("loading").style.visibility = "hidden";
    document.getElementById("divRange").style.visibility = "visible";
  }

  //What we do every time the thread has more information for us
  async function tickCallback(event, nextTick) {
    //console.log("tick callback " + nonce);
    //Parse the new positions
    let positions = JSON.parse(event.data.agents);
    //Assign idx numbers to each agent
    for (let position of positions) {
      agents.find(a => a.id == position.id).idx = position.idx;
    }
    //Add this list of positions to our array of position information
    agentPositions.push(positions);

    //Track the frame number
    let i = event.data.frame;
    console.log("frame " + i + " " + nonce)

    //Three arrays for data we will send to the next simulation frame
    let newAgents = [];
    let newDestinations = [];
    let leavingAgents = [];


    for (let j = 0; j < agents.length; j++) {
      let agent = agents[j]; //Grab each agent in the list

      //See if we need to add the agent to the simulation
      if (!agent.hasEntered && agent.startMSec <= i * millisecondsBetweenFrames) {
        newAgents.push(agent);
        agent.hasEntered = true;
        agent.inSimulation = true;
      }
      else if (agent.hasEntered) {
        //Get the new destination based on the agent's behavior
        let newDestination = await agent.behavior.update(agents, positions, i * millisecondsBetweenFrames);
        //If the new destination is not null, send the updated destination to the 
        //path finding engine
        if (newDestination != null) {
          agent.destX = newDestination.x;
          agent.destY = newDestination.y;
          agent.destZ = newDestination.z;
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
    if (i < secondsOfSimulation * 1_000 / millisecondsBetweenFrames){
      //console.log("Call next " + nonce)
      //If the simulation needs to continue, send on the information 
      //about new agents, agents with new destinations, and agents that have left the simulation
      nextTick([JSON.stringify(newAgents, replacer), JSON.stringify(newDestinations, replacer), JSON.stringify(leavingAgents, replacer)])
    }
    else{
      console.log("Done " + nonce)
    }
  }

  function main() {
    //Boot the viewer
    //Adapt the viewer to the window size
    viewer.Resize(window, three.renderer, three.camera);
    //Start the viewer clock
    if (first)
      setTimeout(tick, 33);

    //bootWorker needs to be included in the calling html file
    //Start the threaded simulator
    bootWorker( objValue, secondsOfSimulation, millisecondsBetweenFrames, locationValue, bootCallback, tickCallback);
  }

  //Respond to the viewer timer
  async function tick() {
    //Update the controls
    controls.update(allSimulations);
    //Draw the view
    draw();
  }

  function draw() {
    //Clear the viewer
    viewer.clearAgents(three);

    for (let x = 0; x < allSimulations.length; x++) {
      let simulationAgents = allSimulations[x];
      //If there is nothing to draw, don't do anything
      //if (agentPositions.length == 0) return setTimeout(tick, 33);
      if (simulationAgents.length == 0) continue;

      //Get the number of the frame we want to see
      let index = controls.getCurrentTick();
      index = Math.min(index, simulationAgents.length - 1);
      //Get the positional data for that frame
      let frame = simulationAgents[index];

      //Add each agent in the frame to the viewer
      for (let j = 0; j < frame.length; j++) {
        let agent = frame[j]; //Grab each agent in the list
        viewer.addAgent(three, agent, agents[j], drawCallback)
      }
    }
    //Render the current frame
    viewer.render(three);
    //Reset the timer
    setTimeout(tick, 33);
  }
  //From https://stackoverflow.com/a/29522050/10047920
  window.addEventListener("resize", () => viewer.Resize(window, three.renderer, three.camera));
}

export default crowdSetup;