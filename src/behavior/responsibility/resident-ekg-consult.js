import ResponsibilitySubject from "./responsibility-subject.js"
import AResponsibility from "./aresponsibility.js"
import ACK from "./ack.js"

class ResidentEKGConsult extends AResponsibility {
	
	constructor(entry, medicalStaff) {
		super("Resident EKG Consult", 1 * 1, entry, 4, ResponsibilitySubject.PATIENT, medicalStaff);
	}

	doFinish() {
		this.entry.acknowledge(ACK.RESIDENT_EKG_CONSULT);
		this.entry.addUnacknowledged(ACK.RESIDENT_EKG_ORDER_CAT);

	}
}

export default ResidentEKGConsult;