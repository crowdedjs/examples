// THE TASK OBJECT EACH AGENT PULLS AND PUSHES INTO THEIR TASK LISTS
class task {
    taskID; // STRING
    severity; // PATIENT SEVERITY OR NUMBER
    // ENTRY TIME IS NOT IMPLEMENTED YET, THIS WOULD BE IMPORTANT
    entryTime; // INT
    // -----------------------
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