//An "abstract" class for Medical Staff responsibilities
class AResponsibility {

	name; //String
	duration; //float
	remaining; //float
	entry; //ComputerEntry
	priority; //float
	subject; //ResponsibilitySubject
	medicalStaff; //IMedicalStaff

	calledStarted = false; //Has this responsibility been started?
	calledFinished = false;	//Has this responsibility been finished?

	constructor(name, duration, entry, priority, subject, medicalStaff) {

		this.name = name;
		this.duration = duration;
		this.remaining = duration;
		this.entry = entry;
		this.priority = priority;
		this.subject = subject;
		this.medicalStaff = medicalStaff;
	}

	getMedicalStaff() {
		return this.medicalStaff;
	}

	setMedicalStaff(medicalStaff) {
		this.medicalStaff = medicalStaff;
	}

	isStarted() {
		return this.calledStarted; //boolean
	}

	getSubject() {
		return this.subject;
	}

	setSubject(subject) {
		this.subject = subject;
	}

	getPriority() {
		return this.priority;
	}

	setPriority(priority) {
		this.priority = priority;
	}

	

	getRemaining() {
		return this.remaining;
	}

	setRemaining(remaining) {
		this.remaining = remaining;
	}

	getName() {
		return this.name;
	}

	setName(name) {
		this.name = name;
	}

	getDuration() {
		return this.duration;
	}

	setDuration(duration) {
		this.duration = duration;
	}

	getEntry() {
		return this.entry;
	}

	setEntry(entry) {
		this.entry = entry;
	}

	doWork(amount) {
		if (!this.calledStarted) {
			this.calledStarted = true;
			this.start();
		}
		this.remaining -= amount;
		if (this.remaining <= 0 && !this.calledFinished) {
			this.calledFinished = true;
			this.finish();
		}
	}

	finish() {
		if (this.doFinish)
			this.doFinish();
	}


	start() {
		if (this.doStart)
			this.doStart();
	};



	isDone() {
		return this.remaining <= 0;
	}
}

export default AResponsibility;
