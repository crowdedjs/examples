// NOT FULLY PORTED
import GoTo from "../behavior/GoTo.js"
import WaitForever from "../tasks/WaitForever.js"


class radiology {

  constructor(agent, myIndex, start, end) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "CT 2";
    let me = agent;

    let myGoal = me.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);


    this.tree = builder
      .sequence("Go and Idle")
      .splice(new GoTo(self.index, myGoal.position).tree)
      .splice(new WaitForever(myIndex).tree)
      .do("Go to Room", (t) => {

      })

      .do("Wait Forever", (t) => new WaitForever(myIndex).execute())

      .end()
      .build();
  }

  async update(agentConstants, crowd, msec) {
    this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
    return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default radiology
