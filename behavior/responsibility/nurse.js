import AResponsibilityFactory from "./aresponsibility-factory.js"
import GetHealthInformationResponsibility from "./get-health-information.js"
 class NurseResponsibilities extends AResponsibilityFactory {
	
	get( entry, medicalStaff) {
		
		if(!entry.isAnsweredQuestions()) {
			return new GetHealthInformationResponsibility( entry, medicalStaff);
		}
		
		return null;
	}
}

export default NurseResponsibilities;