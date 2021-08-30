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
      .sequence("Phlebotomist Tree")
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
      .build();
  }

  async update( crowd, msec) {
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
  }

}

export default phlebotomist;