// not fully ported
import AssignPatientToTriageNurse from "../behavior/assign-patient-to-triage-nurse.js";
import ComputerAssignPatientRoom from "../behavior/computer-assign-patient-room.js"
import ComputerEnterPatient from "../behavior/computer-enter-patient.js";
import ComputerScorePatient from "../behavior/computer-score-patient.js";
import GoTo from "../behavior/go-to.js"
import LookForArrivingPatient from "../behavior/look-for-arriving-patient.js";
import TakeTime from "../behavior/take-time.js";
import WaitForever from "../behavior/wait-forever.js"


class greeterNurse {

    constructor(myIndex, locations, start, end) {
      this.index = myIndex;
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

      let self = this;//Since we need to reference this in anonymous functions, we need a reference
      let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;
      let myGoal = locations.find(l => l.name == "Check In");
      if (!myGoal) throw new Exception("We couldn't find a location called Check In");
  
      //this.goTo = new GoTo(self.index, myGoal.position);
  
  
  
      this.tree = builder
        .sequence("Greeter Nurse Behaviors")
            .splice(new GoTo(self.index, myGoal.position).tree)
                        
            .splice(new LookForArrivingPatient(myIndex, locations).tree)

            .splice(new TakeTime(30, 90).tree) // seconds: uniform, 30, 90

            .splice(new ComputerEnterPatient(myIndex, locations).tree)

            .splice(new TakeTime(30, 60).tree) // seconds: uniform, 30, 60

            .splice(new ComputerScorePatient(myIndex, locations).tree)

            .splice(new TakeTime(30, 60).tree) // seconds: uniform, 30, 60

            .splice(new ComputerAssignPatientRoom(myIndex, locations).tree)
            
            .splice(new AssignPatientToTriageNurse(myIndex, locations).tree)

            .splice(new WaitForever(myIndex, locations).tree)  
                    
        .end()
        .build();
    }
  
    async update( crowd, msec) {
      //this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ crowd, msec }) //Call the behavior tree
      //return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }

export default greeterNurse;