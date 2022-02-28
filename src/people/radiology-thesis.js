import AssignBed from "../behavior/assign-bed.js";
import AssignComputer from "../behavior/assign-computer.js"
import GoTo from "../behavior/go-to.js";
import GoToLazy from "../behavior/go-to-lazy.js";
import TakeTime from "../behavior/take-time.js";
import task from "../support/task-thesis.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class radiologyThesis {

    constructor(myIndex) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        this.toReturn = null;

        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
        
        let goToName = "CT 2";
        let myGoal = Hospital.locations.find(l => l.name == goToName);
        let computer = Hospital.locations.find(l => l.name == goToName);
        let entrance = Hospital.getLocationByName("Main Entrance");

        let taskQueue = [];

        this.tree = builder

        .parallel("Testing Parallel", 2, 2)
            .do("Testing", (t) => {
                // This would tick up while on the way back to the computer, which isn't desirable.
                if (me().onTheClock && me().getTask() == null && myGoal == computer) {
                    me().idleTime++;
                }
                return fluentBehaviorTree.BehaviorTreeStatus.Running; 
            })
        // General Structure of New Trees: GO TO START -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH THE TASK FROM *LIST OF TASKS* AND TAKE TIME -> RESTART
        .sequence("Radiology Behaviors")
            .splice(new GoTo(self.index, myGoal.location).tree)
            //.splice(new AssignBed(myIndex, Hospital.locations.find(l => l.name == "C1").location).tree)
            .splice(new AssignComputer(myIndex, myGoal.location).tree) // CT 2
            // Add a behavior here or in the selector that will order the tasks (by severity)?
            .selector("Task List Tasks")
                .do("Get a Task", (t) => {
                    // CHECK IF NEEDED TO CLOCK IN
                    if (!me().onTheClock) {
                        me().onTheClock = true;
                        Hospital.activeRadio.push(me());
                        
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                    // CHECK IF NEEDED TO CLOCK OUT
                    else if (Hospital.activeRadio.length > 1 && Hospital.activeRadio[0] == me()) {
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
                    else if (Hospital.radiologyTaskList.length != 0) {
                        me().setTask(Hospital.radiologyTaskList.shift());
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
                        Hospital.activeRadio.shift();
                        
                        // TESTING
                        console.log("Radiology Idle Time: " + me().idleTime + " ticks");
                        Hospital.radioData.push(me().idleTime);

                        me().inSimulation = false;
                        return fluentBehaviorTree.BehaviorTreeStatus.Running;
                    }
                })
                
                // THIS TASK IS GIVEN BY THE CT (CAT Do Scan Behavior)
                .do("Radiology Review Scan", (t) => {
                    if (me().getTask().taskID != "Radiology Review Scan") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().taskTime = 100;
                        
                        let residentScanTask = new task("Resident Scan Read", null, null, me().getTask().patient, null);
                        taskQueue.push(residentScanTask);
                        //Hospital.residentTaskList.push(residentScanTask);

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
                        case "Resident Scan Read":
                            Hospital.residentTaskList.push(taskQueue.shift());
                            break;
                        default: break;
                    }
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

export default radiologyThesis;