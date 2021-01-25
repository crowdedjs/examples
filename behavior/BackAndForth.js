import Vector3 from "../math/vector3.js";
//import * as fluentBehaviorTree from "../lib/fluent-behavior-tree-browser.js"

class BackAndForth {

  constructor(myIndex, start, end) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    this.tree = builder
      .sequence("Back and Forth")
      //Set the destination. This is a one-shot behavior since we only want to
      //update the return value once
      .do("Set destination to end", (t) => {
        let agent = Hospital.agents.find(a => a.id == self.index);
        agent.destination = new Vector3(self.waypoints[1]);
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      //Now return null as we head to that destination
      //We return running until we're close to it.
      .do("Traveling to end", (t) => {
        let a = Hospital.agents.find(a => a.id == self.index);
        a.destination = new Vector3(self.waypoints[1]);
        let agent = t.positions.find(a => a.id == self.index);
        let loc = new Vector3(agent.x, agent.y, agent.z);
        let waypoint = new Vector3(self.waypoints[1]);

        let difference = Vector3.subtract(loc, waypoint)
        let distanceToWaypoint = difference.length();

        if (distanceToWaypoint < 2)
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        return fluentBehaviorTree.BehaviorTreeStatus.Running;
      })
      //Set the destination. This is a one-shot behavior since we only want to
      //update the return value once
      .do("Set destination to start", (t) => {
        let agent = Hospital.agents.find(a => a.id == self.index);
        agent.destination = new Vector3(self.waypoints[0]);
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      //Now return null as we head to that destination
      //We return running until we're close to it.
      .do("Travel to End", (t) => {
        let a = Hospital.agents.find(a => a.id == self.index);
        a.destination = new Vector3(self.waypoints[0]);
        let agent = t.positions.find(a => a.id == self.index);
        let loc = new Vector3(agent.x, agent.y, agent.z);
        let waypoint = new Vector3(self.waypoints[0]);

        let difference = Vector3.subtract(loc, waypoint)
        let distanceToWaypoint = difference.length();

        if (distanceToWaypoint < 2)
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        return fluentBehaviorTree.BehaviorTreeStatus.Running;
      })
      .end()
      .build();
  }

  async update( positions, msec) {
    await this.tree.tick({ positions, msec }) //Call the behavior tree
  }

}

export default BackAndForth;
