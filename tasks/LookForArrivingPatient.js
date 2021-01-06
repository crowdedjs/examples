import Vector3 from "../behavior/Vector3.js";
import PatientState from "../support/PatientTempState.js";

class LookForArrivingPatient {
  constructor(agent, myIndex) {
    this.me = agent;
    this.index = myIndex;


    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference


    this.tree = builder
      .sequence("Look For Arriving Patient")
      .do("Look For Arriving Patient", t => {
        // let me = t.agentConstantPatients.find(t.)
        let agentConstant = t.agentConstants.find(a => a.id == self.index);
        let myLocation = agentConstant.location;

        let agentConstantPatients = t.agentConstants.filter(a=>a.name == "patient" && t.frame.some(t=>t.id==a.id));
        
        // for(let i = 0; i < agentConstantPatients.length; i++){
        //   let agentConstantPatient = agentConstantPatients[i];
        //   //agentConstantPatient.location = Vector3.fromObject(t.frame.find(f=>f.id == agentConstantPatient.id));
        // }


        let closestPatients = agentConstantPatients
          .sort((a, b) => a.location.distanceTo(myLocation) - b.location.distanceTo(myLocation))
        let closestPatient = closestPatients[0] || null;
        if (closestPatient == null || Vector3.fromObject(closestPatient.location).distanceTo(myLocation) > 3)
          return fluentBehaviorTree.BehaviorTreeStatus.Running;
        //We found our patient
        closestPatient.patientState = PatientState.WAITING;
        closestPatient.instructor = me;
        this.me.currentPatient = closestPatient;
        return fluentBehaviorTree.BehaviorTreeStatus.Running;
        



      })
      .end()
      .build()
  }
  async update(agentConstants, positions, msec) {
    await this.tree.tick({ agentConstants, positions, msec }) //Call the behavior tree
}

}

export default LookForArrivingPatient;