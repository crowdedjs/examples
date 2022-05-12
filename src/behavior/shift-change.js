import GoTo from "../behavior/go-to.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class shiftChange {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
       
    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    this.tree = builder
    .sequence("Assign")
      .selector("Check for arrival")  
        .condition("Clock in", async (t) => me().onTheClock)
        .do("SHIFT CHANGE", (t) => {
          if (me().onTheClock == false) {
            me().onTheClock = true;
            Hospital.activeTech.push(me());
            if (Hospital.activeTech[0] != me() && Hospital.activeTech.length > 2) {
              for (let i = 0; i < Hospital.activeTech.length; i++) {
                if (!Hospital.activeTech[i].replacement) {
                  Hospital.activeTech[i].replacement = true;
                  //Hospital.activeTech.shift();
                  Hospital.activeTech.splice(i, 1);
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
            for(let i = 0; i < Hospital.computer.entries.length; i++) {
              if (Hospital.computer.entries[i].getTech() == me()) {
                Hospital.computer.entries[i].setTech(null);
              }
            }
            if (Hospital.aTeam[3] == me()) {
              Hospital.aTeam[3] = null;
            }
            me().inSimulation = false;
            return fluentBehaviorTree.BehaviorTreeStatus.Running;
          })
        .end()
      .end()
    .end()
    .build();
  }
}

export default shiftChange;