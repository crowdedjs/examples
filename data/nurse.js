import AssignBed from "../behavior/AssignBed.js";
import AssignComputer from "../behavior/AssignComputer.js";
import responsibility from "./responsibility.js";


class nurse {

    constructor(agent, myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
      let me = agent;
      this.tree = builder

      .sequence("Assign")
        .splice(new AssignBed(myIndex, me.locations.find(l => l.name == "Check In")).tree) // C1
        .splice(new AssignComputer(myIndex, me.locations.find(l => l.name == "NursePlace")).tree) // NURSE PLACE
        .splice(new responsibility(me, myIndex, start, end).tree) // LAZY: TRUE
      .end()
      .build();
    }
  
    async update(agentConstants, crowd, msec) {
      //this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
      //return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }

export default nurse;