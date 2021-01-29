import AResponsibility from "./aresponsibility.js"
import ResponsibilitySubject from "./responsibility-subject.js"

class TakeVitalsResponsibility extends AResponsibility {

	constructor(entry, medicalStaff) {
		super("Take Vitals", 1 /* seconds */, entry, 5, ResponsibilitySubject.PATIENT, medicalStaff);
		// TODO Auto-generated constructor stub
	}

	doFinish() {
		this.getEntry().setVitals("Taken");

	}
}

export default TakeVitalsResponsibility;