import PatientState from "../support/patient-temp-state.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"


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

        // check for any ESI1 patients
        // let emergencyPatients = agentConstantPatients.filter(a=>a.getSeverity() == "ESI1");
        // if (emergencyPatients.length > 0) {
        //   let closestPatients = emergencyPatients.sort((a, b) => Vector3.fromObject(a.location).distanceTo(myLocation) - Vector3.fromObject(b.location).distanceTo(myLocation));
        //   let closestPatient = closestPatients[0] || null;
        //   if (closestPatient == null || Vector3.fromObject(closestPatient.location).distanceTo(myLocation) > 3 || closestPatient.patientTempState != PatientState.ARRIVED)
        //     return fluentBehaviorTree.BehaviorTreeStatus.Running;
        // }
        // else {
        //   let closestPatients = agentConstantPatients
        //     .sort((a, b) => Vector3.fromObject(a.location).distanceTo(myLocation) - Vector3.fromObject(b.location).distanceTo(myLocation))
        //   let closestPatient = closestPatients[0] || null;
        //   if (closestPatient == null || Vector3.fromObject(closestPatient.location).distanceTo(myLocation) > 3 || closestPatient.patientTempState != PatientState.ARRIVED)
        //     return fluentBehaviorTree.BehaviorTreeStatus.Running;
        // }
        let closestPatients = agentConstantPatients.sort((a, b) => Vector3.fromObject(a.location).distanceTo(myLocation) - Vector3.fromObject(b.location).distanceTo(myLocation));
        //let closestPatientsCopy = closestPatients;
        let closeEmergencyPatients = closestPatients.filter(a=>a.getSeverity() == "ESI1");
        let closestPatient = closestPatients[0] || null;

        if (closeEmergencyPatients.length > 0) {
          closestPatient = closeEmergencyPatients[0] || null;
          // WORKS FOR PATIENTS AT AMBULANCE ENTRANCE BUT NOT IMMEDIATELY
          //if (closestPatient == null || Vector3.fromObject(closestPatient.location).distanceTo(myLocation) > 3 || closestPatient.patientTempState != PatientState.ARRIVED || closestPatient.inSimulation != true) {
          if (closestPatient == null || closestPatient.patientTempState != PatientState.ARRIVED || closestPatient.inSimulation != true) {
            closestPatient = closestPatients[0] || null;
          }
          else {
            closestPatient.patientTempState = PatientState.WAITING;
            closestPatient.instructor = me();
            //me().currentPatient = closestPatient;
            if (!me().PatientList.includes(closestPatient)) {
              me().PatientList.push(closestPatient);
            }

            return fluentBehaviorTree.BehaviorTreeStatus.Success
          }
        }

        if (closestPatient == null || Vector3.fromObject(closestPatient.location).distanceTo(myLocation) > 3 || closestPatient.patientTempState != PatientState.ARRIVED) {
          return fluentBehaviorTree.BehaviorTreeStatus.Running;
        }

        //We found our patient
        closestPatient.patientTempState = PatientState.WAITING;
        closestPatient.instructor = me();
        //me().currentPatient = closestPatient;
        if (!me().PatientList.includes(closestPatient)) {
          me().PatientList.push(closestPatient);
        }

        return fluentBehaviorTree.BehaviorTreeStatus.Success;

      })
      .end()
      .build()
  }

}

export default LookForArrivingPatient;