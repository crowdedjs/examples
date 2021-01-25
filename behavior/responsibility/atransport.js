import AResponsibility from "./aresponsibility.js"
import ResponsibilitySubject from "./responsibility-subject.js"


class ATransportResponsibility extends AResponsibility {

  room;


  getRoom() {
    return this.room;
  }


  setRoom(room) {
    this.room = room;
  }


  constructor(name, entry, medician, location) {
    super(name, 1, entry, 4, ResponsibilitySubject.PATIENT, medician);
    this.room = location;
  }


  doWork(amount) {
    if (!this.calledStarted) {
      this.calledStarted = true;
      this.start();
    }

    let distance = entry.getPatient().getLocation().distanceTo(room.getLocation());

    if (distance < 1 && !this.calledFinished) {
      this.calledFinished = true;
      this.getMedician().setCurrentPatient(null);
      entry.getPatient().setPatientTempState(PatientTempState.GO_INTO_ROOM);
      entry.getPatient().setAssignedRoom(room);
      this.finish();
      this.remaining = 0;
    }
  }
}

export default ATransportResponsibility;