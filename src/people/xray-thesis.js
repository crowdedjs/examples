import AssignBed from "../behavior/assign-bed.js";
import AssignComputer from "../behavior/assign-computer.js"
import GoTo from "../behavior/go-to.js";
import GoToLazy from "../behavior/go-to-lazy.js";
import TakeTime from "../behavior/take-time.js";
import task from "../support/task-thesis.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class xrayThesis {

    constructor(myIndex) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        this.toReturn = null;

        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
        
        let goToName = "XRay 1";
        if (myIndex % 2 == 1) {
            goToName = "XRay 2";
        }

        let myGoal = Hospital.locations.find(l => l.name == goToName);
        let computer = Hospital.locations.find(l => l.name == goToName);
        let xray1 = Hospital.locations.find(l => l.name == "XRay 1");
        let xray2 = Hospital.locations.find(l => l.name == "XRay 2");
        if (!myGoal) throw new exception("We couldn't find a location called " + goToName);
        
        let taskQueue = [];
        
        this.tree = builder

        // Consider limiting the rooms nurses can be assigned to tasks to
        // General Structure of New Trees: GO TO START -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH THE TASK FROM *LIST OF TASKS* AND TAKE TIME -> RESTART
        .sequence("XRay Behaviors")
            .splice(new GoTo(self.index, myGoal.location).tree)

            .splice(new AssignComputer(myIndex, myGoal.location).tree) // RESIDENT PLACE
            // Add a behavior here or in the selector that will order the tasks (by severity)?
            .selector("Task List Tasks")
                // THIS TASK IS GIVEN BY THE XRAY TO THE TECH AND MUST BE DONE BEFORE GETTING A TASK
                // THE XRAY QUEUE IS FILLED BY THE RESIDENT
                .do("Queue Escort Patient", (t) => {
                    if (Hospital.XRayQueue.length == 0 || (goToName == "XRay 1" && Hospital.isXRay1Occupied()) || (goToName == "XRay 2" && Hospital.isXRay2Occupied())) {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        // Pick Up Patient
                        let xrayPatient = Hospital.XRayQueue.shift();
                        let techEscortTask = new task("Pick Up Patient", xrayPatient.getSeverity(), 0, xrayPatient, myGoal);
                        if (goToName == "XRay 1") {
                            Hospital.setXRay1Occupied(true);
                            xrayPatient.setImagingRoom("XRay 1");
                            techEscortTask = new task("Pick Up Patient", xrayPatient.getSeverity(), 0, xrayPatient, xray1);
                        }
                        else if (goToName == "XRay 2") {
                            Hospital.setXRay2Occupied(true);
                            xrayPatient.setImagingRoom("XRay 2");
                            techEscortTask = new task("Pick Up Patient", xrayPatient.getSeverity(), 0, xrayPatient, xray2);
                        }
                        Hospital.techTaskList.push(techEscortTask);
                    }

                    return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                })

                .do("Get a Task", (t) => {
                    // IF ALREADY ALLOCATED A TASK, CONTINUE
                    if (me().getTask() != null) {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    // CHECK IF ANY TASKS ARE AVAILABLE, CONTINUE
                    else if (Hospital.xrayTaskList.length != 0) {
                        me().setTask(Hospital.xrayTaskList.shift());
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    // OTHERWISE DON'T PROCEED (SUCCESS WILL RESTART SELECTOR)
                    else {
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                
                .inverter("Need to return failure")
                    .sequence("Go to Task")
                        .do("Determine Location", (t) => {
                            if (me().getTask().location != null) {
                                myGoal = me().getTask().location;
                            }
                            else {
                                myGoal = Hospital.locations.find(l => l.name == goToName);
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
                
                //THIS TASK IS GIVEN BY THE TECH  
                .do("XRay Do Scan", (t) => {
                    if (me().getTask().taskID != "XRay Do Scan") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().taskTime = 100;
                        me().getTask().patient.setScan(true);
                        let xrayPickupTask = new task("XRay Pickup", null, 0, me().getTask().patient, myGoal);
                        if (me().getTask().patient.getImagingRoom() == "XRay 1") {
                            xrayPickupTask = new task("XRay Pickup", null, 0, me().getTask().patient, xray1);

                        }
                        else {
                            xrayPickupTask = new task("XRay Pickup", null, 0, me().getTask().patient, xray2);
                        }
                        taskQueue.push(xrayPickupTask);
                        //Hospital.techTaskList.push(xrayPickupTask);

                        let radiologyReviewTask = new task("Radiology Review Scan", null, 0, me().getTask().patient, null);
                        taskQueue.push(radiologyReviewTask);
                        //Hospital.radiologyTaskList.push(radiologyReviewTask);
                        
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
            // QUEUEING FOLLOWING TASKS NEEDS TO COME LAST, OTHERWISE TASKS ARE BLITZED THROUGH TOO QUICKLY
            .do("Queue Tasks", (t) => {
                while (taskQueue.length > 0) {
                    switch(taskQueue[0].taskID) {
                        case "XRay Pickup":
                            Hospital.techTaskList.push(taskQueue.shift());
                            break;
                        case "Radiology Review Scan":
                            Hospital.radiologyTaskList.push(taskQueue.shift());
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

export default xrayThesis;