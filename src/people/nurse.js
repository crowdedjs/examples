import responsibility from "../behavior/responsibility/responsibility.js";
import GoTo from "../behavior/go-to.js";
import AssignComputer from "../behavior/assign-computer.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class nurse {

    constructor(myIndex) {
      this.index = myIndex;
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
      let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
      
      let goToName = "NursePlace";
      let myGoal = Hospital.locations.find(l => l.name == goToName);
      let computer =  Hospital.locations.find(l => l.name == "NursePlace");
      this.tree = builder

      .parallel("Testing Parallel", 2, 2)
        .do("Testing", (t) => {
            if (me().amIdle) {
                me().idleTime++;
            }
            if (me().lengthOfStay == 43200 || me().lengthOfStay == 86400) {
              let idleTimeMinutes = ((1440 * me().idleTime) / 86400);
              console.log("Nurse Idle Time: " + me().idleTime + " ticks / " + idleTimeMinutes + " minutes in-simulation");
              me().idleTime = 0;
              me().lengthOfStay = 0;
            }
            me().lengthOfStay++;
            return fluentBehaviorTree.BehaviorTreeStatus.Running; 
        })
      .sequence("Assign Nurse")
        .selector("Check for arrival")  
          .condition("Clock in", async (t) => me().onTheClock)
          .do("SHIFT CHANGE", (t) => {
            // SHIFT CHANGE
            if (me().onTheClock == false) {
              me().onTheClock = true;
              Hospital.activeNurse.push(me());
              if (Hospital.activeNurse[0] != me() && Hospital.activeNurse.length > 2) {
                for (let i = 0; i < Hospital.activeNurse.length; i++) {
                  if (!Hospital.activeNurse[i].replacement) {
                    Hospital.activeNurse[i].replacement = true;
                    //Hospital.activeNurse.shift();
                    Hospital.activeNurse.splice(i, 1);
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
                if (Hospital.computer.entries[i].getNurse() == me()) {
                  Hospital.computer.entries[i].setNurse(null);
                }
              }
              if (Hospital.aTeam[2] == me()) {
                Hospital.aTeam[2] = null;
              }

              // TESTING
              let idleTimeMinutes = ((1440 * me().idleTime) / 86400);
              console.log("Nurse Idle Time: " + me().idleTime + " ticks / " + idleTimeMinutes + " minutes in-simulation");
              Hospital.nurseData.push(me().idleTime);

              me().inSimulation = false;
              return fluentBehaviorTree.BehaviorTreeStatus.Running;
            })
          .end()
        .end()

        .splice(new GoTo(self.index, myGoal.location).tree)
        .splice(new AssignComputer(myIndex, computer.location).tree) // NURSE PLACE
        .splice(new responsibility(myIndex).tree) // LAZY: TRUE
      .end()
      .end()
      .build();
    }
  
    async update( crowd, msec) {
      //this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ crowd, msec }) //Call the behavior tree
      //return this.toReturn; //Return what the behavior tree set the return value to
    }

    checkEndOfSimulation() {
      if (self.Hospital.computer.entries.length > 0) {
        return self.Hospital.computer.entries[0].unacknowledged("NurseEscortPatientToExit");
      }
      return false;
    }
  
  }

export default nurse;