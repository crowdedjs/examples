import AResponsibilityFactory from "./aresponsibility-factory.js"
import ACK from "./ack.js"


class XRayResponsibilities extends AResponsibilityFactory{

	get(entry, medicalStaff) {

		medicalStaff.amIdle = false;

		if (Hospital.emergencyQueue.length > 0 && Hospital.aTeam[5] == medicalStaff) {
			let emergencyPatients = Hospital.computer.entries.filter(i=>i.getPatient().getSeverity() == "ESI1");
			for (let i = 0; i < emergencyPatients.length; i++) {
				let emergencyPatient = emergencyPatients[i];
				if(emergencyPatient.unacknowledged(ACK.XRAY_DO_SCAN)) {
					return new XRayDoScanResponsibility(emergencyPatient, medicalStaff);
				}
			}
		}
	
		if(entry.unacknowledged(ACK.XRAY_DO_SCAN)) {
			return new XRayDoScanResponsibility(entry, medicalStaff);
		}
		
		medicalStaff.amIdle = true;

		return null;
	}

}

export default XRayResponsibilities;