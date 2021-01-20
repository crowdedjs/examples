import Vector3 from "./Vector3.js";

class GoToLazy {

  constructor(myIndex, f) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(f);
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    this.tree = builder
      .sequence("Go To Lazy")
      //Set the destination. This is a one-shot behavior since we only want to
      //update the return value once
      .do("Set destination goal lazy", (t) => {
        let agent = t.agentConstants.find(a=>a.id==self.index);
        let next = self.waypoints[0]();
        agent.destination = new Vector3(next)
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      //Now return null as we head to that destination
      //We return running until we're close to it.
      .do("Traveling to goal lazy", (t) => {
        let agent = t.agentConstants.find(a=>a.id==self.index);
        let frameAgentDetail = t.crowd.find(a=>a.id == self.index);
        let next = self.waypoints[0]();
        
        agent.destination = next;
        let simulationAgent = t.crowd.find(a=>a.id == self.index);
        let loc = new Vector3(simulationAgent.x, simulationAgent.y, simulationAgent.z);
        let waypoint = Vector3.fromObject(self.waypoints[0]);

        let difference = Vector3.subtract(loc, waypoint)
        let distanceToWaypoint = difference.length();

        if (distanceToWaypoint < 2)
        {
          frameAgentDetail.pose = "Idle";
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        }
        return fluentBehaviorTree.BehaviorTreeStatus.Running;
      })
      .end()
      .build();
  }

  async update(agent, agentConstants, positions, msec) {
    await this.tree.tick({ agent, agentConstants, positions, msec }) //Call the behavior tree
  }

}

export default GoToLazy;
