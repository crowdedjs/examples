import APerson from "./aperson.js"

class AMedicalStaff extends APerson {
    medicalStaffType; //MedicalStaffClass -> string
    medicalStaffSubclass; //MedicalStaffSublcass -> string
    doctorYear; //DoctorYear -> string
    currentPatient; //IPatient -> APatient
	patientList; //Array of Patients
	triageList; //Array of Patients ready for Triage
    myRooms; //List<IRooms> -> []
    responsibility; //AResponsibility
    computer; //IRoom -> ARoom
	busy = false; //boolean (if the nurse needs to finish their behavior before getting another patient)
	task; //Task

	constructor(location, UUID, medicalStaffType, medicalStaffSubclass, doctorYear, arrivalTick) {
		super(location, UUID, arrivalTick);
		this.medicalStaffType = medicalStaffType;
		this.medicalStaffSubclass = medicalStaffSubclass;
		if (doctorYear == null)
		{
			this.doctorYear = "NONE";
		}
		else
		{
			this.doctorYear = doctorYear;
		}
		this.myRooms = [];
		this.patientList = [];
		this.triageList = [];
	}

	getBusy() {
		return this.busy;
	}

	setBusy(busy) {
		this.busy = busy;
	}

	get Computer() {
        return this.computer;
    }

    set Computer(computer) {
        this.computer = computer;
    }

    get Responsibility() {
        return this.responsibility;
    }

    set Responsibility(responsibility)
    {
        this.responsibility = responsibility;
        this.setCurrentPatient(responsibility.entry.patient);
    }

	get Task() {
		return this.task;
	}

	set Task(task) {
		this.task = task;
	}

    get MyRooms() {
        return this.myRooms;
    }

    set MyRooms(myRooms) {
        this.myRooms = myRooms;
    }

	// removeRoom() {
	// 	this.myRooms.pop();
	// }

    addRoom(room) {
        this.myRooms.push(room);
    }

	hasRoom(room) {
		if (!room || !room.name) {
			return false;
		}
		return this.MyRooms.some(r=>r && r.name == room.name)	
	}

	getCurrentPatient() {
		return this.currentPatient;
	}

	setCurrentPatient(currentPatient) {
		this.currentPatient = currentPatient;
	}

	get PatientList() {
        return this.patientList;
    }

    set PatientList(patientList) {
        this.patientList = patientList;
    }

	get triageList() {
        return this.triageList;
    }

    set triageList(triageList) {
        this.triageList = triageList;
    }

	get MedicalStaffSubclass() {
		return this.medicalStaffSubclass;
	}

	set MedicalStaffSubclass(medicalStaffSubclass) {
		this.medicalStaffSubclass = medicalStaffSubclass;
	}
    
	get MedicalStaffType() {
		return this.medicalStaffType;
	}
    
	set MedicalStaffType(medicalStaffType) {
		this.medicalStaffType = medicalStaffType;
	}
    
	get DoctorType() {
		return this.medicalStaffSubclass;
	}
    
	set DoctorType(doctorType) {
		this.medicalStaffSubclass = doctorType;
	}
    
	get DoctorYear() {
		return this.doctorYear;
	}
    
	set DoctorYear(doctorYear) {
		this.doctorYear = doctorYear;
	}
	
	removeResponsibility() {
		responsibility = null;
		
	}

}

export default AMedicalStaff;