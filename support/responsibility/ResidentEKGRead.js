class ResidentEKGRead extends AResponsibility {
	
	constructor(entry, medician) {
		super("Resident EKG Read", 1 * 60, entry, 4, ResponsibilitySubject.COMPUTER, medician);
	}

	doFinish() {
		this.entry.acknowledge(ACK.RESIDENT_EKG_READ);
		this.entry.addUnacknowledged(ACK.RESIDENT_EKG_CONSULT);

	}
}