 import TechResponsibilities from "./tech-responsibilities.js"
 import NurseResponsibilities from "./nurse-responsibilities.js"
 import ResidentResponsibilities from "./resident-responsibilities.js"
 import CTResponsibilities from "./ct-responsibilities.js"
 import RadiologyResponsibilities from "./radiology-responsibilities.js"
 import PhlebotomistResponsibilities from "./phlebotomist-responsibilities.js"
 import XRayResponsibilities from "./xray-responsibility.js"
 
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
		case "Radiology":
			return new RadiologyResponsibilities();
		case "Phlebotomist":
			return new PhlebotomistResponsibilities();
		case "XRay":
			return new XRayResponsibilities();
		default:
			return null;
		
		}
	}

}

export default ResponsibilityFactory;