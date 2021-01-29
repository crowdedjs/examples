import ResponsibilitySubject from "./responsibility-subject.js"
import AResponsibility from "./AResponsibility.js"
import ACK from "./ACK.js"


class ResidentEKGOrderCAT extends AResponsibility{
	
	constructor(entry, medician) {
		super("Resident EKG Order CAT", 1 * 1, entry, 4, ResponsibilitySubject.PATIENT, medician);
	}

	doFinish() {
		this.entry.acknowledge(ACK.RESIDENT_EKG_ORDER_CAT);
		let myPatient = this.entry.getPatient();
		Hospital.CTQueue.push(myPatient);
		

	}
}

export default ResidentEKGOrderCAT;