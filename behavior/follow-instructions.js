import PatientTempState from "../support/patient-temp-state.js";

class FollowInstructions {

  constructor(myIndex, locations) {
    //this.me = agent;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
    
    this.index = myIndex;


    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference


    this.tree = builder
      .sequence("Follow Instructions")
      .do("Follow Instructions", t => {
        let agentConstant = Hospital.agents.find(a => a.id == self.index);
        
        let idx = Hospital.agents[self.index].idx;
        let simulationAgent = t.crowd.find(f=>f.id == idx);
        let loc = new Vector3(simulationAgent.location.x, simulationAgent.location.y, simulationAgent.location.z);
        let state = me().getPatientTempState();

        if (state == PatientTempState.WAITING) {
          agentConstant.destination = new Vector3(loc.x, loc.y, loc.z);

        }
        else if (state == PatientTempState.FOLLOWING) {
          let instructor = me().getInstructor();
          let instructorLoc = Vector3.fromObject(t.crowd.find(f=>f.id == instructor.idx).location);
          let instructorLocation = instructorLoc;
          let myLocation = loc;
          if (myLocation.distanceTo(instructorLocation) < 1) // If we're really close, stop
          {
            agentConstant.destination = new Vector3(loc.x, loc.y, loc.z);//Stop
          }
          else {
            //Head toward the instructor, but don't collide
            let towardMe = Vector3.subtract(instructorLocation, myLocation);
            towardMe.normalize();
            let destination = Vector3.add(instructorLocation, towardMe);
            agentConstant.destination = destination;
          }
        }
        else if (state == PatientTempState.GO_INTO_ROOM) {
          let destination = me().getAssignedRoom().getLocation();
          if(Vector3.fromObject(destination).distanceTo(me().getLocation()) < .5){
            me().setPatientTempState(PatientTempState.WAITING)
          }
          else{
            me().setDestination(destination);
          }
        }
        else {
          console.log("Invalid patient temp state " + state);
        }


        return fluentBehaviorTree.BehaviorTreeStatus.Running;
      })
      
      .end()
      .build();
  }



}

export default FollowInstructions;