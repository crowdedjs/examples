import GoTo from "../behavior/GoTo.js"
import WaitForever from "../behavior/WaitForever.js"

import AssignBed from "../behavior/AssignBed.js";
import AssignComputer from "../behavior/AssignComputer.js";
import responsibility from "./responsibility.js";

class tech {

  constructor(myIndex, agentConstants, locations, start, end) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;
    let goToName = "TechPlace";
    let me= ()=>agentConstants.find(a=>a.id == myIndex);;
       
    let myGoal = locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);
    let computer = locations.find(l => l.name == "TechPlace");



    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    this.tree = builder
      .sequence("Assign")
      .splice(new GoTo(self.index, myGoal.position).tree)
      //.splice(new WaitForever(myIndex, agentConstants, locations).tree)

      // original tree sequence below
      .splice(new AssignBed(myIndex, agentConstants, locations.find(l => l.name == "C1").position).tree) // C1
      .splice(new AssignComputer(myIndex, agentConstants, computer.position).tree) // TechPlace
      .splice(new responsibility(myIndex, agentConstants, locations, start, end).tree) // lazy: true

      .end()
      .build();
  }

  async update(agentConstants, crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default tech;
