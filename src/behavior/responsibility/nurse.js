import AResponsibilityFactory from "./aresponsibility-factory.js"
import GetHealthInformationResponsibility from "./get-health-information.js"
import NurseDischargePatient from "./nurse-discharge-patient.js"
import ACK from "./ack.js"
import NurseEscortPatientToExit from "./nurse-escort-patient-to-exit.js"
 class NurseResponsibilities extends AResponsibilityFactory {
	
	get( entry, medicalStaff) {
		if (entry.getNurse() == null || entry.getNurse() == medicalStaff) {
			entry.setNurse(medicalStaff);

			if(!entry.isAnsweredQuestions()) {
				return new GetHealthInformationResponsibility( entry, medicalStaff);
			}
			else if(entry.unacknowledged(ACK.NURSE_DISCHARGE_PATIENT)){
				return new NurseDischargePatient(entry, medicalStaff);
			}
			else if(entry.unacknowledged(ACK.NURSE_ESCORT_PATIENT_TO_EXIT)){
				return new NurseEscortPatientToExit(entry, medicalStaff);
			}
		}
		
		return null;
	}
}

export default NurseResponsibilities;