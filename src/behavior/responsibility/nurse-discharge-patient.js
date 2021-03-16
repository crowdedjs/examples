import AResponsibility from "./aresponsibility.js"
import ResponsibilitySubject from "./responsibility-subject.js"
import ACK from "./ack.js"

class NurseDischargePatient extends AResponsibility {

 constructor(entry, medicalStaff) {
   super("Nurse Discharge Patient", 1 * 1, entry, 4, ResponsibilitySubject.PATIENT, medicalStaff);
 }

 doFinish() {
  this.entry.acknowledge(ACK.NURSE_DISCHARGE_PATIENT);
  this.entry.addUnacknowledged(ACK.NURSE_ESCORT_PATIENT_TO_EXIT);
   
 }

 
}

export default NurseDischargePatient;