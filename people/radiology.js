import GoTo from "../behavior/go-to.js"
import WaitForever from "../behavior/wait-forever.js"
import responsibility from "../behavior/responsibility/responsibility.js"

class radiology {

  constructor(myIndex, locations) {
    this.index = myIndex;
    this.waypoints = [];
   
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "CT 2";
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    let myGoal = locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);


    this.tree = builder
      .sequence("Go and Idle")
      .splice(new GoTo(self.index, myGoal.position).tree)
      //.splice(new WaitForever(myIndex, locations).tree)
      .splice(new responsibility(myIndex, locations).tree)
      
      .end()
      .build();
  }

  async update( crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default radiology
