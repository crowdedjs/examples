import APerson from "./aperson.js";
import PatientTempState from "../support/patient-temp-state.js";

class APatient extends APerson {

	constructor(location, UUID, severity, arrivalTick) {
		super(location, UUID, arrivalTick);
		this.severity = severity;
	}

    patientPregnancyState = "NOT_EXPECTING";
    
    patientTempState = PatientTempState.ARRIVED;
    
	severity; // Severity
	// SEVERITY LEVELS: ESI1, ESI2, ESI3, ESI4, ESI5
	
	instructor; // AMedicalStaff

	/**
	 * The room that the patient's bed is in.
	 * Having an assigned room and a permament room 
	 * allows the patient to move throughout the ER,
	 * but still remember the "home base"
	 */
	permanentRoom;

	setPermanentRoom(permanentRoom){
		this.permanentRoom = permanentRoom
	}
	getPermanentRoom(){
		return this.permanentRoom;
	}

	getInstructor() {
		return this.instructor;
	}

	setInstructor(instructor) {
		this.instructor = instructor;
	}

	getSeverity() {
		return this.severity;
	}

	setSeverity(severity) {
		this.severity = severity;
	}

	getPatientTempState() {
		return this.patientTempState;
	}

	setPatientTempState(patientTempState) {
		this.patientTempState = patientTempState;
	}

	getPatientPregnancyState() {
		return this.patientPregnancyState;
	}

	setPatientPregnancyState(patientPregnancyState) {
		this.patientPregnancyState = patientPregnancyState;
	}
}
	
export default APatient;