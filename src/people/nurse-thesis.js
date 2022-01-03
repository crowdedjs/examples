import GoTo from "../behavior/go-to.js";
import GoToLazy from "../behavior/go-to-lazy.js";
import AssignComputer from "../behavior/assign-computer.js"
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
        this.tree = builder

        // Consider limiting the rooms nurses can be assigned to tasks to
        // General Structure of New Trees: GO TO START -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH THE TASK FROM *LIST OF TASKS* AND TAKE TIME -> RESTART
        .sequence("Nurse Behaviors")
            .splice(new GoTo(self.index, computer.location).tree)
            .splice(new AssignComputer(myIndex, computer.location).tree) // NURSE PLACE
            .selector("Task List Tasks")
                .do("Get a Task", (t) => {
                    // IF ALREADY ALLOCATED A TASK, CONTINUE
                    if (me().getTask() != null) {
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
                .do("Get Health Information", (t) => {
                    if (me().getTask().taskID != "Get Health Information") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        let patientEntry = Hospital.computer.getEntry(me().getTask().patient);
                        patientEntry.setAnsweredQuestions(true);
                        me().setTask(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                // THIS TASK IS GIVEN BY ?? (probably tech that escorts patient back from CT)
                .do("Nurse Discharge Patient", (t) => {
                    if (me().getTask().taskID != "Nurse Discharge Patient") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        let dischargeTask = new task("Nurse Escort Patient To Exit", null, null, me().Task.patient, null);
                        Hospital.nurseTaskList.push(dischargeTask);
                        // Could just change task to escorting to exit immediately
                        //me().Task(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                // THIS TASK IS GIVEN BY THE PREVIOUS TASK
                // need to code this still
                .do("Nurse Escort Patient To Exit", (t) => {
                    if (me().getTask().taskID != "Nurse Escort Patient To Exit") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        
                        me().setTask(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
            .end()
            // IF SUCCEEDING IN TASK, TAKE TIME TO DO THAT TASK
            // Need to fix TakeTime
            .splice(new TakeTime(300, 600).tree)
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
        }
        return false;
    }
  
}

export default nurseThesis;