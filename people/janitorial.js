import GoTo from "../behavior/go-to.js"
import WaitForever from "../behavior/wait-forever.js"


class janitorial {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "Fast Track 1";
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;

    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);


    this.tree = builder
      .sequence("Janitorial")
      .splice(new GoTo(self.index, myGoal.location).tree)
      .splice(new WaitForever(myIndex).tree)
      
      .end()
      .build();
  }

  async update( crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default janitorial;
