import AResponsibility from "./aresponsibility.js"
import ResponsibilitySubject from "./responsibility-subject.js"

class TakeBloodResponsibility extends AResponsibility {

	constructor(entry, medicalStaff) {
		super("Draw Blood", 1 /* seconds */, entry, 5, ResponsibilitySubject.PATIENT, medicalStaff);
		// TODO Auto-generated constructor stub
	}

	doFinish() {
		this.getEntry().setBlood("Drawn");

	}
}

export default TakeBloodResponsibility;