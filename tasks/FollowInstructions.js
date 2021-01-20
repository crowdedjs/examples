import PatientTempState from "../support/PatientTempState.js";
import Vector3 from "../behavior/Vector3.js"

class FollowInstructions {

  constructor(agent, myIndex) {
    this.me = agent;
    this.index = myIndex;


    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference


    this.tree = builder
      .sequence("Follow Instructions")
      .do("Follow Instructions", t => {
        let agentConstant = t.agentConstants.find(a => a.id == self.index);
        
        let idx = t.agentConstants[self.index].idx;
        let simulationAgent = t.frame.find(f=>f.id == idx);
        let loc = new Vector3(simulationAgent.x, simulationAgent.y, simulationAgent.z);
        let state = agentConstant.getPatientTempState();

        if (state == PatientTempState.WAITING) {
          agent.destination = new Vector3(loc.x, loc.y, loc.z);

        }
        else if (state == PatientTempState.FOLLOWING) {
          let instructor = me.getInstructor();
          let instructorLocation = instructor.getLocation();
          let myLocation = me.getLocation();
          if (myLocation.distanceTo(instructorLocation) < 1) // If we're really close, stop
          {
            agent.destination = new Vector3(loc.x, loc.y, loc.z);//Stop
          }
          else {
            //Head toward the instructor, but don't collide
            let towardMe = Vector3.subtract(instructorLocation, myLocation);
            towardMe.normalize();
            let destination = Point3.add(instructorLocation, towardMe);
            agent.setDestination(destination);
          }
        }
        else if (state == PatientTempState.GO_INTO_ROOM) {

        }
        else {
          console.log("Invalid patient temp state " + PatientTempState);
        }


        return fluentBehaviorTree.BehaviorTreeStatus.Running;
      })
      
      .end()
      .build();
  }


  async update(agent, agentConstants, frame, msec) {
    this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ agentConstants, frame, msec }) //Call the behavior tree
    return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default FollowInstructions;