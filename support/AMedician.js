class AMedician extends APerson {
    medicianType; //MedicianClass -> string
    medicianSubclass; //MedicianSublcass -> string
    doctorYear; //DoctorYear -> string
    currentPatient; //IPatient -> APatient
    myRooms; //List<IRooms> -> []
    responsibility; //IResponsibility -> ?
    computer; //IRoom -> ARoom

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
        this.CurrentPatient(this.responsibility.getEntry().Patient());
    }

    get MyRooms() {
        return this.myRooms;
    }

    set MyRooms(myRooms) {
        this.myRooms = myRooms;
    }

    addRoom(room) {
        this.myRooms.add(room);
    }

	hasRoom(room) {
		return this.myRooms.contains(room);		
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

	AMedician(location, UUID, medicianType, medicianSubclass, arrivalTick) {
		this(location, UUID, medicianType, medicianSubclass, "NONE", arrivalTick);
	}
	
	AMedician(location, UUID, medicianType, medicianSubclass, doctorYear, arrivalTick) {
		super(location, UUID, arrivalTick);
		this.medicianType = medicianType;
		this.medicianSubclass = medicianSubclass;
		this.doctorYear = doctorYear;
		this.myRooms = [];
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