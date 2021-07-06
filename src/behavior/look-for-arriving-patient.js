import PatientState from "../support/patient-temp-state.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"


class LookForArrivingPatient {
  constructor(myIndex) {
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
    this.index = myIndex;


    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference


    this.tree = builder
      .sequence("Look For Arriving Patient")
      .do("Look For Arriving Patient", t => {
        let agentConstant = Hospital.agents.find(a => a.id == self.index);
        let myLocation = me().location; // last location

        let agentConstantPatients = Hospital.agents.filter(a=>a.name == "patient" && t.crowd.some(t=>t.id==a.id) && a.location);

        //let closestPatients = agentConstantPatients.sort((a, b) => Vector3.fromObject(a.location).distanceTo(myLocation) - Vector3.fromObject(b.location).distanceTo(myLocation));
        let closestPatients = agentConstantPatients.sort((a, b) => Vector3.fromObject(a.location).distanceToSquared(myLocation) - Vector3.fromObject(b.location).distanceToSquared(myLocation));
        let closeEmergencyPatients = closestPatients.filter(a=>a.getSeverity() == "ESI1");
        let closestPatient = closestPatients[0] || null;

        // if (closeEmergencyPatients.length > 0) {
        //   closestPatient = closeEmergencyPatients[0] || null;
        //   // WORKS FOR PATIENTS AT AMBULANCE ENTRANCE BUT NOT IMMEDIATELY
        //   //if (closestPatient == null || Vector3.fromObject(closestPatient.location).distanceTo(myLocation) > 3 || closestPatient.patientTempState != PatientState.ARRIVED || closestPatient.inSimulation != true) {
        //   if (closestPatient == null || closestPatient.patientTempState != PatientState.ARRIVED || closestPatient.inSimulation != true) {
        //     closestPatient = closestPatients[0] || null;
        //   }
        //   else {
        //     closestPatient.patientTempState = PatientState.WAITING;
        //     closestPatient.instructor = me();
        //     //me().currentPatient = closestPatient;
        //     if (!me().PatientList.includes(closestPatient)) {
        //       me().PatientList.push(closestPatient);
        //     }

        //     return fluentBehaviorTree.BehaviorTreeStatus.Success
        //   }
        // }

        // if (closestPatient == null || Vector3.fromObject(closestPatient.location).distanceTo(myLocation) > 3 || closestPatient.patientTempState != PatientState.ARRIVED) {
        //   return fluentBehaviorTree.BehaviorTreeStatus.Running;
        // }

        // //We found our patient
        // closestPatient.patientTempState = PatientState.WAITING;
        // closestPatient.instructor = me();
        // //me().currentPatient = closestPatient;
        // if (!me().PatientList.includes(closestPatient)) {
        //   me().PatientList.push(closestPatient);
        // }

        // ADD EMERGENCY PATIENTS TO THE FRONT
        if (closeEmergencyPatients.length > 0) {
          for (let i = 0; i < closeEmergencyPatients.length; i++) {
            if (closeEmergencyPatients[i] != null && closeEmergencyPatients[i].inSimulation == true && closeEmergencyPatients[i].patientTempState == PatientState.ARRIVED && !me().PatientList.includes(closeEmergencyPatients[i])) {
              closeEmergencyPatients[i].patientTempState = PatientState.WAITING;
              closeEmergencyPatients[i].instructor = me();
              me().PatientList.unshift(closeEmergencyPatients[i]);
            }
          }
        }
        // ADD OTHER PATIENTS TO THE BACK
        //if (closestPatient != null && closestPatient.inSimulation == true && Vector3.fromObject(closestPatient.location).distanceTo(myLocation) < 3 && closestPatient.patientTempState == PatientState.ARRIVED) {
        if (closestPatient != null && closestPatient.inSimulation == true && Vector3.fromObject(closestPatient.location).distanceToSquared(myLocation) < 9 && closestPatient.patientTempState == PatientState.ARRIVED) {
          for (let i = 0; i < closestPatients.length; i++) {
            //if (closestPatients[i] != null && Vector3.fromObject(closestPatients[i].location).distanceTo(myLocation) < 3 && closestPatients[i].patientTempState == PatientState.ARRIVED && !me().PatientList.includes(closestPatients[i])) {
            if (closestPatients[i] != null && Vector3.fromObject(closestPatients[i].location).distanceToSquared(myLocation) < 9 && closestPatients[i].patientTempState == PatientState.ARRIVED && !me().PatientList.includes(closestPatients[i])) {
              closestPatients[i].patientTempState = PatientState.WAITING;
              closestPatients[i].instructor = me();
              me().PatientList.push(closestPatients[i]);
            }
          }
        }
        // IF THERE ARE NO PATIENTS WAITING, KEEP LOOKING
        if (me().PatientList.length == 0) {
          return fluentBehaviorTree.BehaviorTreeStatus.Running;
        }

        return fluentBehaviorTree.BehaviorTreeStatus.Success;

      })
      .end()
      .build()
  }

}

export default LookForArrivingPatient;