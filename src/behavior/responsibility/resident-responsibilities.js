import AResponsibilityFactory from "./aresponsibility-factory.js"
import ACK from "./ack.js"
import ResidentEKGRead from "./resident-ekg-read.js"
import ResidentEKGConsult from "./resident-ekg-consult.js"
import ResidentEKGOrderCAT from "./resident-ekg-order-cat.js"
import ResidentScanRead from "./resident-scan-read.js"
import ResidentAttendingConsult from "./resident-attending-consult.js"
import ResidentPatientConsult from "./resident-patient-consult.js"

class ResidentResponsibilities extends AResponsibilityFactory {

	get(entry, medicalStaff) {

		if (entry.unacknowledged(ACK.RESIDENT_EKG_READ)) 
			return new ResidentEKGRead(entry, medicalStaff);
		else if (entry.unacknowledged(ACK.RESIDENT_EKG_CONSULT)) 
			return new ResidentEKGConsult(entry, medicalStaff);
		else if (entry.unacknowledged(ACK.RESIDENT_EKG_ORDER_CAT))
			return new ResidentEKGOrderCAT(entry, medicalStaff);
		else if (entry.unacknowledged(ACK.RESIDENT_SCAN_READ))
			return new ResidentScanRead(entry, medicalStaff);
		else if (entry.unacknowledged(ACK.RESIDENT_ATTENDING_CONSULT))
			return new ResidentAttendingConsult(entry, medicalStaff)
		else if(entry.unacknowledged(ACK.RESIDENT_PATIENT_CONSULT))
			return new ResidentPatientConsult(entry, medicalStaff);

		return null;
	}
}

export default ResidentResponsibilities;