import ResponsibilitySubject from "./responsibility-subject.js"
import AResponsibility from "./aresponsibility.js"
import ACK from "./ack.js"


class ResidentEKGOrderCAT extends AResponsibility{
	
	constructor(entry, medicalStaff) {
		super("Resident EKG Order CAT", 1 * 1, entry, 4, ResponsibilitySubject.PATIENT, medicalStaff);
	}

	doFinish() {
		this.entry.acknowledge(ACK.RESIDENT_EKG_ORDER_CAT);
		let myPatient = this.entry.getPatient();
		if (myPatient.getSeverity() == "ESI1" && Hospital.CTQueue.length > 0 && Hospital.CTQueue[0].getSeverity() != "ESI1") {
			Hospital.CTQueue.unshift(myPatient);
		}
		else if (myPatient.getSeverity() == "ESI1" && Hospital.CTQueue.length > 0 && Hospital.CTQueue[0].getSeverity() == "ESI1") {
			let i = 0;
			while (i < Hospital.CTQueue.length && Hospital.CTQueue[i].getSeverity() == "ESI1") {
				i++;
			}
			
			if (i == Hospital.CTQueue.length) {
				Hospital.CTQueue.push(myPatient);
			}
			else {
				Hospital.CTQueue.splice(i, 0, myPatient);
			}
		}
		else {
			Hospital.CTQueue.push(myPatient);
		}
	}
}

export default ResidentEKGOrderCAT;