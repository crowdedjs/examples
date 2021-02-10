import PatientState from "../support/patient-temp-state.js";

class LookForArrivingPatient {
  constructor(myIndex) {
    //this.me = agent;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
    this.index = myIndex;


    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference


    this.tree = builder
      .sequence("Look For Arriving Patient")
      .do("Look For Arriving Patient", t => {
        // let me = t.agentConstantPatients.find(t.)
        let agentConstant = Hospital.agents.find(a => a.id == self.index);
        let myLocation = me().location; // last location

        let agentConstantPatients = Hospital.agents.filter(a=>a.name == "patient" && t.crowd.some(t=>t.id==a.id) && a.location);
        
        
        let closestPatients = agentConstantPatients
          .sort((a, b) => Vector3.fromObject(a.location).distanceTo(myLocation) - Vector3.fromObject(b.location).distanceTo(myLocation))
        let closestPatient = closestPatients[0] || null;
        if (closestPatient == null || Vector3.fromObject(closestPatient.location).distanceTo(myLocation) > 3)
          return fluentBehaviorTree.BehaviorTreeStatus.Running;
        //We found our patient
        closestPatient.patientTempState = PatientState.WAITING;
        closestPatient.instructor = me();
        me().currentPatient = closestPatient;
        return fluentBehaviorTree.BehaviorTreeStatus.Success
        



      })
      .end()
      .build()
  }

}

export default LookForArrivingPatient;