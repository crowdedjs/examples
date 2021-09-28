import FollowInstructions from "../../behavior/follow-instructions.js";
import GoToLazy from "../../behavior/go-to-lazy.js";
// import LOG 
import Stop from "../../behavior/stop.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



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
    
    //let test = "new GoToLazy(" + myIndex + ", () => " + myGoal.location + ")"; - HALF WORKS
    //let test = "new GoToLazy(myIndex, () => myGoal.location)"; - HALF WORKS
    //let test = new GoToLazy(myIndex, () => myGoal.location).tree; - WORKS

    this.tree = builder
    .sequence("Patient Actions")

      // STARTING BEHAVIORS
      .splice(new GoToLazy(myIndex, () => myGoal.location).tree)
      //.splice(test)

      // .do("Test", async function (t) {
      //   //console.log(myGoal.location);

      //   return fluentBehaviorTree.BehaviorTreeStatus.Success;
      // })

      .splice(new Stop(myIndex).tree)








    // ---------------------------------------------------------------------  
    //   // Make patient go to the Waiting Room after being checked in
    //   .do("Waiting Room", async function (t) {
    //     if (goToName == "Ambulance Entrance") {
    //       wait = myGoal;
    //     }
    //     else if(me().getPermanentRoom() == null) {
    //       return fluentBehaviorTree.BehaviorTreeStatus.Running;
    //     }
    //     else if (me().getInstructor().MedicalStaffSubclass == "Greeter Nurse") {
    //       wait = Hospital.locations.find(l=> l.name == "Waiting Room");
    //     }
    //     else {
    //       wait = myGoal;
    //     }
    //     return fluentBehaviorTree.BehaviorTreeStatus.Success;
    //   })

    //   .splice(new GoToLazy(myIndex, () => wait.location).tree)

    //   .splice(new FollowInstructions(myIndex).tree)
    //   .do("Done following instructions", async function (t) {
    //     console.log("Done following instructions")
    //     return fluentBehaviorTree.BehaviorTreeStatus.Success;
    //   })

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