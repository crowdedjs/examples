import Vector3 from "./Vector3.js";
//import * as fluentBehaviorTree from "../lib/fluent-behavior-tree-browser.js"

class BackAndForth {

  constructor(myIndex, start, end) {
    //console.log("Start")
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    this.tree = builder
      .sequence("Back and Forth")
      //Set the destination. This is a one-shot behavior since we only want to
      //update the return value once
      .do("Set destination to end", (t) => {
        //console.log("In set destination to end.")
        self.toReturn = new Vector3(self.waypoints[1]);
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      //Now return null as we head to that destination
      //We return running until we're close to it.
      .do("Traveling to end", (t) => {
        //console.log("Going to end... " + self.toReturn);
        let agent = t.positions.find(a=>a.id==self.index);
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
        //console.log("In set destination to start.")
        self.toReturn = new Vector3(self.waypoints[0]);
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      //Now return null as we head to that destination
      //We return running until we're close to it.
      .do("Travel to End", (t) => {
        //console.log("Going to end... " + self.toReturn);
        let agent = t.positions.find(a=>a.id==self.index);
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

  async update(agents, positions, msec) {
    this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
    return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default BackAndForth;
