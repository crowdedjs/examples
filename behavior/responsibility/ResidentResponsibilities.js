import AResponsibilityFactory from "./AResponsibilityFactory.js"
 class ResidentResponsibilities extends AResponsibilityFactory {
	
	get( entry, medician) {
		
		if(entry.unacknowledged(ACK.RESIDENT_EKG_READ)) {
			return new ResidentEKGRead( entry, medician);
		}
		else if(entry.unacknowledged(ACK.RESIDENT_EKG_CONSULT)) {
			return new ResidentEKGConsult(entry, medician);
		}else if(entry.unacknowledged(ACK.RESIDENT_EKG_ORDER_CAT)) {
			return new ResidentEKGOrderCAT(entry, medician);
		}
		
		return null;
	}
}

export default ResidentResponsibilities;