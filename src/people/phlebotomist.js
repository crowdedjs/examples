import GoTo from "../behavior/go-to.js";
import AssignBed from "../behavior/assign-bed.js";
import AssignComputer from "../behavior/assign-computer.js";
import responsibility from "../behavior/responsibility/responsibility.js";
import WaitForever from "../behavior/wait-forever.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



class phlebotomist {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "Tech Start";
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new Exception("We couldn't find a location called " + goToName);
    let computer = Hospital.locations.find(l => l.name == "Tech Start");
    let assignBed = new AssignBed(myIndex, Hospital.locations.find(l => l.name == "C1").location).tree
    let assignComputer = new AssignComputer(myIndex, computer.location).tree; 
    let assignResponsibility = new responsibility(myIndex).tree;

    this.goTo = new GoTo(self.index, myGoal.location);

    this.tree = builder

    .parallel("Testing Parallel", 2, 2)
      .do("Testing", (t) => {
          if (me().amIdle) {
              me().idleTime++;
          }
          return fluentBehaviorTree.BehaviorTreeStatus.Running; 
      })
    .sequence("Phlebotomist Tree") 
      .selector("Check for arrival")  
        .condition("Clock in", async (t) => me().onTheClock)
        .do("SHIFT CHANGE", (t) => {
          // SHIFT CHANGE
          if (me().onTheClock == false) {
            me().onTheClock = true;
            Hospital.activePhleb.push(me());
            if (Hospital.activePhleb[0] != me() && Hospital.activePhleb.length > 4) {
              for (let i = 0; i < Hospital.activePhleb.length; i++) {
                if (!Hospital.activePhleb[i].replacement) {
                  Hospital.activePhleb[i].replacement = true;
                  //Hospital.activePhleb.shift();
                  Hospital.activePhleb.splice(i, 1);
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
              if (Hospital.computer.entries[i].getPhlebotomist() == me()) {
                Hospital.computer.entries[i].setPhlebotomist(null);
              }
            }
            if (Hospital.aTeam[4] == me()) {
              Hospital.aTeam[4] = null;
            }

            // TESTING
            console.log("Phlebotomist Idle Time: " + me().idleTime + " ticks");
            Hospital.phlebData.push(me().idleTime);

            me().inSimulation = false;
            return fluentBehaviorTree.BehaviorTreeStatus.Running;
          })
        .end()
      .end()
    
      .splice(this.goTo.tree)

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

      //.splice(new WaitForever(myIndex).tree)
            
    .end()
    .end()
    .build();
  }

  async update( crowd, msec) {
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
  }

}

export default phlebotomist;