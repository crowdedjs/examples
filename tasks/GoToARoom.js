// not fully ported
class GoToARoom {
    execute() {
        // pasted code from BackAndForth, don't know
        // if it works with rooms specifically

        //need to pass the room coordinates separately
        
        //self.toReturn = new Vector3(self.waypoints[1]);
        //return fluentBehaviorTree.BehaviorTreeStatus.Success;

        let agent = t.crowd.getAgent(t.agents[self.index].idx);
        let loc = new Vector3(agent.npos);
        let waypoint = new Vector3(self.waypoints[1]);

        let difference = Vector3.subtract(loc, waypoint)
        let distanceToWaypoint = difference.length();

        if (distanceToWaypoint < 2)
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        return fluentBehaviorTree.BehaviorTreeStatus.Running;
    }
}