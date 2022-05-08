import APerson from "./aperson.js";
import PatientTempState from "../support/patient-temp-state.js";

// THIS CLASS HAS ALL THE IMPORTANT PATIENT AGENT DATA
class APatient extends APerson {

	constructor(location, UUID, severity, arrivalTick) {
		super(location, UUID, arrivalTick);
		this.severity = severity;
	}

    patientPregnancyState = "NOT_EXPECTING";
    
    patientTempState = PatientTempState.ARRIVED;
    
    // SEVERITY LEVELS: ESI1, ESI2, ESI3, ESI4, ESI5
	severity; // Severity
	
	instructor; // AMedicalStaff

	imagingRoom = null; //room

	scan = false; //boolean

	// TESTING VARIABLES
	lengthOfStay = 0; // TOTAL STAY IN HOSPITAL
	ticksPresent = 0;
	waitingTime = 0; // TIME THEY ARE NOT CURRENTLY DOING ANYTHING OR BEING HELPED

	// CATEGORIES OF WAIT TIME
	waitToCheckIn = false;
	waitToCheckInValue = 0;
	//
	waitInWaitingRoom = false;
	waitInWaitingRoomValue = 0;
	//
	waitInRoom1 = false;
	waitInRoom1Value = 0;
	//
	waitInScanRoom = false;
	waitInScanRoomValue = 0;
	//
	waitInRoom2 = false;
	waitInRoom2Value = 0;
	//

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

	setImagingRoom(string) {
		this.imagingRoom = string;
	} 
	getImagingRoom() {
		return this.imagingRoom;
	}
	
	setScan(boolean) {
		this.scan = boolean;
	}
	getScan() {
		return this.scan;
	}
}
	
export default APatient;