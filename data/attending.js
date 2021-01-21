import GoTo from "../behavior/GoTo.js"
import WaitForever from "../behavior/WaitForever.js"


class attending {

  constructor(myIndex, agentConstants, locations, start, end) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    let me= ()=>agentConstants.find(a=>a.id == myIndex);;
    let myGoal = locations.find(l => l.name == "B Desk");
    if (!myGoal) throw new Exception("We couldn't find a location called B Desk");

    this.goTo = new GoTo(self.index, myGoal.position);


    this.tree = builder
      .sequence("Attending Tree")
      .splice(this.goTo.tree)
      .splice(new WaitForever(myIndex, agentConstants, locations).tree)
            
      .end()
      .build();
  }

  async update(agentConstants, crowd, msec) {
    console.log("Start Attending");
    await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
    console.log("End Attending");
  }

}

export default attending;