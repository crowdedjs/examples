import AssignPatientToTriageNurse from "../../behavior/assign-patient-to-triage-nurse-old.js";
import ComputerAssignPatientRoom from "../../behavior/computer-assign-patient-room.js"
import ComputerEnterPatient from "../../behavior/computer-enter-patient.js";
import ComputerScorePatient from "../../behavior/computer-score-patient.js";
import GoTo from "../../behavior/go-to.js"
import LookForArrivingPatient from "../../behavior/look-for-arriving-patient.js";
import TakeTime from "../../behavior/take-time.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



class greeterNurse {

    constructor(myIndex) {
      this.index = myIndex;
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

      let self = this;//Since we need to reference this in anonymous functions, we need a reference
      let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
      let myGoal = Hospital.locations.find(l => l.name == "Check In");
      if (!myGoal) throw new Exception("We couldn't find a location called Check In");
  
      //this.goTo = new GoTo(self.index, myGoal.location);
      let numRequiredToFail = 1;
      let numRequiredToSucceed = 2;

      this.tree = builder
        .sequence("Greeter Nurse Behaviors")
          
          .selector("Check for arrival")  
            .condition("Clock in", async (t) => me().onTheClock)
            .do("SHIFT CHANGE", (t) => {
              // SHIFT CHANGE
              if (me().onTheClock == false) {
                me().onTheClock = true;
                Hospital.activeGreeter.push(me());
                if (Hospital.activeGreeter[0] != me() && Hospital.activeGreeter.length > 1) {
                  for (let i = 0; i < Hospital.activeGreeter.length; i++) {
                    if (!Hospital.activeGreeter[i].replacement) {
                      Hospital.activeGreeter[i].replacement = true;
                      //Hospital.activeGreeter.shift();
                      Hospital.activeGreeter.splice(i, 1);
                      break;
                    }
                  }
                }
              }
              
              return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
        .end()

        // SHIFT CHANGE SEQUENCE OF BEHAVIORS
        .selector("Check for Replacement")
          .condition("Replacement is Here", async (t) => !me().replacement)
          .sequence("Exit Procedure")
            .splice(new GoTo(self.index, Hospital.locations.find(l => l.name == "Main Entrance").location).tree)
            .do("Leave Simulation", (t) => {
              me().inSimulation = false;
              return fluentBehaviorTree.BehaviorTreeStatus.Running;
            })
          .end()
        .end()

        .splice(new GoTo(self.index, myGoal.location).tree)

          // waits for patient to be nearby, and be in ARRIVED state
          // .splice(new LookForArrivingPatient(myIndex).tree)

          // .splice(new TakeTime(30, 90).tree) // seconds: uniform, 30, 90

          // .splice(new ComputerEnterPatient(myIndex).tree)

          // .splice(new TakeTime(30, 60).tree) // seconds: uniform, 30, 60

          // .splice(new ComputerScorePatient(myIndex).tree)

          // .splice(new TakeTime(30, 60).tree) // seconds: uniform, 30, 60

          // .splice(new ComputerAssignPatientRoom(myIndex).tree)

          //.untilFail("Assign Patient to Triage Nurse successfully")
            //.inverter("invert result")            
              //.splice(new AssignPatientToTriageNurse(myIndex).tree)
            //.end()
          //.end()

          // Once the greeter nurse has arrived, run in parallel
          .parallel("look and book", numRequiredToFail, numRequiredToSucceed)
            .sequence("Check in Patients")
              .splice(new LookForArrivingPatient(myIndex).tree)
              .splice(new TakeTime(30, 90).tree)
              .splice(new ComputerEnterPatient(myIndex).tree)
              .splice(new TakeTime(30, 90).tree)
              .splice(new ComputerScorePatient(myIndex).tree)
              .splice(new TakeTime(30, 90).tree)
              .splice(new ComputerAssignPatientRoom(myIndex).tree)
            .end()
            .splice(new AssignPatientToTriageNurse(myIndex).tree)
          .end()
                    
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