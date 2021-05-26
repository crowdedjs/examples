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
		if (myPatient.getSeverity() == "ESI1" && Hospital.CTQueue[0].getSeverity() != "ESI1") {
			Hospital.CTQueue.unshift(myPatient);
			//console.log(Hospital.getCTQueue());
		}
		else if (myPatient.getSeverity() == "ESI1" && Hospital.CTQueue[0].getSeverity() == "ESI1") {
			let i = 0;
			while (Hospital.CTQueue[i].getSeverity() == "ESI1") {
				i++;
			}
			
			Hospital.CTQueue.splice(i, 0, myPatient);
			//console.log(Hospital.getCTQueue());
		}
		else {
			Hospital.CTQueue.push(myPatient);
			//console.log(Hospital.getCTQueue());
		}
		
		//console.log(Hospital.getCTQueue());

	}
}

export default ResidentEKGOrderCAT;