import GoTo from "../behavior/go-to.js"
import WaitForever from "../behavior/wait-forever.js"
import responsibility from "../behavior/responsibility/responsibility.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"


class radiology {

  constructor(myIndex) {
    this.index = myIndex;
   
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "CT 2";
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);


    this.tree = builder
    .sequence("Go and Idle")
      .selector("Check for arrival")  
        .condition("Clock in", async (t) => me().onTheClock)
        .do("SHIFT CHANGE", (t) => {
          // SHIFT CHANGE
          if (me().onTheClock == false) {
            me().onTheClock = true;
            Hospital.activeRadio.push(me());
            if (Hospital.activeRadio[0] != me() && Hospital.activeRadio.length > 1) {
              for (let i = 0; i < Hospital.activeRadio.length; i++) {
                if (!Hospital.activeRadio[i].replacement) {
                  Hospital.activeRadio[i].replacement = true;
                  //Hospital.activeRadio.shift();
                  Hospital.activeRadio.splice(i, 1);
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
      .splice(new responsibility(myIndex).tree)
      
    .end()
    .build();
  }

  async update( crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default radiology
