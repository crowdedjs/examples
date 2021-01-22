import AResponsibility from "./AResponsibility.js"
import ResponsibilitySubject from "./ResponsibilitySubject.js"

class TakeVitalsResponsibility extends AResponsibility {

	constructor(entry, medician) {
		super("Take Vitals", 1 * 60/* seconds */, entry, 5, ResponsibilitySubject.PATIENT, medician);
		// TODO Auto-generated constructor stub
	}

	doFinish() {
		this.getEntry().setVitals("Taken");

	}
}

export default TakeVitalsResponsibility;