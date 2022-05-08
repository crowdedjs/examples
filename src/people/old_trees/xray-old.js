import GoTo from "../../behavior/go-to.js"
import AssignComputer from "../../behavior/assign-computer.js";
import responsibility from "../../behavior/responsibility/responsibility.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class xray {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "XRay 1";
    if (myIndex % 2 == 1) {
      goToName = "XRay 2";
    }

    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new Exception("We couldn't find a location called " + goToName);

    this.goTo = new GoTo(self.index, myGoal.location);


    this.tree = builder
    
    .parallel("Testing Parallel", 2, 2)
      .do("Testing", (t) => {
          if (me().amIdle) {
              me().idleTime++;
          }
          if (me().lengthOfStay == 43200 || me().lengthOfStay == 86399) {
            let idleTimeMinutes = ((1440 * me().idleTime) / 86400);
            idleTimeMinutes = Math.round((idleTimeMinutes + Number.EPSILON) * 100) / 100
            //console.log("X-Ray Idle Time: " + me().idleTime + " ticks / " + idleTimeMinutes + " minutes in-simulation");
            console.log(idleTimeMinutes);
            me().idleTime = 0;
            //me().lengthOfStay = 0;
          }
          me().lengthOfStay++;
          return fluentBehaviorTree.BehaviorTreeStatus.Running; 
      })  
    .sequence("X-Ray Tree")
      .selector("Check for arrival")  
        .condition("Clock in", async (t) => me().onTheClock)
        .do("SHIFT CHANGE", (t) => {
          // SHIFT CHANGE
          if (me().onTheClock == false) {
            me().onTheClock = true;
            Hospital.activeXRay.push(me());
            if (Hospital.activeXRay[0] != me() && Hospital.activeXRay.length > 2) {
              for (let i = 0; i < Hospital.activeXRay.length; i++) {
                if (!Hospital.activeXRay[i].replacement) {
                  Hospital.activeXRay[i].replacement = true;
                  //Hospital.activeXRay.shift();
                  Hospital.activeXRay.splice(i, 1);
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
            // for(let i = 0; i < Hospital.computer.entries.length; i++) {
            //   if (Hospital.computer.entries[i].getTech() == me()) {
            //     Hospital.computer.entries[i].setTech(null);
            //   }
            // }
            if (Hospital.aTeam[5] == me()) {
              Hospital.aTeam[5] = null;
            }
            me().inSimulation = false;
            return fluentBehaviorTree.BehaviorTreeStatus.Running;
          })
        .end()
      .end()

      .splice(this.goTo.tree)

      .splice(new AssignComputer(myIndex, myGoal.location).tree) // XRay 1 or XRay 2

      .splice(new responsibility(myIndex).tree) // lazy: true
        
    .end()
    .end()
    .build();
  }

  async update( crowd, msec) {
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
  }

}

export default xray;