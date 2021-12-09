class task {
    taskID;
    severity;
    entryTime;
    waitingTime;
    patient;
    location;
        
    constructor(taskID, severity, entryTime, patient, location) {
        this.taskID = taskID;
        this.severity = severity;
        this.entryTime = entryTime;
        this.patient = patient;
        this.location = location;

        waitingTime = 0;
    }
}

export default task;