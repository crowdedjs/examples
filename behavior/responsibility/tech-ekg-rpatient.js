import ATransportResponsibility from "./atransport.js"

class TechEKGTakePatientToResponsibility extends ATransportResponsibility {

	constructor(entry, medician, location) {
		super("Tech EKG Take Patient To", entry, medician, location);

	}

	doFinish() {
		this.entry.addUnacknowledged(ACK.CT_CAT_DO_SCAN);
		
	}

}

export default TechEKGTakePatientToResponsibility;