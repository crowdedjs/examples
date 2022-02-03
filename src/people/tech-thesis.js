import AssignBed from "../behavior/assign-bed.js";
import AssignComputer from "../behavior/assign-computer.js"
import GoTo from "../behavior/go-to.js";
import GoToLazy from "../behavior/go-to-lazy.js";
import TakeTime from "../behavior/take-time.js";
import task from "../support/task-thesis.js";
import PatientTempState from "../support/patient-temp-state.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class techThesis {

    constructor(myIndex) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        this.toReturn = null;

        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
        
        let goToName = "TechPlace";
        let myGoal = Hospital.locations.find(l => l.name == goToName);
        let computer =  Hospital.locations.find(l => l.name == "TechPlace");

        let taskQueue = [];

        this.tree = builder

        // Consider limiting the rooms nurses can be assigned to tasks to
        // General Structure of New Trees: GO TO START -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH TASK FROM LIST -> TAKE TIME -> QUEUE TASKS -> RESTART
        .sequence("Tech Behaviors")
            .selector("Should I go back to start?")
                .condition("Do I have patient", async (t) => me().getBusy())
                .splice(new GoTo(self.index, computer.location).tree)
            .end()
            //.splice(new AssignBed(myIndex, Hospital.locations.find(l => l.name == "C1").location).tree)
            .splice(new AssignComputer(myIndex, computer.location).tree) // TECH PLACE
            
            // Add a behavior here or in the selector that will order the tasks (by severity)?
            
            .selector("Task List Tasks")
                .do("Get a Task", (t) => {
                    // IF ALREADY ALLOCATED A TASK, CONTINUE
                    if (me().getTask() != null) {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    // CHECK IF ANY TASKS ARE AVAILABLE, CONTINUE
                    else if (Hospital.techTaskList.length != 0) {
                        me().setTask(Hospital.techTaskList.shift());
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
                            if (me().getTask().taskID == "Pick Up Patient") {
                                myGoal = me().getTask().patient.getPermanentRoom();
                            }
                            else if (me().getTask().location != null) {
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
                
                // .do("Clock In / Clock Out", (t) => {
                    // Could make this a spliced behavior that takes the agent as a parameter
                    //return fluentBehaviorTree.BehaviorTreeStatus.Success;
                // })
                
                // THIS TASK IS GIVEN BY THE TRIAGE NURSE
                .do("Get Vitals", (t) => {
                    if (me().getTask().taskID != "Get Vitals") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().taskTime = 100;
                        
                        Hospital.computer.getEntry(me().getTask().patient).setVitals("Taken");
                        me().setTask(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                // THIS TASK IS GIVEN BY THE TRIAGE NURSE
                .do("Get EKG", (t) => {
                    if (me().getTask().taskID != "Get EKG") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().taskTime = 100;
                        
                        Hospital.computer.getEntry(me().getTask().patient).setEkg("EKG Results");
                        // CREATE TASK FOR THE RESIDENT : RESIDENT_EKG_READ
                        let readTask = new task("EKG Read", null, null, me().getTask().patient, null);
                        taskQueue.push(readTask);
                        //Hospital.residentTaskList.push(readTask);
                        me().setTask(null);

                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                // ESCORTING TO XRAY / CT IS QUEUED BY THE CT AND XRAY
                .do("Pick Up Patient", (t) => {
                    if (me().getTask().taskID != "Pick Up Patient") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        let myPatient = me().getTask().patient;
                        myPatient.setInstructor(me());
                        myPatient.setPatientTempState( PatientTempState.FOLLOWING);
                        Hospital.computer.getEntry(myPatient).setTech(me());
                        me().setBusy(true);

                        // NEED TO FIGURE OUT WHEN THEY WOULD GET ONE OVER THE OTHER
                        if (true) {
                            // NOW ESCORT THE PATIENT TO CT
                            let escortTask = new task("Escort Patient", null, 0, me().getTask().patient, me().getTask().location);
                            me().setTask(escortTask);

                            return fluentBehaviorTree.BehaviorTreeStatus.Success;
                        }
                        else {
                            // NOW ESCORT THE PATIENT TO XRAY
                            let escortTask = new task("Escort Patient", null, 0, me().getTask().patient, me().getTask().location);
                            me().setTask(escortTask);
                            return fluentBehaviorTree.BehaviorTreeStatus.Success;
                        }
                    }
                })
                // THIS TASK IS GIVEN BY THE CT / XRAY
                .do("CT/XRAY Pickup", (t) => {
                    if (me().getTask().taskID != "CT Pickup" && me().getTask().taskID != "XRay Pickup") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        let myPatient = me().getTask().patient;
                        myPatient.setInstructor(me());
                        myPatient.setPatientTempState(PatientTempState.FOLLOWING);
                        me().setBusy(true);
                        if (myPatient.getImagingRoom() == "CT 1") {
                            Hospital.setCT1Occupied(false);
                        }
                        else {
                            Hospital.setCT2Occupied(false);
                        }
                        
                        let escortTask = new task("Escort Patient", null, 0, me().getTask().patient, me().getTask().patient.getPermanentRoom());
                        me().setTask(escortTask);
                        
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                }) 
                // SECOND PART OF ESCORT TASKS: TAKING PATIENT TO WHERE THEY NEED TO BE
                .do("Escort Patient", (t) => {
                    if (me().getTask().taskID != "Escort Patient") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {                        
                        let myPatient = me().getTask().patient;
                        myPatient.setInstructor(null);
                        myPatient.setPatientTempState(PatientTempState.WAITING);
                        Hospital.computer.getEntry(myPatient).setTech(null);
                        
                        if (!me().getTask().patient.getScan()) {
                            // CT SCAN
                            let ctScanTask = new task("CAT Do Scan", null, 0, me().getTask().patient, null);
                            taskQueue.push(ctScanTask);
                            //Hospital.ctTaskList.push(ctScanTask);

                            // XRAY
                            //let xrayScanTask = new task("XRay Do Scan", null, 0, me().getTask().patient, null);
                            //Hospital.xrayTaskList.push(xrayScanTask);
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
                    me().taskTime == me().taskTime--;
                    return fluentBehaviorTree.BehaviorTreeStatus.Running;
                }

                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            // QUEUEING FOLLOWING TASKS NEEDS TO COME LAST, OTHERWISE TASKS ARE BLITZED THROUGH TOO QUICKLY
            .do("Queue Tasks", (t) => {
                while (taskQueue.length > 0) {
                    switch(taskQueue[0].taskID) {
                        case "EKG Read":
                            Hospital.residentTaskList.push(taskQueue.shift());
                            break;
                        case "CAT Do Scan":
                            Hospital.ctTaskList.push(taskQueue.shift());
                            break;
                        default: break;
                    }
                }

                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
        .end()
        .build()
    }
  
    async update( crowd, msec) {
        await this.tree.tick({ crowd, msec }) //Call the behavior tree
    }
}

export default techThesis;