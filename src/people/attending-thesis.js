import GoTo from "../behavior/go-to.js"
import WaitForever from "../behavior/wait-forever.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"
import task from "../support/task-thesis.js";

class attendingThesis {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
    //let myGoal = Hospital.locations.find(l => l.name == "B Desk");
    //if (!myGoal) throw new Exception("We couldn't find a location called B Desk");
    let myGoal = Hospital.locations.find(l => l.name == "Fast Track 2");
    if (!myGoal) throw new Exception("We couldn't find a location called Fast Track 2");
    let entrance = Hospital.getLocationByName("Main Entrance");

    this.goTo = new GoTo(self.index, myGoal.location);

    // attending doctor's behavior is probably to just check in with patients before they are escorted out of the hospital?
    
    // shadow interns
    // consult with patients with the resident
    // consult with the other agents in the hospital to make sure everything is going okay
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

export default attendingThesis;