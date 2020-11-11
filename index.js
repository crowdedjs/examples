import * as viewer from "./viewer.js"
import simulationFile from "./simulations.js"
import ControlCreator from "./ControlCreator.js"

import bootWorker from "./node_modules/@crowdedjs/worker/index.js"


let simulations = [];
let controls;

function replacer(key, value) {
  if (key === 'behavior')
    return undefined;
  return value;
}

function crowdSetup(objValue, agents, secondsOfSimulation, millisecondsBetweenFrames, locationValue, window, drawCallback) {
  controls = new ControlCreator(secondsOfSimulation, millisecondsBetweenFrames);
  let agentPositions = [];

  viewer.ShowStats(); //Comment this line to remove the FPS viewer
  let locations;

  locations = locationValue;
  let timerID = 0;
  let three = {}
  simulations = simulationFile;
  console.log(simulations)
  main();

  function bootCallback() {
    document.getElementById("loading").style.visibility = "hidden";
    document.getElementById("divRange").style.visibility = "visible";
  }

  async function tickCallback(event, nextTick) {
    let positions = JSON.parse(event.data.agents);
    for (let position of positions) {
      agents.find(a => a.id == position.id).idx = position.idx;
    }
    agentPositions.push(positions);

    let i = event.data.frame;
    let newAgents = [];
    let newDestinations = [];
    let leavingAgents = [];

    let stop = agents.length;
    for (let j = 0; j < stop; j++) {
      let agent = agents[j]; //Grab each agent in the list

      //See if we need to add the agent to the simulation
      if (!agent.hasEntered && agent.startMSec <= i * millisecondsBetweenFrames) {
        newAgents.push(agent);
        agent.hasEntered = true;
        agent.inSimulation = true;
      }
      else if (agent.hasEntered) {
        let newDestination = await agent.behavior.update(agents, positions, i * millisecondsBetweenFrames);
        if (newDestination != null) {
          agent.destX = newDestination.x;
          agent.destY = newDestination.y;
          agent.destZ = newDestination.z;
          newDestinations.push(agent);
        }
        else if (agent.inSimulation == false) {
          leavingAgents.push(agent);
        }
      }
    }
    if (i < secondsOfSimulation * 1_000 / millisecondsBetweenFrames)
      nextTick([JSON.stringify(newAgents, replacer), JSON.stringify(newDestinations, replacer), JSON.stringify(leavingAgents, replacer)])
  }

  function main() {
    viewer.boot(three);
    viewer.loadOBJ(three, objValue)
    viewer.addLocations(three, locations);
    viewer.Resize(window, three.renderer, three.camera);
    timerID = setTimeout(tick, 33);
    
    bootWorker(objValue, secondsOfSimulation, millisecondsBetweenFrames, locationValue, bootCallback, tickCallback);
  }

  async function tick() {
    let state = controls.getPlayState();
    let speed = controls.getPlaySpeed();
    let advance = state * speed;
    let currentIndex = controls.getCurrentTick();
    let newIndex = currentIndex + advance;
    if (newIndex < 0) {
      newIndex = 0;
    }
    if (newIndex >= agentPositions.length)
      newIndex = agentPositions.length - 1;
    controls.setTick(newIndex);

    controls.update(agentPositions.length, secondsOfSimulation);

    draw();
  }

  function draw() {
    viewer.clearAgents(three);

    if (agentPositions.length == 0) return timerID = setTimeout(tick, 33);

    let index = controls.getCurrentTick();
    index = Math.min(index, agentPositions.length - 1);
    let frame = agentPositions[index];

    for (let j = 0; j < frame.length; j++) {
      let agent = frame[j]; //Grab each agent in the list
      viewer.addAgent(three, agent, agents[j], drawCallback)
    }
    viewer.render(three);
    timerID = setTimeout(tick, 33);
  }
  //From https://stackoverflow.com/a/29522050/10047920
  window.addEventListener("resize", () => viewer.Resize(window, three.renderer, three.camera));
}

export default crowdSetup;