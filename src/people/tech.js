import GoTo from "../behavior/go-to.js"
import AssignBed from "../behavior/assign-bed.js";
import AssignComputer from "../behavior/assign-computer.js";
import responsibility from "../behavior/responsibility/responsibility.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class tech {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;
    let goToName = "TechPlace";
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
       
    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);
    let computer = Hospital.locations.find(l => l.name == "TechPlace");
    let assignBed = new AssignBed(myIndex, Hospital.locations.find(l => l.name == "C1").location).tree
    let assignComputer = new AssignComputer(myIndex, computer.location).tree; 
    let assignResponsibility = new responsibility(myIndex).tree;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    this.tree = builder
    .sequence("Assign")
      
      .selector("Check for arrival")  
        .condition("Clock in", async (t) => me().onTheClock)
        .do("SHIFT CHANGE", (t) => {
          // SHIFT CHANGE
          if (me().onTheClock == false) {
            me().onTheClock = true;
            Hospital.activeTech.push(me());
            if (Hospital.activeTech[0] != me() && Hospital.activeTech.length > 2) {
              for (let i = 0; i < Hospital.activeTech.length; i++) {
                if (!Hospital.activeTech[i].replacement) {
                  Hospital.activeTech[i].replacement = true;
                  Hospital.activeTech.shift();
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

      .splice(new GoTo(self.index, myGoal.location).tree)

      .do("Assigning Bed", async t=>{
        let result = await assignBed.tick(t);
        return result;
      }) // C1
      .do("Assign Computer", async t=>{
        let result = await assignComputer.tick(t);
        return result;
      }) // TechPlace
      .do("Assign Responsibility", async t=>{
        let result = await assignResponsibility.tick(t);
        return result;
      }) // lazy: true

    .end()
    .build();
  }

  async update( crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default tech;
