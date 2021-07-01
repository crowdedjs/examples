import FollowInstructions from "../behavior/follow-instructions.js";
import GoToLazy from "../behavior/go-to-lazy.js";
// import LOG 
import Stop from "../behavior/stop.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



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
    //let myGoal = Hospital.locations.find(l => l.name == "Check In");
    //let emergencyGoal = Hospital.locations.find(l => l.name == "Ambulance Entrance");
    //if (this.startLocation == emergencyGoal)
    //{
    //  myGoal = emergencyGoal;
    //}
    //if (!myGoal) throw new Exception("We couldn't find a location called Check In");

    // this.goTo = new GoTo(self.index, myGoal.location);

    this.tree = builder

      .sequence("Patient Actions")
      //.selector("Check In")

      // .do("Stop", async function (t) {
      //   if (myIndex > 25) {
      //     console.log("My ID: " + myIndex);
      //     console.log(startLocation);
      //     let state = me().getPatientTempState();
      //     console.log(state);
      //   }
      // 
      //   return fluentBehaviorTree.BehaviorTreeStatus.Success;
      // })

      // .do("Wait For Patient Assignment", (t) => {
      //   console.log(me());
       
      //   return fluentBehaviorTree.BehaviorTreeStatus.Success;

      // })

      //.splice(new GoToLazy(myIndex, () => this.startLocation.location).tree)// CHECK IN
      .do("Emergency Queue", async function (t) {
        if (me().emergencyQueue == false && me().getSeverity() == "ESI1") {
          Hospital.emergencyQueue.push(me());
          me().emergencyQueue = true;
        }
        
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })

      .splice(new GoToLazy(myIndex, () => myGoal.location).tree)

      .splice(new Stop(myIndex).tree)

      // Make patient go to the Waiting Room after being checked in
      .do("Waiting Room", async function (t) {
        if(me().getPermanentRoom() == null) {
          return fluentBehaviorTree.BehaviorTreeStatus.Running;
        }
        else if (me().getInstructor() == null) {
          wait = Hospital.locations.find(l=> l.name == "Waiting Room");
          //console.log(wait);
        }
        else {
          wait = myGoal;
          //console.log(wait);
        }
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })

      .splice(new GoToLazy(myIndex, () => wait.location).tree)

      .splice(new FollowInstructions(myIndex).tree)
      .do("Done following instructions", async function (t) {
        console.log("Done following instructions")
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })

      //.splice(new WaitForever(myIndex).tree)
      .end()
      .build();
  }

  async update(crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default patient;