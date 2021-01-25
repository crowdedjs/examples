import AResponsibilityFactory from "./aresponsibility-factory.js"
import GetHealthInformationResponsibility from "./get-health-information.js"
 class NurseResponsibilities extends AResponsibilityFactory {
	
	get( entry, medician) {
		
		if(!entry.isAnsweredQuestions()) {
			return new GetHealthInformationResponsibility( entry, medician);
		}
		
		return null;
	}
}

export default NurseResponsibilities;