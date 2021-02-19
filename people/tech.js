import GoTo from "../behavior/go-to.js"
import WaitForever from "../behavior/wait-forever.js"

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
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;
       
    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);
    let computer = Hospital.locations.find(l => l.name == "TechPlace");
    let assignBed = new AssignBed(myIndex, Hospital.locations.find(l => l.name == "C1").location).tree
    let assignComputer = new AssignComputer(myIndex, computer.location).tree; 
    let assignResponsibility = new responsibility(myIndex).tree;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    this.tree = builder
      .sequence("Assign")
      .splice(new GoTo(self.index, myGoal.location).tree)
      //.splice(new WaitForever(myIndex).tree)

      // original tree sequence below
      .do("Assiging Bed", async t=>{
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
