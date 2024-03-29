import ResponsibilitySubject from "./responsibility-subject.js"
import AResponsibility from "./aresponsibility.js"
import ACK from "./ack.js"

class XRayDoScanResponsibility extends AResponsibility  {
	
	constructor(entry, medicalStaff) {
		super("XRay Do Scan", 1 * 1, entry, 4, ResponsibilitySubject.COMPUTER, medicalStaff);
	}

	doFinish() {
		this.entry.acknowledge(ACK.XRAY_DO_SCAN);
		this.entry.addUnacknowledged(ACK.XRAY_PICKUP);
		this.entry.addUnacknowledged(ACK.RADIOLOGY_REVIEW_SCAN)
		
	}

	
}

export default XRayDoScanResponsibility;