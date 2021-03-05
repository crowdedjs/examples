import AResponsibility from "./aresponsibility.js"
import ResponsibilitySubject from "./responsibility-subject.js"
import PatientTempState from "../../support/patient-temp-state.js"

class ATransportResponsibility extends AResponsibility {

  room;


  getRoom() {
    return this.room;
  }


  setRoom(room) {
    this.room = room;
  }


  constructor(name, entry, medicalStaff, location) {
    super(name, 1, entry, 4, ResponsibilitySubject.PATIENT, medicalStaff);
    this.room = location;
  }


  doWork(amount) {
    if (!this.calledStarted) {
      this.calledStarted = true;
      this.start();
    }

    let distance = Vector3.fromObject(this.entry.getPatient().getLocation()).distanceTo(this.room.getLocation());

    if (distance < 1.5 && !this.calledFinished) {
      this.calledFinished = true;
      this.getMedicalStaff().setCurrentPatient(null);
      this.entry.getPatient().setPatientTempState(PatientTempState.GO_INTO_ROOM);
      this.entry.getPatient().setAssignedRoom(this.room);
      this.finish();
      this.remaining = 0;
    }
  }
}

export default ATransportResponsibility;