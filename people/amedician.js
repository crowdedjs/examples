import APerson from "./aperson.js"

class AMedician extends APerson {
    medicianType; //MedicianClass -> string
    medicianSubclass; //MedicianSublcass -> string
    doctorYear; //DoctorYear -> string
    currentPatient; //IPatient -> APatient
    myRooms; //List<IRooms> -> []
    responsibility; //AResponsibility
    computer; //IRoom -> ARoom

	constructor(location, UUID, medicianType, medicianSubclass, doctorYear, arrivalTick) {
		super(location, UUID, arrivalTick);
		this.medicianType = medicianType;
		this.medicianSubclass = medicianSubclass;
		if (doctorYear == null)
		{
			this.doctorYear = "NONE";
		}
		else
		{
			this.doctorYear = doctorYear;
		}
		this.myRooms = [];
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
        this.CurrentPatient = responsibility.entry.patient;
    }

    get MyRooms() {
        return this.myRooms;
    }

    set MyRooms(myRooms) {
        this.myRooms = myRooms;
    }

    addRoom(room) {
        this.myRooms.push(room);
    }

	hasRoom(room) {
		return this.MyRooms.some(r=>r.name == room.name)	
	}

	get CurrentPatient() {
		return this.currentPatient;
	}

	set CurrentPatient(currentPatient) {
		this.currentPatient = currentPatient;
	}

	get MedicianSubclass() {
		return this.medicianSubclass;
	}

	set MedicianSubclass(medicianSubclass) {
		this.medicianSubclass = medicianSubclass;
	}
    
	get MedicianType() {
		return this.medicianType;
	}
    
	set MedicianType(medicianType) {
		this.medicianType = medicianType;
	}
    
	get DoctorType() {
		return this.medicianSubclass;
	}
    
	set DoctorType(doctorType) {
		this.medicianSubclass = doctorType;
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

export default AMedician;