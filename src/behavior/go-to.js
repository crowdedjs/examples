import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class GoTo {

  constructor(myIndex, start) {
    this.index = myIndex;
    this.start = start;
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    this.tree = builder
      .sequence("Go To")
      //Set the destination. This is a one-shot behavior since we only want to
      //update the return value once
      .do("Set destination goal", (t) => {
        let agent = Hospital.agents.find(a=>a.id==self.index);
        agent.destination = new Vector3(self.start.x,self.start.y,self.start.z)
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      //Now return null as we head to that destination
      //We return running until we're close to it.
      .do("Traveling to goal", (t) => {      
        let agent = Hospital.agents.find(a=>a.id==self.index);
        let frameAgentDetail = t.crowd.find(a=>a.id == self.index);
        let simulationAgent = t.crowd.find(a=>a.id == self.index);
        let loc = new Vector3(simulationAgent.location.x, simulationAgent.location.y, simulationAgent.location.z);
        let waypoint = Vector3.fromObject(self.start);

        let difference = Vector3.subtract(loc, waypoint)
        //let distanceToWaypoint = difference.length();
        let distanceToWaypoint = difference.lengthSquared();

        if (distanceToWaypoint < 4)
        {
          if (!agent.replacement) {
            agent.destination = new Vector3(loc.x, loc.y, loc.z);
          }
          if (agent.severity != null) {
            agent.destination = new Vector3(loc.x, loc.y, loc.z);
          }
          frameAgentDetail.pose = "Idle";
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        }

        agent.destination = new Vector3(self.start.x,self.start.y,self.start.z);
        
        return fluentBehaviorTree.BehaviorTreeStatus.Running;
      })
      .end()
      .build();
  }


}

export default GoTo;
