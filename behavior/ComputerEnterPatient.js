import Computer from "../support/Computer.js";
import ComputerEntry from "../support/ComputerEntry.js";

class ComputerEnterPatient {
    constructor(agent, myIndex) {
        this.index = myIndex;
        let self = this;
        let me = agent;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Computer Enter Patient")
                .do("Enter Patient", (t) => {
                    let patient = me.CurrentPatient;
                    let entry = new ComputerEntry(patient, "Unknown")
                    
                    // need "this" ?
                    computer.add(entry);
                    computer.print();

                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }
    async update(agents, positions, msec) {
        await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
    }

}

export default ComputerEnterPatient;