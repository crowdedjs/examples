import AResponsibility from "./aresponsibility.js"
import ResponsibilitySubject from "./responsibility-subject.js"
import ACK from "./ACK.js"

class ResidentAttendingConsult extends AResponsibility {

	constructor(entry, medicalStaff) {
		super("Resident Attending Consult", 1 /* seconds */, entry, 5, ResponsibilitySubject.ATTENDING, medicalStaff);
		// TODO Auto-generated constructor stub
	}

	doFinish() {
		this.entry.acknowledge(ACK.RESIDENT_ATTENDING_CONSULT);
		this.entry.addUnacknowledged(ACK.RESIDENT_CONSULT_PATIENT);

	}
}

export default ResidentAttendingConsult;