import ComputerEntry from "../support/ComputerEntry.js";
//import support.HospitalModel;
import AMedician from "../support/AMedician.js";

class AResponsibility {

	name; //String
	duration; //float
	remaining; //float
	entry; //ComputerEntry
	priority; //float
	subject; //ResponsibilitySubject
	medician; //IMedician
	
	get Medician() {
		return this.medician;
	}

    set Medician(medician) {
		this.medician = medician;
	}

    isStarted() {
		return this.calledStarted; //boolean
	}
	
	get Subject() {
		return this.subject;
	}

    set Subject(subject) {
		this.subject = subject;
	}

	get Priority() {
		return this.priority;
	}

	set Priority(priority) {
		this.priority = priority;
	}

	calledStarted = false;
	calledFinished = false;

	constructor(name, duration, entry, priority, subject, medician) {
		super();
		this.name = name;
		this.duration = duration;
		this.remaining = duration;
		this.entry = entry;
		this.priority = priority;
		this.subject = subject;
		this.medician = medician;
	}

	get Remaining() {
		return this.remaining;
	}

    set Remaining(remaining) {
		this.remaining = remaining;
	}

    get Name() {
		return this.name;
	}

    set Name(name) {
		this.name = name;
	}

	get Duration() {
		return this.duration;
	}

    set Duration(duration) {
		this.duration = duration;
	}

	get Entry() {
		return this.entry;
	}

	set Entry(entry) {
		this.entry = entry;
	}

	doWork(amount) {
		if(!this.calledStarted) {
			this.calledStarted = true;
			start();
		}
		this.remaining -= amount;
		if(this.remaining <= 0 && !this.calledFinished) {
			this.calledFinished = true;
			finish();
		}
	}

	finish() {
		doFinish();
	}

	doFinish();

	start() {
		doStart();
	};

	doStart() ;

	isDone() {
		return this.remaining <= 0;
	}
}

export default AResponsibility;
