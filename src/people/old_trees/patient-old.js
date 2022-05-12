import FollowInstructionsOld from "../../behavior/follow-instructions-old.js";
import GoToLazy from "../../behavior/go-to-lazy.js";
// import LOG 
import Stop from "../../behavior/stop.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"
import PatientTempState from "../../support/patient-temp-state.js";

class patientOld {

  constructor(myIndex, startLocation) {
    this.index = myIndex;
    this.startLocation = startLocation;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let me = () => Hospital.agents.find(a => a.id == myIndex);

    let goToName = "Check In";
    if (this.startLocation.name == "Ambulance Entrance") {
      goToName = "Ambulance Entrance";
    }
    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);

    let wait = Hospital.locations.find(l=> l.name == "Waiting Room");

    this.tree = builder
    .sequence("Patient Actions")

      .splice(new GoToLazy(myIndex, () => myGoal.location).tree)

      .splice(new Stop(myIndex).tree)

      // Make patient go to the Waiting Room after being checked in
      .do("Waiting Room", async function (t) {
        if (goToName == "Ambulance Entrance") {
          wait = myGoal;
        }
        else if(me().getPermanentRoom() == null) {
          return fluentBehaviorTree.BehaviorTreeStatus.Running;
        }
        else if (me().getInstructor().MedicalStaffSubclass == "Greeter Nurse") {
          wait = Hospital.locations.find(l=> l.name == "Waiting Room");
        }
        else {
          wait = myGoal;
        }
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })

      .splice(new GoToLazy(myIndex, () => wait.location).tree)

      .splice(new FollowInstructionsOld(myIndex).tree)
      .do("Done following instructions", async function (t) {
        console.log("Done following instructions")
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })

    .end()
    .build();
  }

  async update(crowd, msec) {
    let myself = Hospital.agents.find(a=>a.id==this.index);
    myself.ticksPresent++;
    if (myself.getPatientTempState() == PatientTempState.WAITING || myself.getPatientTempState() == PatientTempState.ARRIVED) {
      myself.waitingTime++;
    }
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
  }

}

export default patientOld;