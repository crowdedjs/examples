 import AResponsibility from "./aresponsibility.js"
 import ResponsibilitySubject from "./responsibility-subject.js"

 class GetHealthInformationResponsibility extends AResponsibility {

	constructor(entry, medicalStaff) {
		super("Get Health Information", 1 * 1, entry, 4, ResponsibilitySubject.PATIENT, medicalStaff);
	}

	doFinish() {
		this.getEntry().setAnsweredQuestions(true);
		
	}

	
}

export default GetHealthInformationResponsibility