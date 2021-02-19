import AResponsibilityFactory from "./aresponsibility-factory.js"
import TakeVitalsResponsibility from "./take-vitals.js"
import TechEKGDo from "./teck-ekg-do.js";
import TechEKGTakePatientToResponsibility from "./tech-ekg-rpatient.js"
import TechCATPickupResponsibility from "./tech-cat-pickup.js"
import ACK from "./ACK.js"

 class TechResponsibilities extends AResponsibilityFactory {

	
	 get(entry, medicalStaff) {
		if(entry.getVitals() == null) {
			return new TakeVitalsResponsibility( entry, medicalStaff);
		}
		else if(entry.getEkg() == null){
			return new TechEKGDo(entry, medicalStaff);
		}else if(Hospital.getCTQueue().length > 0 && !Hospital.isCTOccupied() && entry.getPatient() == Hospital.getCTQueue()[0]) {
			return new TechEKGTakePatientToResponsibility(entry, medicalStaff, Hospital.getLocationByName("CT 1"));
		}else if(entry.unacknowledged(ACK.CT_PICKUP)) {
			return new TechCATPickupResponsibility(entry, medicalStaff);
		}
		
		
		return null;
	}
}

export default TechResponsibilities;