// not fully ported
import GoTo from "../behavior/GoTo.js"

class attending {

  constructor(agent, myIndex, start, end) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    let me = agent;
    let myGoal = me.locations.find(l => l.name == "B Desk");
    if (!myGoal) throw new "We couldn't find a location called B_DESK";

    this.goTo = new GoTo(self.index, myGoal.position);


    this.tree = builder
      .sequence("Attending Tree")
      .splice(this.goTo.tree)
      .do("Wait Forever", (t) => new WaitForever().execute())

      .end()
      .build();
  }

  async update(agents, crowd, msec) {
    await this.tree.tick({ agents, crowd, msec }) //Call the behavior tree
  }

}

export default attending;