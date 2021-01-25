import APerson from "./aperson.js";
import PatientTempState from "./patient-temp-state.js";

class APatient extends APerson {

	constructor(location, UUID, severity, arrivalTick) {
		super(location, UUID, arrivalTick);
		this.severity = severity;
	}

    patientPregnancyState = "NOT_EXPECTING";
    
    patientTempState = PatientTempState.WAITING;
    
	severity; // Severity
	// SEVERITY LEVELS: ESI1, ESI2, ESI3, ESI4, ESI5
	
	instructor; // AMedician

	get Instructor() {
		return this.instructor;
	}

	set Instructor(instructor) {
		this.instructor = instructor;
	}

	get Severity() {
		return this.severity;
	}

	set Severity(severity) {
		this.severity = severity;
	}

	get PatientTempState() {
		return this.patientTempState;
	}

	set PatientTempState(patientTempState) {
		this.patientTempState = patientTempState;
	}

	get PatientPregnancyState() {
		return this.patientPregnancyState;
	}

	set PatientPregnancyState(patientPregnancyState) {
		this.patientPregnancyState = patientPregnancyState;
	}
}
	
export default APatient;