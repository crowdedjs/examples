import AssignBed from "../behavior/assign-bed.js";
import AssignComputer from "../behavior/assign-computer.js"
import GoTo from "../behavior/go-to.js";
import GoToLazy from "../behavior/go-to-lazy.js";
import TakeTime from "../behavior/take-time.js";
import task from "../support/task-thesis.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class phlebotomistThesis {

    constructor(myIndex) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        this.toReturn = null;

        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
        
        let goToName = "Tech Start";
        let myGoal = Hospital.locations.find(l => l.name == goToName);
        let computer =  Hospital.locations.find(l => l.name == "Tech Start");
        let entrance = Hospital.getLocationByName("Main Entrance");

        this.tree = builder

        .parallel("Testing Parallel", 2, 2)
            .do("Testing", (t) => {
                // This would tick up while on the way back to the computer, which isn't desirable.
                if (me().onTheClock && me().getTask() == null && me().taskTime == 0 && !me().moving) {
                    me().idleTime++;
                }
                if (me().lengthOfStay == 43200 || me().lengthOfStay == 86399) {
                    let idleTimeMinutes = ((1440 * me().idleTime) / 86400);
                    console.log("Phlebotomist Idle Time: " + me().idleTime + " ticks / " + idleTimeMinutes + " minutes in-simulation");
                    me().idleTime = 0;
                    //me().lengthOfStay = 0;
                }
                me().lengthOfStay++;
                return fluentBehaviorTree.BehaviorTreeStatus.Running; 
            })
        // Consider limiting the rooms nurses can be assigned to tasks to
        // General Structure of New Trees: GO TO START -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH THE TASK FROM *LIST OF TASKS* AND TAKE TIME -> RESTART
        .sequence("Phlebotomist Behaviors")
            
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

            .splice(new AssignComputer(myIndex, computer.location).tree) // TECH PLACE
            // Add a behavior here or in the selector that will order the tasks (by severity)?

            .selector("Task List Tasks")
                .do("Get a Task", (t) => {
                    // CHECK IF NEEDED TO CLOCK IN
                    if (!me().onTheClock) {
                        me().onTheClock = true;
                        Hospital.activePhleb.push(me());
                        if (Hospital.aTeam[4] == null) {
                            Hospital.aTeam[4] = me();
                        }

                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                    // CHECK IF NEEDED TO CLOCK OUT
                    else if (Hospital.activePhleb.length > 4 && Hospital.activePhleb[0] == me()) {
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
                    else if (Hospital.phlebotomistTaskList.length != 0) {
                        me().setTask(Hospital.phlebotomistTaskList.shift());
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
                            if (Hospital.computer.entries[i].getPhlebotomist() == me()) {
                              Hospital.computer.entries[i].setPhlebotomist(null);
                            }
                        }
                        if (Hospital.aTeam[4] == me()) {
                            Hospital.aTeam[4] = null;
                        }
                        Hospital.activePhleb.shift();
                        
                        // TESTING
                        let idleTimeMinutes = ((1440 * me().idleTime) / 86400);
                        console.log("Phlebotomist Idle Time: " + me().idleTime + " ticks / " + idleTimeMinutes + " minutes in-simulation");
                        Hospital.phlebData.push(me().idleTime);

                        me().inSimulation = false;
                        return fluentBehaviorTree.BehaviorTreeStatus.Running;
                    }
                })
                
                // THIS TASK IS GIVEN BY THE NURSE
                .do("Take Blood", (t) => {
                    if (me().getTask().taskID != "Take Blood") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().taskTime = 100;
                        Hospital.computer.getEntry(me().getTask().patient).setPhlebotomist(me());
                        Hospital.computer.getEntry(me().getTask().patient).setBlood("Drawn");
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
        .end()
        .build()
    }
  
    async update( crowd, msec) {
        await this.tree.tick({ crowd, msec }) //Call the behavior tree
    }
}

export default phlebotomistThesis;