import FollowInstructions from "../behavior/follow-instructions.js";
import GoToLazy from "../behavior/go-to-lazy.js";
// import LOG 
import Stop from "../behavior/stop.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"
import PatientTempState from "../support/patient-temp-state.js";

class patient {

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
    // PATIENT BEHAVIOR TREE
    .sequence("Patient Tree")
      // NEW TREE SETUP. FIND DOABLE ACTION THEN START OVER WHEN IT IS DONE.
      .selector("Patient Actions")
        .sequence("Check In")
          .condition("Just Arrived", async (t) => me().getPatientTempState() == PatientTempState.ARRIVED)
          // GO TO CHECK IN COUNTER
          .splice(new GoToLazy(myIndex, () => myGoal.location).tree)
          // STAY STILL WHILE BEING CHECKED IN
          .splice(new Stop(myIndex).tree)
          // Make patient go to the Waiting Room after being checked in
          .do("Waiting Room", async function (t) {
            if (goToName == "Ambulance Entrance") {
              wait = myGoal;
            }            
            else if (me().getInstructor() != null && me().getInstructor().MedicalStaffSubclass == "Greeter Nurse") {
              wait = Hospital.locations.find(l=> l.name == "Waiting Room");
              //me().waitToCheckIn = false;
              me().waitInWaitingRoom = true;
            }
            else if(me().getPermanentRoom() == null) {
              return fluentBehaviorTree.BehaviorTreeStatus.Running;
            }
            else {
              wait = myGoal;
              //if (wait != Hospital.locations.find(l=> l.name == "Waiting Room")) {
                // me().waitToCheckIn = false;
                // me().waitInWaitingRoom = false;
              //}
            }
            return fluentBehaviorTree.BehaviorTreeStatus.Success;
          })
          // GO TO WAITING ROOM OR STAY WHERE YOU ARE
          .splice(new GoToLazy(myIndex, () => wait.location).tree)
      .end()
      // PHYSICALLY FOLLOW NURSES AND STAY IN HOSPITAL ROOM
      .splice(new FollowInstructions(myIndex).tree)
    .end()
    .build();
  }

  async update(crowd, msec) {
    let myself = Hospital.agents.find(a=>a.id==this.index);
    myself.ticksPresent++;
    if (myself.getPatientTempState() == PatientTempState.WAITING || myself.getPatientTempState() == PatientTempState.ARRIVED) {
      myself.waitingTime++;
    }
    // testing wait values
    if (myself.waitInRoom2) {
      myself.waitInRoom2Value++;
    }
    else if (myself.waitInScanRoom) {
      myself.waitInScanRoomValue++;
    }
    else if (myself.waitInRoom1) {
      myself.waitInRoom1Value++;
    }
    else if (myself.waitInWaitingRoom) {
      myself.waitInWaitingRoomValue++;
    }
    else if (myself.waitToCheckIn) {
      myself.waitToCheckInValue++;
    }

    await this.tree.tick({ crowd, msec }) //Call the behavior tree
  }

}

export default patient;