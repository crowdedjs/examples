import AResponsibility from "./aresponsibility.js"
import ResponsibilitySubject from "./responsibility-subject.js"
import ACK from "./ack.js"

class ResidentPatientConsult extends AResponsibility {

	constructor(entry, medicalStaff) {
		super("Resident Consult Patient", 1 /* seconds */, entry, 5, ResponsibilitySubject.PATIENT, medicalStaff);
	}

	doFinish() {
		this.entry.acknowledge(ACK.RESIDENT_PATIENT_CONSULT);
		this.entry.addUnacknowledged(ACK.NURSE_DISCHARGE_PATIENT);

	}
}

export default ResidentPatientConsult;