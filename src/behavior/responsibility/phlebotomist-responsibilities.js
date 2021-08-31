import AResponsibilityFactory from "./aresponsibility-factory.js"
import TakeBloodResponsibility from "./take-blood.js"
import ACK from "./ack.js"


class PhlebotomistResponsibilities extends AResponsibilityFactory{

	get(entry, medicalStaff) {

		if (Hospital.aTeam[4] == null) {
			Hospital.aTeam[4] = medicalStaff;
		}
		
		if (Hospital.emergencyQueue.length > 0 && Hospital.aTeam[4] == medicalStaff) {
			let emergencyPatients = Hospital.computer.entries.filter(i=>i.getPatient().getSeverity() == "ESI1");
			for (let i = 0; i < emergencyPatients.length; i++) {
				let emergencyPatient = emergencyPatients[i];
				emergencyPatient.setPhlebotomist(medicalStaff);
				
				if(emergencyPatient.getBlood() == null) {
					return new TakeBloodResponsibility(emergencyPatient, medicalStaff);
				}
			}
		}
		if (entry.getPhlebotomist() == null || entry.getPhlebotomist() == medicalStaff) {
			entry.setPhlebotomist(medicalStaff);
			
			if(entry.getBlood() == null) {
				return new TakeBloodResponsibility(entry, medicalStaff);
			}
		}
		
		return null;
	}

}

export default PhlebotomistResponsibilities;