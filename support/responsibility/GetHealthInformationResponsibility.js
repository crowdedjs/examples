 import AResponsibility from "./AResponsibility.js"

 class GetHealthInformationResponsibility extends AResponsibility {

	constructor(entry, medician) {
		super("Get Health Information", 1 * 60, entry, 4, ResponsibilitySubject.PATIENT, medician);
	}

	doFinish() {
		this.getEntry().setAnsweredQuestions(true);
		
	}

	
}

export default GetHealthInformationResponsibility