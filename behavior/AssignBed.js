import AMedician from "../support/AMedician.js"
import ARoom from "../support/ARoom.js"
import Vector3 from "./Vector3.js";

class AssignBed {
    
    //constructor(myIndex, start, end) {
      constructor(myIndex, bed) {
        this.index = myIndex;
        this.waypoints = [];
        //this.waypoints.push(start);
        //this.waypoints.push(end);
        this.waypoints.push(bed);
    
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
    
        this.tree = builder
          .sequence("Assign Bed")
          //Set the bed. This is a one-shot behavior since we only want to
          //update the return value once
            .do("Set Bed Location", (t) => {
              let agent = t.agents.find(a => a.id == self.index);
              //agent.destination = new Vector3(self.waypoints[1]);
              //agent.setComputer(room);
              //agent.setComputer(new Vector3(self.waypoints[0]));

            // FINDS FIRST AVAILABLE BED THEN ADDS ROOM IT IS IN
            //HOW TO DO THIS?
            // me.addRoom(room);

              return fluentBehaviorTree.BehaviorTreeStatus.Success;
          })
          .end()
          .build();
        }

        async update(agents, positions, msec) {
            await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
        }
}

export default AssignBed;