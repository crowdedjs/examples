import ResponsibilitySubject from "./responsibility-subject.js"
import AResponsibility from "./aresponsibility.js"
import ACK from "./ack.js"


class ResidentScanRead extends AResponsibility {
	
	constructor(entry, medicalStaff) {
		super("Resident Scan Read", 1 * 1, entry, 4, ResponsibilitySubject.COMPUTER, medicalStaff);
	}

	doFinish() {
		this.entry.acknowledge(ACK.RESIDENT_SCAN_READ);
		this.entry.addUnacknowledged(ACK.RESIDENT_ATTENDING_CONSULT);

	}
}

export default ResidentScanRead;