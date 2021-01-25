 class AResponsibilityFactory  {
	
get(entry, subject, medician) {
		let possibleResponsibility = this.get(entry, medician);
		if(possibleResponsibility == null)
			return null;
		if(possibleResponsibility.getSubject() == subject)
			return possibleResponsibility;
		return null;
	}

}

export default AResponsibilityFactory