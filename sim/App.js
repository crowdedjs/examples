//line 500 of app.java for addAgent method
// line 257 for for loop with addAgent
// 

// need to add for loop somewhere that references addAgent to overwrite the json file before they're added to the simulation


import AMedician from "../support/AMedician.js";
import APatient from "../support/APatient.js";
import APerson from "../support/APerson.js";
import AThing from "../support/AThing.js";

import MedicalAgent from "./MedicalAgent.js";

class App {
	
	// what inputs to give it?
    addAgent(hospitaL, i, agentJSON) { //HospitalModel int JSONObject
		
		//Parse each agent that arrives based on its name and type
		if(agentJSON.getString("name").equals("patient")) {
			let patient = new PatientAgent();


			// patient = new Patient(hospital.getLocation(RoomType.valueOf(agentJSON.getString("arrivalLocation").toUpperCase().replaceAll(" ", "_"))).getLocation(), 
			// 	i,
			// 	Severity.valueOf(agentJSON.getString("severity").toUpperCase().replaceAll(" ",  "_")),
			// 	agentJSON.getInt("arrivalTick")
			// 	);

			//hospital.people.add(patient);
		}

		else if(agentJSON.getString("name").equals("Attending") || agentJSON.getString("name").equals("Resident")) {
			if(agentJSON.getString("type").equals("Attending")) {
				thirdYearAttending = new Medician(hospital.getLocation(RoomType.valueOf(agentJSON.getString("arrivalLocation").toUpperCase().replaceAll(" ", "_"))).getLocation(), 
					i, MedicianClass.DOCTOR,
					MedicianSubclass.valueOf(agentJSON.getString("type").toUpperCase().replaceAll(" ", "_")),
					agentJSON.getInt("arrivalTick")
					);

				hospital.people.add(thirdYearAttending);
			}
			else if(agentJSON.getString("type").equals("Resident")) {
				IPerson thirdYearResident = new Medician(hospital.getLocation(RoomType.valueOf(agentJSON.getString("arrivalLocation").toUpperCase().replaceAll(" ", "_"))).getLocation(), 
						i, MedicianClass.DOCTOR,
						MedicianSubclass.valueOf(agentJSON.getString("type").toUpperCase().replaceAll(" ", "_")),
						agentJSON.getInt("arrivalTick")
						);

				hospital.people.add(thirdYearResident);
			}

		}
		else if(agentJSON.getString("name").equals("Tech")) {
			if(agentJSON.getString("type").equals("CT")) {
				IPerson nurse = new Medician(hospital.getLocation(RoomType.valueOf(agentJSON.getString("arrivalLocation").toUpperCase().replaceAll(" ", "_"))).getLocation(), 
						i, MedicianClass.TECH,
						MedicianSubclass.valueOf(agentJSON.getString("type").toUpperCase().replaceAll(" ", "_")),
						agentJSON.getInt("arrivalTick")
						);

				hospital.people.add(nurse);
			}
			else if(agentJSON.getString("type").equals("Janitorial")) {
				IPerson nurse = new Medician(hospital.getLocation(RoomType.valueOf(agentJSON.getString("arrivalLocation").toUpperCase().replaceAll(" ", "_"))).getLocation(), 
						i, MedicianClass.TECH,
						MedicianSubclass.valueOf(agentJSON.getString("type").toUpperCase().replaceAll(" ", "_")),
						agentJSON.getInt("arrivalTick")
						);

				hospital.people.add(nurse);
			}
			else if(agentJSON.getString("type").equals("Tech")) {
				IPerson tech = new Medician(hospital.getLocation(RoomType.valueOf(agentJSON.getString("arrivalLocation").toUpperCase().replaceAll(" ", "_"))).getLocation(), 
						i, MedicianClass.TECH,
						MedicianSubclass.valueOf(agentJSON.getString("type").toUpperCase().replaceAll(" ", "_")),
						agentJSON.getInt("arrivalTick")
						);

				hospital.people.add(tech);
			}
			else if(agentJSON.getString("type").equals("Radiology")) {
				IPerson tech = new Medician(hospital.getLocation(RoomType.valueOf(agentJSON.getString("arrivalLocation").toUpperCase().replaceAll(" ", "_"))).getLocation(), 
						i, MedicianClass.TECH,
						MedicianSubclass.valueOf(agentJSON.getString("type").toUpperCase().replaceAll(" ", "_")),
						agentJSON.getInt("arrivalTick")
						);

				hospital.people.add(tech);
			}
		}
		else if(agentJSON.getString("name").equals("Nurse")) {
			if(agentJSON.getString("type").equals("Triage Nurse")) {
				IPerson triageNurse = new Medician(hospital.getLocation(RoomType.valueOf(agentJSON.getString("arrivalLocation").toUpperCase().replaceAll(" ", "_"))).getLocation(), 
						i, MedicianClass.NURSE,
						MedicianSubclass.valueOf(agentJSON.getString("type").toUpperCase().replaceAll(" ", "_")),
						agentJSON.getInt("arrivalTick")
						);

				hospital.people.add(triageNurse);
			}
			else if(agentJSON.getString("type").equals("Greeter Nurse")) {
				IPerson nurse = new Medician(hospital.getLocation(RoomType.valueOf(agentJSON.getString("arrivalLocation").toUpperCase().replaceAll(" ", "_"))).getLocation(), 
						i, MedicianClass.NURSE,
						MedicianSubclass.valueOf(agentJSON.getString("type").toUpperCase().replaceAll(" ", "_")),
						agentJSON.getInt("arrivalTick")
						);

				hospital.people.add(nurse);
			}

			else if(agentJSON.getString("type").equals("Nurse")) {
				IPerson nurse = new Medician(hospital.getLocation(RoomType.valueOf(agentJSON.getString("arrivalLocation").toUpperCase().replaceAll(" ", "_"))).getLocation(), 
						i, MedicianClass.NURSE,
						MedicianSubclass.valueOf(agentJSON.getString("type").toUpperCase().replaceAll(" ", "_")),
						agentJSON.getInt("arrivalTick")
						);

				hospital.people.add(nurse);
			}

		}
	}
}

export default App;