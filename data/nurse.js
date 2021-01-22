import AssignBed from "../behavior/AssignBed.js";
import AssignComputer from "../behavior/AssignComputer.js";
import responsibility from "./responsibility.js";


class nurse {

    constructor(myIndex, agentConstants, locations, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
      let me= ()=>agentConstants.find(a=>a.id == myIndex);
      
      let computer =  locations.find(l => l.name == "NursePlace");
      this.tree = builder

      .sequence("Assign")
        .splice(new AssignBed(myIndex, agentConstants, locations.find(l => l.name == "C1").position).tree) // C1
        .splice(new AssignComputer(myIndex, agentConstants, computer.position).tree) // NURSE PLACE
        .splice(new responsibility(myIndex, agentConstants, start, end).tree) // LAZY: TRUE
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