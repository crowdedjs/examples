import AMedician from "../support/AMedician.js"
import ARoom from "../support/ARoom.js"
import Vector3 from "./Vector3.js";

class AssignBed {
    
    //constructor(myIndex, start, end) {
      constructor(myIndex, agentConstants, bed) {
        this.index = myIndex;
        this.waypoints = [];
        //this.waypoints.push(start);
        //this.waypoints.push(end);
        this.waypoints.push(bed);
    
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
    
        this.tree = builder
          
        // FINDS FIRST AVAILABLE BED, THEN ADDS ROOM TO NURSE'S LIST
        // NEED TO HAVE LIST OF AVAILABLE BEDS/ROOMS THEN FIND
        // ONE THAT IS AVAILABLE, AND ADD TO NURSE'S LIST
        
        // CURRENTLY USER FEEDS LOCATION TO THIS BEHAVIOR, THEN IT 
        // ADDS VECTOR3 TO NURSE'S LIST
        
        .sequence("Assign Bed")
            .do("Set Bed Location", (t) => {
              let agent = t.agentConstants.find(a => a.id == myIndex);
              //agent.destination = new Vector3(self.waypoints[1]);
              //agent.addRoom(room);
              agent.addRoom(Vector3.fromObject(self.waypoints[0]));
              console.log("Assigning bed " + myIndex);

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