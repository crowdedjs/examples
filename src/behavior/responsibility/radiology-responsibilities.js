import AResponsibilityFactory from "./aresponsibility-factory.js"
import RadiologyReviewScanResponsibilities from "./radiology-review-scan-responsibility.js"
import ACK from "./ack.js"


class RadiologyResponsibilities extends AResponsibilityFactory{

get(entry, medicalStaff) {

		if(entry.unacknowledged(ACK.RADIOLOGY_REVIEW_SCAN)) {
			return new RadiologyReviewScanResponsibilities(entry, medicalStaff);
		}
		
		return null;
	}

}

export default RadiologyResponsibilities;