import AResponsibilityFactory from "./aresponsibility-factory.js"
import ACK from "./ack.js"
import ResidentEKGRead from "./resident-ekg-read.js"
import ResidentEKGConsult from "./resident-ekg-consult.js"
import ResidentEKGOrderXRay from "./resident-ekg-order-xray.js"
import ResidentEKGOrderCAT from "./resident-ekg-order-cat.js"
import ResidentScanRead from "./resident-scan-read.js"
import ResidentAttendingConsult from "./resident-attending-consult.js"
import ResidentPatientConsult from "./resident-patient-consult.js"

class ResidentResponsibilities extends AResponsibilityFactory {

	get(entry, medicalStaff) {
		
		if (Hospital.aTeam[1] == null) {
			Hospital.aTeam[1] = medicalStaff;
		}
		
		if (Hospital.emergencyQueue.length > 0 && Hospital.aTeam[1] == medicalStaff) {
			let emergencyPatients = Hospital.computer.entries.filter(i=>i.getPatient().getSeverity() == "ESI1");
			for (let i = 0; i < emergencyPatients.length; i++) {
				let emergencyPatient = emergencyPatients[i];
				emergencyPatient.setResident(medicalStaff);
				
				if (emergencyPatient.unacknowledged(ACK.RESIDENT_EKG_READ)) {
					return new ResidentEKGRead(emergencyPatient, medicalStaff);
				}
				else if (emergencyPatient.unacknowledged(ACK.RESIDENT_EKG_CONSULT)) {
					return new ResidentEKGConsult(emergencyPatient, medicalStaff);
				}
				else if (emergencyPatient.unacknowledged(ACK.RESIDENT_EKG_ORDER_XRAY)) {
					return new ResidentEKGOrderXRay(emergencyPatient, medicalStaff);
				}
				else if (emergencyPatient.unacknowledged(ACK.RESIDENT_EKG_ORDER_CAT)) {
					return new ResidentEKGOrderCAT(emergencyPatient, medicalStaff);
				}
				else if (emergencyPatient.unacknowledged(ACK.RESIDENT_SCAN_READ)) {
					return new ResidentScanRead(emergencyPatient, medicalStaff);
				}
				else if (emergencyPatient.unacknowledged(ACK.RESIDENT_ATTENDING_CONSULT)) {
					return new ResidentAttendingConsult(emergencyPatient, medicalStaff)
				}
				else if(emergencyPatient.unacknowledged(ACK.RESIDENT_PATIENT_CONSULT)) {
					return new ResidentPatientConsult(emergencyPatient, medicalStaff);
				}
			}
		}

		if (entry.getResident() == null || entry.getResident() == medicalStaff) {
			entry.setResident(medicalStaff);

			if (entry.unacknowledged(ACK.RESIDENT_EKG_READ)) {
				return new ResidentEKGRead(entry, medicalStaff);
			}
			else if (entry.unacknowledged(ACK.RESIDENT_EKG_CONSULT)) {
				return new ResidentEKGConsult(entry, medicalStaff);
			}
			else if (entry.unacknowledged(ACK.RESIDENT_EKG_ORDER_XRAY)) {
				return new ResidentEKGOrderXRay(entry, medicalStaff);
			}
			else if (entry.unacknowledged(ACK.RESIDENT_EKG_ORDER_CAT)) {
				return new ResidentEKGOrderCAT(entry, medicalStaff);
			}
			else if (entry.unacknowledged(ACK.RESIDENT_SCAN_READ)) {
				return new ResidentScanRead(entry, medicalStaff);
			}
			else if (entry.unacknowledged(ACK.RESIDENT_ATTENDING_CONSULT)) {
				return new ResidentAttendingConsult(entry, medicalStaff)
			}
			else if(entry.unacknowledged(ACK.RESIDENT_PATIENT_CONSULT)) {
				return new ResidentPatientConsult(entry, medicalStaff);
			}
		}
		return null;
	}
}

export default ResidentResponsibilities;