 class ResponsibilityFactory {
	
	 static get( medicianSubclass) {
		switch(medicianSubclass) {
		case "Tech":
			return new TechResponsibilities();
		case "Nurse":
			return new NurseResponsibilities();
		case "Resident":
			return new ResidentResponsibilities();
		case "CT":
			return new CTResponsibilities();
		default:
			return null;
		
		}
	}

}

export default ResponsibilityFactory;