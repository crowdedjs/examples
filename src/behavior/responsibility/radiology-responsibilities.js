import AResponsibilityFactory from "./aresponsibility-factory.js"
import RadiologyReviewScanResponsibilities from "./radiology-review-scan-responsibility.js"
import ACK from "./ack.js"


class RadiologyResponsibilities extends AResponsibilityFactory{

	get(entry, medicalStaff) {

		if (Hospital.emergencyQueue.length > 0) {
			let emergencyPatients = Hospital.computer.entries.filter(i=>i.getPatient().getSeverity() == "ESI1");
			for (let i = 0; i < emergencyPatients.length; i++) {
				let emergencyPatient = emergencyPatients[i];
				if(emergencyPatient.unacknowledged(ACK.RADIOLOGY_REVIEW_SCAN)) {
					return new RadiologyReviewScanResponsibilities(emergencyPatient, medicalStaff);
				}
			}
		}

		if(entry.unacknowledged(ACK.RADIOLOGY_REVIEW_SCAN)) {
			return new RadiologyReviewScanResponsibilities(entry, medicalStaff);
		}
		
		return null;
	}

}

export default RadiologyResponsibilities;