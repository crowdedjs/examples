import ResponsibilitySubject from "./ResponsibilitySubject.js"


class ResidentEKGOrderCAT extends AResponsibility{
	
	constructor(entry, medician) {
		super("Resident EKG Order CAT", 1 * 60, entry, 4, ResponsibilitySubject.PATIENT, medician);
	}

	doFinish() {
		entry.acknowledge(ACK.RESIDENT_EKG_ORDER_CAT);
		let myPatient = entry.getPatient();
		Hospital.getCTQueue().add(myPatient);
		

	}
}

export default ResidentEKGOrderCAT;