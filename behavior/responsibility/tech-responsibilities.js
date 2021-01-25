import AResponsibilityFactory from "./aresponsibility-factory.js"
import TakeVitalsResponsibility from "./take-vitals.js"
import TechEKGDo from "./teck-ekg-do.js";
import TechEKGTakePatientToResponsibility from "./tech-ekg-rpatient.js"
import TechCATPickupResponsibility from "./tech-cat-pickup.js"

 class TechResponsibilities extends AResponsibilityFactory {

	
	 get(entry, medician) {
		if(entry.getVitals() == null) {
			return new TakeVitalsResponsibility( entry, medician);
		}
		else if(entry.getEkg() == null){
			return new TechEKGDo(entry, medician);
		}else if(hospital.getCTQueue().size() > 0 && !Hospital.isCTOccupied() && entry.getPatient() == HospitalModel.get().getCTQueue().get(0)) {
			return new TechEKGTakePatientToResponsibility(entry, medician, Hospital.getLocationByName("CT 1"));
		}else if(entry.unacknowledged(ACK.CT_PICKUP)) {
			return new TechCATPickupResponsibility(entry, medician);
		}
		
		
		return null;
	}
}

export default TechResponsibilities;