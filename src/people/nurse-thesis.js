import AssignComputer from "../behavior/assign-computer.js"
import GoTo from "../behavior/go-to.js";
import GoToLazy from "../behavior/go-to-lazy.js";
import PatientTempState from "../support/patient-temp-state.js";
import TakeTime from "../behavior/take-time.js";
import task from "../support/task-thesis.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class nurseThesis {

    constructor(myIndex) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        this.toReturn = null;

        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
        
        let goToName = "NursePlace";
        let myGoal = Hospital.locations.find(l => l.name == goToName);
        let computer =  Hospital.locations.find(l => l.name == "NursePlace");
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
                    let idleTimeMinutes = ((1440 * me().idleTime) / 86400);
                    idleTimeMinutes = Math.round((idleTimeMinutes + Number.EPSILON) * 100) / 100
                    //console.log("Nurse Idle Time: " + me().idleTime + " ticks / " + idleTimeMinutes + " minutes in-simulation");
                    console.log(idleTimeMinutes);
                    me().idleTime = 0;
                    //me().lengthOfStay = 0;
                }
                me().lengthOfStay++;
                return fluentBehaviorTree.BehaviorTreeStatus.Running; 
            })
        // Consider limiting the rooms nurses can be assigned to tasks to
        // General Structure of New Trees: GO TO START -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH THE TASK FROM *LIST OF TASKS* AND TAKE TIME -> RESTART
        .sequence("Nurse Behaviors")
            
            .do("Testing", (t) => {
                me().moving = true;
                return fluentBehaviorTree.BehaviorTreeStatus.Success;            
            })

            .selector("Should I go back to start?")
                .condition("Do I have patient", async (t) => me().getBusy())
                .splice(new GoTo(self.index, computer.location).tree)
            .end()
            
            .do("Testing", (t) => {
                me().moving = false;
                return fluentBehaviorTree.BehaviorTreeStatus.Success;            
            })

            .splice(new AssignComputer(myIndex, computer.location).tree) // NURSE PLACE
            
            // Add a behavior here or in the selector that will order the tasks (by severity)?

            .do("Queue Tasks", (t) => {
                while (taskQueue.length > 0) {
                    switch(taskQueue[0].taskID) {
                        case "Take Blood":
                            Hospital.phlebotomistTaskList.push(taskQueue.shift());
                            break;
                        default: break;
                    }
                }

                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })

            .selector("Task List Tasks")
                .do("Get a Task", (t) => {
                    // CHECK IF NEEDED TO CLOCK IN
                    if (!me().onTheClock) {
                        me().onTheClock = true;
                        Hospital.activeNurse.push(me());
                        if (Hospital.aTeam[2] == null) {
                            Hospital.aTeam[2] = me();
                        }

                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                    // CHECK IF NEEDED TO CLOCK OUT
                    else if (Hospital.activeNurse.length > 8 && Hospital.activeNurse[0] == me()) {
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
                    else if (Hospital.nurseTaskList.length != 0) {
                        me().setTask(Hospital.nurseTaskList.shift());
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
                            if (Hospital.computer.entries[i].getNurse() == me()) {
                              Hospital.computer.entries[i].setNurse(null);
                            }
                        }
                        if (Hospital.aTeam[2] == me()) {
                            Hospital.aTeam[2] = null;
                        }
                        Hospital.activeNurse.shift();
                        
                        // TESTING
                        let idleTimeMinutes = ((1440 * me().idleTime) / 86400);
                        idleTimeMinutes = Math.round((idleTimeMinutes + Number.EPSILON) * 100) / 100
                        console.log("Nurse Idle Time: " + me().idleTime + " ticks / " + idleTimeMinutes + " minutes in-simulation");
                        Hospital.nurseData.push(me().idleTime);

                        me().inSimulation = false;
                        return fluentBehaviorTree.BehaviorTreeStatus.Running;
                    }
                })

                // THIS TASK IS GIVEN BY THE TRIAGE NURSE
                .do("Get Health Information", (t) => {
                    if (me().getTask().taskID != "Get Health Information") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().taskTime = 60;
                        
                        let patientEntry = Hospital.computer.getEntry(me().getTask().patient);
                        patientEntry.setAnsweredQuestions(true);
                        
                        // Queue Phlebotomist to take blood
                        let takeBlood = new task("Take Blood", null, null, me().getTask().patient, me().getTask().location);
                        taskQueue.push(takeBlood);
                        
                        me().setTask(null);

                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                // THIS TASK IS GIVEN BY THE RESIDENT
                .do("Nurse Discharge Patient", (t) => {
                    if (me().getTask().taskID != "Nurse Discharge Patient") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    let id = Hospital.agents[self.index].id;
                    let simulationAgent = t.crowd.find(f=>f.id == id);
                    let myLocation = new Vector3(simulationAgent.location.x, simulationAgent.location.y, simulationAgent.location.z);
                    let patientLoc = Vector3.fromObject(t.crowd.find(f=>f.id == me().getTask().patient.id).location);

                    if (myLocation.distanceToSquared(patientLoc) > 30 || me().getTask().patient.getPatientTempState() != PatientTempState.WAITING) {
                        return fluentBehaviorTree.BehaviorTreeStatus.Running;
                    }
                    else {
                        me().taskTime = 60;
                        me().setBusy(true);

                        let myPatient = me().getTask().patient;
                        myPatient.setInstructor(me());
                        myPatient.setPatientTempState(PatientTempState.FOLLOWING);
                        for (let i = 0; i < Hospital.emergencyQueue.length; i++) {
                            if (myPatient == Hospital.emergencyQueue[i]) {
                                Hospital.emergencyQueue.splice(i, 1);
                            }
                        }

                        let entrance =  Hospital.locations.find(l => l.name == "Main Entrance");
                        let escortTask = new task("Nurse Escort Patient To Exit", null, 0, myPatient, entrance);
                        me().setTask(escortTask);

                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                .do("Nurse Escort Patient To Exit", (t) => {
                    if (me().getTask().taskID != "Nurse Escort Patient To Exit") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        let myPatient = me().getTask().patient;
                        myPatient.setPatientTempState(PatientTempState.DONE);
                        for (let i = 0; i < Hospital.emergencyQueue.length; i++) {
                            if (myPatient == Hospital.emergencyQueue[i]) {
                                Hospital.emergencyQueue.splice(i, 1);
                            }
                        }
                        me().setTask(null);
                        me().setBusy(false);
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

    // NEED TO ALTER THIS
    checkEndOfSimulation() {
        if (self.Hospital.computer.entries.length > 0) {
            return self.Hospital.computer.entries[0].unacknowledged("NurseEscortPatientToExit");
            //let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
            //let exitTask = new task("Nurse Escort Patient To Exit", null, null, me().Task.patient, null);
            //return Hospital.nurseTaskList.push(exitTask);
        }
        return false;
    }
  
}

export default nurseThesis;