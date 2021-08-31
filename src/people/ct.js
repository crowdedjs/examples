import GoTo from "../behavior/go-to.js"
import AssignComputer from "../behavior/assign-computer.js";
import responsibility from "../behavior/responsibility/responsibility.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



class ct {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
       
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    let goToName = "CT 1";
    if (myIndex % 2 == 1) {
      goToName = "CT 2";
    }

    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);


    this.tree = builder
      .sequence("Tech Tree")

      .selector("Check for arrival")  
        .condition("Clock in", async (t) => me().onTheClock)
        .do("SHIFT CHANGE", (t) => {
          // SHIFT CHANGE
          if (me().onTheClock == false) {
            me().onTheClock = true;
            Hospital.activeCT.push(me());
            if (Hospital.activeCT[0] != me() && Hospital.activeCT.length > 2) {
              for (let i = 0; i < Hospital.activeCT.length; i++) {
                if (!Hospital.activeCT[i].replacement) {
                  Hospital.activeCT[i].replacement = true;
                  //Hospital.activeCT.shift();
                  Hospital.activeCT.splice(i, 1);
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

      // .do("test", (t) => {
      //   return fluentBehaviorTree.BehaviorTreeStatus.Success;
      // })

      .splice(new GoTo(self.index, myGoal.location).tree)

      //.splice(new AssignComputer(myIndex, Hospital.locations.find(l => l.name == goToName).location).tree) // CT 1 or CT 2
      .splice(new AssignComputer(myIndex, myGoal.location).tree) // CT 1 or CT 2

      .splice(new responsibility(myIndex).tree) // lazy: true
      
      .end()
      .build();
  }

  async update( crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default ct;