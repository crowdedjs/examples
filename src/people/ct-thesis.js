import AssignBed from "../behavior/assign-bed.js";
import AssignComputer from "../behavior/assign-computer.js"
import GoTo from "../behavior/go-to.js";
import GoToLazy from "../behavior/go-to-lazy.js";
import TakeTime from "../behavior/take-time.js";
import task from "../support/task-thesis.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class ctThesis {

    constructor(myIndex) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        this.toReturn = null;

        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
        
        let goToName = "CT 1";
        if (myIndex % 2 == 1) {
            goToName = "CT 2";
        }

        let myGoal = Hospital.locations.find(l => l.name == goToName);
        let computer = Hospital.locations.find(l => l.name == goToName);
        let ct1 = Hospital.locations.find(l => l.name == "CT 1");
        let ct2 = Hospital.locations.find(l => l.name == "CT 2");
        if (!myGoal) throw new exception("We couldn't find a location called " + goToName);
        let entrance = Hospital.getLocationByName("Main Entrance");

        let taskQueue = [];
        
        this.tree = builder

        // Consider limiting the rooms nurses can be assigned to tasks to
        // General Structure of New Trees: GO TO START -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH THE TASK FROM *LIST OF TASKS* AND TAKE TIME -> RESTART
        .parallel("Testing Parallel", 2, 2)
            .do("Testing", (t) => {
                if (me().onTheClock && me().getTask() == null && me().taskTime == 0 && !me().moving) {
                    me().idleTime++;
                }
                if (me().lengthOfStay == 43200 || me().lengthOfStay == 86399) {
                    let idleTimeMinutes = ((1440 * me().idleTime) / 86400);
                    idleTimeMinutes = Math.round((idleTimeMinutes + Number.EPSILON) * 100) / 100
                    //console.log("CT Idle Time: " + me().idleTime + " ticks / " + idleTimeMinutes + " minutes in-simulation");
                    console.log(idleTimeMinutes);
                    me().idleTime = 0;
                    //me().lengthOfStay = 0;
                }
                me().lengthOfStay++;
                return fluentBehaviorTree.BehaviorTreeStatus.Running; 
            })
        .sequence("CT Behaviors")
            
            .do("Testing", (t) => {
                me().moving = true;
                return fluentBehaviorTree.BehaviorTreeStatus.Success;            
            })

            .splice(new GoTo(self.index, myGoal.location).tree)

            .do("Testing", (t) => {
                me().moving = false;
                return fluentBehaviorTree.BehaviorTreeStatus.Success;            
            })

            .splice(new AssignComputer(myIndex, computer.location).tree) // RESIDENT PLACE

            // QUEUEING FOLLOWING TASKS NEEDS TO COME LAST, OTHERWISE TASKS ARE BLITZED THROUGH TOO QUICKLY
            .do("Queue Tasks", (t) => {
                while (taskQueue.length > 0) {
                    switch(taskQueue[0].taskID) {
                        case "Pick Up Patient":
                            Hospital.techTaskList.push(taskQueue.shift());
                            break;
                        case "CT Pickup":
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

            // Add a behavior here or in the selector that will order the tasks (by severity)?
            .selector("Task List Tasks")
                // THIS TASK IS GIVEN BY THE CT TO THE TECH AND MUST BE DONE BEFORE GETTING A TASK
                // THE CT QUEUE IS FILLED BY THE RESIDENT
                .do("Queue Escort Patient", (t) => {
                    if (Hospital.CTQueue.length == 0 || (goToName == "CT 1" && Hospital.isCT1Occupied()) || (goToName == "CT 2" && Hospital.isCT2Occupied())) {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        // Pick Up Patient
                        let ctPatient = Hospital.CTQueue.shift();
                        let techEscortTask = new task("Pick Up Patient", ctPatient.getSeverity(), 0, ctPatient, myGoal);
                        if (goToName == "CT 1") {
                            Hospital.setCT1Occupied(true);
                            ctPatient.setImagingRoom("CT 1");
                            techEscortTask = new task("Pick Up Patient", ctPatient.getSeverity(), 0, ctPatient, ct1);
                        }
                        else if (goToName == "CT 2") {
                            Hospital.setCT2Occupied(true);
                            ctPatient.setImagingRoom("CT 2");
                            techEscortTask = new task("Pick Up Patient", ctPatient.getSeverity(), 0, ctPatient, ct2);
                        }
                        //Hospital.techTaskList.push(techEscortTask);
                        taskQueue.push(techEscortTask);
                    }

                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
                })

                .do("Get a Task", (t) => {
                    // CHECK IF NEEDED TO CLOCK IN
                    if (!me().onTheClock) {
                        me().onTheClock = true;
                        Hospital.activeCT.push(me());

                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                    // CHECK IF NEEDED TO CLOCK OUT
                    else if (Hospital.activeCT.length > 2 && Hospital.activeCT[0] == me()) {
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
                    else if (Hospital.ctTaskList.length != 0) {
                        me().setTask(Hospital.ctTaskList.shift());
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
                                //myGoal = Hospital.locations.find(l => l.name == goToName);
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
                        Hospital.activeCT.shift();
                        me().inSimulation = false;
                        return fluentBehaviorTree.BehaviorTreeStatus.Running;
                    }
                })
                
                //THIS TASK IS GIVEN BY THE TECH  
                .do("CAT Do Scan", (t) => {
                    if (me().getTask().taskID != "CAT Do Scan") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        // 30 minutes = 1800 ticks
                        //me().taskTime = 1800;
                        me().taskTime = 60;
                        me().getTask().patient.setScan(true);
                        me().getTask().patient.waitInScanRoom = true;
                        let ctPickupTask = new task("CT Pickup", null, 0, me().getTask().patient, myGoal);
                        if (me().getTask().patient.getImagingRoom() == "CT 1") {
                            ctPickupTask = new task("CT Pickup", null, 0, me().getTask().patient, ct1);

                        }
                        else {
                            ctPickupTask = new task("CT Pickup", null, 0, me().getTask().patient, ct2);
                        }
                        taskQueue.push(ctPickupTask);
                        //Hospital.techTaskList.push(ctPickupTask);

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

export default ctThesis;