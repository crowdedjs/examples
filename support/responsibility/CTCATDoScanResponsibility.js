import ResponsibilitySubject from "./ResponsibilitySubject.js"

class CTCATDoScanResponsibility extends AResponsibility  {
	
	constructor(entry, medician) {
		super("CT CAT Do Scan", 1 * 60, entry, 4, ResponsibilitySubject.COMPUTER, medician);
	}

	doFinish() {
		entry.acknowledge(ACK.CT_CAT_DO_SCAN);
		entry.addUnacknowledged(ACK.CT_PICKUP);
		
	}

	
}

export default CTCATDoScanResponsibility;