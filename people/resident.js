import GoTo from "../behavior/go-to.js"
import WaitForever from "../behavior/wait-forever.js"

import AssignBed from "../behavior/assign-bed.js";
import AssignComputer from "../behavior/assign-computer.js";
import responsibility from "../behavior/responsibility/responsibility.js";


class resident {

  constructor(myIndex, locations, start, end) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "ResidentStart";
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;

    let myGoal = locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);


    this.tree = builder
      .sequence("Assign")
      .splice(new GoTo(self.index, myGoal.position).tree)
      //.splice(new WaitForever(myIndex, locations).tree)
      
      // original tree sequence below
      .splice(new AssignBed(myIndex, locations.find(l => l.name == "C1").position).tree) // C1
      .splice(new AssignComputer(myIndex, locations.find(l => l.name == "ResidentStart").position).tree) // ResidentStart
      .splice(new responsibility(myIndex, locations, start, end).tree) // lazy: true

      .end()
      .build();
  }

  async update( crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default resident;
