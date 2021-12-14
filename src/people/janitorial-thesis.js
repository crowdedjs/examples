import GoTo from "../behavior/go-to.js"
import GoToLazy from "../behavior/go-to-lazy.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"
import LocationStatus from "../support/location-status.js";
import TakeTime from "../behavior/take-time.js";

class janitorialThesis {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "Fast Track 1";
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);

    let myRoom;

    this.tree = builder
      .sequence("Janitorial")
      
      // CLOCK IN
      .selector("Check for arrival")  
        .condition("Clock in", async (t) => me().onTheClock)
        .do("SHIFT CHANGE", (t) => {
          // SHIFT CHANGE
          if (me().onTheClock == false) {
            me().onTheClock = true;
            Hospital.activeJanitor.push(me());
            if (Hospital.activeJanitor[0] != me() && Hospital.activeJanitor.length > 1) {
              for (let i = 0; i < Hospital.activeJanitor.length; i++) {
                if (!Hospital.activeJanitor[i].replacement) {
                  Hospital.activeJanitor[i].replacement = true;
                  //Hospital.activeJanitor.shift();
                  Hospital.activeJanitor.splice(i, 1);
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

      .sequence("Clean Room")
      // GO TO JANITOR CLOSET
        .splice(new GoTo(self.index, myGoal.location).tree)
        .condition("Is there a room to clean?", async (t) => Hospital.janitorTaskList.length > 0)
        // PICK/CLAIM THE ROOM TO CLEAN
        .do("Pick the room", (t) => {
          myRoom = Hospital.janitorTaskList.shift().location;
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        })
        // GO TO THE ROOM THAT NEEDS CLEANING
        .splice(new GoToLazy(self.index, () => myRoom.location).tree)
        // TAKE TIME IN THE ROOM TO CLEAN
        .splice(new TakeTime(300, 600).tree)
        // SET STATUS AS NONE - PROBABLY DON'T ACTUALLY NEED THIS
        .do("Done with the Room", (t) => {               
          myRoom.setLocationStatus(LocationStatus.NONE);
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        })

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

export default janitorialThesis;
