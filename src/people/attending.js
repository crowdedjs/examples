import GoTo from "../behavior/go-to.js"
import WaitForever from "../behavior/wait-forever.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



class attending {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
    let myGoal = Hospital.locations.find(l => l.name == "B Desk");
    if (!myGoal) throw new Exception("We couldn't find a location called B Desk");

    this.goTo = new GoTo(self.index, myGoal.location);

    // attending doctor's behavior is probably to just check in with patients before they are escorted out of the hospital 
    this.tree = builder
      .sequence("Attending Tree")
      .splice(this.goTo.tree)
      .splice(new WaitForever(myIndex).tree)
            
      .end()
      .build();
  }

  async update( crowd, msec) {
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
  }

}

export default attending;