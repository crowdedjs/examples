import ResponsibilitySubject from "./responsibility-subject.js"
import AResponsibility from "./aresponsibility.js"
import ACK from "./ack.js"


class ResidentEKGOrderXRay extends AResponsibility{
	
	constructor(entry, medicalStaff) {
		super("Resident EKG Order XRay", 1 * 1, entry, 4, ResponsibilitySubject.PATIENT, medicalStaff);
	}

	doFinish() {
		this.entry.acknowledge(ACK.RESIDENT_EKG_ORDER_XRAY);
		let myPatient = this.entry.getPatient();
		// if (myPatient.getSeverity() == "ESI1" && Hospital.CTQueue[0].getSeverity() != "ESI1") {
		// 	Hospital.CTQueue.unshift(myPatient);
		// }
		// else if (myPatient.getSeverity() == "ESI1" && Hospital.CTQueue[0].getSeverity() == "ESI1") {
		// 	let i = 0;
		// 	while (Hospital.CTQueue[i].getSeverity() == "ESI1") {
		// 		i++;
		// 	}
			
		// 	Hospital.CTQueue.splice(i, 0, myPatient);
		// }
		// else {
		// 	Hospital.CTQueue.push(myPatient);
		// }
        Hospital.XRayQueue.push(myPatient);
	}
}

export default ResidentEKGOrderXRay;