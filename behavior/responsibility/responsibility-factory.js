 import TechResponsibilities from "./tech-responsibilities.js"
 import NurseResponsibilities from "./nurse.js"
 import ResidentResponsibilities from "./resident-responsibilities.js"
 import CTResponsibilities from "./ct-responsibilities.js"

 
 class ResponsibilityFactory {
	
	 static get( medicalStaffSubclass) {
		switch(medicalStaffSubclass) {
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