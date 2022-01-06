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
        this.tree = builder

        // Consider limiting the rooms nurses can be assigned to tasks to
        // General Structure of New Trees: GO TO START -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH THE TASK FROM *LIST OF TASKS* AND TAKE TIME -> RESTART
        .sequence("Resident Behaviors")
            .splice(new GoTo(self.index, computer.location).tree)
            //.splice(new AssignBed(myIndex, Hospital.locations.find(l => l.name == "C1").location).tree)
            .splice(new AssignComputer(myIndex, computer.location).tree) // RESIDENT PLACE
            // Add a behavior here or in the selector that will order the tasks (by severity)?
            .selector("Task List Tasks")
                .do("Get a Task", (t) => {
                    // IF ALREADY ALLOCATED A TASK, CONTINUE
                    if (me().getTask() != null) {
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
                
                // .do("Clock In / Clock Out", (t) => {
                    // Could make this a spliced behavior that takes the agent as a parameter
                    //return fluentBehaviorTree.BehaviorTreeStatus.Success;
                // })
                
                // THIS TASK IS GIVEN BY THE TECH
                .do("EKG Read", (t) => {
                    if (me().getTask().taskID != "EKG Read") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        let consultTask = new task("EKG Consult", null, null, me().Task.patient, null);
                        Hospital.residentTaskList.push(consultTask);
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
                        // queue CAT or XRAY
                        let catTask = new task("EKG Order CAT", null, null, me().Task.patient, null);
                        Hospital.residentTaskList.push(catTask);
                        
                        //let xrayTask = new task("EKG Order XRay", null, null, me().Task.patient, null);
                        //Hospital.residentTaskList.push(xrayTask);

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
                .do("Scan Read", (t) => {
                    if (me().getTask().taskID != "Scan Read") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        let attendingConsultTask = new task("Attending Consult", null, null, me().Task.patient, null);
                        Hospital.residentTaskList.push(attendingConsultTask);

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
                        let patientConsultTask = new task("Patient Consult", null, null, me().Task.patient, null);
                        Hospital.residentTaskList.push(patientConsultTask);
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
                        let dischargeTask = new task("Nurse Discharge Patient", null, null, me().Task.patient, null);
                        Hospital.nurseTaskList.push(dischargeTask);
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

export default residentThesis;