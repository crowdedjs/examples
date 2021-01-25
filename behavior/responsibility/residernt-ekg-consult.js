import ResponsibilitySubject from "./responsibility-subject.js"

class ResidentEKGConsult extends AResponsibility {
	
	constructor(entry, medician) {
		super("Resident EKG Consult", 1 * 60, entry, 4, ResponsibilitySubject.PATIENT, medician);
	}

	doFinish() {
		entry.acknowledge(ACK.RESIDENT_EKG_CONSULT);
		entry.addUnacknowledged(ACK.RESIDENT_EKG_ORDER_CAT);

	}
}

export default ResidentEKGConsult;