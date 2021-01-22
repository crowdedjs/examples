 class NurseResponsibilities extends AResponsibilityFactory {
	
	get( entry, medician) {
		
		if(!entry.isAnsweredQuestions()) {
			return new GetHealthInformationResponsibility( entry, medician);
		}
		
		return null;
	}
}