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
          let patientLocation = Vector3.fromObject(t.crowd.find(f=>f.id == myPatient.id).location);

          //if (myLocation.distanceTo(patientLocation) > 8) {
          if (myLocation.distanceToSquared(patientLocation) > 64) {
            me().destination = Vector3.fromObject(patientLocation);
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
        
        // if (me().MedicalStaffSubclass == "Triage Nurse") {
        //   console.log(Vector3.fromObject(next));
        // }
        
        agent.destination = next;
        let simulationAgent = t.crowd.find(a=>a.id == self.index);
        let loc = new Vector3(simulationAgent.location.x, simulationAgent.location.y, simulationAgent.location.z);
        let waypoint = Vector3.fromObject(self.locationFunction());

        let difference = Vector3.subtract(loc, waypoint);
        //let distanceToWaypoint = difference.length();
        let distanceToWaypoint = difference.lengthSquared();

        if (me().MedicalStaffSubclass == "Triage Nurse") {
          let myPatient = me().getCurrentPatient();
          let patientLocation = Vector3.fromObject(t.crowd.find(f=>f.id == myPatient.id).location);
          
          //if (myPatient.idx > 24) {
            //console.log("My Location: " + loc);
            //console.log("Location of patient number " + myPatient.idx + ": " + patientLocation);
            //console.log("My destination: " + Vector3.fromObject(next));
          //}

          let differencePatient = Vector3.subtract(loc, patientLocation);
          //let distanceToPatient = differencePatient.length();
          let distanceToPatient = differencePatient.lengthSquared();

          //if (distanceToWaypoint < 2 && distanceToPatient < 2) {
          if (distanceToWaypoint < 4 && distanceToPatient < 4) {
            agent.destination = new Vector3(loc.x, loc.y, loc.z);
            frameAgentDetail.pose = "Idle";
            return fluentBehaviorTree.BehaviorTreeStatus.Success;
          }
          //else if (distanceToPatient < 5) {
          else if (distanceToPatient < 25) {
            agent.destination = next;
            //console.log(distanceToPatient);
          }
          else {
            agent.destination = patientLocation;
            //console.log(agent.destination);
          }
          
        }
        //else if (distanceToWaypoint < 2) {
        else if (distanceToWaypoint < 4) {
          agent.destination = new Vector3(loc.x, loc.y, loc.z);
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
