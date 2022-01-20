import AssignBed from "../behavior/assign-bed.js";
import AssignComputer from "../behavior/assign-computer.js"
import GoTo from "../behavior/go-to.js";
import GoToLazy from "../behavior/go-to-lazy.js";
import TakeTime from "../behavior/take-time.js";
import task from "../support/task-thesis.js";
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
        this.tree = builder

        // Consider limiting the rooms nurses can be assigned to tasks to
        // General Structure of New Trees: GO TO START -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH THE TASK FROM *LIST OF TASKS* AND TAKE TIME -> RESTART
        .sequence("Tech Behaviors")
            .splice(new GoTo(self.index, computer.location).tree)
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
                        Hospital.computer.getEntry(me().getTask().patient).setEkg("EKG Results");
                        me().setTask(null);
                        // CREATE TASK FOR THE RESIDENT : RESIDENT_EKG_READ
                        let readTask = new task("EKG Read", null, null, me().Task.patient, null);
                        Hospital.residentTaskList.push(readTask);

                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                // ESCORTING TO XRAY / CT IS QUEUED BY THE CT AND XRAY
                // THIS IS A 2-PART TASK, THEY GO TO THE PATIENT, THEN THEY ESCORT THE PATIENT TO THE CT OR XRAY
                .do("Pick Up Patient", (t) => {
                    if (me().getTask().taskID != "Pick Up Patient") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        let myPatient = me().Task.patient;
                        myPatient.setInstructor(me());
                        myPatient.setPatientTempState( PatientTempState.FOLLOWING);

                        // NEED TO FIGURE OUT WHEN THEY WOULD GET ONE OVER THE OTHER
                        if (true) {
                            // CT SCAN
                            let ctScanTask = new task("CAT Do Scan", null, 0, me().Task.patient, null);
                            Hospital.ctTaskList.push(ctScanTask);

                            // NOW ESCORT THE PATIENT
                            let escortTask = new task("Escort Patient", null, 0, me().Task.patient, me().Task.location);
                            me().setTask(escortTask);
                            return fluentBehaviorTree.BehaviorTreeStatus.Success;
                        }
                        else {
                            // XRAY
                            let xrayScanTask = new task("XRay Do Scan", null, 0, me().Task.patient, null);
                            Hospital.xrayTaskList.push(xrayScanTask);

                            // NOW ESCORT THE PATIENT
                            let escortTask = new task("Escort Patient", null, 0, me().Task.patient, me().Task.location);
                            me().setTask(escortTask);
                            return fluentBehaviorTree.BehaviorTreeStatus.Success;
                        }
                    }
                })
                .do("Escort Patient", (t) => {
                    if (me().getTask().taskID != "Escort Patient") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        patient.setInstructor(null);
                        patient.setPatientTempState(PatientTempState.WAITING);

                        me().setTask(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                }) 

                // THIS TASK IS GIVEN BY THE CT / XRAY
                .do("CT/XRAY Pickup", (t) => {
                    if (me().getTask().taskID != "CT Pickup" && me().getTask().taskID != "XRay Pickup") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        patient.setInstructor(me());
                        patient.setPatientTempState(PatientTempState.FOLLOWING);
                        
                        let escortTask = new task("Escort Patient", null, 0, me().Task.patient, me().Task.patient.getPermanentRoom());
                        me().setTask(escortTask);
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
        .end()
        .build()
    }
  
    async update( crowd, msec) {
        await this.tree.tick({ crowd, msec }) //Call the behavior tree
    }
}

export default techThesis;