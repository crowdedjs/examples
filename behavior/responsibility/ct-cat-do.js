import ResponsibilitySubject from "./responsibility-subject.js"
import AResponsibility from "./AResponsibility.js"
import ACK from "./ACK.js"

class CTCATDoScanResponsibility extends AResponsibility  {
	
	constructor(entry, medicalStaff) {
		super("CT CAT Do Scan", 1 * 1, entry, 4, ResponsibilitySubject.COMPUTER, medicalStaff);
	}

	doFinish() {
		this.entry.acknowledge(ACK.CT_CAT_DO_SCAN);
		this.entry.addUnacknowledged(ACK.CT_PICKUP);
		
	}

	
}

export default CTCATDoScanResponsibility;