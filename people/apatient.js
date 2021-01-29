import APerson from "./aperson.js";
import PatientTempState from "../support/patient-temp-state.js";

class APatient extends APerson {

	constructor(location, UUID, severity, arrivalTick) {
		super(location, UUID, arrivalTick);
		this.severity = severity;
	}

    patientPregnancyState = "NOT_EXPECTING";
    
    patientTempState = PatientTempState.WAITING;
    
	severity; // Severity
	// SEVERITY LEVELS: ESI1, ESI2, ESI3, ESI4, ESI5
	
	instructor; // AMedicalStaff

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