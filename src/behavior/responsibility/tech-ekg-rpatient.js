import ATransportResponsibility from "./atransport.js"
import ACK from "./ack.js"

class TechEKGTakePatientToResponsibility extends ATransportResponsibility {

	constructor(entry, medicalStaff, location) {
		super("Tech EKG Take Patient To", entry, medicalStaff, location);

	}

	doFinish() {
		this.entry.addUnacknowledged(ACK.CT_CAT_DO_SCAN);
		
	}

}

export default TechEKGTakePatientToResponsibility;