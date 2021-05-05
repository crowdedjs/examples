import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class GoToLazy{

  constructor(myIndex, f)  {
    this.index = myIndex;
    this.locationFunction = f;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    this.tree = builder
      .sequence("Go To Lazy")
      //Set the destination. This is a one-shot behavior since we only want to
      //update the return value once
      .do("Set destination goal lazy", (t) => {
        let agent = Hospital.agents.find(a=>a.id==self.index);
        let next = self.locationFunction();
        agent.destination = Vector3.fromObject(next)

        // need to make sure the triage nurse stops leaving the patients behind
        if (me().MedicalStaffSubclass == "Triage Nurse") {
          let simulationAgent = t.crowd.find(a=>a.id == self.index);
          let loc = new Vector3(simulationAgent.location.x, simulationAgent.location.y, simulationAgent.location.z);
          let myLocation = loc;
          let myPatient = me().getCurrentPatient();
          let patientLocation = Vector3.fromObject(t.crowd.find(f=>f.id == myPatient.idx).location);

          if (myLocation.distanceTo(patientLocation) > 8) {
            //console.log("patientLocation: " + patientLocation);
            //console.log("destination before: " + me().destination);
            me().destination = Vector3.fromObject(patientLocation);
            //console.log("destination after: " + me().destination);
          }
        }

        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      //Now return null as we head to that destination
      //We return running until we're close to it.
      .do("Traveling to goal lazy", (t) => {        
        let agent = Hospital.agents.find(a=>a.id==self.index);
        let frameAgentDetail = t.crowd.find(a=>a.id == self.index);
        let next = self.locationFunction();
        
        agent.destination = next;
        let simulationAgent = t.crowd.find(a=>a.id == self.index);
        let loc = new Vector3(simulationAgent.location.x, simulationAgent.location.y, simulationAgent.location.z);
        let waypoint = Vector3.fromObject(self.locationFunction());

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


}

export default GoToLazy;
