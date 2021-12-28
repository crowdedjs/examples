import GoTo from "../behavior/go-to.js";
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
        .sequence("Nurse Behaviors")
            .splice(new GoTo(self.index, myGoal.location).tree)
            .splice(new AssignComputer(myIndex, computer.location).tree) // NURSE PLACE
            .selector("Task List Tasks")
                .do("Get a Task", (t) => {
                    if (Hospital.nurseTaskList.length == 0) {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        me().Task(Hospital.nurseTaskList.shift());
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                // .do("Clock In / Clock Out", (t) => {
                    // Could make this a spliced behavior that takes the agent as a parameter
                    //return fluentBehaviorTree.BehaviorTreeStatus.Success;
                // })
                .do("Get Health Information", (t) => {
                    if (me().Task.taskID != "Get Health Information") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        let patientEntry = Hospital.computer.getEntry(me().Task.patient);
                        patientEntry.setAnsweredQuestions(true);
                        me().Task(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
                .do("Nurse Discharge Patient", (t) => {
                    if (me().Task.taskID != "Nurse Discharge Patient") {
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
                .do("Nurse Escort Patient To Exit", (t) => {
                    if (me().Task.taskID != "Nurse Escort Patient To Exit") {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }
                    else {
                        
                        me().Task(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
                })
            .end()
            // If success in finding and accomplishing task, take time to do that task
            .splice(new TakeTime(300, 600).tree)
            .end()
        .build()
    }
  
    async update( crowd, msec) {
        await this.tree.tick({ crowd, msec }) //Call the behavior tree
    }

    // checkEndOfSimulation() {
    //     if (self.Hospital.computer.entries.length > 0) {
    //     return self.Hospital.computer.entries[0].unacknowledged("NurseEscortPatientToExit");
    //     }
    //     return false;
    // }
  
}

export default nurseThesis;