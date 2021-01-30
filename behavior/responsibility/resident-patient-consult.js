import AResponsibility from "./aresponsibility.js"
import ResponsibilitySubject from "./responsibility-subject.js"

class ResidentPatientConsult extends AResponsibility {

	constructor(entry, medicalStaff) {
		super("Resident Consult Patient", 1 /* seconds */, entry, 5, ResponsibilitySubject.PATIENT, medicalStaff);
	}

	doFinish() {
		

	}
}

export default ResidentPatientConsult;