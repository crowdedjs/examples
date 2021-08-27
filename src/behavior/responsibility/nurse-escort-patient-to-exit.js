import ATransportResponsibility from "./atransport.js"
import ACK from "./ack.js"
import PatientTempState from "../../support/patient-temp-state.js";

class NurseEscortPatientToExit extends ATransportResponsibility {


  constructor(entry, medicalStaff) {
    super("Nurse Escort Patient To Exit", entry, medicalStaff, Hospital.locations.find(i=>i.name == "Main Entrance"));
  }

  doFinish() {
    this.entry.acknowledge(ACK.NURSE_ESCORT_PATIENT_TO_EXIT);
    this.entry.getPatient().setPatientTempState(PatientTempState.DONE);
    for (let i = 0; i < Hospital.emergencyQueue.length; i++) {
      if (this.entry.getPatient() == Hospital.emergencyQueue[i]) {
        Hospital.emergencyQueue.splice(i, 1);
      }
    }
  }
}

export default NurseEscortPatientToExit;