import FollowInstructions from "../../behavior/follow-instructions.js";
import GoToLazy from "../../behavior/go-to-lazy.js";
// import LOG 
import Stop from "../../behavior/stop.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"
import PatientTempState from "../support/patient-temp-state.js";

class patientThesis {

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
          // GO TO WAITING ROOM OR STAY WHERE YOU ARE
          .splice(new GoToLazy(myIndex, () => wait.location).tree)
      .end()
      // PHYSICALLY FOLLOW NURSES AND STAY IN HOSPITAL ROOM
      .splice(new FollowInstructions(myIndex).tree)
    .end()
    .build();
  }

  async update(crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default patientThesis;