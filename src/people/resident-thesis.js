import AssignBed from "../behavior/assign-bed.js";
import AssignComputer from "../behavior/assign-computer.js"
import GoTo from "../behavior/go-to.js";
import GoToLazy from "../behavior/go-to-lazy.js";
import TakeTime from "../behavior/take-time.js";
import task from "../support/task-thesis.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class residentThesis {

    constructor(myIndex) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        this.toReturn = null;

        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
        
        let goToName = "ResidentStart";
        let myGoal = Hospital.locations.find(l => l.name == goToName);
        let computer =  Hospital.locations.find(l => l.name == "ResidentStart");
        let entrance = Hospital.getLocationByName("Main Entrance");

        let taskQueue = [];

        this.tree = builder

        .parallel("Testing Parallel", 2, 2)
            .do("Testing", (t) => {
                // This would tick up while on the way back to the computer, which isn't desirable.
                if (me().onTheClock && me().getTask() == null && me().taskTime == 0 && !me().moving) {
                    me().idleTime++;
                }
                if (me().lengthOfStay == 43200 || me().lengthOfStay == 86399) {
                //if (me().lengthOfStay == 21600 || me().lengthOfStay == 86399) {
                    let idleTimeMinutes = ((1440 * me().idleTime) / 86400);
                    idleTimeMinutes = Math.round((idleTimeMinutes + Number.EPSILON) * 100) / 100
                    //console.log("Resident Idle Time: " + me().idleTime + " ticks / " + idleTimeMinutes + " minutes in-simulation");
                    console.log(idleTimeMinutes);
                    me().idleTime = 0;
                    //me().lengthOfStay = 0;
                }
                me().lengthOfStay++;
                return fluentBehaviorTree.BehaviorTreeStatus.Running; 
            })
        // Consider limiting the rooms nurses can be assigned to tasks to
        // General Structure of New Trees: GO TO START -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH THE TASK FROM *LIST OF TASKS* AND TAKE TIME -> RESTART
        .sequence("Resident Behaviors")
            
            .do("Testing", (t) => {
                me().moving = true;
                return fluentBehaviorTree.BehaviorTreeStatus.Success;            
            })
            
            .splice(new GoTo(self.index, computer.location).tree)
            //.splice(new AssignBed(myIndex, Hospital.locations.find(l => l.name == "C1").location).tree)
            
            .do("Testing", (t) => {
                me().moving = false;
                return fluentBehaviorTree.BehaviorTreeStatus.Success;            
            })
            
            .splice(new AssignComputer(myIndex, computer.location).tree) // RESIDENT PLACE

            // QUEUEING FOLLOWING TASKS NEEDS TO COME LAST, OTHERWISE TASKS ARE BLITZED THROUGH TOO QUICKLY
            .do("Queue Tasks", (t) => {
                while (taskQueue.length > 0) {
                    switch(taskQueue[0].taskID) {
                        case "EKG Consult":
                            Hospital.residentTaskList.push(taskQueue.shift());
                            break;
                        case "EKG Order XRay":
                            Hospital.residentTaskList.push(taskQueue.shift());
                            break;
                        case "EKG Order CAT":
                            Hospital.residentTaskList.push(taskQueue.shift());
                            break;
                        case "Attending Consult":
                            Hospital.residentTaskList.push(taskQueue.shift());
                            break;
                        case "Patient Consult":
                            Hospital.residentTaskList.push(taskQueue.shift());
                            break;
                        case "Nurse Discharge Patient":
                            Hospital.nurseTaskList.push(taskQueue.shift());
                            break;
                        default: break;
                    }
                }

                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })

            // Add a behavior here or in the selector that will order the tasks (by severity)?
            .selector("Task List Tasks")
                .do("Get a Task", (t) => {
                    // CHECK IF NEEDED TO CLOCK IN
                    if (!me().onTheClock) {
                        me().onTheClock = true;
                        Hospital.activeResident.push(me());
                        if (Hospital.aTeam[1] == null) {
                            Hospital.aTeam[1] = me();
                        }

                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                    // CHECK IF NEEDED TO CLOCK OUT
                    else if (Hospital.activeResident.length > 4 && Hospital.activeResident[0] == me()) {
                        let clockOutTask = new task("Clock Out", null, null, null, entrance);
                        me().setTask(clockOutTask);
                        me().replacement = true;
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    // IF ALREADY ALLOCATED A TASK, CONTINUE
                    else if (me().getTask() != null) {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    // CHECK IF ANY TASKS ARE AVAILABLE, CONTINUE
                    else if (Hospital.residentTaskList.length != 0) {
                        me().setTask(Hospital.residentTaskList.shift());
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    // OTHERWISE DON'T PROCEED (SUCCESS WILL RESTART SELECTOR)
                    else {
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                // I think it has to be done this way because you can't do operations in a splice for the most part
                .inverter("Need to return failure")
                    .sequence("Go to Task")
                        .do("Determine Location", (t) => {
                            if (me().getTask().location != null) {
                                myGoal = me().getTask().location;
                            }
                            else {
                                myGoal = computer;
                            }
                            return fluentBehaviorTree.BehaviorTreeStatus.Success; 
                        })
                        // GoTo gives me problems sometimes that GoToLazy does not
                        .splice(new GoToLazy(self.index, () => myGoal.location).tree)
                    .end()
                .end()
                
                .do("Clock Out", (t) => {
                    if (me().getTask().taskID != "Clock Out") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        for(let i = 0; i < Hospital.computer.entries.length; i++) {
                            if (Hospital.computer.entries[i].getResident() == me()) {
                              Hospital.computer.entries[i].setResident(null);
                            }
                        }
                        if (Hospital.aTeam[1] == me()) {
                            Hospital.aTeam[1] = null;
                        }
                        Hospital.activeResident.shift();
                        
                        // TESTING
                        let idleTimeMinutes = ((1440 * me().idleTime) / 86400);
                        idleTimeMinutes = Math.round((idleTimeMinutes + Number.EPSILON) * 100) / 100
                        console.log("Resident Idle Time: " + me().idleTime + " ticks / " + idleTimeMinutes + " minutes in-simulation");
                        Hospital.residentData.push(me().idleTime);

                        me().inSimulation = false;
                        return fluentBehaviorTree.BehaviorTreeStatus.Running;
                    }
                })
                
                // THIS TASK IS GIVEN BY THE TECH
                .do("EKG Read", (t) => {
                    if (me().getTask().taskID != "EKG Read") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().taskTime = 60;
                        
                        let consultTask = new task("EKG Consult", null, null, me().getTask().patient, me().getTask().patient.getPermanentRoom());
                        taskQueue.push(consultTask);
                        //Hospital.residentTaskList.push(consultTask);
                        me().setTask(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                // THIS TASK IS GIVEN BY EKG READ
                .do("EKG Consult", (t) => {
                    if (me().getTask().taskID != "EKG Consult") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().taskTime = 60;
                        
                        // queue CAT or XRAY - THIS IS AN ARBITRARY DISTINCTION RIGHT NOW
                        if (me().getTask().patient.getSeverity() == "ESI3") {
                            let xrayTask = new task("EKG Order XRay", null, null, me().getTask().patient, me().getTask().location);
                            taskQueue.push(xrayTask);
                            //Hospital.residentTaskList.push(xrayTask);
                        }
                        else {
                            let catTask = new task("EKG Order CAT", null, null, me().getTask().patient, me().getTask().location);
                            taskQueue.push(catTask);
                            //Hospital.residentTaskList.push(catTask);
                        }

                        me().setTask(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                // THIS TASK IS GIVEN BY EKG CONSULT
                .do("EKG Order XRay", (t) => {
                    if (me().getTask().taskID != "EKG Order XRay") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().taskTime = 60;
                        
                        let myPatient = me().getTask().patient;
                        // if (myPatient.getSeverity() == "ESI1" && Hospital.CTQueue.length > 0 && Hospital.CTQueue[0].getSeverity() != "ESI1") {
                        //     Hospital.CTQueue.unshift(myPatient);
                        // }
                        // else if (myPatient.getSeverity() == "ESI1" && Hospital.CTQueue.length > 0 && Hospital.CTQueue[0].getSeverity() == "ESI1") {
                        //     let i = 0;
                        //     while (i < Hospital.CTQueue.length && Hospital.CTQueue[i].getSeverity() == "ESI1") {
                        //         i++;
                        //     }
                            
                        //     if (i == Hospital.CTQueue.length) {
                        //         Hospital.CTQueue.push(myPatient);
                        //     }
                        //     else {
                        //         Hospital.CTQueue.splice(i, 0, myPatient);
                        //     }
                        // }
                        //else {
                            Hospital.XRayQueue.push(myPatient);
                        //}
                        
                        me().setTask(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })  
                // THIS TASK IS GIVEN BY EKG CONSULT
                .do("EKG Order CAT", (t) => {
                    if (me().getTask().taskID != "EKG Order CAT") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().taskTime = 60;
                        
                        let myPatient = me().getTask().patient;
                        if (myPatient.getSeverity() == "ESI1" && Hospital.CTQueue.length > 0 && Hospital.CTQueue[0].getSeverity() != "ESI1") {
                            Hospital.CTQueue.unshift(myPatient);
                        }
                        else if (myPatient.getSeverity() == "ESI1" && Hospital.CTQueue.length > 0 && Hospital.CTQueue[0].getSeverity() == "ESI1") {
                            let i = 0;
                            while (i < Hospital.CTQueue.length && Hospital.CTQueue[i].getSeverity() == "ESI1") {
                                i++;
                            }
                            
                            if (i == Hospital.CTQueue.length) {
                                Hospital.CTQueue.push(myPatient);
                            }
                            else {
                                Hospital.CTQueue.splice(i, 0, myPatient);
                            }
                        }
                        else {
                            Hospital.CTQueue.push(myPatient);
                        }
                        
                        me().setTask(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                // THIS TASK IS GIVEN BY THE RADIOLOGIST   
                .do("Resident Scan Read", (t) => {
                    if (me().getTask().taskID != "Resident Scan Read") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().taskTime = 60;
                        
                        // GO TO THE ATTENDING NURSE
                        //let attending = Hospital.agents.find(a => a.name == "Attending").location;
                        //let attendingConsultTask = new task("Attending Consult", null, null, me().getTask().patient, attending);
                        let attending = Hospital.locations.find(l => l.name == "Fast Track 2");
                        let attendingConsultTask = new task("Attending Consult", null, null, me().getTask().patient, attending.location);
                        taskQueue.push(attendingConsultTask);
                        //Hospital.residentTaskList.push(attendingConsultTask);

                        me().setTask(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                // THIS TASK IS GIVEN BY SCAN READ
                .do("Attending Consult", (t) => {
                    if (me().getTask().taskID != "Attending Consult") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().taskTime = 60;
                        
                        let patientConsultTask = new task("Patient Consult", null, null, me().getTask().patient, me().getTask().patient.getPermanentRoom());
                        taskQueue.push(patientConsultTask);
                        //Hospital.residentTaskList.push(patientConsultTask);
                        me().setTask(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                // THIS TASK IS GIVEN BY ATTENDING CONSULT   
                .do("Patient Consult", (t) => {
                    if (me().getTask().taskID != "Patient Consult") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().taskTime = 60;
                        
                        let dischargeTask = new task("Nurse Discharge Patient", null, null, me().getTask().patient, me().getTask().location);
                        taskQueue.push(dischargeTask);
                        //Hospital.nurseTaskList.push(dischargeTask);
                        me().setTask(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })             
            .end()
            // IF SUCCEEDING IN TASK, TAKE TIME TO DO THAT TASK
            // TakeTime doesn't work in some instances, but the code itself works. For instance if you remove the next .end(), it will work, but then the sequence is broken.
            //.splice(new TakeTime(1000, 2000).tree)
            .do("Take Time", (t) => {
                while (me().taskTime > 0)
                {
                    me().taskTime = me().taskTime - 1;
                    return fluentBehaviorTree.BehaviorTreeStatus.Running;
                }
                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
        .end()
        .end()
        .build()
    }
  
    async update( crowd, msec) {
        await this.tree.tick({ crowd, msec }) //Call the behavior tree
    }
}

export default residentThesis;