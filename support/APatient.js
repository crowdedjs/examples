class APatient extends APerson {

	APatient(location, UUID, severity, arrivalTick) {
		super(location, UUID, arrivalTick);
		this.severity = severity;
	}

	//protected PatientPregnancyState patientPregnancyState = PatientPregnancyState.NOT_EXPECTING;
    patientPregnancyState = "NOT_EXPECTING";
    
	//protected PatientTempState patientTempState = PatientTempState.ARRIVING;
    patientTempState = "ARRIVED";
    
	severity; // Severity
	
	instructor; // IMedician

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