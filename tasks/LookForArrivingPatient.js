import Vector3 from "../behavior/Vector3";
import { Vector2 } from "../lib/three.module";
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
        let simulationAgent = t.frame.find(a => a.id == self.index);
        let myLocation = new Vector3(simulationAgent.x, simulationAgent.y, simulationAgent.z);

        let closestPatients = t.frame.filter(p => p.name == "Patient")
          .sort((a, b) => Vector3.fromObject(a).distanceTo(myLocation) - Vector3.fromObject(b).distanceTo(myLocation))
        let closestPatient = closestPatients[0] || null;
        if (closestPatient == null || Vector3.fromXYZ(closestPatient).distanceTo(myLocation) > 1)
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

}

export default LookForArrivingPatient;