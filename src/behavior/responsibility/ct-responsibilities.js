import AResponsibilityFactory from "./aresponsibility-factory.js"
import CTCATDoScanResponsibility from "./ct-cat-do.js"
import ACK from "./ack.js"


class CTResponsibilities extends AResponsibilityFactory{

get(entry, medicalStaff) {

		if(entry.unacknowledged(ACK.CT_CAT_DO_SCAN)) {
			// Hospital.setCTOccupied(true);
			// if (Hospital.isCT1Occupied()) {
			// 	Hospital.setCT2Occupied(true);
			// 	entry.getPatient().setCTRoom("CT 2");
			// }
			// else {
			// 	Hospital.setCT1Occupied(true);
			// 	entry.getPatient().setCTRoom("CT 1");
			// }
			return new CTCATDoScanResponsibility(entry, medicalStaff);
		}
		
		return null;
	}

}

export default CTResponsibilities;