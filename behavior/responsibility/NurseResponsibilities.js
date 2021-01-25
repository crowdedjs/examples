import AResponsibilityFactory from "./AResponsibilityFactory.js"
import GetHealthInformationResponsibility from "./GetHealthInformationResponsibility.js"
 class NurseResponsibilities extends AResponsibilityFactory {
	
	get( entry, medician) {
		
		if(!entry.isAnsweredQuestions()) {
			return new GetHealthInformationResponsibility( entry, medician);
		}
		
		return null;
	}
}

export default NurseResponsibilities;