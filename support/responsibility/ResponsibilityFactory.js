 import TechResponsibilities from "./TechResponsibility.js"
 import NurseResponsibilities from "./NurseResponsibilities.js"
 import ResidentResponsibilities from "./ResidentResponsibilities.js"
 import CTResponsibilities from "./CTResponsibilities.js"

 
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