import ResponsibilitySubject from "./responsibility-subject.js"
import AResponsibility from "./aresponsibility.js"
import ACK from "./ack.js"

class RadiologyReviewScanResponsibilities extends AResponsibility {
	
	constructor(entry, medicalStaff) {
		super("Radiology Review Scan Responsibility", 1 * 1, entry, 4, ResponsibilitySubject.COMPUTER, medicalStaff);
	}

	doFinish() {
		this.entry.acknowledge(ACK.RADIOLOGY_REVIEW_SCAN);
		this.entry.addUnacknowledged(ACK.RESIDENT_SCAN_READ);

	}
}

export default RadiologyReviewScanResponsibilities;