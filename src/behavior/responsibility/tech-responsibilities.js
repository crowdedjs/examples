import AResponsibilityFactory from "./aresponsibility-factory.js"
import TakeVitalsResponsibility from "./take-vitals.js"
import TechEKGDo from "./teck-ekg-do.js";
import TechEKGTakePatientToResponsibility from "./tech-ekg-rpatient.js"
import TechCATPickupResponsibility from "./tech-cat-pickup.js"
import ACK from "./ack.js"

 class TechResponsibilities extends AResponsibilityFactory {

	
	 get(entry, medicalStaff) {
		
		if (Hospital.aTeam[3] == null) {
			Hospital.aTeam[3] = medicalStaff;
		}

		// what else should the tech do?
		if (Hospital.emergencyQueue.length > 0) {
			let emergencyPatient = Hospital.computer.entries.find(i=>i.getPatient().getSeverity() == "ESI1");
			if (emergencyPatient.getVitals() == null) {
				// entry.setTech(medicalStaff);
				emergencyPatient.setTech(medicalStaff);
				//return new TakeVitalsResponsibility( entry, medicalStaff);
				return new TakeVitalsResponsibility(emergencyPatient, medicalStaff);
			}
		}
		
		if (entry.getTech() == null || entry.getTech() == medicalStaff) {
			entry.setTech(medicalStaff);

			if(entry.getVitals() == null) {
				return new TakeVitalsResponsibility( entry, medicalStaff);
			}
			else if(entry.getEkg() == null){
				return new TechEKGDo(entry, medicalStaff);
			}
			else if(entry.unacknowledged(ACK.CT_PICKUP)) {
				entry.getPatient().setCATScan(true);
				return new TechCATPickupResponsibility(entry, medicalStaff);
			}
			//else if(Hospital.getCTQueue().length > 0 && !Hospital.isCTOccupied() && entry.getPatient() == Hospital.getCTQueue()[0]) {
			else if(!entry.getPatient().getCATScan() && entry.getPatient().getCTRoom() == null && Hospital.getCTQueue().length > 0 && !Hospital.isCT1Occupied() && (entry.getPatient() == Hospital.getCTQueue()[0] || entry.getPatient() == Hospital.getCTQueue()[1])) {
				Hospital.setCT1Occupied(true);
				entry.getPatient().setCTRoom("CT 1");
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, Hospital.getLocationByName("CT 1"));
			}
			else if(!entry.getPatient().getCATScan() && entry.getPatient().getCTRoom() == null && Hospital.getCTQueue().length > 0 && !Hospital.isCT2Occupied() && (entry.getPatient() == Hospital.getCTQueue()[0] || entry.getPatient() == Hospital.getCTQueue()[1])) {
				Hospital.setCT2Occupied(true);
				entry.getPatient().setCTRoom("CT 2");
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, Hospital.getLocationByName("CT 2"));
			}
			else if(!entry.getPatient().getCATScan() && entry.getPatient().getCTRoom() == "CT 1") {
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, Hospital.getLocationByName("CT 1"));
			}
			else if(!entry.getPatient().getCATScan() && entry.getPatient().getCTRoom() == "CT 2") {
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, Hospital.getLocationByName("CT 2"));
			}
		}
		//console.log("null");
		return null;
	}
}

export default TechResponsibilities;