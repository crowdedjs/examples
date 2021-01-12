// not fully ported
import AssignPatientToTriageNurse from "../behavior/AssignPatientToTriageNurse.js";
import ComputerAssignPatientRoom from "../behavior/ComputerAssignPatientRoom.js"
import ComputerEnterPatient from "../behavior/ComputerEnterPatient.js";
import ComputerScorePatient from "../behavior/ComputerScorePatient.js";
import GoTo from "../behavior/GoTo.js"
import LookForArrivingPatient from "../behavior/LookForArrivingPatient.js";
import TakeTime from "../behavior/TakeTime.js";
import WaitForever from "../behavior/WaitForever.js"


class greeterNurse {

    constructor(agent, myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

      let self = this;//Since we need to reference this in anonymous functions, we need a reference
      let me = agent;
      let myGoal = me.locations.find(l => l.name == "Check In");
      if (!myGoal) throw new "We couldn't find a location called Check In";
  
      //this.goTo = new GoTo(self.index, myGoal.position);
  
  
  
      this.tree = builder
        .sequence("Greeter Nurse Behaviors")
            .splice(new GoTo(self.index, myGoal.position).tree)
                        
            .splice(new LookForArrivingPatient().tree)

            .splice(new TakeTime(30).tree) // seconds: uniform, 30, 90

            .splice(new ComputerEnterPatient().tree)

            .splice(new TakeTime(30).tree) // seconds: uniform, 30, 60

            .splice(new ComputerScorePatient().tree)

            .splice(new TakeTime(30).tree) // seconds: uniform, 30, 60

            .splice(new ComputerAssignPatientRoom().tree)
            
            .splice(new AssignPatientToTriageNurse().tree)

            .splice(new WaitForever().tree)  
                    
        .end()
        .build();
    }
  
    async update(agentConstants, crowd, msec) {
      this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
      return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }

export default greeterNurse;