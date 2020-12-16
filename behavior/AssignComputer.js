import AMedician from "../support/AMedician.js"
import ARoom from "../support/ARoom.js"
import Vector3 from "./Vector3.js";

class AssignComputer {
    
    //constructor(myIndex, start, end) {
      constructor(myIndex, room) {
        this.index = myIndex;
        this.waypoints = [];
        //this.waypoints.push(start);
        //this.waypoints.push(end);
        this.waypoints.push(room);
    
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
    
        this.tree = builder
          .sequence("Assign Computer")
          //Set the computer. This is a one-shot behavior since we only want to
          //update the return value once
            .do("Set Computer Location", (t) => {
              let agent = t.agents.find(a => a.id == self.index);
              //agent.destination = new Vector3(self.waypoints[1]);
                
              //agent.setComputer(room); Is this correct???
              agent.setComputer(new Vector3(self.waypoints[0]));

              return fluentBehaviorTree.BehaviorTreeStatus.Success;
          })
          .end()
          .build();
        }

        async update(agents, positions, msec) {
            await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
        }
}

export default AssignComputer;