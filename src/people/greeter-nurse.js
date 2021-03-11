import AssignPatientToTriageNurse from "../behavior/assign-patient-to-triage-nurse.js";
import ComputerAssignPatientRoom from "../behavior/computer-assign-patient-room.js"
import ComputerEnterPatient from "../behavior/computer-enter-patient.js";
import ComputerScorePatient from "../behavior/computer-score-patient.js";
import GoTo from "../behavior/go-to.js"
import LookForArrivingPatient from "../behavior/look-for-arriving-patient.js";
import TakeTime from "../behavior/take-time.js";
import WaitForever from "../behavior/wait-forever.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



class greeterNurse {

    constructor(myIndex) {
      this.index = myIndex;
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

      let self = this;//Since we need to reference this in anonymous functions, we need a reference
      let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;
      let myGoal = Hospital.locations.find(l => l.name == "Check In");
      if (!myGoal) throw new Exception("We couldn't find a location called Check In");
  
      //this.goTo = new GoTo(self.index, myGoal.location);
  
  
  
      this.tree = builder
        .sequence("Greeter Nurse Behaviors")
            .splice(new GoTo(self.index, myGoal.location).tree)
            
            // distance here doesn't work. Finds and enters patients before their model is even in the simulation.
            .splice(new LookForArrivingPatient(myIndex).tree)

            .splice(new TakeTime(30, 90).tree) // seconds: uniform, 30, 90

            // enters patient before they're in simulation physically, which could likely be fixed by fixing the arriving patient behavior
            .splice(new ComputerEnterPatient(myIndex).tree)

            .splice(new TakeTime(30, 60).tree) // seconds: uniform, 30, 60

            .splice(new ComputerScorePatient(myIndex).tree)

            .splice(new TakeTime(30, 60).tree) // seconds: uniform, 30, 60

            .splice(new ComputerAssignPatientRoom(myIndex).tree)
            
            // pretty sure the greeter nurse is overwriting the patients assigned, causing the first patient to not go with the triage nurse
            .untilFail("Assign Patient to Triage Nurse successfully")
              .inverter("invert result")            
                .splice(new AssignPatientToTriageNurse(myIndex).tree)
              .end()
            .end()

            //.splice(new WaitForever(myIndex).tree)
                    
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