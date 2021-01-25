import GoTo from "../behavior/go-to.js"
import WaitForever from "../behavior/wait-forever.js"


class attending {

  constructor(myIndex, locations, start, end) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;
    let myGoal = locations.find(l => l.name == "B Desk");
    if (!myGoal) throw new Exception("We couldn't find a location called B Desk");

    this.goTo = new GoTo(self.index, myGoal.position);


    this.tree = builder
      .sequence("Attending Tree")
      .splice(this.goTo.tree)
      .splice(new WaitForever(myIndex, locations).tree)
            
      .end()
      .build();
  }

  async update( crowd, msec) {
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
  }

}

export default attending;