import PatientState from "../support/PatientTempState.js";

class LookForArrivingPatient {
  constructor(myIndex, locations) {
    //this.me = agent;
    this.me= ()=>Hospital.agents.find(a=>a.id == myIndex);
    this.index = myIndex;


    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference


    this.tree = builder
      .sequence("Look For Arriving Patient")
      .do("Look For Arriving Patient", t => {
        // let me = t.agentConstantPatients.find(t.)
        let agentConstant = Hospital.agents.find(a => a.id == self.index);
        let myLocation = agentConstant.locations.slice(-1); // last location

        let agentConstantPatients = Hospital.agents.filter(a=>a.name == "patient" && t.crowd.some(t=>t.id==a.id));
        
        
        let closestPatients = agentConstantPatients
          .sort((a, b) => a.locations.slice(-1).distanceTo(myLocation) - b.locations.slice(-1).distanceTo(myLocation))
        let closestPatient = closestPatients[0] || null;
        if (closestPatient == null || Vector3.fromObject(closestPatient.locations.slice(-1)).distanceTo(myLocation) > 3)
          return fluentBehaviorTree.BehaviorTreeStatus.Running;
        //We found our patient
        closestPatient.patientTempState = PatientState.WAITING;
        closestPatient.instructor = self.me();
        self.me().currentPatient = closestPatient;
        return fluentBehaviorTree.BehaviorTreeStatus.Success
        



      })
      .end()
      .build()
  }

}

export default LookForArrivingPatient;