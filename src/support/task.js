

class task {
    taskID; // STRING
    severity; // PATIENT SEVERITY OR NUMBER
    entryTime; // INT
    waitingTime = 0; // INT
    patient; // PATIENT
    location; // LOCATION
        
    constructor(taskID, severity, entryTime, patient, location) {
        this.taskID = taskID;
        this.severity = severity;
        this.entryTime = entryTime;
        this.patient = patient;
        this.location = location;
    }

    toString() {
        let toReturn = "";
        toReturn += taskID + ",";
        toReturn += severity + ", ";
        toReturn += entryTime + ", ";
        toReturn += waitingTime + ", ";
        toReturn += patient + ", ";
        toReturn += location + ", ";
        return toReturn;
    }
}

export default task;