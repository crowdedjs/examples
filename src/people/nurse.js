import responsibility from "../../behavior/responsibility/responsibility.js";
import GoTo from "../../behavior/go-to.js";
import AssignComputer from "../../behavior/assign-computer.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



class nurse {

    constructor(myIndex) {
      this.index = myIndex;
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
      let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
      
      let goToName = "NursePlace";
      let myGoal = Hospital.locations.find(l => l.name == goToName);
      let computer =  Hospital.locations.find(l => l.name == "NursePlace");
      this.tree = builder

      .sequence("Assign Nurse")
        .splice(new GoTo(self.index, myGoal.location).tree)
        .splice(new AssignComputer(myIndex, computer.location).tree) // NURSE PLACE
        .splice(new responsibility(myIndex).tree) // LAZY: TRUE
      .end()
      .build();
    }
  
    async update( crowd, msec) {
      //this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ crowd, msec }) //Call the behavior tree
      //return this.toReturn; //Return what the behavior tree set the return value to
    }

    checkEndOfSimulation() {
      if (self.Hospital.computer.entries.length > 0) {
        return self.Hospital.computer.entries[0].unacknowledged("NurseEscortPatientToExit");
      }
      return false;
    }
  
  }

export default nurse;