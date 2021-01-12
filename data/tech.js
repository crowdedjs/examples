import GoTo from "../behavior/GoTo.js"
import WaitForever from "../behavior/WaitForever.js"

import AssignBed from "../behavior/AssignBed.js";
import AssignComputer from "../behavior/AssignComputer.js";
import responsibility from "./responsibility.js";

class tech {

  constructor(agent, myIndex, start, end) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;
    let goToName = "TechPlace";
    let me = agent;
       
    let myGoal = me.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);


    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    this.tree = builder
      // how to set to repeat?
      .sequence("Assign")
      .splice(new GoTo(self.index, myGoal.position).tree)
      .splice(new WaitForever(myIndex).tree)

      // original tree sequence below
      .splice(new AssignBed().tree) // C1
      .splice(new AssignComputer().tree) // TechPlace
      .splice(new responsibility().tree) // lazy: true

      .end()
      .build();
  }

  async update(agentConstants, crowd, msec) {
    this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
    return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default tech;
