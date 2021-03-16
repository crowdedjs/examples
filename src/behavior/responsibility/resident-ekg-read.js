import ResponsibilitySubject from "./responsibility-subject.js"
import AResponsibility from "./aresponsibility.js"
import ACK from "./ack.js"


class ResidentEKGRead extends AResponsibility {
	
	constructor(entry, medicalStaff) {
		super("Resident EKG Read", 1 * 1, entry, 4, ResponsibilitySubject.COMPUTER, medicalStaff);
	}

	doFinish() {
		this.entry.acknowledge(ACK.RESIDENT_EKG_READ);
		this.entry.addUnacknowledged(ACK.RESIDENT_EKG_CONSULT);

	}
}

export default ResidentEKGRead;