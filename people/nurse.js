import responsibility from "../behavior/responsibility/responsibility.js";
import GoTo from "../behavior/go-to.js";
import AssignComputer from "../behavior/assign-computer.js"


class nurse {

    constructor(myIndex, locations, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
      let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
      
      let goToName = "NursePlace";
      let myGoal = locations.find(l => l.name == goToName);
      let computer =  locations.find(l => l.name == "NursePlace");
      this.tree = builder

      .sequence("Assign Nurse")
        .splice(new GoTo(self.index, myGoal.position).tree)
        //.splice(new AssignBed(myIndex, locations.find(l => l.name == "C1").position).tree) // C1
        .splice(new AssignComputer(myIndex, computer.position).tree) // NURSE PLACE
        .splice(new responsibility(myIndex, locations, start, end).tree) // LAZY: TRUE
      .end()
      .build();
    }
  
    async update( crowd, msec) {
      //this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ crowd, msec }) //Call the behavior tree
      //return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }

export default nurse;