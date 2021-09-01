import ResponsibilitySubject from "./responsibility-subject.js"
import AResponsibility from "./aresponsibility.js"
import ACK from "./ack.js"

class ResidentEKGConsult extends AResponsibility {
	
	constructor(entry, medicalStaff) {
		super("Resident EKG Consult", 1 * 1, entry, 4, ResponsibilitySubject.PATIENT, medicalStaff);
	}

	doFinish() {
		this.entry.acknowledge(ACK.RESIDENT_EKG_CONSULT);
		// THE PARAMETERS OF THIS WILL CHANGE
		if (this.entry.getPatient().getSeverity() == "ESI3") {
			this.entry.addUnacknowledged(ACK.RESIDENT_EKG_ORDER_XRAY);
		}
		else {
			this.entry.addUnacknowledged(ACK.RESIDENT_EKG_ORDER_CAT);
		}
		//this.entry.addUnacknowledged(ACK.NURSE_DISCHARGE_PATIENT);

	}
}

export default ResidentEKGConsult;