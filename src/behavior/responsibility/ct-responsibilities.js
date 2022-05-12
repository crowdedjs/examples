import AResponsibilityFactory from "./aresponsibility-factory.js"
import CTCATDoScanResponsibility from "./ct-cat-do.js"
import ACK from "./ack.js"


class CTResponsibilities extends AResponsibilityFactory{

	get(entry, medicalStaff) {

		medicalStaff.amIdle = false;

		if (Hospital.emergencyQueue.length > 0) {
			let emergencyPatients = Hospital.computer.entries.filter(i=>i.getPatient().getSeverity() == "ESI1");
			for (let i = 0; i < emergencyPatients.length; i++) {
				let emergencyPatient = emergencyPatients[i];
				if(emergencyPatient.unacknowledged(ACK.CT_CAT_DO_SCAN)) {
					return new CTCATDoScanResponsibility(emergencyPatient, medicalStaff);
				}
			}
		}
	
		if(entry.unacknowledged(ACK.CT_CAT_DO_SCAN)) {
			// Hospital.setCTOccupied(true);
			// if (Hospital.isCT1Occupied()) {
			// 	Hospital.setCT2Occupied(true);
			// 	entry.getPatient().setImagingRoom("CT 2");
			// }
			// else {
			// 	Hospital.setCT1Occupied(true);
			// 	entry.getPatient().setImagingRoom("CT 1");
			// }
			return new CTCATDoScanResponsibility(entry, medicalStaff);
		}
		
		medicalStaff.amIdle = true;

		return null;
	}

}

export default CTResponsibilities;