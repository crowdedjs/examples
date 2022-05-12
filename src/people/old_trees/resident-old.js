import GoTo from "../../behavior/go-to.js"
import WaitForever from "../../behavior/wait-forever.js"

import AssignBed from "../../behavior/assign-bed.js";
import AssignComputer from "../../behavior/assign-computer.js";
import responsibility from "../../behavior/responsibility/responsibility.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



class residentOld {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "ResidentStart";
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);


    this.tree = builder
    
    .parallel("Testing Parallel", 2, 2)
      .do("Testing", (t) => {
          if (me().amIdle) {
              me().idleTime++;
          }
          if (me().lengthOfStay == 43200 || me().lengthOfStay == 86399) {
            let idleTimeMinutes = ((1440 * me().idleTime) / 86400);
            idleTimeMinutes = Math.round((idleTimeMinutes + Number.EPSILON) * 100) / 100
            //console.log("Resident Idle Time: " + me().idleTime + " ticks / " + idleTimeMinutes + " minutes in-simulation");
            console.log(idleTimeMinutes);
            me().idleTime = 0;
            //me().lengthOfStay = 0;
          }
          me().lengthOfStay++;
          return fluentBehaviorTree.BehaviorTreeStatus.Running; 
      })
    .sequence("Assign")
      .selector("Check for arrival")  
        .condition("Clock in", async (t) => me().onTheClock)
        .do("SHIFT CHANGE", (t) => {
          // SHIFT CHANGE
          if (me().onTheClock == false) {
            me().onTheClock = true;
            Hospital.activeResident.push(me());
            if (Hospital.activeResident[0] != me() && Hospital.activeResident.length > 4) {
              for (let i = 0; i < Hospital.activeResident.length; i++) {
                if (!Hospital.activeResident[i].replacement) {
                  Hospital.activeResident[i].replacement = true;
                  //Hospital.activeResident.shift();
                  Hospital.activeResident.splice(i, 1);
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
              if (Hospital.computer.entries[i].getResident() == me()) {
                Hospital.computer.entries[i].setResident(null);
              }
            }
            if (Hospital.aTeam[1] == me()) {
              Hospital.aTeam[1] = null;
            }

            // TESTING
            let idleTimeMinutes = ((1440 * me().idleTime) / 86400);
            idleTimeMinutes = Math.round((idleTimeMinutes + Number.EPSILON) * 100) / 100
            console.log("Resident Idle Time: " + me().idleTime + " ticks / " + idleTimeMinutes + " minutes in-simulation");
            Hospital.residentData.push(me().idleTime);

            me().inSimulation = false;
            return fluentBehaviorTree.BehaviorTreeStatus.Running;
          })
        .end()
      .end()

      .splice(new GoTo(self.index, myGoal.location).tree)
      .splice(new AssignBed(myIndex, Hospital.locations.find(l => l.name == "C1").location).tree) // C1
      .splice(new AssignComputer(myIndex, Hospital.locations.find(l => l.name == "ResidentStart").location).tree) // ResidentStart
      .splice(new responsibility(myIndex).tree) // lazy: true

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

export default residentOld;
