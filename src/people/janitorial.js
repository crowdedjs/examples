import GoTo from "../behavior/go-to.js"
import GoToLazy from "../behavior/go-to-lazy.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"
import LocationStatus from "../support/location-status.js";
import TakeTime from "../behavior/take-time.js";

class janitorial {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "Fast Track 1";
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);

    this.tree = builder
    
    .parallel("Testing Parallel", 2, 2)
      .do("Testing", (t) => {
          if (me().amIdle) {
              me().idleTime++;
          }
          if (me().lengthOfStay == 43200 || me().lengthOfStay == 86400) {
            let idleTimeMinutes = ((1440 * me().idleTime) / 86400);
            console.log("Janitor Idle Time: " + me().idleTime + " ticks / " + idleTimeMinutes + " minutes in-simulation");
            me().idleTime = 0;
            me().lengthOfStay = 0;
          }
          me().lengthOfStay++;
          return fluentBehaviorTree.BehaviorTreeStatus.Running; 
      })  
    .sequence("Janitorial")
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
      
      .splice(new GoTo(self.index, myGoal.location).tree)
      
      //find room to clean
      .do("Find Room to Clean", (t) => {               
        if (typeof Hospital.locations.find(l => l.locationStatus == LocationStatus.SANITIZE) === 'undefined') {
          medicalStaff.amIdle = true;
          return fluentBehaviorTree.BehaviorTreeStatus.Failure;
        }
        else {
          medicalStaff.amIdle = false;
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        }
      })

      // GO TO THE ROOM THAT NEEDS CLEANING
      .splice(new GoToLazy(self.index, () => Hospital.locations.find(l => l.locationStatus == LocationStatus.SANITIZE).location).tree)

      // TAKE TIME IN THE ROOM TO CLEAN
      .splice(new TakeTime(300, 600).tree)

      // set that room's status as NONE
      .do("Done with the Room", (t) => {               
        Hospital.locations.find(l => l.locationStatus == LocationStatus.SANITIZE).setLocationStatus(LocationStatus.NONE);
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

export default janitorial;
