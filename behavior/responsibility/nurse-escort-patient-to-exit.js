import ATransportResponsibility from "./atransport.js"
import ACK from "./ack.js"

class NurseEscortPatientToExit extends ATransportResponsibility {


  constructor(entry, medicalStaff) {
    super("Nurse Escort Patient To Exit", entry, medicalStaff, Hospital.locations.find(i=>i.name == "Main Entrance"));
  }

  doFinish() {
    this.entry.acknowledge(ACK.NURSE_ESCORT_PATIENT_TO_EXIT);
  }
}

export default NurseEscortPatientToExit;